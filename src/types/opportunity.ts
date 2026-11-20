import type { Store, WorkforceData } from "./store";
import type { CRMType } from "./crmData";
import type { TalentVaultData } from "./talent";
import type { DossierVaultData } from "./dossier";
import type { TherapyVaultData } from "./therapy";

export interface Contact {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

export interface Interaction {
  data: string;
  tipo: string;
  resumo: string;
}

export interface Opportunity {
  id: string;
  nomeEmpresa: string;
  status: "Lead" | "Qualificado" | "Proposta" | "Negociação" | "Fechado" | "Perdido";
  valorPotencial: number;
  primeiroContatoData: string;
  ultimoContatoData: string;
  proximoContatoData: string;
  contatoPrincipal: Contact;
  dataCriacao: string;
  notasGerais: string;
  historicoInteracoes: Interaction[];
}

export type VaultPayload =
  | Opportunity[]
  | WorkforceData
  | Store[]
  | TalentVaultData
  | DossierVaultData
  | TherapyVaultData;

export interface VaultMetadata {
  schemaVersion: number;
  exportedAt?: string;
  sha256Checksum?: string;
  cipherAlgorithm: string;
}

export interface EncryptedData {
  fileName: string;
  createdDate: string;
  lastModified: string;
  crmType: CRMType;
  data: VaultPayload;
  metadata?: VaultMetadata;
}

// Helper to check if data is WorkforceData
export function isWorkforceData(data: any): data is WorkforceData {
  return data !== null && typeof data === 'object' && !Array.isArray(data) && 'stores' in data;
}

// Helper to get item count from encrypted data across all modules
export function getEncryptedDataItemCount(data: EncryptedData): number {
  if (!data || !data.data) return 0;

  switch (data.crmType) {
    case 'workforce':
      if (isWorkforceData(data.data)) {
        return data.data.stores.length;
      }
      return Array.isArray(data.data) ? data.data.length : 0;
    
    case 'talent': {
      const talentData = data.data as TalentVaultData;
      return talentData?.talents?.length || 0;
    }

    case 'dossier': {
      const dossierData = data.data as DossierVaultData;
      return dossierData?.cases?.length || 0;
    }

    case 'therapy': {
      const therapyData = data.data as TherapyVaultData;
      return therapyData?.patients?.length || 0;
    }

    case 'sales':
    default:
      return Array.isArray(data.data) ? data.data.length : 0;
  }
}

// Helper to determine CRM type from data (for backwards compatibility)
export function inferCRMType(data: EncryptedData): CRMType {
  if (data.crmType) return data.crmType;
  
  // Try to infer from data structure
  if (isWorkforceData(data.data)) return "workforce";
  if (data.data && typeof data.data === 'object') {
    if ('talents' in data.data) return "talent";
    if ('cases' in data.data) return "dossier";
    if ('patients' in data.data) return "therapy";
  }
  
  if (Array.isArray(data.data) && data.data.length > 0) {
    const firstItem = data.data[0];
    if ('funcionarios' in firstItem) return "workforce";
    if ('nomeEmpresa' in firstItem) return "sales";
  }
  
  return "sales";
}
