# STEP 04 — Núcleo Operacional (v2 — Marketplace Focus)
## Gestão de Conta, Listing Optimization & Operação Diária no Marketplace

> "If you do not end up adding back at least 10% of the deleted parts, then you didn't delete enough."
> — Elon Musk

---

## 1. Princípio Fundamental

Não há plataforma para construir. Não há Shopify, não há domínio, não há servidor. O marketplace já é a plataforma. Isso elimina uma classe inteira de problemas — e cria uma diferente.

A física do marketplace é:
```
Visibilidade = f(Relevância do Listing × Reputação da Conta × Velocidade de Vendas)

Sem visibilidade → sem vendas
Sem vendas → sem reputação
Sem reputação → menos visibilidade

Este ciclo opera em ambas as direções: virtuoso ou vicioso.
```

O Operations Agent não gerencia uma loja — ele **gerencia um ativo de ranking** dentro do algoritmo do marketplace. Cada ação que ele toma deve ser avaliada pela pergunta: "Isso melhora ou piora nosso posicionamento no algoritmo?"

---

## 2. Operations Agent — Especificação

```yaml
agent_spec:
  id: "operations-agent-v2"
  nome: "Operations Agent — Gestão de Conta e Listings no Marketplace"
  tipo: "operational"
  autoridade:
    pode_fazer:
      - Criar e otimizar listings de produto
      - Monitorar saúde da conta no marketplace (métricas de reputação)
      - Responder perguntas e mensagens de clientes dentro do marketplace
      - Monitorar pedidos e acionar Supply Chain Agent para reposição
      - Contratar workers júniores operacionais
      - Ajustar preço dentro de range aprovado pelo CEO
      - Criar e gerenciar campanhas de anúncio pago dentro do marketplace
    nao_pode_fazer:
      - Alterar preço fora do range aprovado sem consultar CEO
      - Aprovar reembolso acima do threshold sem aprovação
      - Alterar produto ou categoria sem aprovação do CEO
      - Comprometer orçamento de anúncios acima do limite mensal definido
  inputs_aceitos:
    - Produto aprovado com especificações completas
    - Foto do produto (fornecidas ou solicitadas ao Listing Worker)
    - Fornecedor e modelo logístico aprovados (STEP 03)
    - Políticas de atendimento definidas pelo CEO
    - Budget de anúncio pago definido pelo CEO
  outputs_produzidos:
    - Dashboard operacional diário (vendas, métricas de conta, anomalias)
    - Relatório semanal de performance de listing (conversão, CTR, ranking)
    - Alertas de risco para saúde da conta
  metricas_de_sucesso:
    - Reputação no ML: ≥ Prata (em direção ao Ouro)
    - Tempo de resposta a perguntas: < 1h (ML penaliza acima de 24h)
    - Taxa de cancelamento: < 3%
    - Taxa de reclamações: < 2% das vendas
    - Taxa de pedidos com problema: < 2%
    - CTR do listing: monitorar e melhorar continuamente
  condicao_de_demissao:
    - Conta com status de risco no marketplace por > 7 dias sem resolução
    - Reputação cai para Vermelho e permanece por > 15 dias
  reporta_para: "ceo-agent"
```

---

## 3. Entendendo o Algoritmo do Mercado Livre

O Operations Agent precisa entender a física do algoritmo antes de qualquer ação.

### Fatores de Ranking no ML (em ordem de impacto):

```
1. REPUTAÇÃO DA CONTA (peso crítico)
   - Termômetro: Novo → Bronze → Prata → Ouro → Platinum
   - Calculado com base em: cancelamentos, reclamações, envios no prazo
   - Conta nova começa sem termômetro — primeiras vendas são críticas
   - Meta de curto prazo: chegar a Prata. Meta de médio prazo: Ouro.

2. HISTÓRICO DE VENDAS DO PRODUTO (peso alto)
   - Volume de vendas recentes do produto específico
   - Velocidade de vendas (últimos 30 dias pesam mais que histórico longo)
   - Primeiras vendas são as mais difíceis — algoritmo não confia em produto sem histórico

3. QUALIDADE DO LISTING (peso alto)
   - Título com palavras-chave relevantes
   - Fotos de qualidade profissional
   - Descrição completa com especificações
   - Ficha técnica preenchida

4. TIPO DE ANÚNCIO (peso médio)
   - Platinum > Gold > Classic
   - Full tem vantagem adicional de ranking sobre Envios

5. PREÇO COMPETITIVO (peso médio)
   - Preço muito acima da média = perda de ranking
   - Preço competitivo sem destruir margem é o equilíbrio

6. TEMPO DE RESPOSTA (peso médio)
   - ML monitora tempo médio de resposta a perguntas
   - < 1h = positivo | > 24h = penalização
```

### Implicação estratégica para fase inicial:
```
Problema de bootstrap: sem vendas = sem ranking. Sem ranking = sem vendas.

Soluções físicas (em ordem de preferência):
1. Preço ligeiramente abaixo da concorrência nos primeiros 30-60 pedidos
   (aceitar margem menor para gerar histórico — investimento em ativo de ranking)
2. Ativar anúncios pagos internos do ML (Product Ads) para visibilidade inicial
3. Listing de qualidade superior à concorrência (CTR melhor = mais vendas com mesmo tráfego)
4. Full ativo desde o início (vantagem de ranking do dia 1)

O que NÃO fazer:
- Manipulação de avaliações (viola termos, pode banir conta permanentemente)
- Vendas artificiais (mesmo risco)
```

---

## 4. Listing Optimization — Padrão de Qualidade

### Estrutura do Título (ML e Amazon):
```
FÓRMULA: [Produto] [Marca/Destaque] [Especificação Principal] [Benefício/Uso] [Diferencial]

Exemplo ruim: "Fone de ouvido bluetooth"
Exemplo bom: "Fone de Ouvido Bluetooth 5.0 Sem Fio 30h Bateria Cancelamento de Ruído"

Regras:
- Incluir palavras-chave que os compradores usam para buscar (verificar no autocomplete do ML)
- Sem caracteres especiais desnecessários: !, *, ♦
- Sem capitalização gritante
- Limite de caracteres do ML: respeitar (verificar regra atual)
- Palavras mais buscadas no início do título (peso maior no algoritmo)
```

### Fotos (faz a maior diferença em CTR):
```
Foto 1 — Obrigatória: produto no fundo BRANCO, sem texto, produto ocupando 80% do frame
Foto 2: produto em uso (lifestyle) — pessoa usando ou contexto de uso real
Foto 3: detalhes técnicos / close de material
Foto 4: dimensões com medidas visíveis
Foto 5: embalagem e conteúdo (o que vem na caixa)
Foto 6-8: outros ângulos, diferencial do produto

Resolução mínima: 1200x1200px
Formato: JPG ou PNG
```

### Descrição:
```
Estrutura obrigatória:
1. Problema que o produto resolve (2-3 linhas)
2. Como o produto resolve (funcionalidades principais)
3. Especificações técnicas completas (lista)
4. O que vem na embalagem
5. Garantia e política de devolução

Evitar: texto em imagem, caps lock excessivo, promessas impossíveis
```

### Ficha Técnica:
```
Preencher TODOS os campos disponíveis. Cada campo vazio é ranking perdido.
O algoritmo usa a ficha técnica para exibir o produto nas buscas filtradas.
Produto com ficha técnica incompleta não aparece quando usuário filtra por especificação.
```

---

## 5. Workers Júniores — Operações

### Worker: Listing Creator
```yaml
worker_spec:
  id: "worker-listing-creator-v2"
  task: "Criar listing de produto em [marketplace] seguindo template de qualidade"
  input:
    - Especificações completas do produto
    - Fotos aprovadas (mínimo 5, máximo 8)
    - Preço definido pelo CEO
    - Palavras-chave pesquisadas para o produto (fornecidas pelo Intelligence Agent)
    - Categoria e ficha técnica preenchida pelo Intelligence Agent
  output:
    - URL do listing publicado
    - Print da primeira página de busca mostrando o listing
    - Relatório: "title_score: XX/10 | fotos: X/8 | ficha_tecnica: XX% preenchida"
  tempo_execucao: "< 3 horas"
  condicao_rejeicao: |
    - Menos de 5 fotos publicadas
    - Ficha técnica < 80% preenchida
    - Título sem as 3 principais palavras-chave definidas
    - Preço incorreto
```

### Worker: Account Health Monitor
```yaml
worker_spec:
  id: "worker-account-monitor"
  task: "Monitorar métricas de saúde da conta no marketplace e reportar anomalias"
  input: "Acesso ao painel do vendedor"
  output: |
    JSON diário:
    reputacao_nivel | cancelamentos_pct | reclamacoes_pct |
    envios_no_prazo_pct | perguntas_sem_resposta | 
    status_conta | alertas[]
  frequencia: "Diário (manhã)"
  alerta_imediato: |
    Escalar ao Operations Agent se:
    - Qualquer métrica cruzar o threshold de risco do marketplace
    - Conta receber aviso ou advertência
    - Reputação cair de nível
```

### Worker: Customer Response
```yaml
worker_spec:
  id: "worker-customer-response-v2"
  task: "Responder perguntas e mensagens de clientes no marketplace"
  input: "Mensagem do cliente + título e descrição do produto + histórico do pedido (se existir)"
  output: "Resposta enviada + categorização (pergunta_pre_venda / status_pedido / reclamacao / elogio)"
  tempo_maximo_resposta: "1 hora (crítico para reputação no ML)"
  limite_de_autoridade:
    pode:
      - Responder dúvidas sobre produto com informações do listing
      - Informar status de pedido com tracking
      - Orientar sobre processo de devolução conforme política padrão
    nao_pode:
      - Prometer prazo não confirmado pelo sistema
      - Oferecer desconto ou compensação extra
      - Aprovar reembolso
  escalar_ao_operations_agent_se:
    - Cliente menciona reclamação formal (Procon, Reclame Aqui)
    - Pedido não entregue com mais de 7 dias de atraso
    - Cliente solicita cancelamento após envio
    - Mensagem com ameaça legal
```

### Worker: Ad Campaign Manager
```yaml
worker_spec:
  id: "worker-ad-manager"
  task: "Gerenciar campanhas de Product Ads no marketplace dentro do budget aprovado"
  input:
    - Budget mensal aprovado pelo CEO
    - Lista de produtos ativos com seus listings
    - Meta de ACOS (Advertising Cost of Sale) definida pelo CEO
  output: |
    Relatório semanal:
    budget_gasto | budget_restante | impressoes | cliques | 
    vendas_atribuidas | ACOS_real | recomendacao_ajuste
  limite_de_autoridade:
    - Pode ajustar lances dentro de range ±20% do definido
    - Não pode ultrapassar budget mensal aprovado
    - Não pode criar nova campanha sem aprovação
  escalar_se: "ACOS real > 2x a meta por 3 dias consecutivos"
```

---

## 6. Playbook de Atendimento ao Cliente (Marketplace)

### Categoria 1 — Pergunta Pré-Venda:
```
Responder em até 30 minutos (impacta conversão diretamente).
Template: "[Resposta específica à pergunta com dado verificável do produto].
Estou à disposição para outras dúvidas!"

NUNCA responder vagamente. Pergunta vaga = cliente vai para o concorrente.
```

### Categoria 2 — Status de Pedido:
```
Template: "Seu pedido está [status no sistema] com previsão de entrega para [data].
Acompanhe pelo código de rastreio: [código]."
```

### Categoria 3 — Produto com Defeito ou Diferente:
```
Template: "Lamentamos pelo ocorrido. Seu direito de devolução está garantido.
Para agilizar: [instrução do processo de devolução do marketplace — seguir fluxo padrão do ML/Amazon].
Resolveremos isso com a maior rapidez possível."

NUNCA discutir culpa ou pedir prova antes de abrir o processo.
```

### Categoria 4 — Escalação Imediata ao Operations Agent:
```
- Reclamação aberta no marketplace (ML: reclamação formal)
- Avaliação negativa com menção de problema grave
- Cliente ameaça Procon, IDEC, ou processo judicial
- Pedido de reembolso por não recebimento com > 10 dias de atraso
```

---

## 7. Métricas de Performance de Listing

O Operations Agent monitora e atua sobre:

| Métrica | O que mede | Threshold | Ação se abaixo |
|--------|-----------|-----------|----------------|
| CTR (Click-Through Rate) | % que clica ao ver o anúncio | Referência do setor | Melhorar foto 1 (maior impacto) |
| Taxa de Conversão | % que compra ao entrar no listing | Referência do setor | Melhorar descrição + ficha técnica |
| Posição média de ranking | Posição no resultado de busca | Top 20 para palavra-chave principal | Otimizar título + aumentar velocidade de vendas |
| Avaliação média | Nota dos compradores | ≥ 4.5 estrelas | Investigar causa de notas baixas |
| % Perguntas respondidas em < 1h | Tempo de resposta | ≥ 95% | Revisar processo de resposta |

---

## 8. Dashboard Operacional — Formato Padrão para CEO

```markdown
## Dashboard Operacional — [Data]

### Vendas:
- Pedidos hoje: XX | Semana: XX | Mês: XX
- GMV hoje: R$XX | Semana: R$XX | Mês: R$XX
- Ticket médio: R$XX

### Saúde da Conta:
- Reputação: [Nível] | Tendência: ↑/↓/→
- Reclamações (30d): XX%  [threshold: < 2%]
- Cancelamentos (30d): XX%  [threshold: < 3%]
- Envios no prazo: XX%  [threshold: ≥ 97%]
- Tempo médio de resposta: XXmin  [threshold: < 60min]

### Estoque no Galpão:
- [Produto A]: XX unidades (XX dias de cobertura)
- [Produto B]: XX unidades (XX dias de cobertura)
- Alertas de reposição: [lista ou "Nenhum"]

### Anúncios Pagos:
- Budget gasto: R$XX / R$XX disponível
- ACOS real: XX%  [meta: XX%]
- Vendas atribuídas: R$XX

### Anomalias e Alertas:
[Lista de eventos fora do padrão com ação tomada ou em andamento]

### Decisões necessárias do CEO:
[Lista com deadline e contexto mínimo para decidir]
```

---

## Output deste Step

Ao final do Step 04, você deve ter:
- [ ] Operations Agent instanciado com spec v2
- [ ] Conta de vendedor criada e configurada no marketplace (ML ou Amazon)
- [ ] Estoque enviado e confirmado no galpão (ML Full ou FBA)
- [ ] Primeiro listing publicado e otimizado (title + fotos + ficha técnica)
- [ ] Workers operacionais (Account Monitor + Customer Response + Ad Manager)
- [ ] Campanha de anúncio pago ativada com budget inicial
- [ ] Dashboard operacional entregando ao CEO diariamente
- [ ] Primeiros 10 pedidos processados com avaliações coletadas

**Próximo:** STEP 05 — Protocolo de Escala (Freelancers + Expansão de Marketplace)

---

*— The marketplace is not your store. It's a physics system with a ranking algorithm. Learn the physics. Win the algorithm. Everything else follows.*
