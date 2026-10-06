import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
// Inline the built entry and stylesheet so the production app also opens via file://.
let html = await readFile('dist/index.html', 'utf8');
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if (!script || !style) throw new Error('Expected one built entry script and stylesheet.');
const localAsset = path => {
  if (!/^\.\/assets\/[A-Za-z0-9_.-]+$/.test(path)) throw new Error(`Unexpected build asset path: ${path}`);
  return `dist/${path.slice(2)}`;
};
const js = await readFile(localAsset(script[1]), 'utf8');
const css = await readFile(localAsset(style[1]), 'utf8');
html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(style[0], () => `<style>${css}</style>`);
// Inline the primary icon too: HTTP deep links and file:// both keep the mark.
const favicon=await readFile('public/favicon.svg','utf8');
html=html.replace(/(<link[^>]+rel="icon"[^>]+href=")[^"]+("[^>]*>)/,(_,before,after)=>`${before}data:image/svg+xml,${encodeURIComponent(favicon)}${after}`);
await writeFile('dist/index.html', html);
await mkdir('dist/transformer', { recursive: true });
await copyFile('transformer/index.html', 'dist/transformer/index.html');
for (const file of ['LICENSE', 'LICENSE-CONTENT', 'LICENSING.md', 'NOTICE']) {
  await copyFile(file, `dist/${file}`);
}
