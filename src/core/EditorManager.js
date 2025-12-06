import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, placeholder, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, undo, redo, insertTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { snippet, autocompletion } from "@codemirror/autocomplete";
import { vim, Vim } from "@replit/codemirror-vim";
import { syntaxHighlighting, foldGutter, codeFolding, foldKeymap } from "@codemirror/language";
import { medicalLightTheme, medicalDarkTheme, HighlightStyles } from "../config/themes";

export class EditorManager extends EventTarget {
  constructor({ storageKey = "med_editor_content", snippetManager } = {}) {
    super();
    this.storageKey = storageKey;
    this.view = null;
    this.snippetManager = snippetManager;
    
    // Compartments para reconfiguração dinâmica
    this.themeConfig = new Compartment();
    this.vimConfig = new Compartment();
    this.keymapConfig = new Compartment();
    this.highlightCompartment = new Compartment();

    // Controle de Debounce
    this.saveTimeout = null;
  }

  mount(parent) {
    // 1. Sanitização: Try/Catch no localStorage para evitar crash em modo anônimo
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

    const baseExtensions = [
      this.keymapConfig.of(keymap.of([ {
          key: "Tab",
          preventDefault: true,
          run: insertTab,
        },
        ...defaultKeymap, ...historyKeymap, ...foldKeymap])),
      history(),
      drawSelection(),
      foldGutter({
        markerDOM: (open) => {
          // Otimização: Criação de DOM segura (já estava bom, mantido)
          const span = document.createElement("span");
          span.className = `gutter-fold-icon ${open ? "open" : "closed"}`;
          
          // SVG inline simplificado para leitura
          span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
          return span;
        }
      }),
      codeFolding(),
      placeholder("Comece a digitar ou use 'soap' + enter..."),
      markdown({ base: markdownLanguage }),
      EditorView.lineWrapping,
      autocompletion({ override: [this.snippetManager ? this.snippetManager.completionSource.bind(this.snippetManager) : null].filter(Boolean) }),
      this.highlightCompartment.of(syntaxHighlighting(isDark ? HighlightStyles.dark : HighlightStyles.light)),
      this.vimConfig.of(useVim ? vim() : [])
    ];

    baseExtensions.push(this.themeConfig.of(isDark ? medicalDarkTheme : medicalLightTheme));

    const state = EditorState.create({ doc: savedContent, extensions: baseExtensions });

    this.view = new EditorView({
      state,
      parent,
      dispatch: (tr) => {
        // Verifica se a view ainda existe antes de atualizar
        if (!this.view) return; 
        
        this.view.update([tr]);
        if (tr.docChanged) this.onDocChange();
        if (tr.selection) this.onSelectionChange();
      }
    });
    this.configureVim(); 

    this.view.focus();
  }

  onDocChange() {
    const val = this.view.state.doc.toString();
    
    const ev = new CustomEvent("doc-change", { detail: { content: val, length: val.length } });
    this.dispatchEvent(ev);

       this.dispatchEvent(new CustomEvent("save-status", { detail: { status: "saving" } }));

    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(this.storageKey, val);
        
        this.dispatchEvent(new CustomEvent("save-status", { detail: { status: "saved" } }));
        
      } catch (e) {
        console.warn("Falha ao salvar", e);
        this.dispatchEvent(new CustomEvent("save-status", { detail: { status: "error" } }));
      }
    }, 1000); 
  }

  onSelectionChange() {
    const line = this.view.state.doc.lineAt(this.view.state.selection.main.head).number;
    const ev = new CustomEvent("selection-change", { detail: { line } });
    this.dispatchEvent(ev);
  }

  setTheme(isDark) {
    if (!this.view) return;
    const theme = isDark ? medicalDarkTheme : medicalLightTheme;
    const style = isDark ? HighlightStyles.dark : HighlightStyles.light;
    this.view.dispatch({ effects: [this.themeConfig.reconfigure(theme), this.highlightCompartment.reconfigure(syntaxHighlighting(style))] });
  }

  toggleVim(enabled) {
    if (!this.view) return;
    this.view.dispatch({ effects: this.vimConfig.reconfigure(enabled ? vim() : []) });
  }

  insertSnippet(content) {
    if (!this.view) return;
    const pos = this.view.state.selection.main.head;
    // Otimização: Remove seleção antes de inserir para evitar comportamentos estranhos
    const transaction = {
        changes: { from: this.view.state.selection.main.from, to: this.view.state.selection.main.to, insert: "" }
    };
    this.view.dispatch(transaction);

    try {
      const fn = snippet(content);
      fn(this.view, { label: "snippet" }, pos, pos);
    } catch (_) {
      // Fallback seguro
      this.view.dispatch({ changes: { from: pos, insert: content } });
    }
    this.view.focus();
  }

  insertDate() {
    if (!this.view) return;
    const now = new Date();
    const str = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " - ";
    const range = this.view.state.selection.main;
    this.view.dispatch({ changes: { from: range.from, to: range.to, insert: str } });
    this.view.focus();
  }

  toggleCase() {
    if (!this.view) return;
    const sel = this.view.state.selection.main;
    if (sel.empty) return;
    
    const text = this.view.state.doc.sliceString(sel.from, sel.to);
    let newText;
    
    // Lógica simplificada e mais robusta
    if (text === text.toUpperCase()) newText = text.toLowerCase();
    else if (text === text.toLowerCase()) newText = text.replace(/\b\w/g, l => l.toUpperCase()); // Title Case
    else newText = text.toUpperCase();

    this.view.dispatch({ changes: { from: sel.from, to: sel.to, insert: newText } });
    this.view.focus();
  }

  clear() {
    if (!this.view) return;
    this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: "" } });
    this.view.focus();
  }

  getContent() {
    return this.view ? this.view.state.doc.toString() : "";
  }

  setContent(text) {
    if (!this.view) return;
    this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: text } });
    this.view.focus();
  }

  requestMeasure() {
    if (this.view) this.view.requestMeasure();
  }

  undo() { if (this.view) { undo(this.view); this.view.focus(); } }
  redo() { if (this.view) { redo(this.view); this.view.focus(); } }

  // 3. Sanitização: Método vital para limpeza de memória
  destroy() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
  configureVim() {
    Vim.map("jj", "<Esc>", "insert");
    Vim.map("H", "^", "normal");
    Vim.map("L", "$", "normal");
    Vim.map("Y", "y$", "normal");
    Vim.map("<", "<gv", "visual");
    Vim.map(">", ">gv", "visual");
    Vim.map("U", "<C-r>", "normal");
  }
}