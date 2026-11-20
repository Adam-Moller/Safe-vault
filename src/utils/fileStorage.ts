/**
 * @file fileStorage.ts
 * @description Gerenciamento de persistência de arquivos criptografados:
 * Integra a File System Access API nativa do W3C para desktop, IndexedDB como fallback/armazenamento primário
 * e rotinas seguras de importação/exportação com verificação de integridade SHA-256.
 */

import { encryptData, decryptData, packageVaultForExport, unpackAndVerifyVault } from "./encryption";
import type { EncryptedData } from "@/types/opportunity";
import {
  saveToIndexedDB as saveToIDB,
  loadFromIndexedDB as loadFromIDB,
} from "./indexedDB";

const FILE_EXTENSION = ".enc";

/**
 * Interface estrita estendendo o objeto Window para suportar a File System Access API nativa do W3C.
 */
interface FileSystemWindow extends Window {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FileSystemFileHandle>;
  showOpenFilePicker?: (options?: {
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
    multiple?: boolean;
  }) => Promise<FileSystemFileHandle[]>;
}

/**
 * Identifica se a execução ocorre em um dispositivo móvel via User Agent.
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Avalia se o navegador suporta a File System Access API para salvar arquivos diretamente no disco do SO.
 * Desativado automaticamente em iframes e dispositivos móveis para evitar caixas de diálogo incompatíveis.
 */
export const isFileSystemSupported = (): boolean => {
  const isInIframe = window.self !== window.top;
  if (isInIframe) {
    return false;
  }

  if (isMobileDevice()) {
    return false;
  }

  const win = window as FileSystemWindow;
  return typeof win.showSaveFilePicker === "function" && typeof win.showOpenFilePicker === "function";
};

/**
 * Salva os dados criptografados diretamente em um arquivo no sistema de arquivos do desktop (File System API).
 * @param data Dados descriptografados a serem serializados e cifrados.
 * @param password Senha mestra para encriptação AES-GCM-256.
 * @param fileHandle Handle opcional de arquivo já aberto para gravação direta sem diálogo.
 * @returns Handle do arquivo gravado.
 */
export async function saveToFileSystem(
  data: EncryptedData,
  password: string,
  fileHandle?: FileSystemFileHandle
): Promise<FileSystemFileHandle> {
  const jsonString = JSON.stringify(data);
  const encryptedBase64 = await encryptData(jsonString, password);
  const filePackage = await packageVaultForExport(encryptedBase64);

  let handle = fileHandle;

  if (!handle) {
    const suggestedName = data.fileName.endsWith(FILE_EXTENSION)
      ? data.fileName
      : `${data.fileName}${FILE_EXTENSION}`;

    const win = window as FileSystemWindow;
    if (!win.showSaveFilePicker) {
      throw new Error("File System Access API não é suportada neste navegador.");
    }

    handle = await win.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: "Safe-Vault Encrypted Data",
          accept: { "application/octet-stream": [FILE_EXTENSION] },
        },
      ],
    });
  }

  const writable = await handle.createWritable();
  await writable.write(filePackage);
  await writable.close();

  return handle;
}

/**
 * Carrega e descriptografa um arquivo do sistema de arquivos utilizando a File System Access API.
 * @param password Senha mestra do cofre.
 * @param fileHandle Handle de arquivo pré-existente (opcional).
 * @returns Objeto com os dados decodificados e o handle do arquivo.
 */
export async function loadFromFileSystem(
  password: string,
  fileHandle?: FileSystemFileHandle
): Promise<{ data: EncryptedData; handle: FileSystemFileHandle }> {
  let handle = fileHandle;

  if (!handle) {
    const win = window as FileSystemWindow;
    if (!win.showOpenFilePicker) {
      throw new Error("File System Access API não é suportada neste navegador.");
    }

    const [selectedHandle] = await win.showOpenFilePicker({
      types: [
        {
          description: "Safe-Vault Encrypted Data",
          accept: { "application/octet-stream": [FILE_EXTENSION] },
        },
      ],
      multiple: false,
    });
    handle = selectedHandle;
  }

  const file = await handle.getFile();
  const fileRawContent = await file.text();

  const { ciphertextBase64 } = await unpackAndVerifyVault(fileRawContent);
  const decrypted = await decryptData(ciphertextBase64, password);
  const data = JSON.parse(decrypted) as EncryptedData;

  return { data, handle };
}

/**
 * Persiste os dados criptografados no armazenamento IndexedDB local do navegador.
 * @param data Dados descriptografados a serem cifrados e armazenados.
 * @param password Senha mestra do usuário.
 */
export async function saveToIndexedDB(
  data: EncryptedData,
  password: string
): Promise<void> {
  const jsonString = JSON.stringify(data);
  const encrypted = await encryptData(jsonString, password);
  await saveToIDB(data.fileName, encrypted);
}

/**
 * Recupera e descriptografa dados armazenados no IndexedDB pelo nome do arquivo.
 * @param fileName Nome identificador do arquivo no registro local.
 * @param password Senha mestra de descriptografia.
 * @returns Dados estruturados do cofre.
 */
export async function loadFromIndexedDB(
  fileName: string,
  password: string
): Promise<EncryptedData> {
  const encrypted = await loadFromIDB(fileName);
  if (!encrypted) {
    throw new Error("Arquivo não encontrado no armazenamento local");
  }

  const decrypted = await decryptData(encrypted, password);
  return JSON.parse(decrypted) as EncryptedData;
}

/**
 * Dispara o download no navegador de um arquivo `.enc` protegido com cabeçalho de integridade SHA-256.
 * @param data Dados do cofre a serem exportados.
 * @param password Senha mestra de cifragem.
 */
export async function downloadEncryptedFile(data: EncryptedData, password: string): Promise<void> {
  const jsonString = JSON.stringify(data);
  const encryptedBase64 = await encryptData(jsonString, password);
  const exportPackage = await packageVaultForExport(encryptedBase64);

  const fileName = data.fileName.endsWith(FILE_EXTENSION)
    ? data.fileName
    : `${data.fileName}${FILE_EXTENSION}`;

  const blob = new Blob([exportPackage], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Abre o seletor nativo de arquivos do browser para importar um backup `.enc` com validação de checksum.
 * @param password Senha mestra do backup importado.
 * @returns Dados decodificados do arquivo.
 */
export async function uploadEncryptedFile(password: string): Promise<EncryptedData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = `${FILE_EXTENSION},.json`;

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        reject(new Error("Nenhum arquivo selecionado"));
        return;
      }

      try {
        const rawContent = await file.text();
        const { ciphertextBase64 } = await unpackAndVerifyVault(rawContent);
        const decrypted = await decryptData(ciphertextBase64, password);
        const data = JSON.parse(decrypted) as EncryptedData;
        resolve(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Falha ao processar arquivo de backup";
        reject(new Error(message));
      }
    };

    input.click();
  });
}
