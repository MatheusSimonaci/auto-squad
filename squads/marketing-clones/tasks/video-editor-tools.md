---
task-id: video-editor-tools
name: Video Editor — Ferramentas Individuais
version: 1.0.0
workflow: wf-video-editing
phase: standalone
agent: marketing-agent (qualquer clone ativo)
elicit: false
estimated-time: 1-10 minutos por ferramenta
---

# Task: Video Editor — Ferramentas Individuais

## Objetivo

Expõe as funções de edição de vídeo de `edit-video.py` como subcomandos independentes.
Use quando precisar de apenas uma etapa do pipeline — sem executar o fluxo completo.
Para o pipeline completo (narração + legendas + concat + BGM), use `execute-video-editing.md`.

---

## Pré-condições

- [ ] `ffmpeg` >= 4.3 instalado e disponível no PATH (`ffmpeg -version`)
- [ ] Arquivos de input existem nos caminhos informados
- [ ] (apenas `burn-srt` com Whisper) `whisper` instalado: `pip install openai-whisper`

---

## Ferramentas Disponíveis

### 1. `burn-srt` — Gravar legenda de arquivo SRT externo

Grava legendas de um arquivo `.srt` fornecido manualmente **sem usar o Whisper**.
Útil quando você já tem o SRT pronto (gerado externamente ou editado manualmente).

```bash
python integrations/video-editor/edit-video.py burn-srt \
  --video "<VIDEO_PATH>" \
  --srt "<SRT_PATH>" \
  --output "<OUTPUT_PATH>" \
  --json
```

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| `--video` | Sim | Caminho do vídeo MP4 de entrada |
| `--srt` | Sim | Caminho do arquivo `.srt` |
| `--output` | Sim | Caminho do vídeo de saída (MP4) |
| `--json` | Não | Imprime resultado como JSON |

**Saída JSON:**
```json
{ "success": true, "output_path": "C:\\...\\out.mp4", "duration_seconds": 20.1, "timestamp": "..." }
```

---

### 2. `concat-transitions` — Concatenar vídeos com transições

Junta múltiplos MP4s com crossfade/xfade entre os clips.
**Requer re-encoding** (libx264 + aac). Para concatenação sem transição, use o pipeline completo.

```bash
python integrations/video-editor/edit-video.py concat-transitions \
  --videos "clip1.mp4" "clip2.mp4" "clip3.mp4" \
  --output "<OUTPUT_PATH>" \
  --transition xfade \
  --duration 0.5 \
  --json
```

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `--videos` | — | Lista de MP4s em ordem (separados por espaço) |
| `--output` | — | Caminho do vídeo de saída (MP4) |
| `--transition` | `xfade` | Tipo: `xfade`, `fade`, `wipeleft`, `wiperight`, `slideleft`, `slideright`, `circleopen` |
| `--duration` | `0.5` | Duração da transição em segundos |
| `--json` | — | Flag para saída JSON |

**Duração esperada do output:** `sum(durations) - (n_clips - 1) × transition_duration`

---

### 3. `add-timed-audio` — Inserir áudio em timestamps específicos

Insere efeitos sonoros, stings musicais ou trilhas em posições exatas do vídeo.
O áudio original do vídeo é preservado. A duração do vídeo **não é alterada**.

```bash
python integrations/video-editor/edit-video.py add-timed-audio \
  --video "<VIDEO_PATH>" \
  --clips '[{"path": "sfx1.mp3", "start_sec": 5.0}, {"path": "sting.mp3", "start_sec": 12.5, "volume": 0.6}]' \
  --output "<OUTPUT_PATH>" \
  --mix-volume 1.0 \
  --json
```

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `--video` | — | Vídeo de entrada (MP4) |
| `--clips` | — | JSON array de clips (ver formato abaixo) |
| `--output` | — | Vídeo de saída (MP4) |
| `--mix-volume` | `1.0` | Volume do áudio original do vídeo (0.0–1.0) |
| `--json` | — | Flag para saída JSON |

**Formato de `--clips`:**
```json
[
  { "path": "C:\\sfx\\whoosh.mp3", "start_sec": 2.0 },
  { "path": "C:\\sfx\\sting.mp3", "start_sec": 10.0, "volume": 0.6 }
]
```

> ⚠️ **Windows / quoting:** Em shells Windows, use um arquivo JSON temporário para evitar problemas com aspas duplas:
> ```bash
> echo [{"path":"sfx.mp3","start_sec":5.0}] > clips.json
> python edit-video.py add-timed-audio --video v.mp4 --clips "$(cat clips.json)" --output out.mp4
> ```

**Saída JSON:**
```json
{ "success": true, "output_path": "...", "duration_seconds": 20.1, "clips_inserted": 2, "timestamp": "..." }
```

---

### 4. `mix-bgm` — Cortar BGM e mixar no vídeo (em uma passagem)

Corta a música de fundo para a **duração exata do vídeo** e mixa com o áudio existente.
A BGM é loopada automaticamente se for mais curta que o vídeo.
O vídeo original não é re-encodado (`-c:v copy`).

```bash
python integrations/video-editor/edit-video.py mix-bgm \
  --video "<VIDEO_PATH>" \
  --bgm "<BGM_PATH>" \
  --output "<OUTPUT_PATH>" \
  --bgm-volume 0.20 \
  --json
```

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `--video` | — | Vídeo de entrada (MP4) |
| `--bgm` | — | Música de fundo (MP3/M4A) |
| `--output` | — | Vídeo de saída (MP4) |
| `--bgm-volume` | `0.20` | Volume da BGM (0.0–1.0) — 20% é o padrão suave |
| `--json` | — | Flag para saída JSON |

**Saída JSON:**
```json
{ "success": true, "output_path": "...", "duration_seconds": 20.1, "bgm_volume": 0.2, "timestamp": "..." }
```

---

## Quality Gate: QG-VE-TOOLS-001

| Check | Condição de Aprovação |
|-------|----------------------|
| Exit code | `0` (sem erros) |
| Output existe | Arquivo gerado no caminho de `output_path` |
| JSON válido | `"success": true` no stdout ao usar `--json` |
| Duração razoável | `duration_seconds > 0` |

---

## Tratamento de Erros

| Erro | Ação |
|------|------|
| `ffmpeg: command not found` | Instalar FFmpeg: https://ffmpeg.org/download.html |
| `xfade` não suportado | Verificar versão do FFmpeg (`ffmpeg -version` — requer >= 4.3) |
| Arquivo de input ausente | Verificar caminhos e existência dos arquivos antes de invocar |
| JSON inválido em `--clips` | Verificar sintaxe do JSON; usar arquivo temporário em Windows |
| `success: false` no JSON | Ler campo `error` para diagnóstico e corrigir antes de retentar |
