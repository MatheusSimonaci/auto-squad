/**
 * ClickUp — Listar todos os Spaces > Folders > Lists com seus IDs reais
 *
 * Uso:
 *   node integrations/clickup/list-ids.js
 *
 * Filtragem opcional por nome (case-insensitive):
 *   node integrations/clickup/list-ids.js roteiro
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Carregar .env
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

const API_KEY = process.env.CLICKUP_API_KEY;
const FILTER  = (process.argv[2] || '').toLowerCase();

if (!API_KEY) {
  console.error('❌  CLICKUP_API_KEY não encontrada no .env');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
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

(async () => {
  try {
    // 1. Buscar workspaces (teams)
    const { teams } = await get('https://api.clickup.com/api/v2/team');
    console.log(`\n🏢  ${teams.length} workspace(s) encontrado(s)\n`);

    for (const team of teams) {
      console.log(`\n══════════════════════════════════════════════`);
      console.log(`Workspace: ${team.name}  (id: ${team.id})`);
      console.log(`══════════════════════════════════════════════`);

      // 2. Spaces do workspace
      const { spaces } = await get(`https://api.clickup.com/api/v2/team/${team.id}/space?archived=false`);

      for (const space of spaces) {
        console.log(`\n  📂  Space: ${space.name}  (id: ${space.id})`);

        // 3. Folders do space
        const { folders } = await get(`https://api.clickup.com/api/v2/space/${space.id}/folder?archived=false`);

        for (const folder of folders) {
          console.log(`\n    📁  Folder: ${folder.name}  (id: ${folder.id})`);

          // 4. Lists dentro do folder
          const { lists } = await get(`https://api.clickup.com/api/v2/folder/${folder.id}/list?archived=false`);
          for (const list of lists) {
            const match = !FILTER || list.name.toLowerCase().includes(FILTER);
            const marker = match ? '✅' : '  ';
            console.log(`         ${marker} Lista: "${list.name}"  →  ID: ${list.id}  (tarefas: ${list.task_count ?? '?'})`);
          }
        }

        // 5. Lists sem folder (folderless)
        const { lists: folderlessLists } = await get(`https://api.clickup.com/api/v2/space/${space.id}/list?archived=false`);
        if (folderlessLists.length > 0) {
          console.log(`\n    📋  Listas sem pasta:`);
          for (const list of folderlessLists) {
            const match = !FILTER || list.name.toLowerCase().includes(FILTER);
            const marker = match ? '✅' : '  ';
            console.log(`         ${marker} Lista: "${list.name}"  →  ID: ${list.id}  (tarefas: ${list.task_count ?? '?'})`);
          }
        }
      }
    }

    console.log('\n\n💡  Use o ID numérico com o script get-activities.js:');
    console.log('    node integrations/clickup/get-activities.js <ID_NUMERICO> "ROTEIRO"\n');

  } catch (err) {
    console.error('❌  Erro:', err.message);
    process.exit(1);
  }
})();
