'use strict';

/**
 * Testes unitários para markdownToDoc() e parseInline()
 * Uso: node integrations/clickup/append-description.test.js
 */

const assert = require('assert');
const { markdownToDoc, parseInline } = require('./append-description');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅  ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${description}`);
    console.error(`      ${err.message}`);
    failed++;
  }
}

const eq = assert.deepStrictEqual.bind(assert);

// ===========================================================================
console.log('\n🧪  markdownToDoc — testes unitários\n');

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------
console.log('── Edge cases ──────────────────────────────────────────');

test('string vazia → doc vazio', () => {
  eq(markdownToDoc(''), { type: 'doc', content: [] });
});

test('null → doc vazio', () => {
  eq(markdownToDoc(null), { type: 'doc', content: [] });
});

test('undefined → doc vazio', () => {
  eq(markdownToDoc(undefined), { type: 'doc', content: [] });
});

test('só espaços/quebras → doc vazio', () => {
  eq(markdownToDoc('   \n  \n  '), { type: 'doc', content: [] });
});

test('retorna sempre type: doc', () => {
  assert.strictEqual(markdownToDoc('qualquer coisa').type, 'doc');
  assert.ok(Array.isArray(markdownToDoc('qualquer coisa').content));
});

// ---------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------
console.log('\n── Headings ────────────────────────────────────────────');

test('# H1 → heading level 1', () => {
  eq(markdownToDoc('# Título').content, [{
    type   : 'heading',
    attrs  : { level: 1 },
    content: [{ type: 'text', text: 'Título' }],
  }]);
});

test('## H2 → heading level 2', () => {
  assert.strictEqual(markdownToDoc('## Sub').content[0].attrs.level, 2);
});

test('### H3 → heading level 3', () => {
  assert.strictEqual(markdownToDoc('### Seção').content[0].attrs.level, 3);
});

test('###### H6 → heading level 6', () => {
  assert.strictEqual(markdownToDoc('###### Micro').content[0].attrs.level, 6);
});

test('heading com inline bold preserva marks', () => {
  const node = markdownToDoc('# Título **importante**').content[0];
  assert.strictEqual(node.type, 'heading');
  const boldNode = node.content.find(n => n.marks && n.marks[0].type === 'bold');
  assert.ok(boldNode, 'deve conter nó bold dentro do heading');
});

// ---------------------------------------------------------------------------
// Parágrafos
// ---------------------------------------------------------------------------
console.log('\n── Parágrafos ──────────────────────────────────────────');

test('texto simples → parágrafo com texto', () => {
  eq(markdownToDoc('Olá mundo').content, [{
    type   : 'paragraph',
    content: [{ type: 'text', text: 'Olá mundo' }],
  }]);
});

test('linhas consecutivas → parágrafo único (joined por espaço)', () => {
  const doc = markdownToDoc('linha 1\nlinha 2');
  assert.strictEqual(doc.content.length, 1);
  assert.strictEqual(doc.content[0].type, 'paragraph');
  assert.strictEqual(doc.content[0].content[0].text, 'linha 1 linha 2');
});

test('linhas separadas por blank → dois parágrafos independentes', () => {
  const doc = markdownToDoc('primeiro\n\nsegundo');
  assert.strictEqual(doc.content.length, 2);
  assert.strictEqual(doc.content[0].content[0].text, 'primeiro');
  assert.strictEqual(doc.content[1].content[0].text, 'segundo');
});

// ---------------------------------------------------------------------------
// Bold
// ---------------------------------------------------------------------------
console.log('\n── Bold ────────────────────────────────────────────────');

test('**texto** → mark bold', () => {
  eq(parseInline('**negrito**'), [{
    type : 'text',
    text : 'negrito',
    marks: [{ type: 'bold' }],
  }]);
});

test('texto **bold** texto → 3 nós (plain / bold / plain)', () => {
  const nodes = parseInline('antes **negrito** depois');
  assert.strictEqual(nodes.length, 3);
  assert.strictEqual(nodes[0].text, 'antes ');
  assert.ok(!nodes[0].marks);
  assert.strictEqual(nodes[1].marks[0].type, 'bold');
  assert.strictEqual(nodes[2].text, ' depois');
});

// ---------------------------------------------------------------------------
// Italic
// ---------------------------------------------------------------------------
console.log('\n── Italic ──────────────────────────────────────────────');

test('*texto* → mark italic', () => {
  eq(parseInline('*itálico*'), [{
    type : 'text',
    text : 'itálico',
    marks: [{ type: 'italic' }],
  }]);
});

test('_texto_ → mark italic', () => {
  eq(parseInline('_itálico_'), [{
    type : 'text',
    text : 'itálico',
    marks: [{ type: 'italic' }],
  }]);
});

// ---------------------------------------------------------------------------
// Bold + Italic (aninhamento)
// ---------------------------------------------------------------------------
console.log('\n── Bold + Italic ───────────────────────────────────────');

test('***texto*** → marks bold e italic no mesmo nó', () => {
  const nodes = parseInline('***bold italic***');
  assert.strictEqual(nodes.length, 1);
  assert.strictEqual(nodes[0].text, 'bold italic');
  const types = nodes[0].marks.map(m => m.type);
  assert.ok(types.includes('bold'),   'deve ter mark bold');
  assert.ok(types.includes('italic'), 'deve ter mark italic');
});

test('**bold _italic_ bold** → nó bold + nó bold+italic + nó bold', () => {
  const nodes = parseInline('**bold _italic_ end**');
  assert.ok(nodes.length >= 2, 'deve ter pelo menos 2 nós');
  const boldItalic = nodes.find(n =>
    n.marks &&
    n.marks.some(m => m.type === 'bold') &&
    n.marks.some(m => m.type === 'italic')
  );
  assert.ok(boldItalic, 'deve existir nó com bold+italic simultaneamente');
  assert.strictEqual(boldItalic.text, 'italic');
});

// ---------------------------------------------------------------------------
// Code inline
// ---------------------------------------------------------------------------
console.log('\n── Code inline ─────────────────────────────────────────');

test('`código` → mark code', () => {
  eq(parseInline('`inline code`'), [{
    type : 'text',
    text : 'inline code',
    marks: [{ type: 'code' }],
  }]);
});

test('code inline não processa marks internos', () => {
  // O conteúdo do code inline deve ser literal
  const nodes = parseInline('`**não bold**`');
  assert.strictEqual(nodes[0].text, '**não bold**');
  assert.strictEqual(nodes[0].marks[0].type, 'code');
});

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
console.log('\n── Links ───────────────────────────────────────────────');

test('[texto](url) → mark link com attrs.href', () => {
  eq(parseInline('[Google](https://google.com)'), [{
    type : 'text',
    text : 'Google',
    marks: [{ type: 'link', attrs: { href: 'https://google.com' } }],
  }]);
});

test('link preserva texto de exibição e href separados', () => {
  const nodes = parseInline('[ClickUp](https://app.clickup.com)');
  assert.strictEqual(nodes[0].text, 'ClickUp');
  assert.strictEqual(nodes[0].marks[0].attrs.href, 'https://app.clickup.com');
});

// ---------------------------------------------------------------------------
// Bullet list
// ---------------------------------------------------------------------------
console.log('\n── Bullet list ─────────────────────────────────────────');

test('- item → bulletList com listItem e paragraph', () => {
  eq(markdownToDoc('- item 1\n- item 2\n- item 3').content, [{
    type   : 'bulletList',
    content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'item 1' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'item 2' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'item 3' }] }] },
    ],
  }]);
});

test('* item → bulletList (marcador asterisco)', () => {
  const doc = markdownToDoc('* alpha\n* beta');
  assert.strictEqual(doc.content[0].type, 'bulletList');
  assert.strictEqual(doc.content[0].content.length, 2);
});

test('+ item → bulletList (marcador plus)', () => {
  const doc = markdownToDoc('+ alpha\n+ beta');
  assert.strictEqual(doc.content[0].type, 'bulletList');
});

test('bullet com inline marks → preserva marks nos nós filhos', () => {
  const doc   = markdownToDoc('- item **negrito**');
  const inner = doc.content[0].content[0].content[0].content;
  const bold  = inner.find(n => n.marks && n.marks[0].type === 'bold');
  assert.ok(bold, 'item de lista deve preservar mark bold');
});

// ---------------------------------------------------------------------------
// Ordered list
// ---------------------------------------------------------------------------
console.log('\n── Ordered list ────────────────────────────────────────');

test('1. item → orderedList com attrs.order: 1', () => {
  const doc = markdownToDoc('1. primeiro\n2. segundo');
  assert.strictEqual(doc.content[0].type, 'orderedList');
  assert.strictEqual(doc.content[0].attrs.order, 1);
  assert.strictEqual(doc.content[0].content.length, 2);
  assert.strictEqual(
    doc.content[0].content[0].content[0].content[0].text,
    'primeiro'
  );
});

test('3. item → orderedList com attrs.order: 3 (início customizado)', () => {
  const doc = markdownToDoc('3. terceiro\n4. quarto');
  assert.strictEqual(doc.content[0].attrs.order, 3);
  assert.strictEqual(doc.content[0].content.length, 2);
});

// ---------------------------------------------------------------------------
// Code block
// ---------------------------------------------------------------------------
console.log('\n── Code block ──────────────────────────────────────────');

test('```js...``` → codeBlock com language js', () => {
  eq(markdownToDoc('```js\nconsole.log("hi");\n```').content, [{
    type   : 'codeBlock',
    attrs  : { language: 'js' },
    content: [{ type: 'text', text: 'console.log("hi");' }],
  }]);
});

test('``` sem linguagem → codeBlock com language null', () => {
  const doc = markdownToDoc('```\nsome code\n```');
  assert.strictEqual(doc.content[0].attrs.language, null);
  assert.strictEqual(doc.content[0].content[0].text, 'some code');
});

test('code block vazio → codeBlock com content []', () => {
  const doc = markdownToDoc('```\n```');
  assert.strictEqual(doc.content[0].type, 'codeBlock');
  assert.deepStrictEqual(doc.content[0].content, []);
});

test('code block multiline preserva quebras de linha internas', () => {
  const md  = '```python\nfor i in range(10):\n    print(i)\n```';
  const doc = markdownToDoc(md);
  assert.strictEqual(
    doc.content[0].content[0].text,
    'for i in range(10):\n    print(i)'
  );
});

test('code block não interpreta marks internos como Markdown', () => {
  const doc = markdownToDoc('```\n**não bold** e `não code`\n```');
  assert.strictEqual(doc.content[0].content[0].text, '**não bold** e `não code`');
});

// ---------------------------------------------------------------------------
// Horizontal rule
// ---------------------------------------------------------------------------
console.log('\n── Horizontal rule ─────────────────────────────────────');

test('--- → horizontalRule', () => {
  eq(markdownToDoc('---').content, [{ type: 'horizontalRule' }]);
});

test('*** → horizontalRule', () => {
  eq(markdownToDoc('***').content, [{ type: 'horizontalRule' }]);
});

test('___ → horizontalRule', () => {
  eq(markdownToDoc('___').content, [{ type: 'horizontalRule' }]);
});

test('- - - (com espaços) → horizontalRule', () => {
  eq(markdownToDoc('- - -').content, [{ type: 'horizontalRule' }]);
});

test('* * * (com espaços) → horizontalRule', () => {
  eq(markdownToDoc('* * *').content, [{ type: 'horizontalRule' }]);
});

test('HR não confunde com bullet list - item → paragraph', () => {
  const doc = markdownToDoc('- item texto');
  assert.strictEqual(doc.content[0].type, 'bulletList');
});

// ---------------------------------------------------------------------------
// Markdown malformado / edge cases de inline
// ---------------------------------------------------------------------------
console.log('\n── Markdown malformado ─────────────────────────────────');

test('** sem fechamento → texto literal sem marks', () => {
  const nodes = parseInline('**sem fechar');
  assert.strictEqual(nodes.length, 1);
  assert.strictEqual(nodes[0].text, '**sem fechar');
  assert.ok(!nodes[0].marks);
});

test('* sozinho sem par → texto literal', () => {
  const nodes = parseInline('texto * sozinho');
  assert.ok(nodes.every(n => !n.marks || n.marks[0].type !== 'italic'));
});

test('string vazia em parseInline → array vazio', () => {
  assert.deepStrictEqual(parseInline(''), []);
});

test('null em parseInline → array vazio', () => {
  assert.deepStrictEqual(parseInline(null), []);
});

// ---------------------------------------------------------------------------
// Conteúdo misto
// ---------------------------------------------------------------------------
console.log('\n── Conteúdo misto ──────────────────────────────────────');

test('H1 + parágrafo + bulletList + HR → 4 nós na ordem certa', () => {
  const md  = '# Título\n\nParágrafo normal.\n\n- item A\n- item B\n\n---';
  const doc = markdownToDoc(md);
  assert.strictEqual(doc.content.length, 4);
  assert.strictEqual(doc.content[0].type, 'heading');
  assert.strictEqual(doc.content[1].type, 'paragraph');
  assert.strictEqual(doc.content[2].type, 'bulletList');
  assert.strictEqual(doc.content[3].type, 'horizontalRule');
});

test('code block entre parágrafos não vaza conteúdo', () => {
  const md  = 'antes\n\n```js\nconst x = 1;\n```\n\ndepois';
  const doc = markdownToDoc(md);
  assert.strictEqual(doc.content.length, 3);
  assert.strictEqual(doc.content[0].type, 'paragraph');
  assert.strictEqual(doc.content[1].type, 'codeBlock');
  assert.strictEqual(doc.content[2].type, 'paragraph');
});

test('orderedList seguida de bulletList → dois nós distintos', () => {
  const md  = '1. um\n2. dois\n\n- alpha\n- beta';
  const doc = markdownToDoc(md);
  assert.strictEqual(doc.content[0].type, 'orderedList');
  assert.strictEqual(doc.content[1].type, 'bulletList');
});

test('múltiplos inline marks em parágrafo → todos preservados', () => {
  const doc   = markdownToDoc('**bold** e *italic* e `code` e [link](http://a.com)');
  const inner = doc.content[0].content;
  const types = inner.flatMap(n => (n.marks || []).map(m => m.type));
  assert.ok(types.includes('bold'),   'deve ter bold');
  assert.ok(types.includes('italic'), 'deve ter italic');
  assert.ok(types.includes('code'),   'deve ter code');
  assert.ok(types.includes('link'),   'deve ter link');
});

// ===========================================================================
console.log('\n──────────────────────────────────────────────────────────');
console.log(`Resultado: ${passed} ✅ passou | ${failed} ❌ falhou`);

if (failed > 0) {
  console.error(`\n❌  ${failed} teste(s) falharam.`);
  process.exit(1);
} else {
  console.log(`\n✅  Todos os ${passed} testes passaram!\n`);
}
