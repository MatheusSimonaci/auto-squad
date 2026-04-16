# Task: Criar Copy TikTok

**Task ID:** TN-TP-001
**Executor:** agent (narrador)
**Elicit:** true

---

## Objetivo

Escrever copy em PT-BR pronta para narração TikTok. Output limpo, sem markup — só o texto.

---

## Input Necessário

O agente deve coletar (via conversa, máximo 2 perguntas):

1. **Tema/assunto** — O que a copy deve comunicar?
   - Pode ser: ideia do user, pedido de quote motivacional, tema livre
   - Se user pedir "use Tony Robbins" ou outro autor → carregar `data/quotes-motivacionais.md` e selecionar frase adequada

2. **Duração alvo:**
   - `curto` → até 12 segundos (~25-30 palavras)
   - `medio` → 30 segundos a 1 minuto (~75-150 palavras)
   - Se não informado → perguntar antes de escrever

---

## Estrutura Obrigatória (TikTok)

### Formato Curto (12s)
```
[HOOK - 1 frase, 5-8 palavras]
[CORPO - 2-3 frases, impacto direto]
[CTA - 1 frase que provoca reflexão ou comentário]
```

### Formato Médio (30s-1min)
```
[HOOK - 1-2 frases, primeiros 2 segundos]
[PROBLEMA/TENSÃO - 2-3 frases que criam identificação]
[VIRADA/INSIGHT - 2-4 frases com o ponto central]
[CTA - 1-2 frases convidando comentário ou reflexão]
```

---

## Regras de Escrita

- **Linguagem:** Coloquial PT-BR (não formal, não corporativo)
- **Frases:** Máximo 10 palavras por frase
- **Ritmo:** ~2,5 palavras/segundo na narração → calcule o total
- **Hook:** Deve prender nos primeiros 2 segundos — pergunta, afirmação chocante, ou frase incompleta
- **CTA:** Convide comentário ou reflexão, NUNCA peça "compartilhar" ou "seguir" diretamente
- **Tom:** Direto, emocional, sem rodeios

---

## Contagem de Palavras por Duração

| Duração | Palavras |
|---------|----------|
| 12s | 25-30 |
| 20s | 45-50 |
| 30s | 70-80 |
| 45s | 105-115 |
| 60s | 140-155 |

---

## Exemplos de Output

### Curto (12s) — Tema: disciplina
```
Você disse que ia começar na segunda.
Segunda veio.
Você foi?
O problema não é a segunda. É você.
Comenta "eu fui" se você foi hoje.
```
*(28 palavras — ~11s)*

### Curto (12s) — Quote Tony Robbins adaptada
```
Tony Robbins disse uma vez:
onde o foco vai, a energia flui.
Para onde você tá olhando hoje?
```
*(20 palavras — ~8s)*

### Médio (30s) — Tema: procrastinação
```
Você sabe o que fazer.
Você só não faz.
Não é falta de informação.
É falta de decisão.
Todo dia você acorda com a mesma lista.
Todo dia você deita com a mesma lista.
E amanhã você vai fazer a mesma coisa.
A não ser que você decida agora.
Que dia é hoje pra você?
```
*(62 palavras — ~25s)*

---

## Veto Conditions

- Escrever sem saber a duração alvo → PARAR e perguntar
- Copy com frases longas demais (>12 palavras) → revisar antes de entregar
- CTA pedindo follow/share diretamente → reformular como reflexão
- Linguagem formal/corporativa → reescrever em coloquial

---

## Output Format

Entregar apenas o texto limpo, sem tags de markup, sem explicações:

```
[COPY PRONTA — pronto para `*narracao`]

{texto aqui}

---
Palavras: {contagem}
Duração estimada: {X}s
```
