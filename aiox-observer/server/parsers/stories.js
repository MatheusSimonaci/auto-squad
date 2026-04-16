// Parser: extract story references from hook event payloads

/**
 * @param {object} event - raw hook event
 * @returns {string|null} story path if detected
 */
function parseStoryRef(event) {
  const candidates = [
    event.tool_input,
    event.cwd,
    event.file_path
  ];

  for (const c of candidates) {
    if (!c) continue;
    const str = typeof c === 'object' ? JSON.stringify(c) : String(c);
    const match = str.match(/docs\/stories\/([^\s"']+\.story\.md)/);
    if (match) return match[1];
  }

  return null;
}

module.exports = { parseStoryRef };
