export interface Control { key: string; label: string; min: number; max: number; step: number; initial: number; choices?: { value: number; label: string }[]; }
export interface Calculation { metrics: { label: string; value: number | null; unit?: string }[]; steps: string[]; bars?: { label: string; value: number }[]; matrix?: { name: string; values: number[][] }; warning?: string; }
export interface LessonModel { title: string; assumption: string; controls: Control[]; calculate: (p: Record<string, number>) => Calculation; observe: string; }
export const c = (key: string, label: string, initial: number, min: number, max: number, step = .1): Control => ({ key, label, initial, min, max, step });
export const m = (label: string, value: number | null, unit?: string) => ({ label, value, unit });
export const n = (value: number) => Number.isFinite(value) ? Number(value.toFixed(4)).toString() : '미정의';
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
export const average = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const variance = (xs: number[]) => average(xs.map(x => (x - average(xs)) ** 2));
export const normal = (x: number, mean: number, std: number) => Math.exp(-.5 * ((x - mean) / std) ** 2) / (std * Math.sqrt(2 * Math.PI));
export const choice = (key: string, label: string, initial: number, labels: string[]): Control => ({ ...c(key,label,initial,0,labels.length-1,1), choices: labels.map((label,value)=>({label,value})) });
export function random(seed: number) { let state=seed|0;return()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}; }
