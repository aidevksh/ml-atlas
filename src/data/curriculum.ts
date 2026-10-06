export type CategoryId = 'llm' | 'dl' | 'ml' | 'rl' | 'math' | 'pytorch' | 'design';
export type LabId = 'transformer' | 'activation' | 'shape' | 'vectors' | 'gradient' | 'probability' | 'regression' | 'clustering' | 'rag' | 'flow' | 'gan' | 'qlearning';
export interface Topic {
  id: string; title: string; summary: string; formula: string; dimensions: string;
  example: string; category: CategoryId; group: string; tags: string[]; prerequisites: string[];
  lab?: LabId; references: { title: string; url: string }[];
}
export const categories: { id: CategoryId; name: string; shortName?: string; english: string; description: string; color: string; symbol: string }[] = [
  { id: 'llm', name: 'LLM', english: 'Language & intelligence', description: '토큰에서 에이전트까지, 언어 모델을 연결하는 방법.', color: '#7561b8', symbol: '✳' },
  { id: 'dl', name: 'DL (Deep Learning)', shortName: 'DL', english: 'Deep Learning', description: '작은 뉴런에서 시작해 복잡한 표현을 쌓아갑니다.', color: '#488d7d', symbol: '▦' },
  { id: 'ml', name: 'ML (Machine Learning)', shortName: 'ML', english: 'Machine Learning', description: '데이터 속 패턴을 찾고, 예측하고, 설명합니다.', color: '#bd8548', symbol: '◈' },
  { id: 'rl', name: '강화학습', english: 'Reinforcement learning', description: '행동과 보상 사이에서 더 나은 선택을 배웁니다.', color: '#5986b6', symbol: '↗' },
  { id: 'math', name: '수학', english: 'Mathematical foundations', description: '벡터, 미분, 확률. 모델을 이해하는 공통 언어.', color: '#a76e8f', symbol: '∑' },
  { id: 'pytorch', name: '파이토치', english: 'PyTorch in practice', description: '텐서를 만들고, 모델을 쓰고, 학습을 실행합니다.', color: '#c1775b', symbol: '⌘' },
  { id: 'design', name: '모델설계학습', english: 'Design & training', description: '차원을 맞추고, 학습을 안정화하고, 제대로 평가합니다.', color: '#73866a', symbol: '⊞' },
];
const sources: Record<CategoryId, { title: string; url: string }> = {
  llm: { title: 'Hugging Face — LLM course', url: 'https://huggingface.co/learn/llm-course/chapter1/1' },
  dl: { title: 'Deep Learning — Goodfellow, Bengio, Courville', url: 'https://www.deeplearningbook.org/' },
  ml: { title: 'scikit-learn — User guide', url: 'https://scikit-learn.org/stable/user_guide.html' },
  rl: { title: 'Sutton & Barto — Reinforcement Learning', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
  math: { title: 'Mathematics for Machine Learning — authors’ textbook', url: 'https://mml-book.github.io/' },
  pytorch: { title: 'PyTorch — Learn the basics', url: 'https://docs.pytorch.org/tutorials/beginner/basics/intro.html' },
  design: { title: 'Deep Learning — Practical methodology', url: 'https://www.deeplearningbook.org/contents/guidelines.html' },
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
topic('neural-network', '신경망 · 순전파 · 역전파', '선형변환과 비선형 활성화를 합성해 표현을 학습합니다. 역전파는 연쇄법칙으로 손실의 파라미터 미분을 계산합니다.', 'h = φ(xW+b); ∂ℒ/∂W = xᵀ ∂ℒ/∂z', 'x [B,in] → h [B,out]', 'x=2, w=3, b=1이면 z=7입니다. ℒ=z²/2의 ∂ℒ/∂w는 z·x=14입니다.', 'activation', ['지도']);
topic('activation', '활성화 함수와 비선형성', '활성화가 없는 선형층 합성은 하나의 선형변환입니다. ReLU·tanh·Sigmoid·Leaky ReLU·GELU·SiLU의 출력과 포화 영역을 비교합니다.', 'ReLU(x)=max(0,x); tanh′(x)=1−tanh²(x)', '원소별 활성화는 입력 shape를 보존', 'x=−1에서 ReLU는 0, tanh는 −0.762, Sigmoid는 0.269입니다. 큰 |x|에서 Sigmoid·tanh 미분은 작아집니다.', 'activation');
topic('softmax', 'Softmax와 출력층', '다중 클래스의 logits를 한 축에서 합이 1인 확률로 바꿉니다. 이진·다중 레이블에는 독립 Sigmoid가 쓰일 수 있습니다.', 'softmax(z)ᵢ = exp(zᵢ−max z) / Σⱼ exp(zⱼ−max z)', '[B,C] → [B,C], 클래스 축의 합 = 1', 'logits [2,1,0]의 확률은 약 [0.665,0.245,0.090]입니다. CrossEntropyLoss에는 확률이 아니라 logits를 전달합니다.', 'activation');
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
// Within each category, notes progress from concepts to their applications.
// Cross-category prerequisites take precedence over display order.
for (const c of categories) {
  const ordered = topics.filter(t => t.category === c.id);
  ordered.forEach((t, index) => { if (index) t.prerequisites = [ordered[index - 1].id]; });
}
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
const additionalReferences:Record<string, {title:string;url:string}[]> = {
  normalization: [
    {title:'PyTorch — BatchNorm1d',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html'},
    {title:'PyTorch — LayerNorm',url:'https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html'},
  ],
  'torch-checkpoints': [{title:'PyTorch — Serialization semantics',url:'https://docs.pytorch.org/docs/stable/notes/serialization.html'}],
};
for (const topic of topics) topic.references.push(...(additionalReferences[topic.id] ?? []));
export const curriculum = topics;
export const getTopic = (id: string) => curriculum.find(t => t.id === id);
export const categoryTopics = (id: CategoryId) => curriculum.filter(t => t.category === id);
