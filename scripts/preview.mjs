import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

// Preview the production static pages and 404 behavior; no SPA-home fallback.
const root = resolve('dist');
await stat(resolve(root, 'index.html'));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const filePath = path => {
  const file = resolve(root, `.${path}`);
  return file === root || file.startsWith(`${root}${sep}`) ? file : null;
};
const redirectPath = path => {
  if (path === '/index.html') return '/';
  if (path === '/transformer') return '/lesson/transformer';
  if (/^\/lesson\/transformer\/(structure|attention|heads|blocks|cache)\/?$/.test(path)) return '/lesson/transformer';
  return path.match(/^\/(lesson\/[a-z0-9-]+|category\/[a-z0-9-]+|graph|saved|completed)\/(?:index\.html)?$/)?.[1] ? path.replace(/\/(?:index\.html)?$/, '') : null;
};
createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method ?? '')) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    const url = new URL(request.url, 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    const target = redirectPath(path);
    if (target) { response.writeHead(301, { Location: `${target}${url.search}` }).end(); return; }
    let file, content;
    for (const candidate of path === '/404.html' ? [] : [`${path}/index.html`, path]) {
      const resolved = filePath(candidate);
      if (!resolved) continue;
      try { if (!(await stat(resolved)).isFile()) continue; content = await readFile(resolved); file = resolved; break; } catch { /* Next static candidate. */ }
    }
    const status = content ? 200 : 404;
    if (!content) { file = resolve(root, '404.html'); content = await readFile(file); }
    response.writeHead(status, { 'Content-Type': types[extname(file)] ?? 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain' }).end('Invalid request');
  }
}).listen(port, '127.0.0.1', () => console.log(`Static production preview: http://127.0.0.1:${port}/`));
