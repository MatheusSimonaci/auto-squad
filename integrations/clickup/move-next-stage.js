/**
 * ClickUp — Mover tarefa para a próxima etapa (próximo status na ordem da lista)
 *
 * Uso:
 *   node integrations/clickup/move-next-stage.js <TASK_ID>
 *
 * Exemplo:
 *   node integrations/clickup/move-next-stage.js 86agbyhpk
 *
 * O script descobre automaticamente a ordem dos status da lista
 * e move para o imediatamente seguinte ao status atual.
 *
 * Para forçar um status específico (sem seguir a ordem):
 *   node integrations/clickup/move-next-stage.js <TASK_ID> --status "APROVADO"
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ---------------------------------------------------------------------------
// Carregar .env
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
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

loadEnv();

// Parsear args: detecta --status "NOME"
const args      = process.argv.slice(2);
const TASK_ID   = args.find(a => !a.startsWith('--')) || process.env.CLICKUP_TASK_ID;
const forceFlagIdx = args.indexOf('--status');
const FORCE_STATUS = forceFlagIdx !== -1 ? args[forceFlagIdx + 1] : null;
const API_KEY   = process.env.CLICKUP_API_KEY;

if (!API_KEY)  { console.error('❌  CLICKUP_API_KEY não encontrada no .env'); process.exit(1); }
if (!TASK_ID)  { console.error('❌  TASK_ID não informado.\n   Uso: node move-next-stage.js <TASK_ID>'); process.exit(1); }

// ---------------------------------------------------------------------------
// Helpers HTTP
// ---------------------------------------------------------------------------
function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      method,
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  try {
    // 1. Buscar tarefa para obter status atual e list_id
    console.log(`\n🔍  Buscando tarefa ${TASK_ID}...`);
    const task = await request('GET', `https://api.clickup.com/api/v2/task/${TASK_ID}`);

    const taskName     = task.name;
    const currentStatus = task.status?.status?.toLowerCase();
    const listId       = task.list?.id;

    console.log(`📌  Tarefa: "${taskName}"`);
    console.log(`📍  Status atual: "${task.status?.status}"`);

    // 2. Se --status foi passado, mover direto para ele
    if (FORCE_STATUS) {
      console.log(`⏭️   Movendo para status forçado: "${FORCE_STATUS}"...`);
      await request('PUT', `https://api.clickup.com/api/v2/task/${TASK_ID}`, {
        status: FORCE_STATUS,
      });
      console.log(`✅  Tarefa movida para "${FORCE_STATUS}" com sucesso!`);
      console.log(`🔗  https://app.clickup.com/t/${TASK_ID}\n`);
      return;
    }

    // 3. Buscar todos os status da lista (em ordem)
    if (!listId) {
      throw new Error('Não foi possível identificar a lista desta tarefa.');
    }

    const listData = await request('GET', `https://api.clickup.com/api/v2/list/${listId}`);
    const statuses = (listData.statuses || [])
      .sort((a, b) => a.orderindex - b.orderindex);

    if (statuses.length === 0) {
      throw new Error('Nenhum status encontrado para esta lista.');
    }

    // 4. Exibir pipeline de status
    const pipeline = statuses.map(s => s.status).join(' → ');
    console.log(`\n🔄  Pipeline: ${pipeline}`);

    // 5. Encontrar próximo status
    const currentIdx = statuses.findIndex(s => s.status.toLowerCase() === currentStatus);

    if (currentIdx === -1) {
      throw new Error(`Status atual "${task.status?.status}" não encontrado no pipeline da lista.`);
    }

    if (currentIdx === statuses.length - 1) {
      console.log(`\n⚠️   A tarefa já está no último status: "${statuses[currentIdx].status}"`);
      console.log(`    Para forçar um status, use: --status "NOME_STATUS"\n`);
      return;
    }

    const nextStatus = statuses[currentIdx + 1];

    // 6. Mover para próximo status
    console.log(`\n⏭️   Movendo: "${statuses[currentIdx].status}" → "${nextStatus.status}"...`);
    await request('PUT', `https://api.clickup.com/api/v2/task/${TASK_ID}`, {
      status: nextStatus.status,
    });

    console.log(`✅  Tarefa movida com sucesso!`);
    console.log(`    "${taskName}" agora está em: "${nextStatus.status}"`);
    console.log(`🔗  https://app.clickup.com/t/${TASK_ID}\n`);

  } catch (err) {
    console.error('❌  Erro:', err.message);
    process.exit(1);
  }
})();
