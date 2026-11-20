import type { Opportunity } from "./opportunity";
import type { Store, WorkforceData } from "./store";
import type { TalentVaultData } from "./talent";
import type { DossierVaultData } from "./dossier";
import type { TherapyVaultData } from "./therapy";

export type CRMType = "sales" | "workforce" | "talent" | "dossier" | "therapy";

export interface SalesCRMData {
  crmType: "sales";
  data: Opportunity[];
}

export interface WorkforceCRMData {
  crmType: "workforce";
  data: WorkforceData | Store[];
}

export interface TalentCRMData {
  crmType: "talent";
  data: TalentVaultData;
}

export interface DossierCRMData {
  crmType: "dossier";
  data: DossierVaultData;
}

export interface TherapyCRMData {
  crmType: "therapy";
  data: TherapyVaultData;
}

export type CRMData =
  | SalesCRMData
  | WorkforceCRMData
  | TalentCRMData
  | DossierCRMData
  | TherapyCRMData;

export interface EncryptedCRMFile {
  fileName: string;
  createdDate: string;
  lastModified: string;
  crmType: CRMType;
  data: any;
  checksum?: string;
}
