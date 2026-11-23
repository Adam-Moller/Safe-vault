# 🛡️ Safe-Vault
### *Sovereign, Zero-Knowledge & Local-First Personal CRM*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Security](https://img.shields.io/badge/Cryptography-AES--GCM--256-success)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
[![Integrity](https://img.shields.io/badge/Integrity-SHA--256%20Checksum-blue)](#-2-decisões-de-arquitetura-e-engenharia-de-software-adrs)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Zero%20'any'%20%7C%20TSDoc-green)](#-4-qualidade-de-código--melhores-práticas-aplicadas)
[![Architecture](https://img.shields.io/badge/Architecture-Local--First%20%2F%20Zero--Knowledge-orange)](#-2-decisões-de-arquitetura-e-engenharia-de-software-adrs)
[![PWA](https://img.shields.io/badge/Distribution-PWA%20Offline-purple)](#adr-02-pwa--local-first-vs-aplicativos-nativos-mobile-androidios)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?logo=github)](https://adam-moller.github.io/Safe-vault/)

> 🌐 **Demonstração Interativa Online:** [**adam-moller.github.io/Safe-vault**](https://adam-moller.github.io/Safe-vault/) *(Inclui modo Sandbox com dados fictícios pré-carregados para os 5 módulos)*

---

## 📸 Interface e Módulos em Ação

![Tela de Desbloqueio Zero-Knowledge](docs/screenshots/01-unlock.png)
*Print 1 — Autenticação local Zero-Knowledge com derivação de chave PBKDF2, verificação de integridade e seleção de perfil de domínio.*

![Módulo Sales Blackbook](docs/screenshots/02-sales-vault.png)
*Print 2 — Módulo Vendas B2B (`Sales Blackbook` em Dark Mode): Gestão de decisores, pipeline estratégico e notas confidenciais.*

![Módulo Dossiês Confidenciais](docs/screenshots/05-legal-dossier.png)
*Print 3 — Módulo Dossiês & Investigação (`Legal Dossier` em Light Mode): Arquitetura polimórfica que adapta atributos conforme o domínio e suporte nativo a temas claro/escuro.*

<details>
<summary><b>🔍 Clique para expandir os demais módulos especializados (Gestão Regional, Headhunting C-Level e Prontuário Clínico)</b></summary>
<br>

### 🏬 Gestão Regional (`Workforce Vault` — Dark Mode)
![Workforce Vault](docs/screenshots/03-workforce-vault.png)
*Acompanhamento de metas por unidade, auditorias operacionais de visita, badges de desempenho e sinais informais de clima e retenção.*

---

### 👔 Headhunting & Talentos (`Talent Vault` — Dark Mode)
![Talent Vault](docs/screenshots/04-talent-vault.png)
*Mapeamento confidencial de executivos C-Level, comparativo de pacotes de remuneração (Fixo, Bônus, Stock Options), cláusulas de Non-Compete e fatores reais de transição.*

---

### 🩺 Prontuário & Notas Clínicas (`Therapy Vault` — Light Mode)
![Therapy Vault](docs/screenshots/06-therapy-vault.png)
*Gestão clínica ultra-privada com identificação anonimizada por iniciais, alertas de risco, evolução de sessões e camada protegida de contratransferência.*

</details>

---

## 📖 1. Visão Geral do Projeto

O **Safe-Vault** é um sistema de gerenciamento de relacionamentos e informações estratégicas (**Personal CRM**) construído sob a premissa de **Soberania Digital**, **Privacidade Absoluta** e **Zero-Knowledge Architecture**.

### O Problema do Software Corporativo Tradicional
Em ambientes corporativos modernos, sistemas centrais de CRM e ERP (Salesforce, SAP, Jira, Totvs) pertencem exclusivamente ao empregador, são monitorados pela TI e submetidos a auditorias legais e compliance corporativo:
* **Perda de Capital Relacional:** Quando um vendedor ou executivo sênior deixa uma empresa, perde o histórico e a inteligência de relacionamento que construiu ao longo de anos.
* **Limitação para Contextos Sensíveis de Liderança:** Líderes de equipe e gerentes regionais frequentemente lidam com percepções qualitativas vitais para a tomada de decisão humana (ex.: dinâmicas de conflito entre liderados, questões pessoais impactando produtividade, inteligência organizacional informal, dinâmicas interpessoais críticas e sinais precoces de risco de retenção) que não devem constar em sistemas formais de RH.
* **Vazamento e Intrusão em Nuvem:** Profissionais como advogados, psicólogos e recrutadores executivos lidam com dados que, se armazenados em nuvens públicas de terceiros, tornam-se vulneráveis a vazamentos, acessos não autorizados e incidentes de ransomware.

### A Solução: *Sovereign Personal Vault*
O **Safe-Vault** devolve a custódia total dos dados ao usuário. **Nenhum dado trafega por servidores externos.** Todas as informações são criptografadas diretamente na memória do navegador utilizando primitivas criptográficas nativas de padrão militar e persistidas no dispositivo do usuário (IndexedDB local) ou em arquivos de backup invioláveis (`.enc` / `.vault`).

---

## 🏛️ 2. Decisões de Arquitetura e Engenharia de Software (ADRs)

Para garantir máxima performance, segurança e portabilidade, este projeto adotou escolhas deliberadas de arquitetura que rompem com o paradigma clássico de backends centralizados:

```mermaid
graph TD
    Client["Dispositivo do Usuário: Browser / PWA"] --> UI["Interface React 18 + Shadcn UI"]
    UI --> Hook["Custom Hook: useVaultAutoSave"]
    Hook --> CoreDomain["Gerenciador Polimórfico de Módulos & Perfis"]
    
    subgraph ZeroKnowledgeEngine ["Zero-Knowledge Security Engine"]
        CoreDomain --> KDF["PBKDF2 100.000 iterações SHA-256"]
        KDF --> Key["Chave AES-GCM 256 bits em Memória Volátil"]
        Key --> Cipher["Criptografia / Descriptografia Autenticada"]
        Cipher --> Integrity["Assinatura & Verificação SHA-256 Checksum"]
    end
    
    subgraph Storage ["Armazenamento Soberano Local"]
        Integrity --> IDB[("IndexedDB Local Sandbox")]
        Integrity --> VaultFile["Arquivo Exportável Inviolável (.enc / .vault)"]
    end
    
    style ZeroKnowledgeEngine fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#0f172a
    style Storage fill:#f8fafc,stroke:#64748b,stroke-width:1.5px,color:#0f172a
```

### ADR 01: TypeScript vs. Java / C# / Python no Backend
* **Decisão:** Execução integral *Client-Side* com TypeScript rigoroso, dispensando completamente backends remotos.
* **Justificativa Técnica:**
  1. **Premissa de Conhecimento Zero (Zero-Knowledge):** Se houvesse um backend em Java/C#, dados descriptografados ou chaves de sessão precisariam trafegar pela rede ou ser manipulados no servidor, criando um ponto único de falha (*Single Point of Failure*) e vetor de interceptação.
  2. **Ambiente de Execução Universal (Universal Runtime):** O ecossistema web roda nativamente em qualquer motor JavaScript moderno (V8 no Chromium, JavaScriptCore no WebKit do iOS/macOS, SpiderMonkey no Firefox) sem necessidade de instalação de JVM, runtimes pesados ou dependências de sistema operacional.
  3. **Segurança de Tipos em Domínios Heterogêneos:** TypeScript oferece tipagem estática estrutural sem overhead de performance em runtime, permitindo validação robusta de esquemas complexos para cinco perfis de negócios distintos.

### ADR 02: PWA & Local-First vs. Aplicativos Nativos Mobile (Android/iOS)
* **Decisão:** Implementação como aplicação web progressiva (*Progressive Web App*) baseada em padrões abertos.
* **Justificativa Técnica:**
  1. **Desburocratização e Distribuição Direta:** Lojas proprietárias (Apple App Store e Google Play Store) impõem diretrizes restritivas, telemetria obrigatória e processos de aprovação morosos. Um PWA local-first é distribuível instantaneamente, sem intermediários.
  2. **Isolamento de Sandbox do Navegador:** O navegador provê o sandbox de segurança mais testado do mercado. Nenhum dado do cofre é exposto a permissões globais invasivas do sistema operacional nativo.
  3. **Pegada de Recursos Mínima:** Em vez de distribuir executáveis Electron ou pacotes nativos de mais de 150 MB, o PWA consome o motor já presente no dispositivo, gerando bundles ultra-otimizados inferiores a 1 MB compactados.

### ADR 03: Web Crypto API Nativa vs. Bibliotecas de Terceiros (CryptoJS)
* **Decisão:** Uso exclusivo da API `crypto.subtle` nativa do navegador (W3C Web Cryptography Standard).
* **Justificativa Técnica:**
  1. **Mitigação de Ataques à Cadeia de Suprimentos (*Supply-Chain Attacks*):** Bibliotecas NPM de criptografia são alvos frequentes de injeção de código malicioso. O uso da API nativa elimina dependências externas no núcleo de segurança.
  2. **Aceleração por Hardware (AES-NI):** A Web Crypto API é compilada nativamente nos binários dos navegadores em C++, alavancando instruções dedicadas de hardware da CPU para operações AES e SHA-256, eliminando gargalos de CPU e garantindo imunidade a ataques de temporização (*timing attacks*).

### ADR 04: Envelope de Exportação com Checksum SHA-256 Antifraude
* **Decisão:** Criação de um envelope de dados com metadados explícitos e soma de verificação SHA-256 do payload criptografado.
* **Justificativa Técnica:**
  1. **Detecção Antecipada de Corrupção:** Arquivos transferidos via pendrive ou nuvem podem sofrer corrupção de bits (*bit rot*) ou downloads parciais. O cálculo do hash SHA-256 identifica adulterações antes de disparar o dispendioso processo de derivação de chave de 100.000 iterações PBKDF2.
  2. **Interoperabilidade e Versionamento:** Permite migrações transparentes de esquemas entre versões futuras sem quebrar dados legados.

---

## 💼 3. Módulos e Perfis Especializados de Nicho

O Safe-Vault conta com uma arquitetura modular por perfis de domínio:

| Módulo | Público-Alvo | Informações Estratégicas Sigilosas Mapeadas |
| :--- | :--- | :--- |
| **💼 Vendas B2B (*Sales Blackbook*)** | Executivos Comerciais, Vendedores Sênior | Mapeamento de decisores reais, canais pessoais de contato, notas estratégicas de negociação e carteira própria portável. |
| **🏬 Gestão Regional (*Workforce Vault*)** | Gerentes de Área, Coordenadores de Lojas | Diário de campo, dinâmicas interpessoais de filiais, sinais informais de clima e retenção, histórico de conduta e auditorias. |
| **👔 Headhunting & Talentos (*Talent Vault*)** | Recrutadores Executivos, Consultores de RH | Pacote salarial real (fixo, bônus, equity), motivos não-públicos de transição, cláusulas de não-competição e motivadores reais. |
| **⚖️ Dossiês Confidenciais (*Legal Dossier*)** | Advogados, Investigadores, Compliance | Fontes e testemunhas sigilosas, vulnerabilidades probatórias, pontos críticos de exposição e estratégias pré-litígio. |
| **🩺 Prontuário & Notas Clínicas (*Therapy Vault*)** | Psicólogos, Psicanalistas, Terapeutas | Evolução clínica, alertas de risco de crise, objetivos e anotações protegidas de **Contratransferência** do profissional. |

---

## 💎 4. Qualidade de Código & Melhores Práticas Aplicadas

Como projeto de vitrine técnica, a base de código do Safe-Vault foi submetida a um processo rigoroso de refinamento de qualidade:

1. **Política Zero `any` (Strict TypeScript):**
   - 100% dos tipos são formalmente declarados. Não há nenhum escape `any` em todo o código-fonte de domínio, hooks ou utilitários.
   - Uso de uniões discriminadas estritas (`VaultPayload`) e Type Guards (`isWorkforceData`, `isTalentVaultData`, `isDossierVaultData`, `isTherapyVaultData`).
2. **Documentação Formal TSDoc / JSDoc:**
   - Todos os módulos de criptografia, armazenamento e contratos de dados possuem anotações formais com `@param`, `@returns`, `@throws` e detalhes sobre as garantias de segurança.
3. **Desacoplamento via Custom Hooks (SOLID):**
   - Criação do hook `useVaultAutoSave`, isolando a lógica de debounce de 2 segundos, dupla persistência (IndexedDB + File System Access API) e atualização do catálogo, reduzindo significativamente a complexidade ciclomática da página principal.
4. **Higiene Visual & Zero Dead Code:**
   - Eliminação de qualquer código morto residual de scaffolds.
   - Estilização pura baseada no design system do Tailwind CSS + Shadcn/ui com suporte nativo a temas claros/escuros via variáveis HSL.

---

## 🤖 5. Engenharia de Software Acelerada por IA (AI-Augmented Engineering)

Este projeto foi concebido e implementado utilizando **metodologias modernas de engenharia assistida por inteligência artificial**, combinando velocidade de geração com rigor de validação determinística:

* **Arquitetura Orientada por Especificação (*Spec-Driven Design*):** A IA atuou como copiloto arquitetural para sintetizar contratos de dados rigorosos em TypeScript, modelando entidades de negócios complexas para os 5 domínios verticais.
* **Como o Código Gerado foi Validado e Auditado:**
  1. **Verificação Estática Estrita (`tsc --noEmit` & Custom AST/Regex Audit):** Todo código sintetizado passou por verificação automatizada de tipos e varredura estática proibindo ocorrências de `any` ou coerções inseguras.
  2. **Teste Automatizado de Vetores Criptográficos Cruzados:** Os algoritmos de derivação `PBKDF2-SHA256` (100.000 iterações), cifragem autenticada `AES-GCM-256` e assinatura `SHA-256` foram validados matematicamente contra vetores de teste independentes (utilizando `cryptography.hazmat` / OpenSSL), garantindo que a implementação Web Crypto produz saídas binárias e tags de autenticação 100% conformes à especificação NIST.
  3. **Auditoria do Grafo de Importações:** Execução de scripts de verificação de integridade referencial garantindo 0 links quebrados ou dependências órfãs entre os mais de 100 módulos TypeScript/React.
  4. **Pipeline de CI/CD no GitHub Actions:** Validação limpa do build de produção (`vite build`) a cada push em ambiente Linux isolado (Node.js 22 LTS) antes do deploy no GitHub Pages.

---

## 🔐 6. Modelo de Ameaça (Threat Model)

### O que o sistema protege com eficácia:
* ✅ **Vazamentos em Bancos de Dados em Nuvem:** Inexistência de banco de dados remoto; o atacante não tem servidor central para invadir.
* ✅ **Inspeção de Rede e Man-in-the-Middle (MitM):** Como a criptografia ocorre antes do armazenamento, nenhum dado trafega em texto claro.
* ✅ **Acesso por Administradores de TI da Empresa:** Arquivos salvos localmente sob senha mestra não podem ser inspecionados por scripts padrão de backup corporativo.
* ✅ **Adulteração de Backup:** Backups exportados contêm checksum SHA-256 e cifra AES-GCM autenticada.

### O que está fora do escopo (Vetores Locais):
* ⚠️ **Keyloggers e Spywares no Sistema Operacional:** Se o computador hospedeiro estiver infectado por malware no nível do SO, a senha digitada pode ser interceptada no teclado.
* ⚠️ **Esquecimento da Senha Mestra:** Em arquiteturas Zero-Knowledge reais, **não existe botão de "esqueci minha senha"**. A perda da senha implica perda matemática definitiva dos dados.

---

## 🚀 7. Como Executar o Projeto Localmente

### Pré-requisitos
* Navegador moderno com suporte à Web Crypto API (Chrome, Edge, Firefox, Safari, Brave).
* Node.js 20+ ou Bun (para desenvolvimento local).

```bash
# 1. Clonar o repositório
git clone https://github.com/Adam-Moller/Safe-vault.git

# 2. Acessar a pasta do projeto
cd Safe-vault

# 3. Instalar dependências
npm install
# ou bun install

# 4. Iniciar servidor de desenvolvimento
npm run dev

# 5. Build de produção otimizado
npm run build
```

---

## 🌐 Demonstração Online

Acesse a versão em produção via GitHub Pages: [**adam-moller.github.io/Safe-vault**](https://adam-moller.github.io/Safe-vault/)

---

## 📄 Licença

Distribuído sob a licença **MIT**.
