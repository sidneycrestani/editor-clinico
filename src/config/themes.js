import { EditorView } from "@codemirror/view";
import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const baseThemeStyles = {
  "&": {
    height: "100%",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "20px",
    lineHeight: "1.6",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
  },

  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor: "var(--selection-bg) !important",
    },
  ".cm-content": {
    padding: "18px 8px",
    fontFamily: "'Crimson Pro', serif",
    caretColor: "var(--primary)",
  },

  ".cm-cursor": {
    borderLeftWidth: "2px",
    borderLeftColor: "var(--primary)",
  },
  "&.cm-focused .cm-fat-cursor": {
    backgroundColor: "var(--primary)",
    outline: "none",
    color: "var(--primary-fg)",
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    outline: "1px solid var(--border) !important",
    backgroundColor: "transparent",
  },

  ".cm-line": {
    paddingLeft: "0",
    paddingRight: "8px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-gutters": {
    padding: "0 8px",
    backgroundColor: "transparent",
    border: "none",
    color: "var(--text-muted)",
    minWidth: "14px",
    alignItems: "center",
  },
  ".cm-gutterElement": {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minWidth: "14px",
  },
  ".cm-linenumber": {
    minWidth: "0px",
    textAlign: "right",
    paddingRight: "8px",
    color: "var(--text-muted)",
  },

  ".cm-foldGutter": {
    minWidth: "14px",
    width: "32px",
    display: "flex",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--primary)",
  },
  ".gutter-fold-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    opacity: "0.6",
    transition: "transform 0.2s ease, opacity 0.2s, color 0.2s",
    color: "var(--text-muted)",
  },
  ".gutter-fold-icon:hover": {
    opacity: "1",
    color: "var(--primary)",
    transform: "scale(1.1)",
  },
  ".gutter-fold-icon.open": { transform: "rotate(0deg)" },
  ".gutter-fold-icon.closed": { transform: "rotate(-90deg)" },
  ".gutter-fold-icon svg": {
    width: "14px",
    height: "14px",
    display: "block",
    pointerEvents: "none",
  },

  ".cm-strong": { fontWeight: "700" },
  ".cm-em": { fontStyle: "italic" },
  ".cm-heading": { fontWeight: "700", fontSize: "1.1em" },
  ".cm-placeholder": {
    color: "var(--text-muted)",
    fontStyle: "italic",
    opacity: "0.6",
  },
  ".cm-matchingBracket": { backgroundColor: "var(--match-bg)", border: "none" },
  ".cm-link": { color: "var(--primary)", textDecoration: "underline" },
  ".cm-comment": { color: "var(--text-muted)", fontStyle: "italic" },

  ".cm-tooltip.cm-tooltip-autocomplete": {
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    borderRadius: "6px",
    boxShadow: "var(--shadow-lg)",
    padding: "0",
    overflow: "hidden",
    minWidth: "250px",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    maxHeight: "250px",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid var(--bg-gutter)",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--btn-active-bg)",
    color: "var(--text-main)",
  },
  ".cm-completionIcon": {
    width: "16px",
    height: "16px",
    backgroundColor: "var(--primary)",
    "-webkit-mask-image":
      'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>\')',
    "mask-image":
      'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>\')',
    "-webkit-mask-repeat": "no-repeat",
    "mask-repeat": "no-repeat",
    "-webkit-mask-position": "center",
    "mask-position": "center",
    opacity: "0.8",
    marginRight: "0",
  },
  ".cm-completionLabel": {
    fontWeight: "600",
    color: "var(--primary)",
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline",
    textDecorationColor: "var(--primary)",
  },
  ".cm-completionDetail": {
    marginLeft: "auto",
    fontSize: "0.85em",
    color: "var(--text-muted)",
    fontStyle: "normal",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail":
    {
      color: "var(--text-main)",
      opacity: "0.7",
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
    transition: "all 0.2s ease",
  },
  ".cm-snippetField:hover": {
    borderColor: "var(--primary)",
    cursor: "text",
  },
  ".cm-panels": {
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    borderTop: "1px solid var(--border)",
    borderBottom: "none",
    zIndex: "100",
  },

  ".cm-vim-panel": {
    padding: "6px 12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  ".cm-vim-panel > div": {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },

  ".cm-vim-panel span[style*='font-family: monospace']": {
    color: "var(--primary)",
    fontWeight: "bold",
    marginRight: "6px",
    fontFamily: "'Crimson Pro', monospace !important",
  },

  ".cm-vim-panel input": {
    color: "var(--text-main)",
    caretColor: "var(--primary)",
    fontFamily: "monospace",
    fontWeight: "500",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    height: "100%",
    flex: "1",
  },

  ".cm-vim-panel span[style*='color: rgb(136, 136, 136)']": {
    color: "var(--text-muted) !important",
    fontSize: "0.9em",
    fontStyle: "italic",
    marginLeft: "auto",
    paddingLeft: "10px",
  },

  ".cm-vim-panel span[style*='cursor: pointer']": {
    cursor: "pointer",
    transition: "color 0.2s ease",
    textDecoration: "underline",
    textDecorationColor: "var(--border)",
  },
  ".cm-vim-panel span[style*='cursor: pointer']:hover": {
    color: "var(--primary) !important",
  },
};

export const medicalLightTheme = EditorView.theme(
  {
    ...baseThemeStyles,
  },
  { dark: false }
);

export const medicalDarkTheme = EditorView.theme(
  {
    ...baseThemeStyles,
    ".cm-gutters": {
      ...baseThemeStyles[".cm-gutters"],
      backgroundColor: "var(--bg-surface)",
    },
  },
  { dark: true }
);

const sharedHighlightStyle = HighlightStyle.define([
  {
    tag: t.heading,
    color: "var(--primary)",
    fontWeight: "700",
    fontSize: "1.3em",
  },
  { tag: t.strong, color: "var(--text-main)", fontWeight: "700" },
  { tag: t.emphasis, color: "var(--text-main)", fontStyle: "italic" },
  { tag: t.link, color: "var(--primary)", textDecoration: "underline" },
  {
    tag: t.monospace,
    color: "var(--text-main)",
    background: "transparent",
    borderRadius: "3px",
    padding: "0 4px",
  },
  { tag: t.list, color: "var(--primary)", fontWeight: "700" },
  { tag: t.quote, color: "var(--text-muted)", fontStyle: "italic" },
  { tag: t.processingInstruction, color: "var(--text-muted)" },
  { tag: t.meta, color: "var(--text-muted)" },
]);

export const HighlightStyles = {
  light: sharedHighlightStyle,
  dark: sharedHighlightStyle,
};
