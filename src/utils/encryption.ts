/**
 * @file encryption.ts
 * @description Módulo de segurança criptográfica de Conhecimento Zero (Zero-Knowledge) do Safe-Vault.
 * Implementa primitivas criptográficas nativas da Web Crypto API (W3C Standard) aceleradas por hardware (AES-NI).
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;
const VAULT_MAGIC = "SAFE_VAULT";
const LEGACY_VAULT_MAGIC = "OPUS_VAULT";

/**
 * Envelope formal de exportação de dados com cabeçalho de integridade e assinatura de checksum.
 */
export interface VaultExportPackage {
  vaultHeader: {
    magic: string;
    version: number;
    cipher: "AES-GCM-256";
    kdf: "PBKDF2-SHA256-100K";
    checksumSha256: string;
    exportedAt: string;
    payloadSize: number;
  };
  payload: string;
}

/**
 * Calcula o hash criptográfico SHA-256 de uma string utilizando a Web Crypto API nativa.
 * @param data Conteúdo a ser hasheado.
 * @returns Digest em formato hexadecimal de 64 caracteres.
 */
export async function computeSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Deriva uma chave simétrica de 256 bits a partir da senha mestra utilizando PBKDF2 com 100.000 iterações de SHA-256.
 * @param password Senha mestra do usuário.
 * @param salt Salt aleatório de 16 bytes gerado criptograficamente.
 * @returns Instância de CryptoKey pronta para AES-GCM.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Criptografa dados em texto plano utilizando AES-GCM de 256 bits com IV e salt aleatórios.
 * O resultado empacota [salt (16b) + iv (12b) + ciphertext + tag de autenticação GCM] codificado em Base64.
 * @param data String em texto claro (JSON).
 * @param password Senha mestra do usuário.
 * @returns String codificada em Base64 contendo a carga cifrada.
 */
export async function encryptData(data: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    encoder.encode(data)
  );

  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Descriptografa uma carga Base64 previamente cifrada, validando a integridade da tag GCM com a senha mestra.
 * @param encryptedBase64 Carga cifrada em Base64.
 * @param password Senha mestra para derivação da chave.
 * @returns Texto claro decodificado (JSON).
 * @throws {Error} Quando a senha estiver incorreta ou a tag de autenticação for violada.
 */
export async function decryptData(encryptedBase64: string, password: string): Promise<string> {
  try {
    const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    throw new Error("Falha na descriptografia. Senha incorreta ou dados corrompidos.");
  }
}

/**
 * Envelopa a carga cifrada em uma estrutura com metadados e checksum SHA-256 para exportação/backup.
 * @param ciphertextBase64 Carga criptografada em Base64.
 * @returns String JSON formatada do pacote de exportação.
 */
export async function packageVaultForExport(ciphertextBase64: string): Promise<string> {
  const checksum = await computeSha256(ciphertextBase64);
  const vaultPackage: VaultExportPackage = {
    vaultHeader: {
      magic: VAULT_MAGIC,
      version: 2,
      cipher: "AES-GCM-256",
      kdf: "PBKDF2-SHA256-100K",
      checksumSha256: checksum,
      exportedAt: new Date().toISOString(),
      payloadSize: ciphertextBase64.length,
    },
    payload: ciphertextBase64,
  };
  return JSON.stringify(vaultPackage, null, 2);
}

/**
 * Desempacota o arquivo importado, validando matematicamente o checksum SHA-256 antes da descriptografia.
 * Suporta tanto o envelope estruturado v2 quanto cargas brutas legadas (v1).
 * @param fileContent Conteúdo bruto do arquivo de backup lido do disco.
 * @returns Objeto com a carga cifrada e o status booleano de integridade verificada.
 * @throws {Error} Se o arquivo for um envelope v2 e o checksum SHA-256 calculado for diferente do registrado no cabeçalho.
 */
export async function unpackAndVerifyVault(
  fileContent: string
): Promise<{ ciphertextBase64: string; verified: boolean }> {
  const trimmed = fileContent.trim();

  if (trimmed.startsWith("{") && trimmed.includes("vaultHeader")) {
    try {
      const parsed = JSON.parse(trimmed) as Partial<VaultExportPackage>;
      const magic = parsed.vaultHeader?.magic;
      const isRecognizedMagic = magic === VAULT_MAGIC || magic === LEGACY_VAULT_MAGIC;

      if (isRecognizedMagic && parsed.payload && parsed.vaultHeader?.checksumSha256) {
        const computedChecksum = await computeSha256(parsed.payload);
        if (computedChecksum !== parsed.vaultHeader.checksumSha256) {
          throw new Error(
            "Violação de Integridade: Checksum SHA-256 não confere. O arquivo de backup foi adulterado ou corrompido em disco."
          );
        }
        console.log("[VaultIntegrity] Checksum SHA-256 validado com sucesso:", computedChecksum);
        return { ciphertextBase64: parsed.payload, verified: true };
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Violação de Integridade")) {
        throw err;
      }
      console.warn("[VaultIntegrity] Falha ao analisar envelope v2, tentando como payload bruto:", err);
    }
  }

  return { ciphertextBase64: trimmed, verified: false };
}
