# STEP 02 — Camada de Inteligência (v2 — Marketplace Focus)
## Data Mining, Identificação de Nicho & Descoberta de Produto para Marketplaces

> "The measure of success in my life is: how many useful things can I get done?"
> — Elon Musk

---

## 1. Princípio Fundamental

Operar em marketplace muda a física do negócio de forma crítica. Você não controla o tráfego — o algoritmo do marketplace controla. Você não controla a vitrine — o ranking controla. Isso significa que a seleção de produto tem que considerar não apenas margem e tendência, mas também a **física do algoritmo**: como o ML ou Amazon decidem quem aparece primeiro.

A lei física aqui é:
```
Margem Real = Preço de Venda
            - Custo do Produto
            - Custo de Envio ao Marketplace
            - Comissão do Marketplace
            - Taxa Fixa por Venda (se aplicável)
            - Custo de Anúncio Pago (se necessário para tração inicial)

Se Margem Real < 30%: produto inviável no modelo marketplace.
```

O Intelligence Agent não escolhe nicho por intuição — ele **elimina** todos os nichos que violam a física do marketplace até sobrar o que a física permite.

---

## 2. Intelligence Agent — Especificação

```yaml
agent_spec:
  id: "intelligence-agent-v2"
  nome: "Intelligence Agent — Data Mining & Market Discovery (Marketplace)"
  tipo: "strategic"
  autoridade:
    pode_fazer:
      - Executar queries em fontes de dados de marketplace e externas
      - Contratar e demitir Data Workers júniores
      - Produzir Relatórios de Oportunidade para o CEO
      - Rejeitar nichos que não passam nos filtros físicos do marketplace
      - Monitorar performance de produtos ativos no marketplace
    nao_pode_fazer:
      - Tomar decisão final de nicho (isso é CEO)
      - Contatar fornecedores (isso é Supply Chain Agent)
      - Alterar listings ou preços (isso é Operations Agent)
  inputs_aceitos:
    - Briefing inicial do CEO (categoria ou direção ampla)
    - Feedback de relatórios anteriores
    - Dados de performance de produtos ativos
  outputs_produzidos:
    - Relatório de Oportunidade de Nicho (formato padronizado)
    - Lista de produtos candidatos com score
    - Alertas de oportunidade e ameaça no marketplace
  metricas_de_sucesso:
    - Taxa de produtos recomendados que atingem milestone M1: ≥ 40%
    - Tempo de produção do relatório: < 4h
    - Acurácia de estimativa de margem real vs. margem verificada: variação < 10%
  condicao_de_demissao:
    - Produz relatórios sem fonte verificável por 2 ciclos
    - Margem estimada diverge da real em > 25% por 3 relatórios consecutivos
  reporta_para: "ceo-agent"
```

---

## 3. Fontes de Dados Primárias — Marketplace First

Prioridade invertida em relação ao modelo de loja própria: dados nativos do marketplace têm peso maior.

### Tier 1 — Dados Nativos do Marketplace (maior confiabilidade):
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| ML Tendências (mercadolivre.com.br/tendencias) | Produtos em alta na plataforma, categorias em crescimento | Diário |
| ML Best Sellers por categoria | Volume de vendas, preços praticados, sellers dominantes | Diário |
| Amazon BR Best Sellers | Ranking e estimativa de volume por categoria | Diário |
| ML Análise de Concorrência | Quantidade de sellers, faixa de preço, avaliações | Semanal |
| Shopee Trending BR | Comparativo de demanda entre plataformas | Semanal |

### Tier 2 — Dados de Custo e Origem:
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| Alibaba / AliExpress | Custo de produto na origem, MOQ, lead time | Semanal |
| Google Trends BR | Tendência de busca orgânica para validar demanda | Semanal |
| Calculadora de Taxas do ML | Comissão real por categoria + taxa fixa | A cada análise |
| Amazon Fee Calculator | Referral fee + FBA fee estimado | A cada análise |

### Tier 3 — Sinais de Tendência Emergente:
| Fonte | O que extrai | Frequência |
|-------|-------------|-----------|
| TikTok BR (busca manual) | Produtos viralizando que ainda não saturaram o ML | Semanal |
| Pinterest Trends | Tendências de consumo visual pré-mainstream | Mensal |
| Google Shopping BR | Anunciantes pagando por categoria = demanda validada | Semanal |

---

## 4. Filtros Físicos de Nicho para Marketplace (Sequência Inviolável)

### Filtro 1 — Margem Real no Marketplace (crítico — diferente do modelo loja própria)

```
MERCADO LIVRE — Simulação de Margem:

Preço de Venda Alvo:         R$ XX,00
(-) Custo do Produto:       (R$ XX,00)
(-) Frete para ML Full*:    (R$ XX,00)   ← custo de enviar para o galpão do ML
(-) Comissão ML por venda:  (R$ XX,00)   ← verificar tabela atual por categoria
(-) Taxa fixa por venda:    (R$ XX,00)   ← verificar regra atual do ML
(-) Custo de anúncio pago:  (R$ XX,00)   ← estimar 5-10% do preço para fase inicial
= MARGEM REAL:               R$ XX,00

Threshold: Margem Real ≥ 30% do Preço de Venda

IMPORTANTE: Comissões do ML variam por categoria (aproximadamente 11% a 16%).
Sempre verificar a tabela atual em: vendedores.mercadolivre.com.br/tarifas
```

```
AMAZON BR — Simulação de Margem:

Preço de Venda Alvo:         R$ XX,00
(-) Custo do Produto:       (R$ XX,00)
(-) Frete para FBA:         (R$ XX,00)   ← custo de enviar para galpão Amazon
(-) Referral Fee Amazon:    (R$ XX,00)   ← verificar tabela por categoria
(-) FBA Fee (pick&pack):    (R$ XX,00)   ← baseado em peso/dimensão
(-) Custo de anúncio pago:  (R$ XX,00)
= MARGEM REAL:               R$ XX,00

Threshold: Margem Real ≥ 30% do Preço de Venda
Verificar fees em: sellercentral.amazon.com.br
```

**Se margem < 30% em qualquer marketplace: DELETAR o produto da lista.**

### Filtro 2 — Elegibilidade para Fulfillment do Marketplace

```
ML Full — Requisitos físicos do produto (verificar regras atuais):
□ Peso com embalagem: geralmente ≤ 30kg por unidade
□ Dimensões: verificar limites atuais do ML Full
□ Produto sem restrição de categoria (produtos com ANVISA, INMETRO especial = complexidade extra)
□ Produto não perecível, não frágil a ponto de exigir embalagem especial
□ Foto de produto no padrão exigido pelo ML

Se produto NÃO é elegível para ML Full:
→ Avaliar Mercado Envios (você envia, ML fornece etiqueta)
→ Se também não for viável: eliminar o produto da lista

Motivo: ML Full ranqueia melhor no algoritmo. Produto não-Full compete com desvantagem estrutural.
```

### Filtro 3 — Intensidade Competitiva no Marketplace

```
Análise de sellers na categoria do ML/Amazon:

Score BAIXO (favorável):
- Menos de 5 sellers com > 500 avaliações na página de busca
- Seller líder tem abaixo de 5.000 avaliações totais
- Preço médio dos top sellers com margem que permite competir

Score MÉDIO (aceitável com diferenciação):
- 5-15 sellers estabelecidos, mas com gaps de qualidade de listing
- Oportunidade de SEO de listing melhor que os concorrentes
- Possibilidade de preço competitivo mantendo margem

Score ALTO (evitar no início):
- > 15 sellers com milhares de avaliações
- Sellers com reputação Ouro/Platina dominando a primeira página
- Preço de mercado não permite margem mínima

Threshold para produto novo: Score BAIXO ou MÉDIO com diferenciação identificável
```

### Filtro 4 — Idiot Index do Produto

```
Idiot Index = Preço médio no marketplace / Custo de atacado na origem

Range ideal para marketplace: 3x a 8x
- Abaixo de 2x: commodity — guerra de preço inevitável, margem impossível
- Acima de 10x: investigar se há oportunidade de entrar no nicho com preço melhor
- Acima de 15x: produto com muita complexidade de produção ou marca forte — evitar sem análise profunda
```

### Filtro 5 — Tendência vs. Moda (igual ao modelo anterior, mas com dado marketplace)

```
Sinal forte de tendência real:
- Crescimento constante no ML Tendências por 6+ meses
- Aumento de sellers (mais gente entrando = mercado real)
- Google Trends BR crescente YoY

Sinal de moda (alto risco):
- Pico súbito em < 60 dias
- Associado a viral de rede social sem fundamento de utilidade
- Já presente em excesso de sellers entrando ao mesmo tempo

Threshold: Tendência confirmada por pelo menos 2 fontes independentes
```

---

## 5. Data Workers Júniores

### Worker: Marketplace Price Benchmarker
```yaml
worker_spec:
  id: "worker-marketplace-benchmarker"
  task: "Coletar dados de preço, avaliações e sellers para [produto] no [marketplace]"
  input: "Termo de busca exato + marketplace alvo + número de resultados (padrão: top 20)"
  output: |
    CSV com colunas:
    posicao_ranking | nome_seller | reputacao_seller | preco_venda |
    qtd_avaliacoes | nota_media | tipo_fulfillment (Full/Envios/Direto) | 
    frete_cobrado | tempo_entrega_prometido
  tempo_execucao: "< 45 minutos"
  formato_output: "Estritamente CSV. Sem interpretação. Apenas dados brutos."
```

### Worker: Marketplace Fee Calculator
```yaml
worker_spec:
  id: "worker-fee-calculator"
  task: "Calcular margem real para [produto] no [marketplace] com [preço de venda]"
  input: |
    - Produto (nome e categoria)
    - Preço de venda pretendido
    - Custo do produto (fornecedor)
    - Peso e dimensões da embalagem
    - Marketplace alvo (ML ou Amazon)
  output: |
    JSON com:
    preco_venda | custo_produto | comissao_marketplace |
    taxa_fixa | custo_frete_fulfillment | margem_bruta_r$ | margem_bruta_pct |
    elegivel_full: true/false | fonte_tarifas + data_consulta
  tempo_execucao: "< 20 minutos"
  observacao: "Sempre consultar tabela de tarifas atual — taxas mudam. Nunca usar valor memorizado."
```

### Worker: Competition Profiler
```yaml
worker_spec:
  id: "worker-competition-profiler"
  task: "Mapear top 10 sellers de [categoria] no [marketplace]"
  input: "Categoria + marketplace + critério de ranking (mais vendidos / mais avaliados)"
  output: |
    JSON com por seller:
    nome | reputacao | total_avaliacoes | avg_price | fulfillment_type |
    tempo_no_marketplace | top_3_produtos_com_preco[]
  tempo_execucao: "< 60 minutos"
```

---

## 6. Scoring Final de Produto (Ajustado para Marketplace)

```
PRODUCT SCORE = (
  (Margem Real no Marketplace × 0.40) +   ← peso maior: viabilidade financeira real
  (Score de Tendência × 0.25) +
  (Inverso de Competição × 0.20) +
  (Elegibilidade Full/FBA × 0.15)          ← novo: impacta ranking diretamente
) × 100

Threshold para aprovação: Score ≥ 65
Top candidates (Score ≥ 80): encaminhar ao CEO para decisão final
```

---

## 7. Relatório de Oportunidade — Formato Padrão

```markdown
## Relatório de Oportunidade — [Data]

### Candidatos Aprovados (Score ≥ 65):

| Produto | Score | Margem Real | Tendência | Competição | Full Eligible |
|---------|-------|-------------|-----------|------------|---------------|
| [nome]  | XX    | XX%         | ↑XX% 6m   | BAIXA      | SIM/NÃO       |

### Top Recomendação:
**Produto:** [nome]
**Marketplace recomendado:** ML ou Amazon (com justificativa)
**Raciocínio:** [baseado em dados, máximo 3 linhas]
**Risco principal:** [1 linha]
**Próximo passo:** Encaminhar ao Supply Chain Agent para sourcing e amostra

### Produtos Rejeitados:
[produto] — Motivo: [filtro específico que falhou com dado]

### Tarifas consultadas em:
[links + data de consulta — tarifas mudam, data importa]
```

---

## Output deste Step

Ao final do Step 02, você deve ter:
- [ ] Intelligence Agent instanciado com spec v2
- [ ] Workers criados (Marketplace Benchmarker + Fee Calculator + Competition Profiler)
- [ ] Fontes de dados configuradas com foco em marketplace nativo
- [ ] Margem real calculada incluindo todas as taxas do marketplace
- [ ] Primeiro Relatório de Oportunidade com top 3 produtos candidatos entregue ao CEO

**Próximo:** STEP 03 — Cadeia de Suprimentos (Fornecedores + Logística para Marketplace)

---

*— Physics is law. And in a marketplace, the physics includes the fee table. Calculate the real cost before falling in love with a product.*
