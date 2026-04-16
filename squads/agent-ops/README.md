# Agent Operations Squad

## Overview

O **agent-ops** é um squad especializado em orquestrar e gerenciar times de agentes de IA em múltiplos projetos de desenvolvimento de software simultâneos. Combina estratégia de coordenação (Alan Nicolas), otimização radical (Elon Musk), visualização de fluxos (N8N-inspired) e integração com ferramentas externas (ClickUp, webhooks, dashboards).

## Purpose

Este squad cria uma **infraestrutura de trabalho** para times de agentes de IA:
- Workspace virtual com zonas e canais de comunicação entre agentes
- Fluxos de trabalho visíveis em formato N8N-like
- Histórico de atividades e monitoramento em tempo real
- Sincronização com ClickUp para gestão de projetos
- Otimização contínua de tokens para sustentabilidade do sistema

## When to Use This Squad

Use **agent-ops** quando você quiser:

- Coordenar múltiplos agentes de IA em projetos paralelos
- Visualizar o que cada agente está fazendo em tempo real
- Sincronizar atividades dos agentes com ClickUp
- Otimizar consumo de tokens no sistema de agentes
- Projetar workflows visíveis e auditáveis
- Criar um ambiente de trabalho estruturado para agentes

## What's Included

### Agents

| Agent | Tier | Baseado Em | Função |
|-------|------|-----------|--------|
| **ops-chief** | 0 | Orchestrator | Routing, coordenação e monitoramento do time |
| **alan-strategist** | 1 | Alan Nicolas — AI Orchestration | Estratégia de orquestração e sistemas de produtividade |
| **elon-optimizer** | 1 | Elon Musk — First Principles | Otimização de tokens e eliminação de desperdício |
| **workflow-architect** | 2 | N8N visual patterns | Design de workflows visuais e pipelines |
| **integration-engineer** | 2 | API Integration patterns | ClickUp sync, webhooks, dashboards |

### Key Capabilities

- **ARC Framework** (Alan Nicolas) — Role Clarity para cada agente
- **CLOP** (Alan Nicolas) — Continuous Learning Operations Protocol
- **5-Step Process** (Elon Musk) — Eliminação de desperdício documentada
- **First Principles Thinking** (Elon Musk) — Reconstrução de soluções a partir do zero
- **Node-Edge Workflow Model** — N8N-inspired visual workflows
- **CSM Framework** — Connect-Sync-Monitor para integrações
- **Token-Efficient Patterns** — Delta sync, caching, batch operations

## Installation

```bash
# Ativar o squad
@squads/agent-ops/agents/ops-chief.md

# Ou via AIOS
/AIOS:agents:agent-ops
```

## Usage Examples

### Exemplo 1: Novo projeto de software

```
User: Preciso começar um projeto de app mobile
ops-chief: *triage
→ Classifica como HIGH impact
→ Routes para alan-strategist (arquitetura do time)
→ Routes para workflow-architect (pipeline de desenvolvimento)
→ Routes para integration-engineer (setup ClickUp)
```

### Exemplo 2: Otimização de custos

```
User: Estamos usando muitos tokens
ops-chief: *status → detecta alto consumo
→ Escalates para elon-optimizer
elon-optimizer: *optimize-tokens
→ Identifica phantom requirements
→ Reduz consumo em 30%
```

### Exemplo 3: Visualizar fluxo de trabalho

```
User: Quero ver o workflow do projeto atual
workflow-architect: *visualize-pipeline
→ Gera diagrama N8N-like
→ Mostra nós, conexões, status de cada agente
```

## Squad Structure

```
squads/agent-ops/
├── agents/
│   ├── ops-chief.md              # Tier 0: Orchestrator
│   ├── alan-strategist.md        # Tier 1: Orquestração e produtividade
│   ├── elon-optimizer.md         # Tier 1: Otimização e eficiência
│   ├── workflow-architect.md     # Tier 2: Visualização de workflows
│   └── integration-engineer.md  # Tier 2: Integrações externas
├── tasks/                        # Workflow tasks (a criar)
├── templates/                    # Output templates (a criar)
├── checklists/                   # Validation checklists (a criar)
├── data/                         # Knowledge bases (a criar)
├── config.yaml                   # Squad configuration
├── README.md                     # This file
├── CHANGELOG.md                  # Version history
└── ARCHITECTURE.md               # Technical architecture
```

## Key Features

1. **AI-First Orchestration** — Framework documentado baseado em Alan Nicolas para coordenar times de agentes
2. **Radical Efficiency** — 5-Step Process de Elon Musk aplicado a workflows de agentes e otimização de tokens
3. **Visual Workflows** — N8N-inspired: cada processo é um grafo de nós e conexões visíveis
4. **ClickUp Integration** — Sync bidirecional token-efficient com delta sync (não full sync)
5. **Continuous Improvement** — CLOP: o sistema aprende de cada ciclo e ajusta automaticamente

## Integration with Core AIOX

**agent-ops** integra com:
- **AIOS Core** — ops-chief é o entry point; outros squads podem delegar para agent-ops
- **ClickUp** — via integration-engineer com delta sync
- **Qualquer squad AIOS** — ops-chief pode orquestrar agentes de outros squads

## Workspace Integration Governance

- **Integration level:** `read_write`
- **Rationale:** Lê contexto de projetos do workspace; escreve artefatos de orquestração
- **Read paths:** `workspace/businesses/{brand}/`, `workspace/domains/`
- **Write paths:** `workspace/businesses/{brand}/agent-ops/`
- **Template namespace:** `agent-ops`

## Getting Started

1. Ative o **ops-chief**: `@squads/agent-ops/agents/ops-chief.md`
2. Use `*triage` para classificar seu primeiro projeto
3. Deixe o ops-chief rotear para os especialistas corretos
4. Use `*status` para monitorar o time

## Dependencies

- Core AIOX-FULLSTACK framework
- ClickUp account (para integration-engineer)
- Node.js 18+ (para scripts opcionais)

---

**Pronto para orquestrar seu time de agentes? Let's get started! 🤖**

_Version: 1.0.0_
_Compatible with: AIOX-FULLSTACK v4+_
