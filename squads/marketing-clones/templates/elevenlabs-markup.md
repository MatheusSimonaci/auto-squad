# ElevenLabs Markup — Referência de Tags

Sistema de anotação em duas camadas para narração TikTok com ElevenLabs.

---

## Como Funciona

O ElevenLabs `eleven_multilingual_v2` não aceita tags customizadas como SSML literal.
Mas interpreta texto natural e expressões. A solução é um sistema de **duas camadas**:

```
[Camada Autor]          [Camada ElevenLabs]
Tag legível    →   →   Texto natural que o modelo interpreta
[ri] hahaha        →   hahaha  (o modelo ri naturalmente)
[pausa:1s]         →   <break time="1s"/>  (única tag suportada)
[enfase] NUNCA     →   NUNCA   (caps = ênfase natural)
```

---

## Tabela de Tags

| Tag (você escreve) | O que a API recebe | Efeito na narração |
|--------------------|-------------------|-------------------|
| `[ri]` | Remove tag, mantém "hahaha"/"kkk" | Narrador ri naturalmente |
| `[sarcastico]` | Remove tag, phrasing irônico | Tom irônico via contexto |
| `[pausa:0.5s]` | `<break time="0.5s"/>` | Pausa curta (hesitação) |
| `[pausa:1s]` | `<break time="1s"/>` | Pausa dramática |
| `[pausa:2s]` | `<break time="2s"/>` | Pausa longa (impacto) |
| `[sussurro]` | Remove tag, frases curtas e suaves | Tom mais baixo, intimidade |
| `[empolgado]` | Remove tag, exclamação natural | Alta energia, acelerado |
| `[serio]` | Remove tag, tom declarativo | Flat, direto, sem enfeite |
| `[enfase]` | CAPS na palavra seguinte | Palavra destacada |

---

## Exemplos de Uso

### Curto (12s)
```
[serio] Você tem 24 horas. [pausa:0.5s] Iguais às do Elon Musk. [pausa:1s] O que você faz com elas?
```
**API recebe:**
```
Você tem 24 horas. <break time="0.5s"/> Iguais às do Elon Musk. <break time="1s"/> O que você faz com elas?
```

---

### Com humor/ironia
```
[sarcastico] Ah claro, treinar é difícil demais. [ri] hahaha, assim até minha vó consegue!
```
**API recebe:**
```
Ah claro, treinar é difícil demais. hahaha, assim até minha vó consegue!
```

---

### Com ênfase
```
[enfase] DECIDA agora. [pausa:1s] Não amanhã. Não segunda-feira. [enfase] AGORA.
```
**API recebe:**
```
DECIDA agora. <break time="1s"/> Não amanhã. Não segunda-feira. AGORA.
```

---

### Com sussurro
```
[sussurro] Ninguém te vê agora. [pausa:0.5s] Mas você se vê.
```
**API recebe:**
```
Ninguém te vê agora. <break time="0.5s"/> Mas você se vê.
```

---

## Regras de Conversão (para `*narracao`)

O agente gera **dois outputs**:

### Output A — Versão Anotada (para leitura do usuário)
```
[serio] Ontem você disse que ia começar. [pausa:1s] Hoje também?
```

### Output B — Versão ElevenLabs (para enviar à API)
```
Ontem você disse que ia começar. <break time="1s"/> Hoje também?
```

**Conversão automática:**
- `[ri]` → removido (mantém o texto de risada que segue)
- `[sarcastico]` → removido (o phrasing carrega o tom)
- `[sussurro]` → removido (o modelo interpreta pelo contexto)
- `[empolgado]` → removido (exclamações e ritmo carregam)
- `[serio]` → removido (tom declarativo via estrutura)
- `[enfase]` → removido (CAPS na palavra mantidos)
- `[pausa:Xs]` → `<break time="Xs"/>` (único tag real)

---

## Integração com TTS

```bash
node integrations/elevenlabs/text-to-speech.js "<versao_elevenlabs>" "output/marketing-clones/<slug>.mp3"
```

Voz padrão: **Brian** (`nPczCjzI2devNBz1zQrb`)
Modelo: `eleven_multilingual_v2`

Para usar outra voz:
```bash
node integrations/elevenlabs/text-to-speech.js "<texto>" "output.mp3" "<voice_id>"
```

---

## Timing de Referência

| Duração | Palavras PT-BR | Observação |
|---------|---------------|------------|
| 12s | ~25-30 palavras | Vídeo curto TikTok |
| 30s | ~75 palavras | Vídeo médio |
| 1min | ~150 palavras | Vídeo longo |

Ritmo médio de narração: **~2,5 palavras/segundo** em PT-BR com ElevenLabs Brian.
