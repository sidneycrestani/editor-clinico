import { snippetCompletion } from "@codemirror/autocomplete";

const defaultSnippets = [
  {
    name: "SOAP Padrão",
    trigger: "soap",
    content:
      "# SUBJETIVO\nID: ${1:M/F, idade}\nQPD: ${2:Relata que há...}\nHDA: ${3:Início há x dias, evoluindo com...}\nISDA: ${4:Nega queixas álgicas, urinárias ou gastrointestinais.}\n\nANT. PESSOAIS:\n- Comorbidades: ${5:Nega HAS/DM/DLP.}\n- Cirurgias/Internações: ${6:Nega prévias.}\n- Meds em uso: ${7:Nega uso contínuo.}\n- Alergias: ${8:Nega conhecidas.}\n\nHÁBITOS:\n- Tabagismo: ${9:Nega.}\n- Etilismo: ${10:Social/Esporádico.}\n- Ativ. Física: ${11:Sedentário(a).}\n\n# OBJETIVO\nGeral: BEG, LOTE, Corado, Hidratado, Anictérico, Afebril.\nSinais: PA: ${12:120x80} mmHg | FC: ${13:72} bpm | FR: ${14:16} irpm | SatO2: ${15:98}% | Tax: ${16:36,5}ºC\nAntropometria: Peso: ${17:__}kg | Alt: ${18:__}m | IMC: ${19:__}\n\nEXAME FÍSICO:\n> AR: ${20:MV+ em AHT, s/ RA. Eupneico em AA.}\n> ACV: ${21:RCR 2T, BNF, s/ sopros. Ictus não visível.}\n> ABD: ${22:Plano, flácido, indolor à palpação, RHA+, s/ VMG ou massas.}\n> EXT: ${23:Bem perfundidos, s/ edema ou empastamento. Pulsos presentes e simétricos.}\n> ORO/OTUS: ${24:Oroscopia s/ hiperemia ou placas. Otoscopia s/ alterações.}\n\n# AVALIAÇÃO\n1. HD: ${25:___} (CID: ${26:___})\n2. HD: ${27:___}\n\n# PLANO TERAPÊUTICO\n1. Não-Farmacológico: ${28:Mudança estilo de vida, hidratação, dieta.}\n2. Farmacológico:\n   - ${29:Segue prescrição padrão.}\n3. Exames: ${30:Nenhum no momento.}\n4. Seguimento: Retorno em ${31:x dias/meses} ou s.o.s.",
  },
  {
    name: "Exame Normal",
    trigger: "efn",
    content:
      "BEG, LOTE, Corado, Hidratado, Anictérico, Acianótico.\nAR: MV+ s/ RA.\nACV: RCR 2T BNF s/ sopros.\nABD: Flácido, indolor, RHA+.",
  },
];

export class SnippetManager {
  constructor(storageKey = "med_editor_snippets") {
    this.storageKey = storageKey;
    this.snippets = [];
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.snippets = raw ? JSON.parse(raw) : [...defaultSnippets];
    } catch {
      this.snippets = [...defaultSnippets];
    }
  }

  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.snippets));
  }

  list() {
    return this.snippets;
  }

  add(snippet) {
    this.snippets.push(snippet);
    this.persist();
  }

  update(index, snippet) {
    this.snippets[index] = snippet;
    this.persist();
  }

  remove(index) {
    this.snippets.splice(index, 1);
    this.persist();
  }

  import(list) {
    this.snippets = Array.isArray(list) ? list : [];
    this.persist();
  }

  export() {
    return JSON.stringify(this.snippets, null, 2);
  }

  completionSource(context) {
    const word = context.matchBefore(/\w*/);
    if (!word) return null;
    if (word.from === word.to && !context.explicit) return null;
    const options = this.snippets.map((s) =>
      snippetCompletion(s.content, { label: s.trigger, detail: s.name })
    );
    return { from: word.from, options };
  }
}
