import { EditorManager } from "./core/EditorManager";
import { SnippetManager } from "./data/SnippetManager";
import { UIManager } from "./ui/UIManager";

const snippetManager = new SnippetManager();
const editorManager = new EditorManager({ snippetManager });

window.addEventListener("DOMContentLoaded", () => {
  const parentEl = document.getElementById("editor");
  if (!parentEl) return;
  editorManager.mount(parentEl);
  const ui = new UIManager({ editorManager, snippetManager });
  ui.init();
});

