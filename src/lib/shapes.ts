import { convSize } from './math';
export type LayerKind = 'conv' | 'pool' | 'flatten' | 'linear' | 'relu' | 'add' | 'concat';
export interface Layer { id: number; kind: LayerKind; out: number; kernel: number; stride: number; padding: number; dilation: number; from: number; }
export interface ShapeResult { input: number[]; output: number[]; params: number; formula: string; error?: string; }
export function computeShapes(input: number[], layers: Layer[]): ShapeResult[] {
  let shape = [...input], failed = false;
  const results: ShapeResult[] = [];
  for (const [index, layer] of layers.entries()) {
    const before = [...shape]; let params = 0, formula = 'shape 보존', error: string | undefined;
    if (failed) error = '앞 레이어의 오류를 먼저 수정하세요.';
    else if (shape.some(v => !Number.isInteger(v) || v < 1)) error = '입력 차원은 양의 정수여야 합니다.';
    else if (layer.kind === 'conv' || layer.kind === 'pool') {
      if (shape.length !== 4) error = 'Conv·Pool에는 [B,C,H,W] 입력이 필요합니다.';
      else if (layer.kind === 'pool' && layer.padding > Math.floor(layer.kernel / 2)) error = 'MaxPool Padding은 Kernel/2 이하여야 합니다.';
      else {
        const h = convSize(shape[2], layer.kernel, layer.stride, layer.padding, layer.dilation), w = convSize(shape[3], layer.kernel, layer.stride, layer.padding, layer.dilation);
        if (h < 1 || w < 1) error = '커널이 입력보다 큽니다. Padding·Kernel·Dilation을 확인하세요.';
        else {
          shape = [shape[0], layer.kind === 'conv' ? layer.out : shape[1], h, w];
          params = layer.kind === 'conv' ? layer.out * (before[1] * layer.kernel ** 2 + 1) : 0;
          formula = `floor((${before[2]}+2×${layer.padding}−${layer.dilation}×(${layer.kernel}−1)−1)/${layer.stride}+1) = ${h}`;
        }
      }
    } else if (layer.kind === 'flatten') { shape = [shape[0], shape.slice(1).reduce((a, b) => a * b, 1)]; formula = `배치 보존 · ${before.slice(1).join(' × ')} = ${shape[1]}`; }
    else if (layer.kind === 'linear') { const inFeatures = shape.at(-1)!; params = inFeatures * layer.out + layer.out; shape = [...shape.slice(0, -1), layer.out]; formula = `Linear(${inFeatures}, ${layer.out}) · ${inFeatures}×${layer.out}+${layer.out} params`; }
    else if (layer.kind === 'add' || layer.kind === 'concat') {
      const source = layer.from === -1 ? input : results[layer.from]?.output;
      if (layer.from >= index || !source) error = 'Skip source는 현재 레이어보다 앞이어야 합니다.';
      else if (layer.kind === 'add') {
        if (source.join(',') !== shape.join(',')) error = `Residual shape 불일치: [${shape}] + [${source}]. Projection이 필요합니다.`;
        formula = `현재 + ${layer.from === -1 ? '입력' : `레이어 ${layer.from + 1}`} · 정확한 shape 일치 검사`;
      } else {
        if (source.length !== shape.length || source.some((v, i) => i !== 1 && v !== shape[i])) error = 'Concat의 1번 축 이외 차원이 일치해야 합니다.';
        else { shape = shape.map((v, i) => i === 1 ? v + source[i] : v); formula = `dim=1에서 ${before[1]}+${source[1]}=${shape[1]}`; }
      }
    }
    failed = Boolean(error); results.push({ input: before, output: [...shape], params, formula, error });
  }
  return results;
}
export const newLayer = (id: number, kind: LayerKind): Layer => ({ id, kind, out: kind === 'conv' ? 16 : 128, kernel: kind === 'pool' ? 2 : 3, stride: kind === 'pool' ? 2 : 1, padding: kind === 'conv' ? 1 : 0, dilation: 1, from: -1 });
export const defaultLayers = () => [newLayer(0, 'conv'), newLayer(1, 'pool'), newLayer(2, 'flatten'), newLayer(3, 'linear'), newLayer(4, 'relu'), { ...newLayer(5, 'linear'), out: 10 }];
