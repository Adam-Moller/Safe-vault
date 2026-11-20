/**
 * @file therapy.ts
 * @description Estruturas de dados para o módulo de Prontuário Clínico & Notas Terapêuticas Confidenciais.
 * Protege anotações de evolução clínica e a camada subjetiva de contratransferência sob criptografia local.
 */

/**
 * Registro de encontro clínico ou sessão terapêutica individual.
 */
export interface TherapySession {
  id: string;
  data: string;
  duracaoMinutos: number;
  /** Conteúdo manifesto trazido conscientemente pelo paciente na sessão. */
  relatoPaciente: string;
  /** Hipóteses diagnósticas preliminares e conexões teóricas do profissional. */
  hipotesesDiagnosticas: string;
  /** Sentimentos, reações afetivas e percepções internas despertadas no terapeuta pela relação clínica. */
  notasContratransferencia: string;
  /** Técnicas, manejos e intervenções verbais realizadas no encontro. */
  intervencoesRealizadas: string;
  /** Acordos práticos e temas combinados para elaboração na próxima sessão. */
  combinadosEProximaSessao: string;
}

/**
 * Ficha confidencial do paciente identificada apenas por codinome ou iniciais.
 */
export interface PatientProfile {
  id: string;
  /** Iniciais ou codinome do paciente para anonimização total de dados civis. */
  identificadorOuIniciais: string;
  status: "Ativo" | "Em Pausa" | "Alta" | "Interrompido";
  frequencia: "Semanal" | "Quinzenal" | "Esporádica";
  diaHoraPreferencia: string;
  contatoEmergencia: string;
  medicacaoRelatada: string;
  /** Destaque crítico para ideação de crise, risco de recaída ou vulnerabilidade física. */
  alertaRiscoIminente: string;
  objetivosTerapeuticos: string[];
  sessoes: TherapySession[];
  notasGerais: string;
  dataInicio: string;
  ultimaSessaoData?: string;
}

/**
 * Carga completa persistida no cofre para o módulo de Prontuário Clínico.
 */
export interface TherapyVaultData {
  patients: PatientProfile[];
}
