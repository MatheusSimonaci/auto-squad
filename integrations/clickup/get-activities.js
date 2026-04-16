/**
 * ClickUp — Buscar atividades por lista e grupo (status)
 *
 * Uso:
 *   node integrations/clickup/get-activities.js <LIST_ID> <GROUP>
 *
 * Ou via variáveis de ambiente:
 *   CLICKUP_LIST_ID=abc123 CLICKUP_GROUP="Em Progresso" node integrations/clickup/get-activities.js
 *
 * Variáveis:
 *   LIST_ID  — ID da lista no ClickUp (ex: 901234567)
 *   GROUP    — Nome do grupo/status (ex: "to do", "in progress", "done")
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ---------------------------------------------------------------------------
// 1. Carregar .env manualmente (sem dependências externas)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key   = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// 2. Resolver parâmetros (CLI args têm prioridade sobre env vars)
// ---------------------------------------------------------------------------
const LIST_ID = process.argv[2] || process.env.CLICKUP_LIST_ID;
const GROUP   = process.argv[3] || process.env.CLICKUP_GROUP;
const API_KEY = process.env.CLICKUP_API_KEY;

if (!API_KEY) {
  console.error('❌  CLICKUP_API_KEY não encontrada no .env');
  process.exit(1);
}
if (!LIST_ID) {
  console.error('❌  LIST_ID não informado.\n   Uso: node get-activities.js <LIST_ID> <GROUP>');
  process.exit(1);
}
if (!GROUP) {
  console.error('❌  GROUP não informado.\n   Uso: node get-activities.js <LIST_ID> <GROUP>');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Helper: requisição HTTPS simples (promisificada)
// ---------------------------------------------------------------------------
function get(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Resposta inválida: ${data}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// 4. Buscar tarefas da lista filtradas pelo status/grupo
// ---------------------------------------------------------------------------
async function getActivities(listId, group) {
  const encodedStatus = encodeURIComponent(group.toLowerCase());
  const url = `https://api.clickup.com/api/v2/list/${listId}/task`
    + `?statuses[]=${encodedStatus}`
    + `&include_closed=true`
    + `&subtasks=true`
    + `&page=0`;

  const headers = {
    Authorization: API_KEY,
    'Content-Type': 'application/json',
  };

  console.log(`\n🔍  Lista: ${listId} | Grupo: "${group}"\n`);

  let allTasks = [];
  let page     = 0;
  let hasMore  = true;

  // Percorrer todas as páginas (ClickUp pagina a cada 100 tarefas)
  while (hasMore) {
    const pageUrl = `https://api.clickup.com/api/v2/list/${listId}/task`
      + `?statuses[]=${encodedStatus}`
      + `&include_closed=true`
      + `&subtasks=true`
      + `&page=${page}`;

    const response = await get(pageUrl, headers);
    const tasks    = response.tasks || [];

    allTasks = allTasks.concat(tasks);
    hasMore  = tasks.length === 100; // ClickUp retorna max 100 por página
    page++;
  }

  return allTasks;
}

// ---------------------------------------------------------------------------
// 5. Formatar e exibir resultado
// ---------------------------------------------------------------------------
function formatTask(task, indent = '') {
  const status    = task.status?.status   || 'sem status';
  const assignees = (task.assignees || []).map(a => a.username || a.email).join(', ') || '—';
  const due       = task.due_date
    ? new Date(Number(task.due_date)).toLocaleDateString('pt-BR')
    : '—';
  const priority  = task.priority?.priority || '—';

  console.log(`${indent}📌  ${task.name}`);
  console.log(`${indent}    ID:        ${task.id}`);
  console.log(`${indent}    Status:    ${status}`);
  console.log(`${indent}    Prioridade: ${priority}`);
  console.log(`${indent}    Responsável: ${assignees}`);
  console.log(`${indent}    Prazo:     ${due}`);
  if (task.url) console.log(`${indent}    URL:       ${task.url}`);
  if (task.description) console.log(`${indent}    Descrição: ${task.description}`);
  console.log();
}

// ---------------------------------------------------------------------------
// 6. Executar
// ---------------------------------------------------------------------------
(async () => {
  try {
    const tasks = await getActivities(LIST_ID, GROUP);

    if (tasks.length === 0) {
      console.log(`⚠️  Nenhuma atividade encontrada no grupo "${GROUP}" da lista ${LIST_ID}.`);
      return;
    }

    console.log(`✅  ${tasks.length} atividade(s) encontrada(s):\n`);
    console.log('─'.repeat(60));

    for (const task of tasks) {
      formatTask(task);

      // Exibir subtarefas (se houver)
      if (task.subtasks && task.subtasks.length > 0) {
        console.log(`    └─ Subtarefas (${task.subtasks.length}):`);
        for (const sub of task.subtasks) {
          formatTask(sub, '       ');
        }
      }
    }

    console.log('─'.repeat(60));
    console.log(`\nTotal: ${tasks.length} atividade(s) no grupo "${GROUP}"\n`);

  } catch (err) {
    console.error('❌  Erro ao buscar atividades:', err.message);
    process.exit(1);
  }
})();
