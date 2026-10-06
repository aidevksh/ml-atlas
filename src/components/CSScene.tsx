import type { Calculation } from '../lib/lessonModelTypes';
import { n } from '../lib/lessonModelTypes';
import { graphEdges,topK,traverseGraph } from '../lib/csModels';
export default function CSScene({topicId,p,result}:{topicId:string;p:Record<string,number>;result:Calculation}) {
 if(topicId==='cs-graph') {
  const positions=[[60,140],[175,60],[175,215],[310,140],[420,60],[310,260]],r=traverseGraph(p.start,Boolean(p.method));
  return <figure className="topic-scene"><svg viewBox="0 0 480 330" role="img" aria-label="현재 시작점의 BFS 거리 또는 DFS 트리 깊이">{graphEdges.map(([a,b],i)=><line key={i} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="#c0abd4" strokeWidth="2"/>)}{positions.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="22" fill={i===p.start?'#d9c8ef':'#eaf2ed'} stroke="#8f74ac"/><text x={x} y={y+5} textAnchor="middle">{i}</text><text x={x} y={y+44} textAnchor="middle">{p.method?'깊이':'거리'} {r.distance[i]}</text></g>)}</svg><figcaption>보라: 시작점 · 노드 숫자: ID · 아래 숫자: {p.method?'DFS 탐색 트리 깊이':'BFS 최소 hop'} · 방문 순서 [{r.order.join(', ')}]. 노드를 발견한 즉시 표시해 중복 처리를 막습니다.</figcaption></figure>;
 }
 if(topicId==='cs-shortest-path') {
  const positions=[[60,145],[215,50],[215,245],[395,145]],edges=[[0,1,2],[1,2,p.weight],[0,2,8],[2,3,1],[1,3,9]];
  return <figure className="topic-scene"><svg viewBox="0 0 480 325" role="img" aria-label="가중 방향 그래프와 현재 최단 비용"><defs><marker id="shortest-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#9d80b8"/></marker></defs>{edges.map(([a,b,w],i)=>{const [x,y]=positions[a],[u,v]=positions[b],dx=u-x,dy=v-y,len=Math.hypot(dx,dy);return <g key={i}><line x1={x+dx/len*25} y1={y+dy/len*25} x2={u-dx/len*27} y2={v-dy/len*27} stroke="#9d80b8" strokeWidth="2" markerEnd="url(#shortest-arrow)"/><text x={(x+u)/2+10} y={(y+v)/2-8}>{w}</text></g>;})}{positions.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="24" fill={i?'#f1eaf8':'#d9c8ef'} stroke="#8f74ac"/><text x={x} y={y+5} textAnchor="middle">{i}</text><text x={x} y={y+46} textAnchor="middle">d={result.matrix!.values[0][i]}</text></g>)}</svg><figcaption>화살표 숫자: 간선 비용 · d: 시작 0에서의 최단 비용. 1→2 비용을 바꾸면 직접 경로 8과 경유 경로 2+w를 비교한 결과가 함께 바뀝니다.</figcaption></figure>;
 }
 if(topicId==='cs-heap-topk') {
  const heap=topK([4,1,8,3,6,2,9,5],p.k).heap,position=(i:number)=>{const depth=Math.floor(Math.log2(i+1)),first=2**depth-1,j=i-first;return[(j+.5)*460/2**depth,40+depth*70];};
  return <figure className="topic-scene"><svg viewBox="0 0 460 305" role="img" aria-label="Top-k 후보를 유지하는 실제 min-heap">{heap.slice(1).map((_,j)=>{const i=j+1,[x,y]=position(i),[u,v]=position(Math.floor((i-1)/2));return <line key={i} x1={x} y1={y} x2={u} y2={v} stroke="#c0abd4" strokeWidth="2"/>;})}{heap.map((value,i)=>{const [x,y]=position(i);return <g key={i}><circle cx={x} cy={y} r="18" fill={i?'#efe7f8':'#d8c4ef'} stroke="#8d6daf"/><text x={x} y={y+5} textAnchor="middle">{value}</text><text x={x} y={y+36} textAnchor="middle">i={i}</text></g>;})}</svg><figcaption>루트는 현재 후보 중 최솟값 {heap[0]}입니다. 모든 부모는 자식보다 작거나 같지만 같은 깊이의 값과 전체 배열은 정렬되어 있지 않습니다.</figcaption></figure>;
 }
 if(topicId==='cs-prefix-window') {
  const l=p.left,r=Math.max(l+1,p.right),prefix=[0,1,3,6,10,15,21,28,36];
  return <figure className="topic-scene"><svg viewBox="0 0 500 270" role="img" aria-label="선택 구간과 누적합의 차">{[1,2,3,4,5,6,7,8].map((value,i)=><g key={i}><rect x={22+i*58} y="175" width="50" height="40" rx="5" fill={i>=l&&i<r?'#d7c3ec':'#f1ecf5'}/><text x={47+i*58} y="201" textAnchor="middle">{value}</text><text x={47+i*58} y="238" textAnchor="middle">{i}</text></g>)}<path d={prefix.map((v,i)=>`${i?'L':'M'}${24+i*56},${140-v*3}`).join(' ')} fill="none" stroke="#7561b8" strokeWidth="3"/>{prefix.map((v,i)=><g key={i}><circle cx={24+i*56} cy={140-v*3} r={i===l||i===r?5:3} fill={i===l||i===r?'#c48a4e':'#7561b8'}/><text x={24+i*56} y={128-v*3} textAnchor="middle">{v}</text></g>)}</svg><figcaption>보라 사각형: 원본 [l,r) · 위 곡선: 앞 i개 값의 누적합 P[i]. 주황 두 점의 세로 차 P[{r}]−P[{l}]={prefix[r]}−{prefix[l]}={prefix[r]-prefix[l]}가 선택 구간의 합입니다.</figcaption></figure>;
 }
 if(topicId==='cs-compute-graph') {
  const labels=[`x=${n(p.x)}`,`u=x²=${n(p.x**2)}`,`v=ax=${n(p.a*p.x)}`,`L=${n(result.metrics[0].value!)}`],positions=[[75,130],[260,55],[260,205],[450,130]];
  return <figure className="topic-scene"><svg viewBox="0 0 550 290" role="img" aria-label="계산 그래프의 분기와 두 gradient 경로 합산">{[[0,1],[0,2],[1,3],[2,3]].map(([a,b],i)=><line key={i} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="#b7a0cd" strokeWidth="2"/>)}{positions.map(([x,y],i)=><g key={i}><rect x={x-65} y={y-23} width="130" height="46" rx="10" fill="#efe7f7" stroke="#baa1d2"/><text x={x} y={y+5} textAnchor="middle">{labels[i]}</text></g>)}<text x="75" y="179" textAnchor="middle">g=2x+a={n(2*p.x+p.a)}</text><text x="170" y="56" fill="#488d7d">← 2x={n(2*p.x)}</text><text x="170" y="224" fill="#488d7d">← a={n(p.a)}</text><text x="370" y="72">← 1</text><text x="370" y="204">← 1</text></svg><figcaption>순전파: x → u,v → L · 역전파: L → u,v → x. 공유 입력 x에서 두 기여를 더하며, 계산 순서는 위상 순서와 그 역순입니다.</figcaption></figure>;
 }
 return null;
}
