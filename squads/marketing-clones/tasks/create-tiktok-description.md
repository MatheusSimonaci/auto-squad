# Task: Create TikTok Description

**Task ID:** create-tiktok-description
**Version:** 1.0.0
**Purpose:** Write the TikTok caption (≤150 chars) and 3-tier hashtag strategy (15-25 tags)
**Agent:** pedro-sobral-agent (default) | tiago-finch-agent (override)
**Command:** `*tiktok-description {channel} {task_slug}`
**Execution Type:** Agent (performance-driven copywriting + hashtag architecture)
**Workflow:** wf-tiktok-planner Phase 2

---

## Task Anatomy

```yaml
task_name: create-tiktok-description
status: active
responsible_executor: pedro-sobral-agent
executor_override: "tiago-finch-agent if description_agent=tiago-finch"
execution_type: agent
input:
  required:
    - concept_final: "output/tiktok/{channel}/{task_slug}/01-concept-final.md"
    - channel_profile: "channel_profiles[channel] from wf-tiktok-planner.yaml"
  also_read:
    - theme_brief: "output/tiktok/{channel}/{task_slug}/00-theme-brief.md"
output:
  description:
    file: "output/tiktok/{channel}/{task_slug}/02-description.md"
    description: "Caption ≤150 chars + 3-tier hashtag strategy + angle diagnostic"
action_items:
  - "Read 01-concept-final.md — extract central idea, hook, and emotional angle"
  - "Read 00-theme-brief.md — extract target emotion and content direction"
  - "Read channel_profile — apply hashtag_pillars and tone constraints"
  - "Write caption ≤150 characters (not counting hashtags)"
  - "Build 3-tier hashtag stack: 15-25 total tags"
  - "Write temperature diagnosis (cold/warm/hot audience framing)"
  - "Write angle testing note (alternative angles considered)"
  - "Output 02-description.md"
acceptance_criteria:
  - "Caption is ≤ 150 characters (count without hashtags)"
  - "Caption leads with emotion or curiosity — not a dry summary"
  - "Total hashtags between 15 and 25 (inclusive)"
  - "No duplicate hashtags"
  - "At least 3 niche hashtags from channel_profile.hashtag_pillars.niche"
  - "Hashtags organized into 3 tiers with counts"
  - "Temperature diagnosis present"
  - "At least 1 alternative angle considered and rejected with reason"
```

---

## Agent Brief (Pedro Sobral)

**Your role:** Performance copywriter — treat the description as a distribution artifact, not just text.

The TikTok description serves two purposes:
1. **Viewer context:** Appears below the video. Should add value or intrigue (not repeat the hook).
2. **Algorithm signal:** Hashtags are the primary distribution lever on TikTok SEO.

---

## Execution Steps

### Step 1 — Angle Selection

Read `01-concept-final.md`. Identify:
- The central eye-opening statement
- The primary emotion
- The audience's belief state (what do they already think vs. what the video reveals?)

Consider 2-3 caption angles:

| Angle Type | Example | When to use |
|-----------|---------|-------------|
| Curiosity tease | "O que a maioria das pessoas não sabe sobre isso..." | Cold audience, discovery feed |
| Emotional resonance | "Isso mudou a forma como eu enxergo a fé" | Warm audience, community |
| Provocative statement | "A Bíblia diz algo diferente do que te ensinaram" | Any audience, high engagement risk/reward |
| Direct value | "3 fatos sobre {topic} que todo cristão deveria conhecer" | Educational tone |

Select the best angle and document the rejection reason for others.

### Step 2 — Write Caption

**Rules:**
- ≤ 150 characters (NOT counting hashtags — hashtags go in a separate block below)
- Lead with the emotional/curiosity hook — not the topic title
- First 5 words must work as a standalone hook
- No emojis in the first character (may suppress reach in some feeds)
- Use 1-2 emojis max — place them mid-sentence or at the end
- End with an implicit question or open loop (don't close it — the video does that)

**Format check:**
```
[caption text] = {X} characters ✓/✗
```

### Step 3 — Build 3-Tier Hashtag Stack

**Tier 1 — Niche (channel-specific, high-intent):** 5-8 tags
- Source: `channel_profile.hashtag_pillars.niche`
- These are the tags that reach the exact target audience
- Example for biblia-em-imagens: `#biblia #palavradedeus #versiculododia #fecrista`

**Tier 2 — Broad (topical, medium competition):** 4-8 tags
- Source: `channel_profile.hashtag_pillars.broad` + topic-specific additions
- These expand reach to adjacent audiences
- Example: `#fe #deus #espiritualidade #cristaos #mensagemdedeus`

**Tier 3 — Trending/Discovery (current TikTok trends):** 3-6 tags
- Research: what's trending in the spiritual/motivational niche on TikTok Brazil?
- These are high-volume, shorter lifecycle tags
- Example: `#tiktokbrasil #viral #foryou #fyp`
- Note: `#fyp` and `#foryou` effectiveness is debated — include at most 1-2

**Total: 15-25 tags (enforce this range)**

**Tag formatting:**
- All lowercase (TikTok is case-insensitive but consistency matters)
- No spaces within tags
- Accents OK if that's how the tag is commonly used (`#bíblia` vs `#biblia` — use both if niche)

### Step 4 — Temperature Diagnosis

**Audience Temperature** describes how familiar the target viewer is with the content:

| Temperature | Description | Caption adjusts by... |
|------------|-------------|----------------------|
| Cold | Discovering channel for first time (FYP/discovery) | Leading with curiosity over community |
| Warm | Has seen similar content, may follow | Can reference shared context |
| Hot | Active follower, high intent | Can use inside language, callbacks |

For most TikTok content: **assume Cold temperature** (algorithm pushes to new viewers).

Write 2-3 sentences diagnosing the temperature for this specific video.

---

## 02-description.md Structure

```markdown
# TikTok Description — {task_name}

## Selected Caption
```
{caption text — ≤150 chars}
```
**Character count:** {X}/150 ✓

## Hashtag Strategy

### Tier 1 — Niche ({count} tags)
{#tag1} {#tag2} {#tag3} ...

### Tier 2 — Broad ({count} tags)
{#tag1} {#tag2} {#tag3} ...

### Tier 3 — Trending ({count} tags)
{#tag1} {#tag2} {#tag3} ...

**Total: {count} hashtags** ✓ (target: 15-25)

## Full Description Block (ready to paste)
```
{caption text}

{all hashtags in one block, space-separated}
```

## Angle Diagnostic

### Selected Angle
**Type:** {angle type}
**Rationale:** {why this angle was chosen}

### Alternatives Considered

| Angle | Draft | Rejection Reason |
|-------|-------|-----------------|
| {type} | {draft} | {reason} |
| {type} | {draft} | {reason} |

## Temperature Diagnosis
**Assumed Temperature:** Cold/Warm/Hot
{2-3 sentence diagnosis}

## Performance Notes
- {any specific optimization for this video's distribution}
- {hashtag substitutions to test if reach is low}
```

---

## Quality Gate: QG-TK-003

**Blocking:** YES

| Check | Pass Condition |
|-------|---------------|
| Caption character count | ≤ 150 characters |
| Total hashtag count | 15-25 (inclusive) |
| Tier 1 niche tags | ≥ 3 from channel_profile.hashtag_pillars.niche |
| Duplicate hashtags | 0 duplicates |
| Full description block | Present (ready-to-paste format) |
| Angle diagnostic | At least 1 alternative considered and rejected |
| Temperature diagnosis | Present |

**On FAIL:** Identify specific failed check. Adjust caption length or hashtag count and rewrite.

---

## Agent Override: Tiago Finch

When `description_agent=tiago-finch`, use the same steps but apply Tiago Finch's perspective:
- Emphasize A/B angle testing framing (which variant would perform better?)
- Include data-driven hashtag selection rationale (volume estimates if known)
- Add a split-test recommendation for the caption (variant A vs variant B)
- Temperature diagnosis uses conversion funnel language
