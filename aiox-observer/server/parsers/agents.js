// Parser: detect active agent from hook event payloads

const AGENT_PATTERNS = [
  { pattern: /@dev\b|Dex\b/, id: 'dev', name: 'Dex' },
  { pattern: /@qa\b|Quinn\b/, id: 'qa', name: 'Quinn' },
  { pattern: /@architect\b|Aria\b/, id: 'architect', name: 'Aria' },
  { pattern: /@pm\b|Morgan\b/, id: 'pm', name: 'Morgan' },
  { pattern: /@po\b|Pax\b/, id: 'po', name: 'Pax' },
  { pattern: /@sm\b|River\b/, id: 'sm', name: 'River' },
  { pattern: /@analyst\b|Alex\b/, id: 'analyst', name: 'Alex' },
  { pattern: /@data-engineer\b|Dara\b/, id: 'data-engineer', name: 'Dara' },
  { pattern: /@devops\b|Gage\b/, id: 'devops', name: 'Gage' },
];

/**
 * @param {object} event - raw hook event
 * @returns {{ id: string, name: string }|null}
 */
function parseAgent(event) {
  const text = [event.tool_input, event.agent_hint]
    .filter(Boolean)
    .map(v => (typeof v === 'object' ? JSON.stringify(v) : String(v)))
    .join(' ');

  for (const { pattern, id, name } of AGENT_PATTERNS) {
    if (pattern.test(text)) return { id, name };
  }

  return null;
}

module.exports = { parseAgent };
