# Task: Clone Research Plan — Source Strategy

**Task ID:** clone-research-plan
**Execution Type:** Agent
**Model:** Opus
**Model Rationale:** "Decisões estratégicas de pesquisa — qual conteúdo extrair, de onde, em que ordem — requerem julgamento de alto nível para maximizar qualidade do clone"
**Haiku Eligible:** NO — planejamento estratégico de fontes exige raciocínio profundo
**Purpose:** Analisar todos os inputs disponíveis e criar um plano de extração estruturado (`squads/{squad_destination}/.clones/{slug}/research-plan.yaml`) que guia as fases de extração (Haiku) e síntese (Sonnet)
**Orchestrator:** wf-create-clone.yaml (PHASE-2)
**Used By:** `*create-clone` command in squad-chief

> **Nota:** Esta task é puramente estratégica. Opus não pesquisa nem extrai conteúdo aqui —
> decide O QUE extrair, DE ONDE e em que ORDEM. A execução fica para PHASE-3 (Haiku).

---

## DESIGN RULES (Invioláveis)

```yaml
strategic_only:
  rule: "Esta task NÃO extrai conteúdo. Produz apenas um plano de extração."
  antipatterns:
    - "Começar a extrair PREHD aqui — isso é PHASE-4"
    - "Baixar transcripts aqui — isso é PHASE-3"
    - "Sintetizar frameworks aqui — isso é PHASE-4"

source_coverage:
  rule: "O plano deve cobrir pelo menos 3 tipos de fonte distintos."
  minimum: "3 tipos (ex: YouTube interview + livro local + artigo)"
  ideal: "5+ fontes variadas para cobertura máxima de PREHD + Frameworks + PSR"

youtube_priority:
  rule: "Conteúdo YouTube deve seguir a hierarquia de prioridade obrigatória."
  order:
    P1: "Entrevistas — pessoa sendo entrevistada, respostas autênticas"
    P2: "Lives — conteúdo não roteirizado, padrões cognitivos naturais"
    P3: "Palestras/Talks — entrega estruturada, arquitetura de resposta"
    P4: "Vídeos gerais — evidência adicional de vocabulário e frameworks"

prehd_mapping:
  rule: "Cada fonte deve ser mapeada para os componentes PREHD/Frameworks/PSR que vai alimentar."
  reason: "Garante cobertura completa e evita síntese com lacunas"
```

---

## FASE: Análise de Inputs Disponíveis

### Passo 1 — Inventário de Fontes

Revisar todos os inputs recebidos das fases anteriores:

```
Inputs do workflow:
- person_name: _______________
- domain: _______________
- local_materials_manifest: (lista de arquivos catalogados na PHASE-0, ou vazio)
- youtube_urls_provided: (URLs fornecidos pelo usuário na PHASE-0, ou vazio)
- primary_sources: (fontes informadas pelo usuário na PHASE-1, ou vazio)
- clone_purpose: _______________
```

Classificar cada fonte disponível:

| Fonte | Tipo | Confiabilidade | Richness esperada |
|-------|------|---------------|------------------|
| {{fonte}} | livro/podcast/video/artigo | alta/média | alta/média/baixa |

---

## FASE: Estratégia YouTube

### Passo 2 — Planejar Busca por Tipo de Conteúdo

Para cada tipo, gerar queries de busca otimizadas. Prioridade é OBRIGATÓRIA:

#### PRIORIDADE 1 — Entrevistas (maior valor para PREHD-R, Frameworks, PSR)

```yaml
entrevistas:
  valor: "Respostas autênticas sob questionamento revelam padrões cognitivos, vocabulário real, gatilhos emocionais"
  queries:
    - "{person_name} interview"
    - "{person_name} entrevista"
    - "{person_name} podcast"
    - "{person_name} conversa"
  filtros:
    duracao_minima: 600  # 10 minutos
    max_resultados: 5
  componentes_alimentados: ["R (estilo)", "Frameworks", "PENSAR", "SENTIR", "RESPONDER"]
```

#### PRIORIDADE 2 — Lives (maior valor para padrões não-roteirizados)

```yaml
lives:
  valor: "Conteúdo ao vivo revela tomada de decisão em tempo real e comunicação natural"
  queries:
    - "{person_name} live"
    - "{person_name} ao vivo"
    - "{person_name} stream"
  filtros:
    duracao_minima: 1800  # 30 minutos
    max_resultados: 3
  componentes_alimentados: ["R (estilo)", "SENTIR", "Frameworks situacionais"]
```

#### PRIORIDADE 3 — Palestras e Talks (maior valor para estrutura de resposta)

```yaml
palestras:
  valor: "Entrega estruturada revela arquitetura de resposta e fórmula signature"
  queries:
    - "{person_name} palestra"
    - "{person_name} talk"
    - "{person_name} keynote"
    - "{person_name} apresentacao"
  filtros:
    duracao_minima: 900  # 15 minutos
    max_resultados: 3
  componentes_alimentados: ["RESPONDER", "Frameworks Camada 1", "PENSAR"]
```

#### PRIORIDADE 4 — Vídeos Gerais (evidência complementar)

```yaml
geral:
  valor: "Vocabulário adicional e evidência de frameworks"
  queries:
    - "{person_name} {domain}"
    - "{person_name}"
  filtros:
    duracao_minima: 300  # 5 minutos
    max_resultados: 2
  componentes_alimentados: ["H (histórico)", "E (especialidade)"]
```

**Regra de parada:** Parar de adicionar fontes YouTube quando total planejado superar 50.000 palavras estimadas (aprox. 5 vídeos de 30min).

---

## FASE: Triagem de Materiais Locais

### Passo 3 — Priorizar Arquivos Locais

Para cada arquivo no `local_materials_manifest`:

```yaml
triagem_local:
  regra: "Materiais locais são fontes PRIMÁRIAS — têm prioridade sobre YouTube"
  para_cada_arquivo:
    - avaliar: "Qual componente PREHD/Framework/PSR este arquivo alimenta melhor?"
    - definir: "Quais seções/capítulos são mais relevantes?"
    - ordenar: "Prioridade de leitura (1=mais crítico)"
```

Documentar como tabela:

| Arquivo | Tipo | Prioridade | Componentes | Seções Foco |
|---------|------|-----------|-------------|-------------|
| {{arquivo.pdf}} | livro | 1 | R, Frameworks, PENSAR | caps 1-3, conclusão |

---

## FASE: Mapeamento Fonte → PREHD/DNA

### Passo 4 — Garantir Cobertura Completa

Verificar que cada componente tem pelo menos 1 fonte planejada:

```yaml
cobertura_obrigatoria:
  P (Papel):
    min_fontes: 1
    melhor_tipo: "entrevistas, autobiografias"
  R (Resposta/Estilo):
    min_fontes: 3  # critério de 3 fontes diferentes para vocabulário
    melhor_tipo: "entrevistas, lives, qualquer conteúdo direto"
  E (Especialidade):
    min_fontes: 1
    melhor_tipo: "livros técnicos, artigos, palestras"
  H (Histórico):
    min_fontes: 2
    melhor_tipo: "biographias, entrevistas sobre trajetória"
  D (Defesa):
    min_fontes: 1
    melhor_tipo: "entrevistas onde expressou limites ou criticou outros"
  Frameworks_C1:
    min_fontes: 3  # padrão deve aparecer em ≥3 fontes
    melhor_tipo: "livros, palestras sobre metodologia"
  Frameworks_C2:
    min_fontes: 2
    melhor_tipo: "entrevistas situacionais"
  Frameworks_C3:
    min_fontes: 2
    melhor_tipo: "declarações de princípios, manifestos"
  PENSAR:
    min_fontes: 2
    melhor_tipo: "entrevistas de processo, lives"
  SENTIR:
    min_fontes: 2
    melhor_tipo: "entrevistas com perguntas difíceis, vídeos emotivos"
  RESPONDER:
    min_fontes: 3
    melhor_tipo: "qualquer conteúdo com respostas completas"
```

Se algum componente estiver descoberto → adicionar fontes específicas ao plano antes de continuar.

---

## Output da Task

Salvar em `squads/{squad_destination}/.clones/{slug}/research-plan.yaml` (criar a pasta se não existir — `mkdir -p squads/{squad_destination}/.clones/{slug}`):

```yaml
# research-plan.yaml
# Gerado por: clone-research-plan.md (PHASE-2)
# Localização: squads/{squad_destination}/.clones/{slug}/research-plan.yaml
# Pessoa: {person_name}
# Domínio: {domain}

research_plan:
  person: "{person_name}"
  domain: "{domain}"
  estimated_total_words: {N}
  sources_planned: {N}

  youtube_to_download:
    - query_or_url: "..."  # URL direto (se fornecido pelo usuário) ou query de busca
      priority: 1           # 1=entrevista, 2=live, 3=palestra, 4=geral
      type: "interview"     # interview | live | talk | general
      expected_value: "..."
      min_duration_sec: 600
      max_results: 5
      output_slug: "yt-1-interview-{slug}"
    # ... repetir para cada fonte YouTube

  local_files_to_read:
    - path: "..."
      priority: 1
      type: "book"          # book | article | notes | pdf
      focus_sections: "..."
      components: ["R", "Frameworks_C1"]
      output_slug: "local-1-{slug}"
    # ... repetir para cada arquivo local

  prehd_source_mapping:
    P: ["source_slug_1", "source_slug_2"]
    R: ["source_slug_3", "yt-1-interview-{slug}"]
    E: ["local-1-{slug}"]
    H: ["all"]
    D: ["source_slug_4"]
    Frameworks_C1: ["source_slug_1", "yt-3-talk-{slug}"]
    Frameworks_C2: ["yt-1-interview-{slug}"]
    Frameworks_C3: ["local-1-{slug}"]
    PENSAR: ["yt-1-interview-{slug}", "yt-2-live-{slug}"]
    SENTIR: ["yt-1-interview-{slug}"]
    RESPONDER: ["yt-1-interview-{slug}", "yt-3-talk-{slug}", "local-1-{slug}"]
```

**Checkpoint PHASE-2:**
- [ ] Mínimo 3 tipos de fonte distintos planejados
- [ ] Mínimo 5 alvos YouTube com queries definidas
- [ ] Todos os componentes PREHD/DNA têm ao menos 1 fonte mapeada
- [ ] `squads/{squad_destination}/.clones/{slug}/research-plan.yaml` gerado e completo
- [ ] Materiais locais priorizados acima das fontes YouTube

---

*Task: clone-research-plan | wf-create-clone.yaml PHASE-2 | Squad Creator — AIOX*
