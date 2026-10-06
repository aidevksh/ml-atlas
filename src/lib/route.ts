// Served over HTTP the app uses real paths (/lesson/transformer). Opened via file:// there is no
// server to fall back to index.html, so routes live in the hash (#/lesson/transformer) instead.
const hashMode = typeof window !== 'undefined' && window.location.protocol === 'file:';

export const href = (path: string) => hashMode ? `#${path}` : path;

export function currentPath() {
  if (typeof window === 'undefined') return '/';
  return hashMode ? window.location.hash.replace(/^#/, '') || '/' : window.location.pathname;
}

export function navigate(path: string) {
  if (hashMode) { window.location.hash = path; return; }
  if (path !== window.location.pathname) window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function subscribe(update: () => void) {
  const event = hashMode ? 'hashchange' : 'popstate';
  window.addEventListener(event, update);
  return () => window.removeEventListener(event, update);
}

// Old shared links (https://…/#/lesson/x) keep working by moving the hash route into the path.
if (typeof window !== 'undefined' && !hashMode && window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}
