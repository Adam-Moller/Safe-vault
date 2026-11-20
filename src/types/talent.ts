/**
 * @file talent.ts
 * @description Definições de tipos e esquemas de dados para o módulo de Headhunting & Banco de Talentos Confidencial.
 * Armazena informações estratégicas de remuneração real, vulnerabilidades contratuais e intenção real de mudança de carreira.
 */

/**
 * Pacote de remuneração detalhado e sigiloso do executivo.
 */
export interface CompensationPackage {
  /** Salário fixo mensal em moeda corrente (BRL). */
  salarioFixoMensal: number;
  /** Bônus anual estimado ou média de PLR/bônus por metas. */
  bonusAnualEstimado: number;
  /** Indica se possui opções de compra de ações (Stock Options) ou equity relevante. */
  possuiStockOptions: boolean;
  /** Indica se está sujeito a cláusula de não-competição (Non-Compete) com o empregador atual. */
  possuiNaoCompeticao: boolean;
  /** Remuneração mínima pretendida para considerar uma proposta de transição de carreira. */
  pretensaoMinima: number;
}

/**
 * Registro de interação ou contato direto e sigiloso com o candidato.
 */
export interface TalentInteraction {
  id: string;
  data: string;
  canal: "WhatsApp" | "Telefone" | "Café / Presencial" | "LinkedIn Privado" | "Outro";
  resumo: string;
  proximoPasso?: string;
}

/**
 * Histórico de carreira sem o filtro corporativo das redes sociais públicas.
 */
export interface CareerHistoryEntry {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
  /** O motivo real e não-oficial da saída da empresa anterior (ex: choque de gestão, reestruturação, demissão velada). */
  motivoSaidaReal: string;
}

/**
 * Perfil completo de um executivo de alta liderança ou especialista crítico no cofre.
 */
export interface ExecutiveTalent {
  id: string;
  nome: string;
  cargoAtual: string;
  empresaAtual: string;
  senioridade: "C-Level" | "Diretoria" | "Gerência Sênior" | "Especialista / Lead";
  telefonePessoal: string;
  emailPessoal: string;
  localizacao: string;
  disponibilidadeMudanca: "Ouvindo Mercado" | "Buscando Ativamente" | "Intocável" | "Desesperado para Sair";
  pacoteRemuneracao: CompensationPackage;
  /** Motivo real de descontentamento com o empregador atual. */
  motivoRealInsatisfacao: string;
  perfilComportamental: string;
  historicoCarreira: CareerHistoryEntry[];
  interacoes: TalentInteraction[];
  tags: string[];
  notasConfidenciais: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

/**
 * Carga completa persistida no cofre para o módulo de Talentos.
 */
export interface TalentVaultData {
  talents: ExecutiveTalent[];
}
