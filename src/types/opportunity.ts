/**
 * @file opportunity.ts
 * @description Estruturas de dados do módulo de Vendas B2B e especificações do envelope de dados criptografados.
 */

import type { Store, WorkforceData } from "./store";
import type { CRMType } from "./crmData";
import type { TalentVaultData } from "./talent";
import type { DossierVaultData } from "./dossier";
import type { TherapyVaultData } from "./therapy";

/**
 * Ponto de contato principal de uma oportunidade comercial.
 */
export interface Contact {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

/**
 * Registro de interação ou evento de relacionamento com o cliente.
 */
export interface Interaction {
  data: string;
  tipo: string;
  resumo: string;
}

/**
 * Entidade de oportunidade de venda ou conta estratégica no cofre.
 */
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

/**
 * União discriminada estrita de todas as cargas de dados possíveis em um cofre descriptografado.
 */
export type VaultPayload =
  | Opportunity[]
  | WorkforceData
  | Store[]
  | TalentVaultData
  | DossierVaultData
  | TherapyVaultData;

/**
 * Metadados de segurança e integridade anexados ao cofre.
 */
export interface VaultMetadata {
  schemaVersion: number;
  exportedAt?: string;
  sha256Checksum?: string;
  cipherAlgorithm: string;
}

/**
 * Estrutura serializável contendo o envelope de dados decodificados ou preparados para persistência.
 */
export interface EncryptedData {
  fileName: string;
  createdDate: string;
  lastModified: string;
  crmType: CRMType;
  data: VaultPayload;
  metadata?: VaultMetadata;
}

/**
 * Type Guard que verifica se um objeto possui a estrutura de WorkforceData (Lojas e Equipes).
 * @param data Carga desconhecida a ser validada.
 */
export function isWorkforceData(data: unknown): data is WorkforceData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "stores" in data
  );
}

/**
 * Type Guard que verifica se um objeto possui a estrutura de TalentVaultData (Headhunting).
 * @param data Carga desconhecida a ser validada.
 */
export function isTalentVaultData(data: unknown): data is TalentVaultData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "talents" in data
  );
}

/**
 * Type Guard que verifica se um objeto possui a estrutura de DossierVaultData (Jurídico / Investigação).
 * @param data Carga desconhecida a ser validada.
 */
export function isDossierVaultData(data: unknown): data is DossierVaultData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "cases" in data
  );
}

/**
 * Type Guard que verifica se um objeto possui a estrutura de TherapyVaultData (Prontuário Clínico).
 * @param data Carga desconhecida a ser validada.
 */
export function isTherapyVaultData(data: unknown): data is TherapyVaultData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "patients" in data
  );
}

/**
 * Calcula a contagem de itens primários do cofre com base no tipo de domínio ativo.
 * @param data Envelope de dados descriptografados.
 * @returns Número total de registros de domínio cadastrados.
 */
export function getEncryptedDataItemCount(data: EncryptedData): number {
  if (!data || !data.data) return 0;

  switch (data.crmType) {
    case "workforce":
      if (isWorkforceData(data.data)) {
        return data.data.stores.length;
      }
      return Array.isArray(data.data) ? data.data.length : 0;

    case "talent":
      if (isTalentVaultData(data.data)) {
        return data.data.talents.length;
      }
      return 0;

    case "dossier":
      if (isDossierVaultData(data.data)) {
        return data.data.cases.length;
      }
      return 0;

    case "therapy":
      if (isTherapyVaultData(data.data)) {
        return data.data.patients.length;
      }
      return 0;

    case "sales":
    default:
      return Array.isArray(data.data) ? data.data.length : 0;
  }
}

/**
 * Infere o tipo de CRM a partir da estrutura interna da carga de dados (suporte a arquivos legados).
 * @param data Envelope com dados descriptografados.
 * @returns Tipo de CRM correspondente.
 */
export function inferCRMType(data: EncryptedData): CRMType {
  if (data.crmType) return data.crmType;

  if (isWorkforceData(data.data)) return "workforce";
  if (isTalentVaultData(data.data)) return "talent";
  if (isDossierVaultData(data.data)) return "dossier";
  if (isTherapyVaultData(data.data)) return "therapy";

  if (Array.isArray(data.data) && data.data.length > 0) {
    const firstItem = data.data[0] as Record<string, unknown>;
    if ("funcionarios" in firstItem) return "workforce";
    if ("nomeEmpresa" in firstItem) return "sales";
  }

  return "sales";
}
