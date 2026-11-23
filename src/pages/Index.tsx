/**
 * @file Index.tsx
 * @description Ponto de entrada e orquestrador principal da aplicação Safe-Vault.
 * Gerencia a autenticação local, seleção de domínios, roteamento dos módulos e persistência segura.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityModal } from "@/components/OpportunityModal";
import { InteractionModal } from "@/components/InteractionModal";
import { StoreManagement } from "@/pages/StoreManagement";
import { TalentManagement } from "@/pages/TalentManagement";
import { DossierManagement } from "@/pages/DossierManagement";
import { TherapyManagement } from "@/pages/TherapyManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, LogOut, Save, Search, ShieldCheck, Moon, Sun } from "lucide-react";
import type { Opportunity, EncryptedData, Interaction, VaultPayload } from "@/types/opportunity";
import type { Store, WorkforceData, BadgeTemplate } from "@/types/store";
import type { TalentVaultData } from "@/types/talent";
import type { DossierVaultData } from "@/types/dossier";
import type { TherapyVaultData } from "@/types/therapy";
import type { CRMType } from "@/types/crmData";
import { ensureWorkforceData } from "@/utils/dataMigration";
import { downloadEncryptedFile, saveToIndexedDB } from "@/utils/fileStorage";
import { addFileToRegistry, updateFileInRegistry } from "@/utils/fileRegistry";
import { useVaultAutoSave } from "@/hooks/useVaultAutoSave";
import {
  DEMO_SALES_DATA,
  DEMO_WORKFORCE_DATA,
  DEMO_TALENT_DATA,
  DEMO_DOSSIER_DATA,
  DEMO_THERAPY_DATA,
  DEMO_VAULT_NAMES,
} from "@/utils/demoData";

const VALID_CRM_MODULES: readonly CRMType[] = ["sales", "workforce", "talent", "dossier", "therapy"];

/**
 * Type Guard que valida se o parâmetro de URL corresponde a um módulo válido do Safe-Vault.
 * @param value Valor textual extraído da query string.
 */
function isValidCRMType(value: string | null): value is CRMType {
  return value !== null && (VALID_CRM_MODULES as readonly string[]).includes(value);
}

/**
 * Extrai parâmetros de query string tanto de `window.location.search` quanto de rotas hash (`#/?demo=...`).
 * @param key Chave do parâmetro desejado.
 */
function getUrlParameter(key: string): string | null {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);
  const fromSearch = searchParams.get(key);
  if (fromSearch !== null) return fromSearch;

  if (window.location.hash.includes("?")) {
    const hashQuery = window.location.hash.split("?")[1];
    const hashParams = new URLSearchParams(hashQuery);
    return hashParams.get(key);
  }

  return null;
}

/**
 * Determina o estado inicial do tema (Dark/Light) priorizando o parâmetro `?theme=` da URL.
 */
function resolveInitialDarkMode(): boolean {
  const themeParam = getUrlParameter("theme");
  if (themeParam === "dark") return true;
  if (themeParam === "light") return false;

  if (typeof window !== "undefined") {
    const savedTheme = window.localStorage.getItem("safe_vault_theme");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return document.documentElement.classList.contains("dark");
  }
  return false;
}

const Index = () => {
  const initialDemoModule = useMemo(() => {
    const demoParam = getUrlParameter("demo");
    return isValidCRMType(demoParam) ? demoParam : null;
  }, []);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const dark = resolveInitialDarkMode();
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
    }
    return dark;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => initialDemoModule !== null);
  const [password, setPassword] = useState<string>(() =>
    initialDemoModule ? "DemoSandbox#2025" : ""
  );
  const [currentFileName, setCurrentFileName] = useState<string>(() =>
    initialDemoModule ? DEMO_VAULT_NAMES[initialDemoModule] : ""
  );
  const [currentCrmType, setCurrentCrmType] = useState<CRMType>(() =>
    initialDemoModule || "sales"
  );
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | undefined>();

  // Estados dos domínios (pré-populados se o modo demo for acionado via URL)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    initialDemoModule === "sales" ? DEMO_SALES_DATA : []
  );
  const [workforceData, setWorkforceData] = useState<WorkforceData>(() =>
    initialDemoModule === "workforce"
      ? DEMO_WORKFORCE_DATA
      : {
          stores: [],
          employees: [],
          badgeTemplates: [],
        }
  );
  const [talentData, setTalentData] = useState<TalentVaultData>(() =>
    initialDemoModule === "talent" ? DEMO_TALENT_DATA : { talents: [] }
  );
  const [dossierData, setDossierData] = useState<DossierVaultData>(() =>
    initialDemoModule === "dossier" ? DEMO_DOSSIER_DATA : { cases: [] }
  );
  const [therapyData, setTherapyData] = useState<TherapyVaultData>(() =>
    initialDemoModule === "therapy" ? DEMO_THERAPY_DATA : { patients: [] }
  );

  // Sincroniza a classe `dark` na raiz do documento HTML
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("safe_vault_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  /**
   * Alterna entre os modos visual Escuro (Dark) e Claro (Light).
   */
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Estados de UI e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | undefined>();
  const { toast } = useToast();

  /**
   * Retorna os dados ativamente manipulados pelo domínio em execução.
   */
  const getCurrentDataPayload = useCallback((): { dataToSave: VaultPayload; itemCount: number } => {
    switch (currentCrmType) {
      case "workforce":
        return { dataToSave: workforceData, itemCount: workforceData.stores.length };
      case "talent":
        return { dataToSave: talentData, itemCount: talentData.talents.length };
      case "dossier":
        return { dataToSave: dossierData, itemCount: dossierData.cases.length };
      case "therapy":
        return { dataToSave: therapyData, itemCount: therapyData.patients.length };
      case "sales":
      default:
        return { dataToSave: opportunities, itemCount: opportunities.length };
    }
  }, [currentCrmType, workforceData, talentData, dossierData, therapyData, opportunities]);

  // Hook desacoplado de Auto-Save e Persistência Atômica
  const { isAutoSaving, lastSaveTime, saveNow, markInitialLoadComplete } = useVaultAutoSave({
    isLoggedIn,
    currentFileName,
    password,
    currentCrmType,
    fileHandle,
    getCurrentPayload: getCurrentDataPayload,
    dependencyArray: [opportunities, workforceData, talentData, dossierData, therapyData],
  });

  useEffect(() => {
    if (initialDemoModule) {
      markInitialLoadComplete();
    }
  }, [initialDemoModule, markInitialLoadComplete]);

  const handleLogin = (data: EncryptedData, loginPassword: string, handle?: FileSystemFileHandle) => {
    setPassword(loginPassword);
    setCurrentFileName(data.fileName);
    const crmType = data.crmType || "sales";
    setCurrentCrmType(crmType);
    setFileHandle(handle);

    let itemCount = 0;
    let itemLabel = "itens";

    if (crmType === "sales") {
      const opps = (Array.isArray(data.data) ? data.data : []) as Opportunity[];
      setOpportunities(opps);
      itemCount = opps.length;
      itemLabel = "oportunidades";
    } else if (crmType === "workforce") {
      const rawData = data.data as Store[] | WorkforceData;
      const wfData = ensureWorkforceData(rawData);
      setWorkforceData(wfData);
      itemCount = wfData.stores.length;
      itemLabel = "lojas";
    } else if (crmType === "talent") {
      const tData = data.data && typeof data.data === "object" && "talents" in data.data
        ? (data.data as TalentVaultData)
        : { talents: [] };
      setTalentData(tData);
      itemCount = tData.talents.length;
      itemLabel = "executivos";
    } else if (crmType === "dossier") {
      const dData = data.data && typeof data.data === "object" && "cases" in data.data
        ? (data.data as DossierVaultData)
        : { cases: [] };
      setDossierData(dData);
      itemCount = dData.cases.length;
      itemLabel = "casos";
    } else if (crmType === "therapy") {
      const thData = data.data && typeof data.data === "object" && "patients" in data.data
        ? (data.data as TherapyVaultData)
        : { patients: [] };
      setTherapyData(thData);
      itemCount = thData.patients.length;
      itemLabel = "prontuários";
    }

    setIsLoggedIn(true);
    markInitialLoadComplete();

    updateFileInRegistry(data.fileName, {
      lastOpened: new Date().toISOString(),
      crmType,
      itemCount,
      lastModified: data.lastModified,
    });

    toast({
      title: "Cofre Aberto com Sucesso",
      description: `Carregados ${itemCount} ${itemLabel} de ${data.fileName}`,
    });
  };

  const handleCreateNew = async (newPassword: string, fileName: string, crmType: CRMType) => {
    setPassword(newPassword);
    setCurrentFileName(fileName);
    setCurrentCrmType(crmType);

    let initialData: VaultPayload = [];
    if (crmType === "sales") {
      setOpportunities([]);
      initialData = [];
    } else if (crmType === "workforce") {
      const initWf: WorkforceData = { stores: [], employees: [], badgeTemplates: [] };
      setWorkforceData(initWf);
      initialData = initWf;
    } else if (crmType === "talent") {
      const initTalent: TalentVaultData = { talents: [] };
      setTalentData(initTalent);
      initialData = initTalent;
    } else if (crmType === "dossier") {
      const initDossier: DossierVaultData = { cases: [] };
      setDossierData(initDossier);
      initialData = initDossier;
    } else if (crmType === "therapy") {
      const initTherapy: TherapyVaultData = { patients: [] };
      setTherapyData(initTherapy);
      initialData = initTherapy;
    }

    setIsLoggedIn(true);
    markInitialLoadComplete();

    addFileToRegistry({
      fileName,
      lastModified: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      crmType,
      itemCount: 0,
    });

    try {
      const now = new Date().toISOString();
      const encryptedData: EncryptedData = {
        fileName,
        createdDate: now,
        lastModified: now,
        crmType,
        data: initialData,
      };

      await saveToIndexedDB(encryptedData, newPassword);

      const typeLabels: Record<CRMType, string> = {
        sales: "CRM de Vendas B2B",
        workforce: "Gestão Regional de Lojas",
        talent: "Headhunting & Talentos",
        dossier: "Dossiês Confidenciais",
        therapy: "Prontuário & Notas Clínicas",
      };

      toast({
        title: "Novo Cofre Criado",
        description: `${fileName} (${typeLabels[crmType]}) está protegido e pronto para uso.`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao criar arquivo";
      toast({
        title: "Erro de Criação",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSaveOpportunity = (opportunity: Opportunity) => {
    setOpportunities((prev) =>
      prev.some((o) => o.id === opportunity.id)
        ? prev.map((o) => (o.id === opportunity.id ? opportunity : o))
        : [...prev, opportunity]
    );
    setEditingOpportunity(undefined);
  };

  const handleDeleteOpportunity = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta oportunidade?")) return;
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    toast({
      title: "Oportunidade Removida",
      description: "A oportunidade foi excluída do cofre.",
    });
  };

  const handleAddInteraction = (interaction: Interaction, nextContactDate?: string) => {
    if (!selectedOpportunity) return;

    const updatedOpportunity: Opportunity = {
      ...selectedOpportunity,
      historicoInteracoes: [...selectedOpportunity.historicoInteracoes, interaction],
      ultimoContatoData: interaction.data,
      ...(nextContactDate && { proximoContatoData: nextContactDate }),
    };

    handleSaveOpportunity(updatedOpportunity);
    setSelectedOpportunity(undefined);
  };

  const handleSaveStore = (store: Store) => {
    setWorkforceData((prev) => ({
      ...prev,
      stores: prev.stores.some((s) => s.id === store.id)
        ? prev.stores.map((s) => (s.id === store.id ? store : s))
        : [...prev.stores, store],
    }));
  };

  const handleDeleteStore = (id: string) => {
    setWorkforceData((prev) => ({
      ...prev,
      stores: prev.stores.filter((s) => s.id !== id),
    }));
  };

  const handleSaveBadgeTemplates = (templates: BadgeTemplate[]) => {
    setWorkforceData((prev) => ({
      ...prev,
      badgeTemplates: templates,
    }));
  };

  const handleExportBackup = async () => {
    if (!currentFileName || !password) return;

    try {
      const now = new Date().toISOString();
      const { dataToSave } = getCurrentDataPayload();

      const encryptedData: EncryptedData = {
        fileName: currentFileName,
        createdDate: now,
        lastModified: now,
        crmType: currentCrmType,
        data: dataToSave,
      };

      await downloadEncryptedFile(encryptedData, password);
      toast({
        title: "Backup Exportado",
        description: "Arquivo criptografado baixado com checksum de integridade SHA-256.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao exportar backup";
      toast({
        title: "Erro ao Exportar",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente bloquear o cofre e sair?")) {
      setIsLoggedIn(false);
      setPassword("");
      setCurrentFileName("");
      setFileHandle(undefined);
      setOpportunities([]);
      setWorkforceData({ stores: [], employees: [], badgeTemplates: [] });
      setTalentData({ talents: [] });
      setDossierData({ cases: [] });
      setTherapyData({ patients: [] });
      toast({
        title: "Cofre Bloqueado",
        description: "A memória descriptografada foi limpa com segurança.",
      });
    }
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        opp.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.contatoPrincipal.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [opportunities, searchTerm, statusFilter]);

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onCreateNew={handleCreateNew}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  const getModuleTitle = () => {
    switch (currentCrmType) {
      case "workforce":
        return "Gestão Regional & Lojas";
      case "talent":
        return "Headhunting & Talentos C-Level";
      case "dossier":
        return "Dossiês Confidenciais & Jurídico";
      case "therapy":
        return "Prontuário & Notas Clínicas";
      case "sales":
      default:
        return "CRM de Vendas B2B";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Unificado */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Safe-Vault</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Zero-Knowledge
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                {currentFileName} • <span className="font-medium text-foreground">{getModuleTitle()}</span>
              </p>
              {lastSaveTime && (
                <p className="text-[11px] text-muted-foreground">
                  Último save: {lastSaveTime.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleToggleTheme}
                variant="outline"
                size="sm"
                title={isDarkMode ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="shrink-0">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Bloquear / Sair</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {isAutoSaving && (
              <span className="text-xs text-muted-foreground animate-pulse">Criptografando & Salvando...</span>
            )}
            <Button onClick={handleExportBackup} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              <span>Exportar Backup (.enc)</span>
            </Button>
            <Button onClick={() => saveNow(true)} variant="default" size="sm" disabled={isAutoSaving}>
              <Save className="w-4 h-4 mr-2" />
              <span>Salvar Agora</span>
            </Button>
          </div>

          {currentCrmType === "sales" && (
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <Button onClick={() => setIsOpportunityModalOpen(true)} className="shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Nova Oportunidade
              </Button>

              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa ou contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Qualificado">Qualificado</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Negociação">Negociação</SelectItem>
                  <SelectItem value="Fechado">Fechado</SelectItem>
                  <SelectItem value="Perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </header>

      {/* Main Content por Módulo */}
      <main className="container mx-auto px-4 py-6">
        {currentCrmType === "sales" && (
          <>
            {opportunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma oportunidade ainda no seu blackbook de vendas</p>
                <Button onClick={() => setIsOpportunityModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Oportunidade
                </Button>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma oportunidade encontrada com esses filtros</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredOpportunities.length} de {opportunities.length} oportunidades
                </p>
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onEdit={(opp) => {
                      setEditingOpportunity(opp);
                      setIsOpportunityModalOpen(true);
                    }}
                    onDelete={handleDeleteOpportunity}
                    onAddInteraction={(opp) => {
                      setSelectedOpportunity(opp);
                      setIsInteractionModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentCrmType === "workforce" && (
          <StoreManagement
            stores={workforceData.stores}
            onSaveStore={handleSaveStore}
            onDeleteStore={handleDeleteStore}
            badgeTemplates={workforceData.badgeTemplates}
            onSaveBadgeTemplates={handleSaveBadgeTemplates}
          />
        )}

        {currentCrmType === "talent" && (
          <TalentManagement
            data={talentData}
            onUpdate={setTalentData}
            fileName={currentFileName}
          />
        )}

        {currentCrmType === "dossier" && (
          <DossierManagement
            data={dossierData}
            onUpdate={setDossierData}
            fileName={currentFileName}
          />
        )}

        {currentCrmType === "therapy" && (
          <TherapyManagement
            data={therapyData}
            onUpdate={setTherapyData}
            fileName={currentFileName}
          />
        )}
      </main>

      {/* Modals de Vendas */}
      <OpportunityModal
        open={isOpportunityModalOpen}
        onClose={() => {
          setIsOpportunityModalOpen(false);
          setEditingOpportunity(undefined);
        }}
        onSave={handleSaveOpportunity}
        opportunity={editingOpportunity}
      />

      <InteractionModal
        open={isInteractionModalOpen}
        onClose={() => {
          setIsInteractionModalOpen(false);
          setSelectedOpportunity(undefined);
        }}
        onSave={handleAddInteraction}
      />
    </div>
  );
};

export default Index;
