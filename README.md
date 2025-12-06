<div align="center">
  <img src="https://raw.githubusercontent.com/sidneycrestani/MedDraft/refs/heads/main/public/favicon/favicon.svg" alt="MedDraft Logo" width="100" height="100" />
  <h1>MedDraft</h1>
  <p>
    <b>Fluxo Clínico. Foco Absoluto. Privacidade Total.</b>
  </p>
  
  <p>
    <a href="https://sidneycrestani.github.io/MedDraft/">
      <img src="https://img.shields.io/badge/Live_Demo-Acessar_Agora-0ea5e9?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  ![Status](https://img.shields.io/badge/Status-Estável-green)
  ![Tech](https://img.shields.io/badge/Engine-CodeMirror_6-orange)
  ![Privacy](https://img.shields.io/badge/Data-Local_Only-blueviolet)
  ![License](https://img.shields.io/badge/License-MIT-lightgrey)
</div>

<br />

## 🩺 O que é o MedDraft?

O **MedDraft** não é apenas um bloco de notas. É um ambiente de escrita desenhado para a velocidade de raciocínio do profissional de saúde. 

Unindo a agilidade do **Markdown**, o poder dos **Snippets** (modelos inteligentes) e a privacidade do armazenamento local, ele serve como o "rascunho perfeito" para evoluções (SOAP), anamneses e prescrições antes de serem transferidas para prontuários eletrônicos lentos e burocráticos.


## ✨ Funcionalidades Principais

### ⚡ Produtividade & Fluxo (Flow)
- **Sistema de Snippets Avançado:** Crie modelos com placeholders tabuláveis (ex: `${1:queixa}`). Digite o atalho, aperte `Tab` e preencha.
- **Modo Vim:** Para usuários "Power Users" que desejam editar texto sem tirar as mãos do teclado (ativável no menu).
- **Ferramentas de Texto:** Alternância de Caixa (Maiúscula/Minúscula/Título), Data/Hora automática e contadores em tempo real.

### 📝 Edição Moderna
- **Core CodeMirror 6:** Performance nativa, leve e robusta.
- **Sintaxe Markdown:** Formatação visual automática enquanto você digita.
- **Temas Médicos:** Interface limpa, disponível em **Light Mode** (Hospitalar) e **Dark Mode** (Radiológico/Plantão Noturno).

### 🔒 Privacidade "by Design"
- **Offline-First:** Funciona sem internet.
- **Local Storage:** Seus dados nunca saem do seu navegador. Não há servidores, não há tracking, não há risco de vazamento na nuvem.
- **Auto-Save Inteligente:** Salvamento automático com *debounce* para garantir que você nunca perca uma linha de pensamento.

## 🚀 Acesso Rápido

Não requer instalação. Acesse via navegador (Desktop ou Mobile):
### [🔗 sidneycrestani.github.io/MedDraft](https://sidneycrestani.github.io/MedDraft/)

## 🛠️ Instalação Local (Para Desenvolvedores)

Se você deseja contribuir com o código ou rodar uma instância própria:

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

## ⌨️ Atalhos de Teclado Essenciais

| Ação | Windows / Linux | Mac (macOS) |
| :--- | :--- | :--- |
| Menu de Autocompletar | `Ctrl` + `Espaço` | `Ctrl` + `Espaço` |
| Mover Linha (Cima/Baixo) | `Alt` + `↑` / `↓` | `Option` + `↑` / `↓` |
| Duplicar Linha | `Shift` + `Alt` + `↑` / `↓` | `Shift` + `Option` + `↑` / `↓` |
| Apagar Linha Inteira | `Shift` + `Ctrl` + `K` | `Shift` + `Cmd` + `K` |
| Desfazer | `Ctrl` + `Z` | `Cmd` + `Z` |
| Refazer | `Ctrl` + `Y` | `Cmd` + `Shift` + `Z` |





## 🧩 Estrutura do Projeto

- **`index.html`**: UI Principal, Toolbar e carregamento do Branding (SVG Inline).
- **`src/EditorManager.js`**: O "cérebro" do editor. Gerencia o estado, temas, sanitização de dados e *features* do CodeMirror.
- **`src/SnippetManager.js`**: Lógica de autocompletar e gestão da biblioteca de modelos.
- **`src/main.js`**: Ponto de entrada e orquestração de eventos DOM.

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.

---

<div align="center">
  <small>Desenvolvido com por <b>Sidney Alves Crestani Jr.</b></small>
</div>