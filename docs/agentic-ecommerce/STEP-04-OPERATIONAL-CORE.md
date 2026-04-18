# STEP 04 — Núcleo Operacional
## Plataforma de E-commerce, Processos Internos & Workers Júniores

> "If you do not end up adding back at least 10% of the deleted parts, then you didn't delete enough."
> — Elon Musk

---

## 1. Princípio Fundamental

A maioria dos e-commerces começa construindo a plataforma antes de validar o produto. Isso é otimizar na ordem errada — é o equivalente de automatizar um processo que não deveria existir.

**The Algorithm aplicado:**
1. QUESTIONAR: Qual plataforma é necessária para validar o produto com o menor custo?
2. DELETAR: Tudo que não é necessário para os primeiros 100 pedidos
3. SIMPLIFICAR: Um canal de venda, uma forma de pagamento, um método de envio
4. ACELERAR: Só depois de validação do produto
5. AUTOMATIZAR: Apenas processos comprovadamente recorrentes e estáveis

**Regra inviolável:** Nunca construir infraestrutura para escala que ainda não existe.

---

## 2. Operations Agent — Especificação

```yaml
agent_spec:
  id: "operations-agent-v1"
  nome: "Operations Agent — Plataforma, Pedidos & Atendimento"
  tipo: "operational"
  autoridade:
    pode_fazer:
      - Gerenciar listagens de produto na plataforma
      - Processar e monitorar pedidos
      - Acionar workers para tarefas operacionais específicas
      - Escalar problemas de pedido ao CEO
      - Gerenciar atendimento ao cliente via protocolo definido
    nao_pode_fazer:
      - Alterar preço do produto sem aprovação do CEO
      - Emitir reembolso acima de R$[threshold] sem aprovação
      - Contratar fornecedores (Supply Chain Agent)
      - Mudar plataforma de venda sem decisão do CEO
  inputs_aceitos:
    - Produto aprovado com especificações completas
    - Fornecedor e modelo logístico aprovados (STEP 03)
    - Políticas de atendimento definidas pelo CEO
  outputs_produzidos:
    - Dashboard operacional diário (pedidos, status, anomalias)
    - Relatório semanal de performance (conversão, retorno, NPS)
    - Alertas de anomalia em tempo real
  metricas_de_sucesso:
    - Taxa de pedidos entregues no prazo: ≥ 95%
    - Taxa de reclamação no marketplace: < 1%
    - Tempo de resposta ao cliente: < 2h
    - Taxa de reembolso: < 3%
  reporta_para: "ceo-agent"
```

---

## 3. Seleção de Plataforma — Critério de First Principles

**Pergunta fundamental:** Qual plataforma reduz o tempo entre "produto aprovado" e "primeiro pedido pago" ao mínimo?

### Matriz de Decisão por Fase:

| Fase | Volume | Plataforma Recomendada | Motivo |
|------|--------|----------------------|--------|
| Validação | 0-100 pedidos/mês | Mercado Livre + Shopee | Tráfego orgânico existente, zero custo de aquisição de tráfego |
| Crescimento | 100-1000 pedidos/mês | Shopify + ML + Shopee | Canal próprio + marketplaces para diversificação |
| Escala | > 1000 pedidos/mês | Shopify + todos os canais relevantes | Omnichannel com hub central |

### Regra de Build vs. Buy:
```
NUNCA construa o que pode ser comprado em fase de validação.
SEMPRE compre o que não é vantagem competitiva.
CONSTRUA apenas o que diferencia o negócio (atendimento, curadoria de produto, marca).

Plataforma de e-commerce NÃO é vantagem competitiva — é commodity.
Use Shopify, Nuvemshop, ou marketplace. Nunca construa plataforma própria antes de R$1M/mês.
```

---

## 4. Configuração Mínima Viável de Plataforma

### Para fase de validação (Mercado Livre):
```
Checklist obrigatório para publicação:
□ Título do produto: palavra-chave principal + benefício + especificação
□ Fotos: 6-8 fotos (fundo branco obrigatório + foto lifestyle)
□ Descrição: problema que resolve + como usa + especificações técnicas
□ Preço: calculado com margem mínima de 40% (Filtro 1 do STEP 02)
□ Estoque inicial: mínimo para 30 dias de venda estimada
□ Política de devolução: clara, conforme legislação (7 dias CDC)
□ Pergunta e resposta template: 10 perguntas mais comuns respondidas
```

### Métricas de validação para avançar de fase:
```
Produto validado quando:
- ≥ 50 pedidos completados com sucesso
- NPS ≥ 70 (pesquisa simples pós-entrega)
- Taxa de reembolso < 5%
- Margem real confere com margem projetada (variação < 15%)

Se produto NÃO validar em 90 dias: Intelligence Agent recebe sinal para reavaliação
```

---

## 5. Workers Júniores — Operações

### Worker: Listing Creator
```yaml
worker_spec:
  id: "worker-listing-creator"
  task: "Criar listagem de produto em [plataforma] seguindo template padrão"
  input:
    - Nome do produto
    - Especificações técnicas
    - Fotos fornecidas
    - Preço definido pelo CEO
    - Benefícios principais (máx 5)
  output: "Listagem publicada + URL + print de confirmação"
  tempo_execucao: "< 2 horas"
  condicao_rejeicao: "Listagem sem todas as fotos obrigatórias ou preço incorreto"
```

### Worker: Order Processor
```yaml
worker_spec:
  id: "worker-order-processor"
  task: "Processar pedidos recebidos e acionar fulfillment"
  input: "Lista de pedidos novos com dados completos"
  output: "Confirmação de processamento + tracking codes atualizados"
  frequencia: "A cada 2 horas em horário comercial"
  escalar_se: "Pedido com endereço inválido, pagamento não confirmado, ou produto sem estoque"
```

### Worker: Customer Response
```yaml
worker_spec:
  id: "worker-customer-response"
  task: "Responder mensagens de clientes seguindo playbook de atendimento"
  input: "Mensagem do cliente + histórico do pedido"
  output: "Resposta enviada + categorização da mensagem (dúvida/reclamação/elogio)"
  tempo_maximo_resposta: "2 horas"
  limite_de_autoridade:
    - Pode: responder dúvidas, informar status, instruir sobre devolução
    - Não pode: oferecer desconto, aprovar reembolso acima de R$50, prometer prazo não confirmado
  escalar_se: "Cliente solicita reembolso, caso jurídico, ou reclamação pública"
```

### Worker: Inventory Monitor
```yaml
worker_spec:
  id: "worker-inventory-monitor"
  task: "Monitorar nível de estoque e gerar alertas de reposição"
  input: "Nível de estoque atual + velocity de venda dos últimos 7 dias"
  output: "Relatório de estoque + alertas de reposição necessária"
  frequencia: "Diário"
  alerta_critico: "Escalar ao Supply Chain Agent quando estoque < 14 dias de venda"
```

---

## 6. Playbook de Atendimento ao Cliente

O Worker de Customer Response opera exclusivamente dentro deste playbook:

### Categoria 1 — Dúvidas Pré-Compra:
```
Template: "Olá! [Responde a dúvida específica com informação verificável]. 
Qualquer outra dúvida, estou aqui!"
```

### Categoria 2 — Status de Pedido:
```
Template: "Olá! Seu pedido [número] está [status]. Previsão de entrega: [data].
Você pode acompanhar em tempo real pelo código [tracking]."
```

### Categoria 3 — Produto com Defeito:
```
Template: "Lamentamos muito pelo ocorrido. Vamos resolver isso imediatamente.
[Se dentro de 7 dias]: Seu direito de devolução está garantido pelo CDC.
Siga este passo a passo: [link do protocolo de devolução]."
```

### Categoria 4 — ESCALAÇÃO OBRIGATÓRIA (passa para Operations Agent):
```
- Reclamação no Reclame Aqui
- Ameaça de processo judicial
- Pedido de reembolso por produto não recebido há > 20 dias
- Reclamação com > 1000 visualizações em qualquer rede social
```

---

## 7. Dashboard Operacional — Formato Padrão

O Operations Agent entrega ao CEO diariamente:

```markdown
## Dashboard Operacional — [Data]

### Pedidos:
- Novos hoje: XX
- Processados: XX
- Em trânsito: XX
- Entregues hoje: XX
- Atrasados: XX (XX% do total ativo)

### Atendimento:
- Mensagens recebidas: XX
- Respondidas no prazo: XX%
- Escaladas ao Operations Agent: XX
- Reembolsos aprovados: XX (R$XX total)

### Estoque:
- SKUs com estoque crítico (< 14 dias): [lista]
- Pedido de reposição em andamento: [lista]

### Anomalias do dia:
[Lista de eventos fora do padrão com ação tomada]

### Decisões necessárias do CEO:
[Lista de itens que precisam de aprovação com deadline]
```

---

## 8. Protocolo de Substituição de Worker

Quando um worker é substituído (demitido):
1. Documentar motivo específico (formato, prazo, qualidade)
2. Atualizar spec do worker com critério de rejeição adicional
3. Novo worker recebe spec atualizado + histórico de falhas do anterior
4. Período de validação de 7 dias para o novo worker
5. Aprovação formal do Operations Agent após validação

**Regra:** A substituição de um worker não pode interromper a operação por mais de 4 horas.

---

## Output deste Step

Ao final do Step 04, você deve ter:
- [ ] Operations Agent instanciado
- [ ] Plataforma de venda configurada e produto publicado
- [ ] Workers Júniores operacionais (Listing, Order, Customer, Inventory)
- [ ] Playbook de atendimento documentado
- [ ] Dashboard operacional configurado e entregando ao CEO
- [ ] Primeiros 10 pedidos processados e métricas coletadas

**Próximo:** STEP 05 — Protocolo de Escala (Freelancers + Crescimento)

---

*— A maniacal sense of urgency is our operating principle. Get to the first order. Everything else is noise.*
