# Task: Write TikTok Script

**Task ID:** write-tiktok-script
**Version:** 2.0.0
**Purpose:** Produce the complete 4-segment script (narration_text + video_prompt per segment) for a 20-second TikTok video
**Agents:** russell-brunson-agent (Pass A) → mrbeast-agent (Pass B) — SEQUENTIAL
**Command:** `*tiktok-script {channel} {task_slug}`
**Execution Type:** Agent sequential (Pass A narrative structure → Pass B sharpening + validation)
**Workflow:** wf-tiktok-planner Phase 3

---

## Task Anatomy

```yaml
task_name: write-tiktok-script
status: active
responsible_executors:
  pass_a: "russell-brunson-agent — narrative structure, 4 segments, narration + video_prompt"
  pass_b: "mrbeast-agent — narration sharpening (≤12 words), video_prompt validation, CTA check"
execution_type: agent_sequential
input:
  required:
    - concept_final: "output/tiktok/{channel}/{task_slug}/01-concept-final.md"
    - theme_brief:   "output/tiktok/{channel}/{task_slug}/00-theme-brief.md"
    - channel_profile: "channel_profiles[channel] from wf-tiktok-planner.yaml"
    - bible_direction: "bible_content_direction from wf-tiktok-planner.yaml"
output:
  brunson_draft:
    file: "output/tiktok/{channel}/{task_slug}/03a-script-brunson.md"
    description: "4-segment table: narration_text + video_prompt (draft, may exceed word limit)"
  final_script:
    file: "output/tiktok/{channel}/{task_slug}/03-script-final.md"
    description: "4-segment table validated: ≤12 words narration, video_prompts specific, CTA correct"
action_items:
  - "Pass A: Russell Brunson reads concept + theme brief, writes full 4-segment table"
  - "Pass A: Every segment has narration_text AND video_prompt"
  - "Pass A: Apply bible_content_direction — verse-first, literal illustration, zero tangential commentary"
  - "Pass B: MrBeast reads 03a-script-brunson.md, sharpens narration_text to ≤12 words"
  - "Pass B: Validate video_prompt specificity per segment (no generic/abstract prompts)"
  - "Pass B: Validate CTA in Seg 4 (comment, not share)"
  - "Pass B: Output 03-script-final.md with validated table"
acceptance_criteria:
  - "03a-script-brunson.md: exactly 4 segment rows"
  - "03a-script-brunson.md: every row has narration_text and video_prompt"
  - "03-script-final.md: exactly 4 segment rows"
  - "03-script-final.md: every narration_text has ≤12 words"
  - "03-script-final.md: every video_prompt is specific and illustrates the segment literally"
  - "03-script-final.md: Seg 1 labeled HOOK with curiosity gap question"
  - "03-script-final.md: Seg 2 labeled VERSE — narration = reading the verse aloud; video_prompt shows verse text prominently"
  - "03-script-final.md: Seg 3 labeled ILLUSTRATION — video_prompt shows what the verse literally describes"
  - "03-script-final.md: Seg 4 labeled CTA — asks viewer to comment, NOT to share"
  - "Total duration: 4 × 5s = 20s"
```

---

## Pass A — Russell Brunson Agent Brief

**Your role:** Narrative architect — write the full 4-segment script grounded in the selected Bible verse.

**Inputs to read BEFORE writing:**
1. `00-theme-brief.md` — ClickUp task theme, channel, and target emotion
2. `01-concept-final.md` — hook question, verse selection, segment arc, tone guidelines, literal illustration notes

**What to produce:** A complete 4-row Markdown table.

### Table Format

```markdown
| Seg | Timing  | Bloco         | Narração (TTS + overlay)       | Prompt de Vídeo (AI — 5s)                  |
|-----|---------|---------------|--------------------------------|--------------------------------------------|
| 1   | 0-5s    | HOOK          | {narration_text}               | {video_prompt}                             |
| 2   | 5-10s   | VERSE         | {narration_text}               | {video_prompt}                             |
| 3   | 10-15s  | ILLUSTRATION  | {narration_text}               | {video_prompt}                             |
| 4   | 15-20s  | CTA           | {narration_text}               | {video_prompt}                             |
```

---

### narration_text Rules (Pass A)

- Write naturally — don't worry about word count yet (Pass B handles that)
- Must be speakable as TTS audio AND readable as screen overlay in 5 seconds
- One idea per segment — no compound sentences
- Language: `channel_profile.language` (pt-BR for biblia-em-imagens)
- Follow tone from `01-concept-final.md`

### video_prompt Rules (Pass A)

- Describe exactly what appears on screen for those 5 seconds
- Format: `[subject/scene], [mood/lighting], [style], [movement], 5 seconds`
- Be SPECIFIC — not "peaceful scene" but "shepherd walking with flock of sheep through golden field at dusk"
- For biblia-em-imagens: prefer digital illustration / biblical painting style
- Each prompt must be self-contained (no reference to other segments)

---

### Segment-Specific Guidance

**SEG 1 — HOOK (0-5s)**

- `narration_text`: Use the hook question from `01-concept-final.md`
  - Must stop the scroll — first-person framing or direct relatable question
  - Good: "O que fazer quando a ansiedade não passa?" (12 words ✓)
  - Good: "A Bíblia descreve exatamente isso" (6 words ✓)
  - BLOCKED: "Você não vai acreditar no que a Bíblia diz" — sensationalism
- `video_prompt`: Scene that matches the emotional tone of the question
  - Should evoke the feeling behind the question, not illustrate the answer
  - Example for an anxiety question: "Person sitting alone by window at night, head bowed, dim warm light, introspective mood, digital illustration, 5 seconds"

**SEG 2 — VERSE (5-10s)**

- `narration_text`: Read the EXACT verse aloud
  - Include the reference at start or end: "Filipenses 4:6 —" + verse text
  - If verse is longer than ~12 words, quote the key portion + reference
  - Do NOT paraphrase — the verse text IS the narration
- `video_prompt`: Show the verse text prominently on screen
  - Simple, dignified background — dark background with golden text, or white with dark serif font
  - Large, legible font — verse text centered
  - Optional: soft animation (gentle glow, slow fade in)
  - NO complex imagery competing with the text
  - Example: "Bible verse text displayed centered on deep navy background, golden serif font, gentle glow animation, clean and reverent, 5 seconds"

**SEG 3 — ILLUSTRATION (10-15s)**

- `narration_text`: Describe what the verse shows — 1 line, no interpretation
  - Stay inside what the verse SAYS, not what it "means"
  - Good: "Deus guarda você como pastor guarda suas ovelhas" — echoes Ps 23:1
  - BLOCKED: "Isso significa que Deus nunca te abandona" — interpretation
  - BLOCKED: "O amor de Deus é incondicional" — theological summary
- `video_prompt`: Illustrate LITERALLY what the verse describes
  - Apply `bible_content_direction.core_principles.BCD_002`
  - If verse says "still waters" → show still waters, not "peace"
  - If verse says "I am with you always" → show a luminous presence beside a figure
  - If verse says "shepherd and sheep" → show shepherd and sheep specifically
  - Style: digital illustration, biblical painting style, cinematic lighting
  - Example: "Shepherd with staff walking alongside a flock of white sheep in a lush open valley, warm golden light, soft mist in background, biblical painting style, 5 seconds"

**SEG 4 — CTA (15-20s)**

- `narration_text`: Ask something SPECIFIC to this verse + this theme — NOT a fixed template
  - The CTA must feel like it was written only for this video, not copy-pasted
  - Connect the question to the emotional tension of Seg 1 (the hook question)
  - Ask about a SPECIFIC experience, memory, or feeling the verse evokes
  - Authentic, not pushy — "curious about you" framing
  - Good (anxiety + Fp 4:6): "Você já orou isso palavra por palavra? Comenta" (9 words ✓)
  - Good (solidão + Sl 23:4): "O que você sente quando lê 'eu sou contigo'?" (11 words ✓)
  - Good (força + Fp 4:13): "Em que momento esse versículo te sustentou?" (8 words ✓)
  - Acceptable fallback (use ONLY if no specific angle exists): "O que esse versículo significa pra você? Comenta" (9 words ✓)
  - BLOCKED: "Compartilha com seus amigos" — share request
  - BLOCKED: "Salva esse vídeo para quando precisar" — save request (in CTA block)
  - BLOCKED: "Esse versículo nos ensina que..." — explaining meaning for them
  - BLOCKED: CTA genérico que funcionaria para qualquer vídeo — deve ser específico ao versículo
- `video_prompt`: Warm, inviting close — NOT a sales frame
  - Person in prayer or reflection posture, peaceful mood
  - OR: close on the verse text with a warm color transition
  - Style: intimate, acolhedor, soft light

---

## Pass B — MrBeast Agent Brief

**Your role:** Editor and validator — sharpen every narration_text and validate every video_prompt.

**Input:** `03a-script-brunson.md`

**Do NOT change:**
- The 4-row structure (never add or remove segments)
- The verse text or Bible reference in Seg 2
- Block labels (HOOK, VERSE, ILLUSTRATION, CTA)

**DO change:**
- `narration_text`: cut to ≤12 words while preserving the core message
- `video_prompt`: make it specific if generic (see validation criteria below)
- CTA: ensure it asks for a comment, reject any share/save request

### narration_text Word Count Enforcement

For each segment, count the words. If > 12 words:
1. Identify the core message (1 idea)
2. Remove filler words, adverbs, connective clauses
3. Prefer active voice
4. Use short words over long equivalents
5. Preserve emotional impact and authenticity

**Sharpening examples:**

| Before (Pass A) | Words | After (Pass B) | Words |
|----------------|-------|---------------|-------|
| "O que você faz quando a ansiedade toma conta da sua vida?" | 13 | "O que fazer quando a ansiedade não passa?" | 8 ✓ |
| "Filipenses capítulo quatro versículo seis diz assim:" + long verse | 16+ | "Fp 4:6 — [verse portion, ≤12 words]" | ≤12 ✓ |
| "Isso nos mostra que Deus cuida de você como um bom pastor cuida do rebanho" | 15 | "Deus te guarda como pastor guarda suas ovelhas" | 8 ✓ |
| "Comenta aqui o que esse versículo significa pra você hoje" | 11 | "O que esse versículo significa pra você? Comenta" | 9 ✓ |

### video_prompt Validation

For each segment, check the video_prompt against:

| Segment | Required | Blocked |
|---------|----------|---------|
| HOOK | Scene matching emotional tone of the question | Generic abstract imagery |
| VERSE | Verse text prominent on screen, simple background | Complex imagery competing with text |
| ILLUSTRATION | Literal depiction of what the verse describes | Abstract symbol for what verse "means" |
| CTA | Warm, inviting, reflective mood | Sales-y frame, call-to-action graphic |

**Generic video_prompt red flags (rewrite if found):**
- "peaceful scene" → specify: "shepherd with sheep in valley at sunset"
- "spiritual imagery" → specify: "figure kneeling in beam of light inside stone chapel"
- "bible and candle" → too cliché; find the visual the verse actually describes
- "golden light" as the entire prompt → add subject, mood, movement

### CTA Validation (Seg 4)

| Criteria | Check |
|----------|-------|
| Asks viewer to comment | must be YES |
| Asks something specific (about this verse/theme) | must be YES |
| Contains "compartilha" or "share" | must be NO |
| Contains "salva" or "save" (in CTA) | must be NO |
| Explains the verse meaning for the viewer | must be NO |
| Feels authentic and not pushy | must be YES |

If CTA fails: rewrite `narration_text` with a specific comment prompt tied to the verse's personal resonance.

**CTA must vary per video.** A fixed "O que esse versículo significa pra você?" is a fallback, not a default.
Pass B must verify that the CTA is specific to the verse + theme combination — not generic across videos.

---

## 03-script-final.md Structure

```markdown
# Script Final — {task_name}

## Metadados
- **Canal:** {channel}
- **Tema:** {task_name from theme_brief}
- **Versículo:** {Livro Cap:Vers} — {texto do versículo}
- **Duração:** 20s (4 segmentos × 5s)
- **Idioma:** {channel_profile.language}
- **Formato:** TTS narração + AI video generation
- **Pass A por:** Russell Brunson Agent
- **Pass B por:** MrBeast Agent

## Tabela de Segmentos

| Seg | Timing  | Bloco         | Narração (TTS + overlay)       | Prompt de Vídeo (AI — 5s)                  |
|-----|---------|---------------|--------------------------------|--------------------------------------------|
| 1   | 0-5s    | HOOK          | ...                            | ...                                        |
| 2   | 5-10s   | VERSE         | ...                            | ...                                        |
| 3   | 10-15s  | ILLUSTRATION  | ...                            | ...                                        |
| 4   | 15-20s  | CTA           | ...                            | ...                                        |

## Validação QG-TK-004

| Check | Status |
|-------|--------|
| Total de segmentos | 4 ✓ |
| Duração total | 20s ✓ |
| Segmentos sem narration_text | 0 ✓ |
| Segmentos sem video_prompt | 0 ✓ |
| narration_text > 12 palavras | 0 ✓ |
| Seg 2 referência bíblica presente | ✓ |
| Seg 3 ilustração literal (não abstrata) | ✓ |
| CTA pede comentário (não share) | ✓ |
| CTA não explica o versículo | ✓ |

## Notas de Produção
- {any notes for the video editor or AI video generator}
- {any segments that required special visual treatment}
- {tone or pacing notes}
```

---

## Quality Gate: QG-TK-004

**Blocking:** YES

| Check | Pass Condition |
|-------|---------------|
| 03-script-final.md row count | Exactly 4 rows |
| narration_text | Present and non-empty in every row |
| video_prompt | Present, non-empty, and specific in every row |
| Word count per segment | Every narration_text has ≤ 12 words |
| Seg 1 block label | HOOK |
| Seg 2 block label | VERSE — narration contains verse reference + text |
| Seg 2 video_prompt | Shows verse text on screen (simple background) |
| Seg 3 block label | ILLUSTRATION — video_prompt depicts verse literally |
| Seg 4 block label | CTA |
| CTA narration | Asks viewer to comment something specific |
| CTA narration | Does NOT contain "compartilha", "share", "salva" (as action) |
| CTA narration | Does NOT explain verse meaning for the viewer |
| Total duration | 4 × 5s = 20s |

**On FAIL:** Identify the specific failing segment row(s). Fix only those rows in Pass B. Do not regenerate the full table.

---

## video_prompt Format Reference

Format for AI video generators (Runway, Kling, Sora, etc.):

```
[subject + action], [setting/environment], [mood/lighting], [style], [camera movement (optional)], 5 seconds
```

**Style defaults for biblia-em-imagens:**
- Primary: "digital illustration, biblical painting style, cinematic lighting"
- Mood options: "spiritual and awe-inspiring" | "serene and intimate" | "dramatic and reverent"
- Color palette: golden tones, deep blues, warm ambers, earthy olive
- Avoid: photorealistic human faces (uncanny valley), horror tones, modern settings for ancient scenes

**Examples by segment type:**

*HOOK — anxiety theme:*
```
Person sitting alone by candlelight in a small room, head bowed with hands clasped, warm dim light, introspective and vulnerable mood, digital illustration, static camera, 5 seconds
```

*VERSE — Filipenses 4:6:*
```
Bible verse text "Não andeies ansioso por coisa alguma..." displayed centered on deep navy background, golden serif font, gentle glow halo, clean and reverent, slow fade in, 5 seconds
```

*ILLUSTRATION — Salmo 23:2 ("deita-me em pastos verdejantes, guia-me mansamente"):*
```
Shepherd walking gently beside a flock of white sheep through a lush green valley, soft morning light, mist rising from ground, peaceful and pastoral mood, biblical painting style, slow pan, 5 seconds
```

*CTA:*
```
Soft close on an open Bible resting on a wooden table, warm candlelight, gentle glow, intimate and inviting mood, digital illustration, slight zoom out, 5 seconds
```
