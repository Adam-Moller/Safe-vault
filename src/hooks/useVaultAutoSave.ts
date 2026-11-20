/**
 * @file useVaultAutoSave.ts
 * @description Custom Hook para sincronização reativa, auto-save com debounce e persistência atômica no Safe-Vault.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { EncryptedData, VaultPayload } from "@/types/opportunity";
import type { CRMType } from "@/types/crmData";
import {
  saveToIndexedDB,
  saveToFileSystem,
  isFileSystemSupported,
} from "@/utils/fileStorage";
import { updateFileInRegistry } from "@/utils/fileRegistry";

interface UseVaultAutoSaveParams {
  isLoggedIn: boolean;
  currentFileName: string;
  password: string;
  currentCrmType: CRMType;
  fileHandle?: FileSystemFileHandle;
  getCurrentPayload: () => { dataToSave: unknown; itemCount: number };
  dependencyArray: unknown[];
}

interface UseVaultAutoSaveReturn {
  isAutoSaving: boolean;
  lastSaveTime: Date | null;
  saveNow: (showToast?: boolean) => Promise<void>;
  markInitialLoadComplete: () => void;
}

/**
 * Gerencia o ciclo de persistência segura com auto-save silencioso e salvamento manual.
 */
export function useVaultAutoSave({
  isLoggedIn,
  currentFileName,
  password,
  currentCrmType,
  fileHandle,
  getCurrentPayload,
  dependencyArray,
}: UseVaultAutoSaveParams): UseVaultAutoSaveReturn {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const isInitialLoad = useRef(true);
  const { toast } = useToast();
  const supportsFileSystem = isFileSystemSupported();

  const markInitialLoadComplete = useCallback(() => {
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 2000);
  }, []);

  const saveNow = useCallback(
    async (showToast = true) => {
      if (!currentFileName || !password || !isLoggedIn) {
        return;
      }

      setIsAutoSaving(true);
      try {
        const now = new Date().toISOString();
        const { dataToSave, itemCount } = getCurrentPayload();

        const encryptedData: EncryptedData = {
          fileName: currentFileName,
          createdDate: now,
          lastModified: now,
          crmType: currentCrmType,
          data: dataToSave as VaultPayload,
        };

        // Persistência primária atômica no IndexedDB
        await saveToIndexedDB(encryptedData, password);

        // Persistência secundária no sistema de arquivos local se houver handle ativo
        if (supportsFileSystem && fileHandle) {
          try {
            await saveToFileSystem(encryptedData, password, fileHandle);
          } catch (fsError) {
            console.warn("[AutoSave] Falha ao gravar no sistema de arquivos:", fsError);
          }
        }

        updateFileInRegistry(currentFileName, {
          lastModified: now,
          itemCount,
        });

        setLastSaveTime(new Date());

        if (showToast) {
          toast({
            title: "Cofre Atualizado",
            description: "Dados criptografados e salvos localmente com sucesso.",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Falha ao salvar dados";
        toast({
          title: "Erro ao Salvar",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsAutoSaving(false);
      }
    },
    [currentFileName, password, isLoggedIn, currentCrmType, fileHandle, getCurrentPayload, supportsFileSystem, toast]
  );

  // Efeito de auto-save reativo com debounce de 2 segundos
  useEffect(() => {
    if (!isLoggedIn || isInitialLoad.current) return;

    const timer = setTimeout(() => {
      saveNow(false);
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);

  return {
    isAutoSaving,
    lastSaveTime,
    saveNow,
    markInitialLoadComplete,
  };
}
