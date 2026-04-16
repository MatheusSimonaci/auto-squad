# Task: Plan TikTok Concept

**Task ID:** plan-tiktok-concept
**Version:** 2.0.0
**Purpose:** Develop the central concept, hook, verse selection, and 4-beat segment arc for a 20-second TikTok video
**Agents:** mrbeast-agent (curiosity gap hook) + gary-vee-agent (verse selection + platform tone) — PARALLEL
**Command:** `*tiktok-concept {channel} {task_slug}`
**Execution Type:** Agent (parallel judgment — requires creativity and platform expertise)
**Workflow:** wf-tiktok-planner Phase 1

---

## Task Anatomy

```yaml
task_name: plan-tiktok-concept
status: active
responsible_executors:
  - mrbeast-agent: "Curiosity gap hook — pergunta que para o scroll + 4-beat segment arc"
  - gary-vee-agent: "Verse selection + platform-native tone + expository direction"
execution_type: agent_parallel
input:
  required:
    - theme_brief: "output/tiktok/{channel}/{task_slug}/00-theme-brief.md"
    - channel_profile: "channel_profiles[channel] from wf-tiktok-planner.yaml"
output:
  mrbeast_concept:
    file: "output/tiktok/{channel}/{task_slug}/01a-concept-mrbeast.md"
    description: "Curiosity gap hook + 4-beat segment arc draft"
  garyvee_concept:
    file: "output/tiktok/{channel}/{task_slug}/01b-concept-garyvee.md"
    description: "Verse selection (Livro Cap:Vers) + platform tone + expository angle"
  final_concept:
    file: "output/tiktok/{channel}/{task_slug}/01-concept-final.md"
    description: "Merged concept — MrBeast hook + Gary Vee verse + 4-beat segment arc"
action_items:
  - "Read 00-theme-brief.md — internalize theme, target emotion, channel context"
  - "Read channel_profile — apply tone, audience, hook_style, bible_content_direction"
  - "RUN PARALLEL: mrbeast-agent produces 01a; gary-vee-agent produces 01b"
  - "MERGE: combine outputs into 01-concept-final.md with 4-beat segment arc"
acceptance_criteria:
  - "01a-concept-mrbeast.md: hook question + 4-beat segment arc draft"
  - "01b-concept-garyvee.md: exact Bible verse with reference + tone guidelines"
  - "01-concept-final.md: merged hook + verse + tone + EXACTLY 4 segment beats"
  - "Segment arc beats labeled (HOOK, VERSE, ILLUSTRATION, CTA)"
  - "Seg 2 (VERSE) has exact Bible reference (Book Chapter:Verse)"
  - "Seg 1 (HOOK) question is directly answerable by the Seg 2 verse"
  - "CTA beat asks to comment — NOT to share"
```

---

## Agent Briefs

### MrBeast Agent Brief (→ 01a-concept-mrbeast.md)

**Your role:** Curiosity gap architect — define the hook question and the 4-beat segment arc.

**What to produce:**

1. **Hook Question (for Seg 1 — HOOK)**
   - A genuine question Christians have that can be answered directly by a Bible verse
   - Must stop the scroll within 3 seconds
   - Must be answerable by a single verse (not a theological explanation)
   - Format: direct question, first-person framing
   - Style: "O que fazer quando..." / "Existe um versículo que..." / "A Bíblia descreve exatamente..."
   - NOT: "Você não vai acreditar..." / "Segredo que as igrejas escondem..." (sensationalism = blocked)

2. **4-Beat Segment Arc**
   - One-line description for each of the 4 segments
   - Label each beat: HOOK | VERSE | ILLUSTRATION | CTA
   - HOOK (Seg 1): the question that stops the scroll
   - VERSE (Seg 2): the Bible verse that answers it directly (reference TBD by Gary Vee)
   - ILLUSTRATION (Seg 3): what the verse literally shows — visual description
   - CTA (Seg 4): viewer comments what the verse means TO THEM

3. **Retention Mechanic**
   - Why does the viewer stay after the hook?
   - What is the emotional payoff they're waiting for?
   - For biblia-em-imagens: recognition ("that's exactly how I feel") > revelation

**Channel constraints:** Apply `channel_profiles[channel].hook_style` and `tone`.
**Bible direction:** Apply `bible_content_direction.segment_guidance.HOOK` rules.

---

### Gary Vee Agent Brief (→ 01b-concept-garyvee.md)

**Your role:** Verse selector and expository strategist — choose the right verse and define the authentic tone.

**What to produce:**

1. **Verse Selection**
   - Select the exact Bible verse that answers the hook question from MrBeast's draft
   - Provide: exact reference (Livro Capítulo:Versículo) + full verse text in pt-BR
   - Criteria for selection:
     - Verse directly addresses the question (no metaphorical stretching)
     - Verse is specific enough to be illustrated literally in 5 seconds
     - Verse is emotionally resonant, not doctrinal/technical
   - If multiple verses fit: select the most visually illustratable one

2. **Literal Illustration Description (for Seg 3)**
   - What does this verse LITERALLY describe? (not what it "means")
   - This becomes the foundation of the video_prompt for Seg 3
   - Must be concrete, not abstract: "pastor with sheep in open field" not "God's care"

3. **Tone Guidelines**
   - 3-5 tone adjectives specific to this verse and theme
   - What to avoid (tone traps for this specific verse)
   - Language register: intimate/personal vs. declarative/majestic

4. **Authenticity Check**
   - Does this verse + hook combination feel genuine to Brazilian Christians?
   - Does the angle feel devotional or like content marketing?
   - If tension exists: propose adjustment

**Channel constraints:** Apply `channel_profiles[channel].tone` and `audience`.
**Bible direction:** Apply ALL `bible_content_direction.core_principles` (BCD_001-005).

---

## Merge Step (→ 01-concept-final.md)

After both agents deliver their outputs, merge into the final concept document:

### Merge Rules

| Element | Source | Rule |
|---------|--------|------|
| Hook question (Seg 1) | MrBeast | Use curiosity gap question — highest stopping power |
| Verse + reference (Seg 2) | Gary Vee | Use exact verse selected; verify it answers the hook |
| Literal illustration (Seg 3) | Gary Vee | Use literal visual description — not abstract |
| Tone | Gary Vee | Apply throughout all narration |
| CTA (Seg 4) | Both | Comment-based CTA (not share); personal question about the verse |

### Alignment Check (before writing final)

Before writing 01-concept-final.md, verify:
- Does the hook question point directly to the selected verse? If not → revise hook.
- Is the verse specific enough to be illustrated literally? If not → select different verse.
- Does the illustration describe what the verse says (not what it means)? If not → revise.

### 01-concept-final.md Structure

```markdown
# Concept Final — {task_name}

## Central Idea
**Verse:** {Livro Cap:Vers} — {texto completo do versículo (pt-BR)}
**Core Emotion:** {primary emotion the verse evokes}
**Hook Question:** {the question Seg 1 will ask — directly answered by this verse}

## Segment Arc

| Seg | Timing  | Bloco         | Beat Description                                   |
|-----|---------|---------------|----------------------------------------------------|
| 1   | 0-5s    | HOOK          | {pergunta — curiosity gap, respondida pelo versículo} |
| 2   | 5-10s   | VERSE         | {Livro Cap:Vers} — {texto do versículo}            |
| 3   | 10-15s  | ILLUSTRATION  | {o que o versículo mostra literalmente}            |
| 4   | 15-20s  | CTA           | {pergunta pessoal sobre o versículo — comentar}    |

## Tone Guidelines
- {tone guideline 1}
- {tone guideline 2}
- **Avoid:** {tone traps}

## Literal Illustration Notes
- Seg 3 visual: {concrete description of what the verse depicts — for video_prompt}
- Style: {illustration style for this verse}
- Mood: {specific mood — not generic}

## Notes for Script Phase
- {specific guidance for Russell Brunson Pass A}
- {words/phrases to use or avoid}
- {video_prompt direction for Seg 2 — how to show the verse text on screen}
```

---

## Quality Gate: QG-TK-002

**Blocking:** YES

| Check | Pass Condition |
|-------|---------------|
| 01a-concept-mrbeast.md | Exists + has hook question + 4-beat segment arc |
| 01b-concept-garyvee.md | Exists + has exact verse with reference + literal illustration description |
| 01-concept-final.md | Exists + has merged hook + verse + tone + 4-beat segment arc table |
| Segment arc row count | Exactly 4 rows |
| Block labels | All 4 blocks present (HOOK, VERSE, ILLUSTRATION, CTA) |
| Verse reference | Seg 2 has specific reference (Livro Cap:Vers) — not generic |
| Hook-Verse alignment | Hook question is directly answerable by the selected verse |
| CTA beat | Asks to comment; no explicit share request |

**On FAIL:** Identify which file/check failed. Re-run the specific agent or fix the merge step.
