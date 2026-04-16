---
task-id: execute-video-editing
name: Execute Video Editing
version: 1.0.0
workflow: wf-video-editing
phase: 1
agent: marketing-agent (qualquer clone ativo)
elicit: false
estimated-time: 5-15 minutes
---

# Task: Execute Video Editing

## Objetivo

Processar os assets de vídeo de uma tarefa do ClickUp em estágio **EDIÇÃO**:
adicionar legendas automáticas, combinar narrações, concatenar cenas e mixar trilha sonora.
Ao final, documentar o resultado na tarefa e movê-la para **PUBLICAÇÃO**.

---

## Pré-condições

- [ ] `ffmpeg` instalado e disponível no PATH (`ffmpeg -version`)
- [ ] `CLICKUP_API_KEY` configurada no `.env`
- [ ] Arquivos `parteN.mp4` e `parteN.mp3` presentes na pasta `assets/`
- [ ] Arquivo de música de fundo acessível

---

## Inputs Esperados do Agente

Todos os parâmetros de edição já estão na **descrição da tarefa ClickUp** — não é necessário receber nada do usuário. O agente extrai automaticamente:

```
vídeos das 4 cenas: arquivos em mp4 parte1, parte2, parte3 e parte4 da pasta: <ASSETS_DIR>
parte sem legenda: <PARTE(S)>
música de fundo: <BGM_PATH>
```

E do bloco de script (tabela), o texto de narração de cada segmento:

```
Seg 1 — Narração (TTS + overlay): <TEXTO_PARTE1>
Seg 2 — Narração (TTS + overlay): <TEXTO_PARTE2>
Seg 3 — Narração (TTS + overlay): <TEXTO_PARTE3>
Seg 4 — Narração (TTS + overlay): <TEXTO_PARTE4>
```

---

## Execução

### Passo 0 — Buscar tarefa EDIÇÃO no ClickUp e extrair todos os parâmetros

```bash
node integrations/clickup/get-last-edicao-task.js <LIST_ID> --json
```

O JSON retornado contém o campo `description` com **todos os parâmetros de edição e o texto de narração**. Extrair:

| Parâmetro | Campo na descrição | Exemplo |
|-----------|-------------------|---------|
| `TASK_ID` | `id` do JSON | `86agbyhpk` |
| `ASSETS_DIR` | linha `"vídeos das 4 cenas: ... da pasta: <PATH>"` | `C:\...\assets` |
| `NO_SUBTITLE` | linha `"parte sem legenda: <PARTE>"` | `parte3` |
| `BGM_PATH` | linha `"música de fundo: <PATH>"` | `C:\...\CM_03 A Long Life.mp3` |
| `PARTS` | partes listadas na linha de vídeos | `parte1 parte2 parte3 parte4` |
| `OUTPUT_PATH` | `<ASSETS_DIR>\final.mp4` (padrão) | `C:\...\assets\final.mp4` |
| `NARRATION_TEXTS` | coluna "Narração (TTS + overlay)" da tabela de script | `{"parte1": "...", "parte2": "..."}` |

**Exemplo de saída do script:**
```json
{
  "id": "86agbyhpk",
  "name": "o que a bíblia diz sobre dinheiro?",
  "slug": "o-que-a-biblia-diz-sobre-dinheiro",
  "url": "https://app.clickup.com/t/86agbyhpk",
  "status": "edição",
  "description": "...(contém todos os params acima)..."
}
```

**Como extrair NARRATION_TEXTS:** A tabela de script na descrição tem o formato `[table-embed:...]` com células `Narração (TTS + overlay)` por segmento. Mapear segmento 1 → `parte1`, segmento 2 → `parte2`, etc.

Se retornar `{ "error": "..." }`, parar e reportar ao usuário.

---

### Passo 1 — Executar o editor de vídeo

Usar os parâmetros extraídos no Passo 0. O flag `--narration-texts` recebe o JSON com os textos de narração por parte — sem Whisper, sem transcrição automática.

```bash
python integrations/video-editor/edit-video.py \
  --assets-dir "<ASSETS_DIR>" \
  --parts parte1 parte2 parte3 parte4 \
  --no-subtitle <NO_SUBTITLE_PARTS> \
  --bgm "<BGM_PATH>" \
  --output "<OUTPUT_PATH>" \
  --narration-texts '{"parte1": "<TEXTO1>", "parte2": "<TEXTO2>", "parte4": "<TEXTO4>"}' \
  --json
```

> **Nota:** Incluir em `--narration-texts` apenas as partes que **receberão legenda** (excluir as que estão em `--no-subtitle`). As partes em `--no-subtitle` são ignoradas pelo pipeline de legendas automaticamente.

Capturar o JSON de saída. Exemplo de saída com sucesso:

```json
{
  "success": true,
  "output_path": "C:\\...\\assets\\final.mp4",
  "duration_seconds": 20.1,
  "parts_with_subtitles": ["parte1", "parte2", "parte4"],
  "parts_without_subtitles": ["parte3"],
  "timestamp": "2026-03-23T14:30:00"
}
```

Se `success: false`, registrar o erro e parar.

---

### Passo 2 — Documentar resultado no ClickUp

Construir markdown do resultado e anexar à tarefa:

```bash
node integrations/clickup/append-description.js <TASK_ID> "## Resultado da Edição

- **Status:** ✅ Concluído com sucesso
- **Vídeo final:** \`<OUTPUT_PATH>\`
- **Duração:** <DURATION>s
- **Partes com legenda:** <PARTS_WITH_SUBS>
- **Partes sem legenda:** <PARTS_WITHOUT_SUBS>
- **Data:** <TIMESTAMP>
- **URL de acesso:** file://<OUTPUT_PATH>"
```

Em caso de falha no Passo 2, documentar o erro:

```bash
node integrations/clickup/append-description.js <TASK_ID> "## Resultado da Edição

- **Status:** ❌ Falha na edição
- **Erro:** <ERROR_MESSAGE>
- **Data:** <TIMESTAMP>
- **Ação necessária:** Verificar assets e reexecutar"
```

---

### Passo 3 — Mover tarefa para PUBLICAÇÃO

Somente se Passo 1 foi bem-sucedido:

```bash
node integrations/clickup/move-next-stage.js <TASK_ID>
```

Confirmar na saída que a tarefa foi movida para **PUBLICAÇÃO**.

---

## Critérios de Aceitação

- [ ] `final.mp4` criado no `OUTPUT_PATH` com duração ~20s
- [ ] Partes com legenda possuem texto sobreposto visível (texto exato do card)
- [ ] Partes em `no_subtitle` não possuem legenda
- [ ] Trilha sonora de fundo presente no vídeo final (volume suave)
- [ ] Tarefa ClickUp atualizada com resultado documentado
- [ ] Tarefa movida para grupo PUBLICAÇÃO
- [ ] Toda a execução (passo 0→3) concluída sem erros críticos

---

## Tratamento de Erros

| Erro | Ação |
|------|------|
| `ffmpeg` não encontrado | Orientar instalação: https://ffmpeg.org/download.html |
| `--narration-texts` JSON inválido | Verificar parsing da tabela de script do card |
| Arquivo MP3/MP4 ausente | Verificar se TTS e geração de vídeo foram executados |
| ClickUp API erro 401 | Verificar `CLICKUP_API_KEY` no `.env` |
| Nenhuma tarefa em EDIÇÃO | Verificar ClickUp e confirmar que tarefa existe no grupo correto |
| Tarefa já em PUBLICAÇÃO | Não mover novamente; só documentar |
