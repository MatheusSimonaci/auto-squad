# STEP 02 — Camada de Inteligência
## Data Mining, Identificação de Nicho & Descoberta de Produto

> "The measure of success in my life is: how many useful things can I get done?"
> — Elon Musk

---

## 1. Princípio Fundamental

A maioria dos e-commerces falha porque escolhe nicho por intuição ou copia o que está funcionando para outros. Isso é **suposição de mercado, não lei física.**

A lei física aqui é: **margem bruta > custo de aquisição de cliente > velocidade de giro.**
Qualquer nicho que não respeita essa equação, independente de quão "quente" pareça, é fisicamente inviável no longo prazo.

O Intelligence Agent não escolhe nicho — ele **elimina** todos os nichos que violam a física do negócio até sobrar o que a física permite.

---

## 2. Intelligence Agent — Especificação

```yaml
agent_spec:
  id: "intelligence-agent-v1"
  nome: "Intelligence Agent — Data Mining & Market Discovery"
  tipo: "strategic"
  autoridade:
    pode_fazer:
      - Executar queries em fontes de dados externas
      - Contratar e demitir Data Workers (júniores)
      - Produzir Relatórios de Oportunidade para o CEO
      - Rejeitar nichos que não passam nos filtros físicos
    nao_pode_fazer:
      - Tomar decisão final de nicho (isso é CEO)
      - Contatar fornecedores (isso é Supply Chain Agent)
      - Aprovar gastos acima de $X (threshold definido pelo CEO)
  inputs_aceitos:
    - Briefing inicial do CEO (categoria ampla de interesse)
    - Feedback de relatórios anteriores
    - Sinais de mercado de fontes primárias
  outputs_produzidos:
    - Relatório de Oportunidade de Nicho (formato padronizado)
    - Lista de produtos candidatos com score
    - Sinais de tendência com fonte e timestamp
  metricas_de_sucesso:
    - Acurácia de previsão de nicho (medida retrospectivamente)
    - Tempo de produção do relatório < 4h
    - Taxa de nichos aprovados pelo CEO > 30%
  condicao_de_demissao:
    - Produz relatórios sem fonte verificável por 2 ciclos
    - CEO rejeita > 90% dos relatórios por 3 ciclos consecutivos
  reporta_para: "ceo-agent"
```

---

## 3. Fontes de Dados Primárias

O Intelligence Agent deve minerar dados das seguintes fontes (em ordem de confiabilidade):

### Tier 1 — Dados de Demanda Real:
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| Google Trends | Tendência de busca por categoria | Diário |
| Amazon Best Sellers | Volume e ranking por categoria | Diário |
| Mercado Livre Tendências | Demanda no mercado brasileiro | Diário |
| Shopee Trending | Produtos em alta na plataforma | Diário |
| TikTok Shop (quando disponível) | Produtos viralizando | Tempo real |

### Tier 2 — Dados de Competição e Margem:
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| AliExpress / Alibaba | Custo de produto na origem | Semanal |
| Jungle Scout / Helium 10 | Estimativa de volume e receita Amazon | Semanal |
| SEMrush / Ahrefs | Custo de aquisição via ads por categoria | Semanal |
| SimilarWeb | Tráfego de concorrentes diretos | Mensal |

### Tier 3 — Sinais de Tendência Emergente:
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| Reddit (r/entrepreneur, r/dropshipping) | Discussões sobre produtos emergentes | Semanal |
| Pinterest Trends | Tendências de consumo visual | Mensal |
| Instagram Hashtags | Produtos viralizando organicamente | Semanal |
| Patentes recentes (USPTO/INPI) | Categorias de produto emergentes | Mensal |

---

## 4. Filtros Físicos de Nicho (Sequência Inviolável)

Todo nicho passa pelos filtros nesta ordem. Reprovação em qualquer filtro = eliminação imediata.

### Filtro 1 — Margem Bruta Mínima
```
Margem Bruta = (Preço de Venda - Custo do Produto - Custo de Frete) / Preço de Venda

Threshold: Margem Bruta ≥ 40%

Se margem < 40%: DELETAR — não há espaço físico para CAC + marketing + operação
```

### Filtro 2 — Idiot Index do Produto
```
Idiot Index = Preço de Venda / Custo de Matéria-Prima no Atacado

Se Idiot Index > 15x: INVESTIGAR — pode haver oportunidade de manufatura própria
Se Idiot Index < 2x: DELETAR — commodity sem diferenciação possível
Range ideal: 3x a 10x
```

### Filtro 3 — Intensidade Competitiva
```
Score de Competição:
- Número de sellers com > 1000 avaliações na categoria: [0-5 = baixo, 5-20 = médio, 20+ = alto]
- Custo médio de CPC no Google Ads para keywords principais
- Presença de marcas com > $10M em receita estimada

Threshold: Score de Competição ≤ MÉDIO para nicho de entrada
```

### Filtro 4 — Logística Física
```
Produto passa se:
- Peso ≤ 2kg (custo de frete controlável)
- Não é frágil ao ponto de exigir embalagem especial
- Não tem restrição regulatória (ANVISA, INMETRO)
- Não é perecível
- Pode ser armazenado em temperatura ambiente
```

### Filtro 5 — Tendência (não moda)
```
Diferença crítica:
- TENDÊNCIA: crescimento sustentado por 12+ meses com base em necessidade real
- MODA: pico agudo de 2-6 meses sem fundamento de utilidade

Sinal de tendência: crescimento no Google Trends > 20% YoY por 2 anos consecutivos
Sinal de moda: pico > 300% em < 3 meses (alto risco de queda simétrica)

Threshold: Produto em tendência, não em moda
```

---

## 5. Data Workers Júniores

O Intelligence Agent contrata workers específicos para tarefas fechadas:

### Worker: Trend Scraper
```yaml
worker_spec:
  id: "worker-trend-scraper"
  task: "Extrair dados de trending products de [fonte específica]"
  input: "URL da fonte + categoria alvo + data range"
  output: "CSV com colunas: produto, volume_busca, variação_30d, variação_90d, fonte, timestamp"
  tempo_execucao: "< 30 minutos"
  formato_output: "Estritamente CSV. Sem interpretação. Apenas dados."
  condicao_rejeicao: "Output fora do formato = task rejeitada, worker substituído"
```

### Worker: Price Benchmarker
```yaml
worker_spec:
  id: "worker-price-benchmarker"
  task: "Coletar preços de [produto específico] em [plataformas definidas]"
  input: "Nome do produto + lista de plataformas + número de resultados por plataforma"
  output: "CSV com colunas: plataforma, vendedor, preço_venda, avaliações, volume_estimado"
  tempo_execucao: "< 45 minutos"
  formato_output: "Estritamente CSV. Sem interpretação."
```

### Worker: Competition Profiler
```yaml
worker_spec:
  id: "worker-competition-profiler"
  task: "Mapear top 10 sellers de [categoria] no [marketplace]"
  input: "Categoria + marketplace + critério de ranking"
  output: "JSON com: seller_name, receita_estimada, reviews_count, avg_price, top_products[]"
  tempo_execucao: "< 60 minutos"
```

---

## 6. Scoring Final de Produto

Após passar por todos os filtros, cada produto candidato recebe um score:

```
PRODUCT SCORE = (
  (Margem Bruta × 0.35) +
  (Score de Tendência × 0.25) +
  (Inverso de Competição × 0.20) +
  (Score Logístico × 0.20)
) × 100

Threshold para aprovação: Score ≥ 65
Top candidates (Score ≥ 80): encaminhar ao CEO para decisão final
```

---

## 7. Relatório de Oportunidade — Formato Padrão

O Intelligence Agent entrega ao CEO apenas este formato:

```markdown
## Relatório de Oportunidade — [Data]

### Candidatos Aprovados (Score ≥ 65):

| Produto | Score | Margem | Tendência | Competição | Logística |
|---------|-------|--------|-----------|------------|-----------|
| [nome]  | XX    | XX%    | ↑XX% YoY  | BAIXA/MÉDIA| APROVADA  |

### Top Recomendação:
**Produto:** [nome]
**Raciocínio:** [3 linhas máximo — baseado em dados, não intuição]
**Risco principal:** [1 linha]
**Próximo passo sugerido:** Encaminhar ao Supply Chain Agent para pesquisa de fornecedor

### Produtos Rejeitados:
[lista com motivo específico do filtro que falhou]

### Fontes utilizadas:
[lista de fontes com timestamp]
```

---

## 8. Cadência Operacional

| Ciclo | Frequência | Responsável | Output |
|-------|------------|-------------|--------|
| Scan de tendências | Diário | Trend Scraper Workers | Raw data |
| Análise de filtros | Semanal | Intelligence Agent | Lista filtrada |
| Relatório para CEO | Quinzenal | Intelligence Agent | Relatório padronizado |
| Revisão de nicho ativo | Mensal | CEO + Intelligence Agent | Decisão de manter/pivotar |

---

## Output deste Step

Ao final do Step 02, você deve ter:
- [ ] Intelligence Agent instanciado com spec completo
- [ ] Data Workers criados (Trend Scraper + Price Benchmarker + Competition Profiler)
- [ ] Fontes de dados configuradas e testadas
- [ ] Filtros físicos implementados e validados
- [ ] Primeiro Relatório de Oportunidade entregue ao CEO
- [ ] Top 3 produtos candidatos identificados

**Próximo:** STEP 03 — Cadeia de Suprimentos (Fornecedores + Logística)

---

*— The question isn't whether this will work. Physics allows it. The question is whether you will execute with the urgency it deserves.*
