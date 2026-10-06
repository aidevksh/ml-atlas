import { attention, matmul, gelu, type Matrix } from './math';
export const tokens = ['나는', '작은', '고양이를', '좋아해'];
export const initialX: Matrix = [[1, .2, .1, .5], [.1, 1, .6, -.2], [.8, .7, -.3, .2], [.3, .8, .5, 1]];
export const WQ = [[1, 0, .2, -.1], [0, 1, -.1, .3], [.2, .1, 1, 0], [.1, -.2, 0, 1]];
export const WK = [[.7, .2, -.2, .1], [.2, .8, .1, -.3], [.1, -.3, .8, .2], [-.2, .1, .3, .7]];
export const WV = [[.8, .1, .2, 0], [.1, .7, 0, .2], [.2, 0, .6, .1], [0, .2, .1, .9]];
export const WO = [[.8, .1, -.1, .2], [.1, .7, .2, 0], [-.1, .2, .8, .1], [.2, 0, .1, .7]];
export const project = (x: Matrix, w: Matrix, start = 0, width = 2) => matmul(x, w.map(row => row.slice(start, start + width)));
export const attentionData = (x: Matrix, mask: boolean, temperature: number) => attention(project(x, WQ), project(x, WK), project(x, WV), mask, temperature);
export function headsData(x: Matrix, count: number, mask: boolean) {
  const width = 4 / count;
  const heads = Array.from({ length: count }, (_, head) => attention(project(x, WQ, head * width, width), project(x, WK, head * width, width), project(x, WV, head * width, width), mask));
  const concat = x.map((_, row) => heads.flatMap(head => head.output[row]));
  return { heads, concat, output: matmul(concat, WO) };
}
export const FW1 = [[.5, -.6, .9, .3, -.4, .7], [.2, .8, -.3, .6, .5, -.2], [.7, .1, .4, -.8, .2, .3], [-.2, .5, .1, .4, -.7, .6]];
export const FW2 = [[.5, -.1, .3, .2], [-.2, .4, .1, .3], [.3, .2, -.4, .1], [.1, -.3, .6, .2], [-.4, .5, .2, .3], [.2, .1, .3, -.5]];
export function ffnData(input: number, activation: 'relu' | 'gelu') {
  const x = [input, .5, -.3, .8], bias = [.1, -.2, .1, 0, .2, -.1];
  const z = matmul([x], FW1)[0].map((value, i) => value + bias[i]);
  const activated = z.map(value => activation === 'relu' ? Math.max(0, value) : gelu(value));
  return { x, z, activated, output: matmul([activated], FW2)[0] };
}
export const cacheWords = [...tokens, '그리고', '오늘', '함께', '공원을', '천천히', '걷고', '싶어', '<EOS>'];
export const cacheInput = (i: number) => i < 4 ? initialX[i] : [Math.sin(i * .7) * .8 + .4, Math.cos(i * .4) * .7 + .3, Math.sin(i * .5) * .6, Math.cos(i * .8) * .5];
export function cacheData(length: number) {
  const x = Array.from({ length }, (_, i) => cacheInput(i));
  const k = project(x, WK), v = project(x, WV), q = project([x.at(-1)!], WQ);
  // Build the cache incrementally: four-token prefill, then append only new rows.
  let cachedK = project(x.slice(0, 4), WK), cachedV = project(x.slice(0, 4), WV);
  for (let i = 4; i < length; i++) { cachedK = [...cachedK, ...project([x[i]], WK)]; cachedV = [...cachedV, ...project([x[i]], WV)]; }
  const full = attention(q, k, v), cached = attention(q, cachedK, cachedV);
  const baseCost = 8 + Array.from({ length: length - 4 }, (_, i) => 2 * (i + 5)).reduce((a, b) => a + b, 0);
  const cacheCost = 8 + 2 * (length - 4);
  return { k, v, q, cachedK, cachedV, full, cached, baseCost, cacheCost, error: Math.max(...full.output[0].map((value, i) => Math.abs(value - cached.output[0][i]))) };
}
