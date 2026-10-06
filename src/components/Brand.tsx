import type { CategoryId } from '../data/curriculum';
import { neuralMark } from '../data/brand';

// SVG groups can be placed inside the hero without creating another viewport.
export function NetworkGlyph() {
  const { nodes, edges, radius, strokeWidth, background, connection } = neuralMark;
  return <g>
    <rect width="32" height="32" rx="8" fill={background} />
    <g stroke={connection} strokeWidth={strokeWidth} strokeLinecap="round">
      {edges.map(([a, b]) => <path key={`${a}-${b}`} d={`M${nodes[a].join(' ')}L${nodes[b].join(' ')}`} />)}
    </g>
    {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={radius} fill="#fff" />)}
  </g>;
}

export function NetworkMark({ className = '' }: { className?: string }) {
  return <svg className={`network-mark ${className}`} width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><NetworkGlyph /></svg>;
}

export function CategoryGlyph({ id }: { id: CategoryId }) {
  return <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {id === 'llm' && <><path d="M5 4H19A2 2 0 0 1 21 6V15A2 2 0 0 1 19 17H10L5 21V17A2 2 0 0 1 3 15V6A2 2 0 0 1 5 4Z" /><path d="M7 8H17M7 12H14" /></>}
    {id === 'dl' && <><path d="M4 6H12L21 12L12 18H4" />{[[4,6],[4,18],[12,6],[12,18],[21,12]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="currentColor" stroke="none" />)}</>}
    {id === 'ml' && <><path d="M3 3V21H21M6 17L20 5" />{[[7,13],[12,14],[16,6]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill="currentColor" stroke="none" />)}</>}
    {id === 'rl' && <><path d="M4 9A8.3 8.3 0 0 1 19 6L21 9M21 4V9H16M20 15A8.3 8.3 0 0 1 5 18L3 15M3 20V15H8" /><path d="M12 8L13.2 10.5L16 11L14 13L14.4 16L12 14.5L9.6 16L10 13L8 11L10.8 10.5Z" fill="currentColor" stroke="none" /></>}
    {id === 'math' && <path d="M19 4H5L12 12L5 20H19" />}
    {id === 'pytorch' && <path d="M12 3L22 8L12 13L2 8ZM2 12L12 17L22 12M2 16L12 21L22 16" />}
    {id === 'design' && <><rect x="3" y="3" width="18" height="4" rx="1" /><rect x="6" y="10" width="12" height="4" rx="1" /><rect x="8" y="17" width="8" height="4" rx="1" /><path d="M12 7V10M12 14V17" /></>}
    {id === 'cs' && <path d="M7 6L2 12L7 18M17 6L22 12L17 18M14 4L10 20" />}
  </g>;
}

export function CategoryIcon({ id }: { id: CategoryId }) {
  return <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><CategoryGlyph id={id} /></svg>;
}

export function ConceptMapIcon() {
  return <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 12L18 5M6 12L18 19" fill="none" stroke="currentColor" strokeWidth="1.7" />
    {[[6,12],[18,5],[18,19]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" />)}
  </svg>;
}
