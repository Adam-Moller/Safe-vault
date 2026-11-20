import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ShieldAlert, AlertTriangle, Users, Calendar, FileText, Lock, Star } from "lucide-react";
import type { ConfidentialCase, DossierVaultData, WitnessOrSource, CaseTimelineEvent } from "@/types/dossier";

interface DossierManagementProps {
  data: DossierVaultData;
  onUpdate: (data: DossierVaultData) => void;
  fileName: string;
}

export const DossierManagement = ({ data, onUpdate, fileName }: DossierManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ConfidentialCase | null>(null);

  // Form states
  const [codinomeCaso, setCodinomeCaso] = useState("");
  const [area, setArea] = useState<ConfidentialCase["area"]>("Corporativo / Societário");
  const [status, setStatus] = useState<ConfidentialCase["status"]>("Em Investigação");
  const [partesEnvolvidas, setPartesEnvolvidas] = useState("");
  const [tesePrincipal, setTesePrincipal] = useState("");
  const [estrategiaConfidencial, setEstrategiaConfidencial] = useState("");
  const [notasEstrategicas, setNotasEstrategicas] = useState("");

  // Witness quick-add
  const [fontes, setFontes] = useState<WitnessOrSource[]>([]);
  const [wCodinome, setWCodinome] = useState("");
  const [wNomeReal, setWNomeReal] = useState("");
  const [wConfiabilidade, setWConfiabilidade] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [wDisposto, setWDisposto] = useState<WitnessOrSource["dispostoADepor"]>("Apenas Sob Sigilo");
  const [wOQueSabe, setWOQueSabe] = useState("");
  const [wVulnerabilidade, setWVulnerabilidade] = useState("");

  const resetForm = () => {
    setCodinomeCaso("");
    setArea("Corporativo / Societário");
    setStatus("Em Investigação");
    setPartesEnvolvidas("");
    setTesePrincipal("");
    setEstrategiaConfidencial("");
    setNotasEstrategicas("");
    setFontes([]);
    setEditingCase(null);
    resetWitnessForm();
  };

  const resetWitnessForm = () => {
    setWCodinome("");
    setWNomeReal("");
    setWConfiabilidade(4);
    setWDisposto("Apenas Sob Sigilo");
    setWOQueSabe("");
    setWVulnerabilidade("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ConfidentialCase) => {
    setEditingCase(c);
    setCodinomeCaso(c.codinomeCaso);
    setArea(c.area);
    setStatus(c.status);
    setPartesEnvolvidas(c.partesEnvolvidas);
    setTesePrincipal(c.tesePrincipal);
    setEstrategiaConfidencial(c.estrategiaConfidencial);
    setNotasEstrategicas(c.notasEstrategicas);
    setFontes(c.fontesETestemunhas || []);
    setIsModalOpen(true);
  };

  const handleAddWitness = () => {
    if (!wCodinome.trim() && !wNomeReal.trim()) return;

    const newWitness: WitnessOrSource = {
      id: `w-${Date.now()}`,
      codinome: wCodinome.trim() || "Fonte Anônima",
      nomeReal: wNomeReal.trim(),
      grauConfiabilidade: wConfiabilidade,
      dispostoADepor: wDisposto,
      contatoSeguro: "",
      oQueSabe: wOQueSabe.trim(),
      vulnerabilidadesOuRisco: wVulnerabilidade.trim(),
    };

    setFontes([...fontes, newWitness]);
    resetWitnessForm();
  };

  const handleRemoveWitness = (id: string) => {
    setFontes(fontes.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    if (!codinomeCaso.trim()) return;

    const casePayload: ConfidentialCase = {
      id: editingCase ? editingCase.id : `case-${Date.now()}`,
      codinomeCaso: codinomeCaso.trim(),
      area,
      status,
      partesEnvolvidas: partesEnvolvidas.trim(),
      tesePrincipal: tesePrincipal.trim(),
      estrategiaConfidencial: estrategiaConfidencial.trim(),
      fontesETestemunhas: fontes,
      linhaDoTempo: editingCase ? editingCase.linhaDoTempo : [],
      notasEstrategicas: notasEstrategicas.trim(),
      dataCriacao: editingCase ? editingCase.dataCriacao : new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
    };

    let updatedCases = [...(data.cases || [])];
    if (editingCase) {
      updatedCases = updatedCases.map((c) => (c.id === editingCase.id ? casePayload : c));
    } else {
      updatedCases.unshift(casePayload);
    }

    onUpdate({ cases: updatedCases });
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este dossiê confidencial permanentemente?")) return;
    const updated = (data.cases || []).filter((c) => c.id !== id);
    onUpdate({ cases: updated });
  };

  const filteredCases = (data.cases || []).filter((c) => {
    const matchesSearch =
      c.codinomeCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partesEnvolvidas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tesePrincipal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = areaFilter === "all" || c.area === areaFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
            Dossiês & Investigação / Jurídico Sigiloso
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestão de fontes confidenciais, vulnerabilidades probatórias e teses de bastidores
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4" /> Novo Dossiê
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por codinome, partes ou tese..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger><SelectValue placeholder="Área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Áreas</SelectItem>
            <SelectItem value="Corporativo / Societário">Corporativo / Societário</SelectItem>
            <SelectItem value="Trabalhista">Trabalhista</SelectItem>
            <SelectItem value="Compliance / Fraude">Compliance / Fraude</SelectItem>
            <SelectItem value="Criminal">Criminal</SelectItem>
            <SelectItem value="Civil / Família">Civil / Família</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status do Caso" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Em Investigação">Em Investigação</SelectItem>
            <SelectItem value="Pré-Litígio">Pré-Litígio</SelectItem>
            <SelectItem value="Em Andamento Judicial">Em Andamento Judicial</SelectItem>
            <SelectItem value="Acordo Sigiloso">Acordo Sigiloso</SelectItem>
            <SelectItem value="Arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Dossiês */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-red-500" />
                    {c.codinomeCaso}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">{c.area}</CardDescription>
                </div>
                <Badge variant={c.status === "Em Investigação" ? "destructive" : "secondary"}>
                  {c.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Partes Envolvidas:</span>
                <p className="font-medium text-xs truncate">{c.partesEnvolvidas || "Não especificado"}</p>
              </div>

              {c.tesePrincipal && (
                <div className="p-2.5 rounded bg-muted/40 text-xs">
                  <span className="text-muted-foreground font-semibold block mb-0.5">Tese Central:</span>
                  <p className="line-clamp-2">{c.tesePrincipal}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {(c.fontesETestemunhas || []).length} fontes mapeadas
                </span>
                <span>{new Date(c.ultimaAtualizacao).toLocaleDateString("pt-BR")}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(c)}>
                  Abrir Dossiê
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCases.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum dossiê registrado no cofre.
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              {editingCase ? `Dossiê: ${editingCase.codinomeCaso}` : "Novo Dossiê Confidencial"}
            </DialogTitle>
            <DialogDescription>
              Informações sensíveis de litígio, investigação e fontes protegidas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Codinome do Caso</Label>
                <Input value={codinomeCaso} onChange={(e) => setCodinomeCaso(e.target.value)} placeholder="Ex: Operação Fênix" />
              </div>
              <div>
                <Label>Área</Label>
                <Select value={area} onValueChange={(v: any) => setArea(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporativo / Societário">Corporativo / Societário</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Compliance / Fraude">Compliance / Fraude</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                    <SelectItem value="Civil / Família">Civil / Família</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em Investigação">Em Investigação</SelectItem>
                    <SelectItem value="Pré-Litígio">Pré-Litígio</SelectItem>
                    <SelectItem value="Em Andamento Judicial">Em Andamento Judicial</SelectItem>
                    <SelectItem value="Acordo Sigiloso">Acordo Sigiloso</SelectItem>
                    <SelectItem value="Arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Partes Envolvidas / Alvos</Label>
              <Input value={partesEnvolvidas} onChange={(e) => setPartesEnvolvidas(e.target.value)} placeholder="Empresa A vs. Sócio B; Testemunha C" />
            </div>

            <div>
              <Label>Tese Principal</Label>
              <Textarea value={tesePrincipal} onChange={(e) => setTesePrincipal(e.target.value)} placeholder="Linha de argumentação e sustentação fática..." rows={2} />
            </div>

            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-2">
              <Label className="text-red-700 dark:text-red-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Estratégia Confidencial de Bastidores
              </Label>
              <Textarea
                value={estrategiaConfidencial}
                onChange={(e) => setEstrategiaConfidencial(e.target.value)}
                placeholder="Pontos de pressão psicológica, prazos sigilosos, alavancas para acordo antes da audiência..."
                rows={2}
              />
            </div>

            {/* Fontes e Testemunhas */}
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-semibold text-sm flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Fontes & Testemunhas Mapeadas ({fontes.length})
                </span>
              </h4>

              {/* Lista de fontes cadastradas */}
              <div className="space-y-2">
                {fontes.map((f) => (
                  <div key={f.id} className="p-2.5 bg-muted/40 border rounded-md text-xs flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{f.codinome} ({f.nomeReal || "Nome real não revelado"})</span>
                        <Badge variant="outline" className="text-[10px]">{f.dispostoADepor}</Badge>
                        <span className="text-amber-500 font-bold">★ {f.grauConfiabilidade}/5</span>
                      </div>
                      {f.oQueSabe && <p className="mt-1 text-muted-foreground"><span className="font-semibold">Sabe:</span> {f.oQueSabe}</p>}
                      {f.vulnerabilidadesOuRisco && (
                        <p className="mt-0.5 text-red-600 dark:text-red-400"><span className="font-semibold">Vulnerabilidade:</span> {f.vulnerabilidadesOuRisco}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveWitness(f.id)} className="h-6 px-2 text-xs text-destructive">
                      Remover
                    </Button>
                  </div>
                ))}
              </div>

              {/* Formulário rápido de adicionar fonte */}
              <div className="p-3 bg-muted/20 border border-dashed rounded-lg space-y-2">
                <span className="text-xs font-semibold text-muted-foreground block">Adicionar Fonte / Informante ao Dossiê:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Input placeholder="Codinome (ex: Garganta Profunda)" value={wCodinome} onChange={(e) => setWCodinome(e.target.value)} className="text-xs" />
                  <Input placeholder="Nome Real (opcional)" value={wNomeReal} onChange={(e) => setWNomeReal(e.target.value)} className="text-xs" />
                  <Select value={String(wConfiabilidade)} onValueChange={(v) => setWConfiabilidade(Number(v) as any)}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Confiabilidade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5/5 - Altíssima</SelectItem>
                      <SelectItem value="4">4/5 - Boa</SelectItem>
                      <SelectItem value="3">3/5 - Regular</SelectItem>
                      <SelectItem value="2">2/5 - Duvidosa</SelectItem>
                      <SelectItem value="1">1/5 - Hostil</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={wDisposto} onValueChange={(v: any) => setWDisposto(v)}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Disposição" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apenas Sob Sigilo">Apenas Sob Sigilo</SelectItem>
                      <SelectItem value="Sim">Depõe em Juízo</SelectItem>
                      <SelectItem value="Recusa Absoluta">Recusa Absoluta</SelectItem>
                      <SelectItem value="Hostil">Hostil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input placeholder="O que a fonte presenciou ou tem posse..." value={wOQueSabe} onChange={(e) => setWOQueSabe(e.target.value)} className="text-xs" />
                  <Input placeholder="Vulnerabilidade / risco pessoal da fonte..." value={wVulnerabilidade} onChange={(e) => setWVulnerabilidade(e.target.value)} className="text-xs" />
                </div>
                <Button size="sm" variant="secondary" onClick={handleAddWitness} className="w-full text-xs">
                  + Incluir Fonte
                </Button>
              </div>
            </div>

            <div>
              <Label>Notas Gerais & Diário de Investigação</Label>
              <Textarea value={notasEstrategicas} onChange={(e) => setNotasEstrategicas(e.target.value)} placeholder="Anotações adicionais..." rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar no Cofre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
