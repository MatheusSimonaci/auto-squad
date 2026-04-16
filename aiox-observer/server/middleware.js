const crypto = require('crypto');

// Generate or load API key
const DEFAULT_API_KEY = process.env.AIOX_API_KEY || crypto.randomBytes(32).toString('hex');

// Rate limiting store (in-memory, replace with Redis for production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key in X-API-Key header' });
  }
  
  if (apiKey !== DEFAULT_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
}

function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  
  // Remove old requests
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT_WINDOW);
  rateLimitStore.set(ip, recentRequests);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000)
    });
  }
  
  recentRequests.push(now);
  next();
}

module.exports = {
  apiKeyMiddleware,
  rateLimitMiddleware,
  DEFAULT_API_KEY,
};
