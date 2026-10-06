import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { currentPath } from './lib/route';
import { normalizePath, pageSeo } from './lib/seo';
import './styles.css';

const primaryIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (window.location.protocol === 'file:' && primaryIcon?.dataset.fileIcon) primaryIcon.href = primaryIcon.dataset.fileIcon;

// Public icon paths stay valid on an HTTP deep link and beside the standalone file.
for (const link of document.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"],link[rel="alternate icon"],link[rel="icon"][type="image/png"]')) {
  const name=link.getAttribute('href')!.split('/').at(-1)!;
  link.href=window.location.protocol==='file:'?new URL(name,window.location.href).href:`${window.location.origin}/${name}`;
}

const root = document.getElementById('root')!, path = normalizePath(currentPath());
const renderedPath = root.dataset.prerendered;
const app = <StrictMode><App initialPath={path} /></StrictMode>;
// Hash links and standalone files may open a different route from the pre-rendered home.
if (window.location.protocol !== 'file:' && renderedPath && (renderedPath === path || (!pageSeo(renderedPath).found && !pageSeo(path).found))) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
