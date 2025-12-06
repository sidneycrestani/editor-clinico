import { EditorView } from "@codemirror/view";
import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// --- 1. Base Theme (Layout & Estrutura) ---
const baseThemeStyles = {
  "&": {
    height: "100%",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "20px",
    lineHeight: "1.6",
    backgroundColor: "var(--bg-surface)", // Movido para base (usa var)
    color: "var(--text-main)"             // Movido para base (usa var)
  },
  
  // Seleção e Foco
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "var(--selection-bg) !important"
  },
  ".cm-content": {
    padding: "18px 8px", // Corrigido de 08px para 8px
    fontFamily: "'Crimson Pro', serif",
    caretColor: "var(--primary)" // Movido para base
  },
  
  // Cursor
  ".cm-cursor": { 
    borderLeftWidth: "2px",
    borderLeftColor: "var(--primary)" // Movido para base
  },
  "&.cm-focused .cm-fat-cursor": {
    backgroundColor: "var(--primary)",
    outline: "none",
    color: "var(--primary-fg)"
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    outline: "1px solid var(--border) !important",
    backgroundColor: "transparent"
  },

  // Linhas e Gutters (Mesclados e limpos)
  ".cm-line": { 
    paddingLeft: "0", 
    paddingRight: "8px" 
  },
  ".cm-activeLineGutter": { 
    backgroundColor: "var(--bg-gutter)" // Movido para base
  },
  ".cm-gutters": { 
    padding: "0 8px",
    backgroundColor: "transparent", // Padrão transparente, sobrescreva se necessário
    border: "none",
    color: "var(--text-muted)",
    minWidth: "14px",
    alignItems: "center" // Centralização padrão
  },
  ".cm-gutterElement": {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minWidth: "14px"
  },
  ".cm-linenumber": { 
    minWidth: "0px", 
    textAlign: "right", 
    paddingRight: "8px",
    color: "var(--text-muted)"
  },
  
  // Fold Gutter & Ícones
  ".cm-foldGutter": {
    minWidth: "14px",
    width: "32px",
    display: "flex",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--primary)"
  },
  ".gutter-fold-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    opacity: "0.6",
    transition: "transform 0.2s ease, opacity 0.2s, color 0.2s",
    color: "var(--text-muted)"
  },
  ".gutter-fold-icon:hover": {
    opacity: "1",
    color: "var(--primary)",
    transform: "scale(1.1)"
  },
  ".gutter-fold-icon.open": { transform: "rotate(0deg)" },
  ".gutter-fold-icon.closed": { transform: "rotate(-90deg)" },
  ".gutter-fold-icon svg": {
    width: "14px",
    height: "14px",
    display: "block",
    pointerEvents: "none"
  },

  // Outros elementos textuais
  ".cm-strong": { fontWeight: "700" },
  ".cm-em": { fontStyle: "italic" },
  ".cm-heading": { fontWeight: "700", fontSize: "1.1em" },
  ".cm-placeholder": {
    color: "var(--text-muted)",
    fontStyle: "italic",
    opacity: "0.6"
  },
  ".cm-matchingBracket": { backgroundColor: "var(--match-bg)", border: "none" },
  ".cm-link": { color: "var(--primary)", textDecoration: "underline" },
  ".cm-comment": { color: "var(--text-muted)", fontStyle: "italic" },

  // --- Tooltip & Autocomplete ---
  ".cm-tooltip.cm-tooltip-autocomplete": {
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    borderRadius: "6px",
    boxShadow: "var(--shadow-lg)",
    padding: "0",
    overflow: "hidden",
    minWidth: "250px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    maxHeight: "250px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid var(--bg-gutter)"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--btn-active-bg)",
    color: "var(--text-main)"
  },
  ".cm-completionIcon": {
    width: "16px",
    height: "16px",
    backgroundColor: "var(--primary)",
    "-webkit-mask-image": "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/></svg>')",
    "mask-image": "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/></svg>')",
    "-webkit-mask-repeat": "no-repeat",
    "mask-repeat": "no-repeat",
    "-webkit-mask-position": "center",
    "mask-position": "center",
    opacity: "0.8",
    marginRight: "0"
  },
  ".cm-completionLabel": {
    fontWeight: "600",
    color: "var(--primary)"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline",
    textDecorationColor: "var(--primary)"
  },
  ".cm-completionDetail": {
    marginLeft: "auto",
    fontSize: "0.85em",
    color: "var(--text-muted)",
    fontStyle: "normal"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail": {
    color: "var(--text-main)",
    opacity: "0.7"
  },
  ".cm-snippetField": {
    backgroundColor: "transparent",
    color: "var(--primary)",
    border: "1px dashed var(--border)",
    borderRadius: "4px",
    padding: "0 4px",
    margin: "0 2px",
    fontWeight: "500",
    fontSize: "0.95em",
    transition: "all 0.2s ease"
  },
  ".cm-snippetField:hover": {
    borderColor: "var(--primary)",
    cursor: "text"
  }
};

// --- 2. Themes Definitions ---
// Como movemos quase tudo que usa variáveis para o `baseThemeStyles`, 
// os temas específicos ficam bem mais limpos.

export const medicalLightTheme = EditorView.theme({
  ...baseThemeStyles,
  // Sobrescritas específicas do Light Mode (se houver algo que NÃO seja variável CSS)
}, { dark: false });

export const medicalDarkTheme = EditorView.theme({
  ...baseThemeStyles,
  // Sobrescritas específicas do Dark Mode
  // Exemplo: se o fundo do gutter precisar ser opaco no dark mode:
  ".cm-gutters": { 
    ...baseThemeStyles[".cm-gutters"], 
    backgroundColor: "var(--bg-surface)" 
  }
}, { dark: true });

// --- 3. Highlight Style ---
// Unificado pois usa CSS Variables para as cores

const sharedHighlightStyle = HighlightStyle.define([
  { tag: t.heading, color: "var(--primary)", fontWeight: "700", fontSize: "1.3em" },
  { tag: t.strong, color: "var(--text-main)", fontWeight: "700" },
  { tag: t.emphasis, color: "var(--text-main)", fontStyle: "italic" },
  { tag: t.link, color: "var(--primary)", textDecoration: "underline" },
  { tag: t.monospace, color: "var(--text-main)", background: "var(--bg-gutter)", borderRadius: "3px", padding: "0 4px" },
  { tag: t.list, color: "var(--primary)", fontWeight: "700" },
  { tag: t.quote, color: "var(--text-muted)", fontStyle: "italic" },
  { tag: t.processingInstruction, color: "var(--text-muted)" },
  { tag: t.meta, color: "var(--text-muted)" } 
]);

export const HighlightStyles = {
  light: sharedHighlightStyle,
  dark: sharedHighlightStyle
};
