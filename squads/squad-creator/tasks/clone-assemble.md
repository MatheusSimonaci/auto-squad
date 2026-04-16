# Task: Clone Assemble — Montagem do Arquivo Final

**Task ID:** clone-assemble
**Execution Type:** Agent
**Model:** Sonnet
**Model Rationale:** "Assembly de template com dados já pesquisados — síntese estruturada, não pesquisa profunda"
**Haiku Eligible:** NO — síntese e adaptação do template para persona específica requer raciocínio intermediário
**Purpose:** Montar o arquivo final do clone de IA integrando PREHD + Frameworks + DNA de Resposta no template padrão
**Orchestrator:** wf-create-clone.yaml (PHASE-5)
**Dependencies:**
  - clone-research.md (gera: `${CLONE_ROOT}/prehd.md`, `${CLONE_ROOT}/frameworks.md`, `${CLONE_ROOT}/response-dna.md`)
  - clone-source-extract.md (gera: `${CLONE_ROOT}/source-manifest.yaml` — para tabela de fontes verificadas)
  - squads/squad-creator/templates/clone-agent-tmpl.md

**Convenção de paths:** `CLONE_ROOT = squads/{squad_destination}/.clones/{slug}/` — todos os artefatos de pesquisa do clone vivem sob essa raiz. O arquivo final `{slug}-agent.md` é o ÚNICO artefato deste clone que fica no topo de `squads/{squad_destination}/`.

---

## PRÉ-CONDIÇÕES OBRIGATÓRIAS

Antes de executar esta task, definir `CLONE_ROOT=squads/{squad_destination}/.clones/{slug}` e verificar que existem:

```
[ ] ${CLONE_ROOT}/prehd.md — PREHD completo com fontes
[ ] ${CLONE_ROOT}/frameworks.md — 3 camadas de frameworks
[ ] ${CLONE_ROOT}/response-dna.md — PSR com fórmula signature
[ ] ${CLONE_ROOT}/source-manifest.yaml — manifesto de fontes verificadas (para tabela H)
[ ] squads/squad-creator/templates/clone-agent-tmpl.md — template carregado e lido completamente
```

**VETO:** Se qualquer artefato estiver ausente → BLOQUEAR e solicitar execução de `clone-research.md` primeiro.

**REGRA TEMPLATE-FIRST:** Ler `squads/squad-creator/templates/clone-agent-tmpl.md` na íntegra ANTES de escrever qualquer linha do agente. Escrever sem ler o template = VIOLAÇÃO.

---

## FASE 5: Assembly do Agente

### Passo 1 — Carregar Template e Artefatos

```
1. Ler: squads/squad-creator/templates/clone-agent-tmpl.md
2. Ler: ${CLONE_ROOT}/prehd.md
3. Ler: ${CLONE_ROOT}/frameworks.md
4. Ler: ${CLONE_ROOT}/response-dna.md
5. Ler: ${CLONE_ROOT}/source-manifest.yaml (para preencher tabela de fontes em H)
6. Confirmar que todos os {{variáveis}} do template têm valor correspondente nos artefatos
```

Mapear variáveis antes de escrever:

| Variável no Template | Valor dos Artefatos | Fonte |
|---------------------|--------------------|-|
| `{{full_name}}` | {{name_from_prehd}} | ${CLONE_ROOT}/prehd.md |
| `{{slug}}` | {{slug_generated}} | derivado do nome |
| `{{icon}}` | {{chosen_emoji}} | adequado ao domínio |
| `{{primary_command}}` | {{main_command_name}} | baseado na especialidade |
| `{{frameworks_layer1_names}}` | {{f1 \| f2 \| f3}} | ${CLONE_ROOT}/frameworks.md |
| `{{signature_closing}}` | {{closing_phrase}} | ${CLONE_ROOT}/prehd.md (R-seção) |
| `{{cognitive_style_name}}` | {{pensar_tipo}} | ${CLONE_ROOT}/response-dna.md |
| `{{response_architecture_name}}` | {{responder_arq}} | ${CLONE_ROOT}/response-dna.md |

### Passo 2 — Gerar YAML de Ativação

Baseado no modelo do gary-vee-agent.md, criar o bloco YAML de ativação:

```yaml
activation-instructions:
  - STEP 1: [instrução de leitura completa]
  - STEP 2: [instrução de adoção de persona]
  - STEP 3: |
      Display greeting:
      1-6. [linhas do greeting com dados reais]
  - STEP 4: HALT and await user input
  - STAY IN CHARACTER — reforço da identidade
  - Em TODA resposta: declarar framework ativo + raciocínio visível

agent:
  name: [nome real]
  id: [slug]
  title: [title]
  icon: [emoji]
  whenToUse: [one-line]

persona:
  role: [role]
  style: [adjectives]
  identity: "Clone cognitivo de [nome]"
  focus: [domain]

commands:
  - name: help
  - name: [primary_command]
    args: [args]
    description: [desc]
  - name: frameworks
  - name: exit
```

**Critérios de qualidade do YAML:**
- Greeting deve mencionar ≥ 3 frameworks da Camada 1 por nome
- Persona.style deve usar os mesmos adjetivos documentados na seção R do PREHD
- Primary command deve ser relevante e específico ao domínio (não genérico)

### Passo 3 — Montar Arquivo Completo

Seguir EXATAMENTE a ordem das seções do template:

```
1. ACTIVATION-NOTICE header
2. CRITICAL notice
3. "## COMPLETE AGENT DEFINITION FOLLOWS" header
4. Bloco YAML (ativação + agent + persona + commands)
5. --- separador
6. # {{Nome}} — Clone de IA (header)
7. Metadados (version, created, methodology, status)
8. --- separador
9. <security> bloco anti-jailbreak
10. --- separador
11. ## Identidade
12. --- separador
13. ## Fontes Verificáveis
14. --- separador
15. ## Estilo de Comunicação
16.   ### Vocabulário Característico (7-12 termos com exemplos)
17.   ### Estrutura Típica de Resposta (4 passos)
18.   ### Frases Documentadas Reais (≥3 citações com fonte)
19.   ### Anti-Padrões (≥3 itens)
20. --- separador
21. ## Especialidade e Habilidades
22. --- separador
23. ## Sistema de Frameworks — 3 Camadas
24.   ### CAMADA 1 (3-4 frameworks completos)
25.   ### CAMADA 2 (tabela situacional)
26.   ### CAMADA 3 (meta-frameworks)
27. --- separador
28. ## DNA de Resposta
29.   ### PENSAR
30.   ### SENTIR
31.   ### RESPONDER
32. --- separador
33. ## Exemplo de Resposta Autêntica
34. --- separador
35. ## Checklist de Validação Rápida
36. --- separador
37. *Rodapé com metadata*
```

### Passo 4 — Seção de Exemplo de Resposta

Esta seção é crítica — deve demonstrar TODOS os elementos em ação:

```markdown
## Exemplo de Resposta Autêntica

**Pergunta escolhida:** [escolher uma pergunta que ative MÚLTIPLOS frameworks]

**Critérios da pergunta de exemplo:**
- Deve ser do domínio principal
- Deve ativar ≥ 2 frameworks da Camada 1
- Deve revelar o estilo cognitivo (PENSAR)
- Deve mostrar a emoção base (SENTIR)
- Deve seguir a fórmula signature (RESPONDER)

**Na resposta:**
- Marcar explicitamente qual framework está sendo aplicado
- Usar vocabulário característico (≥ 3 termos da lista)
- Seguir a fórmula signature de 4 passos
- Terminar com o fechamento característico
- Seção "O que torna esta resposta autêntica" com 4+ elementos verificáveis
```

### Passo 5 — Determinação do Destino

```
squad de destino: squads/{{squad-name}}/
nome do arquivo: {{slug}}-agent.md

Se o squad não existir:
→ NÃO criar o squad — sinalizar ao usuário que o squad precisa ser criado primeiro
→ Sugerir: *create-squad ou adicionar ao squad existente mais relevante

Se o squad existir:
→ Verificar que não existe {slug}-agent.md já
→ Se existir → perguntar ao usuário: sobrescrever, versionar, ou cancelar
→ Criar o arquivo em squads/{{squad-name}}/{{slug}}-agent.md
```

---

## Checklist de Assembly (Pós-Criação)

Verificar ANTES de avançar para clone-calibrate.md:

**Estrutural:**
- [ ] Template foi carregado antes de escrever (não foi escrito de memória)
- [ ] Todas as seções do template presentes no arquivo final
- [ ] Nenhum `{{variável}}` deixado sem preencher
- [ ] Arquivo criado em `squads/{squad-name}/{slug}-agent.md`

**Conteúdo:**
- [ ] Bloco `<security>` presente no início (após YAML)
- [ ] YAML de ativação completo com greeting + agent + persona + commands
- [ ] Vocabulário: ≥ 7 termos com exemplos reais documentados
- [ ] Frameworks Camada 1: ≥ 3 com trigger + processo + output + fonte
- [ ] Frameworks Camada 2: tabela com ≥ 3 situações
- [ ] Meta-frameworks Camada 3: ≥ 2 com fonte verificável
- [ ] DNA de Resposta: PENSAR + SENTIR + RESPONDER completos
- [ ] Fórmula Signature: 4 passos definidos
- [ ] Exemplo de Resposta: demonstra múltiplos frameworks em ação
- [ ] Anti-padrões: ≥ 3 definidos

**Qualidade:**
- [ ] Zero afirmações sem fonte verificável
- [ ] Zero `{{variáveis}}` não substituídas
- [ ] Tom de voz no YAML alinhado com writing fingerprint (seção R)
- [ ] Arquivo tem ≥ 300 linhas (conforme quality_standard)

**Score mínimo para avançar à calibração: 18/18**

---

## Output da Task

Arquivo criado: `squads/{squad-name}/{slug}-agent.md`

Este arquivo alimenta diretamente `clone-calibrate.md` (PHASE-5).

---

*Task: clone-assemble | wf-create-clone.yaml PHASE-4 | Squad Creator — AIOX*
