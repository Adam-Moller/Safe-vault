// Web Crypto API encryption utilities using AES-GCM + SHA-256 Integrity Verification

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;
const VAULT_MAGIC = "SAFE_VAULT";
const LEGACY_VAULT_MAGIC = "OPUS_VAULT";

export interface VaultExportPackage {
  vaultHeader: {
    magic: typeof VAULT_MAGIC;
    version: number;
    cipher: "AES-GCM-256";
    kdf: "PBKDF2-SHA256-100K";
    checksumSha256: string;
    exportedAt: string;
    payloadSize: number;
  };
  payload: string;
}

export async function computeSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

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

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

export async function decryptData(encryptedBase64: string, password: string): Promise<string> {
  try {
    // Decode base64
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    // Extract salt, iv, and encrypted data
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
  } catch (error) {
    throw new Error("Falha na descriptografia. Senha incorreta ou dados corrompidos.");
  }
}

/**
 * Cria pacote de exportação com assinatura/checksum SHA-256 e metadata de integridade
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
 * Desempacota e valida a integridade do arquivo importado antes da descriptografia
 */
export async function unpackAndVerifyVault(fileContent: string): Promise<{ ciphertextBase64: string; verified: boolean }> {
  const trimmed = fileContent.trim();

  // Verifica se é o formato v2 envelopado (JSON)
  if (trimmed.startsWith("{") && trimmed.includes("vaultHeader")) {
    try {
      const parsed = JSON.parse(trimmed) as VaultExportPackage;
      const isRecognizedMagic = parsed.vaultHeader?.magic === VAULT_MAGIC || parsed.vaultHeader?.magic === (LEGACY_VAULT_MAGIC as any);
      if (isRecognizedMagic && parsed.payload) {
        const computedChecksum = await computeSha256(parsed.payload);
        if (computedChecksum !== parsed.vaultHeader.checksumSha256) {
          throw new Error("Violação de Integridade: Checksum SHA-256 não confere. O arquivo de backup foi adulterado ou corrompido em disco.");
        }
        console.log("[VaultIntegrity] Checksum SHA-256 validado com sucesso:", computedChecksum);
        return { ciphertextBase64: parsed.payload, verified: true };
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Violação de Integridade")) {
        throw err;
      }
      console.warn("[VaultIntegrity] Falha ao analisar envelope v2, tentando como payload bruto:", err);
    }
  }

  // Compatibilidade retroativa com v1 (payload base64 direto)
  return { ciphertextBase64: trimmed, verified: false };
}
