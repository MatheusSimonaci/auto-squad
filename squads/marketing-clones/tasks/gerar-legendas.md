# Task: Gerar Legendas SRT Word-by-Word

**Task ID:** TN-TP-003
**Executor:** agent (narrador)
**Elicit:** true

---

## Objetivo

Gerar arquivo SRT com legenda palavra-por-palavra (ou 2 palavras curtas juntas) a partir do texto de narração.
Output compatível com importação direta no **CapCut**.

---

## Input Necessário

1. **Texto da narração** — texto limpo (sem tags de markup)
   - Pode vir de `*copy` ou `*narracao` (versão anotada → o agente faz o strip)
2. **Duração total do áudio** — em segundos
   - Se user já gerou o MP3 via `*narracao` → pedir a duração
   - Se não souber → estimar: `palavras / 2.5` (palavras por segundo PT-BR)
   - Se MP3 existe → sugerir: `ffprobe -i arquivo.mp3 -show_entries format=duration -v quiet -of csv="p=0"`

---

## Processo de Geração

### PASSO 1: Limpar o Texto

Remover do texto antes de processar:
- Tags de markup: `[ri]`, `[serio]`, `[empolgado]`, `[sarcastico]`, `[sussurro]`, `[enfase]`, `[pausa:Xs]`
- Tags ElevenLabs: `<break time="Xs"/>`
- Normalizar espaços múltiplos → um espaço

### PASSO 2: Tokenizar em Palavras

Separar o texto em tokens mantendo pontuação grudada na palavra:
```
"Você tem 24 horas. Iguais às do Elon."
→ ["Você", "tem", "24", "horas.", "Iguais", "às", "do", "Elon."]
```

### PASSO 3: Aplicar Regras de Agrupamento

Consultar `templates/srt-word-by-word.md` para referência completa.

**Regra principal:** 1 palavra por entrada SRT

**Exceção:** Agrupe 2 palavras quando soma de caracteres (sem acento, sem pontuação) ≤ 5:
```
Calcular: len(normalizar(p1)) + len(normalizar(p2))
normalizar = remove acentos, remove pontuação, lowercase

Exemplos:
"às do"  → "as" + "do"  = 2 + 2 = 4 → AGRUPA
"E aí"   → "e" + "ai"   = 1 + 2 = 3 → AGRUPA
"Não é"  → "nao" + "e"  = 3 + 1 = 4 → AGRUPA
"De vez" → "de" + "vez" = 2 + 3 = 5 → AGRUPA
"Por que"→ "por"+ "que" = 3 + 3 = 6 → SEPARA
"Você já"→ "voce"+"ja"  = 4 + 2 = 6 → SEPARA
```

### PASSO 4: Calcular Timing Proporcional

```
# Calcular total de caracteres (normalizados, sem acentos)
total_chars = soma de len(normalizar(palavra)) para cada entrada

# Tempo base por caractere
tempo_por_char = duracao_total / total_chars

# Tempo de cada entrada
tempo_entrada = len(normalizar(entrada)) * tempo_por_char

# Adicionar micro-pausa por pontuação (na entrada que contém)
"." → +0.3s
"," → +0.2s
"..." → +0.5s
"!" → +0.1s
"?" → +0.2s

# Aplicar limites
tempo_entrada = max(0.2, min(1.5, tempo_entrada))
```

### PASSO 5: Gerar Timestamps

```
inicio = 0.0
para cada entrada:
    fim = inicio + tempo_entrada
    formatar: HH:MM:SS,mmm
    inicio = fim
```

Formatar segundos para SRT:
```
segundos_para_srt(s):
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    seg = s % 60
    retorna f"{h:02d}:{m:02d}:{seg:06.3f}".replace(".", ",")
```

---

## Formato de Output

```
1
00:00:00,000 --> 00:00:00,380
Você

2
00:00:00,380 --> 00:00:00,620
tem

3
00:00:00,620 --> 00:00:01,050
24

4
00:00:01,050 --> 00:00:01,580
horas.

5
00:00:01,580 --> 00:00:02,200
Iguais

6
00:00:02,200 --> 00:00:02,580
às do

7
00:00:02,580 --> 00:00:03,100
Elon.
```

---

## Exemplo Completo

**Input:**
```
Texto: "Você disse que ia começar na segunda. Segunda veio. Você foi?"
Duração: 7 segundos
```

**Tokenização + agrupamento:**
```
["Você", "disse", "que", "ia", "começar", "na", "segunda.", "Segunda", "veio.", "Você", "foi?"]
# "que ia" → "que"=3 + "ia"=2 = 5 → AGRUPA
→ ["Você", "disse", "que ia", "começar", "na", "segunda.", "Segunda", "veio.", "Você", "foi?"]
```

**SRT gerado:**
```
1
00:00:00,000 --> 00:00:00,350
Você

2
00:00:00,350 --> 00:00:00,680
disse

3
00:00:00,680 --> 00:00:01,000
que ia

4
00:00:01,000 --> 00:00:01,480
começar

5
00:00:01,480 --> 00:00:01,700
na

6
00:00:01,700 --> 00:00:02,250
segunda.

7
00:00:02,250 --> 00:00:02,800
Segunda

8
00:00:02,800 --> 00:00:03,250
veio.

9
00:00:03,250 --> 00:00:03,600
Você

10
00:00:03,600 --> 00:00:04,100
foi?
```

---

## Instrução de Entrega ao User

```
[SRT PRONTO — copie e salve como arquivo .srt]

{conteúdo SRT}

---
Entradas: {total}
Duração coberta: {X}s
Encoding: UTF-8

Como importar no CapCut:
1. Salve o conteúdo acima como "legenda.srt" (encoding UTF-8)
2. No CapCut: Texto > Importar > Arquivo SRT
3. Ajuste estilo de fonte se necessário
```

---

## Veto Conditions

- Gerar SRT sem saber a duração do áudio → estimar ou perguntar, NUNCA inventar timing arbitrário
- Não fazer o strip das tags de markup antes de processar → texto com `[serio]` na legenda é inválido
- Entradas com duração < 0.2s → aumentar para 0.2s mínimo
- Entradas com duração > 1.5s → palavra muito longa/isolada, revisar agrupamento
- Entregar sem a instrução de importação do CapCut → sempre incluir
