export interface CompensationPackage {
  salarioFixoMensal: number;
  bonusAnualEstimado: number;
  possuiStockOptions: boolean;
  possuiNaoCompeticao: boolean;
  pretensaoMinima: number;
}

export interface TalentInteraction {
  id: string;
  data: string;
  canal: "WhatsApp" | "Telefone" | "Café / Presencial" | "LinkedIn Privado" | "Outro";
  resumo: string;
  proximoPasso?: string;
}

export interface CareerHistoryEntry {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
  motivoSaidaReal: string; // Motivo não público / sem verniz corporativo
}

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
  motivoRealInsatisfacao: string; // Sigiloso
  perfilComportamental: string;
  historicoCarreira: CareerHistoryEntry[];
  interacoes: TalentInteraction[];
  tags: string[];
  notasConfidenciais: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

export interface TalentVaultData {
  talents: ExecutiveTalent[];
}
