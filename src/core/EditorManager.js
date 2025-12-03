import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { snippet, autocompletion } from "@codemirror/autocomplete";
import { vim } from "@replit/codemirror-vim";
import { syntaxHighlighting, foldGutter, codeFolding, foldKeymap} from "@codemirror/language";
import { medicalLightTheme, medicalDarkTheme, HighlightStyles } from "../config/themes";

export class EditorManager extends EventTarget {
  constructor({ storageKey = "med_editor_content", snippetManager } = {}) {
    super();
    this.storageKey = storageKey;
    this.view = null;
    this.snippetManager = snippetManager;
    this.themeConfig = new Compartment();
    this.vimConfig = new Compartment();
    this.keymapConfig = new Compartment();
    this.highlightCompartment = new Compartment();
  }

  mount(parent) {
    const savedContent = localStorage.getItem(this.storageKey) || "";
    const useVim = localStorage.getItem("med_editor_vim") === "true";
    const isDark = localStorage.getItem("med_editor_theme") === "dark";

    const baseExtensions = [
      this.keymapConfig.of(keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap, ...foldKeymap])),
      history(),
      // highlightActiveLineGutter(),
    foldGutter({
      markerDOM: (open) => {
        const span = document.createElement("span");
        span.className = `gutter-fold-icon ${open ? "open" : "closed"}`;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        const polyline = document.createElementNS(svgNS, "polyline");
        polyline.setAttribute("points", "6 9 12 15 18 9");
        svg.appendChild(polyline);

        span.appendChild(svg);
        return span;
      }
    }),
      codeFolding(),
      markdown({ base: markdownLanguage }),
      EditorView.lineWrapping,
      autocompletion({ override: [this.snippetManager ? this.snippetManager.completionSource.bind(this.snippetManager) : () => null] }),
      this.highlightCompartment.of(syntaxHighlighting(isDark ? HighlightStyles.dark : HighlightStyles.light)),
      this.vimConfig.of(useVim ? vim() : [])
    ];

    baseExtensions.push(this.themeConfig.of(isDark ? medicalDarkTheme : medicalLightTheme));

    const state = EditorState.create({ doc: savedContent, extensions: baseExtensions });

    this.view = new EditorView({
      state,
      parent,
      dispatch: (tr) => {
        this.view.update([tr]);
        if (tr.docChanged) this.onDocChange();
        if (tr.selection) this.onSelectionChange();
      }
    });
  }

  onDocChange() {
    const val = this.view.state.doc.toString();
    localStorage.setItem(this.storageKey, val);
    const ev = new CustomEvent("doc-change", { detail: { content: val, length: val.length } });
    this.dispatchEvent(ev);
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
    this.view.dispatch({ changes: { from: this.view.state.selection.main.from, to: this.view.state.selection.main.to, insert: "" } });
    try {
      const fn = snippet(content);
      fn(this.view, { label: "snippet" }, pos, pos);
    } catch (_) {
      this.view.dispatch({ changes: { from: pos, insert: content } });
    }
    this.view.focus();
  }

  insertDate() {
    const now = new Date();
    const str = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " - ";
    const pos = this.view.state.selection.main.head;
    this.view.dispatch({ changes: { from: pos, to: pos, insert: str } });
    this.view.focus();
  }

  toggleCase() {
    const sel = this.view.state.selection.main;
    if (sel.empty) return;
    const text = this.view.state.doc.sliceString(sel.from, sel.to);
    let newText;
    if (text === text.toLowerCase()) newText = text.replace(/\b\w/g, l => l.toUpperCase());
    else if (text === text.toUpperCase()) newText = text.toLowerCase();
    else newText = text.toUpperCase();
    this.view.dispatch({ changes: { from: sel.from, to: sel.to, insert: newText } });
    this.view.focus();
  }

  clear() {
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
}

