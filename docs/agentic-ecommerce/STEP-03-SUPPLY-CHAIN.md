# STEP 03 — Cadeia de Suprimentos
## Descoberta de Fornecedores & Arquitetura Logística

> "The best part is no part. The best process is no process."
> — Elon Musk

---

## 1. Princípio Fundamental

A maioria dos e-commerces escolhe fornecedor pelo preço mais barato. Isso é otimizar a variável errada.

A lei física aqui é: **confiabilidade do fornecedor × tempo de reposição × custo total = custo real de suprimento.**
Um fornecedor 20% mais barato que atrasa 30% dos pedidos é fisicamente mais caro que um fornecedor premium.

O Supply Chain Agent não procura o fornecedor mais barato — ele procura o fornecedor com **menor custo total de suprimento**, que é fundamentalmente diferente.

---

## 2. Supply Chain Agent — Especificação

```yaml
agent_spec:
  id: "supply-chain-agent-v1"
  nome: "Supply Chain Agent — Fornecedores & Logística"
  tipo: "strategic"
  autoridade:
    pode_fazer:
      - Pesquisar e catalogar fornecedores candidatos
      - Solicitar amostras (com aprovação de orçamento pelo CEO)
      - Contratar Supplier Workers e Logistics Workers
      - Recomendar fornecedor principal e backups ao CEO
      - Negociar condições iniciais (volume mínimo, prazo, MOQ)
    nao_pode_fazer:
      - Fechar contrato com fornecedor sem aprovação do CEO
      - Comprometer orçamento acima do threshold definido
      - Alterar produto aprovado pelo Intelligence Agent
  inputs_aceitos:
    - Lista de produtos candidatos aprovados pelo CEO (vindo do STEP 02)
    - Orçamento disponível para amostragem
    - Critérios de logística definidos pelo CEO
  outputs_produzidos:
    - Relatório de Fornecedores Qualificados por produto
    - Matriz Logística com opções e custo por região
    - Recomendação de fornecedor principal + 2 backups por produto
  metricas_de_sucesso:
    - Tempo de entrega real vs. prometido pelo fornecedor: variação < 10%
    - Taxa de defeito de produtos recebidos: < 2%
    - Custo total de suprimento vs. estimativa inicial: variação < 15%
  condicao_de_demissao:
    - Fornecedor recomendado tem taxa de defeito > 5% por 2 ciclos
    - Atraso recorrente sem sinalização antecipada
  reporta_para: "ceo-agent"
```

---

## 3. Protocolo de Qualificação de Fornecedores

Todo fornecedor passa por 4 gates. Reprovação = eliminado.

### Gate 1 — Verificação de Existência Física
```
Checklist obrigatório:
□ CNPJ ou equivalente internacional verificável
□ Endereço físico verificável (Google Maps / Street View mínimo)
□ Presença em marketplace verificado (Alibaba Gold Supplier, etc.)
□ Avaliações de compradores reais (não apenas score agregado)
□ Tempo de operação: ≥ 2 anos

Reprovação automática: qualquer item com "não verificável"
```

### Gate 2 — Capacidade de Suprimento
```
Checklist:
□ MOQ (Minimum Order Quantity) compatível com fase inicial
□ Capacidade de produção mensal documentada
□ Prazo de lead time por escrito
□ Política de reposição de defeitos clara
□ Aceita pagamento via método verificável (não apenas transferência direta)

Idiot Index do Fornecedor:
= Preço cotado / Custo estimado de matéria-prima

Se Idiot Index > 8x: questionar margens do fornecedor, negociar ou rejeitar
```

### Gate 3 — Amostragem Física
```
Protocolo:
1. Solicitar 3-5 unidades de amostra (pagar custo real)
2. Testar por 7 dias mínimo em condição de uso real
3. Avaliar: embalagem, qualidade de material, funcionalidade, durabilidade
4. Fotografar e documentar cada defeito encontrado
5. Score de amostra: 0-10 (threshold: ≥ 7 para aprovação)

Se amostra reprovar: documento o motivo específico, não recontatar esse fornecedor
```

### Gate 4 — Teste de Comunicação
```
Protocolo de 72h:
1. Enviar pergunta técnica complexa sobre o produto
2. Medir tempo de resposta (threshold: < 24h)
3. Avaliar qualidade da resposta (resolve o problema ou faz voltar?)
4. Enviar problema hipotético de logística
5. Avaliar capacidade de resolução

Reprovação: demora > 48h ou respostas genéricas que não resolvem
```

---

## 4. Estrutura de Fornecedores por Produto

Para cada produto aprovado, manter:

```
FORNECEDOR PRINCIPAL (70% do volume)
- Qualificado em todos os 4 gates
- Melhor custo total de suprimento
- Relacionamento desenvolvido

FORNECEDOR BACKUP A (20% do volume)
- Qualificado em todos os 4 gates
- Segunda melhor opção
- Mantido ativo com pedidos regulares para não perder prioridade

FORNECEDOR BACKUP B (10% do volume / emergência)
- Qualificado nos gates 1, 2 e 3
- Acionado apenas se Principal e Backup A falharem
- Mantido no radar sem pedidos regulares
```

**Regra:** Nunca depender 100% de um fornecedor. Isso viola a física da resiliência de sistemas.

---

## 5. Logistics Agent — Especificação

```yaml
agent_spec:
  id: "logistics-agent-v1"
  nome: "Logistics Agent — Shipping & Fulfillment"
  tipo: "operational"
  autoridade:
    pode_fazer:
      - Pesquisar e comparar transportadoras e operadores logísticos
      - Calcular custo de frete por região e peso/volume
      - Recomendar modelo de fulfillment ao Supply Chain Agent
      - Contratar Logistics Workers para tarefas específicas
      - Monitorar performance de entregas
    nao_pode_fazer:
      - Fechar contrato com transportadora sem aprovação
      - Alterar endereço de entrega de pedidos (operação humana ou worker específico)
  inputs_aceitos:
    - Especificações físicas do produto (peso, dimensões, fragilidade)
    - Regiões alvo de venda
    - Volume estimado de pedidos por período
  outputs_produzidos:
    - Matriz de Custo de Frete por região e modalidade
    - Recomendação de modelo de fulfillment
    - SLA de entrega por região
  reporta_para: "supply-chain-agent"
```

---

## 6. Modelos de Fulfillment — Avaliação

Avalie na seguinte ordem de prioridade (primeiro princípio: menor custo total, não menor custo fixo):

### Modelo 1 — Dropshipping Direto do Fornecedor
```
Quando usar: fase inicial, validação de produto, volume < 50 pedidos/mês
Vantagem: capital zero em estoque
Custo oculto: prazo de entrega longo, menor controle de qualidade
Idiot Index do modelo: avaliar custo de perda de cliente por prazo longo
```

### Modelo 2 — Estoque Próprio + Envio Direto
```
Quando usar: produto validado, volume 50-500 pedidos/mês
Vantagem: controle total de qualidade e prazo
Custo: capital imobilizado em estoque + espaço físico
Threshold: só migrar quando margem permite capital de giro para 30 dias de estoque
```

### Modelo 3 — Fulfillment por Terceiros (3PL)
```
Quando usar: volume > 500 pedidos/mês, múltiplos SKUs
Opções no Brasil: Olist, Magalu Fulfillment, Shopee Fulfillment, MercadoEnvios
Vantagem: escala sem infrastructure própria
Custo: fee por pedido + armazenagem
```

### Modelo 4 — Fulfillment Próprio + Equipe
```
Quando usar: volume > 2000 pedidos/mês + produto específico
Vantagem: controle total + margem preservada em escala
Custo: infrastructure, equipe, processo
Só considerar quando 3PL representa > 15% da receita
```

---

## 7. Logistics Workers Júniores

### Worker: Shipping Rate Comparator
```yaml
worker_spec:
  id: "worker-shipping-rate"
  task: "Comparar tarifas de frete para [produto] de [origem] para [destino]"
  input: "Peso, dimensões, origem CEP, destino CEP/região, prazo desejado"
  output: "CSV: transportadora, modalidade, prazo, custo, seguro"
  tempo_execucao: "< 30 minutos"
  formato_output: "Estritamente CSV. Sem recomendação — apenas dados."
```

### Worker: Delivery SLA Monitor
```yaml
worker_spec:
  id: "worker-sla-monitor"
  task: "Monitorar status de pedidos em trânsito e identificar desvios de SLA"
  input: "Lista de tracking codes + SLA prometido por pedido"
  output: "JSON: pedidos_no_prazo[], pedidos_atrasados[], motivo_atraso[]"
  frequencia: "A cada 4 horas"
  alerta: "Escalar ao Supply Chain Agent se > 5% dos pedidos ativos em atraso"
```

---

## 8. Matriz de Decisão Fornecedor + Logística

O Supply Chain Agent entrega ao CEO:

```markdown
## Relatório de Supply Chain — [Produto] — [Data]

### Fornecedor Recomendado:
**Principal:** [nome] — Custo unitário: R$XX — Lead time: XX dias — Score: XX/10
**Backup A:** [nome] — Custo unitário: R$XX — Lead time: XX dias — Score: XX/10
**Backup B:** [nome] — Custo unitário: R$XX — Lead time: XX dias — Score: XX/10

### Modelo de Fulfillment Recomendado:
[Modelo X] — Justificativa: [baseado em volume estimado e margem]

### Custo Total de Suprimento (por unidade vendida):
- Produto: R$XX
- Frete do fornecedor: R$XX
- Fulfillment/Envio ao cliente: R$XX
- **Total:** R$XX
- **Margem operacional estimada:** XX%

### Riscos Identificados:
[Lista de riscos com probabilidade e mitigação]

### Decisão solicitada ao CEO:
Aprovação para: [ação específica — ex: pedir amostras, fechar primeiro pedido]
```

---

## Output deste Step

Ao final do Step 03, você deve ter:
- [ ] Supply Chain Agent instanciado
- [ ] Logistics Agent instanciado como subordinado
- [ ] Mínimo 3 fornecedores qualificados por produto aprovado
- [ ] Amostras físicas testadas e documentadas
- [ ] Modelo de fulfillment definido para fase inicial
- [ ] Primeiro Relatório de Supply Chain aprovado pelo CEO

**Próximo:** STEP 04 — Núcleo Operacional (Plataforma + Workers Júniores)

---

*— Money is not the constraint. The right suppliers, with the right logistics, at the right cost — that is the constraint. Find the physics first.*
