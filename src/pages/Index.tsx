import { useState, useEffect, useRef } from "react";
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
import { Plus, Download, LogOut, Save, Search, ShieldCheck } from "lucide-react";
import type { Opportunity, EncryptedData, Interaction } from "@/types/opportunity";
import type { Store, WorkforceData, BadgeTemplate } from "@/types/store";
import type { TalentVaultData } from "@/types/talent";
import type { DossierVaultData } from "@/types/dossier";
import type { TherapyVaultData } from "@/types/therapy";
import type { CRMType } from "@/types/crmData";
import { ensureWorkforceData } from "@/utils/dataMigration";
import {
  isFileSystemSupported,
  saveToFileSystem,
  downloadEncryptedFile,
  saveToIndexedDB,
} from "@/utils/fileStorage";
import { addFileToRegistry, updateFileInRegistry } from "@/utils/fileRegistry";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");
  const [currentCrmType, setCurrentCrmType] = useState<CRMType>("sales");
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | undefined>();
  
  // Sales CRM state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  // Workforce CRM state
  const [workforceData, setWorkforceData] = useState<WorkforceData>({
    stores: [],
    employees: [],
    badgeTemplates: []
  });

  // Talent CRM state
  const [talentData, setTalentData] = useState<TalentVaultData>({
    talents: []
  });

  // Dossier CRM state
  const [dossierData, setDossierData] = useState<DossierVaultData>({
    cases: []
  });

  // Therapy CRM state
  const [therapyData, setTherapyData] = useState<TherapyVaultData>({
    patients: []
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | undefined>();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const supportsFileSystem = isFileSystemSupported();
  
  const isInitialLoad = useRef(true);

  const handleLogin = (data: EncryptedData, loginPassword: string, handle?: FileSystemFileHandle) => {
    console.log("[Index] Login with data:", { fileName: data.fileName, crmType: data.crmType });
    
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
      const tData = (data.data && typeof data.data === "object" && "talents" in data.data)
        ? (data.data as TalentVaultData)
        : { talents: [] };
      setTalentData(tData);
      itemCount = tData.talents.length;
      itemLabel = "executivos";
    } else if (crmType === "dossier") {
      const dData = (data.data && typeof data.data === "object" && "cases" in data.data)
        ? (data.data as DossierVaultData)
        : { cases: [] };
      setDossierData(dData);
      itemCount = dData.cases.length;
      itemLabel = "casos";
    } else if (crmType === "therapy") {
      const thData = (data.data && typeof data.data === "object" && "patients" in data.data)
        ? (data.data as TherapyVaultData)
        : { patients: [] };
      setTherapyData(thData);
      itemCount = thData.patients.length;
      itemLabel = "prontuários";
    }
    
    setIsLoggedIn(true);
    isInitialLoad.current = true;
    
    updateFileInRegistry(data.fileName, {
      lastOpened: new Date().toISOString(),
      crmType: crmType,
      itemCount,
      lastModified: data.lastModified,
    });
    
    toast({
      title: "Login Bem-Sucedido",
      description: `Carregados ${itemCount} ${itemLabel} de ${data.fileName}`,
    });
    
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 2500);
  };

  const handleCreateNew = async (newPassword: string, fileName: string, crmType: CRMType) => {
    console.log("[Index] Creating new CRM:", { fileName, crmType });
    
    setPassword(newPassword);
    setCurrentFileName(fileName);
    setCurrentCrmType(crmType);
    
    let initialData: any = [];
    if (crmType === "sales") {
      setOpportunities([]);
      initialData = [];
    } else if (crmType === "workforce") {
      const initWf = { stores: [], employees: [], badgeTemplates: [] };
      setWorkforceData(initWf);
      initialData = initWf;
    } else if (crmType === "talent") {
      const initTalent = { talents: [] };
      setTalentData(initTalent);
      initialData = initTalent;
    } else if (crmType === "dossier") {
      const initDossier = { cases: [] };
      setDossierData(initDossier);
      initialData = initDossier;
    } else if (crmType === "therapy") {
      const initTherapy = { patients: [] };
      setTherapyData(initTherapy);
      initialData = initTherapy;
    }

    setIsLoggedIn(true);
    isInitialLoad.current = true;
    
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
        description: `${fileName} (${typeLabels[crmType]}) está protegido e pronto`,
      });
    } catch (error: any) {
      console.error("[Index] Error creating new CRM:", error);
      toast({
        title: "Erro de Criação",
        description: error.message || "Falha ao criar arquivo",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 2500);
  };

  const getCurrentDataPayload = (): { dataToSave: any; itemCount: number } => {
    switch (currentCrmType) {
      case "workforce":
        return { dataToSave: workforceData, itemCount: workforceData.stores.length };
      case "talent":
        return { dataToSave: talentData, itemCount: (talentData.talents || []).length };
      case "dossier":
        return { dataToSave: dossierData, itemCount: (dossierData.cases || []).length };
      case "therapy":
        return { dataToSave: therapyData, itemCount: (therapyData.patients || []).length };
      case "sales":
      default:
        return { dataToSave: opportunities, itemCount: opportunities.length };
    }
  };

  const saveData = async (showToast = true) => {
    if (!currentFileName || !password) {
      console.log("[Index] Cannot save: missing fileName or password");
      return;
    }
    
    setIsAutoSaving(true);
    try {
      const now = new Date().toISOString();
      const { dataToSave, itemCount } = getCurrentDataPayload();
      
      const encryptedData: EncryptedData = {
        fileName: currentFileName,
        createdDate: now,
        lastModified: now,
        crmType: currentCrmType,
        data: dataToSave,
      };
      
      await saveToIndexedDB(encryptedData, password);
      
      if (supportsFileSystem && fileHandle) {
        try {
          await saveToFileSystem(encryptedData, password, fileHandle);
        } catch (fsError) {
          console.warn("[Index] Failed to save to file system, but IndexedDB save succeeded:", fsError);
        }
      }

      updateFileInRegistry(currentFileName, {
        lastModified: now,
        itemCount,
      });
      
      setLastSaveTime(new Date());

      if (showToast) {
        toast({
          title: "Dados Criptografados e Salvos",
          description: "Salvo com sucesso no armazenamento local seguro",
        });
      }
    } catch (error: any) {
      console.error("[Index] Error saving data:", error);
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Falha ao salvar dados",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleSaveOpportunity = (opportunity: Opportunity) => {
    const newOpportunities = opportunities.some((o) => o.id === opportunity.id)
      ? opportunities.map((o) => (o.id === opportunity.id ? opportunity : o))
      : [...opportunities, opportunity];

    setOpportunities(newOpportunities);
    setEditingOpportunity(undefined);
  };

  const handleDeleteOpportunity = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta oportunidade?")) return;

    const newOpportunities = opportunities.filter((o) => o.id !== id);
    setOpportunities(newOpportunities);
    toast({
      title: "Oportunidade Removida",
      description: "A oportunidade foi excluída do cofre",
    });
  };

  const handleAddInteraction = (interaction: Interaction, nextContactDate?: string) => {
    if (!selectedOpportunity) return;

    const updatedOpportunity = {
      ...selectedOpportunity,
      historicoInteracoes: [...selectedOpportunity.historicoInteracoes, interaction],
      ultimoContatoData: interaction.data,
      ...(nextContactDate && { proximoContatoData: nextContactDate }),
    };

    handleSaveOpportunity(updatedOpportunity);
    setSelectedOpportunity(undefined);
  };

  const handleSaveStore = (store: Store) => {
    setWorkforceData(prev => {
      const storeExists = prev.stores.some((s) => s.id === store.id);
      const newStores = storeExists
        ? prev.stores.map((s) => (s.id === store.id ? store : s))
        : [...prev.stores, store];
      
      return {
        ...prev,
        stores: newStores
      };
    });
  };

  const handleDeleteStore = (id: string) => {
    setWorkforceData(prev => ({
      ...prev,
      stores: prev.stores.filter((s) => s.id !== id)
    }));
  };

  const handleSaveBadgeTemplates = (templates: BadgeTemplate[]) => {
    setWorkforceData(prev => ({
      ...prev,
      badgeTemplates: templates
    }));
  };

  const handleManualSave = () => {
    saveData(true);
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
        description: "Arquivo criptografado baixado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao Exportar",
        description: error.message || "Falha ao exportar backup",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair? Todas as alterações salvas estão criptografadas.")) {
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
        title: "Sessão Encerrada",
        description: "Memória descriptografada limpa com sucesso",
      });
    }
  };

  // Auto-save debounce effect
  useEffect(() => {
    if (!isLoggedIn || isInitialLoad.current) return;
    
    const timer = setTimeout(() => {
      console.log("[Index] Auto-saving module changes...");
      saveData(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [opportunities, workforceData, talentData, dossierData, therapyData]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.contatoPrincipal.nome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} onCreateNew={handleCreateNew} />;
  }

  const getModuleTitle = () => {
    switch (currentCrmType) {
      case "workforce": return "Gestão Regional & Lojas";
      case "talent": return "Headhunting & Talentos C-Level";
      case "dossier": return "Dossiês Confidenciais & Jurídico";
      case "therapy": return "Prontuário & Notas Clínicas";
      case "sales": default: return "CRM de Vendas B2B";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Button onClick={handleLogout} variant="outline" size="sm" className="shrink-0">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Bloquear / Sair</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {isAutoSaving && (
              <span className="text-xs text-muted-foreground animate-pulse">Criptografando & Salvando...</span>
            )}
            <Button onClick={handleExportBackup} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              <span>Exportar Backup (.enc)</span>
            </Button>
            <Button onClick={handleManualSave} variant="default" size="sm" disabled={isAutoSaving}>
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
