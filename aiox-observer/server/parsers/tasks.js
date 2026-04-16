// Parser: extract task info from hook event payloads

const TOOL_CATEGORIES = {
  read: ['Read', 'Glob', 'Grep'],
  write: ['Write', 'Edit'],
  exec: ['Bash'],
  ai: ['Task', 'TaskCreate', 'TaskUpdate', 'TaskGet'],
};

/**
 * @param {object} event - raw hook event
 * @returns {{ category: string, label: string }}
 */
function parseTask(event) {
  const tool = event.tool_name || '';

  let category = 'other';
  for (const [cat, tools] of Object.entries(TOOL_CATEGORIES)) {
    if (tools.includes(tool)) {
      category = cat;
      break;
    }
  }

  const input = event.tool_input;
  let label = tool;

  if (input) {
    const str = typeof input === 'object' ? JSON.stringify(input) : String(input);
    label = `${tool}: ${str.slice(0, 80)}`;
  }

  return { category, label };
}

module.exports = { parseTask };
