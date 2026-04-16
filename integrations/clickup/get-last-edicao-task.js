/**
 * ClickUp — Buscar a última tarefa do grupo "EDIÇÃO" de uma lista
 *
 * Uso:
 *   node integrations/clickup/get-last-edicao-task.js <LIST_ID>
 *   node integrations/clickup/get-last-edicao-task.js <LIST_ID> --json
 *
 * Saída padrão (console legível):
 *   Exibe nome, ID, URL e descrição da última tarefa.
 *
 * Saída --json (para uso programático):
 *   Imprime apenas um objeto JSON na stdout:
 *   { "id": "...", "name": "...", "slug": "...", "url": "...", "description": "..." }
 *
 * Variáveis de ambiente:
 *   CLICKUP_API_KEY  — obrigatório
 *   CLICKUP_LIST_ID  — alternativa ao argumento CLI
 *   CLICKUP_GROUP    — override do grupo (padrão: "edição")
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
// 2. Resolver parâmetros
// ---------------------------------------------------------------------------
const args     = process.argv.slice(2);
const jsonMode = args.includes('--json');
const LIST_ID  = args.find(a => !a.startsWith('--')) || process.env.CLICKUP_LIST_ID;
const GROUP    = process.env.CLICKUP_GROUP || 'edição';
const API_KEY  = process.env.CLICKUP_API_KEY;

if (!API_KEY) {
  console.error('❌  CLICKUP_API_KEY não encontrada no .env');
  process.exit(1);
}
if (!LIST_ID) {
  console.error('❌  LIST_ID não informado.\n   Uso: node get-last-edicao-task.js <LIST_ID> [--json]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Helper HTTP GET (promisificado)
// ---------------------------------------------------------------------------
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: API_KEY, 'Content-Type': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Resposta inválida: ${data}`)); }
      });
    });
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// 4. Converter nome da tarefa em slug de pasta
//    Ex: "o que a bíblia diz sobre dinheiro?" → "o-que-a-biblia-diz-sobre-dinheiro"
// ---------------------------------------------------------------------------
function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ---------------------------------------------------------------------------
// 5. Extrair texto plano da descrição (ProseMirror → texto legível)
// ---------------------------------------------------------------------------
function extractDescriptionText(task) {
  // ClickUp pode retornar description como string simples ou como objeto
  if (typeof task.description === 'string') return task.description;
  if (task.description_text) return task.description_text;
  return '';
}

// ---------------------------------------------------------------------------
// 6. Buscar tarefas e retornar a última do grupo EDIÇÃO
// ---------------------------------------------------------------------------
async function getLastEdicaoTask(listId, group) {
  const encodedStatus = encodeURIComponent(group.toLowerCase());
  const url = `https://api.clickup.com/api/v2/list/${listId}/task`
    + `?statuses[]=${encodedStatus}`
    + `&include_closed=false`
    + `&subtasks=false`
    + `&order_by=updated`
    + `&reverse=true`
    + `&page=0`;

  const response = await get(url);
  const tasks = response.tasks || [];

  if (tasks.length === 0) return null;

  // A primeira tarefa (com reverse=true, order_by=updated) é a mais recente
  return tasks[0];
}

// ---------------------------------------------------------------------------
// 7. Executar
// ---------------------------------------------------------------------------
(async () => {
  try {
    if (!jsonMode) {
      console.log(`\n🔍  Buscando última tarefa no grupo "${GROUP}" da lista ${LIST_ID}...\n`);
    }

    const task = await getLastEdicaoTask(LIST_ID, GROUP);

    if (!task) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: `Nenhuma tarefa encontrada no grupo "${GROUP}"` }));
      } else {
        console.log(`⚠️  Nenhuma tarefa encontrada no grupo "${GROUP}" da lista ${LIST_ID}.`);
      }
      process.exit(1);
    }

    const result = {
      id:          task.id,
      name:        task.name,
      slug:        toSlug(task.name),
      url:         task.url || `https://app.clickup.com/t/${task.id}`,
      status:      task.status?.status || GROUP,
      description: extractDescriptionText(task),
    };

    if (jsonMode) {
      // Saída limpa para consumo programático — apenas JSON, sem logs
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('─'.repeat(60));
      console.log(`📌  Tarefa: "${result.name}"`);
      console.log(`    ID:     ${result.id}`);
      console.log(`    Slug:   ${result.slug}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    URL:    ${result.url}`);
      if (result.description) {
        console.log(`\n📝  Descrição (primeiros 300 chars):`);
        console.log('    ' + result.description.slice(0, 300).replace(/\n/g, '\n    '));
      }
      console.log('─'.repeat(60));
      console.log('\n✅  Última tarefa EDIÇÃO encontrada com sucesso.\n');
    }

  } catch (err) {
    if (jsonMode) {
      console.log(JSON.stringify({ error: err.message }));
    } else {
      console.error('❌  Erro ao buscar tarefa:', err.message);
    }
    process.exit(1);
  }
})();
