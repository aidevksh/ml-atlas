import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { buildPaths, publicPaths, pageSeo, renderSeoHead, SITE_URL } from './lib/seo';

export { buildPaths, publicPaths, pageSeo, SITE_URL };
export function renderPage(path: string) {
  return { body: renderToString(<StrictMode><App initialPath={path} /></StrictMode>), head: renderSeoHead(pageSeo(path)) };
}
