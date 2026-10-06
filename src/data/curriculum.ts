export type CategoryId = 'llm' | 'dl' | 'ml' | 'rl' | 'math' | 'pytorch' | 'design' | 'cs';
export type LabId = 'transformer' | 'activation' | 'shape' | 'vectors' | 'gradient' | 'probability' | 'regression' | 'clustering' | 'rag' | 'flow' | 'gan' | 'qlearning';
export interface Topic {
  id: string; title: string; summary: string; formula: string; dimensions: string;
  example: string; category: CategoryId; group: string; tags: string[]; prerequisites: string[];
  lab?: LabId; references: { title: string; url: string }[];
  expansion?: { formula: string; explanation: string };
}
export const categories: { id: CategoryId; name: string; shortName?: string; english: string; description: string; color: string; symbol: string }[] = [
  { id: 'llm', name: 'LLM', english: 'Language & intelligence', description: '토큰에서 에이전트까지, 언어 모델을 연결하는 방법.', color: '#7561b8', symbol: '✳' },
  { id: 'dl', name: 'DL (Deep Learning)', shortName: 'DL', english: 'Deep Learning', description: '작은 뉴런에서 시작해 복잡한 표현을 쌓아갑니다.', color: '#488d7d', symbol: '▦' },
  { id: 'ml', name: 'ML (Machine Learning)', shortName: 'ML', english: 'Machine Learning', description: '데이터 속 패턴을 찾고, 예측하고, 설명합니다.', color: '#bd8548', symbol: '◈' },
  { id: 'rl', name: 'RL (Reinforcement Learning)', shortName: 'RL', english: 'Reinforcement Learning', description: '행동과 보상 사이에서 더 나은 선택을 배웁니다.', color: '#5986b6', symbol: '↗' },
  { id: 'math', name: '수학', english: 'Mathematical foundations', description: '벡터, 미분, 확률. 모델을 이해하는 공통 언어.', color: '#a76e8f', symbol: '∑' },
  { id: 'pytorch', name: '파이토치', english: 'PyTorch in practice', description: '텐서를 만들고, 모델을 쓰고, 학습을 실행합니다.', color: '#c1775b', symbol: '⌘' },
  { id: 'design', name: '모델설계학습', english: 'Design & training', description: '차원을 맞추고, 학습을 안정화하고, 제대로 평가합니다.', color: '#73866a', symbol: '⊞' },
  { id: 'cs', name: 'CS (Computer Science)', shortName: 'CS', english: 'Computer Science', description: '코딩테스트의 알고리즘을 검색·계산 그래프·딥러닝 개발로 연결합니다.', color: '#7561b8', symbol: '{}' },
];
const sources: Record<CategoryId, { title: string; url: string }> = {
  llm: { title: 'Hugging Face — LLM course', url: 'https://huggingface.co/learn/llm-course/chapter1/1' },
  dl: { title: 'Deep Learning — Goodfellow, Bengio, Courville', url: 'https://www.deeplearningbook.org/' },
  ml: { title: 'scikit-learn — User guide', url: 'https://scikit-learn.org/stable/user_guide.html' },
  rl: { title: 'Sutton & Barto — Reinforcement Learning', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
  math: { title: 'Mathematics for Machine Learning — authors’ textbook', url: 'https://mml-book.github.io/' },
  pytorch: { title: 'PyTorch — Learn the basics', url: 'https://docs.pytorch.org/tutorials/beginner/basics/intro.html' },
  design: { title: 'Deep Learning — Practical methodology', url: 'https://www.deeplearningbook.org/contents/guidelines.html' },
  cs: { title: 'MIT 6.006 — Introduction to Algorithms', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
};
// Each row is one authored concept note. Labs are explicitly attached where an
// actual numerical or workflow experiment is available; other notes stay labeled.
const topics: Topic[] = [];
let category: CategoryId = 'llm';
let group = '기초';
const section = (c: CategoryId, g: string) => { category = c; group = g; };
function topic(id: string, title: string, summary: string, formula: string, dimensions: string, example: string, lab?: LabId, tags: string[] = [], reference?: [string, string]) {
  topics.push({ id, title, summary, formula, dimensions, example, lab, tags, category, group,
    prerequisites: [], references: reference ? [{ title: reference[0], url: reference[1] }] : [sources[category]] });
}
section('llm', '언어 모델의 기초');
topic('llm-basics', 'LLM의 기본 구조', '텍스트를 토큰 ID로 바꾸고 임베딩·Transformer를 거쳐 다음 토큰의 확률을 계산합니다. 토큰 수는 글자 수와 다릅니다.', 'p(x₁:T) = ∏ₜ p(xₜ | x₁:ₜ₋₁)', 'ID: [B,T] → 표현: [B,T,D] → logits: [B,T,V]', 'B=1, T=4, D=8, V=10이면 마지막 위치의 10개 logit으로 다음 토큰 하나를 선택합니다.', 'activation', ['자기지도', '생성']);
topic('llm-generation', '생성과 추론', '미래 토큰을 보지 않고 한 토큰씩 생성합니다. 온도는 분포의 집중도를 바꾸며 Top-k·Top-p는 후보를 제한합니다.', 'pᵢ = exp(zᵢ/τ) / Σⱼ exp(zⱼ/τ)', '현재 logits: [V], 생성 후 길이: T → T+1', 'logits=[2,1,0], τ=1이면 확률은 약 [0.665,0.245,0.090]입니다. τ를 낮추면 첫 후보에 집중합니다.', 'activation', ['생성']);
topic('prompting', '프롬프트와 문맥', '지시·예시·참고 자료를 입력에 배치해 응답을 유도합니다. Few-shot은 문맥의 예시이며 모델 가중치를 바꾸지 않습니다.', '입력 토큰 + 최대 출력 토큰 ≤ 문맥 한도', '[지시 | 예시 | 자료 | 질문] → 응답', '문맥 한도 4096에서 지시·예시가 800, 질문이 100, 출력 예산이 500이면 자료 예산은 2696토큰입니다.', 'flow');
topic('cot', 'CoT와 단계적 문제 풀이', '답만 제시하는 예시와 중간 풀이를 포함한 예시를 비교합니다. 생성된 풀이가 내부 계산을 충실하게 설명하거나 정답을 보장하지는 않습니다.', '입력 → 중간 풀이 → 답 → 별도 검증', '한 문제 → 여러 풀이 후보 → 검증 결과', '3개 풀이의 답이 [12,12,15]이면 다수결 답은 12입니다. 검산이 없으면 다수가 틀릴 수도 있습니다.', 'flow', [], ['Chain-of-Thought Prompting', 'https://arxiv.org/abs/2201.11903']);
section('llm', '모델의 학습과 적응');
topic('llm-training', '사전학습과 SFT', '사전학습은 다음 토큰 예측으로 언어 패턴을 배웁니다. SFT는 지시·응답 예시를 학습하고 보통 응답 위치의 손실에 집중합니다.', 'ℒ = −Σₜ mₜ log p(yₜ | y<ₜ)', 'logits [B,T,V], targets·mask [B,T]', '정답 확률이 0.8인 응답 토큰의 손실은 −log(0.8)≈0.223입니다. m=0인 지시 위치는 이 손실 합에서 제외됩니다.', undefined, ['자기지도', '지도']);
topic('llm-finetuning', 'Fine-tuning · LoRA · QLoRA', '전체 가중치를 업데이트하거나 저랭크 보정만 학습합니다. QLoRA는 양자화된 기반 모델과 학습 가능한 어댑터를 결합합니다.', 'W′ = W + BA', 'W: [out,in], B: [out,r], A: [r,in]', 'in=out=4096, r=8이면 어댑터는 65,536개 파라미터입니다. 전체 행렬은 16,777,216개입니다. Bias·스케일·옵티마이저 상태는 별도입니다.', undefined, ['지도'], ['LoRA', 'https://arxiv.org/abs/2106.09685']);
topic('preference-learning', '선호도 학습 · RLHF · DPO', 'SFT 이후 응답 쌍의 선호를 학습할 수 있습니다. RLHF는 보상 기반 정책 최적화를, DPO는 선호 쌍을 이용한 직접 목적함수를 사용합니다.', 'ℒDPO = −log σ(β[log π(y⁺)/πref(y⁺) − log π(y⁻)/πref(y⁻)])', 'prompt → 선호 응답 y⁺ / 비선호 응답 y⁻', '선호 log-ratio가 1, 비선호가 0, β=1이면 손실은 −log σ(1)≈0.313입니다.', undefined, ['지도', '강화'], ['Direct Preference Optimization', 'https://arxiv.org/abs/2305.18290']);
topic('distillation', '지식 증류', 'Teacher의 출력 분포나 응답 데이터를 Student의 학습 목표로 사용합니다. 증류는 작은 모델로 지식을 전달하는 데 활용되지만 크기가 반드시 작아야 하는 것은 아닙니다.', 'ℒ = αℒhard + (1−α)τ² KL(pteacher,τ ∥ pstudent,τ)', 'teacher·student logits: 동일한 출력 공간 [V]', 'Teacher=[0.7,0.2,0.1], Student=[0.5,0.3,0.2]의 KL은 약 0.085입니다. 작은 후보 간 관계도 학습 신호가 됩니다.', 'probability', ['지도'], ['Distilling the Knowledge in a Neural Network', 'https://arxiv.org/abs/1503.02531']);
section('llm', '지식과 검색');
topic('retrieval', '키워드 · 벡터 · Hybrid 검색', '키워드 일치와 의미 벡터 유사도는 다른 검색 신호입니다. Hybrid 검색은 두 순위의 정보를 결합합니다.', 'cos(q,d) = q·d / (‖q‖‖d‖)', 'query [D], documents [N,D] → scores [N]', 'q=[1,0], d₁=[1,1], d₂=[0,1]이면 cosine은 0.707과 0입니다. 실제 의미 임베딩이 아닌 작은 벡터 예제입니다.', 'rag');
topic('rag', 'RAG', '자료를 청크로 나누고 검색한 근거를 질문과 함께 모델에 전달합니다. 검색 실패와 생성 실패는 따로 평가합니다.', '질문 → 검색 top-k → 근거 문맥 → 생성', 'N개 청크 × D차원 → k개 근거', '4개 청크 중 관련도 상위 2개만 선택하면 읽는 자료와 토큰 비용이 바뀝니다. 검색 결과가 답의 근거를 포함하는지도 확인해야 합니다.', 'rag', [], ['Retrieval-Augmented Generation', 'https://arxiv.org/abs/2005.11401']);
topic('ontology', 'Ontology · Knowledge Graph', 'Ontology는 개념·관계·제약의 의미를 정의하고, 지식 그래프는 실제 개체와 관계를 담습니다. 문자열이 같다고 동일 개체는 아닙니다.', 'Company ⊑ Organization; worksFor(Person, Organization)', '노드: 개체 / 엣지: 관계 / schema: 타입·제약', '“민수 worksFor A회사”에서 OWL domain·range는 Person·Organization 타입을 추론합니다. 입력 오류를 검사하려면 별도의 검증 규칙이 필요합니다.', 'flow', [], ['OWL 2 Primer — W3C', 'https://www.w3.org/TR/owl2-primer/']);
topic('graphrag', 'GraphRAG', '개체와 관계를 추출하고 그래프·커뮤니티 요약을 검색에 활용합니다. 그래프 구성 품질과 질문 유형에 따라 효과가 달라집니다.', '자료 → 개체·관계 → 커뮤니티 요약 → 검색·답변', '문서 → [개체, 관계] → 부분 그래프·요약', '“A회사의 협력사는?”은 A에 연결된 관계를 탐색하고, 전체 동향 질문은 여러 커뮤니티 요약을 이용할 수 있습니다.', 'flow', [], ['Microsoft GraphRAG', 'https://microsoft.github.io/graphrag/']);
topic('llm-wiki', 'LLM Wiki', 'LLM이 원본 자료를 읽고 지속적인 요약·개체·개념 페이지와 상호 링크를 유지하는 지식베이스 패턴입니다. 검색 방식과 함께 사용할 수 있습니다.', '원본 → 통합 페이지 → 링크·출처 → 질의·갱신', '원본 자료 / 파생 Wiki / 유지 규칙', '새 자료가 기존 주장과 충돌하면 원본 출처를 보존하고 해당 개념·개체 페이지와 갱신 기록을 함께 수정합니다.', 'flow', [], ['LLM Wiki — Andrej Karpathy', 'https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f']);
topic('knowledge-strategies', '지식 활용 방식 비교', 'Prompting은 문맥, Fine-tuning은 파라미터, RAG는 외부 근거를 활용합니다. GraphRAG와 Wiki는 지식 조직 방식까지 확장합니다.', '응답 = f(모델 파라미터, 입력 문맥, 검색 근거)', '모델 / 문맥 / 외부 지식의 서로 다른 갱신 단위', '오늘 바뀐 제품 가격은 근거 검색·갱신으로, 일관된 응답 형식은 예시·SFT로 다룰 수 있습니다. 방법들은 결합 가능합니다.', 'flow');
section('llm', '에이전트와 운영');
topic('tools-agents', '도구 호출과 에이전트', '모델이 도구 호출을 제안하면 실행 시스템이 입력을 검사하고 도구를 실행합니다. 결과를 다시 모델에 제공하며 종료 조건을 관리합니다.', '모델 → 호출 → 실행 → 결과 → 모델', '호출: {name, arguments}; 결과: 구조화된 데이터', '계산기 호출 add(2,3)의 결과 5를 다음 입력에 넣습니다. 잘못된 인수는 실행 전 검사하고 실패는 제한된 횟수만 재시도합니다.', 'flow');
topic('mcp', 'MCP', 'AI 애플리케이션과 도구·자료를 연결하는 프로토콜입니다. Host가 Client를 관리하고 Client는 Server의 기능을 사용합니다.', 'Host → Client ⇄ Server → Tool / Resource / Prompt', '도구 정의 → 인수 → 결과의 메시지 구조', '도구 목록 조회 → 계산기 도구 선택 → 인수 {a:2,b:3} 전달 → 결과 5 수신의 순서를 따라갑니다.', 'flow', [], ['Model Context Protocol', 'https://modelcontextprotocol.io/docs/getting-started/intro']);
topic('harness', '에이전트 하네스', '모델 주변에서 문맥·도구·상태·권한·실행 루프·로그·복구를 관리하는 시스템입니다. 하네스가 실행 정책과 자원 한도를 결정합니다.', '실행 상태 sₜ → 모델·도구 → 상태 sₜ₊₁', '문맥·상태·도구 실행·관찰 로그', '도구 실패 시 상태와 로그를 보존하고 재시도합니다. 반복 한도 3이면 네 번째 실행 대신 사용자에게 실패 상태를 전달합니다.', 'flow', [], ['Effective harnesses — Anthropic', 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents']);
topic('llm-evaluation', 'LLM 평가와 운영', '정답성·근거 충실성·검색 성능·도구 성공률·비용을 각각 측정합니다. 외부 자료의 지시가 실행 지시로 섞이지 않게 처리합니다.', '성공률 = 성공 작업 / 전체 작업', '평가 사례 N개 → 품질·지연·비용 지표', '20개 도구 작업 중 17개가 완료되면 성공률 85%입니다. 답변에 인용이 있다는 것만으로 근거 충실성이 보장되지는 않습니다.', 'flow');
section('dl', '신경망의 기본 계산');
topic('neural-network', '신경망 · 순전파 · 역전파', '선형변환과 비선형 활성화를 합성해 표현을 학습합니다. 순전파·손실·역전파·가중치 갱신을 반복하며 작은 신경망의 예측과 손실 변화를 직접 확인합니다.', 'h = φ(xW+b); ∂ℒ/∂W = xᵀ ∂ℒ/∂z', 'x [B,in] → h [B,out]', 'x=2, w=3, b=1이면 z=7입니다. ℒ=z²/2의 ∂ℒ/∂w는 z·x=14입니다.', 'activation', ['지도']);
topic('activation', '활성화 함수와 비선형성', '활성화가 없는 선형층 합성은 하나의 선형변환입니다. ReLU·tanh·Sigmoid·Leaky ReLU·GELU·SiLU의 출력·미분 곡선·미분 전개와 상류 gradient 전달을 비교합니다.', 'ReLU(x)=max(0,x); tanh′(x)=1−tanh²(x)', '원소별 활성화는 입력 shape를 보존', 'x=−1에서 ReLU는 0, tanh는 −0.762, Sigmoid는 0.269입니다. 큰 |x|에서 Sigmoid·tanh 미분은 작아집니다.', 'activation');
topic('softmax', 'Softmax와 출력층', '다중 클래스의 logits를 합이 1인 확률로 바꿉니다. 몫 규칙으로 자기·다른 클래스의 미분을 전개하고 야코비안·확률·미분 곡선을 탐색합니다.', 'pᵢ = exp(zᵢ/τ) / Σⱼ exp(zⱼ/τ); ∂pᵢ/∂zⱼ = pᵢ(δᵢⱼ−pⱼ)/τ', '[B,C] → [B,C]; 표본별 야코비안 [C,C]', 'logits [2,1,0], τ=1이면 p≈[0.6652,0.2447,0.0900], ∂p₁/∂z₁≈0.2227, ∂p₁/∂z₂≈−0.1628입니다.', 'activation');
topic('cross-entropy', '크로스 엔트로피와 출력층의 역전파', '분류의 음의 로그우도에서 출발해 ∂L/∂p=−y/p와 Softmax 합성의 ∂L/∂z=p−y를 구별합니다. 소프트 정답·온도·배치 평균과 이진 BCE 미분까지 연결합니다.', 'L = −Σᵢ yᵢ log pᵢ; ∂L/∂zⱼ = (pⱼ−yⱼ)/τ', 'logits·target [B,C] → 평균 손실 scalar; ∂L/∂Z [B,C]', 'z=[2,1,0], y=[1,0,0], τ=1이면 L≈0.4076, ∂L/∂z≈[−0.3348,0.2447,0.0900]입니다. 경사하강은 정답 logit을 올립니다.', undefined, ['지도'], ['Dive into Deep Learning — Softmax and cross-entropy', 'https://d2l.ai/chapter_linear-classification/softmax-regression.html']);
topic('linear-embedding', 'Linear와 Embedding', 'Linear는 feature를 변환하고 Embedding은 ID에 해당하는 학습 가능한 행을 조회합니다. 조회 자체는 토큰 간 정보를 섞지 않습니다.', 'Linear: y=xWᵀ+b; Embedding: y=E[id]', 'W [out,in]; E [vocab,D]; ID [B,T] → [B,T,D]', 'Linear(4,3)은 Bias 포함 4×3+3=15개 파라미터입니다. Embedding(10,4)는 40개입니다.', 'shape');
topic('tensor-connections', '레이어 연결과 텐서 변형', 'Flatten·Reshape·Permute는 구조를 바꿉니다. Concat은 한 축을 늘리고 Residual Add는 호환되는 shape의 값을 더합니다.', 'reshape 전후 numel 동일; [B,a] concat [B,b] → [B,a+b]', '축의 순서·의미와 원소 수를 함께 확인', '[2,3,4]는 24개 원소입니다. [2,12]로 reshape할 수 있지만 [2,10]으로는 불가능합니다.', 'shape');
section('dl', '주요 레이어와 구조');
topic('cnn', '합성곱 레이어와 CNN', '작은 커널을 이동해 지역적 패턴을 계산합니다. 채널·Stride·Padding·Dilation·Groups가 출력 크기와 연결을 결정합니다.', 'Hout = floor((H+2P−D(K−1)−1)/S +1)', '[B,Cin,H,W] → [B,Cout,Hout,Wout]', '입력 [1,3,32,32], Cout=16,K=3,S=1,P=1이면 [1,16,32,32]. Bias 포함 파라미터는 16×3×3²+16=448개입니다.', 'shape');
topic('pooling-upsampling', 'Pooling과 Upsampling', 'Max·Average pooling은 창의 값을 집계합니다. Global·Adaptive pooling은 목표 크기로 집계하고 Upsampling·ConvTranspose는 공간을 확대합니다.', 'MaxPool: y=max(window); AveragePool: y=Σwindow / |window|', '2×2 pool stride 2: [B,C,32,32] → [B,C,16,16]', '창 [1,2,3,4]의 Max는 4, Average는 2.5입니다. 확대는 원래 정보를 자동으로 복구하지 않습니다.', 'shape');
topic('normalization', 'BatchNorm · LayerNorm · RMSNorm', 'BatchNorm과 LayerNorm은 통계를 구하는 축이 다릅니다. RMSNorm은 평균을 빼지 않고 RMS로 나눕니다.', 'LN(x)=γ(x−μ)/√(σ²+ε)+β; RMS=√mean(x²)', 'LayerNorm: feature 축; BatchNorm2d: 각 채널의 B,H,W 축', 'x=[1,2,3]의 평균은 2, 분산은 2/3입니다. γ=1,β=0인 LN은 약 [−1.225,0,1.225]입니다.', undefined);
topic('dropout', 'Dropout', '학습 시 원소를 확률 p로 제거하고 살아남은 값을 1/(1−p)로 확대합니다. 평가 시에는 마스킹하지 않습니다.', 'y = m⊙x/(1−p), mᵢ ~ Bernoulli(1−p)', '입력과 출력 shape 동일', 'p=0.5, x=2이면 학습 출력은 0 또는 4이고 기댓값은 2입니다. 평가 출력은 2입니다. 기울기 폭발의 직접 해결책은 아닙니다.');
topic('rnn-lstm-gru', 'RNN · LSTM · GRU', '시간축의 상태를 반복 갱신합니다. LSTM·GRU는 게이트로 상태 보존과 갱신을 조절하며 긴 의존성 학습을 돕습니다.', 'hₜ=tanh(xₜWₓ+hₜ₋₁Wₕ+b)', 'batch_first: [B,T,I] → [B,T,H×directions]', 'B=2,T=5,H=8인 양방향 출력은 [2,5,16]입니다. LSTM의 h와 c 상태는 각각 [layers×directions,B,H]입니다.');
topic('transformer', 'Transformer', '전체 구조부터 QKV·멀티 헤드·위치 인코딩·Residual·FFN·KV 캐시까지 작은 행렬로 직접 탐색합니다.', 'Attention(Q,K,V)=softmax(QKᵀ/√dₖ+M)V', 'X [n,D] → Q,K [n,dₖ], V [n,dᵥ] → O [n,dᵥ]', '4개 토큰, 표현 차원 4의 입력을 바꾸면 투영·관련도·확률·출력이 함께 다시 계산됩니다.', 'transformer', ['자기지도', '생성'], ['Attention Is All You Need', 'https://arxiv.org/abs/1706.03762']);
topic('gnn', '그래프 신경망', '이웃의 정보를 집계해 노드 표현을 갱신합니다. 그래프 연결과 집계 방식이 정보 전달 범위를 결정합니다.', 'hᵥ′=φ(Wself hᵥ + Wneighbor AGG{hᵤ:u∈N(v)})', '노드 feature [N,D] → [N,Dout]', '이웃 값 [2,4]의 평균은 3입니다. 자신 값 1과 가중치가 모두 1이면 활성화 전 합은 4입니다.');
section('dl', '표현학습과 생성');
topic('autoencoder', 'Autoencoder와 노이즈 제거', '입력을 압축한 뒤 복원합니다. Denoising Autoencoder는 손상된 입력으로 원본을 복원하도록 학습합니다.', 'z=Encoder(x); x̂=Decoder(z); ℒ=mean((x−x̂)²)', '[B,D] → [B,dlatent] → [B,D]', 'x=[1,2], x̂=[0.8,2.2]이면 MSE=0.04입니다. 낮은 복원 오차만으로 의미 있는 표현이 보장되지는 않습니다.', undefined, ['비지도', '자기지도']);
topic('vae', 'VAE', '잠재변수의 확률분포를 학습하고 재매개화로 샘플링과 미분을 연결합니다. 복원 품질과 사전분포에 가까운 잠재공간 사이를 조절합니다.', 'z=μ+σ⊙ε; ℒ=ℒrecon+KL(q(z|x)∥p(z))', 'μ,log σ² [B,dlatent], ε~N(0,I)', 'μ=1,σ=2,ε=0.5이면 z=2입니다. N(1,4)와 N(0,1)의 KL은 (1+4−1−log4)/2≈1.307입니다.', undefined, ['비지도', '생성'], ['Auto-Encoding Variational Bayes', 'https://arxiv.org/abs/1312.6114']);
topic('gan', 'GAN과 적대적 학습', '생성자는 표본을 만들고 판별자는 진짜·가짜를 구별합니다. 두 모델을 교대로 학습하며 분포와 생성 다양성을 살펴봅니다.', 'ℒD=−ElogD(x)−Elog(1−D(G(z))); ℒG=−ElogD(G(z))', 'z → G(z) → D: 진짜일 확률', '이 실험은 1차원 선형 생성자와 두 파라미터 판별자를 실제 경사하강으로 갱신합니다. 이미지 생성 모델이 아니며 수렴을 보장하지 않습니다.', 'gan', ['비지도', '생성'], ['Generative Adversarial Networks', 'https://arxiv.org/abs/1406.2661']);
topic('gan-stability', 'GAN의 학습 문제 · WGAN', 'Mode collapse는 다양한 실제 패턴 중 일부만 생성하는 현상입니다. WGAN은 진짜·가짜 확률 대신 critic과 거리 기반 목적함수를 사용합니다.', 'WGAN: maxf E[f(x)]−E[f(G(z))], f는 1-Lipschitz', '여러 데이터 mode → 생성 분포의 coverage', '실제 군집이 −2와 +2인데 생성자가 +2 주변만 만들면 한 mode가 빠집니다. GAN 손실만으로 다양성을 판단하기 어렵습니다.', undefined, ['생성'], ['Wasserstein GAN', 'https://arxiv.org/abs/1701.07875']);
topic('diffusion', 'Diffusion', '점진적으로 노이즈를 추가한 자료에서 노이즈나 원본을 예측하도록 학습합니다. 역과정의 여러 단계로 표본을 생성합니다.', 'xₜ=√ᾱₜ x₀+√(1−ᾱₜ)ε; ℒ=E‖ε−εθ(xₜ,t)‖²', 'x₀,xₜ,ε: 동일한 입력 shape', 'ᾱ=0.64,x₀=1,ε=−1이면 xₜ=0.8−0.6=0.2입니다. 역과정은 학습한 예측과 샘플링 규칙을 사용합니다.', undefined, ['생성'], ['Denoising Diffusion Probabilistic Models', 'https://arxiv.org/abs/2006.11239']);
topic('contrastive-learning', '대조학습', '같은 자료의 두 증강을 가까이, 다른 자료를 구분 가능하게 표현합니다. Temperature는 유사도 분포의 집중도를 바꿉니다.', 'ℒᵢ=−log exp(sim(zᵢ,z⁺)/τ) / Σⱼ exp(sim(zᵢ,zⱼ)/τ)', '입력 → embedding [B,D] → 유사도 [B,B]', 'Positive 점수 2, Negative 점수 1, τ=1이면 Positive 확률은 0.731, 손실은 0.313입니다.', 'activation', ['자기지도'], ['SimCLR', 'https://arxiv.org/abs/2002.05709']);
topic('masked-learning', '마스킹과 자기회귀 학습', '가려진 위치를 복원하거나 이전 요소에서 다음 요소를 예측합니다. Teacher forcing은 학습 중 이전 정답을 입력으로 제공합니다.', 'ℒmasked=−Σₜ∈masked logp(xₜ|xvisible)', '입력·정답 [B,T], logits [B,T,V]', '4개 위치 중 2개만 가렸다면 복원 손실은 해당 두 위치에서 계산합니다. 추론 시 자기회귀 입력은 이전 생성 결과입니다.', undefined, ['자기지도']);
section('ml', '예측의 기본');
topic('linear-regression', '선형 · 다항 회귀', '가중합으로 연속 값을 예측하고 잔차를 최소화합니다. 다항 특성은 입력의 비선형 패턴을 선형 파라미터로 표현합니다.', 'ŷ=Xw+b; MSE=Σ(yᵢ−ŷᵢ)²/N', 'X [N,D], w [D], y [N]', 'x=[−1,0,1], y=[−1,1,3]은 ŷ=2x+1로 정확히 맞습니다. 점을 움직여 잔차를 비교하세요.', 'regression', ['지도']);
topic('ridge-lasso', 'Ridge와 Lasso', '오차에 가중치 크기 벌점을 더합니다. L2는 큰 계수를 완만하게 줄이고 L1은 일부 계수를 정확히 0으로 만들 수 있습니다.', 'ℒridge=MSE+λ‖w‖²₂; ℒlasso=MSE+λ‖w‖₁', '특성 수 D → 계수 D개', 'w=[2,−1]이면 L2 제곱 벌점은 5λ, L1 벌점은 3λ입니다. 표준화 여부가 규제 효과에 영향을 줍니다.', undefined, ['지도']);
topic('logistic-regression', '로지스틱 회귀', '선형 점수에 Sigmoid를 적용해 이진 확률을 모델링합니다. 임계값은 확률을 결정으로 바꾸는 별도 선택입니다.', 'p=σ(w·x+b); ℒ=−ylogp−(1−y)log(1−p)', 'X [N,D] → logits·확률 [N]', 'z=2이면 p≈0.881입니다. y=1일 때 손실은 0.127이고 y=0일 때는 2.127입니다.', 'activation', ['지도']);
topic('naive-bayes', 'Naive Bayes', '클래스가 주어졌을 때 특성들이 조건부 독립이라는 가정으로 클래스 사후확률을 계산합니다.', 'p(c|x) ∝ p(c)∏ⱼ p(xⱼ|c)', 'D개 특성 → C개 클래스 점수', 'p(c)=0.4, 두 특성의 가능도가 0.5와 0.2이면 비정규화 점수는 0.04입니다. 다른 클래스 점수와 함께 정규화합니다.', undefined, ['지도']);
topic('knn', 'k-NN과 거리', '가까운 k개 표본으로 분류·회귀합니다. 거리 척도와 특성 스케일에 민감하며 k는 국소성과 안정성을 조절합니다.', 'classification: argmaxc Σᵢ∈Nk 1[yᵢ=c]', '질의 [D] vs 훈련 표본 [N,D]', '이웃 레이블 [A,A,B]에서 k=3이면 A를 예측합니다. k=1이면 가장 가까운 한 점만 사용합니다.', 'vectors', ['지도']);
topic('svm', 'SVM과 커널', '클래스 사이의 마진을 확보하면서 위반을 벌점으로 처리합니다. 커널은 내적 계산을 확장해 비선형 결정경계를 만들 수 있습니다.', 'min ½‖w‖²+CΣξᵢ; yᵢ(w·xᵢ+b)≥1−ξᵢ', '선형 w [D]; kernel matrix [N,N]', 'w=[2,0]이면 양쪽 마진 폭은 2/‖w‖=1입니다. C가 커지면 위반 벌점의 상대적 비중이 커집니다.', undefined, ['지도']);
section('ml', '트리와 앙상블');
topic('decision-tree', '결정트리', '특성 임계값으로 데이터를 나눠 자식 노드의 불순도를 줄입니다. 깊이가 커질수록 훈련 데이터에 과하게 맞출 수 있습니다.', 'Gini=1−Σc p²c; gain=Iparent−Σchild(nchild/n)Ichild', '표본 → 분기 → 리프 예측', '클래스 비율 [0.5,0.5]의 Gini는 0.5, [1,0]은 0입니다. 자식 불순도는 표본 수로 가중해야 합니다.', undefined, ['지도']);
topic('ensembles', 'Bagging · Random Forest · Boosting', '여러 모델의 예측을 결합합니다. Bagging은 재표집 모델을 평균하고 Random Forest는 특성 무작위성을 더합니다. Boosting은 순차적으로 오차를 보정합니다.', 'Bagging: ŷ=mean(fm(x)); Boosting: Fm=Fm−1+ηhm', 'M개 모델 → 합산·평균 예측', '회귀 예측 [2,3,4]의 평균은 3입니다. 제곱오차 Boosting에서 정답 5, 현재 예측 3이면 잔차는 2입니다.', undefined, ['지도']);
section('ml', '비지도 학습');
topic('kmeans', 'k-means', '각 점을 가장 가까운 중심에 할당하고 중심을 할당된 점의 평균으로 갱신합니다. 초기화와 k에 따라 국소 해가 달라집니다.', 'J=Σᵢ ‖xᵢ−μcᵢ‖²', 'X [N,D], 중심 [k,D], 할당 [N]', '한 군집의 x=[1,2,6]이면 새 중심은 3입니다. 중심 갱신은 고정 할당의 제곱거리를 최소화합니다.', 'clustering', ['비지도']);
topic('gmm-em', 'Gaussian Mixture · EM', '여러 Gaussian의 혼합으로 분포를 모델링하고 각 점의 군집 책임도를 계산합니다. EM은 책임도와 파라미터를 번갈아 갱신합니다.', 'p(x)=Σk πk N(x|μk,Σk)', 'K개 평균 [K,D], 공분산 [K,D,D]', '두 성분의 가중 점수가 0.2와 0.3이면 책임도는 [0.4,0.6]입니다. k-means의 단일 할당과 다릅니다.', undefined, ['비지도']);
topic('hierarchical-dbscan', '계층적 군집과 DBSCAN', '계층적 군집은 가까운 군집을 병합합니다. DBSCAN은 ε 이웃의 밀도로 군집을 연결하고 희박한 점을 잡음으로 둘 수 있습니다.', 'Nε(x)={y:distance(x,y)≤ε}; core if |Nε(x)|≥min_samples', '거리·이웃 → 군집 레이블·잡음', '자기 자신을 포함해 ε 이웃이 4개이면 min_samples=4에서 core입니다. 반경과 밀도 기준을 함께 봐야 합니다.', undefined, ['비지도']);
topic('dimensionality-reduction', 'PCA · t-SNE · UMAP', 'PCA는 선형 축으로 분산을 보존합니다. t-SNE·UMAP은 이웃 구조를 중심으로 저차원 배치를 만들며 그림의 모든 거리를 원래 거리로 해석할 수 없습니다.', 'PCA: Z=(X−mean(X))Wk', 'X [N,D] → Z [N,k], k≤D', '분산이 [9,1]인 축에서 첫 축만 보존하면 설명 분산 비율은 90%입니다. 복원은 ZWkᵀ+평균입니다.', undefined, ['비지도']);
topic('density-anomaly', '밀도 추정과 이상 탐지', 'KDE는 커널을 합쳐 밀도를 추정합니다. Isolation Forest는 분리 경로, LOF는 이웃의 상대 밀도로 이상 정도를 평가합니다.', 'KDE: p̂(x)=Σᵢ K((x−xᵢ)/h)/(Nh)', '표본 N개 → 밀도·이상 점수', 'Bandwidth를 늘리면 KDE가 더 매끄러워집니다. 이상 점수 임계값을 바꾸면 탐지율과 오탐률도 달라집니다.', undefined, ['비지도']);
section('ml', '응용과 확장');
topic('recommendation', '추천 시스템과 행렬분해', '사용자·아이템의 잠재벡터 내적으로 선호를 예측합니다. 관측하지 않은 평점을 실제 0점으로 취급하지 않는 것이 중요합니다.', 'r̂ui=pu·qi+bu+bi+μ', '사용자 [U,D], 아이템 [I,D] → 예측 [U,I]', 'pu=[1,2],qi=[0.5,1]의 내적은 2.5입니다. 실제 평점 손실은 관측된 사용자·아이템 쌍에서 계산합니다.');
topic('semi-supervised', '준지도학습', '소량의 레이블과 다량의 무레이블 자료를 함께 씁니다. 의사 레이블의 오류가 강화될 수 있으므로 신뢰도와 검증을 관리합니다.', 'ℒ=ℒlabeled+λℒunlabeled', '레이블 n개 + 무레이블 m개', '신뢰도 [0.95,0.6,0.85], 임계값 0.9이면 첫 표본만 의사 레이블로 사용합니다. 신뢰도가 높아도 정답이 보장되지는 않습니다.', undefined, ['준지도']);
section('rl', '환경에서 배우기');
topic('rl-basics', '강화학습 기초와 MDP', 'Agent가 상태에서 행동하고 환경으로부터 보상과 다음 상태를 받습니다. 목표는 기대 누적 보상을 높이는 정책입니다.', 'Gt=Σk≥0 γᵏ rt+k+1', '상태 S, 행동 A, 전이 P(s′|s,a), 보상 R', '보상 [1,2,3], γ=0.5이면 Return=1+1+0.75=2.75입니다. 강화학습은 비지도학습과 별도 학습 방식입니다.', 'qlearning', ['강화']);
topic('bandits', '탐색과 활용 · Bandit', '즉시 보상만 있는 선택 문제에서 미지의 행동을 시도하는 탐색과 좋은 행동을 반복하는 활용을 조절합니다.', 'ε-greedy: ε 확률로 무작위, 나머지는 argmax Q(a)', 'K개 행동 → 가치 추정 K개', 'ε=0.1, 행동 2개이면 greedy 행동의 선택 확률은 0.9+0.1/2=0.95입니다.', undefined, ['강화']);
topic('bellman', '가치함수와 Bellman 방정식', '현재 보상과 다음 상태의 가치 사이의 자기 일관성을 이용합니다. 가치 반복과 정책 반복은 이 관계를 활용합니다.', 'Vπ(s)=Eπ[r+γVπ(s′)]', '상태별 V [S], 상태·행동별 Q [S,A]', '현재 보상 1, 다음 가치 4, γ=0.9인 결정적 전이의 Bellman 목표는 4.6입니다.', 'qlearning', ['강화']);
topic('qlearning', 'Q-learning · SARSA · TD', '관측한 전이로 가치 추정을 갱신합니다. Q-learning은 다음 최대 Q, SARSA는 실제 다음 행동 Q를 목표에 사용합니다.', 'Q(s,a)←Q(s,a)+α[r+γmaxa′Q(s′,a′)−Q(s,a)]', 'Q-table [S,A]', 'Q=2, r=1, next max=4, γ=0.9, α=0.5이면 새 Q는 3.3입니다. 종료 상태는 미래 가치를 0으로 둡니다.', 'qlearning', ['강화']);
section('rl', '심층 강화학습');
topic('dqn', 'DQN', 'Q-table 대신 신경망으로 행동 가치를 예측합니다. Replay buffer의 전이로 학습하고 별도 Target network로 목표를 안정화합니다.', 'ℒ=(r+γmaxa′Qtarget(s′,a′)−Qθ(s,a))²', '상태 [B,D] → 행동 가치 [B,A]', 'target=4.6,prediction=2이면 제곱 TD 오차는 6.76입니다. 종료 전이는 target=r입니다.', undefined, ['강화']);
topic('policy-gradient', 'Policy Gradient · REINFORCE', '높은 Return을 낸 행동의 log 확률을 높이는 방향으로 정책을 학습합니다. Baseline은 편향을 추가하지 않으면서 분산을 줄일 수 있습니다.', '∇J=E[∇logπθ(a|s)(G−b)]', '상태 → 행동 분포 [A]', 'Return=5,baseline=3이면 Advantage=2입니다. 같은 행동도 평균보다 낮은 보상이면 확률을 줄이는 신호가 됩니다.', undefined, ['강화']);
topic('actor-critic-ppo', 'Actor–Critic · PPO', 'Actor는 정책, Critic은 가치를 추정합니다. PPO의 clipped surrogate는 큰 정책 변화의 이득을 제한하지만 변화량의 엄격한 보장은 아닙니다.', 'LPPO=E[min(rA,clip(r,1−ε,1+ε)A)]', '확률 비율 r=πnew(a|s)/πold(a|s)', 'A=2,r=1.5,ε=0.2이면 min(3,2.4)=2.4입니다. 음수 Advantage에서는 clipping의 작용도 달라집니다.', undefined, ['강화'], ['Proximal Policy Optimization', 'https://arxiv.org/abs/1707.06347']);
section('math', '선형대수');
topic('vectors', '벡터 · 내적 · 투영', '벡터는 크기와 방향을 표현합니다. 내적은 한 방향으로 얼마나 정렬되어 있는지 측정하고 투영·유사도의 기반이 됩니다.', 'a·b=Σᵢaᵢbᵢ; cosθ=(a·b)/(‖a‖‖b‖)', 'a,b∈ℝᴰ → 내적은 scalar', 'a=[1,2],b=[2,1]이면 내적 4, 두 노름은 √5, cosine은 0.8입니다.', 'vectors');
topic('matrices', '행렬과 선형변환', '행렬곱의 안쪽 차원은 같아야 합니다. 행렬은 벡터의 방향·크기를 바꾸며 여러 벡터에 같은 변환을 적용할 수 있습니다.', '[m,k] × [k,n] → [m,n]', '역행렬은 정사각·가역 행렬에서 정의', 'A=[[1,2],[0,1]],x=[1,3]이면 Ax=[7,3]입니다. 같은 변환이 공간의 격자를 기울입니다.', 'shape');
topic('eigen-svd', '고유값 · 고유벡터 · SVD', '고유벡터는 변환 후에도 방향이 유지되는 벡터입니다. SVD는 직사각 행렬도 직교 방향과 스케일로 분해합니다.', 'Av=λv; A=UΣVᵀ', 'A [m,n], rank r → U [m,r], Σ [r,r], Vᵀ [r,n]', 'A=diag(3,1)의 축 벡터는 고유벡터이고 고유값은 3과 1입니다. 첫 축은 3배 늘어납니다.');
section('math', '미분과 최적화');
topic('derivatives', '미분과 연쇄법칙', '미분은 작은 입력 변화에 대한 출력의 변화율입니다. 합성함수 미분은 중간 변화율을 곱해 계산합니다.', 'd f(g(x))/dx=f′(g(x))g′(x)', 'scalar → scalar의 국소 기울기', 'f(x)=(2x+1)²이면 f′(x)=4(2x+1). x=1에서 값 9, 미분은 12입니다.', 'gradient');
topic('gradients', '편미분 · Gradient · 경사하강법', 'Gradient는 각 입력 축의 편미분을 모은 벡터입니다. 음의 Gradient로 작은 이동을 하면 국소적으로 함수값을 줄일 수 있습니다.', 'θnext=θ−η∇ℒ(θ)', 'θ [D], gradient [D], Jacobian [out,in]', 'ℒ=x²/2에서 x=2,η=0.1이면 gradient=2,다음 x=1.8,손실은 2에서 1.62로 줄어듭니다.', 'gradient');
section('math', '확률과 통계');
topic('probability', '확률변수와 확률분포', '이산 확률의 합은 1이고 연속 확률은 밀도의 적분으로 구합니다. 기댓값은 결과를 확률로 가중한 평균입니다.', 'E[X]=Σx xp(x); Var(X)=E[(X−E[X])²]', 'Categorical: C개 확률; Gaussian: μ,σ²', 'Bernoulli(p=0.3)의 평균은 0.3,분산은 0.3×0.7=0.21입니다.', 'probability');
topic('statistics', '통계와 추정', '표본으로 모집단의 특성을 추정합니다. 분산·공분산과 신뢰구간에는 표본 수와 가정이 중요합니다.', 'x̄=Σxᵢ/n; s²=Σ(xᵢ−x̄)²/(n−1)', 'n개 표본 → 통계량과 추정의 불확실성', '표본 [1,2,3]의 평균은 2,표본분산은 1입니다. 동일 자료의 모집단 방식 분산은 2/3입니다.', 'probability');
topic('bayes', '조건부확률 · 베이즈 · MLE·MAP', '사후확률은 사전확률과 자료의 가능도를 결합합니다. MLE는 가능도, MAP은 사전분포까지 포함해 파라미터를 추정합니다.', 'p(H|E)=p(E|H)p(H)/p(E)', '가설별 prior·likelihood → posterior', '질병률 1%,민감도 90%,위양성률 5%이면 양성 후 질병 확률은 0.009/(0.009+0.0495)≈15.4%입니다.');
topic('information-theory', '엔트로피 · 교차엔트로피 · KL', '엔트로피는 분포의 불확실성입니다. 교차엔트로피는 다른 분포로 부호화하는 비용이며 KL은 두 비용의 차이입니다.', 'H(p)=−Σp logp; CE(p,q)=H(p)+KL(p∥q)', 'p,q: 같은 C개 결과의 확률', 'p=[0.5,0.5]의 엔트로피는 ln2≈0.693 nats입니다. q=p이면 KL=0입니다.', 'probability');
section('pytorch', '텐서부터 시작');
topic('torch-tensors', 'Tensor 기초', 'Tensor의 shape·dtype·device는 계산 가능한 형태를 결정합니다. 정수 ID,실수 feature,같은 device의 파라미터를 구분합니다.', 'numel = ∏ᵢ shapeᵢ', 'tensor [2,3] → 6개 원소', 'torch.tensor([[1.,2.,3.],[4.,5.,6.]])는 shape [2,3]입니다. .to(device)는 장치 이동, .to(dtype)는 타입 변환입니다.', 'shape');
topic('torch-operations', 'Tensor 연산과 축', 'matmul과 원소별 곱을 구분합니다. view는 stride 호환 조건이 있고 reshape는 필요하면 복사할 수 있습니다.', 'matmul [B,m,k] × [B,k,n] → [B,m,n]', 'permute는 축 순서,reshape는 원소 해석 변경', '[2,3,4]를 permute(0,2,1)하면 [2,4,3]입니다. 이 텐서에 view를 적용하기 전 메모리 배치를 확인해야 합니다.', 'shape');
section('pytorch', '모델과 자동미분');
topic('torch-module', 'nn.Module과 모델 작성', '__init__에 하위 레이어를 등록하고 forward에 계산을 작성합니다. ModuleList는 등록된 목록이며 Sequential은 정해진 순서로 실행합니다.', 'model(x) → forward(x)', '입력 → 등록된 레이어 → 출력', 'Linear(4,8)→ReLU→Linear(8,2)는 [B,4]→[B,8]→[B,2]입니다. forward를 직접 부르기보다 model(x)를 사용합니다.', 'shape');
topic('torch-functional', 'nn과 functional', 'nn.Module은 파라미터·버퍼·학습 모드 등을 관리합니다. functional 함수에는 필요한 상태·파라미터를 직접 전달합니다.', 'nn.Linear(x) ↔ F.linear(x,weight,bias)', 'weight [out,in],bias [out]', 'nn.Dropout은 model.eval()의 모드를 따릅니다. F.dropout은 training 인수를 올바르게 전달해야 합니다.');
topic('torch-autograd', 'Autograd와 Gradient 누적', 'requires_grad가 있는 연산으로 계산 그래프를 만듭니다. backward는 gradient를 누적하고 detach는 해당 결과의 그래프 연결을 끊습니다.', 'x=2; y=x² → dy/dx=4', 'leaf Tensor → 그래프 → leaf.grad', '같은 x에서 새 forward로 y=x²을 각각 계산해 backward를 두 번 하면 grad는 4+4=8입니다. 동일 그래프를 재사용하려면 retain_graph가 필요하며 zero_grad로 누적을 초기화합니다.', 'gradient');
section('pytorch', '학습과 실전 사용');
topic('torch-data', 'Dataset과 DataLoader', 'Dataset은 표본 조회를, DataLoader는 배치 구성·섞기·반복을 담당합니다. Transform은 입력을 모델에 맞게 바꿉니다.', '배치 수 = ceil(N/B), drop_last=False', '표본 [C,H,W] → 배치 [B,C,H,W]', 'N=10,B=4이면 배치 크기는 4,4,2입니다. drop_last=True이면 마지막 2개가 제외됩니다.');
topic('torch-losses', '손실 함수와 정답 형식', 'MSE는 연속 값, CrossEntropyLoss는 클래스 logits, BCEWithLogitsLoss는 이진·독립 레이블 logits에 대응합니다.', 'CE(logits,y)=−log softmax(logits)y', 'CE: logits [B,C],class index target [B] long', 'B=2,C=3이면 logits [2,3],정답 ID [2]입니다. CrossEntropyLoss 전에 Softmax를 추가할 필요가 없습니다.', 'activation');
topic('torch-loop', '학습 루프와 옵티마이저', 'gradient 초기화,예측,손실,역전파,필요한 clipping,파라미터 갱신을 한 단계로 묶습니다. Scheduler의 호출 규칙은 종류에 따라 다릅니다.', 'zero_grad → forward → loss → backward → step', 'batch → scalar loss → parameter gradients', 'w=1,gradient=2,SGD lr=0.1이면 wnext=0.8입니다. optimizer.step()은 backward()와 다른 역할입니다.', 'gradient');
topic('torch-modes', '학습 · 평가 · 추론 모드', 'eval은 Dropout·BatchNorm 등의 동작을 바꾸며 자동미분을 끄지는 않습니다. no_grad·inference_mode는 gradient 기록을 제어합니다.', 'model.eval() + torch.inference_mode()', '모델 동작 모드와 gradient 기록은 별도', 'Dropout p=0.5에서 학습 출력 0 또는 2x,평가 출력 x입니다. eval()만 사용하면 graph가 기록될 수 있습니다.');
topic('torch-checkpoints', '저장 · 복원 · 재현성 · 디버깅', 'state_dict에는 등록된 파라미터와 지속 버퍼가 들어갑니다. 학습 재개에는 옵티마이저·스케줄·단계 등도 필요할 수 있습니다.', 'checkpoint={model,optimizer,step,…}', '파라미터 이름 → Tensor', '가중치만 복원하면 Adam의 이동평균 상태는 복원되지 않습니다. shape·dtype·device와 seed를 함께 점검합니다.');
section('design', '모델을 설계하기');
topic('learning-paradigms', '학습 방식 지도', '지도·비지도·자기지도·준지도·강화학습은 학습 신호의 출처를 구분합니다. 모델 구조 하나가 여러 방식으로 사용될 수 있습니다.', '자료 → 학습 신호 → 목적함수 → 파라미터', '정답 / 자료 자체 / 보상', 'Transformer는 다음 토큰 예측,정답 기반 분류,강화학습 정책에 모두 사용될 수 있습니다.');
topic('tensor-axes', '텐서와 축의 의미', 'Batch·Channel·공간·시간·Feature 축을 구분합니다. 숫자상 shape가 같아도 축의 의미가 다르면 잘못된 계산일 수 있습니다.', '이미지 [B,C,H,W]; 시퀀스 [B,T,D]', '각 축의 크기와 의미를 함께 추적', '[2,3,4]가 배치·토큰·feature인지 배치·feature·토큰인지에 따라 Softmax와 정규화 축이 달라집니다.', 'shape');
topic('shape-design', '레이어 차원과 모델 설계 계산기', '레이어를 연결하며 공간 크기와 feature 수를 추적합니다. Concat·Residual 조건,Conv·Pool 출력,Flatten 이후 Linear 입력을 확인합니다.', 'Conv → Pool → Flatten → Linear', '[B,3,32,32] → [B,16,32,32] → [B,16,16,16] → [B,4096]', 'Linear(4096,128)의 Bias 포함 파라미터는 524,416개입니다. 공간 크기를 바꾸면 Flatten 이후 입력도 달라집니다.', 'shape', [], ['PyTorch — Reasoning about shapes', 'https://docs.pytorch.org/tutorials/recipes/recipes/reasoning_about_shapes.html']);
topic('model-cost', '파라미터와 메모리 비용', '파라미터·활성값·gradient·옵티마이저 상태를 나누어 비용을 추정합니다. 학습 메모리는 가중치만의 크기보다 큽니다.', 'tensor bytes = numel × bytes_per_element', 'Linear params=in×out+out', 'FP32 파라미터 100만 개는 약 3.81 MiB입니다. 같은 크기의 gradient와 Adam 상태 2개를 더하면 이 항목들만 약 15.26 MiB입니다.', 'shape');
topic('curse-dimensionality', '차원의 저주', '차원이 늘면 같은 표본 수가 공간을 덜 채우며 거리 기반 판단이 약해질 수 있습니다. 데이터의 실제 내재 차원도 중요합니다.', '축당 10개 격자 → D차원 격자는 10ᴰ개', 'feature 차원 D vs 표본 수 N', '축당 10칸이면 2차원 100칸,6차원 100만 칸입니다. 레이어 shape 오류와는 별도의 통계적 문제입니다.');
section('design', '학습을 안정화하기');
topic('initialization', '가중치 초기화', '입출력 연결 수에 맞춰 초기 분산을 조절해 깊은 층의 신호 크기를 관리합니다. 활성화와 fan-in·fan-out에 맞는 방식을 선택합니다.', 'He: Var(W)=2/fan_in; Xavier: Var(W)=2/(fan_in+fan_out)', 'fan_in·fan_out: 해당 행렬의 연결 수', 'fan_in=100인 He 정규 초기화 표준편차는 √0.02≈0.141입니다. 초기화가 학습 발산을 모두 방지하지는 않습니다.');
topic('training-stability', '기울기 폭발 · 소실 · Clipping', '역전파에서 Jacobian이 반복 곱해져 기울기가 커지거나 작아질 수 있습니다. 큰 학습률은 별도로 파라미터 발산을 유발할 수 있습니다.', 'gclip = g · min(1,c/‖g‖)', '층별 gradient와 업데이트의 크기', 'g=[3,4],clip norm=2이면 [1.2,1.6]입니다. norm은 5에서 2로 줄어듭니다. 초기화·정규화·Residual·학습률도 함께 점검합니다.', 'gradient');
topic('optimizers', 'SGD · Momentum · RMSProp · AdamW', '학습률과 이동평균으로 업데이트 방향·크기를 조절합니다. AdamW는 적응적 gradient 업데이트와 weight decay를 분리합니다.', 'SGD: θnext=θ−ηg; Momentum: vnext=βv+g', '파라미터와 같은 shape의 gradient·상태', 'θ=2,g=4,η=0.1인 SGD는 θnext=1.6입니다. 옵티마이저를 바꾸면 같은 학습률도 같은 효과를 내지 않습니다.', 'gradient');
topic('learning-rate', '학습률 · Warmup · Scheduler', '학습률은 업데이트 크기를 결정합니다. Warmup은 시작 구간에서 키우고 Decay는 후반의 크기를 줄이는 전략입니다.', 'θnext=θ−ηₜ∇ℒ', 'step t → learning rate ηₜ', 'ℒ=x²/2에서 η=0.5는 수렴하고 η=2.1은 |x|가 증가합니다. 이 경계는 이 1차원 이차함수에만 해당합니다.', 'gradient');
topic('numerical-stability', '입력 스케일 · 수치 안정성 · AMP', '입력 스케일은 최적화 조건에 영향을 줍니다. 큰 exp의 overflow,작은 값의 underflow,낮은 정밀도의 범위를 관리합니다.', 'logsumexp(z)=m+logΣexp(z−m)', 'dtype의 표현 범위·정밀도', 'exp(1000)을 직접 계산하면 overflow합니다. logits [1000,1001]에서 최댓값을 빼면 확률 [0.269,0.731]을 안정적으로 구합니다.', 'activation');
section('design', '일반화와 검증');
topic('generalization', '과적합 · 편향과 분산 · 규제', '훈련 오차와 새로운 자료의 오차를 구분합니다. 복잡도·자료 양·L1/L2·Dropout·Early stopping을 검증 자료로 선택합니다.', '검증 오차와 훈련 오차의 gap', '모델 복잡도 ↔ 데이터 수 ↔ 규제 강도', '훈련 MSE=0.01,검증 MSE=1이면 훈련 적합만으로 모델을 선택하면 안 됩니다. 검증셋에 반복적으로 맞추는 것도 편향을 만듭니다.', 'regression');
topic('validation-leakage', '데이터 분할 · 교차검증 · 누수', '검증·테스트 정보가 학습과 전처리에 들어가면 평가가 낙관적으로 변합니다. 시간·사용자 등 데이터 생성 단위에 맞게 분할합니다.', '전처리 fit: train만; transform: train/validation/test', 'fold별 훈련 자료와 평가 자료 분리', '정규화 평균을 전체 데이터에서 계산하면 검증 정보가 섞입니다. 각 fold의 훈련 자료에서 평균을 다시 구합니다.');
topic('metrics-imbalance', '평가 지표 · 임계값 · 불균형', 'Accuracy,Precision,Recall,F1과 ROC·PR은 다른 질문에 답합니다. 클래스 비율·오탐 비용에 따라 임계값을 선택합니다.', 'Precision=TP/(TP+FP); Recall=TP/(TP+FN)', 'confusion matrix [C,C]', 'TP=8,FP=2,FN=4이면 Precision=0.8,Recall=0.667,F1≈0.727입니다. 양성 1%인 자료는 모두 음성으로 예측해도 Accuracy 99%입니다.');
topic('calibration-debugging', '확률 보정 · 불확실성 · 진단', '높은 확률이 실제 높은 정답률에 대응하는지 확인합니다. 학습 곡선과 활성값·gradient 분포로 계산·최적화 오류를 찾습니다.', '보정: p≈해당 확률 구간의 실제 정답 비율', '확률 bin → 관측 빈도·신뢰도', '0.9 확률을 낸 100건 중 60건만 맞았다면 이 구간은 과신합니다. 1회 예측의 확률만으로 모든 불확실성을 표현할 수는 없습니다.');
topic('transfer-learning', '전이학습과 Fine-tuning 설계', '사전학습한 표현을 재사용하고 일부 층을 고정하거나 전체를 조절합니다. 목표 데이터와 기반 모델의 차이에 맞게 선택합니다.', 'trainable params = Σ requires_grad=True인 numel', 'backbone → task head', 'backbone 100만 개를 고정하고 head 1만 개를 학습하면 업데이트 대상은 1만 개입니다. 고정과 eval 모드는 서로 다른 설정입니다.');
section('cs', '자료구조와 탐색의 기초');
topic('cs-complexity', '시간·공간 복잡도', '입력 크기에 따른 연산 수와 메모리 증가를 비교합니다. Big-O는 실제 실행 시간을 초 단위로 예측하는 공식이 아닙니다.', 'O(1), O(log n), O(n), O(n log n), O(n²)', '입력 n개 → 연산 수·추가 저장 원소 수', 'n=128이면 n²=16384, n log₂n=896입니다. 코딩테스트 제한과 attention의 T² 비용을 함께 읽습니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-structures', '배열 · 연결리스트 · 스택 · 큐 · 해시', '접근·삽입·검색 패턴에 맞게 자료구조를 고릅니다. 스택은 DFS, 큐는 BFS, 해시는 중복 제거와 캐시의 기반입니다.', 'array[i]: O(1); hash lookup: 기대 O(1)', 'n개 데이터와 삽입·삭제·조회 연산', '배열 [4,7,9]에서 인덱스 1은 7입니다. 충돌이 심한 해시와 배열 중간 삽입은 최악 O(n)일 수 있습니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-sorting', '정렬과 분할정복', '삽입정렬과 병합정렬의 실제 비교 횟수를 계산합니다. 안정 정렬은 같은 키의 상대 순서를 유지합니다.', 'T(n)=2T(n/2)+Θ(n) → Θ(n log n)', '배열 [n] → 정렬 배열 [n]', '배열 [4,1,3,2]를 병합하면 [1,4]와 [2,3]을 결합해 [1,2,3,4]가 됩니다.', undefined, ['코딩테스트']);
topic('cs-binary-search', '이진 탐색과 결정 문제', '정렬된 배열에서 후보 구간을 절반씩 줄입니다. 답의 가능 여부가 단조이면 파라메트릭 탐색으로 확장할 수 있습니다.', 'mid=⌊(lo+hi)/2⌋; 후보 크기 ≈ n/2ᵏ', '정렬 배열 [n] → lower_bound 인덱스', '배열 [1,3,5,7]에서 4의 lower_bound는 인덱스 2입니다. 찾는 값이 없어도 삽입 위치를 반환합니다.', undefined, ['코딩테스트']);
topic('cs-prefix-window', '누적합 · 투 포인터 · 슬라이딩 윈도', '구간 합을 재사용하고 양쪽 경계를 이동해 중복 계산을 줄입니다. 합 조건의 투 포인터는 값의 부호와 단조성을 확인해야 합니다.', 'P₀=0; Pᵢ₊₁=Pᵢ+aᵢ; sum[l:r]=Pᵣ−Pₗ', '길이 n → 누적합 [n+1]', '배열 [1,2,3,4]의 [1:3] 합은 P₃−P₁=6−1=5입니다. 슬라이싱은 오른쪽 끝을 제외합니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-backtracking', '재귀와 백트래킹', '선택·진입·복원을 반복하고 조건을 위반한 가지는 탐색 전에 자릅니다. 모든 경우를 생성하는 문제와 동적계획법을 구별합니다.', '부분집합 수=2ⁿ; 가지치기: 현재 합 > 목표', '결정 트리 깊이 n → 가능한 부분집합', '양수 [1,2,3]에서 합 3인 부분집합은 {3}, {1,2} 두 개입니다. 음수에는 합 초과 가지치기를 그대로 쓸 수 없습니다.', undefined, ['코딩테스트']);
section('cs', '그래프와 최적화 알고리즘');
topic('cs-graph', 'BFS · DFS · 그래프 표현', '큐로 가까운 노드부터 방문하거나 스택으로 한 경로를 깊게 탐색합니다. 인접 리스트는 희소 그래프와 GNN 이웃 집계로 연결됩니다.', 'BFS·DFS: O(V+E); 무가중치 최단 거리=최소 hop 수', '인접 리스트 → 방문 순서·거리 [V]', '간선 0–1,0–2,1–3,2–3의 BFS 거리는 시작점 0에서 [0,1,1,2]입니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-shortest-path', 'Dijkstra · Bellman–Ford · Floyd–Warshall', '가중치 그래프의 경로 비용을 relaxation으로 줄입니다. 음수 간선·음수 사이클 조건에 맞게 알고리즘을 선택합니다.', 'd[v]←min(d[v],d[u]+w(u,v))', '가중 인접 리스트 → 거리 [V] 또는 [V,V]', '0→1 비용 2,1→2 비용 3,0→2 비용 8이면 최단 비용은 2+3=5입니다. Dijkstra는 음수 간선에 적용하지 않습니다.', undefined, ['코딩테스트']);
topic('cs-greedy', '그리디와 교환 논증', '현재 최선의 선택이 전체 최적해를 보존하는지 증명합니다. 종료 시각 순 활동 선택과 임의 동전 체계의 실패를 비교합니다.', '활동 선택: 다음 시작 ≥ 직전 종료', '구간 [n,2] → 충돌하지 않는 부분집합', '활동 [0,2],[1,3],[2,4]에서 먼저 끝나는 [0,2]를 고르면 [2,4]도 선택해 2개입니다.', undefined, ['코딩테스트']);
topic('cs-dp', '동적계획법 · 메모이제이션', '중복 부분 문제의 결과를 저장하고 상태·전이·초깃값을 명시합니다. 배낭 문제와 시퀀스 정렬, Bellman 계산에 연결됩니다.', 'F₀=0,F₁=1; Fₙ=Fₙ₋₁+Fₙ₋₂', '상태 n개 → 테이블 또는 두 이전 값', 'F₅=5입니다. 단순 재귀는 같은 F₃을 여러 번 계산하지만 DP는 각 상태를 한 번 계산합니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-union-find', 'Union–Find와 최소 신장 트리', '서로소 집합의 대표를 찾아 연결 성분을 합칩니다. Kruskal은 비용순으로 간선을 고르며 사이클을 만드는 간선을 건너뜁니다.', 'find(u)≠find(v)일 때 union(u,v)', 'V개 노드 → 부모·크기 배열 [V]', '가중 간선 (0,1,1),(1,2,2),(0,2,4)에서 MST는 앞의 두 간선, 총 비용 3입니다.', undefined, ['코딩테스트']);
section('cs', '문자열·검색과 딥러닝 개발');
topic('cs-heap-topk', '힙 · 우선순위 큐 · Top-k', '최솟값을 루트에 유지하는 크기 k 힙으로 큰 점수 k개를 남깁니다. 토큰 후보와 검색 랭킹의 후보 선택에 연결됩니다.', 'Top-k: O(n log k), 추가 공간 O(k)', '점수 [n] → 큰 점수 [k]', '점수 [4,1,8,3,6]에서 k=2이면 [8,6]입니다. min-heap의 루트는 현재 후보 중 가장 작은 값입니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-strings', '문자열 매칭 · KMP · Trie', 'KMP는 접두·접미 일치를 재사용해 비교를 건너뜁니다. Trie는 접두어 조회와 사전 탐색에 적합하며 토크나이저의 문자열 처리와 관련됩니다.', 'KMP: O(n+m); Trie 조회: O(문자열 길이)', '텍스트 [n], 패턴 [m] → 시작 위치 목록', 'ababa에서 aba는 인덱스 0과 2에서 일치합니다. 겹치는 일치도 prefix table로 이어 탐색합니다.', undefined, ['코딩테스트', '딥러닝 개발']);
topic('cs-compute-graph', '위상 정렬과 자동미분 계산 그래프', 'DAG의 의존성을 만족하는 순서로 계산하고 역순으로 gradient를 전달합니다. 여러 경로가 합쳐지는 노드의 미분은 더해집니다.', 'forward: 위상 순서; backward: 역위상 순서', 'DAG 노드·간선 → 연산 순서·gradient', 'u=x²,v=3x,L=u+v이면 x=2에서 L=10, dL/dx=2x+3=7입니다.', undefined, ['딥러닝 개발'], ['PyTorch — Autograd mechanics', 'https://docs.pytorch.org/docs/stable/notes/autograd.html']);
topic('cs-matrix-compute', '행렬곱 · 타일링 · 메모리 접근', '같은 행렬곱도 데이터 재사용과 메모리 이동에 따라 속도가 달라집니다. FLOPs와 실제 지연을 구분하고 텐서 축을 추적합니다.', 'Cᵢⱼ=ΣₖAᵢₖBₖⱼ; FLOPs≈2mnk', 'A [m,k], B [k,n] → C [m,n]', 'm=n=k=16이면 곱 4096회, 덧셈 3840회입니다. 2mnk는 multiply-add를 2회로 세는 근사입니다.', undefined, ['딥러닝 개발'], ['NVIDIA — Matrix Multiplication Background', 'https://docs.nvidia.com/deeplearning/performance/dl-performance-matrix-multiplication/index.html']);
// Display adjacency is not a prerequisite. Dependencies follow the actual mathematics and workflow.
const crossPrerequisites: Record<string, string[]> = {
  'llm-basics': ['linear-embedding', 'transformer'], 'transformer': ['matrices', 'softmax'],
  'neural-network': ['matrices', 'derivatives'], 'linear-regression': ['vectors'],
  'torch-tensors': ['tensor-axes'], 'shape-design': ['tensor-axes', 'cnn'],
  'rag': ['retrieval'], 'graphrag': ['rag', 'ontology'], 'llm-wiki': ['rag', 'ontology'],
  'llm-finetuning': ['llm-training', 'transfer-learning'], 'dqn': ['qlearning', 'neural-network'],
};
crossPrerequisites.derivatives = [];
crossPrerequisites.gradients = ['derivatives', 'vectors'];
crossPrerequisites.probability = [];
crossPrerequisites.statistics = ['probability'];
crossPrerequisites.bayes = ['probability'];
crossPrerequisites['information-theory'] = ['probability'];
for (const t of topics) if (crossPrerequisites[t.id]) t.prerequisites = crossPrerequisites[t.id];
const prerequisites:Record<string,string[]>={
 'llm-generation':['llm-basics','softmax'],prompting:['llm-basics'],cot:['prompting'],
 'llm-training':['llm-basics','information-theory','neural-network'],'preference-learning':['llm-finetuning','logistic-regression'],distillation:['information-theory','softmax'],
 retrieval:['vectors'],ontology:[], 'knowledge-strategies':['prompting','rag','llm-finetuning'],
 'tools-agents':['prompting'],mcp:['tools-agents'],harness:['tools-agents'], 'llm-evaluation':['metrics-imbalance','rag'],
 activation:['derivatives'],softmax:['probability','derivatives'], 'cross-entropy':['softmax','information-theory','derivatives'], 'linear-embedding':['matrices'], 'tensor-connections':['tensor-axes'],
 cnn:['matrices','tensor-axes'],'pooling-upsampling':['tensor-axes'],normalization:['statistics','tensor-axes'],dropout:['probability'],
 'rnn-lstm-gru':['neural-network','activation'],gnn:['neural-network','cs-graph'],autoencoder:['neural-network'],vae:['autoencoder','probability'],gan:['neural-network','probability'],
 'gan-stability':['gan'],diffusion:['probability','neural-network'],'contrastive-learning':['softmax','vectors'],'masked-learning':['llm-training'],
 'ridge-lasso':['linear-regression','gradients'],'logistic-regression':['activation','probability'],'naive-bayes':['bayes'],knn:['vectors'],svm:['vectors'],
 'decision-tree':['probability'],ensembles:['decision-tree'],kmeans:['vectors'],'gmm-em':['probability','kmeans'],'hierarchical-dbscan':['vectors'],
 'dimensionality-reduction':['eigen-svd','statistics'],'density-anomaly':['probability'],recommendation:['matrices'],'semi-supervised':['learning-paradigms','softmax'],
 'rl-basics':['probability'],bandits:['probability'],bellman:['rl-basics'],'qlearning':['bellman'], 'policy-gradient':['rl-basics','gradients'],'actor-critic-ppo':['policy-gradient','bellman'],
 vectors:[],matrices:['vectors'],'eigen-svd':['matrices'],
 'torch-operations':['torch-tensors','matrices'],'torch-module':['torch-tensors','neural-network'],'torch-functional':['torch-module'],
 'torch-autograd':['derivatives','torch-tensors'],'torch-data':['torch-tensors'],'torch-losses':['cross-entropy'],
 'torch-loop':['torch-autograd','torch-losses','torch-module'],'torch-modes':['dropout','normalization'],'torch-checkpoints':['torch-loop'],
 'learning-paradigms':[],'tensor-axes':[], 'model-cost':['shape-design'],'curse-dimensionality':['vectors'],initialization:['neural-network','statistics'],
 'training-stability':['neural-network','gradients'],optimizers:['gradients'],'learning-rate':['optimizers'],'numerical-stability':['softmax'],
 generalization:['linear-regression'],'validation-leakage':['statistics'], 'metrics-imbalance':['probability'],'calibration-debugging':['metrics-imbalance'],
 'transfer-learning':['neural-network','torch-modes'],
 'cs-complexity':[], 'cs-structures':['cs-complexity'],'cs-sorting':['cs-structures'],'cs-binary-search':['cs-sorting'],
 'cs-prefix-window':['cs-structures'],'cs-backtracking':['cs-structures'],'cs-graph':['cs-structures'],
 'cs-shortest-path':['cs-graph'],'cs-greedy':['cs-sorting'],'cs-dp':['cs-backtracking'],'cs-union-find':['cs-graph','cs-sorting'],
 'cs-heap-topk':['cs-structures'],'cs-strings':['cs-structures'],'cs-compute-graph':['cs-graph','derivatives'],'cs-matrix-compute':['matrices','cs-complexity'],
};
for (const t of topics) if (prerequisites[t.id]) t.prerequisites=prerequisites[t.id];
const additionalReferences:Record<string, {title:string;url:string}[]> = {
  normalization: [
    {title:'PyTorch — BatchNorm1d',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html'},
    {title:'PyTorch — LayerNorm',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html'},
  ],
  'torch-checkpoints': [{title:'PyTorch — Serialization semantics',url:'https://docs.pytorch.org/docs/stable/notes/serialization.html'}],
  activation:[{title:'PyTorch — activation definitions',url:'https://docs.pytorch.org/docs/stable/nn.html#non-linear-activations-weighted-sum-nonlinearity'},{title:'PyTorch — GELU',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.GELU.html'},{title:'PyTorch — SiLU',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.SiLU.html'}],
  'neural-network':[{title:'PyTorch — Optimizing Model Parameters',url:'https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html'}],
  'cs-strings':[{title:'Knuth, Morris & Pratt — Fast Pattern Matching in Strings',url:'https://epubs.siam.org/doi/10.1137/0206024'}],
};
for (const topic of topics) topic.references.push(...(additionalReferences[topic.id] ?? []));

// Authored expansions for every registered topic. Workflow notes expand operations rather than inventing a mathematical law.
const expansions:Record<string,[string,string]> = {
 'llm-basics':['p(x₁,x₂,x₃)=p(x₁)p(x₂|x₁)p(x₃|x₁,x₂)\nlog p(x₁:T)=Σₜ log p(xₜ|x<ₜ)','연쇄확률을 토큰별 조건부확률의 곱으로 전개합니다. 학습에서는 곱 대신 음의 로그 합을 손실로 사용합니다.'],
 'llm-generation':['sᵢ=zᵢ/τ; aᵢ=exp(sᵢ−maxⱼsⱼ)\npᵢ=aᵢ/(a₁+⋯+aᵥ)\npᵢ′=pᵢ1[i∈후보]/Σⱼpⱼ1[j∈후보]','온도로 점수를 조절하고 안정적으로 확률을 구한 뒤 Top-k·Top-p 후보에서 다시 정규화합니다.'],
 prompting:['자료 예산=문맥 한도−지시−예시−질문−출력 예산\n4096−800−100−500=2696','문맥 한도는 모델·토크나이저의 토큰 기준입니다. 이 예제에서는 출력 예약분까지 포함해 자료의 남은 공간을 계산합니다.'],
 cot:['c(a)=Σᵢ1[후보 i의 답=a]\n답 후보=argmaxₐ c(a); [12,12,15] → c(12)=2','표시한 것은 답 후보의 집계 규칙입니다. 다수결은 독립적인 정답 검증을 대신하지 않으며 CoT의 성능 법칙도 아닙니다.'],
 'llm-training':['ℒ=−(m₁log p₁+⋯+mₜlog pₜ)\n평균 응답 손실=ℒ/Σₜmₜ (Σm>0)\nθₜ₊₁=θₜ−η∇θℒ','마스크가 0인 위치를 제외한 토큰 손실로 역전파하고 업데이트합니다. 합과 평균 중 무엇을 쓰는지에 따라 손실 크기가 달라집니다.'],
 'llm-finetuning':['ΔWᵢⱼ=Σₖ₌₁ʳBᵢₖAₖⱼ\nW′ᵢⱼ=Wᵢⱼ+ΔWᵢⱼ\nLoRA 파라미터=r(out+in)','낮은 rank 행렬 두 개를 곱해 전체 행렬의 보정을 만듭니다. 여기서는 α/r 스케일과 bias를 제외하며 QLoRA의 양자화 저장 비용은 별도입니다.'],
 'preference-learning':['Δ=logπ(y⁺|x)−logπref(y⁺|x)−logπ(y⁻|x)+logπref(y⁻|x)\nℒDPO=log(1+exp(−βΔ))','조건부 응답 확률의 로그 비율 차를 계산합니다. 응답 확률은 토큰 확률의 곱이며 DPO와 보상 모델을 쓰는 RLHF는 다른 목적함수입니다.'],
 distillation:['KL(p∥q)=Σᵢpᵢ(log pᵢ−log qᵢ)\nℒ=α(−log qᵧ)+(1−α)τ²Σᵢpᵢlog(pᵢ/qᵢ)','Teacher의 후보별 확률을 Student의 확률과 비교해 더합니다. p는 teacher, q는 student이며 동일한 후보 공간이 필요합니다.'],
 retrieval:['q·d=q₁d₁+⋯+qᴅdᴅ\ncos(q,d)=(Σqᵢdᵢ)/(√Σqᵢ²√Σdᵢ²)\nRRF(d)=Σ검색기 1/(c+rank(d))','내적을 벡터 길이로 나누고, Hybrid의 한 방식인 RRF는 서로 다른 검색 순위를 합칩니다. 0벡터의 cosine은 정의되지 않습니다.'],
 rag:['후보=top-k(score(query,chunkᵢ))\nΣ선택 청크의 토큰 수≤자료 예산\n입력=[지시,선택 근거,질문] → 생성 → 근거 검증','검색 순위와 실제 문맥에 들어간 청크를 구별합니다. 점수가 높은 청크라도 답을 뒷받침하는지는 별도로 확인합니다.'],
 ontology:['Company(x) ⇒ Organization(x)\nworksFor(x,y) ⇒ Person(x) ∧ Organization(y)','클래스 포함 관계와 domain·range의 추론을 명시합니다. OWL의 타입 추론은 입력 검증 규칙과 다르며 제약 위반을 자동으로 거부하지 않습니다.'],
 graphrag:['문서 → (개체,관계,출처) → 그래프\n로컬 질의: 이웃 부분 그래프\n전역 질의: 커뮤니티 요약 집계','질문 유형에 따른 경로를 펼쳐 씁니다. 커뮤니티 요약은 원문에서 파생한 자료이므로 출처와 갱신 관계를 유지해야 합니다.'],
 'llm-wiki':['원본 s → 파생 페이지 p → 개념 링크\n원본 변경 → 관련 페이지·출처·갱신 기록 재검토','지속되는 지식 페이지의 생성·검토·갱신 절차를 전개합니다. Wiki 패턴의 구조이지 모델 성능을 보장하는 수학 공식은 아닙니다.'],
 'knowledge-strategies':['Prompting: θ 고정, 입력 c 변경\nFine-tuning: θ 변경\nRAG: 근거 r 검색, c=[질문,r]','무엇이 업데이트되는지에 따라 전략을 구분합니다. θ는 모델 파라미터, c는 입력 문맥이며 방법을 조합할 수 있습니다.'],
 'tools-agents':['호출 제안 → 인수 검증 → 실행 → 결과 관찰\nsₜ₊₁=update(sₜ,도구 결과); 종료 조건 검사','상태를 바꾸는 반복 절차를 펼칩니다. 모델의 호출 제안과 시스템의 실행은 다른 단계이며 실패한 결과도 관찰에 남깁니다.'],
 mcp:['Host의 Client → Server 기능 조회\nTool(name,arguments) → 구조화된 결과\n결과 → Host 문맥으로 전달','프로토콜 참여자와 호출 데이터를 명시합니다. Tool·Resource·Prompt는 서로 다른 기능이며 이 흐름은 그중 도구 호출의 예입니다.'],
 harness:['while 미완료 ∧ 시도 수<한도:\n  상태 읽기 → 호출 검사 → 실행 → 로그·상태 갱신','종료 조건이 있는 실행 루프로 전개합니다. 재시도 한도와 권한 검사는 하네스의 정책이지 모델 가중치가 결정하는 규칙이 아닙니다.'],
 'llm-evaluation':['작업 성공률=Σᵢ1[성공ᵢ]/N\n근거 충실률=근거로 확인한 주장/검사한 주장','작업 단위와 주장 단위의 분모를 구별합니다. 17/20=0.85는 도구 성공률이며 인용 존재만으로 주장의 사실성을 판단하지 않습니다.'],
 'neural-network':['z=xw+b; h=φ(z); ℒ=(h−y)²/2\n∂ℒ/∂w=(h−y)φ′(z)x; ∂ℒ/∂b=(h−y)φ′(z)\nwnext=w−η∂ℒ/∂w; bnext=b−η∂ℒ/∂b','순전파 값으로 손실을 계산하고 연쇄법칙으로 두 파라미터의 미분을 구합니다. 갱신한 w,b로 다시 순전파해야 다음 손실을 얻습니다.'],
 activation:['σ′(x)=σ(x)(1−σ(x))\ntanh′(x)=1−tanh²(x)\nSiLU′(x)=σ(x)+xσ(x)(1−σ(x))','활성화의 미분이 역전파의 국소 배율입니다. 아래에서 여섯 함수의 미분 과정과 함수·미분 곡선을 함께 확인합니다.'],
 softmax:['aᵢ=e^(zᵢ/τ); S=Σₖaₖ; pᵢ=aᵢ/S\ni=j: ∂pᵢ/∂zᵢ=(aᵢS−aᵢ²)/(τS²)=pᵢ(1−pᵢ)/τ\ni≠j: ∂pᵢ/∂zⱼ=(0×S−aᵢaⱼ)/(τS²)=−pᵢpⱼ/τ\nJ=(diag(p)−ppᵀ)/τ; ΣᵢJᵢⱼ=0','분모에도 모든 logit이 들어갑니다. 한 점수가 오르면 자기 확률은 커지고 다른 확률은 작아집니다. 야코비안의 열 합이 0이라 확률 합 1을 보존합니다.'],
 'cross-entropy':['L=−Σᵢyᵢlog pᵢ; ∂L/∂pᵢ=−yᵢ/pᵢ\n∂L/∂zⱼ=Σᵢ(−yᵢ/pᵢ)pᵢ(δᵢⱼ−pⱼ)/τ\n=(−yⱼ+pⱼΣᵢyᵢ)/τ=(pⱼ−yⱼ)/τ\nL̄=(ΣᵦLᵦ)/B ⇒ ∂L̄/∂zᵦⱼ=(pᵦⱼ−yᵦⱼ)/(Bτ)\nZ=XW+b ⇒ ∂L̄/∂W=XᵀG, ∂L̄/∂X=GWᵀ','정답 y가 고정된 확률분포이고 클래스 가중치·ignore가 없는 경우입니다. 확률에 대한 미분과 logit에 대한 미분은 다르며, 연쇄법칙으로 모든 클래스의 경로를 더해야 p−y가 됩니다.'],
 'linear-embedding':['yᵦⱼ=ΣᵢxᵦᵢWⱼᵢ+bⱼ\nE[id]ⱼ=Σᵥ1[v=id]Eᵥⱼ','행렬곱을 원소별 합으로 펼치고 Embedding을 one-hot 행 조회와 연결합니다. 실제 Embedding은 거대한 one-hot 행렬을 만들 필요가 없습니다.'],
 'tensor-connections':['numel=shape₁×⋯×shapeₙ\nConcat(A,B)=[A₁,…,Aₐ,B₁,…,Bᵦ]\nAdd(A,B)ᵢ=Aᵢ+Bᵢ','reshape는 원소 수, concat은 연결 축 이외의 크기, add는 값별 호환 조건을 확인합니다. shape가 같아도 축 의미가 일치해야 합니다.'],
 cnn:['yᵦₒₕw=bₒ+Σ채널Σ커널 xᵦc,hS+iD−P,wS+jD−P·Wₒcij\nparams=Cout(Cin/groups)KhKw+Cout','공간마다 동일 커널을 공유하는 곱의 합입니다. 범위 밖 입력은 padding 값이며 이 식은 신경망에서 흔한 cross-correlation 관례입니다.'],
 'pooling-upsampling':['Avg(a,b,c,d)=(a+b+c+d)/4\nMax(a,b,c,d)=max(a,b,c,d)\n선형 보간 y(t)=(1−t)a+tb, 0≤t≤1','창의 집계와 두 끝점의 보간을 분리합니다. 보간은 원본 정보를 복원하는 학습이 아니며 실제 좌표 규칙은 레이어 설정에 의존합니다.'],
 normalization:['μ=Σᵢxᵢ/D; v=Σᵢ(xᵢ−μ)²/D\nyᵢ=γᵢ(xᵢ−μ)/√(v+ε)+βᵢ\nRMSNorm: yᵢ=γᵢxᵢ/√(Σxⱼ²/D+ε)','통계 축 위의 평균과 분산을 펼칩니다. BN은 학습·평가 통계가 다르고 LN·RMSNorm의 feature 통계와 구분해야 합니다.'],
 dropout:['E[mᵢxᵢ/(1−p)]=(1−p)xᵢ/(1−p)=xᵢ\n∂yᵢ/∂xᵢ=mᵢ/(1−p) (고정 마스크)','inverted dropout은 반복 평균을 보존합니다. 한 번의 출력이 원본과 같다는 뜻은 아니며 평가에서는 제거·확대를 하지 않습니다.'],
 'rnn-lstm-gru':['hₜ=tanh(xₜWₓ+hₜ₋₁Wₕ+b)\nLSTM: cₜ=fₜ⊙cₜ₋₁+iₜ⊙gₜ; hₜ=oₜ⊙tanh(cₜ)\nGRU(갱신 z): hₜ=(1−zₜ)⊙nₜ+zₜ⊙hₜ₋₁','재귀 상태와 LSTM cell의 보존·입력 경로를 전개합니다. GRU 게이트의 z 관례는 구현에 따라 반대로 정의될 수 있어 PyTorch 관례를 표시했습니다.'],
 transformer:['sᵢⱼ=(ΣₖQᵢₖKⱼₖ)/√dₖ+Mᵢⱼ\naᵢⱼ=exp(sᵢⱼ−max sᵢ)/(Σⱼexp(sᵢⱼ−max sᵢ))\nOᵢᵣ=ΣⱼaᵢⱼVⱼᵣ','내적 → 행별 확률 → Value의 가중합으로 펼칩니다. 아래 입력 행렬과 Query를 움직이면 이 세 계산이 함께 바뀝니다.'],
 gnn:['mᵥ=(Σᵤ∈N(v)hᵤ)/|N(v)| (mean 집계)\nhᵥ′=φ(Wself hᵥ+Wneighbor mᵥ)','이웃 그래프 탐색과 feature 계산을 연결합니다. sum과 mean은 이웃 수에 다르게 반응하며 빈 이웃의 처리 규칙도 지정해야 합니다.'],
 autoencoder:['ℒrecon=((x₁−x̂₁)²+⋯+(xᴅ−x̂ᴅ)²)/D\n∇θℒrecon → Encoder·Decoder 파라미터 갱신','복원 오차를 원소별 제곱차의 평균으로 펼칩니다. 아래 고정 평균 병목 실험은 정보 손실 예제이며 Encoder·Decoder 학습을 수행하지 않습니다.'],
 vae:['KL(N(μ,σ²)∥N(0,1))=(μ²+σ²−1−logσ²)/2\nz=μ+σε; ∂z/∂μ=1; ∂z/∂σ=ε','Gaussian의 KL을 평균·분산으로 계산합니다. 표준잡음 ε를 고정하면 샘플링 경로를 μ·σ에 대해 미분할 수 있습니다.'],
 gan:['ℒD=−mean(log D(xreal)+log(1−D(G(z))))\nℒG=−mean(log D(G(z)))\nD 갱신 → G 갱신 → 새 표본으로 반복','원래 minimax와 별개로 흔히 쓰는 non-saturating G 손실을 표시합니다. 상대 모델이 바뀌므로 두 손실의 단조 감소를 보장하지 않습니다.'],
 'gan-stability':['max∥f∥Lip≤1 Ereal[f(x)]−Efake[f(x)]\n선형 f(x)=ax: |a|≤1\n차이=a(Ereal[x]−Efake[x])','WGAN의 제한된 critic을 평균차로 펼칩니다. 선형 critic만 쓰면 평균이 같은 다른 분포를 구별하지 못하고 Wasserstein 최적값도 보장하지 않습니다.'],
 diffusion:['xₜ=√ᾱₜx₀+√(1−ᾱₜ)ε\nℒnoise=Σᵢ(εᵢ−εθ(xₜ,t)ᵢ)²/D','노이즈를 섞는 forward 과정과 예측 오차의 학습을 연결합니다. reverse 생성은 학습된 예측기와 스케줄을 필요로 합니다.'],
 'contrastive-learning':['ℒᵢ=−sᵢ⁺/τ+logΣⱼexp(sᵢⱼ/τ)\n∂ℒᵢ/∂sᵢⱼ=(pᵢⱼ−1[j=positive])/τ','유사도 점수의 분류 손실로 펼칩니다. 양성 후보와 허용한 음성 후보의 구성은 학습 신호이며 의미가 같은 표본을 잘못 밀어낼 수도 있습니다.'],
 'masked-learning':['ℒmasked=−Σₜ∈가린 위치 log p(xₜ|관측 문맥)\nℒAR=−Σₜ log p(xₜ|x<ₜ)','손실을 계산하는 위치와 볼 수 있는 문맥이 다릅니다. 자기회귀는 미래를 가리고 마스킹은 지정 위치를 숨겨 자료에서 정답을 만듭니다.'],
 'linear-regression':['ŷᵢ=b+w₁xᵢ+⋯+wₚxᵢᵖ\nMSE=Σᵢ(yᵢ−ŷᵢ)²/N\n∂MSE/∂wⱼ=(2/N)Σᵢ(ŷᵢ−yᵢ)xᵢʲ','다항 feature에서도 계수에 대해서는 선형입니다. 잔차의 제곱 평균을 미분해 계수를 업데이트하는 흐름으로 연결합니다.'],
 'ridge-lasso':['ℒridge=MSE+λΣⱼwⱼ²; ∂규제/∂wⱼ=2λwⱼ\nℒlasso=MSE+λΣⱼ|wⱼ|; wⱼ≠0에서 미분=λsign(wⱼ)','패널티를 각 계수의 합으로 펼칩니다. L1은 0에서 미분이 없고 부분미분·proximal 연산 등을 사용하며 bias 규제 여부는 설정에 달려 있습니다.'],
 'logistic-regression':['z=w·x+b; p=1/(1+e⁻ᶻ)\nℒ=−ylog p−(1−y)log(1−p)\n∂ℒ/∂w=(p−y)x','점수를 확률과 이진 손실로 연결합니다. sigmoid 미분과 BCE 미분이 결합되어 파라미터 gradient가 간단해집니다.'],
 'naive-bayes':['p(c|x)∝p(c)∏ⱼp(xⱼ|c)\nlog score(c)=log p(c)+Σⱼlog p(xⱼ|c)','클래스가 주어졌을 때 feature의 조건부 독립을 가정합니다. 로그 합은 많은 작은 확률의 곱에서 underflow를 줄입니다.'],
 knn:['d(x,q)=√Σⱼ(xⱼ−qⱼ)²\n분류=argmax꜀Σᵢ∈최근접k 1[yᵢ=c]','거리와 이웃 투표를 펼칩니다. feature 스케일에 민감하며 동점 규칙과 거리 가중 방식에 따라 결과가 달라질 수 있습니다.'],
 svm:['ℒhinge=max(0,1−y(w·x+b)), y∈{−1,1}\n목적=(1/2)‖w‖²+CΣᵢℒhinge, 거리=|w·x+b|/‖w‖','마진을 위반한 표본의 손실과 가중치 크기를 연결합니다. kernel은 내적을 대체하며 모든 유사도 함수가 유효한 kernel은 아닙니다.'],
 'decision-tree':['Gini=1−Σ꜀p꜀²\n분할 불순도=(NL/N)GiniL+(NR/N)GiniR\n감소=Gini부모−분할 불순도','자식의 불순도를 표본 수로 가중합니다. 불순도 감소가 큰 분할을 선택하지만 작은 훈련 오차가 일반화를 보장하지 않습니다.'],
 ensembles:['Bagging 회귀: ŷ=(f₁(x)+⋯+fᴍ(x))/M\nBoosting: Fₜ=Fₜ₋₁+ηfₜ; 제곱손실 목표 잔차=y−Fₜ₋₁','독립 모델을 평균하는 방식과 이전 예측을 보정하는 방식을 구별합니다. Random Forest는 표본·feature 무작위화로 모델 간 상관을 줄입니다.'],
 kmeans:['J=Σᵢ‖xᵢ−μcᵢ‖²\ncᵢ=argminₖ‖xᵢ−μₖ‖²\nμₖ=(Σᵢ:cᵢ=k xᵢ)/Nk','할당과 평균 갱신을 교대로 수행합니다. 빈 군집은 별도 규칙이 필요하고 국소해에 멈출 수 있습니다.'],
 'gmm-em':['rᵢₖ=πₖN(xᵢ;μₖ,Σₖ)/(ΣⱼπⱼN(xᵢ;μⱼ,Σⱼ))\nNk=Σᵢrᵢₖ; μₖ=Σᵢrᵢₖxᵢ/Nk; πₖ=Nk/N','E-step의 soft 할당과 M-step의 가중 평균을 펼칩니다. 이론의 EM 반복과 아래 고정 분포 책임도 계산의 범위를 구별하세요.'],
 'hierarchical-dbscan':['Nε(x)={q:d(x,q)≤ε}\ncore(x) ⇔ |Nε(x)|≥min_samples (자신 포함)\nsingle linkage(A,B)=minₐ∈A,ᵦ∈B d(a,b)','밀도 이웃 조건과 계층 군집의 군집 간 거리를 별개로 전개합니다. DBSCAN은 core에서의 연결과 border·noise를 구분합니다.'],
 'dimensionality-reduction':['Xcenter=X−mean(X); C=XcenterᵀXcenter/N\nz=Xcenter v; X̂=zvᵀ (‖v‖=1)\n총 분산=보존 분산+직교 잔차 분산','PCA의 투영과 복원을 펼칩니다. t-SNE·UMAP은 다른 목적과 이웃 구조를 쓰며 PCA의 분산 분해를 그대로 적용하지 않습니다.'],
 'density-anomaly':['KDE(x)=(1/Nh)ΣᵢK((x−xᵢ)/h)\nGaussian K(u)=exp(−u²/2)/√(2π)','각 표본 주위의 밀도를 더해 평균합니다. 낮은 밀도는 이상 후보의 한 신호이며 대역폭과 정상 데이터 정의에 영향을 받습니다.'],
 recommendation:['r̂ᵤᵢ=pᵤ·qᵢ=Σₖpᵤₖqᵢₖ\nℒ=Σ관측(u,i)(rᵤᵢ−r̂ᵤᵢ)²+λ(‖P‖²+‖Q‖²)','사용자·항목 latent feature의 내적과 관측 평점 손실을 연결합니다. 관측되지 않은 평점을 모두 0인 정답으로 취급하지 않습니다.'],
 'semi-supervised':['ℒ=ℒlabeled+λΣᵢ1[max pᵢ≥τ]CE(argmax pᵢ,pᵢaug)','신뢰도 기준을 통과한 pseudo-label만 추가 손실에 사용합니다. 모델이 낸 높은 확률이 정확한 정답을 보장하지 않아 오류가 반복될 수 있습니다.'],
 'rl-basics':['Gₜ=rₜ₊₁+γrₜ₊₂+γ²rₜ₊₃+⋯\nGₜ=rₜ₊₁+γGₜ₊₁','미래 보상의 할인 합을 한 단계와 남은 return으로 나눕니다. 실제 return과 이를 상태별로 기대한 가치함수를 구분합니다.'],
 bandits:['Q(a)=Σ선택 a의 보상/Na\nUCB(a)=Q(a)+c√(log t/Na), Na>0','경험 평균과 탐색 보너스를 펼칩니다. 선택되지 않은 행동은 먼저 시도하는 별도 규칙을 두며 Bandit에는 MDP의 상태 전이가 없습니다.'],
 bellman:['Vπ(s)=Σₐπ(a|s)Σs′p(s′|s,a)[r(s,a,s′)+γVπ(s′)]','정책의 행동 확률과 환경의 전이 확률로 미래 가치를 평균합니다. 최적 가치에서는 정책 평균 대신 행동별 최대를 취합니다.'],
 qlearning:['δ=r+γmaxₐQ(s′,a)−Q(s,a)\nQnew=Qold+αδ\nterminal: δ=r−Qold','목표와 기존 예측의 차이를 일정 비율 반영합니다. SARSA는 max 대신 실제 다음 행동의 Q를 사용합니다.'],
 dqn:['y=r+γ(1−terminal)maxₐQθtarget(s′,a)\nℒ=(Qθ(s,a)−stopgrad(y))²\n∇θℒ=2(Qθ−y)∇θQθ','TD 목표를 정답으로 삼아 신경망을 업데이트합니다. target network의 목표는 이 업데이트에서 미분하지 않으며 replay에서 배치를 뽑습니다.'],
 'policy-gradient':['∇θJ=E[Σₜ∇θlogπθ(aₜ|sₜ)(Gₜ−b(sₜ))]\nθnext=θ+η∇θJ','return이 baseline보다 높은 행동의 log확률을 높이는 방향으로 갱신합니다. 기대 보상을 최대화하므로 손실 최소화와 부호 관례가 다릅니다.'],
 'actor-critic-ppo':['r=exp(logπnew−logπold)\nA≥0: min(r,1+ε)A\nA<0: max(r,1−ε)A','clipped surrogate의 양·음 Advantage를 나눠 펼칩니다. clipping이 모든 파라미터 변화나 KL을 엄격하게 제한한다는 뜻은 아닙니다.'],
 vectors:['a·b=a₁b₁+⋯+aᴅbᴅ\nprojᵦa=(a·b)/(b·b)b\n(a−projᵦa)·b=0','투영 후 남는 벡터는 b에 직교합니다. b=0에서는 투영 공식의 분모가 0이라 정의되지 않습니다.'],
 matrices:['Cᵢⱼ=Aᵢ₁B₁ⱼ+⋯+AᵢₖBₖⱼ\nA(x+y)=Ax+Ay; A(cx)=cAx','행렬곱을 행과 열의 내적으로 펼칩니다. 행렬의 순서를 바꾸면 같은 변환이 되지 않을 수 있습니다.'],
 'eigen-svd':['Ax=Σⱼσⱼuⱼ(vⱼᵀx)\nrank-r 근사 Aᵣ=Σⱼ₌₁ʳσⱼuⱼvⱼᵀ','SVD는 입력을 직교 방향으로 투영하고 크기를 바꾼 뒤 출력 방향으로 합칩니다. 고유분해와 달리 직사각 행렬에도 적용됩니다.'],
 derivatives:['u=2x+1; f=u²\ndf/dx=(df/du)(du/dx)=2u×2=4(2x+1)\nf′(x)=limₕ→₀(f(x+h)−f(x))/h','합성함수의 변화율을 중간 연산마다 곱합니다. 미분의 극한과 유한 h를 쓰는 수치 근사의 오차를 구분합니다.'],
 gradients:['∇ℒ=[∂ℒ/∂θ₁,…,∂ℒ/∂θᴅ]\nℒ(θ−ηg)≈ℒ(θ)−η‖g‖², g=∇ℒ\nℒ=x²/2: xₜ=(1−η)ᵗx₀','작은 이동의 1차 근사가 감소 방향을 설명합니다. 이 이차함수의 수렴은 |1−η|<1, 즉 0<η<2에서 성립합니다.'],
 probability:['E[X]=x₁p₁+⋯+xₙpₙ\nVar(X)=E[X²]−E[X]²\nBernoulli: E[X]=p, Var(X)=p−p²','기댓값과 분산을 직접 합으로 펼칩니다. 연속 확률변수는 합 대신 적분을 쓰며 밀도 값 하나는 구간 확률이 아닙니다.'],
 statistics:['s²=((x₁−x̄)²+⋯+(xₙ−x̄)²)/(n−1)\nSE(x̄)≈s/√n (독립·동일분포 표본)','표본분산과 평균의 표준오차를 연결합니다. 상관된 자료에서는 이 표준오차를 그대로 적용하지 않습니다.'],
 bayes:['P(H|E)=P(E|H)P(H)/(P(E|H)P(H)+P(E|¬H)P(¬H))\nlog p(θ|D)=log p(D|θ)+log p(θ)−log p(D)','전체 증거 확률의 두 경로를 펼치고 MAP의 로그 목적함수를 연결합니다. θ와 무관한 증거 항은 argmax에서 제외할 수 있습니다.'],
 'information-theory':['CE(p,q)=−Σᵢpᵢlog qᵢ\nKL(p∥q)=Σᵢpᵢlog(pᵢ/qᵢ)=CE−H\n정답 one-hot: CE=−log qᵧ','자기 분포의 정보량과 다른 분포로 설명하는 비용 차를 펼칩니다. pᵢ>0,qᵢ=0이면 KL은 무한대이고 pᵢ=0 항은 0으로 해석합니다.'],
 'torch-tensors':['numel([B,C,H,W])=B×C×H×W\nbytes=numel×원소당 bytes','원소 수와 저장량을 계산합니다. dtype·device는 수학적 shape와 별개의 실행 조건이며 저장량에는 객체·allocator 비용을 제외합니다.'],
 'torch-operations':['Cᵦᵢⱼ=ΣₖAᵦᵢₖBᵦₖⱼ\n원소별 곱 Dᵢⱼ=AᵢⱼBᵢⱼ\n주소=offset+Σ축 index축×stride축','batched matmul과 원소별 곱, stride에 따른 메모리 위치를 펼칩니다. permute는 축과 stride를 바꾸며 reshape는 필요하면 복사합니다.'],
 'torch-module':['h=ReLU(xW₁ᵀ+b₁); y=hW₂ᵀ+b₂\nparams=4×8+8+8×2+2=58','등록된 두 Linear와 비선형을 합성한 forward입니다. 등록한 파라미터를 optimizer에 전달해 같은 계산 그래프를 반복 학습합니다.'],
 'torch-functional':['F.linear(x,W,b)=xWᵀ+b\nF.dropout(x,p,training=model.training)','계산 함수와 상태 관리의 관계를 펼칩니다. functional은 전달한 인수로 동작하므로 Module의 평가 모드가 자동 반영되는지 확인합니다.'],
 'torch-autograd':['y=x²: ∂y/∂x=2x\n새 forward로 두 backward: grad=2x+2x\nzero_grad → 다음 backward: grad=2x','그래프의 국소 미분과 leaf.grad 누적을 구분합니다. backward는 optimizer.step처럼 파라미터를 직접 바꾸지 않습니다.'],
 'torch-data':['N=qB+r, 0≤r<B\n배치 수=q+1[r>0] (drop_last=False)\n배치 수=q (drop_last=True)','마지막 작은 배치의 포함 조건을 펼칩니다. shuffle은 순서를 바꾸고 batch 크기는 optimizer가 한 번 보는 표본 수를 바꿉니다.'],
 'torch-losses':['CE(z,y)=logΣ꜀exp(z꜀)−zᵧ\nBCEWithLogits(z,y)=max(z,0)−zy+log(1+exp(−|z|))','logits에서 손실을 안정적으로 계산하는 형태입니다. multi-class CE와 독립 이진 label의 BCE는 정답 shape와 의미가 다릅니다.'],
 'torch-loop':['g=∇θℒ(modelθ(batch),target)\nSGD: θnext=θ−ηg\nzero_grad → 새 forward → loss → backward → step → 반복','한 배치의 계산이 다음 파라미터로 이어지는 루프입니다. 아래 학습 실험에서 같은 순서를 한 단계씩 수행합니다.'],
 'torch-modes':['train(): dropout mask, BN batch 통계\neval(): dropout 없음, BN running 통계\nno_grad()/inference_mode(): gradient 기록 제어','서로 독립적인 두 설정 축을 펼칩니다. eval만 호출해도 requires_grad가 있는 계산은 그래프에 기록될 수 있습니다.'],
 'torch-checkpoints':['재개 상태={모델,optimizer,scheduler,step,RNG 상태,…}\nAdam: 상태={mₜ,vₜ,step}도 복원','가중치 복원과 학습 재개를 구분합니다. 데이터 순서·난수·장치의 실행 조건까지 달라지면 완전히 같은 재개를 보장하지 않습니다.'],
 'learning-paradigms':['지도: ℒ(fθ(x),y)\n자기지도: ℒ(fθ(가린 x),원본에서 얻은 y)\n강화: max Eπθ[Σₜγᵗrₜ₊₁]','신호가 정답·자료 자체·보상 중 어디에서 오는지 목적함수로 연결합니다. 같은 모델 구조가 여러 학습 방식을 사용할 수 있습니다.'],
 'tensor-axes':['시퀀스 Xᵦₜd: t=토큰, d=feature\nsoftmax over d: Σd pᵦₜd=1\nmean over t: Yᵦd=(ΣₜXᵦₜd)/T','어느 축을 정규화·집계하는지 원소 표기로 펼칩니다. 숫자상 같은 shape라도 축의 의미가 다르면 결과가 달라집니다.'],
 'shape-design':['Flatten feature=C×H×W\nLinear params=(C×H×W)×out+out\n16×16×16=4096 → 4096×128+128=524416','앞 레이어의 공간 크기가 다음 Linear의 입력 크기와 파라미터를 결정합니다. shape의 변화와 모델 비용을 함께 추적합니다.'],
 'model-cost':['FP32 weights=4P bytes; gradients=4P\nFP32 Adam 상태 m,v=8P\n이 항목 합=16P bytes','파라미터·gradient·두 이동평균의 크기를 더합니다. 활성값, mixed precision 복사, 임시 buffer, allocator 비용은 별도이므로 총 GPU 메모리와 다릅니다.'],
 'curse-dimensionality':['D차원 격자 칸 수=k×⋯×k=kᴰ\n평균 칸당 표본 수=N/kᴰ','축마다 같은 해상도를 요구하면 필요한 표본 수가 지수적으로 늘어납니다. 실제 데이터가 낮은 내재 차원에 있으면 이 격자 가정과 다를 수 있습니다.'],
 initialization:['z=Σᵢwᵢxᵢ; Var(z)≈fan_in·Var(w)Var(x)\nReLU에서 약 절반 유지 → Var(w)=2/fan_in','독립·평균 0인 입력과 가중치라는 근사로 신호 분산을 계산합니다. 실제 상관과 활성화 분포는 이 가정을 벗어날 수 있습니다.'],
 'training-stability':['g입력=J₁ᵀJ₂ᵀ⋯Jₗᵀg출력\n‖gclip‖=min(‖g‖,c)\ng=[3,4], c=2 → 0.4g=[1.2,1.6]','역전파의 반복 곱과 norm 제한을 전개합니다. clipping은 방향을 보존하며 소실한 gradient를 복구하는 연산은 아닙니다.'],
 optimizers:['mₜ=β₁mₜ₋₁+(1−β₁)gₜ; vₜ=β₂vₜ₋₁+(1−β₂)gₜ²\nm̂ₜ=mₜ/(1−β₁ᵗ); v̂ₜ=vₜ/(1−β₂ᵗ)\nAdamW: θnext=(1−ηλ)θ−ηm̂/(√v̂+ε)','gradient의 1·2차 이동평균과 초기 편향 보정, 분리한 weight decay를 펼칩니다. 동일 학습률이라도 SGD와 업데이트 크기가 다릅니다.'],
 'learning-rate':['warmup: ηₜ=ηmax·t/Twarm\ncosine: ηₜ=ηmin+(ηmax−ηmin)(1+cos(πu))/2\nθnext=θ−ηₜgₜ','u는 decay 구간의 0…1 진행률입니다. 스케줄과 손실 함수의 곡률이 함께 업데이트 안정성에 영향을 줍니다.'],
 'numerical-stability':['Σexp(zᵢ)=exp(m)Σexp(zᵢ−m)\nlogΣexp(zᵢ)=m+logΣexp(zᵢ−m), m=max z\nsoftmax(z)=softmax(z−m)','공통 지수 인수를 분리해 overflow를 피합니다. 혼합 정밀도의 underflow와 loss scaling은 별도의 dtype 문제입니다.'],
 generalization:['gap=검증 손실−훈련 손실\n제곱오차 기대=편향²+분산+줄일 수 없는 잡음','편향·분산은 훈련 데이터셋을 반복 샘플링한 예측기의 제곱손실 분해입니다. 한 번의 gap에서 이 세 항을 직접 추정할 수는 없습니다.'],
 'validation-leakage':['μtrain=Σ훈련 xᵢ/Ntrain\nzvalidation=(xvalidation−μtrain)/σtrain\nCV 평균=(score₁+⋯+scoreₖ)/k','각 fold의 훈련 자료에서 전처리를 fit하고 평가 자료에는 transform만 합니다. 전체 평균을 쓰면 평가 정보가 훈련 과정에 들어갑니다.'],
 'metrics-imbalance':['F1=2PR/(P+R)=2TP/(2TP+FP+FN)\nAccuracy=(TP+TN)/N\nTPR=TP/(TP+FN); FPR=FP/(FP+TN)','혼동행렬에서 각 지표의 분모를 펼칩니다. 분모가 0인 지표의 처리 규칙과 임계값별 비용을 명시해야 합니다.'],
 'calibration-debugging':['acc(bin)=정답 수/표본 수\nconf(bin)=Σ확률/표본 수\nECE=Σbin(Nbin/N)|acc(bin)−conf(bin)|','확률 구간의 신뢰도와 관측 정확도를 비교합니다. ECE는 bin 선택에 의존하고 빈 bin은 제외하며 한 숫자로 모든 불확실성을 설명하지 않습니다.'],
 'transfer-learning':['θ=(θfrozen,θtrainable)\nθfrozen,next=θfrozen\nθtrainable,next=θtrainable−η∇ℒ','업데이트 대상을 나눠 전개합니다. requires_grad 고정과 eval 모드는 독립이며 optimizer 상태와 학습률도 함께 설정해야 합니다.'],
 'cs-complexity':['n→2n: (2n)²=4n²\n2n log₂(2n)=2n(log₂n+1)','같은 입력 배수에서 증가율을 비교합니다. 상한과 한 입력의 정확한 연산 횟수를 구분합니다.'],
 'cs-structures':['array 주소=base+i×원소 bytes\n선형 검색 최악 비교=n\n스택 pop=마지막, 큐 pop=처음','구조에 따라 다음 처리 순서와 접근 비용이 달라집니다. 해시는 적절한 분산에서 기대 상수 조회입니다.'],
 'cs-sorting':['T(n)=2T(n/2)+cn\n레벨당 작업≈cn, 깊이≈log₂n\n전체≈cn log₂n','균등 분할의 병합 비용을 각 깊이에 더합니다. 실험에서는 원소 크기 비교 횟수를 실제로 셉니다.'],
 'cs-binary-search':['a[mid]<target ⇒ lo=mid+1\na[mid]≥target ⇒ hi=mid\nlo=hi ⇒ lower_bound 반환','반열린 구간과 제외 조건을 전개합니다. 배열 길이는 해당 값이 없는 경우의 유효한 반환 인덱스입니다.'],
 'cs-prefix-window':['Pᵣ−Pₗ=(a₀+⋯+aᵣ₋₁)−(a₀+⋯+aₗ₋₁)\nSᵢ₊₁=Sᵢ−aᵢ+aᵢ₊ₖ','공통 앞부분이 상쇄되며 창이 이동할 때 한 원소를 빼고 더합니다. 고정 창과 가변 투 포인터를 구별합니다.'],
 'cs-backtracking':['전체 잎=2ⁿ; 전체 이진 결정 트리 노드=2ⁿ⁺¹−1\n모든 남은 값≥0 ∧ 현재 합>목표 ⇒ 가지 중단','가지치기가 없는 포함·제외 트리의 수를 펼칩니다. 조건을 충족하지 않으면 가지 중단의 정당성을 잃습니다.'],
 'cs-graph':['BFS: d[start]=0; d[새 이웃]=d[현재]+1\n인접 리스트 작업=O(V+E)','무가중치 거리의 갱신과 노드·간선 확인 비용을 연결합니다. DFS의 같은 갱신값은 탐색 트리 깊이입니다.'],
 'cs-shortest-path':['d[v]=min(d[v],d[u]+w)\nFloyd: Dᵏᵢⱼ=min(Dᵏ⁻¹ᵢⱼ,Dᵏ⁻¹ᵢₖ+Dᵏ⁻¹ₖⱼ)','한 간선의 개선과 중간 노드 허용의 DP를 펼칩니다. 음수 사이클이 있으면 유한 최단 경로의 존재를 따로 확인합니다.'],
 'cs-greedy':['e가 최소인 첫 활동 g\n최적해의 첫 활동 o를 g로 교체: e(g)≤e(o)\n남은 활동의 가능성 보존 → 반복','활동 선택의 교환 논증입니다. 임의 목적함수에 적용되는 일반적인 최적성 공식은 아닙니다.'],
 'cs-dp':['Fₙ=Fₙ₋₁+Fₙ₋₂\nCₙ=1+Cₙ₋₁+Cₙ₋₂; C₀=C₁=1\nDP 전이 n−1회, 두 값 저장 시 O(1) 공간','결과 값과 재귀 호출 수의 점화식을 따로 펼칩니다. 겹치는 문제를 한 번만 계산하면 작업이 선형으로 줄어듭니다.'],
 'cs-union-find':['대표가 다름 → 간선 선택 → union\n대표가 같음 → 기존 경로 존재 → 사이클 간선 제외\n연결 MST 간선 수=V−1','집합 연결의 불변식을 전개합니다. 간선 비용순 선택의 최적성은 cut property에 근거합니다.'],
 'cs-heap-topk':['배열 힙의 자식=2i+1,2i+2; 부모=⌊(i−1)/2⌋\nheap[0]=min(현재 Top-k)\n새 값>heap[0] → 교체·sift-down','루트가 가장 약한 후보여야 큰 점수 k개를 유지할 수 있습니다. 결과를 정렬해 출력하는 비용은 별도입니다.'],
 'cs-strings':['불일치: j←pi[j−1] (j>0)\n전체 일치: 시작=i−m+1; j←pi[m−1]\naba의 pi=[0,0,1]','접두·접미 정보를 재사용하여 겹치는 일치도 탐색합니다. Trie는 여러 문자열의 공통 접두어를 저장하는 별도 구조입니다.'],
 'cs-compute-graph':['u=x²; v=ax; L=u+v\n∂L/∂x=(∂L/∂u)2x+(∂L/∂v)a=2x+a\n∂L/∂a=x','분기된 두 경로를 더하는 다변수 연쇄법칙입니다. 순전파의 역위상 순서에서 미분하고 이후 optimizer가 값을 갱신합니다.'],
 'cs-matrix-compute':['곱셈=mnk; 덧셈=mn(k−1)\n정사각 타일 A,B,C FP32 bytes=3t²×4\nFLOPs 근사=2mnk','연산 수와 재사용을 위한 타일 저장량을 전개합니다. 측정한 성능이나 GPU 전체 메모리 크기가 아닙니다.'],
};
for (const t of topics) {
  const entry=expansions[t.id];
  if (!entry) throw new Error(`수식 전개 누락: ${t.id}`);
  t.expansion={formula:entry[0],explanation:entry[1]};
}
export const curriculum = topics;
export const getTopic = (id: string) => curriculum.find(t => t.id === id);
export const categoryTopics = (id: CategoryId) => curriculum.filter(t => t.category === id);

const blog = (slug:string) => `https://velog.io/@aidevksh/${slug}`;
const classificationReferences = [
 {title:'aidevksh — 소프트맥스 미분, 몫 규칙',url:blog('소프트맥스-미분-몫-규칙')},
 {title:'aidevksh — 소프트맥스와 크로스 엔트로피 미분',url:blog('소프트맥스와-크로스-엔트로피-미분')},
 {title:'aidevksh — MSE, Cross-Entropy',url:blog('MSE-Cross-Entropy')},
 {title:'Dive into Deep Learning — Softmax regression',url:'https://d2l.ai/chapter_linear-classification/softmax-regression.html'},
 {title:'PyTorch — CrossEntropyLoss',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html'},
];
for (const id of ['softmax','cross-entropy','torch-losses']) getTopic(id)!.references=classificationReferences;
getTopic('activation')!.references.push(
 {title:'aidevksh — 시그모이드 미분',url:blog('시그모이드-미분')},
 {title:'aidevksh — Tanh 미분',url:blog('TanhHyperbolic-tangent-미분')},
 {title:'aidevksh — ReLU 미분',url:blog('ReLU-미분')},
);

export const classificationTheory = {
 same: {title:'자기 점수에 대한 미분: i = j',text:'aᵢ=e^(zᵢ/τ), S=Σₖaₖ라 두면 분자와 분모가 모두 zᵢ에 의존합니다. 각각 ∂aᵢ/∂zᵢ=aᵢ/τ, ∂S/∂zᵢ=aᵢ/τ입니다.',formula:'∂(u/v)=(u′v−uv′)/v²\n∂pᵢ/∂zᵢ = [(aᵢ/τ)S − aᵢ(aᵢ/τ)] / S²\n= (aᵢ/S)(1−aᵢ/S)/τ = pᵢ(1−pᵢ)/τ'},
 other: {title:'다른 점수에 대한 미분: i ≠ j',text:'zⱼ를 바꿀 때 분자 aᵢ의 미분은 0입니다. 분모에는 aⱼ가 있으므로 ∂S/∂zⱼ=aⱼ/τ는 남습니다.',formula:'∂pᵢ/∂zⱼ = [0×S − aᵢ(aⱼ/τ)] / S²\n= −(aᵢ/S)(aⱼ/S)/τ = −pᵢpⱼ/τ\nJᵢⱼ=pᵢ(δᵢⱼ−pⱼ)/τ; J=(diag(p)−ppᵀ)/τ'},
 ce: {title:'확률을 손실로: 음의 로그우도',text:'고정된 정답 분포를 y, 모델의 예측을 p라 둡니다. 독립 표본의 정답 확률을 곱한 우도를 최대화하는 대신 음의 로그를 취해 합을 최소화합니다. 자연로그의 단위는 nats이며, one-hot 정답이면 한 항만 남습니다.',formula:'P(정답들 | 입력들)=∏ᵦpᵦ,정답\n−log P = Σᵦ(−log pᵦ,정답)\nL=−Σᵢyᵢ log pᵢ; one-hot y=eₖ ⇒ L=−log pₖ\nL=H(y)+KL(y∥p)'},
 probability: {title:'크로스 엔트로피 자체의 미분',text:'y는 미분하지 않는 정답입니다. pᵢ를 독립 좌표로 취급한 국소 미분은 −yᵢ/pᵢ입니다. 이 값은 아직 logit의 미분이 아닙니다. 확률 합의 제약을 반영하는 Softmax를 다음에 통과합니다.',formula:'∂L/∂pᵢ = −yᵢ × ∂log pᵢ/∂pᵢ = −yᵢ/pᵢ\npᵢ>0; yᵢ=0인 항의 미분은 0\nyᵢ>0, pᵢ→0⁺ ⇒ L→∞, ∂L/∂pᵢ→−∞'},
 chain: {title:'모든 클래스 경로를 더하면 p − y',text:'하나의 logit zⱼ가 모든 pᵢ에 영향을 줍니다. 야코비안의 한 열과 상류 미분을 곱해 더합니다. one-hot뿐 아니라 합이 1인 소프트 정답에서도 같은 식입니다.',formula:'∂L/∂zⱼ = Σᵢ (∂L/∂pᵢ)(∂pᵢ/∂zⱼ)\n= Σᵢ (−yᵢ/pᵢ) pᵢ(δᵢⱼ−pⱼ)/τ\n= [−yⱼ(1−pⱼ) + Σᵢ≠ⱼ yᵢpⱼ]/τ\n= [−yⱼ + pⱼΣᵢyᵢ]/τ = (pⱼ−yⱼ)/τ'},
 stable: {title:'같은 미분을 LogSumExp로 확인하기',text:'Softmax를 계산한 뒤 log를 취하면 작은 확률이 0으로 반올림될 수 있습니다. 실제 손실은 log-softmax로 직접 계산합니다. 최대값을 빼는 연산은 수치 안정화를 위한 동등한 표현입니다.',formula:'L = log Σᵢe^(zᵢ/τ) − Σᵢyᵢzᵢ/τ\n∂L/∂zⱼ = e^(zⱼ/τ)/(τΣᵢe^(zᵢ/τ)) − yⱼ/τ\n= (pⱼ−yⱼ)/τ\nm=max z; log pᵢ=(zᵢ−m)/τ − log Σₖe^((zₖ−m)/τ)'},
 batch: {title:'출력층에서 가중치 갱신까지',text:'가중치·정답·온도가 고정된 순전파를 먼저 계산하고 역전파에서 각 파라미터의 미분을 구합니다. 배치 평균이면 각 표본 기여에 1/B가 붙습니다. 아래 식은 클래스 가중치·ignore가 없는 CE입니다.',formula:'X [B,D], W [D,C], b [C]; Z=XW+b [B,C]\nG=∂L̄/∂Z=(P−Y)/(Bτ) [B,C]\n∂L̄/∂W=XᵀG [D,C]; ∂L̄/∂b=ΣᵦGᵦ [C]\n∂L̄/∂X=GWᵀ [B,D]\nW←W−ηXᵀG; b←b−ηΣᵦGᵦ → 새 Z로 순전파 반복'},
 binary: {title:'이진 분류: Sigmoid와 BCE',text:'서로 배타적인 C개 클래스는 Softmax, 이진 또는 독립 레이블은 Sigmoid를 사용합니다. Sigmoid 미분의 포화 항과 BCE의 분모가 상쇄되어 logit의 미분은 p−y가 됩니다. d(e⁻ᶻ)/dz=−e⁻ᶻ의 부호를 포함해 전개합니다.',formula:'p=σ(z); p′=p(1−p)\nL=−y log p−(1−y)log(1−p)\n∂L/∂p=−y/p+(1−y)/(1−p)\n∂L/∂z=[−y/p+(1−y)/(1−p)]p(1−p)\n=−y(1−p)+(1−y)p=p−y\n안정 L=max(z,0)−yz+log(1+e^(−|z|))'},
 weighted: {title:'p − y를 그대로 쓰면 안 되는 경우',text:'클래스별 가중치 w가 있으면 정답 질량의 가중합이 들어갑니다. ignore된 표본과 weighted mean의 분모도 별도로 처리해야 합니다. 이 실험은 가중치 없이 B=1로 계산합니다.',formula:'Lw=−Σᵢwᵢyᵢlog pᵢ\n∂Lw/∂zⱼ=[pⱼΣᵢwᵢyᵢ−wⱼyⱼ]/τ\n배치 평균·가중 평균의 reduction 분모를 추가 확인'},
} as const;

export interface LearningTrail { title:string; description:string; steps:{id:string; why:string}[]; }
const trail=(title:string,description:string,steps:[string,string][]):LearningTrail=>({title,description,steps:steps.map(([id,why])=>({id,why}))});
export const learningTrails:LearningTrail[]=[
 trail('분류 확률에서 출력층의 역전파로','분류 손실의 미분이 Softmax를 통과한 뒤 가중치까지 이어지는 경로입니다.',[
  ['probability','합이 1인 정답·예측 분포를 이해합니다.'],['information-theory','엔트로피와 교차엔트로피의 의미를 구별합니다.'],['softmax','몫 규칙으로 클래스 사이 야코비안을 구합니다.'],['cross-entropy','연쇄법칙의 합으로 p−y를 얻습니다.'],['linear-embedding','출력층의 입력과 가중치 차원을 연결합니다.'],['torch-losses','확률 대신 logits를 전달해 안정적인 손실을 계산합니다.'],['neural-network','출력 오차를 아래층으로 전파합니다.'],['optimizers','파라미터를 갱신한 뒤 순전파를 다시 계산합니다.']]),
 trail('한 번의 계산에서 반복 학습으로','예측과 미분을 계산한 뒤 파라미터를 바꾸고, 다음 예측에 다시 사용합니다.',[
  ['neural-network','입력과 현재 가중치로 예측합니다.'],['activation','비선형 출력과 국소 미분을 계산합니다.'],['torch-losses','예측과 정답의 차이를 scalar 손실로 만듭니다.'],['derivatives','연쇄법칙으로 각 연산을 거슬러 갑니다.'],['torch-autograd','계산 그래프에서 gradient를 모읍니다.'],['optimizers','gradient로 파라미터를 갱신합니다.'],['torch-loop','새 가중치의 forward로 반복하고 손실을 다시 측정합니다.']]),
 trail('언어의 표현에서 토큰 생성으로','ID·표현·확률은 다른 단계입니다. 생성은 파라미터 갱신 없이 문맥에 토큰을 추가합니다.',[
  ['cs-strings','문자열 처리의 접두어·패턴을 이해합니다.'],['linear-embedding','토큰 ID를 학습 가능한 행으로 바꿉니다.'],['transformer','토큰 간 문맥을 섞습니다.'],['llm-basics','마지막 표현에서 어휘 logits를 계산합니다.'],['softmax','logits를 후보 확률로 정규화합니다.'],['cs-heap-topk','상위 후보를 제한합니다.'],['llm-generation','한 토큰을 선택해 문맥에 추가하고 반복합니다.']]),
 trail('문맥 구성과 실행','입력 지시, 도구 실행, 프로토콜, 반복 제어를 연결합니다.',[
  ['prompting','지시·예시·근거의 토큰 예산을 정합니다.'],['cot','문제 풀이의 단계를 예시로 유도하고 별도로 검산합니다.'],['tools-agents','필요한 계산과 조회를 호출로 제안합니다.'],['mcp','도구 정의와 인수·결과를 전달합니다.'],['harness','상태·권한·재시도·종료를 관리합니다.'],['llm-evaluation','전체 작업의 성공과 비용을 측정합니다.']]),
 trail('모델 적응과 검증','학습 신호와 업데이트 대상, 새로운 데이터의 평가를 함께 설계합니다.',[
  ['learning-paradigms','정답·자료 자체·보상 중 신호를 선택합니다.'],['llm-training','토큰 손실로 기반 모델을 학습합니다.'],['transfer-learning','고정할 표현과 갱신할 파라미터를 정합니다.'],['llm-finetuning','전체 가중치 또는 저랭크 어댑터를 조절합니다.'],['preference-learning','응답 쌍의 선호로 정책을 조절합니다.'],['distillation','teacher의 분포를 student의 학습 신호로 씁니다.'],['validation-leakage','훈련에 쓰지 않은 자료에서 평가합니다.']]),
 trail('검색 근거와 연결된 지식','외부 자료를 정리·검색·검증하고 변경에 따라 갱신합니다.',[
  ['vectors','질문과 문서의 내적·각도를 계산합니다.'],['retrieval','키워드와 벡터 검색 순위를 비교합니다.'],['rag','예산 안에서 검색 근거를 문맥에 넣습니다.'],['ontology','개체와 관계의 의미를 정의합니다.'],['graphrag','관계와 커뮤니티 요약을 검색합니다.'],['llm-wiki','출처가 있는 파생 페이지와 링크를 유지합니다.'],['knowledge-strategies','문맥·가중치·근거의 갱신 단위를 선택합니다.']]),
 trail('형태를 맞추고 특징을 추출하기','각 레이어의 계산과 다음 레이어의 shape를 함께 추적합니다.',[
  ['tensor-axes','batch·channel·공간·feature를 구별합니다.'],['tensor-connections','reshape·concat·add의 조건을 확인합니다.'],['cnn','공유 커널로 지역 패턴을 계산합니다.'],['pooling-upsampling','공간 집계와 확대를 구분합니다.'],['shape-design','레이어를 연결하고 flatten feature를 계산합니다.'],['model-cost','파라미터와 저장량을 더합니다.']]),
 trail('깊은 표현의 안정적인 전달','시간·이웃·층을 통과하는 값과 gradient의 크기를 확인합니다.',[
  ['initialization','초기 가중치의 분산을 맞춥니다.'],['normalization','지정한 축의 통계로 값을 정규화합니다.'],['dropout','학습 때 일부 값을 제거하고 기대 크기를 보존합니다.'],['rnn-lstm-gru','시간축의 상태와 게이트를 갱신합니다.'],['gnn','그래프 이웃의 표현을 집계합니다.'],['training-stability','반복 Jacobian과 큰 gradient를 점검합니다.']]),
 trail('압축에서 확률적 생성으로','무엇을 복원하거나 구별하는지에 따라 학습 목표가 달라집니다.',[
  ['autoencoder','병목 표현에서 입력을 복원합니다.'],['vae','확률적 latent와 prior의 KL을 조절합니다.'],['gan','판별기와 생성기를 교대로 갱신합니다.'],['gan-stability','mode 누락과 critic의 제한을 확인합니다.'],['diffusion','노이즈 예측을 학습해 역방향 생성을 준비합니다.']]),
 trail('자료 자체에서 학습 신호 만들기','정답을 직접 달지 않아도 입력의 관계나 가린 부분에서 목표를 얻을 수 있습니다.',[
  ['contrastive-learning','양성·음성의 유사도를 비교합니다.'],['masked-learning','가린 위치 또는 다음 토큰을 예측합니다.'],['semi-supervised','일부 정답과 신뢰도 기반 pseudo-label을 결합합니다.']]),
 trail('예측식과 분류 경계','feature·손실·거리의 선택이 예측 방식을 바꿉니다.',[
  ['linear-regression','feature의 선형 결합으로 연속 값을 맞춥니다.'],['ridge-lasso','계수 크기에 규제를 더합니다.'],['logistic-regression','이진 확률과 손실을 연결합니다.'],['naive-bayes','조건부 독립 확률로 클래스를 비교합니다.'],['knn','가까운 이웃의 정답을 사용합니다.'],['svm','마진과 위반 손실로 경계를 정합니다.'],['decision-tree','불순도가 줄어드는 분할을 찾습니다.'],['ensembles','여러 예측을 평균하거나 잔차를 보정합니다.']]),
 trail('데이터의 구조와 밀도','정답 없이도 거리·확률·차원·상호작용의 구조를 탐색합니다.',[
  ['kmeans','가까운 중심 할당과 평균 갱신을 반복합니다.'],['gmm-em','분포별 책임도로 soft 할당합니다.'],['hierarchical-dbscan','계층 거리와 밀도 연결을 비교합니다.'],['dimensionality-reduction','투영 또는 이웃 관계로 차원을 줄입니다.'],['density-anomaly','정상 자료의 밀도에서 이상 후보를 찾습니다.'],['recommendation','사용자·항목의 latent 내적으로 상호작용을 예측합니다.']]),
 trail('보상에서 신경망 정책으로','환경과 상호작용하며 목표를 만들고 가치나 정책을 갱신합니다.',[
  ['rl-basics','상태·행동·보상과 할인 return을 정의합니다.'],['bandits','탐색과 경험 평균의 균형을 봅니다.'],['bellman','즉시 보상과 다음 가치를 연결합니다.'],['qlearning','TD 오차를 Q에 반영합니다.'],['dqn','TD 목표로 Q 신경망을 학습합니다.'],['policy-gradient','return으로 행동 log확률을 조절합니다.'],['actor-critic-ppo','가치 baseline과 clipped 정책 목적을 결합합니다.']]),
 trail('선형대수에서 기울기로','벡터와 변환의 표기를 익히고 변화율을 업데이트 방향으로 연결합니다.',[
  ['vectors','크기·방향과 내적을 정의합니다.'],['matrices','행과 열의 내적으로 여러 표현을 변환합니다.'],['eigen-svd','주요 방향과 크기로 변환을 분해합니다.'],['derivatives','입력 변화에 대한 국소 변화율을 계산합니다.'],['gradients','모든 파라미터의 편미분을 모아 감소 방향으로 이동합니다.']]),
 trail('확률에서 학습 손실로','분포를 추정하고 증거를 결합한 뒤 예측 분포의 비용을 측정합니다.',[
  ['probability','확률 합·기댓값·분산을 계산합니다.'],['statistics','유한 표본으로 평균과 불확실성을 추정합니다.'],['bayes','사전과 가능도로 사후를 계산합니다.'],['information-theory','예측 확률의 교차엔트로피와 KL을 계산합니다.']]),
 trail('PyTorch 구현과 학습 재개','텐서의 의미에서 모델 상태 저장까지 한 실행 흐름으로 읽습니다.',[
  ['torch-tensors','shape·dtype·device를 확인합니다.'],['torch-operations','matmul과 축·stride를 맞춥니다.'],['torch-module','레이어를 등록하고 forward를 작성합니다.'],['torch-functional','상태와 계산 함수의 역할을 구별합니다.'],['torch-data','표본을 batch로 묶습니다.'],['torch-loop','gradient 초기화부터 갱신까지 반복합니다.'],['torch-modes','검증에서 동작 모드와 미분 기록을 설정합니다.'],['torch-checkpoints','파라미터와 학습 상태를 저장·복원합니다.']]),
 trail('최적화와 수치 조건','같은 gradient도 초기값·학습률·정밀도에 따라 다른 반복을 만듭니다.',[
  ['initialization','신호가 과도하게 커지거나 줄지 않게 시작합니다.'],['optimizers','gradient와 이동평균으로 업데이트를 계산합니다.'],['learning-rate','진행 단계별 이동 크기를 정합니다.'],['numerical-stability','exp와 dtype의 범위·정밀도를 확인합니다.']]),
 trail('일반화의 판단','훈련 적합을 새로운 자료에서 검증하고 운영 목적의 지표로 해석합니다.',[
  ['curse-dimensionality','차원에 비해 표본이 충분한지 생각합니다.'],['generalization','훈련·검증 손실의 차이를 확인합니다.'],['validation-leakage','분할과 전처리에서 평가 정보를 분리합니다.'],['metrics-imbalance','불균형과 오탐 비용에 맞게 지표·임계값을 선택합니다.'],['calibration-debugging','확률 구간의 실제 정답률과 gradient를 점검합니다.']]),
 trail('코딩테스트의 기본 도구','복잡도를 먼저 추정하고 입력 조건에 맞는 저장·탐색 전략을 고릅니다.',[
  ['cs-complexity','연산과 공간의 증가를 비교합니다.'],['cs-structures','조회·방문 순서에 맞게 저장합니다.'],['cs-sorting','순서를 정리하고 분할정복을 이해합니다.'],['cs-binary-search','정렬·단조성을 이용해 후보를 줄입니다.'],['cs-prefix-window','구간의 계산을 재사용합니다.'],['cs-backtracking','가능한 선택과 불가능한 가지를 구분합니다.'],['cs-dp','같은 부분 문제를 한 번만 계산합니다.']]),
 trail('그래프의 연결과 최적 비용','방문·거리·전체 연결은 목적이 다르므로 조건에 맞게 알고리즘을 고릅니다.',[
  ['cs-graph','이웃을 큐·스택으로 탐색합니다.'],['cs-shortest-path','가중 경로 비용을 relaxation으로 개선합니다.'],['cs-greedy','선택을 되돌리지 않아도 되는 이유를 증명합니다.'],['cs-union-find','대표로 사이클을 검사하고 최소 연결 간선을 고릅니다.']]),
 trail('알고리즘에서 딥러닝 실행으로','자료구조·의존성·메모리 재사용을 모델 개발의 계산에 적용합니다.',[
  ['cs-heap-topk','많은 점수에서 후보를 제한합니다.'],['cs-strings','접두·패턴 정보를 재사용합니다.'],['cs-compute-graph','의존 순서로 계산하고 역순으로 gradient를 합칩니다.'],['cs-matrix-compute','내적 연산과 타일의 데이터 재사용을 계산합니다.'],['torch-operations','실제 텐서의 축과 stride에 연결합니다.']]),
];
export interface ConceptLink { from:string; to:string; kind:'선수 지식'|'학습 흐름'|'본문 링크'; explanation:string; }
export const conceptLinks:ConceptLink[]=[
 ...curriculum.flatMap(t=>t.prerequisites.map(to=>({from:t.id,to,kind:'선수 지식' as const,explanation:`${t.title}의 계산을 이해하는 기초입니다.`}))),
 ...learningTrails.flatMap(t=>t.steps.slice(1).map((s,i)=>({from:t.steps[i].id,to:s.id,kind:'학습 흐름' as const,explanation:s.why}))),
];
