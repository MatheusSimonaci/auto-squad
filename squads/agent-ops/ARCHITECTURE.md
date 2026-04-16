# ARCHITECTURE — agent-ops

## Overview

O squad **agent-ops** é organizado em 3 tiers com 5 agentes especializados, seguindo a arquitetura hybrid-style do AIOX.

## Tier Structure

```
TIER 0 — ORCHESTRATION
└── ops-chief (🎯 Entry Point)
    ├── Routing, triage e coordenação
    ├── Monitoring do sistema
    └── Escalation protocol

TIER 1 — STRATEGY & OPTIMIZATION
├── alan-strategist (🧠)
│   ├── ARC Framework — Role Clarity
│   ├── CLOP — Continuous Learning
│   └── Orchestration Canvas
└── elon-optimizer (⚡)
    ├── 5-Step Process (Musk)
    ├── First Principles Thinking
    └── Token Optimization

TIER 2 — EXECUTION SPECIALISTS
├── workflow-architect (🔄)
│   ├── Node-Edge Workflow Model
│   └── Gather-Space Workspace Design
└── integration-engineer (🔗)
    ├── CSM Framework
    └── Token-Efficient Patterns
```

## Request Flow

```
User Request
     │
     ▼
ops-chief (*triage)
     │
     ├─── Strategic request ──────→ alan-strategist
     │                                   │
     │                              Coordination plan
     │                                   │
     ├─── Efficiency issue ──────→ elon-optimizer
     │                                   │
     │                              Optimization report
     │                                   │
     ├─── Workflow design ───────→ workflow-architect
     │                                   │
     │                              Visual workflow
     │                                   │
     └─── Integration need ──────→ integration-engineer
                                         │
                                    Integration spec
                                         │
                                    ops-chief (monitoring)
```

## Design Decisions

### Por que 5 agentes?
- **ops-chief** como centro de comando garante routing consistente
- **alan-strategist** e **elon-optimizer** cobrem as duas dimensões principais: *como organizar* e *como otimizar*
- **workflow-architect** e **integration-engineer** cobrem as duas camadas de execução: *visualizar* e *conectar*

### Por que Alan Nicolas e Elon Musk?
- **Alan Nicolas**: frameworks documentados para orquestração de agentes IA (ARC, CLOP) — diretamente aplicáveis ao domínio
- **Elon Musk**: 5-Step Process (documentado em múltiplas fontes) e First Principles — metodologias de eficiência radical relevantes para otimização de tokens

### Token Efficiency by Design
- Todos os agentes seguem o princípio de delta sync (não full sync)
- Integration-engineer usa Token-Efficient Integration Patterns
- elon-optimizer é especializado em redução de consumo
- command_loader garante que arquivos só são carregados quando necessários

### Workspace Virtual (Gather-like)
- Projetado pelo workflow-architect via *design-workspace
- Zonas: Strategy Room (ops-chief) + Execution Floor (specialists)
- Canais: #command, #alerts, #strategy, #integrations

## Files

```
squads/agent-ops/
├── agents/
│   ├── ops-chief.md              # Tier 0
│   ├── alan-strategist.md        # Tier 1
│   ├── elon-optimizer.md         # Tier 1
│   ├── workflow-architect.md     # Tier 2
│   └── integration-engineer.md  # Tier 2
├── config.yaml                   # Squad config (entry_agent: ops-chief)
├── README.md
├── CHANGELOG.md
└── ARCHITECTURE.md               # This file
```

## Quality Gates Passed

- ✅ config.yaml existe com entry_agent definido
- ✅ Entry agent (ops-chief) tem activation-instructions
- ✅ README.md existe
- ✅ CHANGELOG.md existe
- ✅ ARCHITECTURE.md existe
- ✅ Todos os agentes têm 6 levels (AIOX hybrid-style)
- ✅ Todos os agentes têm output_examples (≥3)
- ✅ Todos os agentes têm anti_patterns
- ✅ Todos os agentes têm completion_criteria com handoff_to
- ✅ Tier 0 orchestrator existe (ops-chief)
