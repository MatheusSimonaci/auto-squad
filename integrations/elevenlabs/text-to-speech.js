/**
 * ElevenLabs — Text-to-Speech
 *
 * Converte texto em áudio (mp3) usando a API do ElevenLabs.
 *
 * Uso CLI:
 *   node integrations/elevenlabs/text-to-speech.js "Seu texto aqui" [saida.mp3]
 *   node integrations/elevenlabs/text-to-speech.js "Seu texto aqui" [saida.mp3] [voice_id]
 *
 * Exemplos:
 *   node integrations/elevenlabs/text-to-speech.js "Olá, mundo!"
 *   node integrations/elevenlabs/text-to-speech.js "Bem-vindo ao AIOX" output/audio.mp3
 *   node integrations/elevenlabs/text-to-speech.js "$(cat roteiro.txt)" audio.mp3
 *
 * Uso como módulo (agentes):
 *   const { textToSpeech } = require('./integrations/elevenlabs/text-to-speech');
 *   const audioPath = await textToSpeech('Olá, agente!');
 *   const audioPath = await textToSpeech('Texto', { outputPath: 'audio.mp3', voiceId: 'outro_id' });
 *
 * Variáveis de ambiente:
 *   ELEVENLABS_API_KEY  — obrigatória (em .env)
 *   ELEVENLABS_VOICE_ID — opcional, sobrescreve o voice_id padrão
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------
const DEFAULT_VOICE_ID = 'nPczCjzI2devNBz1zQrb'; // Brian
const DEFAULT_MODEL = 'eleven_multilingual_v2';
const API_BASE = 'https://api.elevenlabs.io/v1';

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
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

// ---------------------------------------------------------------------------
// Gerar nome de arquivo de saída padrão
// ---------------------------------------------------------------------------
function defaultOutputPath() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return path.resolve(__dirname, `../../output/tts-${timestamp}.mp3`);
}

// ---------------------------------------------------------------------------
// Garantir que o diretório de saída existe
// ---------------------------------------------------------------------------
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ---------------------------------------------------------------------------
// Chamada à API ElevenLabs via curl (suporte a resposta binária)
// ---------------------------------------------------------------------------
function callElevenLabsAPI(text, voiceId, apiKey, outputPath) {
  const url = `${API_BASE}/text-to-speech/${voiceId}`;
  const payload = JSON.stringify({
    text,
    model_id: DEFAULT_MODEL,
    voice_settings: {
      stability: 0.35,
      similarity_boost: 0.75,
      style: 0.6,
      use_speaker_boost: true,
    },
  });

  // Escreve body em arquivo temporário para evitar escaping de caracteres especiais
  const tmpBody = path.join(os.tmpdir(), `elevenlabs_body_${Date.now()}.json`);
  fs.writeFileSync(tmpBody, payload, 'utf8');

  ensureDir(outputPath);

  const args = [
    '-s',
    '-w', `%{http_code}`,                   // escreve só o status no stdout
    '-o', outputPath,                        // áudio binário vai direto pro arquivo
    '--dump-header', os.devNull,             // descarta headers (NUL no Windows, /dev/null no Unix)
    '-X', 'POST',
    '-H', `xi-api-key: ${apiKey}`,
    '-H', 'Content-Type: application/json',
    '-H', 'Accept: audio/mpeg',
    '-d', `@${tmpBody}`,
    url,
  ];

  const result = spawnSync('curl', args, { encoding: 'utf8', timeout: 60000 });

  // Limpeza dos temporários
  try { fs.unlinkSync(tmpBody); } catch { /* ignore */ }

  if (result.error) throw result.error;

  const status = parseInt((result.stdout || '').trim(), 10);

  if (status === 401) {
    // Remove arquivo de saída parcial/inválido
    try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch { /* ignore */ }
    throw new Error('HTTP 401: API key inválida ou sem permissão. Verifique ELEVENLABS_API_KEY no .env');
  }

  if (status === 422) {
    try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch { /* ignore */ }
    throw new Error('HTTP 422: Parâmetros inválidos. Verifique o voice_id e o texto enviado.');
  }

  if (status >= 400) {
    let detail = '';
    try {
      if (fs.existsSync(outputPath)) {
        detail = fs.readFileSync(outputPath, 'utf8').slice(0, 300);
        fs.unlinkSync(outputPath);
      }
    } catch { /* ignore */ }
    throw new Error(`HTTP ${status}: ${detail || result.stderr || 'Erro desconhecido'}`);
  }

  if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
    throw new Error('Arquivo de áudio não foi gerado. Verifique sua chave e conexão.');
  }

  return outputPath;
}

// ---------------------------------------------------------------------------
// API pública — usada por agentes e workflows
// ---------------------------------------------------------------------------

/**
 * Converte texto em áudio mp3 via ElevenLabs TTS.
 *
 * @param {string} text - Texto a ser narrado
 * @param {object} [options]
 * @param {string} [options.outputPath]  - Caminho do arquivo mp3 de saída (padrão: output/tts-{timestamp}.mp3)
 * @param {string} [options.voiceId]     - Voice ID do ElevenLabs (padrão: jBlmi27XRORxjPquUeCh)
 * @param {string} [options.apiKey]      - API key (padrão: process.env.ELEVENLABS_API_KEY)
 * @returns {Promise<string>} Caminho absoluto do arquivo mp3 gerado
 */
async function textToSpeech(text, options = {}) {
  loadEnv();

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Texto não pode ser vazio.');
  }

  const apiKey = options.apiKey || process.env.ELEVENLABS_API_KEY;
  const voiceId = options.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const outputPath = options.outputPath
    ? path.resolve(options.outputPath)
    : defaultOutputPath();

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY não encontrada. Adicione ao .env ou passe via options.apiKey');
  }

  const audioPath = callElevenLabsAPI(text.trim(), voiceId, apiKey, outputPath);
  return audioPath;
}

// ---------------------------------------------------------------------------
// CLI — execução direta
// ---------------------------------------------------------------------------
if (require.main === module) {
  loadEnv();

  const text = process.argv[2] || process.env.ELEVENLABS_TEXT;
  const outputArg = process.argv[3];
  const voiceArg = process.argv[4];
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) { console.error('❌  ELEVENLABS_API_KEY não encontrada no .env'); process.exit(1); }
  if (!text) { console.error('❌  Texto não informado.\n   Uso: node text-to-speech.js "<TEXTO>" [saida.mp3] [voice_id]'); process.exit(1); }

  const voiceId = voiceArg || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const outputPath = outputArg ? path.resolve(outputArg) : defaultOutputPath();

  console.log(`\n🎙️  Gerando áudio...`);
  console.log(`   Voice ID : ${voiceId}`);
  console.log(`   Modelo   : ${DEFAULT_MODEL}`);
  console.log(`   Texto    : "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`);
  console.log(`   Saída    : ${outputPath}\n`);

  (async () => {
    try {
      const result = await textToSpeech(text, { outputPath, voiceId, apiKey });
      const size = fs.statSync(result).size;
      console.log(`✅  Áudio gerado com sucesso!`);
      console.log(`   Arquivo : ${result}`);
      console.log(`   Tamanho : ${(size / 1024).toFixed(1)} KB\n`);
    } catch (err) {
      console.error('❌  Erro:', err.message);
      process.exit(1);
    }
  })();
}

// ---------------------------------------------------------------------------
// Exports — para uso por agentes e outros módulos
// ---------------------------------------------------------------------------
module.exports = {
  textToSpeech,
  DEFAULT_VOICE_ID,
  DEFAULT_MODEL,
};
