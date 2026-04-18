# STEP 03 — Cadeia de Suprimentos (v2 — Marketplace Focus)
## Descoberta de Fornecedores & Logística para Operação em Marketplace

> "The best part is no part. The best process is no process."
> — Elon Musk

---

## 1. Princípio Fundamental

Operar em marketplace muda a física da logística radicalmente. A boa notícia: ML Full e Amazon FBA eliminam a maioria das decisões logísticas que uma loja própria teria. A má notícia: você ainda tem que resolver a cadeia **do fornecedor até o galpão do marketplace** — e é aqui que 80% dos vendedores criam complexidade desnecessária.

**The Algorithm aplicado à logística de marketplace:**
1. QUESTIONAR: Você precisa gerenciar logística própria? (Resposta: quase sempre não, no início)
2. DELETAR: Todo processo de fulfillment que o marketplace pode fazer por você
3. SIMPLIFICAR: Fornecedor → Seu estoque intermediário → Galpão do Marketplace → Cliente
4. ACELERAR: Só aumentar volume após validação do produto
5. AUTOMATIZAR: Reposição de estoque no galpão quando o processo estiver estável

**Regra de ouro:** Se o marketplace oferece fulfillment com qualidade aceitável — use. Não construa logística própria antes de R$500k/mês. Isso é cruise missile para matar mosca.

---

## 2. Supply Chain Agent — Especificação

```yaml
agent_spec:
  id: "supply-chain-agent-v2"
  nome: "Supply Chain Agent — Fornecedores & Logística para Marketplace"
  tipo: "strategic"
  autoridade:
    pode_fazer:
      - Pesquisar e qualificar fornecedores candidatos
      - Solicitar amostras (com aprovação de orçamento pelo CEO)
      - Contratar Supplier Workers e Logistics Workers
      - Recomendar fornecedor principal e backups ao CEO
      - Negociar condições iniciais (MOQ, prazo, preço por volume)
      - Calcular custo total da cadeia (fornecedor → galpão marketplace)
      - Monitorar nível de estoque no galpão do marketplace
    nao_pode_fazer:
      - Fechar contrato com fornecedor sem aprovação do CEO
      - Comprometer orçamento acima do threshold definido pelo CEO
      - Alterar produto aprovado pelo Intelligence Agent
      - Gerenciar conta no marketplace (isso é Operations Agent)
  inputs_aceitos:
    - Lista de produtos candidatos aprovados pelo CEO (do STEP 02)
    - Orçamento disponível para amostragem e primeiro estoque
    - Marketplace alvo e modelo de fulfillment aprovado pelo CEO
  outputs_produzidos:
    - Relatório de Fornecedores Qualificados por produto
    - Custo total da cadeia (por unidade) para o marketplace alvo
    - Recomendação de fornecedor principal + 2 backups
    - Plano de reposição de estoque no galpão
  metricas_de_sucesso:
    - Entrega no galpão dentro do prazo comprometido: ≥ 95%
    - Taxa de defeito de produtos recebidos: < 2%
    - Custo total da cadeia vs. estimativa: variação < 15%
    - Stockout no galpão do marketplace: 0 (zero tolerância)
  condicao_de_demissao:
    - Stockout causado por falha de previsão do agente: 2 ocorrências
    - Taxa de defeito > 5% por 2 ciclos consecutivos
  reporta_para: "ceo-agent"
```

---

## 3. Escolha do Modelo de Fulfillment — Decisão Estratégica Primária

**Esta decisão precede tudo. Define logística, capital necessário e ranking no marketplace.**

### Opção A — ML Full (Recomendado para início no Mercado Livre)

```
Como funciona:
  Você → envia estoque para galpão do ML → ML armazena, embala e entrega ao cliente

Vantagens:
  ✅ ML controla 100% da entrega (prazo, embalagem, rastreio)
  ✅ Produtos Full têm vantagem de ranking no algoritmo do ML
  ✅ Frete grátis para o comprador (ML absorve ou dilui no preço)
  ✅ Você não toca no pedido após enviar para o galpão
  ✅ Reputação sobe mais rápido (menos problemas de entrega)

Desvantagens:
  ❌ Capital imobilizado em estoque no galpão
  ❌ Custo de fulfillment cobrado por unidade vendida
  ❌ Requer envio periódico ao galpão (planejamento de reposição)
  ❌ Nem todo produto é elegível

Quando usar: primeira escolha se produto for elegível. Ponto final.

Verificar elegibilidade e custos atuais: vendedores.mercadolivre.com.br/full
```

### Opção B — Mercado Envios (Intermediário)

```
Como funciona:
  Pedido feito → ML gera etiqueta → Você embala e posta → transportadora entrega

Vantagens:
  ✅ Menos capital imobilizado (estoca no seu local)
  ✅ Mais controle sobre embalagem e inspeção de qualidade
  ✅ Boa opção para produtos não elegíveis para Full

Desvantagens:
  ❌ Você gerencia todo o picking, packing e postagem
  ❌ Ranking ligeiramente inferior ao Full
  ❌ Operação mais trabalhosa com volume crescente
  ❌ Prazo de entrega mais longo = menos conversão

Quando usar: produtos não elegíveis para Full, ou fase de validação com volume muito baixo
Migrar para Full assim que validado e volume justificar
```

### Opção C — Amazon FBA (para entrada na Amazon)

```
Como funciona:
  Você → envia estoque para galpão da Amazon → Amazon armazena, embala e entrega

Vantagens:
  ✅ Elegibilidade automática para Prime (entrega rápida)
  ✅ Vantagem significativa no Buy Box
  ✅ Mesma lógica do ML Full

Desvantagens:
  ❌ Taxas FBA (pick & pack + armazenagem mensal) — calcular na margem
  ❌ Exigências de embalagem e labeling mais rígidas
  ❌ Processo de envio ao galpão mais burocrático que o ML

Quando usar: se Amazon for o marketplace primário ou secundário após validação no ML
```

### Decisão Recomendada para Fase 1:

```
Mercado Livre + ML Full:
  Razão: maior marketplace do Brasil + fulfillment simplificado + ranking favorecido
  Resultado: menos variáveis para gerenciar, mais foco em produto e nicho

Se produto não elegível para Full:
  Mercado Livre + Mercado Envios na fase de validação
  Meta: reformular embalagem/produto para Full assim que validado
```

---

## 4. Custo Total da Cadeia — Cálculo Obrigatório

O Supply Chain Agent deve calcular o custo total de levar 1 unidade do fornecedor até o galpão do marketplace:

```
CUSTO TOTAL DA CADEIA (por unidade):

Custo do produto no fornecedor:           R$ XX,00
(+) Custo de embalagem (caixa, plástico): R$ XX,00
(+) Frete do fornecedor para você:        R$ XX,00  ← frete nacional ou importação
(+) Custo de inspeção de qualidade:       R$ XX,00  ← se aplicável
(+) Frete de você para o galpão ML/FBA:   R$ XX,00
= CUSTO TOTAL NA ENTRADA DO GALPÃO:       R$ XX,00

Este número vai direto para a simulação de margem do Intelligence Agent (STEP 02).
Se o custo de cadeia aumentar a margem real abaixo de 30%: produto inviável.
```

---

## 5. Protocolo de Qualificação de Fornecedores

Todo fornecedor passa por 4 gates. Reprovação = eliminado.

### Gate 1 — Verificação de Existência e Confiabilidade
```
□ CNPJ verificável (fornecedor nacional) ou Gold Supplier verificado (Alibaba)
□ Tempo de operação: ≥ 2 anos
□ Avaliações de compradores reais verificáveis
□ Endereço físico confirmado
□ Aceita pagamento via método verificável e rastreável

Reprovação automática: qualquer item com "não verificável"
```

### Gate 2 — Capacidade e Compatibilidade com Marketplace
```
□ Produto atende especificações físicas do ML Full ou FBA
□ MOQ compatível com capital disponível para fase de validação
□ Fornecedor consegue embalar conforme padrão do marketplace (ou você embala)
□ Lead time documentado (essencial para planejamento de reposição)
□ Prazo de reposição permite manter estoque no galpão sem stockout

Idiot Index do Fornecedor:
= Preço cotado / Custo estimado de matéria-prima
Range aceitável: 2x a 6x
```

### Gate 3 — Amostragem Física
```
Protocolo:
1. Solicitar 3-5 unidades de amostra
2. Testar produto por 7 dias mínimo em condição de uso real
3. Simular embalagem e envio para galpão (embalar conforme padrão exigido)
4. Score de amostra: 0-10 (threshold: ≥ 7 para aprovação)
5. Fotografar e documentar qualquer defeito

Reprovação: score < 7 ou produto incompatível com padrão de embalagem do marketplace
```

### Gate 4 — Teste de Comunicação e Resposta a Problema
```
Protocolo de 72h:
1. Pergunta técnica complexa → resposta em < 24h?
2. Problema hipotético de lote com defeito → solução clara oferecida?
3. Solicitação de aumento de pedido → como responde à demanda?

Reprovação: > 48h de demora ou respostas evasivas
```

---

## 6. Estrutura de Fornecedores por Produto

```
FORNECEDOR PRINCIPAL (70-80% do volume)
- Aprovado em todos os 4 gates
- Melhor custo total de cadeia
- Já forneceu primeiro lote com qualidade confirmada

FORNECEDOR BACKUP (20-30% do volume)
- Aprovado em todos os 4 gates
- Mantido ativo com pedidos regulares (não perder prioridade)
- Acionado automaticamente se Principal falhar no prazo

FORNECEDOR EMERGÊNCIA (0% volume regular)
- Aprovado em gates 1, 2 e 3
- Contactado apenas em ruptura crítica de estoque
- Pode ter custo ligeiramente maior — aceito em emergência
```

**Regra:** Nunca 100% de dependência de um fornecedor único.
Um atraso de fornecedor = stockout no galpão = queda de ranking no marketplace = meses para recuperar.

---

## 7. Logistics Worker — Reposição de Estoque no Galpão

```yaml
worker_spec:
  id: "worker-stock-replenishment"
  task: "Monitorar nível de estoque no galpão ML/FBA e disparar alertas de reposição"
  input:
    - Estoque atual no galpão (via API do marketplace ou dashboard)
    - Velocidade de vendas dos últimos 14 dias
    - Lead time do fornecedor principal
    - Lead time de envio para o galpão
  output: |
    JSON com:
    estoque_atual | dias_de_cobertura | data_prevista_stockout |
    quantidade_repor | data_limite_para_pedido | alerta: true/false
  frequencia: "Diário"
  regra_de_alerta: |
    ALERTA AMARELO: dias_de_cobertura < (lead_time_fornecedor + lead_time_galpao + 7 dias buffer)
    ALERTA VERMELHO: dias_de_cobertura < lead_time_total + 3 dias
    Escalar ao Supply Chain Agent em qualquer alerta
  condicao_critica: "Stockout = falha crítica. Escalar ao CEO imediatamente."
```

---

## 8. Supplier Worker — Cotação e Comparação

```yaml
worker_spec:
  id: "worker-supplier-quoter"
  task: "Coletar cotações de [produto] em [lista de fornecedores]"
  input:
    - Especificações técnicas do produto
    - Quantidade desejada (MOQ e volume alvo)
    - Lista de fornecedores pré-aprovados nos gates 1 e 2
  output: |
    CSV com:
    fornecedor | preco_unitario_moq | preco_unitario_volume | 
    prazo_producao | prazo_entrega | condicoes_pagamento | 
    politica_defeito | contato
  tempo_execucao: "< 2 dias (aguarda respostas)"
  formato_output: "CSV estrito. Sem recomendação — apenas dados comparativos."
```

---

## 9. Relatório de Supply Chain para CEO

```markdown
## Relatório de Supply Chain — [Produto] — [Data]

### Modelo de Fulfillment Recomendado:
[ML Full / Mercado Envios / FBA] — Justificativa: [1-2 linhas baseadas em dados]

### Fornecedor Recomendado:
**Principal:** [nome] | Custo unitário: R$XX | Lead time: XX dias | Score: XX/10
**Backup:** [nome] | Custo unitário: R$XX | Lead time: XX dias | Score: XX/10

### Custo Total da Cadeia (por unidade):
- Produto: R$XX
- Embalagem: R$XX
- Frete fornecedor → você: R$XX
- Frete você → galpão: R$XX
- **Total entrada galpão:** R$XX

### Confirmação de Margem Real:
[Copiar cálculo do STEP 02 com custo de cadeia real]
Margem confirmada: XX% ← deve ser ≥ 30%

### Estoque Inicial Recomendado:
[Quantidade] unidades — cobre XX dias com velocidade de venda estimada de XX unidades/dia

### Investimento necessário:
Estoque inicial: R$XX | Frete para galpão: R$XX | **Total:** R$XX

### Decisão solicitada ao CEO:
Aprovação para: [ação específica — solicitar amostras / fazer primeiro pedido / enviar para galpão]
```

---

## Output deste Step

Ao final do Step 03, você deve ter:
- [ ] Supply Chain Agent instanciado com spec v2
- [ ] Modelo de fulfillment definido (ML Full prioritário)
- [ ] Mínimo 2 fornecedores qualificados (principal + backup) por produto aprovado
- [ ] Amostras físicas testadas e compatibilidade com embalagem do marketplace confirmada
- [ ] Custo total da cadeia calculado e margem real confirmada ≥ 30%
- [ ] Stock Replenishment Worker configurado
- [ ] Primeiro pedido e envio ao galpão aprovado pelo CEO

**Próximo:** STEP 04 — Núcleo Operacional (Gestão de Conta + Listings no Marketplace)

---

*— The best logistics is no logistics you have to manage. Use what the marketplace built. Your job is the product and the supply chain behind it.*
