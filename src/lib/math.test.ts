import { describe, expect, test } from 'vitest';
import { attention, convSize, layerNorm, matmul, positionEncoding, softmax, sum } from './math';
import { attentionData, cacheData, initialX, headsData, project, WQ } from './transformer';
import { computeShapes, defaultLayers, newLayer } from './shapes';
import { cosine, ganLoss, ganStep, initialGan, qUpdate, retrieve } from './experiments';
import { categories, curriculum, getTopic } from '../data/curriculum';

describe('Attention and Transformer numerical invariants', () => {
  test('stable softmax sums to one for very large scores and masks', () => {
    expect(softmax([1000, 1001])[1]).toBeCloseTo(.7310585786);
    expect(sum(softmax([0, -Infinity, 2]))).toBeCloseTo(1, 12);
    expect(softmax([0, -Infinity, 2])[1]).toBe(0);
    expect(() => softmax([-Infinity])).toThrow();
  });
  test('causal mask excludes only future positions and rows normalize', () => {
    const d = attentionData(initialX, true, .4);
    d.weights.forEach((row, i) => { expect(sum(row)).toBeCloseTo(1, 12); row.forEach((v, j) => { if (j > i) expect(v).toBe(0); }); });
    expect(d.output[0]).toEqual(d.v[0]);
  });
  test('single-query offset can attend to all past tokens', () => {
    const d = attention([[1, 1]], [[1, 0], [0, 1]], [[2], [4]], true, 1, 1);
    expect(d.output[0][0]).toBeCloseTo(3);
  });
  test('query editing solves the inverse projection and changes K/V', () => {
    const x = initialX.map(row => [...row]); const q = [2, -1];
    x[2][0] = q[0] - .2 * x[2][2] - .1 * x[2][3]; x[2][1] = q[1] - .1 * x[2][2] + .2 * x[2][3];
    project(x, WQ)[2].forEach((v, i) => expect(v).toBeCloseTo(q[i], 12));
    expect(attentionData(x, false, 1).k).not.toEqual(attentionData(initialX, false, 1).k);
  });
  test.each([1, 2, 4])('%i heads preserve model dimensions', count => {
    const d = headsData(initialX, count, false);
    expect(d.heads).toHaveLength(count); expect(d.concat).toHaveLength(4); expect(d.output[0]).toHaveLength(4);
    d.heads.forEach(head => expect(head.output[0]).toHaveLength(4 / count));
  });
  test.each([4, 5, 8, 12])('incremental KV cache equals full recomputation at %i tokens', length => {
    const d = cacheData(length); expect(d.cachedK).toEqual(d.k); expect(d.cachedV).toEqual(d.v); expect(d.error).toBe(0);
    expect(d.cacheCost).toBe(2 * length); expect(d.baseCost).toBe(8 + sum(Array.from({ length: length - 4 }, (_, i) => 2 * (i + 5))));
  });
  test('LayerNorm mean and epsilon-adjusted variance', () => {
    const d = layerNorm([1, 2, -1, .5]); expect(sum(d.output)).toBeCloseTo(0, 12);
    expect(sum(d.output.map(v => v * v)) / 4).toBeCloseTo(d.variance / (d.variance + 1e-5), 12);
    expect(layerNorm([1, 1, 1]).output).toEqual([0, 0, 0]);
  });
  test('position pairs lie on the unit circle', () => {
    for (const pos of [0, 3, 31]) for (let pair = 0; pair < 4; pair++) expect(positionEncoding(pos, pair * 2) ** 2 + positionEncoding(pos, pair * 2 + 1) ** 2).toBeCloseTo(1, 12);
  });
});
describe('shape calculations', () => {
  test('default CNN has correct dimensions and parameter count', () => {
    const d = computeShapes([1, 3, 32, 32], defaultLayers());
    expect(d.map(r => r.output)).toEqual([[1, 16, 32, 32], [1, 16, 16, 16], [1, 4096], [1, 128], [1, 128], [1, 10]]);
    expect(sum(d.map(r => r.params))).toBe(448 + 524416 + 1290);
  });
  test('dilation and flooring follow the Conv formula', () => { expect(convSize(32, 3, 2, 1, 2)).toBe(15); });
  test('bad rank, excessive pool padding and small inputs report errors', () => {
    expect(computeShapes([1, 10], [newLayer(0, 'conv')])[0].error).toBeTruthy();
    expect(computeShapes([1, 3, 1, 1], [{ ...newLayer(0, 'conv'), padding: 0 }])[0].error).toBeTruthy();
    expect(computeShapes([1, 3, 32, 32], [{ ...newLayer(0, 'pool'), padding: 2 }])[0].error).toBeTruthy();
  });
  test('Linear transforms the last dimension even on a rank-four tensor', () => { expect(computeShapes([1, 3, 8, 8], [{ ...newLayer(0, 'linear'), out: 4 }])[0].output).toEqual([1, 3, 8, 4]); });
  test('residual mismatch blocks downstream computations', () => {
    const d = computeShapes([1, 4], [{ ...newLayer(0, 'linear'), out: 8 }, newLayer(1, 'add'), newLayer(2, 'relu')]);
    expect(d[1].error).toMatch(/불일치/); expect(d[2].error).toMatch(/앞 레이어/);
  });
  test('Concat combines only the selected channel axis', () => { expect(computeShapes([1, 4], [newLayer(0, 'concat')])[0].output).toEqual([1, 8]); });
  test('matrix multiplication rejects incompatible dimensions', () => { expect(() => matmul([[1, 2]], [[1, 2]])).toThrow(); });
});
describe('learning experiments', () => {
  test('retrieval respects rank and context budget', () => {
    expect(cosine([1, 0], [0, 1])).toBe(0);
    const d = retrieve([1, 0, 0, 0], 2, 200); expect(d.ranked[0].id).toBe('A'); expect(d.spent).toBeLessThanOrEqual(200); expect(d.candidates.filter(c => c.included)).toHaveLength(1);
  });
  test.each(['d', 'g'] as const)('GAN %s gradient step reduces its own loss when the other model is fixed', side => {
    const before = initialGan(), after = ganStep(before, side, .01), oldLoss = ganLoss(before), newLoss = ganLoss(after);
    expect(side === 'd' ? newLoss.dLoss : newLoss.gLoss).toBeLessThan(side === 'd' ? oldLoss.dLoss : oldLoss.gLoss);
    if (side === 'd') expect(after.mean).toBe(before.mean); else expect(after.a).toBe(before.a);
  });
  test('Q-learning applies TD error and handles terminal state', () => {
    expect(qUpdate(2, 1, 4, .5, .9).value).toBeCloseTo(3.3);
    expect(qUpdate(2, 1, 4, .5, .9, true).target).toBe(1);
  });
});
describe('curriculum integrity', () => {
  test('category order is user-defined and every category contains content', () => {
    expect(categories.map(c => c.id)).toEqual(['llm', 'dl', 'ml', 'rl', 'math', 'pytorch', 'design']);
    for (const c of categories) expect(curriculum.some(t => t.category === c.id)).toBe(true);
  });
  test('notes have unique routes, theory and working prerequisite identifiers', () => {
    expect(new Set(curriculum.map(t => t.id)).size).toBe(curriculum.length);
    for (const t of curriculum) { expect(t.formula.length).toBeGreaterThan(5); expect(t.example.length).toBeGreaterThan(20); for (const id of t.prerequisites) expect(getTopic(id)).toBeDefined(); }
  });
  test('prerequisites do not form cycles', () => {
    const visit = (id: string, path: string[]) => { expect(path).not.toContain(id); getTopic(id)!.prerequisites.forEach(next => visit(next, [...path, id])); };
    curriculum.forEach(t => visit(t.id, []));
  });
});
