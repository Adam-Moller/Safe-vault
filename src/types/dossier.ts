export interface WitnessOrSource {
  id: string;
  codinome: string;
  nomeReal: string;
  grauConfiabilidade: 1 | 2 | 3 | 4 | 5;
  dispostoADepor: "Sim" | "Apenas Sob Sigilo" | "Recusa Absoluta" | "Hostil";
  contatoSeguro: string;
  oQueSabe: string;
  vulnerabilidadesOuRisco: string; // Ex: Processo pendente, dependência financeira, inimizade
}

export interface CaseTimelineEvent {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  evidenciasDisponiveis: string;
  pontoFraco: string; // O calcanhar de aquiles que o adversário pode explorar
}

export interface ConfidentialCase {
  id: string;
  codinomeCaso: string;
  area: "Trabalhista" | "Corporativo / Societário" | "Criminal" | "Compliance / Fraude" | "Civil / Família";
  status: "Em Investigação" | "Pré-Litígio" | "Em Andamento Judicial" | "Acordo Sigiloso" | "Arquivado";
  partesEnvolvidas: string;
  tesePrincipal: string;
  estrategiaConfidencial: string;
  fontesETestemunhas: WitnessOrSource[];
  linhaDoTempo: CaseTimelineEvent[];
  notasEstrategicas: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

export interface DossierVaultData {
  cases: ConfidentialCase[];
}
