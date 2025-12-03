import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

const baseThemeStyles = {
  "&": {
    height: "100%",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "20px",
    lineHeight: "1.6"
  },
  ".cm-content": {
    padding: "18px 08px",
    fontFamily: "'Crimson Pro', serif"
  },
  ".cm-line": { paddingLeft: "0", paddingRight: "8px" },
  ".cm-gutters": { padding: "0 8px" },
  ".cm-foldGutter": {
    minWidth: "14px",  /* Largura pequena, mas suficiente para o clique */
     width: "32px",
    display: "flex",
  },
  ".cm-linenumber": { minWidth: "0px", textAlign: "right", paddingRight: "8px" },
  ".cm-cursor": { borderLeftWidth: "2px" },
  ".cm-strong": { fontWeight: "700" },
  ".cm-em": { fontStyle: "italic" },
  ".cm-heading": { fontWeight: "700", fontSize: "1.1em" },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--primary)"
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--text-muted)"
  },

  // 3. O elemento individual da linha na gutter
  // Usamos flex AQUI apenas para centralizar o ícone dentro do seu "quadrado"
  ".cm-gutterElement": {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer" // O cursor deve aparecer aqui
  },

  // 4. O Wrapper do Ícone (Controla a Animação)
  ".gutter-fold-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px", // Área de clique confortável
    height: "20px",
    opacity: "0.6",
    transition: "transform 0.2s ease, opacity 0.2s, color 0.2s", // Animação suave
    color: "var(--text-muted)"
  },

  // Estado: Hover
  ".gutter-fold-icon:hover": {
    opacity: "1",
    color: "var(--primary)",
    transform: "scale(1.1)" // Um pequeno zoom para feedback tátil
  },

  // Estado: Aberto (Padrão - Seta para baixo)
  ".gutter-fold-icon.open": {
    transform: "rotate(0deg)"
  },

  // Estado: Fechado (Seta para a direita)
  ".gutter-fold-icon.closed": {
    transform: "rotate(-90deg)"
  },

  // 5. Correção do SVG (Evita o 0x0)
  ".gutter-fold-icon svg": {
    width: "14px",
    height: "14px",
    display: "block",
    pointerEvents: "none" // Garante que o clique passe para o span pai
  },

  // Limpezas extras
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  ".cm-line": { paddingLeft: "0", paddingRight: "8px" }
};

export const medicalLightTheme = EditorView.theme({
  ...baseThemeStyles,
  "&": { ...baseThemeStyles["&"], backgroundColor: "var(--bg-surface)", color: "var(--text-main)" },
  ".cm-content": { ...baseThemeStyles[".cm-content"], caretColor: "var(--primary)" },
  "&.cm-focused .cm-fat-cursor": {
    backgroundColor: "var(--primary)",
    outline: "none",
    color: "var(--primary-fg)"
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    outline: "1px solid var(--border) !important",
    backgroundColor: "transparent"
  },
".cm-gutters": { backgroundColor: "transparent", alignItems: "center", minWidth: "14px", border: "none", color: "var(--text-muted)" },
    ".cm-gutterElement": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
  },
  
  ".cm-linenumber": { color: "var(--text-muted)" },
  ".cm-activeLineGutter": { backgroundColor: "var(--bg-gutter)" },
  ".cm-cursor": { borderLeftColor: "var(--primary)", borderLeftWidth: "2px" },
  ".cm-selectionBackground": { backgroundColor: "var(--selection-bg)" },
  ".cm-matchingBracket": { backgroundColor: "var(--match-bg)", border: "none" },
  ".cm-link": { color: "var(--primary)", textDecoration: "underline" },
  ".cm-comment": { color: "var(--text-muted)", fontStyle: "italic" }
}, { dark: false });

export const medicalDarkTheme = EditorView.theme({
  ...baseThemeStyles,
  "&": { ...baseThemeStyles["&"], backgroundColor: "var(--bg-surface)", color: "var(--text-main)" },
  ".cm-content": { ...baseThemeStyles[".cm-content"], caretColor: "var(--primary)" },
  "&.cm-focused .cm-fat-cursor": {
    backgroundColor: "var(--primary)",
    outline: "none",
    color: "var(--primary-fg)"
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    outline: "1px solid var(--border) !important",
    backgroundColor: "transparent"
  },
  ".cm-gutters": { backgroundColor: "var(--bg-surface)", minWidth: "0px", border: "none", color: "var(--text-muted)" },
    ".cm-gutterElement": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "14px" // Mesmo tamanho da gutter
  },

  ".cm-linenumber": { color: "var(--text-muted)" },
  ".cm-activeLineGutter": { backgroundColor: "var(--bg-gutter)" },
  ".cm-cursor": { borderLeftColor: "var(--primary)", borderLeftWidth: "2px" },
  ".cm-selectionBackground": { backgroundColor: "var(--selection-bg)" },
  ".cm-matchingBracket": { backgroundColor: "var(--match-bg)", border: "none" },
  ".cm-link": { color: "var(--primary)", textDecoration: "underline" },
  ".cm-comment": { color: "var(--text-muted)", fontStyle: "italic" }
}, { dark: true });

const medicalHighlightLight = HighlightStyle.define([
  { tag: tags.heading, color: "var(--primary)", fontWeight: "700", fontSize: "1.05em" },
  { tag: tags.strong, color: "var(--text-main)", fontWeight: "700" },
  { tag: tags.emphasis, color: "var(--text-main)", fontStyle: "italic" },
  { tag: tags.link, color: "var(--primary)", textDecoration: "underline" },
  { tag: tags.monospace, color: "var(--text-main)", background: "var(--bg-gutter)", borderRadius: "3px", padding: "0 4px" },
  { tag: tags.list, color: "var(--primary)", fontWeight: "700" },
  { tag: tags.quote, color: "var(--text-muted)", fontStyle: "italic" }
]);

const medicalHighlightDark = HighlightStyle.define([
  { tag: tags.heading, color: "var(--primary)", fontWeight: "700", fontSize: "1.05em" },
  { tag: tags.strong, color: "var(--text-main)", fontWeight: "700" },
  { tag: tags.emphasis, color: "var(--text-main)", fontStyle: "italic" },
  { tag: tags.link, color: "var(--primary)", textDecoration: "underline" },
  { tag: tags.monospace, color: "var(--text-main)", background: "var(--bg-gutter)", borderRadius: "3px", padding: "0 4px" },
  { tag: tags.list, color: "var(--primary)", fontWeight: "700" },
  { tag: tags.quote, color: "var(--text-muted)", fontStyle: "italic" }
]);

export const HighlightStyles = {
  light: medicalHighlightLight,
  dark: medicalHighlightDark
};
