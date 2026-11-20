export interface TherapySession {
  id: string;
  data: string;
  duracaoMinutos: number;
  relatoPaciente: string; // Tópicos trazidos conscientemente
  hipotesesDiagnosticas: string; // Interpretações clínicas preliminares
  notasContratransferencia: string; // Reações e sentimentos do próprio terapeuta durante a sessão
  intervencoesRealizadas: string;
  combinadosEProximaSessao: string;
}

export interface PatientProfile {
  id: string;
  identificadorOuIniciais: string;
  status: "Ativo" | "Em Pausa" | "Alta" | "Interrompido";
  frequencia: "Semanal" | "Quinzenal" | "Esporádica";
  diaHoraPreferencia: string;
  contatoEmergencia: string;
  medicacaoRelatada: string;
  alertaRiscoIminente: string; // Ex: Ideação suicida, violência doméstica, recaídas
  objetivosTerapeuticos: string[];
  sessoes: TherapySession[];
  notasGerais: string;
  dataInicio: string;
  ultimaSessaoData?: string;
}

export interface TherapyVaultData {
  patients: PatientProfile[];
}
