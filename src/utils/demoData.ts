/**
 * @file demoData.ts
 * @description Conjunto de dados fictícios corporativos de alta fidelidade para o Modo Demonstração (Sandbox) do Safe-Vault.
 * Todos os registros são 100% sintéticos, genéricos e seguros para exibição pública, auditoria técnica e homologação de portfólio.
 */

import type { Opportunity, EncryptedData, VaultPayload } from "@/types/opportunity";
import type { WorkforceData, Employee, BadgeTemplate, Store } from "@/types/store";
import type { TalentVaultData } from "@/types/talent";
import type { DossierVaultData } from "@/types/dossier";
import type { TherapyVaultData } from "@/types/therapy";
import type { CRMType } from "@/types/crmData";

/**
 * Dados fictícios para o módulo de Vendas B2B & Blackbook Comercial (`sales`).
 */
export const DEMO_SALES_DATA: Opportunity[] = [
  {
    id: "opp-demo-01",
    nomeEmpresa: "Empresa Alpha Tecnologia Ltda",
    status: "Negociação",
    valorPotencial: 480000,
    primeiroContatoData: "2025-01-10T10:00:00.000Z",
    ultimoContatoData: "2025-02-18T15:30:00.000Z",
    proximoContatoData: "2025-03-05T14:00:00.000Z",
    contatoPrincipal: {
      nome: "Carlos Mendes — Diretor Comercial",
      cargo: "Diretor Comercial & Parcerias Estratégicas",
      email: "carlos.mendes@alphatecnologia.com.br",
      telefone: "(11) 98842-1102",
    },
    dataCriacao: "2025-01-10T10:00:00.000Z",
    notasGerais:
      "Conta Enterprise prioritária para o Q1. Decisor possui orçamento aprovado para modernização da infraestrutura de segurança de dados, mas exige cláusula de SLA de 99,95% e validação junto ao jurídico interno.",
    historicoInteracoes: [
      {
        data: "2025-02-18T15:30:00.000Z",
        tipo: "Reunião Executiva",
        resumo:
          "Apresentação da revisão contratual para Carlos Mendes e diretoria financeira. Aprovação técnica confirmada; aguardando parecer final de procurement.",
      },
      {
        data: "2025-01-24T11:00:00.000Z",
        tipo: "Demonstração Técnica (PoC)",
        resumo:
          "Validação da arquitetura Zero-Knowledge com equipe de Engenharia da Alpha. Destaque positivo para a latência zero em operações locais.",
      },
    ],
  },
  {
    id: "opp-demo-02",
    nomeEmpresa: "Grupo Horizonte Logística S.A.",
    status: "Proposta",
    valorPotencial: 850000,
    primeiroContatoData: "2025-01-15T09:00:00.000Z",
    ultimoContatoData: "2025-02-20T16:45:00.000Z",
    proximoContatoData: "2025-03-08T10:30:00.000Z",
    contatoPrincipal: {
      nome: "Fernanda Costa — VP de Operações",
      cargo: "Vice-Presidente de Operações & Supply Chain",
      email: "fernanda.costa@horizonte-log.com.br",
      telefone: "(11) 99124-5580",
    },
    dataCriacao: "2025-01-15T09:00:00.000Z",
    notasGerais:
      "Projeto de transformação operacional abrangendo 14 centros de distribuição. Fernanda Costa busca autonomia de dados em campo para auditores regionais sem dependência de conectividade constante.",
    historicoInteracoes: [
      {
        data: "2025-02-20T16:45:00.000Z",
        tipo: "Envio de Proposta Comercial",
        resumo:
          "Proposta executiva enviada contemplando licenciamento corporativo anual e treinamento para 45 líderes regionais.",
      },
    ],
  },
  {
    id: "opp-demo-03",
    nomeEmpresa: "Vértice Financeira Corp",
    status: "Qualificado",
    valorPotencial: 320000,
    primeiroContatoData: "2025-02-01T14:00:00.000Z",
    ultimoContatoData: "2025-02-19T11:15:00.000Z",
    proximoContatoData: "2025-03-10T15:00:00.000Z",
    contatoPrincipal: {
      nome: "Roberto Almeida — CTO",
      cargo: "Chief Technology Officer",
      email: "roberto.almeida@verticecorp.com.br",
      telefone: "(11) 97410-3391",
    },
    dataCriacao: "2025-02-01T14:00:00.000Z",
    notasGerais:
      "Forte alinhamento com a tese de soberania criptográfica local (AES-GCM-256). O comitê de segurança cibernética aprovou o avanço para o desenho de escopo piloto.",
    historicoInteracoes: [
      {
        data: "2025-02-19T11:15:00.000Z",
        tipo: "Call de Qualificação Técnica",
        resumo:
          "Alinhamento sobre requisitos de conformidade regulatória e governança de chaves locais.",
      },
    ],
  },
  {
    id: "opp-demo-04",
    nomeEmpresa: "BioMed Diagnósticos S.A.",
    status: "Fechado",
    valorPotencial: 610000,
    primeiroContatoData: "2024-11-12T10:00:00.000Z",
    ultimoContatoData: "2025-02-14T17:00:00.000Z",
    proximoContatoData: "2025-03-15T09:30:00.000Z",
    contatoPrincipal: {
      nome: "Dra. Patrícia Souza — Diretora Executiva",
      cargo: "Diretora Executiva & Governança Clínica",
      email: "patricia.souza@biomeddiagnosticos.com.br",
      telefone: "(11) 98233-9014",
    },
    dataCriacao: "2024-11-12T10:00:00.000Z",
    notasGerais:
      "Contrato assinado por 24 meses. Caso referência no setor de saúde diagnóstica pela adoção de cofres criptografados offline para proteção de propriedade intelectual e dados sensíveis.",
    historicoInteracoes: [
      {
        data: "2025-02-14T17:00:00.000Z",
        tipo: "Assinatura de Contrato",
        resumo:
          "Fechamento oficial concluído e kick-off de implantação agendado com a diretoria executiva.",
      },
    ],
  },
];

/**
 * Templates de medalhas de mérito para o módulo de Gestão Regional (`workforce`).
 */
const DEMO_BADGE_TEMPLATES: BadgeTemplate[] = [
  {
    id: "badge-lideranca",
    nome: "Excelência em Liderança",
    icone: "award",
    cor: "#F59E0B",
    descricao: "Reconhecimento por retenção de talentos e clima organizacional de alta performance.",
  },
  {
    id: "badge-meta",
    nome: "Superação de Meta Trimestral",
    icone: "star",
    cor: "#10B981",
    descricao: "Unidade ou colaborador que ultrapassou 100% da meta comercial estabelecida.",
  },
  {
    id: "badge-mentoria",
    nome: "Referência Técnica & Mentoria",
    icone: "heart",
    cor: "#3B82F6",
    descricao: "Destaque na formação e integração de novos consultores na operação.",
  },
];

/**
 * Quadro demonstrativo de colaboradores distribuídos nas unidades.
 */
const DEMO_EMPLOYEES: Employee[] = [
  {
    id: "emp-demo-01",
    nome: "Lucas Ferreira",
    tipo: "Gerente",
    cargo: "Gerente Geral de Loja Flagship",
    dataAdmissao: "2022-03-15",
    status: "Ativo",
    telefone: "(11) 98711-2233",
    email: "lucas.ferreira@redecorporativa.com.br",
    lojaAtualId: "store-demo-01",
    historicoLojas: ["store-demo-02", "store-demo-01"],
    feriasProgramadas: [
      {
        id: "vac-01",
        dataInicio: "2025-07-01",
        dataFim: "2025-07-20",
        status: "Programada",
        observacao: "Cobertura interina alinhada com a consultora sênior Camila.",
      },
    ],
    logAfastamentos: [],
    conquistas: [
      {
        id: "ach-01",
        data: "2024-12-15",
        tipo: "Meta",
        titulo: "Recorde Histórico de Conversão B2C",
        descricao: "Liderou a Unidade Paulista ao atingimento de 107% da meta no trimestre.",
      },
    ],
    badges: [
      {
        id: "eb-01",
        badgeTemplateId: "badge-lideranca",
        dataConcessao: "2024-12-20",
      },
      {
        id: "eb-02",
        badgeTemplateId: "badge-meta",
        dataConcessao: "2025-01-15",
      },
    ],
    observacoes: [
      {
        id: "obs-01",
        data: "2025-02-10",
        texto:
          "Sinais informais de clima e retenção: alta coesão da equipe sob sua liderança; preparado para assumir coordenação distrital em 2026.",
      },
    ],
  },
  {
    id: "emp-demo-02",
    nome: "Camila Rocha",
    tipo: "Senior",
    cargo: "Consultora Sênior & Subgerente",
    dataAdmissao: "2023-01-10",
    status: "Ativo",
    telefone: "(11) 98544-7788",
    email: "camila.rocha@redecorporativa.com.br",
    lojaAtualId: "store-demo-01",
    historicoLojas: ["store-demo-01"],
    feriasProgramadas: [],
    logAfastamentos: [],
    conquistas: [
      {
        id: "ach-02",
        data: "2025-01-20",
        tipo: "Reconhecimento",
        titulo: "Destaque em NPS e Fidelização",
        descricao: "Manteve índice de satisfação de clientes VIP acima de 96 pontos.",
      },
    ],
    badges: [
      {
        id: "eb-03",
        badgeTemplateId: "badge-mentoria",
        dataConcessao: "2025-01-22",
      },
    ],
    observacoes: [
      {
        id: "obs-02",
        data: "2025-02-12",
        texto:
          "Inteligência organizacional informal: demonstra expectativa de promoção para gerência titular nos próximos 6 meses.",
      },
    ],
  },
  {
    id: "emp-demo-03",
    nome: "Renata Tavares",
    tipo: "Gerente",
    cargo: "Gerente de Unidade Shopping",
    dataAdmissao: "2021-08-05",
    status: "Ativo",
    telefone: "(11) 99311-4090",
    email: "renata.tavares@redecorporativa.com.br",
    lojaAtualId: "store-demo-02",
    historicoLojas: ["store-demo-02"],
    feriasProgramadas: [],
    logAfastamentos: [],
    conquistas: [],
    badges: [
      {
        id: "eb-04",
        badgeTemplateId: "badge-lideranca",
        dataConcessao: "2024-11-10",
      },
    ],
    observacoes: [
      {
        id: "obs-03",
        data: "2025-02-14",
        texto:
          "Excelente controle operacional de estoque e escala em horário de pico no Shopping Ibirapuera.",
      },
    ],
  },
  {
    id: "emp-demo-04",
    nome: "Thiago Azevedo",
    tipo: "Gerente",
    cargo: "Gerente de Operações Concept",
    dataAdmissao: "2023-06-01",
    status: "Ativo",
    telefone: "(11) 97654-3210",
    email: "thiago.azevedo@redecorporativa.com.br",
    lojaAtualId: "store-demo-03",
    historicoLojas: ["store-demo-03"],
    feriasProgramadas: [],
    logAfastamentos: [],
    conquistas: [],
    badges: [],
    observacoes: [
      {
        id: "obs-04",
        data: "2025-02-16",
        texto:
          "Conduzindo retrofit da unidade com foco na preservação da carteira de clientes recorrentes via atendimento remoto.",
      },
    ],
  },
];

/**
 * Lojas demonstrativas para o módulo de Gestão Regional (`workforce`).
 */
const DEMO_STORES: Store[] = [
  {
    id: "store-demo-01",
    nome: "Unidade Paulista Flagship",
    endereco: "Av. Paulista, 1450 — Bela Vista, São Paulo - SP",
    regiao: "Zona Sul / Paulista",
    status: "Operando",
    gerenteNome: "Lucas Ferreira",
    gerenteTelefone: "(11) 98711-2233",
    gerenteEmail: "lucas.ferreira@redecorporativa.com.br",
    metaVendasMensal: 950000,
    vendasRealizadas: 1020000,
    dataCriacao: "2023-01-10T10:00:00.000Z",
    ultimaVisitaData: "2025-02-15T14:00:00.000Z",
    proximaVisitaData: "2025-03-04T10:00:00.000Z",
    funcionarios: DEMO_EMPLOYEES.filter((e) => e.lojaAtualId === "store-demo-01"),
    logsRH: [
      {
        id: "hr-demo-01",
        data: "2025-02-10T11:00:00.000Z",
        tipo: "Promoção",
        funcionarioId: "emp-demo-02",
        funcionarioNome: "Camila Rocha",
        descricao:
          "Mapeamento de sucessão: colaboradora assumiu responsabilidade de subgerência após avaliação trimestral de inteligência organizacional informal e retenção.",
        acoesPendentes: [
          {
            id: "act-hr-01",
            descricao: "Formalizar plano de desenvolvimento individual (PDI) para gerência titular",
            prazo: "2025-03-15",
            concluida: false,
          },
        ],
      },
    ],
    logsVisitas: [
      {
        id: "visit-demo-01",
        data: "2025-02-15T14:00:00.000Z",
        horaInicio: "14:00",
        horaFim: "16:30",
        tipo: "Auditoria",
        avaliacoes: {
          limpeza: 5,
          organizacao: 5,
          atendimento: 5,
          estoque: 4,
        },
        observacoesPositivas:
          "Padrão visual impecável e equipe altamente engajada. Sinais informais de clima e retenção indicam forte alinhamento com a liderança local.",
        problemasIdentificados:
          "Necessidade de reforço pontual na reposição de itens da linha premium aos sábados.",
        pessoasPresentes: ["Lucas Ferreira", "Camila Rocha"],
        acoesPendentes: [
          {
            id: "act-vis-01",
            descricao: "Ajustar janela de abastecimento logístico de quinta para quarta-feira",
            prazo: "2025-03-01",
            concluida: true,
          },
        ],
      },
    ],
    contatosGerencia: [
      {
        id: "mc-demo-01",
        nome: "Henrique Vasconcelos",
        cargo: "Diretor Nacional de Varejo",
        nivel: 2,
        email: "henrique.vasconcelos@redecorporativa.com.br",
        telefone: "(11) 99988-1122",
      },
    ],
    interacoesGerencia: [],
    notasGerais:
      "Loja âncora da regional. Inteligência organizacional informal aponta ambiente colaborativo, baixa rotatividade (turnover < 4% a.a.) e pipeline sólido de talentos internos.",
  },
  {
    id: "store-demo-02",
    nome: "Filial Shopping Ibirapuera",
    endereco: "Av. Ibirapuera, 3103 — Moema, São Paulo - SP",
    regiao: "Zona Sul",
    status: "Operando",
    gerenteNome: "Renata Tavares",
    gerenteTelefone: "(11) 99311-4090",
    gerenteEmail: "renata.tavares@redecorporativa.com.br",
    metaVendasMensal: 720000,
    vendasRealizadas: 685000,
    dataCriacao: "2023-04-20T10:00:00.000Z",
    ultimaVisitaData: "2025-02-12T10:00:00.000Z",
    proximaVisitaData: "2025-03-06T14:30:00.000Z",
    funcionarios: DEMO_EMPLOYEES.filter((e) => e.lojaAtualId === "store-demo-02"),
    logsRH: [
      {
        id: "hr-demo-02",
        data: "2025-02-05T15:00:00.000Z",
        tipo: "Outro",
        funcionarioId: "emp-demo-03",
        funcionarioNome: "Renata Tavares",
        descricao:
          "Coleta de sinais informais de clima e retenção: equipe solicitou revisão na escala de domingos para equilibrar jornada e produtividade.",
        acoesPendentes: [
          {
            id: "act-hr-02",
            descricao: "Implementar novo modelo de revezamento quinzenal",
            prazo: "2025-03-10",
            concluida: false,
          },
        ],
      },
    ],
    logsVisitas: [
      {
        id: "visit-demo-02",
        data: "2025-02-12T10:00:00.000Z",
        horaInicio: "10:00",
        horaFim: "12:15",
        tipo: "Rotina",
        avaliacoes: {
          limpeza: 5,
          organizacao: 4,
          atendimento: 5,
          estoque: 4,
        },
        observacoesPositivas:
          "Taxa de conversão acima da média regional e excelente recepção aos clientes recorrentes.",
        problemasIdentificados:
          "Fluxo de caixa no balcão secundário apresentou lentidão durante horários de pico.",
        pessoasPresentes: ["Renata Tavares"],
        acoesPendentes: [],
      },
    ],
    contatosGerencia: [],
    interacoesGerencia: [],
    notasGerais:
      "Operação consistente a 95% da meta mensal. Monitoramento contínuo de inteligência organizacional informal para blindar talentos contra abordagens de concorrentes do mesmo shopping.",
  },
  {
    id: "store-demo-03",
    nome: "Unidade Pinheiros Concept",
    endereco: "Rua dos Pinheiros, 820 — Pinheiros, São Paulo - SP",
    regiao: "Zona Oeste",
    status: "Reforma",
    gerenteNome: "Thiago Azevedo",
    gerenteTelefone: "(11) 97654-3210",
    gerenteEmail: "thiago.azevedo@redecorporativa.com.br",
    metaVendasMensal: 540000,
    vendasRealizadas: 410000,
    dataCriacao: "2023-08-12T10:00:00.000Z",
    ultimaVisitaData: "2025-02-18T09:30:00.000Z",
    proximaVisitaData: "2025-03-02T09:30:00.000Z",
    funcionarios: DEMO_EMPLOYEES.filter((e) => e.lojaAtualId === "store-demo-03"),
    logsRH: [],
    logsVisitas: [
      {
        id: "visit-demo-03",
        data: "2025-02-18T09:30:00.000Z",
        horaInicio: "09:30",
        horaFim: "11:30",
        tipo: "Auditoria",
        avaliacoes: {
          limpeza: 4,
          organizacao: 4,
          atendimento: 5,
          estoque: 5,
        },
        observacoesPositivas:
          "Operação omnichannel improvisada durante o retrofit manteve 76% do faturamento previsto.",
        problemasIdentificados:
          "Cronograma de marcenaria do piso superior requer acompanhamento diário.",
        pessoasPresentes: ["Thiago Azevedo"],
        acoesPendentes: [],
      },
    ],
    contatosGerencia: [],
    interacoesGerencia: [],
    notasGerais:
      "Unidade em atualização arquitetônica parcial. Sinais informais de clima e retenção demonstram resiliência da equipe comercial com suporte de vendas assistidas digitais.",
  },
];

/**
 * Dados fictícios completos para o módulo de Gestão Regional & Lojas (`workforce`).
 */
export const DEMO_WORKFORCE_DATA: WorkforceData = {
  stores: DEMO_STORES,
  employees: DEMO_EMPLOYEES,
  badgeTemplates: DEMO_BADGE_TEMPLATES,
};

/**
 * Dados fictícios para o módulo de Headhunting & Banco de Talentos C-Level (`talent`).
 */
export const DEMO_TALENT_DATA: TalentVaultData = {
  talents: [
    {
      id: "talent-demo-01",
      nome: "Rodrigo Albuquerque",
      cargoAtual: "VP of Engineering",
      empresaAtual: "CloudScale Inc.",
      senioridade: "C-Level",
      telefonePessoal: "(11) 99102-8844",
      emailPessoal: "rodrigo.albuquerque.exec@proton.me",
      localizacao: "São Paulo - SP (Híbrido)",
      disponibilidadeMudanca: "Ouvindo Mercado",
      pacoteRemuneracao: {
        salarioFixoMensal: 48000,
        bonusAnualEstimado: 280000,
        pretensaoMinima: 56000,
        possuiStockOptions: true,
        possuiNaoCompeticao: true,
      },
      motivoRealInsatisfacao:
        "Mudança recente no controle societário da matriz reduziu a autonomia de P&D local e postergou o evento de liquidez do plano de Stock Options.",
      perfilComportamental:
        "Liderança técnica pragmática, especialista em arquitetura distribuída de alta escala e formação de times de engenharia acima de 120 pessoas.",
      historicoCarreira: [
        {
          id: "ch-01",
          empresa: "DataCore Latam",
          cargo: "Director of Software Engineering",
          periodo: "2020 - 2023",
          motivoSaidaReal:
            "Concluiu ciclo de preparação para M&A e aceitou convite para estruturar a operação da CloudScale.",
        },
      ],
      interacoes: [
        {
          id: "ti-01",
          data: "2025-02-14",
          canal: "Café / Presencial",
          resumo:
            "Reunião reservada nos Jardins. Confirmou interesse em posições de CTO em empresas Series C+ com cláusula de buyout para o vesting atual.",
          proximoPasso: "Apresentar shortlist confidencial até início de março.",
        },
      ],
      tags: ["Arquitetura Distribuída", "SaaS B2B", "C-Level", "Gestão de Escala"],
      notasConfidenciais:
        "Cláusula de non-compete restrita apenas a provedores diretos de infraestrutura cloud pública por 6 meses.",
      dataCriacao: "2025-01-12T10:00:00.000Z",
      ultimaAtualizacao: "2025-02-16T18:30:00.000Z",
    },
    {
      id: "talent-demo-02",
      nome: "Mariana Vasconcelos",
      cargoAtual: "CPO",
      empresaAtual: "FinBank S.A.",
      senioridade: "C-Level",
      telefonePessoal: "(11) 98450-1920",
      emailPessoal: "mariana.vasconcelos@icloud.com",
      localizacao: "São Paulo - SP",
      disponibilidadeMudanca: "Buscando Ativamente",
      pacoteRemuneracao: {
        salarioFixoMensal: 52000,
        bonusAnualEstimado: 360000,
        pretensaoMinima: 60000,
        possuiStockOptions: true,
        possuiNaoCompeticao: false,
      },
      motivoRealInsatisfacao:
        "Fricção estratégica com a nova diretoria de compliance sobre velocidade de lançamento de produtos de crédito B2B.",
      perfilComportamental:
        "Orientada a métricas de retenção, forte capacidade de articulação com conselho de administração e visão de produto centrada em receita recorrente.",
      historicoCarreira: [
        {
          id: "ch-02",
          empresa: "PayFlow Pagamentos",
          cargo: "Head of Product",
          periodo: "2019 - 2022",
          motivoSaidaReal: "Transição planejada após fusão com conglomerado bancário.",
        },
      ],
      interacoes: [
        {
          id: "ti-02",
          data: "2025-02-19",
          canal: "WhatsApp",
          resumo:
            "Disponibilidade imediata para entrevistas confidenciais fora do horário comercial.",
        },
      ],
      tags: ["Fintech", "Product-Led Growth", "CPO", "Meios de Pagamento"],
      notasConfidenciais:
        "Pode trazer 2 Group Product Managers de altíssima performance caso assuma nova operação.",
      dataCriacao: "2025-01-20T14:00:00.000Z",
      ultimaAtualizacao: "2025-02-19T11:20:00.000Z",
    },
    {
      id: "talent-demo-03",
      nome: "André Cavalcanti",
      cargoAtual: "CISO",
      empresaAtual: "CyberShield",
      senioridade: "Diretoria",
      telefonePessoal: "(11) 97781-6005",
      emailPessoal: "andre.cavalcanti.sec@proton.me",
      localizacao: "Remoto / São Paulo - SP",
      disponibilidadeMudanca: "Desesperado para Sair",
      pacoteRemuneracao: {
        salarioFixoMensal: 39000,
        bonusAnualEstimado: 150000,
        pretensaoMinima: 44000,
        possuiStockOptions: false,
        possuiNaoCompeticao: true,
      },
      motivoRealInsatisfacao:
        "Congelamento de orçamento de segurança ofensiva após reestruturação financeira interna, gerando desalinhamento com sua governança de risco.",
      perfilComportamental:
        "Rigoroso, profundo especialista em criptografia, Zero-Trust e resposta a incidentes críticos em instituições reguladas.",
      historicoCarreira: [],
      interacoes: [],
      tags: ["Cybersecurity", "Zero-Trust", "ISO 27001", "CISO"],
      notasConfidenciais:
        "Prioriza autonomia técnica e reporte direto ao CEO ou Comitê de Auditoria.",
      dataCriacao: "2025-02-02T09:00:00.000Z",
      ultimaAtualizacao: "2025-02-20T16:00:00.000Z",
    },
  ],
};

/**
 * Dados fictícios para o módulo de Dossiês Confidenciais & Estratégia Jurídica (`dossier`).
 */
export const DEMO_DOSSIER_DATA: DossierVaultData = {
  cases: [
    {
      id: "case-demo-01",
      codinomeCaso: "Operação Fênix — Disputa Societária",
      area: "Corporativo / Societário",
      status: "Pré-Litígio",
      partesEnvolvidas: "Holding Vanguarda S.A. vs. Grupo Acionista Minoritário Sigma",
      tesePrincipal:
        "Sustentação da validade do acordo de acionistas firmado em 2022 e comprovação de cumprimento integral das metas de governança e EBITDA.",
      estrategiaConfidencial:
        "Apresentar laudo pericial contábil independente em reunião extraordinária para desestimular judicialização e propor aquisição das cotas minoritárias com deságio de liquidez.",
      fontesETestemunhas: [
        {
          id: "w-demo-01",
          codinome: "Fonte Oráculo",
          nomeReal: "Dr. Marcelo Tavares (Ex-Diretor de Relações com Investidores)",
          grauConfiabilidade: 5,
          dispostoADepor: "Apenas Sob Sigilo",
          contatoSeguro: "Signal Corporativo Verificado",
          oQueSabe:
            "Participou da redação das atas do conselho que aprovaram o plano de investimentos questionado.",
          vulnerabilidadesOuRisco:
            "Possui acordo de confidencialidade vigente; depoimento formal requer requisição arbitral.",
        },
        {
          id: "w-demo-02",
          codinome: "Auditor Alfa",
          nomeReal: " Ricardo Lima (Sócio de Auditoria Independente)",
          grauConfiabilidade: 5,
          dispostoADepor: "Sim",
          contatoSeguro: "Canal Jurídico Direto",
          oQueSabe:
            "Validou a regularidade integral dos balanços auditados nos exercícios de 2023 e 2024.",
          vulnerabilidadesOuRisco: "Nenhuma vulnerabilidade técnica identificada.",
        },
      ],
      linhaDoTempo: [
        {
          id: "tl-01",
          data: "2025-01-18",
          titulo: "Notificação Extrajudicial Recebida",
          descricao: "Pedido de esclarecimentos sobre reinvestimento de dividendos retidos.",
          evidenciasDisponiveis: "Ata da AGE de 14/04/2024 assinada digitalmente por todas as partes.",
          pontoFraco: "Ambiguidade redacional na cláusula 8.4 do acordo acessório.",
        },
      ],
      notasEstrategicas:
        "Câmara de Arbitragem do Mercado (CAM) mapeada caso a mediação direta não seja concluída até o final do trimestre.",
      dataCriacao: "2025-01-19T10:00:00.000Z",
      ultimaAtualizacao: "2025-02-21T14:20:00.000Z",
    },
    {
      id: "case-demo-02",
      codinomeCaso: "Dossiê Atlas — Auditoria de Compliance",
      area: "Compliance / Fraude",
      status: "Em Investigação",
      partesEnvolvidas: "Comitê de Auditoria Interna vs. Fornecedores Homologados Regional Norte",
      tesePrincipal:
        "Verificação de conformidade nos processos de cotação e homologação de contratos de logística terceirizada.",
      estrategiaConfidencial:
        "Cruzamento forense de metadados de propostas comerciais antes de qualquer notificação aos gestores de compras envolvidos.",
      fontesETestemunhas: [
        {
          id: "w-demo-03",
          codinome: "Sentinela",
          nomeReal: "Analista Sênior de Controle Interno",
          grauConfiabilidade: 4,
          dispostoADepor: "Apenas Sob Sigilo",
          contatoSeguro: "Canal de Ética Criptografado",
          oQueSabe:
            "Identificou padrão recorrente de aditivos contratuais próximos ao teto de alçada regional.",
          vulnerabilidadesOuRisco: "Receio de exposição hierárquica dentro da diretoria operacional.",
        },
      ],
      linhaDoTempo: [],
      notasEstrategicas:
        "Relatório preliminar blindado em cofre offline para preservação absoluta da cadeia de custódia.",
      dataCriacao: "2025-02-01T08:30:00.000Z",
      ultimaAtualizacao: "2025-02-20T17:45:00.000Z",
    },
    {
      id: "case-demo-03",
      codinomeCaso: "Caso Vanguard — Propriedade Intelectual",
      area: "Corporativo / Societário",
      status: "Acordo Sigiloso",
      partesEnvolvidas: "Vanguard Labs S.A. vs. Ex-Consultor Técnico Associado",
      tesePrincipal:
        "Proteção de segredo industrial referente a algoritmos proprietários de otimização de rotas.",
      estrategiaConfidencial:
        "Composição amigável com assinatura de termo de ratificação de titularidade e quitação recíproca sob cláusula penal reforçada.",
      fontesETestemunhas: [
        {
          id: "w-demo-04",
          codinome: "Perito Forense",
          nomeReal: "Eng. Gustavo Paiva",
          grauConfiabilidade: 5,
          dispostoADepor: "Sim",
          contatoSeguro: "E-mail PGP Verificado",
          oQueSabe: "Emitiu parecer técnico comprovando a anterioridade dos repositórios internos.",
          vulnerabilidadesOuRisco: "Baixo risco de contestação.",
        },
      ],
      linhaDoTempo: [],
      notasEstrategicas:
        "Instrumento de acordo assinado e arquivado com hash SHA-256 validado pelas partes.",
      dataCriacao: "2024-12-05T11:00:00.000Z",
      ultimaAtualizacao: "2025-02-15T12:00:00.000Z",
    },
  ],
};

/**
 * Dados fictícios para o módulo de Prontuário Clínico & Notas Terapêuticas (`therapy`).
 */
export const DEMO_THERAPY_DATA: TherapyVaultData = {
  patients: [
    {
      id: "pt-demo-01",
      identificadorOuIniciais: "Paciente M.S.R.",
      status: "Ativo",
      frequencia: "Semanal",
      diaHoraPreferencia: "Terças-feiras às 18h00",
      contatoEmergencia: "Cônjuge — (11) 99812-3344",
      medicacaoRelatada: "Escitalopram 15mg (uso matinal acompanhado por psiquiatra)",
      alertaRiscoIminente: "Sobrecarga executiva aguda com episódios de insônia inicial",
      objetivosTerapeuticos: [
        "Regulação de ansiedade corporativa",
        "Estabelecimento de limites saudáveis no trabalho",
        "Prevenção de síndrome de burnout",
      ],
      sessoes: [
        {
          id: "sess-demo-01",
          data: "2025-02-18",
          duracaoMinutos: 50,
          relatoPaciente:
            "Relata semana de alta pressão devido à apresentação de resultados trimestrais ao conselho. Observou melhora na qualidade do sono após desligar notificações às 21h.",
          hipotesesDiagnosticas:
            "Padrão de hiper-responsabilização associado à necessidade de controle absoluto sobre variáveis externas.",
          notasContratransferencia:
            "Percepção de aceleração no ritmo da fala do paciente nos primeiros 15 minutos; mantive cadência pausada e acolhedora para favorecer a desaceleração autonômica no setting.",
          intervencoesRealizadas:
            "Questionamento socrático sobre delegação de tarefas e validação dos avanços na higiene do sono.",
          combinadosEProximaSessao:
            "Observar situações da semana em que assumiu demandas que pertenciam aos pares.",
        },
        {
          id: "sess-demo-02",
          data: "2025-02-11",
          duracaoMinutos: 50,
          relatoPaciente:
            "Trouxe reflexões sobre a dificuldade em desfrutar períodos de descanso sem sentimento de culpa produtiva.",
          hipotesesDiagnosticas:
            "Esquema de padrões inflexíveis ancorado na trajetória familiar de validação exclusiva por desempenho.",
          notasContratransferencia:
            "Sentimento de empatia diante da autocrítica severa do paciente; cuidado técnico para não reforçar postura avaliativa.",
          intervencoesRealizadas:
            "Reestruturação cognitiva e exercício de ancoragem no presente.",
          combinadosEProximaSessao:
            "Reservar um bloco de 2 horas no fim de semana sem dispositivos eletrônicos.",
        },
      ],
      notasGerais:
        "Aliança terapêutica sólida e excelente capacidade de insight. Evolução clínica consistente ao longo dos últimos 4 meses.",
      dataInicio: "2024-10-08T18:00:00.000Z",
      ultimaSessaoData: "2025-02-18",
    },
    {
      id: "pt-demo-02",
      identificadorOuIniciais: "Paciente C.A.L.",
      status: "Ativo",
      frequencia: "Semanal",
      diaHoraPreferencia: "Quintas-feiras às 14h30",
      contatoEmergencia: "Irmã — (11) 98765-1029",
      medicacaoRelatada: "Venlafaxina 75mg",
      alertaRiscoIminente: "Monitoramento de transição familiar e adaptação pós-mudança de cidade",
      objetivosTerapeuticos: [
        "Elaboração de transição de ciclo de vida",
        "Fortalecimento de rede de apoio social",
        "Autonomia afetiva",
      ],
      sessoes: [
        {
          id: "sess-demo-03",
          data: "2025-02-20",
          duracaoMinutos: 50,
          relatoPaciente:
            "Compartilhou avanços na integração ao novo ambiente profissional e retomada de atividades culturais.",
          hipotesesDiagnosticas:
            "Redução gradual da evitação experiencial e ampliação de repertório interpessoal.",
          notasContratransferencia:
            "Clima afetivo de serenidade e abertura genuína na sessão; contratransferência positiva indicando fortalecimento da autonomia do paciente.",
          intervencoesRealizadas:
            "Clarificação de valores pessoais e reforço de comportamentos de engajamento social.",
          combinadosEProximaSessao: "Continuar registro de eventos significativos de conexão.",
        },
      ],
      notasGerais:
        "Paciente demonstra ótima adesão ao processo clínico e estabilidade emocional progressiva.",
      dataInicio: "2024-11-14T14:30:00.000Z",
      ultimaSessaoData: "2025-02-20",
    },
    {
      id: "pt-demo-03",
      identificadorOuIniciais: "Paciente R.T.B.",
      status: "Em Pausa",
      frequencia: "Quinzenal",
      diaHoraPreferencia: "Segundas-feiras às 11h00",
      contatoEmergencia: "Mãe — (11) 99123-4567",
      medicacaoRelatada: "Sem medicação alopática ativa",
      alertaRiscoIminente: "",
      objetivosTerapeuticos: [
        "Planejamento de transição de carreira internacional",
        "Autoconhecimento e tomada de decisão",
      ],
      sessoes: [
        {
          id: "sess-demo-04",
          data: "2025-01-27",
          duracaoMinutos: 50,
          relatoPaciente:
            "Sessão de fechamento de ciclo antes de viagem de intercâmbio executivo de 60 dias.",
          hipotesesDiagnosticas:
            "Maturidade emocional consolidada para lidar com ambiguidade e novos contextos culturais.",
          notasContratransferencia:
            "Sensação de ciclo bem conduzido e confiança nos recursos internos desenvolvidos pelo paciente.",
          intervencoesRealizadas: "Síntese dos ganhos terapêuticos do semestre e plano de prevenção.",
          combinadosEProximaSessao: "Retorno programado para abril após conclusão do intercâmbio.",
        },
      ],
      notasGerais: "Pausa programada de comum acordo durante período no exterior.",
      dataInicio: "2024-06-10T11:00:00.000Z",
      ultimaSessaoData: "2025-01-27",
    },
  ],
};

/**
 * Mapeamento de nomes amigáveis de arquivos para cada módulo de demonstração.
 */
export const DEMO_VAULT_NAMES: Record<CRMType, string> = {
  sales: "Demo-Blackbook-Vendas-B2B",
  workforce: "Demo-Gestao-Regional-Lojas",
  talent: "Demo-Headhunting-C-Level",
  dossier: "Demo-Dossies-Juridico-Compliance",
  therapy: "Demo-Prontuario-Clinico-Sigiloso",
};

/**
 * Retorna a carga de dados fictícios tipada correspondente ao módulo solicitado.
 * @param crmType Identificador do módulo vertical do Safe-Vault.
 * @returns Carga de dados populada e pronta para renderização.
 */
export function getDemoPayloadByType(crmType: CRMType): VaultPayload {
  switch (crmType) {
    case "workforce":
      return DEMO_WORKFORCE_DATA;
    case "talent":
      return DEMO_TALENT_DATA;
    case "dossier":
      return DEMO_DOSSIER_DATA;
    case "therapy":
      return DEMO_THERAPY_DATA;
    case "sales":
    default:
      return DEMO_SALES_DATA;
  }
}

/**
 * Constrói um envelope `EncryptedData` completo de demonstração para qualquer módulo do sistema.
 * @param crmType Identificador do módulo vertical do Safe-Vault.
 * @returns Envelope estruturado compatível com o fluxo de autenticação e estado da aplicação.
 */
export function buildDemoEncryptedData(crmType: CRMType): EncryptedData {
  const now = new Date().toISOString();
  return {
    fileName: DEMO_VAULT_NAMES[crmType],
    createdDate: now,
    lastModified: now,
    crmType,
    data: getDemoPayloadByType(crmType),
    metadata: {
      schemaVersion: 2,
      cipherAlgorithm: "AES-GCM-256 (Sandbox Demo)",
    },
  };
}
