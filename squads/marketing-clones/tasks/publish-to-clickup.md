# Task: Publish Roteiro to ClickUp

**Task ID:** publish-to-clickup
**Version:** 1.0.0
**Purpose:** Append the complete roteiro (description + script) to the ClickUp task and advance it to the next stage
**Agent:** orchestrator (automated — no agent judgment required)
**Command:** `*publish-roteiro {channel} {task_slug}`
**Execution Type:** Script (deterministic — assemble content, run two node scripts sequentially)
**Workflow:** wf-tiktok-planner Phase 4

---

## Task Anatomy

```yaml
task_name: publish-to-clickup
status: active
responsible_executor: orchestrator
execution_type: script
input:
  required:
    - task_id: "from output/tiktok/{channel}/{task_slug}/00-theme-brief.md"
    - description_file: "output/tiktok/{channel}/{task_slug}/02-description.md"
    - script_file: "output/tiktok/{channel}/{task_slug}/03-script-final.md"
output:
  clickup_update:
    description: "ClickUp task description updated with full roteiro"
  clickup_stage:
    description: "ClickUp task moved to the next status in the pipeline"
action_items:
  - "Read task_id from 00-theme-brief.md"
  - "Assemble roteiro content from 02-description.md + 03-script-final.md"
  - "Run: node integrations/clickup/append-description.js {task_id} \"{roteiro_content}\""
  - "Run: node integrations/clickup/move-next-stage.js {task_id}"
acceptance_criteria:
  - "task_id resolved from 00-theme-brief.md (non-empty)"
  - "02-description.md exists and is non-empty"
  - "03-script-final.md exists and is non-empty"
  - "append-description.js exits with code 0"
  - "move-next-stage.js exits with code 0"
  - "ClickUp task description contains the appended roteiro"
  - "ClickUp task status advanced to next stage"
```

---

## Pre-Flight Checks

1. **All Phase 3 outputs exist:**
   ```
   output/tiktok/{channel}/{task_slug}/02-description.md  ✓
   output/tiktok/{channel}/{task_slug}/03-script-final.md ✓
   ```

2. **task_id is available** in `00-theme-brief.md` under the `Task ID` field.

3. **CLICKUP_API_KEY** is set in `.env` (already verified in Phase 0, but confirm before running).

---

## Execution Steps

### Step 1 — Read task_id

Extract from `output/tiktok/{channel}/{task_slug}/00-theme-brief.md`:

```markdown
- **Task ID:** {task_id}   ← read this value
```

### Step 2 — Assemble Roteiro Content

Build a single text block combining both output files.

**Format:**

```
## Roteiro TikTok — {task_name}
Gerado por: wf-tiktok-planner v1.0.0
Canal: {channel}

---

{full content of 02-description.md}

---

{full content of 03-script-final.md}
```

The assembled content is passed as the second argument to `append-description.js`. Since it may contain newlines and special characters, use a temp file approach:

```bash
# Write assembled content to a temp file
cat 00-theme-brief.md | grep "Task Name" > /dev/null  # just a check

# Assemble and run (using $() with heredoc or temp file)
node integrations/clickup/append-description.js {task_id} "$(cat output/tiktok/{channel}/{task_slug}/roteiro-assembled.txt)"
```

Or pass via temp file:
```bash
# 1. Write assembled roteiro to temp file
# 2. Run script reading from file
node integrations/clickup/append-description.js {task_id} "$(cat /tmp/roteiro-{task_slug}.txt)"
```

### Step 3 — Run append-description.js

```bash
node integrations/clickup/append-description.js {task_id} "{assembled_roteiro_content}"
```

**Expected stdout:**
```
🔍  Buscando tarefa {task_id}...
✏️   Atualizando descrição de "{task_name}"...
✅  Descrição atualizada com sucesso!
📋  Prévia do conteúdo adicionado: ...
🔗  https://app.clickup.com/t/{task_id}
```

**On failure:** Script exits code 1 with error message. Stop pipeline. Do NOT run Step 4.

### Step 4 — Run move-next-stage.js

```bash
node integrations/clickup/move-next-stage.js {task_id}
```

**Expected stdout:**
```
🔍  Buscando tarefa {task_id}...
📌  Tarefa: "{task_name}"
📍  Status atual: "roteiro"
🔄  Pipeline: roteiro → {next_status} → ...
⏭️   Movendo: "roteiro" → "{next_status}"...
✅  Tarefa movida com sucesso!
🔗  https://app.clickup.com/t/{task_id}
```

**On failure:** Script exits code 1. Log the error but the roteiro was already appended successfully (Step 3). Report to user — they can run `move-next-stage.js` manually.

---

## Assembled Roteiro Format (detailed)

The content appended to ClickUp must be human-readable in the ClickUp task description. Structure it clearly:

```
## Roteiro TikTok
**Canal:** {channel_display_name}
**Gerado em:** {timestamp pt-BR}
**Workflow:** wf-tiktok-planner v1.0.0

────────────────────────────────────

### DESCRIÇÃO + HASHTAGS

{content from 02-description.md — caption block + full hashtag block}

────────────────────────────────────

### ROTEIRO — 18 CENAS × 5s = 90s

{content from 03-script-final.md — full scene table}
```

---

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| `CLICKUP_API_KEY não encontrada` | Key missing in .env | Add key and retry Step 3 |
| `task_id not found in 00-theme-brief.md` | Phase 0 brief missing field | Re-read brief or run Phase 0 again |
| `HTTP 401` on append | Invalid API key | Check key validity |
| `HTTP 404` on append | task_id not found in ClickUp | Verify task still exists in ClickUp |
| append script exits 1 | API error | Fix error, retry Step 3 before running Step 4 |
| move-next-stage exits 1 | Task already at last status | Run manually with `--status` flag |
| `já está no último status` | No next stage | Inform user — move manually if needed |

---

## Quality Gate: QG-TK-005

**Blocking:** YES (Step 3 blocks Step 4; Step 3 failure stops pipeline)

| Check | Pass Condition |
|-------|---------------|
| task_id resolved | Non-empty string from 00-theme-brief.md |
| 02-description.md | Exists and is non-empty |
| 03-script-final.md | Exists and is non-empty |
| append-description.js | Exit code 0 |
| move-next-stage.js | Exit code 0 (or warning if already last status) |
| ClickUp task | Description updated (confirm via stdout "✅") |
| ClickUp task | Status advanced (confirm via stdout "✅") |

**Partial success:** If append succeeds but move-next-stage fails — report as partial success. The roteiro is saved. User must advance the stage manually.
