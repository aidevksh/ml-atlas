import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = 'https://ml-atlas.ksh.ai.kr';
const urlIndex = process.argv.indexOf('--url');
const target = urlIndex >= 0 ? process.argv[urlIndex + 1] : process.argv.slice(2).find(arg => /^https?:\/\//.test(arg));
const base = target ? new URL(target) : null;
if (urlIndex >= 0 && !target) throw new Error('Pass the server URL after --url.');
const failures = [];
let knownPaths = new Set();
async function load(path, expectedStatus = 200) {
  if (base) {
    const response = await fetch(new URL(path, base), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, expectedStatus, `${path}: HTTP ${response.status}, expected ${expectedStatus}`);
    if (path === '/sitemap.xml') assert.match(response.headers.get('content-type') ?? '', /(?:application|text)\/xml/, 'sitemap must be XML');
    if (path === '/robots.txt') assert.match(response.headers.get('content-type') ?? '', /text\/plain/, 'robots must be plain text');
    return response.text();
  }
  return readFile(path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : /\.(xml|txt)$/.test(path) ? `dist${path}` : `dist${path}/index.html`, 'utf8');
}
function checkPage(html, path, indexable) {
  // Inspect just the original head and rendered root, not strings inside the JS bundle.
  const head = html.split('</head>')[0].replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g, '');
  assert.equal((head.match(/<link rel="canonical" /g) ?? []).length, 1, `${path}: exactly one canonical`);
  assert.ok(head.includes(`href="${site}${path}"`), `${path}: self canonical`);
  assert.ok(head.includes(`content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}"`), `${path}: robots policy`);
  const title = head.match(/<title>(.*?)<\/title>/)?.[1];
  assert.match(head, /rel="icon"[^>]*href="\/favicon-96\.png/, `${path}: crawlable PNG favicon on deep links`);
  assert.ok(title?.includes('ml-atlas') && title !== 'ml-atlas', `${path}: descriptive title`);
  assert.match(head, /<meta name="description" content="[^"]{20,}"/, `${path}: description`);
  assert.ok(html.includes(`data-prerendered="${path}"`), `${path}: pre-rendered root`);
  const body = html.split('</head>')[1].split('</body>')[0];
  assert.match(body, /<h1\b/, `${path}: visible heading before executing JavaScript`);
  assert.ok(!body.includes('<div id="root"></div>'), `${path}: nonempty React tree`);
  for (const match of body.matchAll(/<a\b[^>]*href="(\/[^\"]*)"/g)) {
    const linked = new URL(match[1], site).pathname;
    assert.ok(knownPaths.has(linked), `${path}: broken internal link ${linked}`);
  }
  if (path.startsWith('/lesson/')) {
    assert.ok(body.includes('id="lesson-definition"') && body.includes('id="lesson-formula"'), `${path}: actual theory content`);
    assert.ok(body.includes('href="/category/'), `${path}: crawlable category link`);
  }
  if (indexable) {
    const json = head.match(/<script id="site-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, `${path}: JSON-LD present`);
    const data = JSON.parse(json);
    assert.equal(data['@context'], 'https://schema.org');
    assert.ok(data['@graph'].some(node => node.url === `${site}${path}`), `${path}: structured page URL`);
  }
  return title;
}
try {
  const xml = await load('/sitemap.xml');
  assert.match(xml, /^<\?xml/);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.ok(urls.length > 100, 'all curriculum routes are included');
  assert.equal(new Set(urls).size, urls.length, 'unique sitemap URLs');
  const paths = urls.map(url => { assert.ok(url.startsWith(`${site}/`)); assert.ok(!url.includes('#') && !url.includes('?')); return new URL(url).pathname; });
  knownPaths = new Set([...paths, '/saved', '/completed']);
  assert.ok(!paths.includes('/saved') && !paths.includes('/completed') && !paths.includes('/404'));
  const robots = await load('/robots.txt');
  assert.match(robots, /User-agent: \*/);
  assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
  assert.ok(!robots.includes('Disallow: /'), 'public content is crawlable');
  const titles = new Set();
  // Bound concurrency for a real server audit.
  const pending = [...paths];
  await Promise.all(Array.from({ length: base ? 6 : 1 }, async () => {
    while (pending.length) {
      const path = pending.shift();
      try { const title = checkPage(await load(path), path, true); assert.ok(!titles.has(title), `${path}: unique title`); titles.add(title); }
      catch (error) { failures.push(error.message); }
    }
  }));
  for (const path of ['/saved', '/completed']) {
    try { checkPage(await load(path), path, false); } catch (error) { failures.push(error.message); }
  }
  try { checkPage(await load(base ? '/seo-audit-missing-page' : '/404', base ? 404 : 200), '/404', false); } catch (error) { failures.push(error.message); }
  if (!base) {
    const home = await load('/');
    assert.match(home, /<script type="module">/, 'standalone inline JS');
    assert.match(home, /<style>/, 'standalone inline CSS');
    assert.ok(home.includes('data:image/svg+xml,'), 'standalone favicon');
    assert.match(home, /rel="icon"[^>]*href="\/favicon-96\.png/, 'Search can crawl a supported PNG favicon');
  }
  if (failures.length) throw new Error(`${failures.length} checks failed:\n${failures.slice(0,20).join('\n')}`);
  console.log(`SEO audit passed: ${paths.length} public HTML pages, sitemap, robots, private noindex and ${base ? 'HTTP 404' : 'standalone build'}.`);
} catch (error) {
  console.error(`SEO audit failed: ${error.message}`);
  process.exitCode = 1;
}
