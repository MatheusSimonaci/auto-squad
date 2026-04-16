# Task: Fetch ClickUp Roteiro

**Task ID:** fetch-clickup-roteiro
**Version:** 1.0.0
**Purpose:** Fetch pending tasks from ClickUp list filtered by group "roteiro" and produce a theme brief
**Agent:** orchestrator (automated — no agent judgment required)
**Command:** `*fetch-roteiro {channel}`
**Execution Type:** Script (deterministic — runs node script, parses stdout)
**Workflow:** wf-tiktok-planner Phase 0

---

## Task Anatomy

```yaml
task_name: fetch-clickup-roteiro
status: active
responsible_executor: orchestrator
execution_type: script
input:
  required:
    - channel: "Channel key — must match a channel_profile in wf-tiktok-planner.yaml"
  resolved_internally:
    - list_id: "Resolved from channel_profiles[channel].clickup_list_id"
output:
  theme_brief:
    file: "output/tiktok/{channel}/{task_slug}/00-theme-brief.md"
    description: "Parsed ClickUp task — name, ID, URL, status, theme summary"
action_items:
  - "Resolve list_id from wf-tiktok-planner.yaml channel_profiles[channel]"
  - "Validate channel status is 'active' (not pending_configuration)"
  - "Run: node integrations/clickup/get-activities.js {list_id} roteiro"
  - "Parse stdout — extract first pending task (or let user select if multiple)"
  - "Generate task_slug: lowercase task name, spaces to hyphens, strip special chars"
  - "Create output directory: output/tiktok/{channel}/{task_slug}/"
  - "Write 00-theme-brief.md with structured task data"
acceptance_criteria:
  - "CLICKUP_API_KEY present in .env before running"
  - "channel maps to an active channel_profile (status: active)"
  - "node script exits with code 0"
  - "At least 1 task returned with group/status roteiro"
  - "task_slug generated — lowercase, hyphen-separated, no special characters"
  - "output/tiktok/{channel}/{task_slug}/ directory created"
  - "00-theme-brief.md written with all required fields"
```

---

## Pre-Flight Checks

Before running the node script, verify:

1. **`.env` has CLICKUP_API_KEY:**
   ```bash
   grep CLICKUP_API_KEY .env
   ```

2. **Channel is active in wf-tiktok-planner.yaml:**
   - `biblia-em-imagens` → `status: active` ✓
   - `tiktok-shop` → `status: pending_configuration` ✗ (blocked)
   - `informante-ai` → `status: pending_configuration` ✗ (blocked)

3. **Node script exists:**
   ```bash
   ls integrations/clickup/get-activities.js
   ```

---

## Execution Steps

### Step 1 — Resolve list_id

From `wf-tiktok-planner.yaml` `channel_profiles`:

| Channel | List ID |
|---------|---------|
| `biblia-em-imagens` | `901326517287` |
| `tiktok-shop` | `901326229706` *(pending)* |
| `informante-ai` | `901326318049` *(pending)* |

### Step 2 — Run ClickUp Script

```bash
node integrations/clickup/get-activities.js {list_id} roteiro
```

**Example (biblia-em-imagens):**
```bash
node integrations/clickup/get-activities.js 901326517287 roteiro
```

### Step 3 — Parse stdout

The script returns task data to stdout. Extract:
- `task_name` — full name of the task
- `task_id` — ClickUp task ID
- `task_url` — ClickUp task URL
- `status` — should be "roteiro"
- `assignee` — if present
- `due_date` — if present

**If multiple tasks returned:** select the first one with `status = roteiro` and no `due_date` in the past. Log all tasks found in the brief.

### Step 4 — Generate task_slug

Rules:
- Lowercase all characters
- Replace spaces and special characters with hyphens (`-`)
- Remove accents (normalize: ã→a, é→e, ç→c, etc.)
- Trim leading/trailing hyphens
- Max 60 characters

**Example:**
- Task name: `"A Serpente do Éden — O que a Bíblia realmente diz"`
- Slug: `a-serpente-do-eden-o-que-a-biblia-realmente-diz`

### Step 5 — Create Output Directory

```bash
mkdir -p output/tiktok/{channel}/{task_slug}/
```

### Step 6 — Write 00-theme-brief.md

```markdown
# Theme Brief — {task_name}

## ClickUp Task
- **Task Name:** {task_name}
- **Task ID:** {task_id}
- **Task URL:** {task_url}
- **Status:** {status}
- **Assignee:** {assignee or "unassigned"}
- **Due Date:** {due_date or "not set"}

## Channel
- **Channel:** {channel}
- **List:** {clickup_folder}
- **List ID:** {list_id}

## Theme Summary
> {1-3 sentence summary of the topic/theme extracted from the task name}

## Content Direction
- **Hook Angle:** {suggested curiosity gap from task theme}
- **Eye-Opening Fact:** {what makes this surprising or revelatory}
- **Target Emotion:** {the primary emotion to evoke}

## Output Path
`output/tiktok/{channel}/{task_slug}/`

## Metadata
- **task_slug:** {task_slug}
- **Generated:** {timestamp}
- **Workflow:** wf-tiktok-planner v1.0.0
```

---

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| `CLICKUP_API_KEY não encontrada` | Missing key in .env | Add `CLICKUP_API_KEY=your_key` to `.env` |
| `0 tasks returned` | No tasks with status "roteiro" | Add tasks to ClickUp with group "roteiro" |
| Channel `pending_configuration` | Channel not configured | Use `biblia-em-imagens` or configure the channel |
| Script exit code ≠ 0 | API error or network issue | Check API key validity and ClickUp API status |

---

## Quality Gate: QG-TK-001

**Blocking:** YES

| Check | Pass Condition |
|-------|---------------|
| ClickUp script exit code | 0 |
| Tasks returned | ≥ 1 with status roteiro |
| task_slug generated | Non-empty, lowercase, hyphen-separated |
| Output directory | Created at `output/tiktok/{channel}/{task_slug}/` |
| 00-theme-brief.md | Exists with task_name, task_id, task_url |

**On FAIL:** Stop pipeline. Report which check failed and provide recovery steps.
