import { sum } from './math';
export const dot = (a: number[], b: number[]) => sum(a.map((v, i) => v * b[i]));
export const cosine = (a: number[], b: number[]) => Math.hypot(...a) * Math.hypot(...b) ? dot(a, b) / Math.hypot(...a) / Math.hypot(...b) : 0;
export const documents = [
  { id: 'A', title: 'Attention은 무엇을 계산할까?', vector: [3, 1, 0, 0], tokens: 120, text: 'Query와 Key의 내적으로 관련도를 계산하고, Softmax 가중치로 Value를 모읍니다.' },
  { id: 'B', title: '레이어의 차원을 맞추기', vector: [0, 3, 0, 1], tokens: 180, text: 'Linear는 마지막 feature 차원을 바꾸고 Flatten은 배치 이후 축을 하나로 합칩니다.' },
  { id: 'C', title: 'KV 캐시가 재사용하는 것', vector: [1, 0, 3, 0], tokens: 150, text: 'Causal 생성에서 과거 Key와 Value를 저장하고 새 토큰의 K·V만 추가 계산합니다.' },
  { id: 'D', title: '신경망 학습의 한 단계', vector: [0, 1, 0, 3], tokens: 100, text: '손실을 계산하고 backward로 Gradient를 구한 뒤 optimizer.step으로 파라미터를 갱신합니다.' },
];
export function retrieve(query: number[], k: number, budget: number) {
  const ranked = documents.map(doc => ({ ...doc, score: cosine(query, doc.vector) })).sort((a, b) => b.score - a.score);
  let spent = 0;
  const candidates = ranked.slice(0, k).map(doc => { const included = spent + doc.tokens <= budget; if (included) spent += doc.tokens; return { ...doc, included }; });
  return { ranked, candidates, spent };
}
export interface GanState { mean: number; scale: number; a: number; b: number; steps: number; }
export const initialGan = (): GanState => ({ mean: -1, scale: .7, a: .4, b: 0, steps: 0 });
const zSamples = [-1.5, -1, -.5, 0, .5, 1, 1.5];
const realSamples = zSamples.map(z => 1.5 + .6 * z);
const logistic = (x: number) => 1 / (1 + Math.exp(-x));
export function ganLoss(state: GanState) {
  const fake = zSamples.map(z => state.mean + state.scale * z);
  const dReal = realSamples.map(x => logistic(state.a * x + state.b)), dFake = fake.map(x => logistic(state.a * x + state.b));
  return { real: realSamples, fake, dReal, dFake, dLoss: -sum(dReal.map(p => Math.log(Math.max(1e-12, p)))) / 7 - sum(dFake.map(p => Math.log(Math.max(1e-12, 1 - p)))) / 7, gLoss: -sum(dFake.map(p => Math.log(Math.max(1e-12, p)))) / 7 };
}
export function ganStep(state: GanState, side: 'd' | 'g', rate: number): GanState {
  const d = ganLoss(state);
  if (side === 'd') {
    const gradA = sum(d.real.map((x, i) => (d.dReal[i] - 1) * x)) / 7 + sum(d.fake.map((x, i) => d.dFake[i] * x)) / 7;
    const gradB = sum(d.dReal.map(p => p - 1)) / 7 + sum(d.dFake) / 7;
    return { ...state, a: state.a - rate * gradA, b: state.b - rate * gradB, steps: state.steps + 1 };
  }
  const gradMean = sum(d.dFake.map(p => (p - 1) * state.a)) / 7;
  const gradScale = sum(d.dFake.map((p, i) => (p - 1) * state.a * zSamples[i])) / 7;
  return { ...state, mean: state.mean - rate * gradMean, scale: state.scale - rate * gradScale, steps: state.steps + 1 };
}
export function qUpdate(old: number, reward: number, next: number, rate: number, discount: number, terminal = false) {
  const target = reward + (terminal ? 0 : discount * next);
  return { target, error: target - old, value: old + rate * (target - old) };
}
