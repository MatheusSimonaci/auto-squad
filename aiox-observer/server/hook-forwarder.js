let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(raw);
    const http = require('http');
    const body = JSON.stringify(payload);
    const req = http.request({
      host: 'localhost',
      port: 7433,
      path: '/hooks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    });
    req.on('error', () => {}); // silently fail
    req.write(body);
    req.end();
  } catch(e) {}
});
