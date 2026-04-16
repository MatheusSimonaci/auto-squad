# Task: Gerar Narração ElevenLabs

**Task ID:** TN-TP-002
**Executor:** agent (narrador) + worker (text-to-speech.js)
**Elicit:** true

---

## Objetivo

Transformar texto limpo em versão anotada com markup ElevenLabs + versão limpa para envio à API.
Opcionalmente gerar o MP3 chamando o script TTS existente.

---

## Input Necessário

1. **Texto da narração** — pode vir de `*copy` ou fornecido diretamente pelo user
2. **Gerar MP3?** — sim/não (se sim, precisa de ELEVENLABS_API_KEY no .env)
3. **Voice ID** (opcional) — padrão: Brian (`nPczCjzI2devNBz1zQrb`)

---

## Processo de Anotação

### PASSO 1: Análise do Texto

Leia o texto e identifique:
- Frases que pedem pausa dramática (após ponto final de frase curta)
- Palavras que precisam de ênfase (palavras-chave, números, contrastes)
- Momentos de ironia ou humor
- Transições de tom (sério → empolgado → reflexivo)

### PASSO 2: Aplicar Tags

Consultar `templates/elevenlabs-markup.md` para referência completa de tags.

**Tags disponíveis:**
- `[serio]` — tom declarativo, direto
- `[empolgado]` — alta energia, exclamação
- `[sarcastico]` — ironia via phrasing
- `[sussurro]` — intimidade, suave
- `[ri]` — antes de "hahaha", "kkk", "rsrs"
- `[enfase]` — CAPS na palavra seguinte
- `[pausa:0.5s]` — pausa curta
- `[pausa:1s]` — pausa dramática
- `[pausa:2s]` — pausa longa de impacto

**Critérios de uso:**
- Máximo 1 tag de tom por frase (não empilhar `[serio][enfase]` na mesma frase)
- `[pausa:1s]` após frases de alto impacto emocional
- `[pausa:0.5s]` após vírgulas de respiro
- Não anotar cada palavra — só os pontos que realmente mudam o tom

### PASSO 3: Gerar Versão ElevenLabs

Converter tags para envio à API:

| Tag | Conversão |
|-----|-----------|
| `[serio]`, `[empolgado]`, `[sarcastico]`, `[sussurro]`, `[ri]` | Remover tag (mantém texto) |
| `[enfase]` | Remover tag (mantém CAPS) |
| `[pausa:Xs]` | → `<break time="Xs"/>` |

---

## Output do Agente

```
[VERSÃO ANOTADA — para leitura]
{texto com tags visíveis}

---

[VERSÃO ELEVENLABS — para envio à API]
{texto limpo com apenas <break time="Xs"/>}

---
Palavras: {contagem}
Duração estimada: ~{X}s
```

---

## Se Gerar MP3 (opcional)

Após entregar o output de texto, chamar:

```bash
node integrations/elevenlabs/text-to-speech.js "{versao_elevenlabs}" "output/marketing-clones/{slug}.mp3"
```

Onde `{slug}` é o tema em kebab-case (ex: `disciplina-decision`, `tony-robbins-foco`).

**Validação pós-geração:**
- Arquivo existe em `output/marketing-clones/{slug}.mp3`? → Confirmar path para o user
- Arquivo gerado com sucesso → informar: "MP3 gerado em output/marketing-clones/{slug}.mp3 — use `*legendas` para gerar o SRT"

---

## Exemplos

### Input
```
Você disse que ia começar na segunda.
Segunda veio.
Você foi?
O problema não é a segunda. É você.
```

### Versão Anotada
```
[serio] Você disse que ia começar na segunda.
[pausa:0.5s] Segunda veio.
[pausa:1s] Você foi?
[serio] O problema não é a segunda. [pausa:0.5s] [enfase] É VOCÊ.
```

### Versão ElevenLabs
```
Você disse que ia começar na segunda.
<break time="0.5s"/> Segunda veio.
<break time="1s"/> Você foi?
O problema não é a segunda. <break time="0.5s"/> É VOCÊ.
```

---

## Veto Conditions

- Empilhar mais de 1 tag de tom por frase → corrigir antes de entregar
- Usar `[pausa:Xs]` em toda frase (vai soar mecânico) → só nos momentos de impacto
- Gerar MP3 sem verificar se `ELEVENLABS_API_KEY` está no .env → alertar o user primeiro
- Entregar só a versão ElevenLabs sem a versão anotada → sempre entregar as duas
