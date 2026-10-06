import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Public icon paths stay valid on an HTTP deep link and beside the standalone file.
for (const link of document.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"],link[rel="alternate icon"]')) {
  const name=link.getAttribute('href')!.split('/').at(-1)!;
  link.href=window.location.protocol==='file:'?new URL(name,window.location.href).href:`${window.location.origin}/${name}`;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
