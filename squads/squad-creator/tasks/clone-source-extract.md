# Task: Clone Source Extract — Aquisição de Fontes

**Task ID:** clone-source-extract
**Execution Type:** Agent + Scripts
**Model:** Haiku
**Model Rationale:** "Execução mecânica de scripts — download de transcripts, leitura de arquivos, geração de manifesto. Sem síntese ou julgamento necessários."
**Haiku Eligible:** YES — trabalho de execução pura, não de raciocínio
**Purpose:** Executar o plano de pesquisa produzido por `clone-research-plan.md`: baixar transcripts do YouTube, ler arquivos locais, e produzir os arquivos de texto bruto que alimentam a síntese PREHD/Frameworks/PSR
**Orchestrator:** wf-create-clone.yaml (PHASE-3)
**Used By:** `*create-clone` command in squad-chief
**Skill Reference:** `C:\Users\Pichau\Downloads\AI\Obsidian\skills\skills\youtube-transcript-downloader\SKILL.md`

> **Nota:** Esta task NÃO sintetiza nem analisa conteúdo.
> Apenas extrai texto bruto e o salva em arquivos específicos.
> A síntese acontece na PHASE-4 (clone-research.md, Sonnet).

---

## PRÉ-CONDIÇÕES OBRIGATÓRIAS

```
[ ] squads/{squad_destination}/.clones/{slug}/research-plan.yaml existe (produzido por PHASE-2)
[ ] Campos obrigatórios presentes: person, domain, youtube_to_download, prehd_source_mapping
[ ] squad_destination e slug conhecidos (vindos de PHASE-1)
```

**VETO:** Se `research-plan.yaml` estiver ausente → BLOQUEAR e solicitar execução de `clone-research-plan.md` primeiro.

**Convenção de paths (TODOS os artefatos deste clone vivem sob a mesma raiz):**

```
CLONE_ROOT="squads/{squad_destination}/.clones/{slug}"
RAW_SOURCES_DIR="${CLONE_ROOT}/raw-sources"
MANIFEST_PATH="${CLONE_ROOT}/source-manifest.yaml"
```

Defina essas variáveis no início da execução e use-as em todos os comandos abaixo.

---

## PRIORIDADE DE EXECUÇÃO

**SEMPRE processar nesta ordem:**

1. **Materiais locais PRIMEIRO** — fontes primárias fornecidas pelo usuário, mais confiáveis
2. **YouTube por prioridade:**
   - P1: Entrevistas (priority: 1)
   - P2: Lives (priority: 2)
   - P3: Palestras (priority: 3)
   - P4: Vídeos gerais (priority: 4)

**Regra de parada:** Parar quando total de palavras extraídas superar ~50.000. Registrar no manifesto.

---

## FASE A: Verificar e Instalar yt-dlp

```bash
# Verificar instalação (compatível com Windows/Git Bash e Unix)
if ! command -v yt-dlp &> /dev/null; then
    echo "yt-dlp não encontrado. Instalando via pip..."
    pip3 install yt-dlp
    # Alternativa se pip3 falhar:
    # python3 -m pip install yt-dlp
fi

# Verificar versão
yt-dlp --version
```

Se instalação falhar → reportar no manifesto como `install_failed: true` e continuar sem YouTube.

---

## FASE B: Criar Diretório de Saída

```bash
# CLONE_ROOT = squads/{squad_destination}/.clones/{slug}
mkdir -p "${RAW_SOURCES_DIR}"
```

---

## FASE C: Processar Arquivos Locais

Para cada entrada em `local_files_to_read` do `${CLONE_ROOT}/research-plan.yaml`, executar na ordem de prioridade:

### Para arquivos .txt e .md:

Ler diretamente com a ferramenta Read do Claude Code. Salvar como:
```
${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt
```

### Para arquivos .pdf:

```bash
# Tentar pdftotext primeiro
if command -v pdftotext &> /dev/null; then
    pdftotext "{caminho_do_arquivo}" "${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt"
else
    # Fallback: python3 com PyPDF2 ou pdfminer
    python3 -c "
try:
    import PyPDF2
    with open('{caminho_do_arquivo}', 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    with open('${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt', 'w', encoding='utf-8') as out:
        out.write(text)
    print('OK: {output_slug}')
except ImportError:
    print('FALLBACK: PyPDF2 nao instalado. Tentando pdfminer...')
    import subprocess
    subprocess.run(['pip3', 'install', 'pdfminer.six'], check=False)
    from pdfminer.high_level import extract_text
    text = extract_text('{caminho_do_arquivo}')
    with open('${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt', 'w', encoding='utf-8') as out:
        out.write(text)
    print('OK via pdfminer: {output_slug}')
except Exception as e:
    print(f'FALHA: {e}')
"
fi
```

### Para arquivos .docx:

```bash
python3 -c "
try:
    import docx
    doc = docx.Document('{caminho_do_arquivo}')
    text = '\n'.join(para.text for para in doc.paragraphs)
    with open('${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt', 'w', encoding='utf-8') as out:
        out.write(text)
    print('OK: {output_slug}')
except ImportError:
    import subprocess
    subprocess.run(['pip3', 'install', 'python-docx'], check=False)
    import docx
    doc = docx.Document('{caminho_do_arquivo}')
    text = '\n'.join(para.text for para in doc.paragraphs)
    with open('${RAW_SOURCES_DIR}/local-{priority}-{output_slug}.txt', 'w', encoding='utf-8') as out:
        out.write(text)
    print('OK: {output_slug}')
except Exception as e:
    print(f'FALHA: {e}')
"
```

**Em caso de falha na leitura:** Registrar como `failed` no manifesto. Nunca bloquear o pipeline por um arquivo local inacessível.

---

## FASE D: Download de Transcripts YouTube

### D1 — Para URLs Diretas (fornecidas pelo usuário)

Processar em ordem de prioridade (priority: 1 antes de 2, etc.):

```bash
URL="{query_or_url}"
OUTPUT_SLUG="{output_slug}"
OUTPUT_DIR="${RAW_SOURCES_DIR}"

# Passo 1: Tentar legendas manuais
if yt-dlp --write-sub --skip-download \
   --output "${OUTPUT_DIR}/tmp_${OUTPUT_SLUG}" \
   --quiet "${URL}" 2>/dev/null; then
    echo "OK (manual): ${OUTPUT_SLUG}"
    DOWNLOADED=true
else
    # Passo 2: Fallback para auto-geradas
    if yt-dlp --write-auto-sub --skip-download \
       --output "${OUTPUT_DIR}/tmp_${OUTPUT_SLUG}" \
       --quiet "${URL}" 2>/dev/null; then
        echo "OK (auto): ${OUTPUT_SLUG}"
        DOWNLOADED=true
    else
        echo "SEM LEGENDA: ${OUTPUT_SLUG} — registrar como failed"
        DOWNLOADED=false
    fi
fi

# Passo 3: Converter VTT → TXT limpo (se download OK)
if [ "$DOWNLOADED" = "true" ]; then
    VTT_FILE=$(ls ${OUTPUT_DIR}/tmp_${OUTPUT_SLUG}*.vtt 2>/dev/null | head -n 1)
    if [ -f "$VTT_FILE" ]; then
        python3 -c "
import sys, re
seen = set()
with open('${VTT_FILE}', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('WEBVTT') and not line.startswith('Kind:') and not line.startswith('Language:') and '-->' not in line:
            clean = re.sub('<[^>]*>', '', line)
            clean = clean.replace('&amp;', '&').replace('&gt;', '>').replace('&lt;', '<')
            if clean and clean not in seen:
                print(clean)
                seen.add(clean)
" > "${OUTPUT_DIR}/${OUTPUT_SLUG}.txt"
        rm "$VTT_FILE"
        echo "Salvo: ${OUTPUT_DIR}/${OUTPUT_SLUG}.txt"
    fi
fi
```

**IMPORTANTE:** NÃO usar Whisper em modo automatizado (muito lento para pipeline). Se não houver legendas, registrar como `failed` e continuar.

### D2 — Para Queries de Busca (sem URL direta)

```bash
QUERY="{query_or_url}"
PRIORITY="{priority}"
OUTPUT_SLUG="{output_slug}"
MIN_DURATION="{min_duration_sec}"
MAX_RESULTS="{max_results}"

# Buscar vídeos e filtrar por duração mínima
echo "Buscando: ${QUERY}"
yt-dlp "ytsearch${MAX_RESULTS}:${QUERY}" \
    --flat-playlist \
    --print "%(url)s %(duration)s %(title)s" \
    2>/dev/null | while IFS=' ' read -r url duration title; do
    if [ "$duration" -ge "$MIN_DURATION" ] 2>/dev/null; then
        echo "CANDIDATO: ${title} (${duration}s) — ${url}"
    fi
done > /tmp/yt_candidates_${OUTPUT_SLUG}.txt

# Pegar os 2 melhores candidatos e baixar transcripts
head -n 2 /tmp/yt_candidates_${OUTPUT_SLUG}.txt | while read -r line; do
    URL=$(echo "$line" | awk '{print $2}')
    SLUG="${OUTPUT_SLUG}_$(echo $URL | md5sum | head -c 6)"
    # Executar mesmo script de download da seção D1 com $URL e $SLUG
done
```

---

## FASE E: Gerar Manifesto de Fontes

Após processar todas as fontes, gerar `${MANIFEST_PATH}` (= `squads/{squad_destination}/.clones/{slug}/source-manifest.yaml`):

```yaml
# source-manifest.yaml
# Gerado por: clone-source-extract.md (PHASE-3)
# Localização: squads/{squad_destination}/.clones/{slug}/source-manifest.yaml
person: "{person_name}"
domain: "{domain}"
total_sources: {N}
total_word_count: {N}
threshold_reached: false  # true se parou por atingir ~50k palavras

sources_extracted:
  local:
    - file: "local-1-{slug}.txt"
      original_path: "..."
      type: "book"
      word_count: {N}
      status: "ok"
    # ...

  youtube:
    - file: "yt-1-interview-{slug}.txt"
      original_url: "..."
      type: "interview"
      priority: 1
      word_count: {N}
      status: "ok"
    # ...

failed:
  - source: "..."
    reason: "no_subtitles | file_unreadable | download_error"
  # ...
```

Calcular word_count de cada arquivo:
```bash
wc -w "${RAW_SOURCES_DIR}/{arquivo}.txt"
```

---

## FASE F: Relatório Final

Exibir resumo para o agente orquestrador:

```
=== PHASE-3 COMPLETO ===
Fontes extraídas: {N}
  - Locais: {N} arquivos ({total_words_local} palavras)
  - YouTube: {N} vídeos ({total_words_youtube} palavras)
Total: {total_words} palavras

Falhas: {N_failed}
  - {source}: {reason}

Pronto para PHASE-4 (síntese Sonnet)
```

---

## Checkpoint PHASE-3

- [ ] `squads/{squad_destination}/.clones/{slug}/source-manifest.yaml` gerado
- [ ] Pelo menos 1 arquivo em `squads/{squad_destination}/.clones/{slug}/raw-sources/` com conteúdo
- [ ] Materiais locais processados antes do YouTube
- [ ] YouTube processado em ordem de prioridade (1→2→3→4)
- [ ] Falhas documentadas no manifesto (nunca silenciadas)
- [ ] Nenhum conteúdo sintetizado ou analisado aqui

---

*Task: clone-source-extract | wf-create-clone.yaml PHASE-3 | Squad Creator — AIOX*
