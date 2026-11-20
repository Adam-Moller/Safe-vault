/**
 * @file dossier.ts
 * @description Estruturas de dados para o módulo de Dossiês Confidenciais, Investigação e Estratégia Jurídica.
 * Gerencia fontes anônimas, grau de credibilidade testemunhal e linha do tempo de litígios sob sigilo.
 */

/**
 * Registro de informante, fonte ou testemunha-chave em uma investigação ou processo.
 */
export interface WitnessOrSource {
  id: string;
  /** Codinome para referência pública/interna sem revelar a identidade real. */
  codinome: string;
  /** Nome civil completo da fonte. */
  nomeReal: string;
  /** Classificação de credibilidade e consistência probatória da fonte de 1 a 5. */
  grauConfiabilidade: 1 | 2 | 3 | 4 | 5;
  /** Grau de concordância em assinar termo formal ou depor perante tribunal. */
  dispostoADepor: "Sim" | "Apenas Sob Sigilo" | "Recusa Absoluta" | "Hostil";
  /** Canal seguro ou método alternativo de comunicação. */
  contatoSeguro: string;
  /** Resumo dos fatos que a testemunha presenciou diretamente. */
  oQueSabe: string;
  /** Pontos fracos, antecedentes ou dependências que a parte adversária pode usar para desqualificá-la. */
  vulnerabilidadesOuRisco: string;
}

/**
 * Marco cronológico com apontamento de evidências e riscos.
 */
export interface CaseTimelineEvent {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  evidenciasDisponiveis: string;
  /** O calcanhar de aquiles da nossa própria argumentação em relação a esse evento. */
  pontoFraco: string;
}

/**
 * Dossiê de litígio, auditoria ou investigação sigilosa.
 */
export interface ConfidentialCase {
  id: string;
  codinomeCaso: string;
  area: "Trabalhista" | "Corporativo / Societário" | "Criminal" | "Compliance / Fraude" | "Civil / Família";
  status: "Em Investigação" | "Pré-Litígio" | "Em Andamento Judicial" | "Acordo Sigiloso" | "Arquivado";
  partesEnvolvidas: string;
  tesePrincipal: string;
  /** Diretrizes secretas de negociação, pressão psicológica ou estratégia pré-processual. */
  estrategiaConfidencial: string;
  fontesETestemunhas: WitnessOrSource[];
  linhaDoTempo: CaseTimelineEvent[];
  notasEstrategicas: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

/**
 * Carga completa persistida no cofre para o módulo de Dossiês.
 */
export interface DossierVaultData {
  cases: ConfidentialCase[];
}
