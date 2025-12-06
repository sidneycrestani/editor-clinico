import { EditorManager } from "../core/EditorManager";
import { SnippetManager } from "../data/SnippetManager";

export class UIManager {
  constructor({ editorManager, snippetManager }) {
    this.editor = editorManager;
    this.snippets = snippetManager;
    this.isSidebarOpen = false;
    this.editingIndex = -1;
    this.dom = {
      sidebar: document.getElementById("sidebar"),
      btnSidebarToggle: document.getElementById("btn-sidebar-toggle"),
      fileInput: document.getElementById("fileInput"),
      snippetList: document.getElementById("snippet-list-ui"),
      menu: document.getElementById("app-menu"),
      trigger: document.getElementById("brand-trigger"),
      editName: document.getElementById("edit-name"),
      editTrigger: document.getElementById("edit-trigger"),
      editContent: document.getElementById("edit-content"),
      sidebarTitle: document.getElementById("sidebar-title"),
      jsonEditor: document.getElementById("json-editor"),
      checkTheme: document.getElementById("check-theme"),
      checkVim: document.getElementById("check-vim"),
      charCount: document.getElementById("char-count"),
      cursorPos: document.getElementById("cursor-pos"),
      saveStatus: document.getElementById("save-status"),
      toast: document.getElementById("toast"),
      toastMsg: document.getElementById("toast-msg")
    };
  }

  init() {
    this.snippets.load();
    this.applyInitialPrefs();
    this.showListView();
    this.wireEvents();
    this.dom.charCount.textContent = `${this.editor.getContent().length} chars`;
  }

  applyInitialPrefs() {
    const isDark = localStorage.getItem("med_editor_theme") === "dark";
    this.dom.checkTheme.checked = isDark;
    if (isDark) document.body.classList.add("dark-mode");
    this.editor.setTheme(isDark);
    const isVim = localStorage.getItem("med_editor_vim") === "true";
    this.dom.checkVim.checked = isVim;
  }

  wireEvents() {
    this.bindClick("btn-new", () => {
      if (confirm("Deseja limpar todo o editor?")) this.editor.clear();
    });
    this.bindClick("btn-open", () => this.dom.fileInput.click());
    this.bindClick("btn-save", () => this.saveFile());
    this.bindClick("btn-undo", () => this.editor.undo());
    this.bindClick("btn-redo", () => this.editor.redo());
    this.bindClick("btn-date", () => this.editor.insertDate());
    this.bindClick("btn-case", () => this.editor.toggleCase());
    this.bindClick("btn-sidebar-toggle", () => this.toggleSidebar());
    this.bindClick("btn-copy", () => this.copyToClipboard());

    this.bindClick("btn-sidebar-close", () => this.toggleSidebar(false));
    this.bindClick("btn-create-snippet", () => this.startCreateSnippet());
    this.bindClick("btn-json", () => this.showJsonView());
    this.bindClick("btn-back-list", () => this.showListView());
    this.bindClick("btn-cancel-edit", () => this.showListView());
    this.bindClick("btn-save-snippet", () => this.saveCurrentSnippet());
    this.bindClick("btn-copy-json", () => this.copyJson());
    this.bindClick("btn-import-json", () => this.saveJsonImport());

    this.dom.checkTheme.addEventListener("change", () => this.toggleTheme());
    this.dom.checkVim.addEventListener("change", (e) => this.toggleVim(e.target.checked));
    this.dom.fileInput.addEventListener("change", (e) => this.handleFileOpen(e));

    this.dom.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.dom.menu.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (this.dom.menu.classList.contains("show") && !this.dom.menu.contains(e.target) && !this.dom.trigger.contains(e.target)) {
        this.dom.menu.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        this.saveFile();
      }
    });

    this.editor.addEventListener("doc-change", (e) => {
      const { length } = e.detail;
      this.dom.charCount.textContent = `${length} chars`;
    });
    this.editor.addEventListener("save-status", (e) => {
      const statusEl = this.dom.saveStatus;
      
      statusEl.style.opacity = "1";

      if (e.detail.status === "saving") {
        statusEl.textContent = "Salvando...";
        statusEl.style.color = "var(--warning)";
        statusEl.classList.add("blink"); 
      } 
      else if (e.detail.status === "saved") {
        statusEl.classList.remove("blink"); 
        statusEl.textContent = "✓ Salvo";
        statusEl.style.color = "var(--success)";
        
      }
      else if (e.detail.status === "error") {
        statusEl.classList.remove("blink");
        statusEl.textContent = "⚠ Erro";
        statusEl.style.color = "var(--danger)";
      }
    });

    this.editor.addEventListener("selection-change", (e) => {
      const { line } = e.detail;
      this.dom.cursorPos.textContent = `Ln ${line}`;
    });
  }

  bindClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("med_editor_theme", isDark ? "dark" : "light");
    this.dom.checkTheme.checked = isDark;
    this.editor.setTheme(isDark);
  }

  toggleVim(enable) {
    localStorage.setItem("med_editor_vim", enable);
    this.editor.toggleVim(enable);
    this.toast(enable ? "Modo VIM Ativado" : "Modo Padrão Ativado");
  }

  toggleSidebar(forceState) {
    const btn = this.dom.btnSidebarToggle;
    this.isSidebarOpen = typeof forceState === "boolean" ? forceState : !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.dom.sidebar.classList.add("open");
      btn.classList.add("active");
      this.showListView();
    } else {
      this.dom.sidebar.classList.remove("open");
      btn.classList.remove("active");
    }
    localStorage.setItem("med_editor_sidebar", this.isSidebarOpen);
    setTimeout(() => this.editor.requestMeasure(), 350);
  }

  switchView(viewId) {
    ["view-list", "view-edit", "view-json"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("active");
    });
    document.getElementById(viewId).classList.add("active");
  }

  showListView() {
    this.switchView("view-list");
    this.dom.sidebarTitle.textContent = "Meus Modelos";
    this.renderSnippetList();
  }

  renderSnippetList() {
    const list = this.dom.snippetList;
    list.textContent = "";
    const items = this.snippets.list();
    if (items.length === 0) {
      const li = document.createElement("li");
      li.style.padding = "15px";
      li.style.textAlign = "center";
      li.style.color = "var(--text-muted)";
      li.style.fontSize = "13px";
      li.textContent = "Nenhum modelo. Crie o primeiro!";
      list.appendChild(li);
      return;
    }
    items.forEach((s, index) => {
      const li = document.createElement("li");
      li.className = "snippet-item";

      const info = document.createElement("div");
      info.className = "snippet-info";
      const b = document.createElement("b");
      b.textContent = s.name;
      const span = document.createElement("span");
      span.textContent = s.trigger;
      info.appendChild(b);
      info.appendChild(span);

      const actions = document.createElement("div");
      actions.className = "snippet-actions";
      const editBtn = document.createElement("button");
      editBtn.className = "btn-secondary edit-btn";
      editBtn.title = "Editar";
      editBtn.textContent = "✎";
      const delBtn = document.createElement("button");
      delBtn.className = "btn-danger del-btn";
      delBtn.title = "Excluir";
      delBtn.style.color = "var(--danger)";
      delBtn.textContent = "🗑";
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(info);
      li.appendChild(actions);

      li.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          this.editor.insertSnippet(s.content);
          this.toast(`Modelo "${s.name}" inserido`);
          if (window.innerWidth < 600) this.toggleSidebar(false);
        }
      });
      editBtn.addEventListener("click", (e) => { e.stopPropagation(); this.editSnippet(index); });
      delBtn.addEventListener("click", (e) => { e.stopPropagation(); this.deleteSnippet(index); });

      list.appendChild(li);
    });
  }

  startCreateSnippet() {
    this.editingIndex = -1;
    this.dom.editName.value = "";
    this.dom.editTrigger.value = "";
    this.dom.editContent.value = "";
    this.dom.sidebarTitle.textContent = "Novo Modelo";
    this.switchView("view-edit");
  }

  editSnippet(index) {
    this.editingIndex = index;
    const s = this.snippets.list()[index];
    this.dom.editName.value = s.name;
    this.dom.editTrigger.value = s.trigger;
    this.dom.editContent.value = s.content;
    this.dom.sidebarTitle.textContent = "Editar Modelo";
    this.switchView("view-edit");
  }

  saveCurrentSnippet() {
    const name = this.dom.editName.value.trim();
    const trigger = this.dom.editTrigger.value.trim();
    const content = this.dom.editContent.value;
    if (!name || !trigger) { alert("Preencha Nome e Atalho."); return; }
    const obj = { name, trigger, content };
    if (this.editingIndex === -1) {
      const exists = this.snippets.list().find(s => s.trigger === trigger);
      if (exists) { if (!confirm(`O atalho "${trigger}" já existe. Duplicar?`)) return; }
      this.snippets.add(obj);
    } else {
      this.snippets.update(this.editingIndex, obj);
    }
    this.showListView();
    this.toast("Modelo salvo!");
  }

  deleteSnippet(index) {
    if (confirm("Excluir este modelo?")) {
      this.snippets.remove(index);
      this.showListView();
    }
  }

  showJsonView() {
    this.dom.jsonEditor.value = this.snippets.export();
    this.dom.sidebarTitle.textContent = "JSON / Backup";
    this.switchView("view-json");
  }

  saveJsonImport() {
    try {
      const parsed = JSON.parse(this.dom.jsonEditor.value);
      if (!Array.isArray(parsed)) throw new Error("Formato deve ser um array.");
      if (confirm("Isso substituirá seus modelos atuais. Continuar?")) {
        this.snippets.import(parsed);
        this.showListView();
        this.toast("Importação concluída!");
      }
    } catch (e) {
      alert("Erro JSON: " + e.message);
    }
  }

  copyJson() {
    this.dom.jsonEditor.select();
    document.execCommand("copy");
    this.toast("JSON copiado!");
  }

  handleFileOpen(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { this.editor.setContent(ev.target.result); this.toast("Arquivo aberto com sucesso"); };
    reader.readAsText(file);
    e.target.value = "";
  }

  saveFile() {
    const content = this.editor.getContent();
    if (!content) { this.toast("Editor vazio"); return; }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = `evolucao_${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  copyToClipboard() {
    const val = this.editor.getContent();
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
      this.toast("Texto copiado!");
      const btn = document.getElementById("btn-copy");
      const originalBg = btn.style.background;
      btn.style.background = "var(--success)";
      setTimeout(() => btn.style.background = originalBg, 1000);
    });
  }

  toast(msg) {
    this.dom.toastMsg.textContent = msg;
    this.dom.toast.classList.add("show");
    setTimeout(() => this.dom.toast.classList.remove("show"), 2500);
  }
}

