/**
 * ClickUp — Acrescentar informações na descrição de uma tarefa
 * (converte Markdown para rich text ProseMirror/Doc antes de enviar)
 *
 * Uso:
 *   node integrations/clickup/append-description.js <TASK_ID> "<CONTEUDO>"
 *
 * Exemplos:
 *   node integrations/clickup/append-description.js 86agbyhpk "Roteiro revisado em 22/03"
 *   node integrations/clickup/append-description.js 86agbyhpk "$(cat roteiro.txt)"
 *
 * Variáveis de ambiente alternativas:
 *   CLICKUP_TASK_ID=86agbyhpk CLICKUP_APPEND="texto" node append-description.js
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { spawnSync } = require('child_process');

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

// ---------------------------------------------------------------------------
// Markdown → ProseMirror Doc
// ---------------------------------------------------------------------------

/**
 * Cria um nó de texto ProseMirror com marks opcionais.
 * @param {string} text
 * @param {object[]} marks
 * @returns {object|null}
 */
function makeText(text, marks) {
  if (!text) return null;
  const node = { type: 'text', text };
  if (marks && marks.length > 0) node.marks = marks;
  return node;
}

// Tokenizador de marks inline em ordem de prioridade:
//   grupo 1 → code inline   `texto`
//   grupo 2 → link text,  grupo 3 → link href   [texto](url)
//   grupo 4 → bold+italic  ***texto***
//   grupo 5 → bold         **texto**
//   grupo 6 → italic *     *texto*
//   grupo 7 → italic _     _texto_
const INLINE_RE = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*\n]+?)\*|_([^_\n]+?)_/g;

/**
 * Faz parse de Markdown inline em nós de texto ProseMirror.
 * Suporta aninhamento de marks por recursão (bold com italic interno, etc.).
 *
 * @param {string} text
 * @param {object[]} [inheritedMarks] - marks herdados da chamada pai
 * @returns {object[]}
 */
function parseInline(text, inheritedMarks = []) {
  if (!text) return [];

  const nodes = [];
  const re    = new RegExp(INLINE_RE.source, 'g'); // instância fresca por chamada
  let lastIndex = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    // Texto literal antes do match
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) nodes.push(makeText(plain, inheritedMarks));
    }

    if (match[1] !== undefined) {
      // Code inline: `texto`
      nodes.push(makeText(match[1], [...inheritedMarks, { type: 'code' }]));

    } else if (match[2] !== undefined) {
      // Link: [texto](url)
      nodes.push(makeText(match[2], [
        ...inheritedMarks,
        { type: 'link', attrs: { href: match[3] } },
      ]));

    } else if (match[4] !== undefined) {
      // Bold + Italic: ***texto***
      nodes.push(...parseInline(match[4], [
        ...inheritedMarks,
        { type: 'bold' },
        { type: 'italic' },
      ]));

    } else if (match[5] !== undefined) {
      // Bold: **texto** — recursivo para permitir italic interno
      nodes.push(...parseInline(match[5], [...inheritedMarks, { type: 'bold' }]));

    } else {
      // Italic: *texto* ou _texto_
      const inner = match[6] !== undefined ? match[6] : match[7];
      nodes.push(...parseInline(inner, [...inheritedMarks, { type: 'italic' }]));
    }

    lastIndex = re.lastIndex;
  }

  // Texto restante após o último match
  if (lastIndex < text.length) {
    nodes.push(makeText(text.slice(lastIndex), inheritedMarks));
  }

  return nodes.filter(Boolean);
}

// Detecta linha horizontal: ---, ***, ___, - - -, * * * etc.
const HR_RE = /^([-*_] *){3,}$/;

/**
 * Converte uma string Markdown em um documento ProseMirror (ClickUp Doc Schema).
 * Função pura — sem efeitos colaterais, sem dependências externas.
 *
 * Suporta: headings (#–######), parágrafos, bold, italic, bold+italic,
 * code inline, links, bullet list, ordered list, fenced code block,
 * horizontal rule. Linhas em branco separam blocos.
 *
 * @param {string} markdown
 * @returns {{ type: 'doc', content: object[] }}
 */
function markdownToDoc(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return { type: 'doc', content: [] };
  }

  const lines = markdown.split('\n');
  const nodes = [];
  let   i     = 0;

  while (i < lines.length) {
    const raw     = lines[i];
    const trimmed = raw.trim();

    // Linhas em branco entre blocos
    if (trimmed === '') { i++; continue; }

    // ── Bloco de código (fenced ```) ─────────────────────────────────────
    if (trimmed.startsWith('```')) {
      const lang      = trimmed.slice(3).trim() || null;
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consome o ``` de fechamento (ou EOF)
      nodes.push({
        type   : 'codeBlock',
        attrs  : { language: lang },
        content: codeLines.length
          ? [{ type: 'text', text: codeLines.join('\n') }]
          : [],
      });
      continue;
    }

    // ── Linha horizontal (verificado ANTES de bullet para capturar - - -) ─
    if (HR_RE.test(trimmed)) {
      nodes.push({ type: 'horizontalRule' });
      i++;
      continue;
    }

    // ── Heading ──────────────────────────────────────────────────────────
    const headMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (headMatch) {
      nodes.push({
        type   : 'heading',
        attrs  : { level: headMatch[1].length },
        content: parseInline(headMatch[2]),
      });
      i++;
      continue;
    }

    // ── Bullet list ──────────────────────────────────────────────────────
    if (/^[-*+] /.test(trimmed)) {
      const items = [];
      while (
        i < lines.length &&
        /^[-*+] /.test(lines[i].trim()) &&
        !HR_RE.test(lines[i].trim()) // evita capturar - - - como item
      ) {
        const text = lines[i].trim().replace(/^[-*+] /, '');
        items.push({
          type   : 'listItem',
          content: [{ type: 'paragraph', content: parseInline(text) }],
        });
        i++;
      }
      if (items.length) nodes.push({ type: 'bulletList', content: items });
      continue;
    }

    // ── Ordered list ─────────────────────────────────────────────────────
    if (/^\d+\. /.test(trimmed)) {
      const startMatch = trimmed.match(/^(\d+)\./);
      const order      = parseInt(startMatch[1], 10);
      const items      = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        const text = lines[i].trim().replace(/^\d+\. /, '');
        items.push({
          type   : 'listItem',
          content: [{ type: 'paragraph', content: parseInline(text) }],
        });
        i++;
      }
      nodes.push({ type: 'orderedList', attrs: { order }, content: items });
      continue;
    }

    // ── Parágrafo (agrupa linhas consecutivas não-bloco) ─────────────────
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('```') &&
      !HR_RE.test(lines[i].trim()) &&
      !/^[-*+] /.test(lines[i].trim()) &&
      !/^\d+\. /.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      nodes.push({
        type   : 'paragraph',
        content: parseInline(paraLines.join(' ')),
      });
    }
    // Safety: se nenhum padrão consumiu a linha atual, avança para evitar loop infinito
    if (i < lines.length && lines[i].trim() !== '' && paraLines.length === 0) {
      nodes.push({ type: 'paragraph', content: parseInline(lines[i].trim()) });
      i++;
    }
  }

  return { type: 'doc', content: nodes };
}

// ---------------------------------------------------------------------------
// Conversor de tabela Markdown → lista numerada
// ClickUp não renderiza pipe tables em task descriptions.
// ---------------------------------------------------------------------------

/**
 * Converte blocos de tabela Markdown (pipe syntax) em listas numeradas legíveis.
 * Cada linha de dados vira um item numerado com "ColA: valA | ColB: valB ...".
 * Linhas separadoras (|---|) são ignoradas.
 *
 * @param {string} markdown
 * @returns {string}
 */
function convertTablesToLists(markdown) {
  if (!markdown) return markdown;

  const lines  = markdown.split('\n');
  const output = [];
  let   i      = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detecta início de tabela: linha com pipe e pelo menos duas colunas
    if (/^\|.+\|/.test(line.trim())) {
      // Coleta todas as linhas da tabela
      const tableLines = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }

      // Primeira linha = cabeçalho
      const headers = tableLines[0]
        .split('|')
        .map(c => c.trim())
        .filter(Boolean);

      // Separa linhas de dados (ignora separadores |---|)
      const dataRows = tableLines.slice(1).filter(
        row => !/^\|[\s\-|:]+\|/.test(row.trim())
      );

      if (dataRows.length === 0) {
        // Sem dados — mantém como texto simples
        output.push(...tableLines);
        continue;
      }

      let itemNum = 1;
      for (const row of dataRows) {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean);
        const parts = headers.map((h, idx) => {
          const val = cells[idx] || '';
          return val ? `**${h}:** ${val}` : null;
        }).filter(Boolean);
        output.push(`${itemNum}. ${parts.join(' | ')}`);
        itemNum++;
      }
      continue;
    }

    output.push(line);
    i++;
  }

  return output.join('\n');
}

// ---------------------------------------------------------------------------
// Helpers HTTP (usa curl como transporte para compatibilidade com firewalls)
// ---------------------------------------------------------------------------
function request(method, url, body, apiKey) {
  return new Promise((resolve, reject) => {
    try {
      const payload = body ? JSON.stringify(body) : null;

      // Escreve o body em arquivo temp para evitar problemas de escaping
      let tmpFile = null;
      const args = ['-s', '-w', '\n__STATUS__%{http_code}', '-X', method,
        '-H', `Authorization: ${apiKey}`,
        '-H', 'Content-Type: application/json',
      ];
      if (payload) {
        tmpFile = path.join(require('os').tmpdir(), `cu_body_${Date.now()}.json`);
        fs.writeFileSync(tmpFile, payload, 'utf8');
        args.push('-d', `@${tmpFile}`);
      }
      args.push(url);

      const result = spawnSync('curl', args, { encoding: 'utf8', timeout: 30000 });
      if (tmpFile) try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }

      if (result.error) { reject(result.error); return; }

      const raw   = result.stdout || '';
      const split = raw.lastIndexOf('\n__STATUS__');
      const data  = split !== -1 ? raw.slice(0, split) : raw;
      const status = split !== -1 ? parseInt(raw.slice(split + 11), 10) : 200;

      if (status >= 400) { reject(new Error(`HTTP ${status}: ${data}`)); return; }
      try { resolve(JSON.parse(data)); }
      catch { resolve(data); }
    } catch (err) {
      reject(err);
    }
  });
}

// ---------------------------------------------------------------------------
// Main (somente quando executado diretamente)
// ---------------------------------------------------------------------------
if (require.main === module) {
  loadEnv();

  const TASK_ID  = process.argv[2] || process.env.CLICKUP_TASK_ID;
  const NEW_TEXT = process.argv[3] || process.env.CLICKUP_APPEND;
  const API_KEY  = process.env.CLICKUP_API_KEY;

  if (!API_KEY)  { console.error('❌  CLICKUP_API_KEY não encontrada no .env'); process.exit(1); }
  if (!TASK_ID)  { console.error('❌  TASK_ID não informado.\n   Uso: node append-description.js <TASK_ID> "<CONTEUDO>"'); process.exit(1); }
  if (!NEW_TEXT) { console.error('❌  Conteúdo não informado.\n   Uso: node append-description.js <TASK_ID> "<CONTEUDO>"'); process.exit(1); }

  (async () => {
    try {
      // 1. Buscar tarefa atual
      console.log(`\n🔍  Buscando tarefa ${TASK_ID}...`);
      const task = await request('GET', `https://api.clickup.com/api/v2/task/${TASK_ID}`, null, API_KEY);

      const taskName    = task.name || TASK_ID;
      const currentDesc = (task.markdown_description || task.description || '').trim();

      // 2. Converter tabelas markdown → listas (ClickUp não renderiza pipe tables)
      const prepared   = convertTablesToLists(NEW_TEXT);
      const separator  = currentDesc ? '\n\n---\n\n' : '';
      const mergedDesc = currentDesc + separator + prepared.trim();

      // 3. Atualizar via markdown_description (campo correto desde abril 2024)
      console.log(`✏️   Atualizando descrição de "${taskName}"...`);
      await request('PUT', `https://api.clickup.com/api/v2/task/${TASK_ID}`, {
        markdown_description: mergedDesc,
      }, API_KEY);

      console.log(`✅  Descrição atualizada com sucesso!`);
      console.log(`\n📋  Prévia do conteúdo adicionado:`);
      console.log(`    "${NEW_TEXT.slice(0, 120)}${NEW_TEXT.length > 120 ? '...' : ''}"`);
      console.log(`\n🔗  https://app.clickup.com/t/${TASK_ID}\n`);

    } catch (err) {
      console.error('❌  Erro:', err.message);
      process.exit(1);
    }
  })();
}

module.exports = { markdownToDoc, parseInline };
