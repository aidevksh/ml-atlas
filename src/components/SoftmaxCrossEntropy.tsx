import { useState } from 'react';
import { classificationTheory as theory } from '../data/curriculum';
import { binaryClassification, classification, smoothedTarget } from '../lib/classificationMath';
import { n } from '../lib/lessonModelTypes';
import { href } from '../lib/route';
import { Formula, Slider, Choice } from './UI';

type Proof = { title:string; text:string; formula:string };
function Derivation({ proof }: { proof:Proof }) {
  return <div className="classification-proof"><h3>{proof.title}</h3><p>{proof.text}</p><Formula>{proof.formula}</Formula></div>;
}
const valueText = (v:number) => Math.abs(v) > 1e4 || (v !== 0 && Math.abs(v) < .0001) ? v.toExponential(3) : n(v);
const vectorText = (v:number[]) => `[${v.map(valueText).join(', ')}]`;

function Curve({ title, xLabel, yLabel, calculate, current, bounds, tangent }: {
  title:string; xLabel:string; yLabel:string; calculate:(x:number)=>number; current:number;
  bounds?:[number,number]; tangent?:number;
}) {
  const points=Array.from({length:101},(_,i)=>({x:-4+i*.08,y:calculate(-4+i*.08)}));
  const ys=points.map(p=>p.y),lo=bounds?.[0]??Math.min(...ys),hi=bounds?.[1]??Math.max(...ys);
  const padding=bounds?0:Math.max((hi-lo)*.12,.01),bottom=lo-padding,top=hi+padding;
  const px=(x:number)=>54+(x+4)*54,py=(y:number)=>204-(y-bottom)/(top-bottom)*174;
  const y=calculate(current),path=points.map((p,i)=>`${i?'L':'M'}${px(p.x)} ${py(p.y)}`).join(' ');
  return <figure className="classification-curve"><figcaption>{title}</figcaption><svg viewBox="0 0 520 250" role="img" aria-label={`${xLabel}에 따른 ${yLabel}`}>
    <title>{`${title} · 보라 곡선, 주황 현재 값${tangent===undefined?'':', 초록 접선'}`}</title>
    {[lo,(lo+hi)/2,hi].map((tick,i)=><g key={i}><path d={`M54 ${py(tick)}H486`} stroke="#e5deeb" /><text x="47" y={py(tick)+4} textAnchor="end">{n(tick)}</text></g>)}
    <path d="M54 26V204H486" fill="none" stroke="#b5a8c7" />
    <path d={path} fill="none" stroke="#7561b8" strokeWidth="3" />
    {tangent!==undefined&&<path d={`M${px(Math.max(-4,current-.5))} ${py(y+tangent*(Math.max(-4,current-.5)-current))}L${px(Math.min(4,current+.5))} ${py(y+tangent*(Math.min(4,current+.5)-current))}`} fill="none" stroke="#488d7d" strokeWidth="3" />}
    <circle cx={px(current)} cy={py(y)} r="5" fill="#bd8548" stroke="white" strokeWidth="2" />
    {[-4,0,4].map(x=><text key={x} x={px(x)} y="226" textAnchor="middle">{x}</text>)}
    <text x="54" y="17">{yLabel}</text><text x="486" y="244" textAnchor="end">{xLabel}</text>
  </svg><p>현재 값 {valueText(y)}{tangent===undefined?'':` · 접선 기울기 ${valueText(tangent)}`}</p></figure>;
}

export default function SoftmaxCrossEntropy() {
  const [logits,setLogits]=useState([2,1,0]),[temperature,setTemperature]=useState(1);
  const [target,setTarget]=useState(0),[smoothing,setSmoothing]=useState(0);
  const [row,setRow]=useState(0),[column,setColumn]=useState(0),[rate,setRate]=useState(.2);
  const [binaryZ,setBinaryZ]=useState(1),[binaryY,setBinaryY]=useState(1);
  const [previousLoss,setPreviousLoss]=useState<number|null>(null);
  const y=smoothedTarget(3,target,smoothing),r=classification(logits,y,temperature);
  const at=(x:number)=>classification(logits.map((z,j)=>j===column?x:z),y,temperature);
  const update=()=>{setPreviousLoss(r.loss);setLogits(logits.map((z,j)=>z-rate*r.gradient[j]));};
  const changeLogit=(index:number,z:number)=>{setPreviousLoss(null);setLogits(logits.map((old,j)=>j===index?z:old));};
  const reset=()=>{setLogits([2,1,0]);setTemperature(1);setTarget(0);setSmoothing(0);setRow(0);setColumn(0);setRate(.2);setPreviousLoss(null);};
  const binary=binaryClassification(binaryZ,binaryY);
  return <section className="topic-experiment classification-lab">
    <span className="reading-label">출력층의 미분을 끝까지 연결하기</span>
    <h2>Softmax → 크로스 엔트로피 → 역전파</h2>
    <p>세 클래스, 한 표본의 계산입니다. Logit·정답·온도를 바꾸면 야코비안, 손실, 미분과 그래프가 함께 바뀝니다. 정답은 고정된 분포이며 클래스 가중치·ignore는 사용하지 않습니다.</p>
    <div className="classification-inputs">{logits.map((z,i)=><Slider key={i} label={`클래스 ${i+1} logit z${i+1}`} value={z} onChange={v=>changeLogit(i,v)} min={-4} max={4} step="any" />)}
      <Slider label="온도 τ" value={temperature} onChange={v=>{setTemperature(v);setPreviousLoss(null);}} min={.5} max={2} step={.1} />
      <Slider label="Label smoothing ε" value={smoothing} onChange={v=>{setSmoothing(v);setPreviousLoss(null);}} min={0} max={.3} step={.01} />
    </div>
    <Choice label="정답 클래스" value={target} onChange={v=>{setTarget(v);setPreviousLoss(null);}} options={[0,1,2].map(i=>({value:i,label:`클래스 ${i+1}`}))} />
    <div className="classification-flow"><div><b>1. 점수 z</b><code>{vectorText(logits)}</code></div><span aria-hidden="true">→</span><div><b>2. 확률 p</b><code>{vectorText(r.probabilities)}</code></div><span aria-hidden="true">→</span><div><b>3. 손실 L</b><strong>{n(r.loss)} nats</strong></div></div>
    <p>정답 분포 y={vectorText(y)} · y=(1−ε)one-hot+ε/C · 확률 합={n(r.probabilities.reduce((s,p)=>s+p,0))}</p>
    <Derivation proof={theory.same} /><Derivation proof={theory.other} />
    <h3>야코비안의 한 칸을 선택하세요</h3>
    <p>행은 출력 확률 pᵢ, 열은 입력 점수 zⱼ입니다. 초록은 양수, 주황은 음수입니다. 대각은 자기 점수의 영향, 나머지는 경쟁 후보의 영향입니다. 각 열의 합은 0으로 확률 합을 보존합니다.</p>
    <div className="classification-matrix"><table><caption>J [3,3] · ∂pᵢ/∂zⱼ</caption><thead><tr><th scope="col">출력 / 입력</th>{logits.map((_,j)=><th key={j} scope="col">z{j+1}</th>)}</tr></thead><tbody>{r.jacobian.map((values,i)=><tr key={i}><th scope="row">p{i+1}</th>{values.map((v,j)=><td key={j}><button className={`${v>=0?'positive':'negative'} ${row===i&&column===j?'selected':''}`} aria-pressed={row===i&&column===j} aria-label={`p${i+1}을 z${j+1}로 미분: ${valueText(v)}`} onClick={()=>{setRow(i);setColumn(j);}}>{valueText(v)}</button></td>)}</tr>)}</tbody></table></div>
    <Formula>선택: ∂p{row+1}/∂z{column+1} = {row===column?'pᵢ(1−pᵢ)/τ':'−pᵢpⱼ/τ'} = {valueText(r.jacobian[row][column])}</Formula>
    <div className="classification-charts"><Curve title="점수 변화와 확률" xLabel={`z${column+1}`} yLabel={`p${row+1}`} calculate={x=>at(x).probabilities[row]} current={logits[column]} bounds={[0,1]} tangent={r.jacobian[row][column]} /><Curve title="같은 확률의 미분" xLabel={`z${column+1}`} yLabel={`∂p${row+1}/∂z${column+1}`} calculate={x=>at(x).jacobian[row][column]} current={logits[column]} /></div>
    <p>선택한 z{column+1}만 −4부터 4까지 움직이고 나머지 logits·온도·정답은 현재 값으로 고정했습니다. 확률 곡선의 초록 접선 기울기가 오른쪽 미분 곡선의 현재 값입니다.</p>
    <Derivation proof={theory.ce} /><Derivation proof={theory.probability} /><Derivation proof={theory.chain} />
    <div className="classification-matrix"><table><caption>역전파의 두 단계 · 확률 미분과 logit 미분</caption><thead><tr><th scope="col">클래스</th><th scope="col">yᵢ</th><th scope="col">pᵢ</th><th scope="col">∂L/∂pᵢ</th><th scope="col">∂L/∂zᵢ</th></tr></thead><tbody>{y.map((target,i)=><tr key={i}><th scope="row">{i+1}</th><td>{valueText(target)}</td><td>{valueText(r.probabilities[i])}</td><td>{valueText(-target/r.probabilities[i])}</td><td>{valueText(r.gradient[i])}</td></tr>)}</tbody></table></div>
    <Formula>∂L/∂z = {vectorText(r.gradient)}{'\n'}Σⱼ ∂L/∂zⱼ = {n(r.gradient.reduce((s,g)=>s+g,0))}</Formula>
    <div className="classification-charts"><Curve title="선택한 점수에 따른 CE 손실" xLabel={`z${column+1}`} yLabel="L (nats)" calculate={x=>at(x).loss} current={logits[column]} tangent={r.gradient[column]} /><Curve title="손실의 logit 미분" xLabel={`z${column+1}`} yLabel={`∂L/∂z${column+1}`} calculate={x=>at(x).gradient[column]} current={logits[column]} /></div>
    <p>정답 logit의 미분이 음수이면 경사하강이 그 점수를 올립니다. ε=0에서 확신하며 틀린 정답의 미분은 τ=1일 때 −1에 가까워져, Softmax 자체의 작은 미분과 달리 학습 신호가 남습니다.</p>
    <Slider label="logit 이동의 학습률 η" value={rate} onChange={setRate} min={.01} max={.25} step={.01} />
    <div className="classification-actions"><button className="button primary" onClick={update} disabled={logits.some((z,j)=>Math.abs(z-rate*r.gradient[j])>4)}>logit 한 번 업데이트</button><button className="button" onClick={reset}>전체 입력 초기화</button></div>
    {previousLoss!==null&&<p className="classification-update" role="status">업데이트 전 손실 {n(previousLoss)} → 새 순전파 손실 {n(r.loss)}</p>}
    <p>버튼은 z←z−η∂L/∂z를 수행하는 국소 예제이며 slider 범위 −4~4를 벗어나기 전에 멈춥니다. 실제 신경망에서는 다음 식으로 W·b를 갱신해 logits를 다시 계산합니다.</p>
    <Derivation proof={theory.stable} /><Derivation proof={theory.batch} />
    <p><a href={href('/lesson/neural-network')}>신경망 반복 학습</a> · <a href={href('/lesson/torch-losses')}>PyTorch 손실의 입력 형식</a> · <a href={href('/lesson/information-theory')}>엔트로피와 KL</a></p>
    <details><summary>이진 BCE와 Sigmoid의 미분도 확인하기</summary><Derivation proof={theory.binary} />
      <Slider label="이진 logit z" value={binaryZ} onChange={setBinaryZ} min={-4} max={4} step={.1} />
      <Choice label="이진 정답" value={binaryY} onChange={setBinaryY} options={[{value:0,label:'y = 0'},{value:1,label:'y = 1'}]} />
      <Formula>p=σ(z)={n(binary.probability)}; L={n(binary.loss)}{'\n'}∂L/∂z=p−y={n(binary.gradient)}</Formula>
      <div className="classification-charts"><Curve title="이진 BCE 손실" xLabel="z" yLabel="L (nats)" calculate={z=>binaryClassification(z,binaryY).loss} current={binaryZ} tangent={binary.gradient} /><Curve title="BCE의 logit 미분" xLabel="z" yLabel="p−y" calculate={z=>binaryClassification(z,binaryY).gradient} current={binaryZ} /></div>
    </details>
    <details><summary>클래스 가중치와 reduction이 있으면</summary><Derivation proof={theory.weighted} /></details>
  </section>;
}
