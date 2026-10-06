import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createServer } from 'vite';

// Render the same React tree users see, with no browser globals or crawler-only content.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { buildPaths, publicPaths, renderPage, SITE_URL } = await server.ssrLoadModule('/src/entry-server.tsx');
  const template = (await readFile('dist/index.html', 'utf8')).replace(/href="\.\/(favicon[^"]*|apple-touch-icon[^"]*)"/g, 'href="/$1"');
  if (!template.includes('<!-- SEO:START -->') || !template.includes('<div id="root"></div>')) throw new Error('Missing SEO or React build placeholder.');
  const token = process.env.GOOGLE_SITE_VERIFICATION;
  if (token && !/^[a-zA-Z0-9_-]+$/.test(token)) throw new Error('GOOGLE_SITE_VERIFICATION must be the meta-tag content token.');
  for (const path of buildPaths) {
    const { body, head } = renderPage(path);
    let html = template.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, () => `<!-- SEO:START -->\n    ${head}${token ? `\n    <meta name="google-site-verification" content="${token}" />` : ''}\n    <!-- SEO:END -->`)
      .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="${path}">${body}</div>`);
    // Deep pages share fingerprinted assets. The root remains self-contained for file://.
    if (path !== '/') html = html.replace(/(src|href)="\.\/assets\//g, '$1="/assets/');
    const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map(path => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
  // Omit lastmod rather than claiming every lesson changed at every build.
  await writeFile('dist/sitemap.xml', sitemap);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`Pre-rendered ${publicPaths.length} public pages, 2 private pages and a 404; generated sitemap.xml and robots.txt.`);
} finally {
  await server.close();
}
