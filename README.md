# MedDraft 🩺

O MedDraft é uma ferramenta de anotação rápida, segura e *offline-first*, desenvolvida especificamente para profissionais de saúde e estudantes de medicina. Focado em produtividade, ele permite a criação de evoluções (SOAP), prescrições e resumos utilizando Markdown, com um poderoso sistema de **Snippets (Modelos)**.

> **Privacidade Total:** Todos os dados são salvos localmente no navegador (`localStorage`). Nenhuma informação do paciente é enviada para servidores externos.

---

### 🚀 Acesso Rápido (Live Demo)

**Utilize a versão online agora mesmo (sem instalação):**
### [🔗 https://sidneycrestani.github.io/MedDraft/](https://sidneycrestani.github.io/MedDraft/)

---

![Status](https://img.shields.io/badge/Status-Estável-green)
![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-blue)
![Tech](https://img.shields.io/badge/Tech-CodeMirror_6-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## ✨ Funcionalidades Principais

### 📝 Edição Poderosa
- **Baseado no CodeMirror 6:** Editor moderno, rápido e extensível.
- **Markdown Support:** Realce de sintaxe para fácil formatação.
- **Modo Vim:** Para usuários avançados que preferem navegação via teclado (ativável nas configurações).
- **Temas:** Suporte nativo para **Modo Claro** e **Modo Escuro**.

### 🚀 Produtividade Clínica
- **Gerenciador de Modelos (Snippets):**
  - Crie modelos reutilizáveis (ex: Exame Físico Normal, Anamnese Padrão).
  - **Autocompletar:** Digite o atalho (gatilho) e pressione `Tab`.
  - Suporte a placeholders tabuláveis (sintaxe `${1:foco}`).
- **Auto-Save Inteligente:** Salvamento automático no navegador com *debounce* para performance e proteção contra travamentos.
- **Ferramentas de Texto:**
  - Alternar Maiúsculas/Minúsculas/Título (Title Case).
  - Inserção rápida de Data/Hora atual.
  - Contador de caracteres e linhas.

### 💾 Importação e Exportação
- Abrir arquivos locais (`.txt`, `.md`).
- Salvar anotações no disco.
- Exportar/Importar biblioteca de Snippets via JSON (backup fácil).
- Botão "Copiar" formatado para colar em prontuários eletrônicos externos.

## 🛠️ Tecnologias Utilizadas

- **Core:** JavaScript (ES Modules)
- **Editor Engine:** [@codemirror/state, @codemirror/view](https://codemirror.net/)
- **Linguagem:** [@codemirror/lang-markdown](https://github.com/codemirror/lang-markdown)
- **Keybindings:** [@replit/codemirror-vim](https://github.com/replit/codemirror-vim)
- **Estilização:** CSS Variables (Themes)

## 📦 Desenvolvimento Local

Se você é um desenvolvedor e deseja contribuir ou rodar localmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/sidneycrestani/MedDraft.git
   cd MedDraft
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🧩 Estrutura do Código

- **`index.html`**: Estrutura da UI, Toolbar, Sidebar de Snippets e importação dos módulos.
- **`src/EditorManager.js`**: Classe principal que gerencia a instância do CodeMirror.
  - Gerencia *Compartments* para reconfiguração dinâmica (Temas, Vim, Keymaps).
  - Lida com sanitização de I/O e *debounce* do LocalStorage.
  - Expõe métodos para a UI (insertSnippet, toggleCase, etc.).
- **`src/config/themes.js`**: Contém as definições de cores para os temas Claro/Escuro.

## 🔒 Privacidade e Segurança

Este editor foi desenhado sob o princípio de **Privacy by Design**:
1. O código roda inteiramente no **Client-Side** (navegador).
2. O armazenamento (`localStorage`) é isolado no dispositivo do usuário.
3. Não há scripts de rastreamento ou envio de telemetria no código base.

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Desenvolvido por **Sidney Alves Crestani Jr.**