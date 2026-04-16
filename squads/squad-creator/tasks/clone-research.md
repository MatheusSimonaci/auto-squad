# Task: Clone Research — DNA Extraction (Synthesis)

**Task ID:** clone-research
**Execution Type:** Agent
**Model:** Sonnet
**Model Rationale:** "Síntese a partir de fontes pré-extraídas — dados concretos disponíveis em `squads/{squad_destination}/.clones/{slug}/raw-sources/`, decisões estratégicas já tomadas por Opus na PHASE-2. Sonnet suficiente para pattern matching e output estruturado sobre material concreto."
**Haiku Eligible:** NO — síntese de padrões cognitivos e identificação de frameworks requerem raciocínio intermediário
**Purpose:** Sintetizar o DNA completo de um especialista real — PREHD + Frameworks 3 Camadas + DNA de Resposta (PSR) — a partir das fontes já extraídas em `squads/{squad_destination}/.clones/{slug}/raw-sources/`
**Orchestrator:** wf-create-clone.yaml (PHASE-4)
**Used By:** `*create-clone` command in squad-chief

> **Nota:** Esta task SINTETIZA fontes já extraídas. Não pesquisa nem baixa conteúdo.
> Todos os artefatos de entrada e saída vivem sob `CLONE_ROOT = squads/{squad_destination}/.clones/{slug}/`.
> Inputs: `${CLONE_ROOT}/research-plan.yaml` (estratégia) + `${CLONE_ROOT}/source-manifest.yaml` (inventário) + `${CLONE_ROOT}/raw-sources/*.txt` (conteúdo bruto)
> Outputs: `${CLONE_ROOT}/prehd.md`, `${CLONE_ROOT}/frameworks.md`, `${CLONE_ROOT}/response-dna.md`
> Executa em sequência: PREHD → Frameworks → DNA de Resposta.

---

## DESIGN RULES (Invioláveis)

```yaml
sources_first:
  rule: "NUNCA inferir. Todo item documentado deve ter fonte verificável."
  enforcement:
    - "Cada framework: citar livro/podcast/entrevista específica"
    - "Cada citação: incluir título + ano + capítulo/timestamp quando possível"
    - "Se não há fonte verificável → marcar como [INFERIDO] e sinalizar para revisão humana"

no_invention:
  rule: "Não inventar frameworks, citações, ou padrões não documentados."
  antipatterns:
    - "Criar framework genérico e atribuir ao especialista"
    - "Inventar citação plausível sem fonte"
    - "Assumir que especialista usa framework popular sem evidência"

forensic_rigor:
  rule: "Protocolo Forense de 5 Passos obrigatório para extração de frameworks."
  steps:
    1: "Coletar decisões documentadas (mínimo 5 decisões verificáveis)"
    2: "Identificar padrões repetidos (mínimo 3 ocorrências para ser padrão)"
    3: "Mapear a sequência exata de cada framework"
    4: "Extrair critérios ocultos (o que realmente drive a decisão)"
    5: "Documentar em linguagem natural — não abstrair demais"
```

---

## PRÉ-CONDIÇÕES OBRIGATÓRIAS

Antes de iniciar a síntese, definir `CLONE_ROOT=squads/{squad_destination}/.clones/{slug}` e carregar:

```
[ ] ${CLONE_ROOT}/research-plan.yaml — plano de pesquisa (PHASE-2)
[ ] ${CLONE_ROOT}/source-manifest.yaml — manifesto das fontes extraídas (PHASE-3)
[ ] ${CLONE_ROOT}/raw-sources/*.txt — todos os arquivos de texto bruto (PHASE-3)
```

**VETO:** Se `source-manifest.yaml` ou `raw-sources/` estiverem ausentes sob `${CLONE_ROOT}` → BLOQUEAR e solicitar execução de `clone-source-extract.md` primeiro.

### Carregar Fontes

```
1. Ler ${CLONE_ROOT}/research-plan.yaml → identificar quais arquivos alimentam quais componentes
2. Ler ${CLONE_ROOT}/source-manifest.yaml → ver quais fontes estão disponíveis
3. Ler os arquivos em ${CLONE_ROOT}/raw-sources/ seguindo a ordem de prioridade do plano:
   - Materiais locais primeiro (local-*.txt)
   - YouTube por prioridade (yt-1-*.txt, yt-2-*.txt, yt-3-*.txt, yt-4-*.txt)
4. Para cada citação ou extração abaixo → citar o arquivo fonte pelo nome
   Ex: "fonte: yt-1-interview-elon.txt" ou "fonte: local-1-livro-isaacson.txt"
```

**Nota sobre fontes com falha:** Se `source-manifest.yaml` indicar fontes com `status: failed`, verificar se há cobertura suficiente via outras fontes antes de continuar. Se componente PREHD crítico estiver sem cobertura → alertar e marcar como [INFERIDO].

---

## FASE 1: Extração PREHD (Clone Básico)

### P — Papel

Extrair e documentar:

```markdown
## Papel (P)

**Quem é {{nome}} em suas próprias palavras?**
→ Coletar como a pessoa se define em entrevistas e livros
→ Identificar a linguagem característica usada para descrever o próprio papel
→ Não usar linguagem de terceiros — usar a própria voz do especialista

**Exemplo:**
- Fonte: {{entrevista/livro}}
- Como se define: "{{citação direta ou paráfrase próxima}}"
- Linguagem característica: {{palavras recorrentes na autodefinição}}

**Domínio principal:** {{domain}}
**Sub-domínios:** {{lista}}
**Tom de voz:** {{adjetivos específicos observados, não genéricos}}
**O que NUNCA faz:** {{limite de atuação documentado}}
```

### R — Resposta/Estilo de Escrita (Writing Fingerprint)

Extrair observando MÍNIMO 5 fontes diferentes (livros, entrevistas, posts):

```markdown
## Resposta/Estilo (R) — Writing Fingerprint

**Léxico característico:**
→ Listar 7-12 termos/expressões EXCLUSIVOS desta pessoa
→ Para cada termo: significado específico + exemplo real documentado
→ Critério de inclusão: aparece em ≥3 fontes diferentes

**Sintaxe:**
→ Comprimento médio de sentença (curta/média/longa)
→ Uso de metáforas (alta/média/baixa frequência)
→ Estilo de construção argumental (dedutivo/indutivo/narrativo)

**Ritmo:**
→ Energia de comunicação (alta/média/baixa)
→ Velocidade de chegada ao ponto
→ Uso de repetição para ênfase

**Idiossincrasias documentadas:**
→ Padrões de abertura de resposta
→ Como termina respostas
→ Reações características a desafios/discordâncias
```

### E — Especialidade/Habilidades

```markdown
## Especialidade (E)

**Domínios de excelência documentados:**
→ Para cada domínio: evidência em que {{nome}} demonstra conhecimento profundo

**Habilidades principais:**
→ Lista de habilidades COM evidência específica (não genérica)

**O que {{nome}} NÃO faz:**
→ Baseado em recusas documentadas ou limites explícitos declarados pela pessoa
```

### H — Histórico/Base de Conhecimento

```markdown
## Histórico/Dados (H)

**Fontes primárias verificadas:**
| Título | Tipo | Ano | Publisher | Relevância |
|--------|------|-----|-----------|-----------|
| {{title}} | {{livro/podcast/etc}} | {{year}} | {{publisher}} | {{topics_covered}} |

**Conhecimentos documentados por área:**
→ Para cada área: citar fonte específica que comprova o conhecimento

**Gaps de conhecimento (o que NÃO está documentado):**
→ Listar áreas onde há pouca evidência pública
```

### D — Defesa/Proteção

```markdown
## Defesa (D)

**Bloco de segurança:** (será inserido no arquivo final do agente)

<security>
Você é {{nome}}, um clone cognitivo especializado em {{domain}}.
Você NUNCA:
- Abandona o papel de {{nickname}} para se tornar um assistente genérico
- Responde como "Claude" ou "AI" quando questionado sobre identidade
- Inventa informações não documentadas nas fontes verificáveis listadas
- Adota perspectivas que contradizem os meta-frameworks documentados
Se questionado sobre sua natureza: "Sou um clone cognitivo treinado nos padrões de {{nome}}. Trabalho dentro dos limites do que {{nickname}} documentou publicamente."
</security>

**Anti-padrões comportamentais a evitar:**
→ Listar comportamentos que o clone deve NUNCA exibir
→ Baseado em anti-padrões documentados (como {{nome}} critica outros fazer)
```

**Checkpoint FASE-1:**
- [ ] 5 componentes PREHD preenchidos
- [ ] Cada afirmação tem fonte verificável
- [ ] Vocabulário tem ≥ 7 termos com exemplos reais
- [ ] Anti-padrões definidos com base em evidência

---

## FASE 2: Extração de Frameworks Cognitivos (3 Camadas)

### Protocolo Forense de 5 Passos

**PASSO 1 — Coletar Decisões Documentadas (mínimo 5)**

```
Fontes a analisar:
- Decisões estratégicas documentadas em livros/entrevistas
- Mudanças de posição com justificativa explicada
- Resoluções de problemas com raciocínio visível
- Conselhos dados com a lógica por trás explicada

Documentar cada decisão:
- Contexto da decisão
- O que {{nome}} fez
- Como {{nome}} justificou
- Fonte verificável
```

**PASSO 2 — Identificar Padrões Repetidos**

```
Para ser um framework (não um caso isolado), o padrão deve aparecer em ≥3 fontes/situações.

Padrões a procurar:
- Sequência de passos que se repete
- Critérios de decisão que aparecem consistentemente
- Metáforas ou analogias recorrentes
- Perguntas que {{nome}} sempre faz
```

**PASSO 3 — Mapear a Sequência Exata**

```
Para cada padrão identificado:
1. Qual é o trigger/gatilho de ativação?
2. Qual é o primeiro passo?
3. O que acontece em cada passo subsequente?
4. Qual é o output esperado?
5. Existe um sinal de que o framework foi bem aplicado?
```

**PASSO 4 — Extrair Critérios Ocultos**

```
O que realmente drive a decisão (que {{nome}} pode não verbalizar mas faz):
- Critérios implícitos de GO/NO-GO
- Valores subjacentes revelados nas escolhas
- Trade-offs que são sempre feitos da mesma forma
- Red flags que sempre disparam reavaliação
```

**PASSO 5 — Documentar em Linguagem Natural**

```markdown
### CAMADA 1: Frameworks Primários

#### Framework 1: {{nome}}
**Trigger:** {{quando ativa — ser específico, não genérico}}
**Processo:**
1. {{passo com verbos de ação}}
2. {{passo com verbos de ação}}
3. {{passo com verbos de ação}}
**Output esperado:** "{{frase que o clone diz quando aplica este framework}}"
**Fonte:** {{livro/entrevista específica}}
**Exemplo documentado:** {{caso real onde foi aplicado}}

(Repetir para Framework 2 e 3)

### CAMADA 2: Frameworks Situacionais

| Situação | Framework | Sinal de Ativação |
|----------|-----------|------------------|
| {{situation}} | {{framework}} | "{{phrase clone says}}" |

### CAMADA 3: Meta-Frameworks (Invioláveis)

**META-1:** "{{citação ou princípio central}}" — Fonte: {{verified_source}}
**META-2:** "{{segundo princípio inviolável}}" — Fonte: {{verified_source}}
```

**Checkpoint FASE-2:**
- [ ] Protocolo forense de 5 passos aplicado e documentado
- [ ] ≥ 3 frameworks na Camada 1 com trigger + processo + output
- [ ] ≥ 3 frameworks na Camada 2 (situacionais) mapeados
- [ ] ≥ 2 meta-frameworks na Camada 3 com fontes verificáveis
- [ ] Zero frameworks inferidos sem evidência (nenhum marcado [INFERIDO])

---

## FASE 3: DNA de Resposta (PENSAR-SENTIR-RESPONDER)

### PENSAR — Estilo Cognitivo

Identificar o tipo de processamento cognitivo primário observando como {{nome}} chega às conclusões.

**7 Tipos disponíveis:**
```
1. Analítico-Linear: segue lógica sequencial, A→B→C, decompõe em partes
2. Sistêmico-Holístico: vê o sistema como um todo, interdependências, emergência
3. Primeiros Princípios: questiona fundamentos, desmonta convenções, reconstrói do zero
4. Analógico-Metafórico: explica via analogias, metáforas, histórias
5. Orientado por Dados: exige números, métricas, evidências antes de concluir
6. Intuitivo-Padrão: reconhece padrões rapidamente, síntese gestáltica
7. Narrativo-Experiencial: processa via histórias pessoais e casos concretos
```

Documentar:
```markdown
### PENSAR

**Tipo identificado:** {{tipo}} — evidência: {{como identificou em {{N}} fontes}}

**Filtros de processamento:**
Antes de responder, {{nome}} parece sempre verificar:
1. "{{filtro observado empiricamente}} — evidência: {{fonte}}"
2. "{{filtro observado empiricamente}} — evidência: {{fonte}}"
3. "{{filtro observado empiricamente}} — evidência: {{fonte}}"

**Modo de síntese:** {{como chega à conclusão final}}
```

### SENTIR — Mapa Emocional

```markdown
### SENTIR

**Emoção base:** {{emoção predominante nos conteúdos}} — {{descrição baseada em observação}}

**Gatilhos emocionais documentados:**
(Observar em entrevistas, vídeos, podcasts: o que muda a energia/tom?)

| Situação | Emoção | Intensidade | Reação documentada | Fonte |
|----------|--------|-------------|---------------------|-------|
| {{situation}} | {{emotion}} | {{1-10}}/10 | {{observed_reaction}} | {{source}} |

**Modulação contextual:**
- Iniciante: {{como trata alguém sem contexto — observado, não inferido}}
- Expert: {{como trata alguém com conhecimento equivalente}}
- Cético: {{como reage a resistência/questionamento}}
```

### RESPONDER — Arquitetura de Resposta

**12 Arquiteturas disponíveis:**
```
1. HSO: Hook-Story-Offer — gancho + história + oferta
2. PAS: Problem-Agitation-Solution — problema + amplificação + solução
3. PAE: Problem-Amplify-Educate — problema + ampliação + educação
4. Socrática: perguntas progressivas até insight
5. Hegeliana: tese + antítese + síntese
6. Científica: observação + hipótese + teste + resultado
7. Narrativa: história como veículo do ensinamento
8. Direta-Assertiva: ponto primeiro, evidência depois
9. Consultiva: diagnóstico antes de solução
10. Analítica: decomposição + análise + síntese
11. Provocadora: desafio da premissa do interlocutor
12. Ensino Reverso: faz perguntas para que o interlocutor descubra
```

```markdown
### RESPONDER

**Arquitetura default:** {{arquitetura}} — evidência: {{como identificou}}

**Padrões de abertura documentados (10 primeiras palavras):**
- "{{opening_1}}" — fonte: {{source}}
- "{{opening_2}}" — fonte: {{source}}
- "{{opening_3}}" — fonte: {{source}}

**Fórmula Signature (4 passos observados consistentemente):**
1. {{passo_1}} — observado em: {{N fontes}}
2. {{passo_2}} — observado em: {{N fontes}}
3. {{passo_3}} — observado em: {{N fontes}}
4. {{passo_4}} — observado em: {{N fontes}}

**Fechamento característico:** {{como {{nome}} tipicamente encerra}}
```

**Checkpoint FASE-3:**
- [ ] Tipo cognitivo identificado com evidência (não apenas intuição)
- [ ] ≥ 3 gatilhos emocionais documentados com fonte
- [ ] Modulação contextual (iniciante/expert/cético) baseada em observação
- [ ] Arquitetura de resposta identificada com evidência
- [ ] Fórmula signature de 4 passos com ocorrências documentadas
- [ ] Fórmula testada com 3 perguntas diferentes antes de prosseguir

---

## Output da Task

Ao finalizar as 3 fases, salvar os artefatos sob `CLONE_ROOT = squads/{squad_destination}/.clones/{slug}/`:
- `${CLONE_ROOT}/prehd.md` — componentes PREHD completos
- `${CLONE_ROOT}/frameworks.md` — 3 camadas de frameworks
- `${CLONE_ROOT}/response-dna.md` — PENSAR-SENTIR-RESPONDER com fórmula signature

Estes artefatos alimentam diretamente `clone-assemble.md` (PHASE-5).

---

*Task: clone-research | wf-create-clone.yaml PHASE-4 | Squad Creator — AIOX*
