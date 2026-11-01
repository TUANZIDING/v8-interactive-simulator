import http from 'node:http';
import {readFile} from 'node:fs/promises';
const file = new URL('./teardown/teardown-out/dist/v8-live.html', import.meta.url);
const port = Number(process.env.PORT || 4173);
http.createServer(async (req, res) => {
  if (req.url !== '/' && req.url !== '/v8-live.html') {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    const html = await readFile(file);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  } catch {
    res.writeHead(500); res.end('Build first: cd teardown && node sims/build.mjs v8-live');
  }
}).listen(port, '127.0.0.1', () => console.log(`V8 simulator: http://127.0.0.1:${port}`));
