import { useId, useRef, type ReactNode } from 'react';
import { clamp, fmt, type Matrix as MatrixType } from '../lib/math';

export function Card({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{title && <div className="panel-header"><h3>{title}</h3>{action}</div>}<div className="panel-body">{children}</div></section>;
}
export function Formula({ children }: { children: ReactNode }) { return <div className="formula">{children}</div>; }
export function Note({ children }: { children: ReactNode }) { return <p className="note">{children}</p>; }
export function Slider({ label, value, onChange, min, max, step = 1, suffix = '' }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  const id = useId();
  return <div className="slider-control"><label htmlFor={id}>{label}</label><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /><output htmlFor={id}>{step < 1 ? fmt(value, step < .1 ? 2 : 1) : value}{suffix}</output></div>;
}
export function Choice<T extends string | number>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return <div className="choice" role="group" aria-label={label}>{options.map(option => <button key={option.value} aria-pressed={value === option.value} className={value === option.value ? 'selected' : ''} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}
export function Metric({ value, label }: { value: ReactNode; label: string }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }
export function Matrix({ values, name, color = 'purple', probability = false, onEdit, onSelect, selected }: { values: MatrixType; name: string; color?: 'purple' | 'blue' | 'green' | 'orange'; probability?: boolean; onEdit?: (i: number, j: number, value: number) => void; onSelect?: (i: number, j: number) => void; selected?: [number, number] }) {
  const drag = useRef<{ y: number; value: number } | null>(null);
  const largest = probability ? 1 : Math.max(1, ...values.flat().filter(Number.isFinite).map(Math.abs));
  return <div className={`matrix-block ${color}`}><strong className="matrix-name">{name}</strong><div className="matrix" style={{ gridTemplateColumns: `repeat(${values[0].length}, minmax(38px,1fr))` }} role="group" aria-label={`${name} ${values.length}행 ${values[0].length}열`}>
    {values.flatMap((row, i) => row.map((value, j) => {
      const label = `${name} ${i + 1}행 ${j + 1}열, ${fmt(value)}`;
      const className = `matrix-cell ${onEdit ? 'editable' : ''} ${!Number.isFinite(value) ? 'masked' : ''} ${selected?.[0] === i && selected?.[1] === j ? 'picked' : ''}`;
      const style = { background: `color-mix(in srgb, var(--matrix-color) ${6 + Math.abs(value) / largest * 43}%, white)` };
      const content = probability ? `${(value * 100).toFixed(0)}%` : fmt(value);
      return onEdit || onSelect ? <button key={`${i}-${j}`} className={className} style={Number.isFinite(value) ? style : undefined} aria-label={label} title={onEdit ? '위아래로 드래그하거나 방향키로 조절' : label}
        onClick={() => onSelect?.(i, j)}
        onKeyDown={e => { if (onEdit && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); onEdit(i, j, clamp(value + (e.key === 'ArrowUp' ? .1 : -.1), -3, 3)); } }}
        onPointerDown={e => { if (onEdit) { e.preventDefault(); drag.current = { y: e.clientY, value }; e.currentTarget.setPointerCapture(e.pointerId); } }}
        onPointerMove={e => { if (onEdit && drag.current && e.currentTarget.hasPointerCapture(e.pointerId)) onEdit(i, j, clamp(drag.current.value + (drag.current.y - e.clientY) / 55, -3, 3)); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>{content}</button>
        : <span key={`${i}-${j}`} className={className} style={Number.isFinite(value) ? style : undefined} title={label}>{content}</span>;
    }))}</div><small>{values.length} × {values[0].length}</small></div>;
}
export function Bars({ values, labels }: { values: number[]; labels: string[] }) { return <div className="bars">{values.map((value, i) => <div className="bar" key={i}><span>{labels[i]}</span><div><i style={{ width: `${clamp(value * 100, 0, 100)}%` }} /></div><output>{(value * 100).toFixed(1)}%</output></div>)}</div>; }
export function Plot({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) { return <svg className={`plot ${className}`} viewBox="0 0 600 280" role="img" aria-label={label}>{children}</svg>; }
export function PlotGrid() { return <>{[100, 200, 300, 400, 500].map(x => <path key={x} d={`M${x} 20V260`} stroke="#e6e8ec" />)}{[40, 90, 140, 190, 240].map(y => <path key={y} d={`M30 ${y}H570`} stroke={y === 140 ? '#bac2d1' : '#e6e8ec'} />)}<path d="M300 20V260" stroke="#bac2d1" /></>; }
