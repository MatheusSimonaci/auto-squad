# PRD — Clones de IA: Especialistas Financeiros
## Squad Financas | Versão 1.0 | Data: 2026-04-03

---

## 1. Objetivo

Criar 3 clones cognitivos de especialistas em finanças pessoais e educação financeira — **Thiago Nigro**, **Gustavo Cerbasi** e **Robert Kiyosaki** — usando o workflow `wf-create-clone` do squad-creator. Os clones serão implantados no squad `financas` e deverão atingir score mínimo de **14/20** no sistema de calibração T.E.S.T.E. para aprovação em produção.

---

## 2. Contexto e Motivação

O squad `financas` (localizado em `squads/financas/`) existe mas está vazio. Este projeto o popula com 3 agentes de mentorado financeiro de alta fidelidade, baseados em especialistas reais com publicações verificáveis. Cada clone é sintetizado a partir de materiais primários locais (PDFs disponíveis) e fontes públicas do YouTube, seguindo a metodologia **Clone IA Express** (PREHD + Frameworks 3 Camadas + DNA de Resposta).

---

## 3. Escopo

### 3.1 Clones a Criar

| # | Especialista | Domínio | Output |
|---|---|---|---|
| 1 | Thiago Nigro | Finanças pessoais, investimentos, liberdade financeira | `squads/financas/thiago-nigro-agent.md` |
| 2 | Gustavo Cerbasi | Educação financeira, planejamento financeiro familiar | `squads/financas/gustavo-cerbasi-agent.md` |
| 3 | Robert Kiyosaki | Educação financeira, ativos vs passivos, mentalidade empreendedora | `squads/financas/robert-kiyosaki-agent.md` |

> **Nota Kiyosaki:** Fontes primárias em inglês. O clone responde exclusivamente em **pt-BR**.

### 3.2 Fora do Escopo

- Criação de novos squads além de `financas`
- Clones de outros especialistas financeiros não listados acima
- Interface de usuário ou integração com sistemas externos
- Treinamento fine-tuning de modelos

---

## 4. Materiais Disponíveis

### 4.1 Materiais Locais (PDFs — prioridade máxima)

| Especialista | Pasta | Arquivo(s) |
|---|---|---|
| Thiago Nigro | `C:\Users\Pichau\Downloads\Finanças\Thiago Nigro\` | `Do-mil-ao-milhao-Thiago-Nigro.pdf`, `ebook-diversificação.pdf` |
| Gustavo Cerbasi | `C:\Users\Pichau\Downloads\Finanças\Gustavo Cerbasi\` | `COMO_ORGANIZAR_SUA_VIDA_FINANCEIRA-9788543102580.pdf` |
| Robert Kiyosaki | `C:\Users\Pichau\Downloads\Finanças\Robert Kiyosaki\` | `101- Pai Rico, Pai Pobre - Robert T. Kiyosaki.pdf` |

**Total:** 4 PDFs confirmados. Materiais locais são processados **antes** de qualquer fonte YouTube (regra do workflow).

### 4.2 Fontes YouTube

Nenhuma URL foi fornecida pelo usuário. O workflow buscará automaticamente na PHASE-2 (Opus), seguindo a ordem de prioridade:
1. Entrevistas (P1) → 2. Lives (P2) → 3. Palestras (P3) → 4. Vídeos gerais (P4)

---

## 5. Dependências Técnicas

### 5.1 Pré-Requisitos de Sistema

| Dependência | Status | Ação Necessária |
|---|---|---|
| `yt-dlp` | A instalar | `pip install yt-dlp` (Python 3.14 + pip 26.0.1 disponíveis) |
| `squads/financas/squad.yaml` | A criar | Criar arquivo mínimo de squad antes de iniciar |
| Squad `financas` em `squads/financas/` | Existe (vazio) | Nenhuma |

### 5.2 Arquivos Críticos do Workflow

| Arquivo | Fase | Papel |
|---|---|---|
| `squads/squad-creator/workflows/wf-create-clone.yaml` | Todas | Workflow master — orquestra o pipeline completo |
| `squads/squad-creator/templates/clone-agent-tmpl.md` | PHASE-5 | Template OBRIGATÓRIO — carregar antes de escrever |
| `squads/squad-creator/tasks/clone-research-plan.md` | PHASE-2 | Task Opus — planejamento estratégico de fontes |
| `squads/squad-creator/tasks/clone-source-extract.md` | PHASE-3 | Task Haiku — extração de PDFs e transcripts |
| `squads/squad-creator/tasks/clone-research.md` | PHASE-4 | Task Sonnet — síntese PREHD + Frameworks + PSR |
| `squads/squad-creator/tasks/clone-assemble.md` | PHASE-5 | Task Sonnet — assembly do arquivo final |
| `squads/squad-creator/tasks/clone-calibrate.md` | PHASE-6 | Task Sonnet — calibração T.E.S.T.E. |

### 5.3 Model Routing (3-Tier)

| Fase | Modelo | Justificativa |
|---|---|---|
| PHASE-0, 1, 4, 5, 6 | Sonnet | Elicitação, síntese, assembly, calibração |
| PHASE-2 | Opus | Planejamento estratégico de alto nível |
| PHASE-3 | Haiku | Execução mecânica de scripts e downloads |

---

## 6. Pipeline de Execução

O workflow `wf-create-clone` executa 7 fases (PHASE-0 a PHASE-6) para **cada clone sequencialmente**. Os 3 clones são criados em pipelines sequenciais independentes.

### 6.1 Fases do Pipeline (por clone)

```
PHASE-0  →  PHASE-1  →  PHASE-2  →  PHASE-3  →  PHASE-4  →  PHASE-5  →  PHASE-6
Discovery    Elicit      Research     Extract      Synthesis    Assembly    Calibrate
(Sonnet)    (Sonnet)     (Opus)      (Haiku)      (Sonnet)    (Sonnet)    (Sonnet)
```

#### PHASE-0 — Material Discovery
- Confirmar pasta local e arquivos disponíveis
- Coletar URLs YouTube (se fornecidas pelo usuário)
- Gerar `local_materials_manifest`
- **Status para este projeto:** Consolidado — 4 PDFs locais confirmados, sem URLs YouTube fornecidas

#### PHASE-1 — Elicitação de Inputs
- Confirmar: nome, domínio, squad de destino, fontes primárias
- Validar que `squads/financas/` existe com `squad.yaml`
- Verificar que o clone não existe ainda
- **Requer aprovação humana antes de avançar**

#### PHASE-2 — Research Strategy (Opus)
- Criar `squads/financas/.clones/{slug}/research-plan.yaml` com queries YouTube e mapeamento fonte→PREHD/DNA
- Priorizar materiais locais acima do YouTube
- Mínimo: 3 tipos de fonte distintos + 5 alvos YouTube com queries

#### PHASE-3 — Source Acquisition (Haiku)
- Ler PDFs locais (prioridade máxima)
- Baixar transcripts YouTube via `yt-dlp` (P1→P2→P3→P4)
- Gerar `squads/financas/.clones/{slug}/raw-sources/*.txt` + `squads/financas/.clones/{slug}/source-manifest.yaml`
- Parar quando atingir ≥50.000 palavras extraídas
- Falhas documentadas no manifesto, nunca bloqueiam o pipeline

#### PHASE-4 — DNA Synthesis (Sonnet)
- **FASE 1:** Estrutura PREHD (Papel, Resposta, Estilo, Especialidade, Histórico, Defesa)
- **FASE 2:** Frameworks Cognitivos 3 Camadas (protocolo forense 5 passos)
- **FASE 3:** DNA de Resposta — PENSAR-SENTIR-RESPONDER + fórmula signature
- Toda afirmação deve ter fonte verificável em `squads/financas/.clones/{slug}/raw-sources/`

#### PHASE-5 — Assembly (Sonnet)
- Carregar `clone-agent-tmpl.md` ANTES de escrever qualquer linha
- Substituir todas as `{{variáveis}}` do template
- Criar `squads/financas/{slug}-agent.md`
- Arquivo mínimo: 300 linhas
- **Requer aprovação humana antes de calibrar**

#### PHASE-6 — Calibração T.E.S.T.E. (Sonnet)
Executar 5 baterias de teste:
- **T** — Teste de Tom: 5 perguntas simples, avaliar autenticidade
- **E** — Teste de Expertise: 1 pergunta técnica complexa
- **S** — Teste Situacional: 1 pergunta × 3 perfis de usuário
- **T** — Teste de Triggers: 1 pergunta por framework Camada 1
- **E** — Teste de Extremos: fora do domínio, identidade, contradição

Gerar `squads/financas/.clones/{slug}/calibration-report.md` com score e classificação.

### 6.2 Ordem de Execução dos 3 Clones

| Ordem | Clone | Slug |
|---|---|---|
| 1º | Thiago Nigro | `thiago-nigro` |
| 2º | Gustavo Cerbasi | `gustavo-cerbasi` |
| 3º | Robert Kiyosaki | `robert-kiyosaki` |

---

## 7. Critérios de Aceitação

### 7.1 Por Clone (requisitos individuais)

| Critério | Mínimo | Verificação |
|---|---|---|
| Score T.E.S.T.E. | ≥ 14/20 | `squads/financas/.clones/{slug}/calibration-report.md` |
| Arquivo de agente | ≥ 300 linhas | `wc -l {slug}-agent.md` |
| Variáveis do template | 0 sem preencher | Grep por `{{` no arquivo |
| Bloco `<security>` | Presente e personalizado | Inspeção manual |
| Localização do arquivo | `squads/financas/{slug}-agent.md` | ls do diretório |
| Checklist 20 pontos | Completo | `squads/financas/.clones/{slug}/calibration-report.md` |
| Fontes verificáveis | Todas as afirmações PREHD/DNA | `squads/financas/.clones/{slug}/source-manifest.yaml` |

### 7.2 Classificação T.E.S.T.E.

| Score | Classificação | Decisão |
|---|---|---|
| 20/20 | LENDÁRIO | Produção imediata |
| 17–19/20 | PRO | Produção com observação |
| 14–16/20 | BOM | Produção — monitorar |
| 10–13/20 | BÁSICO | Ajustes antes da produção |
| < 10/20 | REFAZER | Retornar ao PHASE-4 |

### 7.3 Projeto Completo

- Os 3 clones aprovados (score ≥ 14/20)
- `squads/financas/squad.yaml` atualizado com os 3 agentes
- Status do squad: `Production` (todos ≥ 14/20) ou `Ready for Testing` (algum entre 10–13)

---

## 8. Artefatos de Saída

### 8.1 Artefatos Primários (persistentes)

```
squads/financas/
├── squad.yaml                          ← Atualizado com os 3 agentes
├── thiago-nigro-agent.md               ← Clone 1 (único artefato no topo)
├── gustavo-cerbasi-agent.md            ← Clone 2
├── robert-kiyosaki-agent.md            ← Clone 3
└── .clones/                            ← Workspace isolado por clone
    ├── thiago-nigro/
    │   └── calibration-report.md
    ├── gustavo-cerbasi/
    │   └── calibration-report.md
    └── robert-kiyosaki/
        └── calibration-report.md
```

### 8.2 Artefatos Intermediários (por clone, persistidos sob `.clones/{slug}/`)

Cada clone tem workspace próprio em `squads/financas/.clones/{slug}/` contendo:

```
squads/financas/.clones/{slug}/
├── research-plan.yaml                 ← Plano de extração (PHASE-2, Opus)
├── raw-sources/*.txt                  ← Texto bruto extraído (PHASE-3, Haiku)
├── source-manifest.yaml               ← Inventário de fontes (PHASE-3)
├── prehd.md                           ← PREHD completo com fontes (PHASE-4)
├── frameworks.md                      ← 3 camadas de frameworks (PHASE-4)
├── response-dna.md                    ← DNA PENSAR-SENTIR-RESPONDER (PHASE-4)
└── calibration-report.md              ← Relatório T.E.S.T.E. (PHASE-6)
```

Esta organização mantém o topo de `squads/financas/` limpo (apenas arquivos de agente) e isola totalmente os artefatos de construção por clone — permitindo múltiplos clones em paralelo sem colisão.

---

## 9. Regras de Governança (Vetos Automáticos)

As seguintes ações são vetadas pelo workflow e causam bloqueio imediato:

| Violação | Código de Veto |
|---|---|
| Escrever clone sem carregar template | VETO IMEDIATO |
| Inventar framework sem evidência documentada | VETO IMEDIATO |
| Criar arquivo fora de `squads/financas/` | VETO IMEDIATO |
| Declarar clone "pronto" com score < 14/20 | VETO IMEDIATO |
| Sintetizar PREHD/Frameworks/PSR sem ler `squads/financas/.clones/{slug}/raw-sources/` | VETO IMEDIATO |

---

## 10. Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| `yt-dlp` não instalado | Baixa | Instalar antes de iniciar: `pip install yt-dlp`. Fallback: continuar só com PDFs locais |
| Transcript YouTube indisponível | Média | Workflow documenta falha no manifesto e continua — PDFs locais garantem base mínima |
| Score < 14/20 em algum clone | Baixa | PHASE-6 decide: ajustes no assembly (10–13) ou retorno ao PHASE-4 (< 10) |
| Kiyosaki: fontes em inglês | Gerenciado | Clone configurado explicitamente para responder em pt-BR |
| Variáveis do template não preenchidas | Baixa | PHASE-5 tem veto automático para `{{variáveis}}` não substituídas |

---

## 11. Como Retomar Este Trabalho

### Comando de Execução

Quando retornar a este projeto, use exatamente este comando no contexto do squad-creator:

```
@squads/squad-creator/agents/squad-chief.md *wf-create-clone Thiago Nigro, Gustavo Cerbasi e Robert Kiyosaki
```

### Contexto para o Squad Chief

Ao invocar o workflow, informe o squad chief:

1. **Materiais locais confirmados (4 PDFs):**
   - `C:\Users\Pichau\Downloads\Finanças\Thiago Nigro\Do-mil-ao-milhao-Thiago-Nigro.pdf`
   - `C:\Users\Pichau\Downloads\Finanças\Thiago Nigro\ebook-diversificação.pdf`
   - `C:\Users\Pichau\Downloads\Finanças\Gustavo Cerbasi\COMO_ORGANIZAR_SUA_VIDA_FINANCEIRA-9788543102580.pdf`
   - `C:\Users\Pichau\Downloads\Finanças\Robert Kiyosaki\101- Pai Rico, Pai Pobre - Robert T. Kiyosaki.pdf`

2. **PHASE-0 já consolidada** — pode pular a elicitação de descoberta de materiais

3. **Squad de destino:** `financas` (em `squads/financas/`)

4. **Pré-requisito pendente:** criar `squads/financas/squad.yaml` mínimo antes de iniciar (necessário para validação PHASE-1)

5. **yt-dlp:** instalar se ainda não estiver instalado: `pip install yt-dlp`

6. **Sem URLs YouTube fornecidas** — busca automática na PHASE-2

### Checklist de Pré-Flight

Antes de executar o workflow, confirmar:

- [ ] `squads/financas/squad.yaml` existe
- [ ] `yt-dlp` instalado (`yt-dlp --version`)
- [ ] 4 PDFs acessíveis nos caminhos listados acima
- [ ] Nenhum `{slug}-agent.md` já existente em `squads/financas/`

---

## 12. Referências

| Recurso | Caminho |
|---|---|
| Workflow master | `squads/squad-creator/workflows/wf-create-clone.yaml` |
| Template de clone | `squads/squad-creator/templates/clone-agent-tmpl.md` |
| Squad de destino | `squads/financas/` |
| PRD (este documento) | `docs/prd/financas-clones-prd.md` |

---

*PRD criado por @pm (Morgan) — 2026-04-03*
*Status: Pronto para execução (aguardando pré-flight)*
