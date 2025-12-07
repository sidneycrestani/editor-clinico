import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  placeholder,
  drawSelection,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  undo,
  redo,
} from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { snippet, autocompletion } from "@codemirror/autocomplete";
import {
  syntaxHighlighting,
  foldGutter,
  codeFolding,
  foldKeymap,
} from "@codemirror/language";
import {
  medicalLightTheme,
  medicalDarkTheme,
  HighlightStyles,
} from "../config/themes";

export class EditorManager extends EventTarget {
  constructor({ storageKey = "med_editor_content", snippetManager } = {}) {
    super();
    this.storageKey = storageKey;
    this.view = null;
    this.snippetManager = snippetManager;
    this.vimExtension = null;

    this.themeConfig = new Compartment();
    this.vimConfig = new Compartment();
    this.keymapConfig = new Compartment();
    this.highlightCompartment = new Compartment();

    this.saveTimeout = null;
  }

  mount(parent) {
    let savedContent = "";
    let useVim = false;
    let isDark = false;

    try {
      savedContent = localStorage.getItem(this.storageKey) || "";
      useVim = localStorage.getItem("med_editor_vim") === "true";
      isDark = localStorage.getItem("med_editor_theme") === "dark";
    } catch (e) {
      console.warn("Erro ao acessar localStorage:", e);
    }

    const state = EditorState.create({
      doc: savedContent,
      extensions: this.getExtensions(isDark),
    });

    this.view = new EditorView({
      state,
      parent,
      dispatch: (tr) => {
        if (!this.view) return;

        this.view.update([tr]);
        if (tr.docChanged) this.onDocChange();
        if (tr.selection) this.onSelectionChange();
      },
    });
    if (useVim) this.toggleVim(true);

    this.view.focus();
  }

  getExtensions(isDark) {
    const insertTab = (view) => {
      view.dispatch(view.state.replaceSelection("\t"));
      return true;
    };
    const exts = [
      this.keymapConfig.of(
        keymap.of([
          { key: "Tab", preventDefault: true, run: insertTab },
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
        ])
      ),
      history(),
      drawSelection(),
      foldGutter({
        markerDOM: (open) => {
          const span = document.createElement("span");
          span.className = `gutter-fold-icon ${open ? "open" : "closed"}`;
          span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
          return span;
        },
      }),
      codeFolding(),
      placeholder("Comece a digitar ou use 'soap' + enter..."),
      markdown({ base: markdownLanguage }),
      EditorView.lineWrapping,
      autocompletion({
        override: [
          this.snippetManager
            ? this.snippetManager.completionSource.bind(this.snippetManager)
            : null,
        ].filter(Boolean),
      }),
      this.highlightCompartment.of(
        syntaxHighlighting(
          isDark ? HighlightStyles.dark : HighlightStyles.light
        )
      ),
      this.vimConfig.of([]),
      this.themeConfig.of(isDark ? medicalDarkTheme : medicalLightTheme),
    ];
    return exts;
  }

  onDocChange() {
    const val = this.view.state.doc.toString();

    const ev = new CustomEvent("doc-change", {
      detail: { content: val, length: val.length },
    });
    this.dispatchEvent(ev);

    this.dispatchEvent(
      new CustomEvent("save-status", { detail: { status: "saving" } })
    );

    if (this.saveTimeout) clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(this.storageKey, val);

        this.dispatchEvent(
          new CustomEvent("save-status", { detail: { status: "saved" } })
        );
      } catch (e) {
        console.warn("Falha ao salvar", e);
        this.dispatchEvent(
          new CustomEvent("save-status", { detail: { status: "error" } })
        );
      }
    }, 1000);
  }

  onSelectionChange() {
    const line = this.view.state.doc.lineAt(
      this.view.state.selection.main.head
    ).number;
    const ev = new CustomEvent("selection-change", { detail: { line } });
    this.dispatchEvent(ev);
  }

  setTheme(isDark) {
    if (!this.view) return;
    const theme = isDark ? medicalDarkTheme : medicalLightTheme;
    const style = isDark ? HighlightStyles.dark : HighlightStyles.light;
    this.view.dispatch({
      effects: [
        this.themeConfig.reconfigure(theme),
        this.highlightCompartment.reconfigure(syntaxHighlighting(style)),
      ],
    });
  }

  async toggleVim(enabled) {
    if (!this.view) return;
    if (enabled) {
      await this.loadVimDynamic();
      this.view.dispatch({
        effects: this.vimConfig.reconfigure(this.vimExtension),
      });
    } else {
      this.view.dispatch({ effects: this.vimConfig.reconfigure([]) });
    }
  }

  async loadVimDynamic() {
    if (!this.vimExtension) {
      try {
        const { vim, Vim } = await import("@replit/codemirror-vim");
        this.vimExtension = vim();
        this.configureVim(Vim);
      } catch {
        return;
      }
    }
    return this.vimExtension;
  }

  insertSnippet(content) {
    if (!this.view) return;
    const pos = this.view.state.selection.main.head;
    const transaction = {
      changes: {
        from: this.view.state.selection.main.from,
        to: this.view.state.selection.main.to,
        insert: "",
      },
    };
    this.view.dispatch(transaction);

    try {
      const fn = snippet(content);
      fn(this.view, { label: "snippet" }, pos, pos);
    } catch {
      this.view.dispatch({ changes: { from: pos, insert: content } });
    }
    this.view.focus();
  }

  insertDate() {
    if (!this.view) return;
    const now = new Date();
    const str =
      now.toLocaleDateString("pt-BR") +
      " " +
      now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) +
      " - ";
    const range = this.view.state.selection.main;
    this.view.dispatch({
      changes: { from: range.from, to: range.to, insert: str },
      selection: { anchor: range.from + str.length },
    });
    this.view.focus();
  }

  toggleCase() {
    if (!this.view) return;
    const sel = this.view.state.selection.main;

    let from = sel.from;
    let to = sel.to;

    if (sel.empty) {
      from = 0;
      to = this.view.state.doc.length;
    }

    if (from === to) return;

    const text = this.view.state.doc.sliceString(from, to);
    let newText;

    const isUpperCase =
      text === text.toUpperCase() && text !== text.toLowerCase();
    const isLowerCase = text === text.toLowerCase();

    if (isUpperCase) {
      newText = text.toLowerCase();
    } else if (isLowerCase) {
      newText = text.replace(/(^|[^\p{L}])\p{L}/gu, (match) =>
        match.toUpperCase()
      );
    } else {
      newText = text.toUpperCase();
    }

    this.view.dispatch({
      changes: { from: from, to: to, insert: newText },
      selection: !sel.empty
        ? { anchor: from, head: from + newText.length }
        : undefined,
    });

    this.view.focus();
  }

  clear() {
    if (!this.view) return;
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: "" },
    });
    this.view.focus();
  }

  reset() {
    if (!this.view) return;
    const isDark = document.body.classList.contains("dark-mode");
    const newState = EditorState.create({
      doc: "",
      extensions: this.getExtensions(isDark),
    });
    this.view.setState(newState);
    try {
      if (localStorage.getItem("med_editor_vim") === "true")
        this.toggleVim(true);
    } catch (e) {
      console.warn("Erro ao acessar localStorage:", e);
    }
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Erro ao limpar:", e);
    }
    this.view.focus();
    this.onDocChange();
  }

  getContent() {
    return this.view ? this.view.state.doc.toString() : "";
  }

  setContent(text) {
    if (!this.view) return;
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: text },
    });
    this.view.focus();
  }

  requestMeasure() {
    if (this.view) this.view.requestMeasure();
  }

  undo() {
    if (this.view) {
      undo(this.view);
      this.view.focus();
    }
  }
  redo() {
    if (this.view) {
      redo(this.view);
      this.view.focus();
    }
  }

  destroy() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
  configureVim(VimInstance) {
    if (!VimInstance) return;
    VimInstance.map("jj", "<Esc>", "insert");
    VimInstance.map("H", "^", "normal");
    VimInstance.map("L", "$", "normal");
    VimInstance.map("Y", "y$", "normal");
    VimInstance.map("<", "<gv", "visual");
    VimInstance.map(">", ">gv", "visual");
    VimInstance.map("U", "<C-r>", "normal");
  }
}
