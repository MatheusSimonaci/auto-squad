---
task-id: generate-narration
name: Generate Narration Audio
version: 1.0.0
workflow: wf-narration-generator
phase: 1
agent: marketing-agent (qualquer clone ativo)
elicit: false
estimated-time: 3-8 minutes
---

# Task: Generate Narration Audio

## Objetivo

Gerar arquivos de narração (MP3) via ElevenLabs TTS a partir do texto de narração
encontrado na descrição de um card ClickUp em "CRIAÇÃO DOS VÍDEOS".
O agente interpreta a descrição do card, identifica os textos de cada parte,
e executa `text-to-speech.js` para cada uma.

---

## Task Anatomy

```yaml
task_name: generate-narration
status: active
responsible_executor: marketing-agent
execution_type: agent
input:
  required:
    - task_id: "ClickUp task ID (obtido na Phase 0)"
    - task_name: "Nome da tarefa ClickUp"
    - task_slug: "Slug gerado a partir do nome"
    - channel: "Channel key (ex: biblia-em-imagens)"
    - description: "Descrição completa do card ClickUp (campo description de get-activities.js)"
  optional:
    - voice_id: "ElevenLabs voice ID override (padrão: Brian)"
output:
  narration_files:
    files: "output/tiktok/{channel}/{task_slug}/parteN.mp3"
    description: "Um MP3 por parte de narração identificada na descrição"
  devolutiva:
    description: "Markdown com resultado para postar no card ClickUp"
action_items:
  - "Ler e interpretar a descrição do card"
  - "Identificar os textos de narração para cada parte do vídeo"
  - "Para cada parte: executar text-to-speech.js com texto e output path"
  - "Validar MP3s gerados (existem e size > 0)"
  - "Montar devolutiva com resultado"
acceptance_criteria:
  - "ELEVENLABS_API_KEY presente no .env"
  - "Pelo menos 1 parte de narração identificada na descrição"
  - "Todos MP3 gerados com file size > 0"
  - "Arquivos nomeados parte1.mp3, parte2.mp3, ... em sequência"
  - "Devolutiva montada com lista de arquivos gerados"
```

---

## Pré-condições

- [ ] `ELEVENLABS_API_KEY` configurada no `.env`
- [ ] `CLICKUP_API_KEY` configurada no `.env`
- [ ] Script `integrations/elevenlabs/text-to-speech.js` acessível
- [ ] Phase 0 concluída: `task_id`, `task_name`, `description` disponíveis

---

## Execução

### Passo 1 — Interpretar a descrição do card

O agente recebe a `description` do card ClickUp (texto livre, não estruturado).
Deve ler e interpretar o conteúdo para identificar os textos de narração de cada parte do vídeo.

**O que procurar:**
- Textos de narração organizados por partes (parte 1, parte 2, etc.)
- Pode estar em qualquer formato: headings, listas, parágrafos separados
- O agente usa raciocínio LLM para extrair — não depende de formato rígido

**Resultado esperado:** Lista de `{ parte: N, texto: "..." }` para cada parte identificada.

### Passo 2 — Criar diretório de saída

```bash
mkdir -p output/tiktok/{channel}/{task_slug}/
```

### Passo 3 — Gerar áudio para cada parte

Para cada parte identificada no Passo 1:

```bash
node integrations/elevenlabs/text-to-speech.js "<texto_da_parte>" "output/tiktok/{channel}/{task_slug}/parteN.mp3"
```

**Com voice_id customizado (opcional):**
```bash
node integrations/elevenlabs/text-to-speech.js "<texto_da_parte>" "output/tiktok/{channel}/{task_slug}/parteN.mp3" <voice_id>
```

**Observações:**
- Executar sequencialmente (uma parte por vez) para evitar rate limits do ElevenLabs
- Escapar aspas e caracteres especiais no texto antes de passar como argumento CLI
- Se o texto de uma parte for muito longo (>5000 caracteres), dividir em sub-blocos

### Passo 4 — Validar MP3s gerados

Para cada arquivo gerado, verificar:
- [ ] Arquivo existe no caminho esperado
- [ ] File size > 0 bytes

Se algum arquivo falhou, registrar qual parte falhou e continuar com as demais.

### Passo 5 — Montar devolutiva

Construir markdown com o resultado:

```markdown
## Resultado da Narração

- **Status:** ✅ Concluído com sucesso
- **Partes geradas:** {N} de {total}
- **Canal:** {channel}
- **Pasta:** `output/tiktok/{channel}/{task_slug}/`
- **Data:** {timestamp}

### Arquivos Gerados
- `parte1.mp3` — {size} KB
- `parte2.mp3` — {size} KB
- `parte3.mp3` — {size} KB
```

Em caso de falha parcial:

```markdown
## Resultado da Narração

- **Status:** ⚠️ Parcialmente concluído
- **Partes geradas:** {N} de {total}
- **Partes com falha:** parte{X}
- **Erro:** {mensagem de erro}
- **Data:** {timestamp}
```

---

## Critérios de Aceitação

- [ ] Pelo menos 1 parte de narração identificada na descrição do card
- [ ] Todos MP3 gerados existem e possuem size > 0
- [ ] Arquivos nomeados `parte1.mp3`, `parte2.mp3`, ... em sequência
- [ ] Devolutiva montada com lista de arquivos e tamanhos

---

## Tratamento de Erros

| Erro | Ação |
|------|------|
| `ELEVENLABS_API_KEY não encontrada` | Orientar: adicionar `ELEVENLABS_API_KEY=...` ao `.env` |
| Nenhuma parte de narração identificada | Reportar que a descrição não contém texto de narração interpretável |
| HTTP 401 do ElevenLabs | API key inválida — verificar `.env` |
| HTTP 422 do ElevenLabs | Texto ou voice_id inválido — verificar parâmetros |
| Texto muito longo (>5000 chars) | Dividir em sub-blocos e gerar MP3 separados |
| Arquivo MP3 com size = 0 | Retentar 1 vez; se persistir, registrar falha |

---

## Quality Gate: QG-NR-002

**Blocking:** YES

| Check | Pass Condition |
|-------|---------------|
| Partes identificadas | ≥ 1 parte de narração na descrição |
| MP3 gerados | Todos os arquivos existem |
| File sizes | Todos > 0 bytes |
| Nomes dos arquivos | `parteN.mp3` em sequência |
| Devolutiva | Montada com lista completa |

**On FAIL:** Registrar quais checks falharam. Se parcial, continuar com as partes que funcionaram.

---

## Dependências

### Depends On (Upstream)
- Phase 0 (`fetch-clickup-criacao`) — fornece `task_id`, `task_name`, `task_slug`, `description`

### Required By (Downstream)
- Phase 2 (`document-and-advance`) — usa devolutiva e verifica narração pronta

---

## Handoff

| Attribute | Value |
|-----------|-------|
| **Next Phase** | PHASE-2 (Document & Advance) |
| **Trigger** | Quando todos MP3 foram gerados e validados |
| **Entrega** | Lista de arquivos MP3 + devolutiva markdown |

Before handoff:
- [ ] Todos MP3 validados (size > 0)
- [ ] Devolutiva montada
- [ ] Nenhum erro crítico pendente
