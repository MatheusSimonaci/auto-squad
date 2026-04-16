# SRT Word-by-Word — Regras & Formato

Template e regras para geração de legendas TikTok word-by-word compatíveis com CapCut.

---

## Formato SRT Padrão

```
{número}
{HH:MM:SS,mmm} --> {HH:MM:SS,mmm}
{texto}

```

**Requisitos:**
- Encoding: **UTF-8** (preserva acentos PT-BR: á, ã, ç, é, ô, etc.)
- Linha em branco entre cada entrada
- Numeração sequencial começando em 1

---

## Regras de Agrupamento (TikTok Style)

### Regra Principal: 1 palavra por entrada
```
1
00:00:00,000 --> 00:00:00,400
Você

2
00:00:00,400 --> 00:00:00,800
tem
```

### Exceção: 2 palavras juntas
Agrupe 2 palavras quando a **soma de caracteres (sem espaço) ≤ 5**:

```python
# Exemplos de agrupamento
"E aí"     → soma = 1+2 = 3  → AGRUPA  ✓
"De vez"   → soma = 2+3 = 5  → AGRUPA  ✓
"Eu já"    → soma = 2+2 = 4  → AGRUPA  ✓
"Não é"    → soma = 3+1 = 4  → AGRUPA  ✓
"Por que"  → soma = 3+3 = 6  → SEPARA  ✗
"Você já"  → soma = 4+2 = 6  → SEPARA  ✗
"Sua vida" → soma = 3+4 = 7  → SEPARA  ✗
```

**Cálculo:** conte apenas letras, ignore acentos para o cálculo (á=a, ç=c, etc.)

---

## Cálculo de Timing

### Timing proporcional (não uniforme)
Distribua o tempo proporcionalmente ao número de caracteres de cada palavra:

```
total_chars = soma de todos os chars do texto
tempo_por_char = duracao_total / total_chars
tempo_palavra = len(palavra) * tempo_por_char
```

### Micro-pausa em pontuação
Adicione tempo extra ao encontrar pontuação:
- `.` → +0.3s
- `,` → +0.2s
- `...` → +0.5s
- `!` → +0.1s
- `?` → +0.2s

### Timing mínimo e máximo por entrada
- Mínimo: **0,2s** por entrada (evita flash muito rápido)
- Máximo: **1,5s** por entrada (evita palavra parada por muito tempo)

---

## Exemplo Completo

**Texto de input:**
```
Você tem 24 horas. Iguais às do Elon Musk.
```

**Duração total do áudio:** 8 segundos

**SRT gerado:**
```
1
00:00:00,000 --> 00:00:00,350
Você

2
00:00:00,350 --> 00:00:00,600
tem

3
00:00:00,600 --> 00:00:01,000
24

4
00:00:01,000 --> 00:00:01,450
horas.

5
00:00:01,450 --> 00:00:02,100
Iguais

6
00:00:02,100 --> 00:00:02,450
às do

7
00:00:02,450 --> 00:00:03,000
Elon

8
00:00:03,000 --> 00:00:03,600
Musk.
```

*(Note: "às do" agrupadas porque soma = 2+2 = 4 ≤ 5)*

---

## Pré-processamento do Texto

Antes de gerar o SRT, o agente deve:

1. **Strip de tags de markup** — remover `[ri]`, `[pausa:Xs]`, `[sarcastico]`, etc.
2. **Strip de `<break time="Xs"/>`** — remover tags ElevenLabs
3. **Normalizar espaços** — múltiplos espaços → um espaço
4. **Manter pontuação** — `.`, `,`, `!`, `?`, `...` ficam grudados na palavra anterior
5. **Manter acentos** — UTF-8 preserva `á`, `ã`, `ç`, `é`, `ô`, etc.

---

## Quando a Duração do Áudio não é Conhecida

Se o usuário não informou a duração do MP3:

1. **Estimar pela contagem de palavras:**
   ```
   duracao_estimada = total_palavras / 2.5  (palavras por segundo PT-BR)
   ```
2. **Pedir ao usuário** a duração do arquivo gerado
3. **Calcular pelo ffprobe** se o MP3 já existe:
   ```bash
   ffprobe -i arquivo.mp3 -show_entries format=duration -v quiet -of csv="p=0"
   ```

---

## Compatibilidade CapCut

- Formato SRT padrão importa diretamente: **Texto > Importar > SRT**
- UTF-8 sem BOM (CapCut lê corretamente)
- Cada entrada SRT = um texto separado na timeline
- O CapCut aplica o estilo de fonte automaticamente a todas as entradas

---

## Output do Agente

O agente entrega:

### 1. Conteúdo SRT (para copiar/colar ou salvar como .srt)
```
1
00:00:00,000 --> 00:00:00,350
Você

2
...
```

### 2. Instrução de salvamento
```
Salve como: legenda-{slug}.srt
Encoding: UTF-8
Import no CapCut: Texto > Importar > Arquivo SRT
```
