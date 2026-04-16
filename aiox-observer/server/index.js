const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { apiKeyMiddleware, rateLimitMiddleware, DEFAULT_API_KEY } = require('./middleware');

const PORT = 7433;
const DB_PATH = path.join(__dirname, 'observer.db');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);

// Log API key on startup
console.log(`[aiox-observer] API Key: ${DEFAULT_API_KEY}`);
console.log(`[aiox-observer] Set X-API-Key header to this value for API requests`);

// Initialize DB
db.init(DB_PATH);

// ── POST /hooks ────────────────────────────────────────────────────────────────
app.post('/hooks', (req, res) => {
  const payload = req.body;
  const sessionId = payload.session_id || payload.sessionId || 'default';

  try {
    db.insertEvent(sessionId, payload);
    io.emit('event', { sessionId, ...payload });
    res.json({ ok: true });
  } catch (err) {
    console.error('[hooks] error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/state ─────────────────────────────────────────────────────────────
app.get('/api/state', async (req, res) => {
  const sessionId = req.query.session_id || 'default';
  try {
    const state = await db.getState(sessionId);
    res.json(state);
  } catch (err) {
    console.error('[state] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/stories ───────────────────────────────────────────────────────────
app.get('/api/stories', async (req, res) => {
  const sessionId = req.query.session_id || 'default';
  try {
    // Stories are inferred from events where tool_input references docs/stories
    const events = await db.getRecentEvents(sessionId, 200);
    const storySet = new Map();

    for (const ev of events) {
      const input = ev.tool_input || '';
      const match = input.match(/docs\/stories\/([^\s"']+\.story\.md)/);
      if (match) {
        const storyPath = match[1];
        if (!storySet.has(storyPath)) {
          storySet.set(storyPath, {
            path: storyPath,
            last_seen: ev.timestamp,
            squad: ev.squad_hint
          });
        }
      }
    }

    res.json({ stories: Array.from(storySet.values()) });
  } catch (err) {
    console.error('[stories] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/agents ────────────────────────────────────────────────────────────
app.get('/api/agents', async (req, res) => {
  const sessionId = req.query.session_id || 'default';
  try {
    const state = await db.getState(sessionId);
    res.json({ agents: state.agents });
  } catch (err) {
    console.error('[agents] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/tasks ─────────────────────────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  const sessionId = req.query.session_id || 'default';
  try {
    const events = await db.getRecentEvents(sessionId, 100);
    // Tasks are tool-use events
    const tasks = events
      .filter(ev => ev.tool_name)
      .map(ev => ({
        id: ev.id,
        tool: ev.tool_name,
        agent: ev.agent_hint,
        squad: ev.squad_hint,
        timestamp: ev.timestamp,
        summary: ev.tool_input
          ? String(ev.tool_input).slice(0, 120)
          : null
      }));

    res.json({ tasks });
  } catch (err) {
    console.error('[tasks] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/execute ──────────────────────────────────────────────────────────
const { Anthropic } = require('@anthropic-ai/sdk');

app.post('/api/execute', async (req, res) => {
  try {
    const { card, agentId, sessionId } = req.body;

    if (!card) {
      return res.status(400).json({ error: 'Missing card data' });
    }

    // Log execution attempt
    const event = {
      session_id: sessionId || 'unknown',
      type: 'workflow_execution',
      tool_name: `execute_${card.type}`,
      tool_input: JSON.stringify({ card, agentId }),
      agent_hint: agentId || 'auto',
      squad_hint: card.deck,
      timestamp: Date.now(),
    };

    try {
      db.insertEvent(event.session_id, event);
      io.emit('event', event);
    } catch (e) {
      console.error('Failed to log event:', e);
    }

    // If agentId specified, invoke that agent
    if (agentId) {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Execute workflow: ${card.name}\nCard details: ${JSON.stringify(card)}`,
          },
        ],
      });

      return res.json({
        success: true,
        agent: agentId,
        card: card.name,
        response: response.content[0].text,
      });
    } else {
      // Full workflow execution
      return res.json({
        success: true,
        card: card.name,
        message: 'Workflow execution started with full agent team',
        agents: card.agents,
      });
    }
  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/workflows ─────────────────────────────────────────────────────────
const fs = require('fs');

const SQUAD_ICONS = {
  'marketing-clones': '📱',
  'apex': '🚀',
  'curator': '🎬',
  'deep-research': '🔬',
  'dispatch': '📬',
  'education': '🎓',
  'kaizen': '♻️',
  'seo': '🔍',
  'squad-creator': '⚙️',
};

function parseWorkflowMeta(content) {
  const lines = content.split(/\r?\n/);
  const result = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Block scalar must be checked before plain kv (both match "key: |")
    const block = line.match(/^([\w-]+):\s*[|>]/);
    if (block && !result[block[1]]) {
      for (let j = i + 1; j < lines.length; j++) {
        const trimmed = lines[j].trim();
        if (trimmed) { result[block[1]] = trimmed; break; }
      }
      continue;
    }
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv && !result[kv[1]]) {
      result[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

app.get('/api/workflows', (req, res) => {
  try {
    const squadsDir = path.join(__dirname, '../../squads');
    if (!fs.existsSync(squadsDir)) return res.json({ workflows: [] });

    const workflows = [];
    for (const squad of fs.readdirSync(squadsDir)) {
      const wfDir = path.join(squadsDir, squad, 'workflows');
      if (!fs.existsSync(wfDir)) continue;

      for (const file of fs.readdirSync(wfDir)) {
        if (!file.startsWith('wf-') || !file.endsWith('.yaml')) continue;
        try {
          const content = fs.readFileSync(path.join(wfDir, file), 'utf8');
          const meta = parseWorkflowMeta(content);
          const complexity = (meta['complexity'] || 'medium').toLowerCase();
          const cost = complexity === 'high' || complexity === 'complex' ? 5
            : complexity === 'low' || complexity === 'simple' ? 2 : 3;

          workflows.push({
            id: meta['workflow-id'] || meta['id'] || file.replace('.yaml', ''),
            name: meta['name'] || meta['title'] || file.replace('.yaml', ''),
            type: 'squad',
            cost,
            description: (meta['description'] || '').substring(0, 180),
            agents: [],
            deck: 'squads',
            icon: SQUAD_ICONS[squad] || '⚡',
            flavor: `Squad: ${squad}`,
            stats: { points: cost, type: squad },
          });
        } catch (_) { /* skip malformed files */ }
      }
    }

    res.json({ workflows });
  } catch (err) {
    console.error('[workflows] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── WebSocket ──────────────────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log('[ws] client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('[ws] client disconnected:', socket.id);
  });
});

// ── Start ──────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`[aiox-observer] server running on http://localhost:${PORT}`);
});
