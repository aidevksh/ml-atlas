export interface Reading {
  why: string;
  definition: string;
  mechanism: string[];
  symbols: [string, string][];
  reading: string;
  derivation: string[];
  pitfall: string;
  question: string;
  answer: string;
}
// ¦ separates paragraphs; literal | remains available for conditional probabilities and absolute values.
// Each entry is authored for its own topic. No generated fallback lesson.
export function reading(why: string, definition: string, mechanism: string, symbols: string, interpretation: string, derivation: string, pitfall: string, question: string, answer: string): Reading {
  return { why, definition, mechanism: mechanism.split('¦'), symbols: symbols.split('¦').map(pair => { const index = pair.indexOf(':'); if (index <= 0) throw new Error(`기호 설명에 이름과 구분자가 필요합니다: ${pair}`); return [pair.slice(0, index), pair.slice(index + 1)] as [string, string]; }), reading: interpretation, derivation: derivation.split('¦'), pitfall, question, answer };
}
