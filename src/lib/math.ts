export type Matrix = number[][];
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
export const fmt = (value: number, digits = 2) => Number.isFinite(value) ? (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits) : '−∞';
export function transpose(matrix: Matrix): Matrix { return matrix[0].map((_, j) => matrix.map(row => row[j])); }
export function matmul(a: Matrix, b: Matrix): Matrix {
  if (!a.length || !b.length || a[0].length !== b.length) throw new Error('행렬곱의 안쪽 차원이 일치해야 합니다.');
  return a.map(row => b[0].map((_, j) => sum(row.map((value, k) => value * b[k][j]))));
}
export function softmax(values: number[], temperature = 1): number[] {
  if (temperature <= 0 || !values.some(Number.isFinite)) throw new Error('양수 온도와 최소 하나의 유효 점수가 필요합니다.');
  const max = Math.max(...values);
  const weights = values.map(value => Math.exp((value - max) / temperature));
  return weights.map(value => value / sum(weights));
}
export function attention(q: Matrix, k: Matrix, v: Matrix, mask = false, temperature = 1, queryOffset = 0) {
  const raw = matmul(q, transpose(k));
  const scores = raw.map((row, i) => row.map((value, j) => mask && j > i + queryOffset ? -Infinity : value / Math.sqrt(k[0].length) / temperature));
  const weights = scores.map(row => softmax(row));
  return { q, k, v, raw, scores, weights, output: matmul(weights, v) };
}
export function layerNorm(x: number[], epsilon = 1e-5) {
  const mean = sum(x) / x.length;
  const variance = sum(x.map(value => (value - mean) ** 2)) / x.length;
  return { mean, variance, output: x.map(value => (value - mean) / Math.sqrt(variance + epsilon)) };
}
export const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
export const positionEncoding = (position: number, dim: number, modelDim = 8) => {
  const angle = position / 10000 ** (2 * Math.floor(dim / 2) / modelDim);
  return dim % 2 ? Math.cos(angle) : Math.sin(angle);
};
export const convSize = (input: number, kernel: number, stride: number, padding: number, dilation = 1) => Math.floor((input + 2 * padding - dilation * (kernel - 1) - 1) / stride + 1);
