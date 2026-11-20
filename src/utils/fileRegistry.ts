/**
 * @file fileRegistry.ts
 * @description Catálogo local de arquivos e cofres mantidos no dispositivo.
 * Registra metadados não-sigilosos no LocalStorage (nome do arquivo, tipo de CRM, contagem de itens, data do último acesso)
 * e realiza auditoria cruzada de integridade com as entradas persistidas no IndexedDB.
 */

import type { CRMType } from "@/types/crmData";
import { fileExistsInIndexedDB, getAllFilesFromIndexedDB } from "@/utils/indexedDB";

/**
 * Entrada de registro de arquivo armazenada no catálogo local.
 */
export interface FileRegistryEntry {
  fileName: string;
  lastModified: string;
  lastOpened: string;
  crmType: CRMType;
  itemCount: number;
  opportunityCount?: number;
}

/**
 * Entrada de registro enriquecida com o status de presença dos dados cifrados no IndexedDB.
 */
export interface VerifiedFileEntry extends FileRegistryEntry {
  hasData: boolean;
}

const REGISTRY_KEY = "crm-file-registry";

/**
 * Migra formatos legados do registro para a estrutura uniforme atual.
 * @param entry Objeto cru recuperado do LocalStorage.
 */
function migrateRegistryEntry(entry: Record<string, unknown>): FileRegistryEntry {
  const crmType = (entry.crmType as CRMType) || "sales";
  const itemCount = typeof entry.itemCount === "number"
    ? entry.itemCount
    : typeof entry.opportunityCount === "number"
    ? entry.opportunityCount
    : 0;

  return {
    fileName: String(entry.fileName || ""),
    lastModified: String(entry.lastModified || new Date().toISOString()),
    lastOpened: String(entry.lastOpened || new Date().toISOString()),
    crmType,
    itemCount,
  };
}

/**
 * Obtém a lista completa de arquivos registrados no LocalStorage.
 */
export function getFileRegistry(): FileRegistryEntry[] {
  try {
    const stored = localStorage.getItem(REGISTRY_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Record<string, unknown>[];
    return parsed.map(migrateRegistryEntry);
  } catch (error) {
    console.error("Erro ao ler registro de arquivos:", error);
    return [];
  }
}

/**
 * Adiciona ou atualiza uma entrada de arquivo no catálogo.
 * @param entry Dados do arquivo a ser registrado.
 */
export function addFileToRegistry(entry: FileRegistryEntry): void {
  try {
    const registry = getFileRegistry();
    const existingIndex = registry.findIndex((e) => e.fileName === entry.fileName);

    const normalizedEntry: FileRegistryEntry = {
      fileName: entry.fileName,
      lastModified: entry.lastModified,
      lastOpened: entry.lastOpened,
      crmType: entry.crmType || "sales",
      itemCount: entry.itemCount ?? 0,
    };

    if (existingIndex >= 0) {
      registry[existingIndex] = normalizedEntry;
    } else {
      registry.push(normalizedEntry);
    }

    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (error) {
    console.error("Erro ao adicionar ao registro:", error);
  }
}

/**
 * Atualiza campos parciais de um arquivo existente no catálogo.
 * @param fileName Identificador do arquivo.
 * @param updates Modificações parciais a aplicar.
 */
export function updateFileInRegistry(
  fileName: string,
  updates: Partial<FileRegistryEntry>
): void {
  try {
    const registry = getFileRegistry();
    const index = registry.findIndex((e) => e.fileName === fileName);

    if (index >= 0) {
      registry[index] = { ...registry[index], ...updates };
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    }
  } catch (error) {
    console.error("Erro ao atualizar registro de arquivo:", error);
  }
}

/**
 * Remove um arquivo do catálogo local do LocalStorage.
 * @param fileName Nome do arquivo a ser removido.
 */
export function removeFileFromRegistry(fileName: string): void {
  try {
    const registry = getFileRegistry();
    const filtered = registry.filter((e) => e.fileName !== fileName);
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Erro ao remover do registro:", error);
  }
}

/**
 * Filtra as entradas do catálogo pelo tipo de módulo de negócio.
 * @param crmType Tipo de CRM desejado.
 */
export function getRegistryEntriesByCRMType(crmType: CRMType): FileRegistryEntry[] {
  return getFileRegistry().filter((e) => e.crmType === crmType);
}

/**
 * Retorna o rótulo descritivo e pluralizado para a contagem de itens de acordo com o domínio.
 * @param entry Entrada do registro.
 */
export function getItemCountLabel(entry: FileRegistryEntry): string {
  switch (entry.crmType) {
    case "workforce":
      return `${entry.itemCount} loja${entry.itemCount !== 1 ? "s" : ""}`;
    case "talent":
      return `${entry.itemCount} executivo${entry.itemCount !== 1 ? "s" : ""}`;
    case "dossier":
      return `${entry.itemCount} caso${entry.itemCount !== 1 ? "s" : ""}`;
    case "therapy":
      return `${entry.itemCount} paciente${entry.itemCount !== 1 ? "s" : ""}`;
    case "sales":
    default:
      return `${entry.itemCount} oportunidade${entry.itemCount !== 1 ? "s" : ""}`;
  }
}

/**
 * Audita a integridade física de todos os arquivos do catálogo comparando com as chaves reais do IndexedDB.
 * @returns Lista de entradas com o indicador `hasData` validado.
 */
export async function verifyRegistryIntegrity(): Promise<VerifiedFileEntry[]> {
  const registry = getFileRegistry();

  const verified = await Promise.all(
    registry.map(async (file) => {
      const hasData = await fileExistsInIndexedDB(file.fileName);
      return {
        ...file,
        hasData,
      };
    })
  );

  return verified;
}

/**
 * Sincroniza o LocalStorage com o IndexedDB descobrindo arquivos órfãos em ambas as direções.
 */
export async function syncRegistryWithIndexedDB(): Promise<{
  added: string[];
  orphaned: string[];
}> {
  const registry = getFileRegistry();
  const indexedDBFiles = await getAllFilesFromIndexedDB();

  const registryNames = new Set(registry.map((r) => r.fileName));
  const indexedDBNames = new Set(indexedDBFiles);

  const added: string[] = [];
  for (const fileName of indexedDBFiles) {
    if (!registryNames.has(fileName)) {
      addFileToRegistry({
        fileName,
        lastModified: new Date().toISOString(),
        lastOpened: new Date().toISOString(),
        crmType: "sales",
        itemCount: 0,
      });
      added.push(fileName);
    }
  }

  const orphaned = registry
    .filter((r) => !indexedDBNames.has(r.fileName))
    .map((r) => r.fileName);

  return { added, orphaned };
}
