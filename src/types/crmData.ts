/**
 * @file crmData.ts
 * @description Contratos de dados centrais e união discriminada de módulos de negócio do Safe-Vault.
 */

import type { Opportunity, VaultPayload } from "./opportunity";
import type { Store, WorkforceData } from "./store";
import type { TalentVaultData } from "./talent";
import type { DossierVaultData } from "./dossier";
import type { TherapyVaultData } from "./therapy";

/**
 * Identificador do perfil ou módulo vertical em execução no cofre.
 * - `sales`: Gestão de vendas B2B e carteira confidencial de clientes.
 * - `workforce`: Gestão regional de filiais, equipes e diário de campo.
 * - `talent`: Headhunting, pacotes de compensação e abordagem sigilosa.
 * - `dossier`: Dossiês de litígio, fontes confidenciais e estratégia pré-processual.
 * - `therapy`: Prontuário clínico com notas de sessão e contratransferência.
 */
export type CRMType = "sales" | "workforce" | "talent" | "dossier" | "therapy";

/**
 * Dados encapsulados do módulo de Vendas B2B.
 */
export interface SalesCRMData {
  crmType: "sales";
  data: Opportunity[];
}

/**
 * Dados encapsulados do módulo de Gestão Regional de Lojas.
 */
export interface WorkforceCRMData {
  crmType: "workforce";
  data: WorkforceData | Store[];
}

/**
 * Dados encapsulados do módulo de Headhunting e Talentos.
 */
export interface TalentCRMData {
  crmType: "talent";
  data: TalentVaultData;
}

/**
 * Dados encapsulados do módulo de Dossiês Confidenciais e Investigação.
 */
export interface DossierCRMData {
  crmType: "dossier";
  data: DossierVaultData;
}

/**
 * Dados encapsulados do módulo de Prontuário e Notas Clínicas.
 */
export interface TherapyCRMData {
  crmType: "therapy";
  data: TherapyVaultData;
}

/**
 * União discriminada de todos os formatos de dados de cofre aceitos pelo sistema.
 */
export type CRMData =
  | SalesCRMData
  | WorkforceCRMData
  | TalentCRMData
  | DossierCRMData
  | TherapyCRMData;

/**
 * Representação em arquivo do cofre com metadados de ciclo de vida e integridade.
 */
export interface EncryptedCRMFile {
  fileName: string;
  createdDate: string;
  lastModified: string;
  crmType: CRMType;
  data: VaultPayload;
  checksum?: string;
}
