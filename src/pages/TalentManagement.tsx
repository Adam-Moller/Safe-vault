import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, DollarSign, AlertCircle, Briefcase, Phone, Mail, Building, History, MessageSquare, Lock } from "lucide-react";
import type { ExecutiveTalent, TalentVaultData } from "@/types/talent";

interface TalentManagementProps {
  data: TalentVaultData;
  onUpdate: (data: TalentVaultData) => void;
  fileName: string;
}

export const TalentManagement = ({ data, onUpdate, fileName }: TalentManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTalent, setEditingTalent] = useState<ExecutiveTalent | null>(null);

  // Form states
  const [nome, setNome] = useState("");
  const [cargoAtual, setCargoAtual] = useState("");
  const [empresaAtual, setEmpresaAtual] = useState("");
  const [senioridade, setSenioridade] = useState<ExecutiveTalent["senioridade"]>("C-Level");
  const [telefonePessoal, setTelefonePessoal] = useState("");
  const [emailPessoal, setEmailPessoal] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [disponibilidadeMudanca, setDisponibilidadeMudanca] = useState<ExecutiveTalent["disponibilidadeMudanca"]>("Ouvindo Mercado");
  const [salarioFixoMensal, setSalarioFixoMensal] = useState<number>(0);
  const [bonusAnualEstimado, setBonusAnualEstimado] = useState<number>(0);
  const [pretensaoMinima, setPretensaoMinima] = useState<number>(0);
  const [possuiStockOptions, setPossuiStockOptions] = useState(false);
  const [possuiNaoCompeticao, setPossuiNaoCompeticao] = useState(false);
  const [motivoRealInsatisfacao, setMotivoRealInsatisfacao] = useState("");
  const [perfilComportamental, setPerfilComportamental] = useState("");
  const [notasConfidenciais, setNotasConfidenciais] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const resetForm = () => {
    setNome("");
    setCargoAtual("");
    setEmpresaAtual("");
    setSenioridade("C-Level");
    setTelefonePessoal("");
    setEmailPessoal("");
    setLocalizacao("");
    setDisponibilidadeMudanca("Ouvindo Mercado");
    setSalarioFixoMensal(0);
    setBonusAnualEstimado(0);
    setPretensaoMinima(0);
    setPossuiStockOptions(false);
    setPossuiNaoCompeticao(false);
    setMotivoRealInsatisfacao("");
    setPerfilComportamental("");
    setNotasConfidenciais("");
    setTagsInput("");
    setEditingTalent(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (talent: ExecutiveTalent) => {
    setEditingTalent(talent);
    setNome(talent.nome);
    setCargoAtual(talent.cargoAtual);
    setEmpresaAtual(talent.empresaAtual);
    setSenioridade(talent.senioridade);
    setTelefonePessoal(talent.telefonePessoal);
    setEmailPessoal(talent.emailPessoal);
    setLocalizacao(talent.localizacao);
    setDisponibilidadeMudanca(talent.disponibilidadeMudanca);
    setSalarioFixoMensal(talent.pacoteRemuneracao.salarioFixoMensal);
    setBonusAnualEstimado(talent.pacoteRemuneracao.bonusAnualEstimado);
    setPretensaoMinima(talent.pacoteRemuneracao.pretensaoMinima);
    setPossuiStockOptions(talent.pacoteRemuneracao.possuiStockOptions);
    setPossuiNaoCompeticao(talent.pacoteRemuneracao.possuiNaoCompeticao);
    setMotivoRealInsatisfacao(talent.motivoRealInsatisfacao);
    setPerfilComportamental(talent.perfilComportamental);
    setNotasConfidenciais(talent.notasConfidenciais);
    setTagsInput((talent.tags || []).join(", "));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!nome.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const talentPayload: ExecutiveTalent = {
      id: editingTalent ? editingTalent.id : `talent-${Date.now()}`,
      nome: nome.trim(),
      cargoAtual: cargoAtual.trim(),
      empresaAtual: empresaAtual.trim(),
      senioridade,
      telefonePessoal: telefonePessoal.trim(),
      emailPessoal: emailPessoal.trim(),
      localizacao: localizacao.trim(),
      disponibilidadeMudanca,
      pacoteRemuneracao: {
        salarioFixoMensal: Number(salarioFixoMensal) || 0,
        bonusAnualEstimado: Number(bonusAnualEstimado) || 0,
        pretensaoMinima: Number(pretensaoMinima) || 0,
        possuiStockOptions,
        possuiNaoCompeticao,
      },
      motivoRealInsatisfacao: motivoRealInsatisfacao.trim(),
      perfilComportamental: perfilComportamental.trim(),
      tags,
      notasConfidenciais: notasConfidenciais.trim(),
      historicoCarreira: editingTalent ? editingTalent.historicoCarreira : [],
      interacoes: editingTalent ? editingTalent.interacoes : [],
      dataCriacao: editingTalent ? editingTalent.dataCriacao : new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
    };

    let updatedTalents = [...(data.talents || [])];
    if (editingTalent) {
      updatedTalents = updatedTalents.map((t) => (t.id === editingTalent.id ? talentPayload : t));
    } else {
      updatedTalents.unshift(talentPayload);
    }

    onUpdate({ talents: updatedTalents });
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este perfil confidencial do cofre?")) return;
    const updated = (data.talents || []).filter((t) => t.id !== id);
    onUpdate({ talents: updated });
  };

  const filteredTalents = (data.talents || []).filter((talent) => {
    const matchesSearch =
      talent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.cargoAtual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.empresaAtual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (talent.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeniority = seniorityFilter === "all" || talent.senioridade === seniorityFilter;
    const matchesStatus = statusFilter === "all" || talent.disponibilidadeMudanca === statusFilter;

    return matchesSearch && matchesSeniority && matchesStatus;
  });

  const getDisponibilidadeBadge = (status: ExecutiveTalent["disponibilidadeMudanca"]) => {
    switch (status) {
      case "Buscando Ativamente":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Buscando Ativamente</Badge>;
      case "Desesperado para Sair":
        return <Badge variant="destructive">Desesperado para Sair</Badge>;
      case "Ouvindo Mercado":
        return <Badge className="bg-amber-600 hover:bg-amber-700">Ouvindo Mercado</Badge>;
      case "Intocável":
      default:
        return <Badge variant="secondary">Intocável</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Headhunting & Banco de Talentos Confidencial
          </h2>
          <p className="text-sm text-muted-foreground">
            Mapeamento sigiloso de remuneração real, vulnerabilidades contratuais e motivos reais de saída
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Executivo
        </Button>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, empresa, cargo ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Senioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Senioridades</SelectItem>
            <SelectItem value="C-Level">C-Level</SelectItem>
            <SelectItem value="Diretoria">Diretoria</SelectItem>
            <SelectItem value="Gerência Sênior">Gerência Sênior</SelectItem>
            <SelectItem value="Especialista / Lead">Especialista / Lead</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Disponibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Ouvindo Mercado">Ouvindo Mercado</SelectItem>
            <SelectItem value="Buscando Ativamente">Buscando Ativamente</SelectItem>
            <SelectItem value="Desesperado para Sair">Desesperado para Sair</SelectItem>
            <SelectItem value="Intocável">Intocável</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTalents.map((talent) => (
          <Card key={talent.id} className="hover:shadow-md transition-shadow border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold">{talent.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    {talent.cargoAtual} @ {talent.empresaAtual}
                  </CardDescription>
                </div>
                {getDisponibilidadeBadge(talent.disponibilidadeMudanca)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-md">
                <div>
                  <span className="text-muted-foreground block">Fixo Atual:</span>
                  <span className="font-semibold text-foreground">
                    R$ {talent.pacoteRemuneracao.salarioFixoMensal.toLocaleString("pt-BR")}/mês
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Pretensão:</span>
                  <span className="font-semibold text-primary">
                    R$ {talent.pacoteRemuneracao.pretensaoMinima.toLocaleString("pt-BR")}/mês
                  </span>
                </div>
              </div>

              {talent.motivoRealInsatisfacao && (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                  <div className="font-semibold flex items-center gap-1 mb-0.5">
                    <Lock className="w-3 h-3" /> Motivo Real de Saída / Insatisfação:
                  </div>
                  <p className="line-clamp-2">{talent.motivoRealInsatisfacao}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {talent.senioridade}
                </Badge>
                {talent.pacoteRemuneracao.possuiStockOptions && (
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-400">
                    Stock Options
                  </Badge>
                )}
                {talent.pacoteRemuneracao.possuiNaoCompeticao && (
                  <Badge variant="outline" className="text-xs text-red-600 border-red-400">
                    Cláusula Não-Competição
                  </Badge>
                )}
                {(talent.tags || []).map((t, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {talent.telefonePessoal && <span>📞 {talent.telefonePessoal}</span>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(talent)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(talent.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTalents.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum perfil executivo encontrado no cofre.
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTalent ? "Editar Perfil Executivo Sigiloso" : "Novo Perfil Executivo"}
            </DialogTitle>
            <DialogDescription>
              Dados sensíveis mantidos sob criptografia militar (AES-GCM-256) localmente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nome Completo</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Rodrigo Albuquerque" />
              </div>
              <div>
                <Label>Senioridade</Label>
                <Select value={senioridade} onValueChange={(v: any) => setSenioridade(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C-Level">C-Level (CEO, CTO, CFO, etc.)</SelectItem>
                    <SelectItem value="Diretoria">Diretoria</SelectItem>
                    <SelectItem value="Gerência Sênior">Gerência Sênior</SelectItem>
                    <SelectItem value="Especialista / Lead">Especialista / Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cargo Atual</Label>
                <Input value={cargoAtual} onChange={(e) => setCargoAtual(e.target.value)} placeholder="Ex: VP of Engineering" />
              </div>
              <div>
                <Label>Empresa Atual</Label>
                <Input value={empresaAtual} onChange={(e) => setEmpresaAtual(e.target.value)} placeholder="Ex: Fintech X" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Telefone Pessoal / WhatsApp</Label>
                <Input value={telefonePessoal} onChange={(e) => setTelefonePessoal(e.target.value)} placeholder="(11) 98765-4321" />
              </div>
              <div>
                <Label>E-mail Pessoal</Label>
                <Input value={emailPessoal} onChange={(e) => setEmailPessoal(e.target.value)} placeholder="pessoal@gmail.com" />
              </div>
              <div>
                <Label>Disponibilidade</Label>
                <Select value={disponibilidadeMudanca} onValueChange={(v: any) => setDisponibilidadeMudanca(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ouvindo Mercado">Ouvindo Mercado</SelectItem>
                    <SelectItem value="Buscando Ativamente">Buscando Ativamente</SelectItem>
                    <SelectItem value="Desesperado para Sair">Desesperado para Sair</SelectItem>
                    <SelectItem value="Intocável">Intocável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-muted/30 border rounded-lg space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Pacote de Remuneração Real (Confidencial)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Fixo Mensal (R$)</Label>
                  <Input type="number" value={salarioFixoMensal || ""} onChange={(e) => setSalarioFixoMensal(Number(e.target.value))} placeholder="35000" />
                </div>
                <div>
                  <Label className="text-xs">Bônus Anual Estimado (R$)</Label>
                  <Input type="number" value={bonusAnualEstimado || ""} onChange={(e) => setBonusAnualEstimado(Number(e.target.value))} placeholder="120000" />
                </div>
                <div>
                  <Label className="text-xs">Pretensão Mínima p/ Mudar (R$)</Label>
                  <Input type="number" value={pretensaoMinima || ""} onChange={(e) => setPretensaoMinima(Number(e.target.value))} placeholder="42000" />
                </div>
              </div>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={possuiStockOptions} onChange={(e) => setPossuiStockOptions(e.target.checked)} className="rounded" />
                  Possui Stock Options / Equity relevante
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={possuiNaoCompeticao} onChange={(e) => setPossuiNaoCompeticao(e.target.checked)} className="rounded" />
                  Sujeito a Cláusula de Não-Competição (Non-compete)
                </label>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> Motivo Real de Insatisfação / Vulnerabilidade
              </Label>
              <Textarea
                value={motivoRealInsatisfacao}
                onChange={(e) => setMotivoRealInsatisfacao(e.target.value)}
                placeholder="Ex: Desentendimento irreconciliável com o novo CEO; corte iminente da área; burnout grave."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Perfil Comportamental / Liderança</Label>
                <Input value={perfilComportamental} onChange={(e) => setPerfilComportamental(e.target.value)} placeholder="Ex: Executor agressivo, focado em dados, pouca paciência com burocracia" />
              </div>
              <div>
                <Label>Tags (separadas por vírgula)</Label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Fintech, SaaS, IA, Ex-Google" />
              </div>
            </div>

            <div>
              <Label>Notas Gerais & Diário de Abordagem</Label>
              <Textarea
                value={notasConfidenciais}
                onChange={(e) => setNotasConfidenciais(e.target.value)}
                placeholder="Anotações pessoais adicionais sobre reuniões e conversas confidenciais..."
                rows={2}
              />
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
