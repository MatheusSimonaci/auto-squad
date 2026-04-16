const sqlite3 = require('sqlite3').verbose();

let db;

function detectSquad(filePath) {
  if (filePath?.includes('squads/strategic-mentors/')) return 'mentors';
  if (filePath?.includes('squads/marketing-clones/')) return 'marketing';
  return 'aiox';
}

function init(dbPath) {
  db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        cwd TEXT,
        started_at INTEGER,
        ended_at INTEGER
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        type TEXT,
        tool_name TEXT,
        tool_input TEXT,
        tool_output TEXT,
        agent_hint TEXT,
        squad_hint TEXT,
        timestamp INTEGER
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS agent_states (
        agent_id TEXT,
        session_id TEXT,
        status TEXT,
        current_task TEXT,
        last_update INTEGER,
        PRIMARY KEY (agent_id, session_id)
      )
    `);
  });

  return db;
}

function insertEvent(sessionId, event) {
  const {
    type = null,
    tool_name = null,
    tool_input = null,
    tool_output = null,
    agent_hint = null,
    cwd = null
  } = event;

  const squad_hint = detectSquad(cwd || tool_input);
  const timestamp = Date.now();

  // Upsert session
  db.run(
    `INSERT OR IGNORE INTO sessions (id, cwd, started_at) VALUES (?, ?, ?)`,
    [sessionId, cwd, timestamp]
  );

  db.run(
    `INSERT INTO events (session_id, type, tool_name, tool_input, tool_output, agent_hint, squad_hint, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      type,
      tool_name,
      typeof tool_input === 'object' ? JSON.stringify(tool_input) : tool_input,
      typeof tool_output === 'object' ? JSON.stringify(tool_output) : tool_output,
      agent_hint,
      squad_hint,
      timestamp
    ]
  );
}

function getRecentEvents(sessionId, limit = 50) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM events WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?`,
      [sessionId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function updateAgentState(agentId, sessionId, status, currentTask) {
  db.run(
    `INSERT INTO agent_states (agent_id, session_id, status, current_task, last_update)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(agent_id, session_id) DO UPDATE SET
       status = excluded.status,
       current_task = excluded.current_task,
       last_update = excluded.last_update`,
    [agentId, sessionId, status, currentTask, Date.now()]
  );
}

function getState(sessionId) {
  return new Promise((resolve, reject) => {
    const result = {};

    db.get(
      `SELECT * FROM sessions WHERE id = ?`,
      [sessionId],
      (err, session) => {
        if (err) return reject(err);
        result.session = session || null;

        db.all(
          `SELECT * FROM agent_states WHERE session_id = ?`,
          [sessionId],
          (err2, agents) => {
            if (err2) return reject(err2);
            result.agents = agents || [];

            db.all(
              `SELECT * FROM events WHERE session_id = ? ORDER BY timestamp DESC LIMIT 20`,
              [sessionId],
              (err3, events) => {
                if (err3) return reject(err3);
                result.recentEvents = events || [];
                resolve(result);
              }
            );
          }
        );
      }
    );
  });
}

module.exports = { init, insertEvent, getRecentEvents, updateAgentState, getState };
