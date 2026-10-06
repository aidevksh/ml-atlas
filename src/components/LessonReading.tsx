import { useState } from 'react';
import type { Topic } from '../data/curriculum';
import type { Reading } from '../data/lessons/types';
import { glossary, notation } from '../data/lessons/glossary';
import { Formula } from './UI';
import { ConceptText } from './ConceptConnections';

export function Foundations() {
  return <details className="foundation-guide"><summary>처음 배우나요? 이 페이지를 읽기 위한 말과 기호</summary><p>수식을 먼저 외우지 않아도 됩니다. 아래 말을 확인한 뒤, 정의와 작은 계산을 읽고 실험의 숫자를 바꿔보세요.</p><dl className="definition-list">{glossary.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl><h3>수식에서 자주 만나는 기호</h3><dl className="definition-list notation-list">{notation.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl><p>설명 속 선수 지식 링크는 더 자세히 읽고 싶을 때 이용하면 됩니다. 이 페이지의 핵심 계산은 본문에서 다시 풀어 설명합니다.</p></details>;
}
export function ReadingBefore({ topic, content }: { topic: Topic; content: Reading }) {
  const linked=(text:string)=><ConceptText text={text} current={topic.id}/>;
  return <div className="lesson-reading"><Foundations />
    <section className="reading-section" id="lesson-definition"><div className="reading-label">개념부터 이해하기</div><h2>어떤 문제를 해결할까요?</h2><p>{linked(content.why)}</p><div className="concept-definition"><h3>정의</h3><p>{linked(content.definition)}</p></div></section>
    <section className="reading-section"><h2>작동 과정을 따라가 봅시다</h2><div className="mechanism-steps">{content.mechanism.map((text,i)=><div key={i}><span aria-hidden>{i+1}</span><p>{linked(text)}</p></div>)}</div></section>
    <section className="reading-section" id="lesson-formula"><h2>수식을 말로 읽으면</h2><Formula>{topic.formula}</Formula><p>{linked(content.reading)}</p><dl className="definition-list">{content.symbols.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{linked(meaning)}</dd></div>)}</dl>{topic.expansion&&<div className="formula-expansion"><h3>수식을 전개하면</h3><Formula>{topic.expansion.formula}</Formula><p>{linked(topic.expansion.explanation)}</p></div>}<div className="shape-explanation"><b>입력과 출력의 형태</b><p>{topic.dimensions}</p><p>대괄호 안 숫자는 각 축의 크기입니다. 결과가 숫자 하나인지, 벡터인지, 표인지 확인하면 연산이 무엇을 남겼는지 이해할 수 있습니다.</p></div></section>
    <section className="reading-section" id="lesson-example"><h2>작은 예제를 손으로 계산하기</h2><p className="example-setup">{linked(topic.example)}</p><ol className="worked-steps">{content.derivation.map(text=><li key={text}>{linked(text)}</li>)}</ol></section></div>;
}
export function ReadingAfter({ content,topicId }: { content: Reading;topicId:string }) {
  const [shown, setShown] = useState(false);
  return <div className="lesson-reading"><section className="reading-section misunderstanding"><h2>여기서 자주 헷갈립니다</h2><p><ConceptText text={content.pitfall} current={topicId}/></p></section><section className="reading-section understanding-check"><h2>내 말로 설명해 보기</h2><p><ConceptText text={content.question} current={topicId}/></p><p className="check-instruction">먼저 예상하고, 그 이유를 적거나 말해보세요. 그다음 해설과 실험의 결과를 비교합니다.</p><button className="button" aria-expanded={shown} onClick={() => setShown(v => !v)}>{shown ? '해설 접기' : '해설 확인하기'}</button>{shown && <div className="answer-explanation" role="status"><b>해설</b><p><ConceptText text={content.answer} current={topicId}/></p></div>}</section></div>;
}
