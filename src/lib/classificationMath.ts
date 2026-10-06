/** Unweighted categorical CE, one sample, normalized fixed targets. */
export function classification(logits: number[], targets: number[], temperature = 1) {
  if (!logits.length || logits.length !== targets.length || logits.some(z => !Number.isFinite(z)) ||
    !Number.isFinite(temperature) || temperature <= 0 || targets.some(y => !Number.isFinite(y) || y < 0) ||
    Math.abs(targets.reduce((s, y) => s + y, 0) - 1) > 1e-9) throw new Error('Finite logits, positive temperature and normalized targets are required.');
  const maximum = Math.max(...logits);
  const shifted = logits.map(z => (z - maximum) / temperature);
  const logSum = Math.log(shifted.reduce((s, z) => s + Math.exp(z), 0));
  const logProbabilities = shifted.map(z => z - logSum);
  const probabilities = logProbabilities.map(Math.exp);
  const loss = -targets.reduce((s, y, i) => s + (y === 0 ? 0 : y * logProbabilities[i]), 0);
  const jacobian = probabilities.map((p, i) => probabilities.map((q, j) => p * ((i === j ? 1 : 0) - q) / temperature));
  const gradient = probabilities.map((p, i) => (p - targets[i]) / temperature);
  return { probabilities, logProbabilities, loss, jacobian, gradient };
}

export function smoothedTarget(classes: number, target: number, smoothing = 0) {
  if (!Number.isInteger(classes) || classes < 2 || !Number.isInteger(target) || target < 0 || target >= classes ||
    !Number.isFinite(smoothing) || smoothing < 0 || smoothing > 1) throw new Error('Invalid target distribution.');
  return Array.from({ length: classes }, (_, i) => (i === target ? 1 - smoothing : 0) + smoothing / classes);
}

/** Stable BCE-with-logits, including saturated probabilities. */
export function binaryClassification(logit: number, target: number) {
  if (!Number.isFinite(logit) || !Number.isFinite(target) || target < 0 || target > 1) throw new Error('Invalid binary input.');
  const probability = logit >= 0 ? 1 / (1 + Math.exp(-logit)) : Math.exp(logit) / (1 + Math.exp(logit));
  const loss = Math.max(logit, 0) - logit * target + Math.log1p(Math.exp(-Math.abs(logit)));
  return { probability, loss, gradient: probability - target };
}
