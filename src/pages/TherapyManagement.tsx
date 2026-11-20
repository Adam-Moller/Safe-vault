import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, HeartPulse, AlertTriangle, Calendar, Clock, Lock, Sparkles, MessageCircle } from "lucide-react";
import type { PatientProfile, TherapyVaultData, TherapySession } from "@/types/therapy";

interface TherapyManagementProps {
  data: TherapyVaultData;
  onUpdate: (data: TherapyVaultData) => void;
  fileName: string;
}

export const TherapyManagement = ({ data, onUpdate, fileName }: TherapyManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);

  // Form states
  const [identificador, setIdentificador] = useState("");
  const [status, setStatus] = useState<PatientProfile["status"]>("Ativo");
  const [frequencia, setFrequencia] = useState<PatientProfile["frequencia"]>("Semanal");
  const [diaHoraPreferencia, setDiaHoraPreferencia] = useState("");
  const [contatoEmergencia, setContatoEmergencia] = useState("");
  const [medicacaoRelatada, setMedicacaoRelatada] = useState("");
  const [alertaRiscoIminente, setAlertaRiscoIminente] = useState("");
  const [objetivosInput, setObjetivosInput] = useState("");
  const [notasGerais, setNotasGerais] = useState("");

  // Sessões
  const [sessoes, setSessoes] = useState<TherapySession[]>([]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessaoData, setSessaoData] = useState(new Date().toISOString().split("T")[0]);
  const [sessaoDuracao, setSessaoDuracao] = useState<number>(50);
  const [sessaoRelato, setSessaoRelato] = useState("");
  const [sessaoHipoteses, setSessaoHipoteses] = useState("");
  const [sessaoContratransferencia, setSessaoContratransferencia] = useState("");
  const [sessaoIntervencoes, setSessaoIntervencoes] = useState("");
  const [sessaoCombinados, setSessaoCombinados] = useState("");

  const resetForm = () => {
    setIdentificador("");
    setStatus("Ativo");
    setFrequencia("Semanal");
    setDiaHoraPreferencia("");
    setContatoEmergencia("");
    setMedicacaoRelatada("");
    setAlertaRiscoIminente("");
    setObjetivosInput("");
    setNotasGerais("");
    setSessoes([]);
    setEditingPatient(null);
  };

  const resetSessionForm = () => {
    setSessaoData(new Date().toISOString().split("T")[0]);
    setSessaoDuracao(50);
    setSessaoRelato("");
    setSessaoHipoteses("");
    setSessaoContratransferencia("");
    setSessaoIntervencoes("");
    setSessaoCombinados("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PatientProfile) => {
    setEditingPatient(p);
    setIdentificador(p.identificadorOuIniciais);
    setStatus(p.status);
    setFrequencia(p.frequencia);
    setDiaHoraPreferencia(p.diaHoraPreferencia || "");
    setContatoEmergencia(p.contatoEmergencia || "");
    setMedicacaoRelatada(p.medicacaoRelatada || "");
    setAlertaRiscoIminente(p.alertaRiscoIminente || "");
    setObjetivosInput((p.objetivosTerapeuticos || []).join(", "));
    setNotasGerais(p.notasGerais || "");
    setSessoes(p.sessoes || []);
    setIsModalOpen(true);
  };

  const handleSaveSession = () => {
    if (!sessaoRelato.trim()) return;

    const novaSessao: TherapySession = {
      id: `session-${Date.now()}`,
      data: sessaoData,
      duracaoMinutos: Number(sessaoDuracao) || 50,
      relatoPaciente: sessaoRelato.trim(),
      hipotesesDiagnosticas: sessaoHipoteses.trim(),
      notasContratransferencia: sessaoContratransferencia.trim(),
      intervencoesRealizadas: sessaoIntervencoes.trim(),
      combinadosEProximaSessao: sessaoCombinados.trim(),
    };

    setSessoes([novaSessao, ...sessoes]);
    setIsSessionModalOpen(false);
    resetSessionForm();
  };

  const handleSave = () => {
    if (!identificador.trim()) return;

    const objetivos = objetivosInput
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    const patientPayload: PatientProfile = {
      id: editingPatient ? editingPatient.id : `pt-${Date.now()}`,
      identificadorOuIniciais: identificador.trim(),
      status,
      frequencia,
      diaHoraPreferencia: diaHoraPreferencia.trim(),
      contatoEmergencia: contatoEmergencia.trim(),
      medicacaoRelatada: medicacaoRelatada.trim(),
      alertaRiscoIminente: alertaRiscoIminente.trim(),
      objetivosTerapeuticos: objetivos,
      sessoes,
      notasGerais: notasGerais.trim(),
      dataInicio: editingPatient ? editingPatient.dataInicio : new Date().toISOString(),
      ultimaSessaoData: sessoes.length > 0 ? sessoes[0].data : undefined,
    };

    let updatedPatients = [...(data.patients || [])];
    if (editingPatient) {
      updatedPatients = updatedPatients.map((p) => (p.id === editingPatient.id ? patientPayload : p));
    } else {
      updatedPatients.unshift(patientPayload);
    }

    onUpdate({ patients: updatedPatients });
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este prontuário permanentemente do cofre local?")) return;
    const updated = (data.patients || []).filter((p) => p.id !== id);
    onUpdate({ patients: updated });
  };

  const filteredPatients = (data.patients || []).filter((p) => {
    const matchesSearch =
      p.identificadorOuIniciais.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicacaoRelatada.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.objetivosTerapeuticos || []).some((o) => o.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Prontuário & Notas Clínicas Confidenciais
          </h2>
          <p className="text-sm text-muted-foreground">
            Armazenamento ultra-seguro e offline de sessões, contratransferência e evolução terapêutica
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Novo Paciente / Prontuário
        </Button>
      </div>

      {/* Busca e Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por iniciais/identificador, medicação ou objetivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Em Pausa">Em Pausa</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Interrompido">Interrompido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    {p.identificadorOuIniciais}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {p.frequencia} • {p.diaHoraPreferencia || "Horário flexível"}
                  </CardDescription>
                </div>
                <Badge variant={p.status === "Ativo" ? "default" : "secondary"}>
                  {p.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {p.alertaRiscoIminente && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Alerta: {p.alertaRiscoIminente}
                </div>
              )}

              {p.medicacaoRelatada && (
                <div className="text-xs bg-muted/40 p-2 rounded">
                  <span className="text-muted-foreground font-semibold block">Medicação:</span>
                  <span className="truncate block">{p.medicacaoRelatada}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {(p.objetivosTerapeuticos || []).map((obj, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px]">
                    {obj}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {(p.sessoes || []).length} sessões registradas
                </span>
                <span>{p.ultimaSessaoData ? `Última: ${p.ultimaSessaoData}` : "Sem sessões"}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(p)}>
                  Abrir Prontuário
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum prontuário registrado no cofre.
          </div>
        )}
      </div>

      {/* Modal Principal do Paciente */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
              {editingPatient ? `Prontuário: ${editingPatient.identificadorOuIniciais}` : "Novo Prontuário"}
            </DialogTitle>
            <DialogDescription>
              Anotações clínicas protegidas por chave privada local.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Identificador / Iniciais</Label>
                <Input value={identificador} onChange={(e) => setIdentificador(e.target.value)} placeholder="Ex: Paciente M.S.R." />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Em Pausa">Em Pausa</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Interrompido">Interrompido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequência</Label>
                <Select value={frequencia} onValueChange={(v: any) => setFrequencia(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="Esporádica">Esporádica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Dia / Horário Preferencial</Label>
                <Input value={diaHoraPreferencia} onChange={(e) => setDiaHoraPreferencia(e.target.value)} placeholder="Ex: Terças às 14h" />
              </div>
              <div>
                <Label>Contato de Emergência</Label>
                <Input value={contatoEmergencia} onChange={(e) => setContatoEmergencia(e.target.value)} placeholder="Ex: Cônjuge (11) 99999-0000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Medicação Relatada</Label>
                <Input value={medicacaoRelatada} onChange={(e) => setMedicacaoRelatada(e.target.value)} placeholder="Ex: Sertralina 50mg, Zolpidem 10mg" />
              </div>
              <div>
                <Label className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Alerta de Risco Clínico
                </Label>
                <Input value={alertaRiscoIminente} onChange={(e) => setAlertaRiscoIminente(e.target.value)} placeholder="Ex: Histórico de ideação, risco de automutilação" />
              </div>
            </div>

            <div>
              <Label>Objetivos Terapêuticos (separados por vírgula)</Label>
              <Input value={objetivosInput} onChange={(e) => setObjetivosInput(e.target.value)} placeholder="Tratamento de luto, regulação de ansiedade, transição de carreira" />
            </div>

            {/* Linha de Sessões */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" /> Histórico de Sessões & Evolução ({sessoes.length})
                </h4>
                <Button size="sm" variant="outline" onClick={() => setIsSessionModalOpen(true)}>
                  + Registrar Nova Sessão
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {sessoes.map((s) => (
                  <div key={s.id} className="p-3 bg-muted/40 border rounded-md text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Data: {s.data} ({s.duracaoMinutos} min)</span>
                    </div>
                    {s.relatoPaciente && (
                      <p><span className="font-semibold text-muted-foreground">Conteúdo manifesto:</span> {s.relatoPaciente}</p>
                    )}
                    {s.hipotesesDiagnosticas && (
                      <p><span className="font-semibold text-muted-foreground">Hipóteses:</span> {s.hipotesesDiagnosticas}</p>
                    )}
                    {s.notasContratransferencia && (
                      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                        <span className="font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Contratransferência (Notas Subjetivas):
                        </span>
                        <p className="mt-0.5">{s.notasContratransferencia}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Notas Gerais & Hipóteses Estruturais</Label>
              <Textarea value={notasGerais} onChange={(e) => setNotasGerais(e.target.value)} placeholder="Observações de longo prazo sobre o caso..." rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Prontuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Nova Sessão */}
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Registrar Sessão Terapêutica</DialogTitle>
            <DialogDescription>Anotações do encontro clínico com camada sigilosa de contratransferência.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data da Sessão</Label>
                <Input type="date" value={sessaoData} onChange={(e) => setSessaoData(e.target.value)} />
              </div>
              <div>
                <Label>Duração (min)</Label>
                <Input type="number" value={sessaoDuracao} onChange={(e) => setSessaoDuracao(Number(e.target.value))} />
              </div>
            </div>
            <div>
              <Label>Relato / Demanda Trazida pelo Paciente</Label>
              <Textarea value={sessaoRelato} onChange={(e) => setSessaoRelato(e.target.value)} placeholder="Tópicos e queixas manifestas..." rows={2} />
            </div>
            <div>
              <Label>Hipóteses & Interpretações Clínicas</Label>
              <Textarea value={sessaoHipoteses} onChange={(e) => setSessaoHipoteses(e.target.value)} placeholder="Mecanismos de defesa observados, conexões teóricas..." rows={2} />
            </div>
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 space-y-1">
              <Label className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1 text-xs">
                <Lock className="w-3.5 h-3.5" /> Contratransferência (Sentimentos & Percepções do Terapeuta)
              </Label>
              <Textarea
                value={sessaoContratransferencia}
                onChange={(e) => setSessaoContratransferencia(e.target.value)}
                placeholder="Como você se sentiu na sessão? Sentimentos de impotência, irritação, urgência ou empatia profunda que informam a dinâmica clínica."
                rows={2}
                className="text-xs"
              />
            </div>
            <div>
              <Label>Intervenções Realizadas</Label>
              <Input value={sessaoIntervencoes} onChange={(e) => setSessaoIntervencoes(e.target.value)} placeholder="Enquadre, confronto gentil, exercícios de respiração..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSession}>Adicionar Sessão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
