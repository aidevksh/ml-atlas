<div align="center">

# ML Atlas

**수식으로 이해하고, 시각화로 탐색하는 머신러닝 지도.**

LLM부터 수학까지, 개념을 작은 계산과 직접 움직이는 실험으로 연결합니다.<br>정의부터 차근차근 읽고, 수식을 풀어보고, 숫자가 바뀌는 과정을 확인하세요.

[학습 목차](#학습-목차) · [시작하기](#시작하기) · [Transformer](#transformer) · [참고 자료](#참고-자료)

</div>

## 이 프로젝트에서 할 수 있는 것

| 개념 이해 | 수식 해석 | 계산과 실험 |
| :--- | :--- | :--- |
| 왜 필요한지, 무엇인지, 어떻게 작동하는지 설명합니다. | 기호의 뜻과 입력·출력 차원을 풀어 읽습니다. | 손 계산과 슬라이더·선택·드래그 결과를 연결합니다. |

TypeScript·React로 구현한 라이트모드 반응형 학습 사이트입니다. **93개 페이지 모두** 주제별 설명과 계산 실험을 제공합니다. 각 페이지는 동기·정의 → 작동 과정 → 수식·기호 → 계산 예제 → 시각화·실험 → 오해 설명·확인 문제 순서로 **세로로 이어집니다.** 챕터 전환 없이 본문을 읽으며, 참고 용어와 확인 문제의 해설은 필요할 때 펼칠 수 있습니다.

92개 주제에는 각각의 수치·규칙 계산 모델과 입력별 결과 곡선이 있고, Transformer는 행렬·드래그·블록·캐시 실험을 제공합니다. 벡터 투영·변환 격자·접선과 할선·회귀 잔차·군집 위치·PCA 복원·밀도 곡선·신경망 순전파·이웃 메시지·그래프 hop·Ontology 타입 추론은 해당 계산을 직접 그립니다. BatchNorm·LayerNorm의 통계 축 비교, 파이토치 10개 주제의 코드 예제, 레이어 편집기 등 추가 실험도 연결합니다. **작은 계산 예제는 명시한 가정에서 동작하며 실제 학습 모델의 성능이나 LLM 응답을 재현하지 않습니다.** 여러 방법을 함께 다루는 페이지는 본문에서 차이를 설명하고 실험의 구현 범위를 밝힙니다.

카테고리 순서는 **LLM → DL → ML → 강화학습 → 수학 → 파이토치 → 모델설계학습**입니다. 화면에는 DL (Deep Learning), ML (Machine Learning)으로 약어의 뜻을 함께 표시합니다. 카테고리 안은 기초에서 응용으로 이어지고 관련 선수 지식을 링크합니다. 검색·학습 방식 필터·북마크·완료 표시·마지막 페이지 이어 읽기를 지원합니다.

콘텐츠는 버전 관리하는 TypeScript 데이터입니다. 현재의 정적 학습 사이트에는 서버 DB가 필요하지 않습니다. 개인 기록은 이 브라우저의 localStorage에 저장합니다. 로그인·서버 DB·기기 간 동기화는 없으며 저장소가 차단되어도 학습 기능은 동작합니다.

## 시작하기

Node.js 22.12 이상(또는 Vite가 지원하는 20.19 이상)이 필요합니다.

```bash
npm ci
npm run dev
```

터미널의 로컬 URL을 엽니다. 포트 5173이 비어 있으면 [학습 지도](http://127.0.0.1:5173/)에서 시작합니다.

```bash
npm run build
npm run preview
```

빌드한 `dist/index.html`은 JS·CSS를 포함하는 단일 파일입니다. 파일 직접 열기를 지원하도록 구성했으며 브라우저의 로컬 파일·저장소 정책에 따라 동작이 다를 수 있습니다. 소스 `index.html`은 Vite 개발 서버에서 엽니다. 정적 호스팅에는 `dist/`를 배포합니다. hash 라우팅으로 별도 서버 rewrite 없이 주제 링크가 동작합니다. 기존 `transformer/index.html`과 `#attention` 등의 링크는 React의 연속 본문으로 이동합니다.

## 학습 목차

<!-- TOPICS:START -->
| 카테고리 | 페이지 수 | 구현한 학습 내용 |
| :--- | :--- | :--- |
| [LLM](#llm) | 18 | 토큰에서 에이전트까지, 언어 모델을 연결하는 방법. |
| [DL (Deep Learning)](#dl-deep-learning) | 19 | 작은 뉴런에서 시작해 복잡한 표현을 쌓아갑니다. |
| [ML (Machine Learning)](#ml-machine-learning) | 15 | 데이터 속 패턴을 찾고, 예측하고, 설명합니다. |
| [강화학습](#강화학습) | 7 | 행동과 보상 사이에서 더 나은 선택을 배웁니다. |
| [수학](#수학) | 9 | 벡터, 미분, 확률. 모델을 이해하는 공통 언어. |
| [파이토치](#파이토치) | 10 | 텐서를 만들고, 모델을 쓰고, 학습을 실행합니다. |
| [모델설계학습](#모델설계학습) | 15 | 차원을 맞추고, 학습을 안정화하고, 제대로 평가합니다. |
<!-- TOPICS:END -->

### LLM

토큰에서 에이전트까지, 언어 모델을 연결하는 방법. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [LLM의 기본 구조](./index.html#/lesson/llm-basics) | 텍스트를 토큰 ID로 바꾸고 임베딩·Transformer를 거쳐 다음 토큰의 확률을 계산합니다. 토큰 수는 글자 수와 다릅니다. | 연속된 토큰의 조건부 확률 |
| 2 | [생성과 추론](./index.html#/lesson/llm-generation) | 미래 토큰을 보지 않고 한 토큰씩 생성합니다. 온도는 분포의 집중도를 바꾸며 Top-k·Top-p는 후보를 제한합니다. | 온도와 후보 제한 후 재정규화 |
| 3 | [프롬프트와 문맥](./index.html#/lesson/prompting) | 지시·예시·참고 자료를 입력에 배치해 응답을 유도합니다. Few-shot은 문맥의 예시이며 모델 가중치를 바꾸지 않습니다. | 문맥 예산을 실제로 배분하기 |
| 4 | [CoT와 단계적 문제 풀이](./index.html#/lesson/cot) | 답만 제시하는 예시와 중간 풀이를 포함한 예시를 비교합니다. 생성된 풀이가 내부 계산을 충실하게 설명하거나 정답을 보장하지는 않습니다. | 다수결과 검산을 분리하기 |
| 5 | [사전학습과 SFT](./index.html#/lesson/llm-training) | 사전학습은 다음 토큰 예측으로 언어 패턴을 배웁니다. SFT는 지시·응답 예시를 학습하고 보통 응답 위치의 손실에 집중합니다. | 손실 마스크가 포함하는 위치 |
| 6 | [Fine-tuning · LoRA · QLoRA](./index.html#/lesson/llm-finetuning) | 전체 가중치를 업데이트하거나 저랭크 보정만 학습합니다. QLoRA는 양자화된 기반 모델과 학습 가능한 어댑터를 결합합니다. | 저랭크 보정의 파라미터 수 |
| 7 | [선호도 학습 · RLHF · DPO](./index.html#/lesson/preference-learning) | SFT 이후 응답 쌍의 선호를 학습할 수 있습니다. RLHF는 보상 기반 정책 최적화를, DPO는 선호 쌍을 이용한 직접 목적함수를 사용합니다. | 선호 쌍의 log-ratio 차이 |
| 8 | [지식 증류](./index.html#/lesson/distillation) | Teacher의 출력 분포나 응답 데이터를 Student의 학습 목표로 사용합니다. 증류는 작은 모델로 지식을 전달하는 데 활용되지만 크기가 반드시 작아야 하는 것은 아닙니다. | Teacher의 부드러운 분포를 비교하기 |
| 9 | [키워드 · 벡터 · Hybrid 검색](./index.html#/lesson/retrieval) | 키워드 일치와 의미 벡터 유사도는 다른 검색 신호입니다. Hybrid 검색은 두 순위의 정보를 결합합니다. | 두 검색 신호의 순위 합치기 |
| 10 | [RAG](./index.html#/lesson/rag) | 자료를 청크로 나누고 검색한 근거를 질문과 함께 모델에 전달합니다. 검색 실패와 생성 실패는 따로 평가합니다. | 관련도와 근거 토큰 예산 |
| 11 | [Ontology · Knowledge Graph](./index.html#/lesson/ontology) | Ontology는 개념·관계·제약의 의미를 정의하고, 지식 그래프는 실제 개체와 관계를 담습니다. 문자열이 같다고 동일 개체는 아닙니다. | 관계 방향과 OWL 타입 추론 |
| 12 | [GraphRAG](./index.html#/lesson/graphrag) | 개체와 관계를 추출하고 그래프·커뮤니티 요약을 검색에 활용합니다. 그래프 구성 품질과 질문 유형에 따라 효과가 달라집니다. | 관계 경로로 연결된 근거 찾기 |
| 13 | [LLM Wiki](./index.html#/lesson/llm-wiki) | LLM이 원본 자료를 읽고 지속적인 요약·개체·개념 페이지와 상호 링크를 유지하는 지식베이스 패턴입니다. 검색 방식과 함께 사용할 수 있습니다. | 새 자료가 기존 주장과 충돌할 때 |
| 14 | [지식 활용 방식 비교](./index.html#/lesson/knowledge-strategies) | Prompting은 문맥, Fine-tuning은 파라미터, RAG는 외부 근거를 활용합니다. GraphRAG와 Wiki는 지식 조직 방식까지 확장합니다. | 갱신 비용이 서로 다른 지식 경로 |
| 15 | [도구 호출과 에이전트](./index.html#/lesson/tools-agents) | 모델이 도구 호출을 제안하면 실행 시스템이 입력을 검사하고 도구를 실행합니다. 결과를 다시 모델에 제공하며 종료 조건을 관리합니다. | 검사한 인수를 도구에 전달하기 |
| 16 | [MCP](./index.html#/lesson/mcp) | AI 애플리케이션과 도구·자료를 연결하는 프로토콜입니다. Host가 Client를 관리하고 Client는 Server의 기능을 사용합니다. | JSON-RPC 요청과 결과의 연결 |
| 17 | [에이전트 하네스](./index.html#/lesson/harness) | 모델 주변에서 문맥·도구·상태·권한·실행 루프·로그·복구를 관리하는 시스템입니다. 하네스가 실행 정책과 자원 한도를 결정합니다. | 실패 횟수와 실행 한도를 관리하기 |
| 18 | [LLM 평가와 운영](./index.html#/lesson/llm-evaluation) | 정답성·근거 충실성·검색 성능·도구 성공률·비용을 각각 측정합니다. 외부 자료의 지시가 실행 지시로 섞이지 않게 처리합니다. | 평가 성공률과 비용을 분리하기 |

### DL (Deep Learning)

작은 뉴런에서 시작해 복잡한 표현을 쌓아갑니다. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [신경망 · 순전파 · 역전파](./index.html#/lesson/neural-network) | 선형변환과 비선형 활성화를 합성해 표현을 학습합니다. 역전파는 연쇄법칙으로 손실의 파라미터 미분을 계산합니다. | 한 뉴런의 순전파와 역전파 |
| 2 | [활성화 함수와 비선형성](./index.html#/lesson/activation) | 활성화가 없는 선형층 합성은 하나의 선형변환입니다. ReLU·tanh·Sigmoid·Leaky ReLU·GELU·SiLU의 출력과 포화 영역을 비교합니다. | 비선형 함수의 값과 미분 |
| 3 | [Softmax와 출력층](./index.html#/lesson/softmax) | 다중 클래스의 logits를 한 축에서 합이 1인 확률로 바꿉니다. 이진·다중 레이블에는 독립 Sigmoid가 쓰일 수 있습니다. | 후보가 서로 경쟁하는 확률 |
| 4 | [Linear와 Embedding](./index.html#/lesson/linear-embedding) | Linear는 feature를 변환하고 Embedding은 ID에 해당하는 학습 가능한 행을 조회합니다. 조회 자체는 토큰 간 정보를 섞지 않습니다. | 변환과 표 조회의 파라미터 수 |
| 5 | [레이어 연결과 텐서 변형](./index.html#/lesson/tensor-connections) | Flatten·Reshape·Permute는 구조를 바꿉니다. Concat은 한 축을 늘리고 Residual Add는 호환되는 shape의 값을 더합니다. | Reshape·Concat·Add의 조건 |
| 6 | [합성곱 레이어와 CNN](./index.html#/lesson/cnn) | 작은 커널을 이동해 지역적 패턴을 계산합니다. 채널·Stride·Padding·Dilation·Groups가 출력 크기와 연결을 결정합니다. | 작은 커널의 실제 곱과 공간 크기 |
| 7 | [Pooling과 Upsampling](./index.html#/lesson/pooling-upsampling) | Max·Average pooling은 창의 값을 집계합니다. Global·Adaptive pooling은 목표 크기로 집계하고 Upsampling·ConvTranspose는 공간을 확대합니다. | 최대·평균과 보간 |
| 8 | [BatchNorm · LayerNorm · RMSNorm](./index.html#/lesson/normalization) | BatchNorm과 LayerNorm은 통계를 구하는 축이 다릅니다. RMSNorm은 평균을 빼지 않고 RMS로 나눕니다. | 같은 벡터의 LayerNorm과 RMSNorm |
| 9 | [Dropout](./index.html#/lesson/dropout) | 학습 시 원소를 확률 p로 제거하고 살아남은 값을 1/(1−p)로 확대합니다. 평가 시에는 마스킹하지 않습니다. | 한 마스크와 반복 평균 |
| 10 | [RNN · LSTM · GRU](./index.html#/lesson/rnn-lstm-gru) | 시간축의 상태를 반복 갱신합니다. LSTM·GRU는 게이트로 상태 보존과 갱신을 조절하며 긴 의존성 학습을 돕습니다. | 반복 상태와 LSTM cell 게이트 |
| 11 | [Transformer](./index.html#/lesson/transformer) | 전체 구조부터 QKV·멀티 헤드·위치 인코딩·Residual·FFN·KV 캐시까지 작은 행렬로 직접 탐색합니다. | QKV·멀티 헤드·위치·정규화·FFN·KV 캐시 |
| 12 | [그래프 신경망](./index.html#/lesson/gnn) | 이웃의 정보를 집계해 노드 표현을 갱신합니다. 그래프 연결과 집계 방식이 정보 전달 범위를 결정합니다. | 이웃 집계와 메시지 전달 |
| 13 | [Autoencoder와 노이즈 제거](./index.html#/lesson/autoencoder) | 입력을 압축한 뒤 복원합니다. Denoising Autoencoder는 손상된 입력으로 원본을 복원하도록 학습합니다. | 평균 병목으로 압축·복원 |
| 14 | [VAE](./index.html#/lesson/vae) | 잠재변수의 확률분포를 학습하고 재매개화로 샘플링과 미분을 연결합니다. 복원 품질과 사전분포에 가까운 잠재공간 사이를 조절합니다. | 재매개화와 Gaussian KL |
| 15 | [GAN과 적대적 학습](./index.html#/lesson/gan) | 생성자는 표본을 만들고 판별자는 진짜·가짜를 구별합니다. 두 모델을 교대로 학습하며 분포와 생성 다양성을 살펴봅니다. | 교대 Gradient 업데이트 |
| 16 | [GAN의 학습 문제 · WGAN](./index.html#/lesson/gan-stability) | Mode collapse는 다양한 실제 패턴 중 일부만 생성하는 현상입니다. WGAN은 진짜·가짜 확률 대신 critic과 거리 기반 목적함수를 사용합니다. | mode 누락과 제한된 critic |
| 17 | [Diffusion](./index.html#/lesson/diffusion) | 점진적으로 노이즈를 추가한 자료에서 노이즈나 원본을 예측하도록 학습합니다. 역과정의 여러 단계로 표본을 생성합니다. | 원본·잡음의 혼합과 한 시점 복원 |
| 18 | [대조학습](./index.html#/lesson/contrastive-learning) | 같은 자료의 두 증강을 가까이, 다른 자료를 구분 가능하게 표현합니다. Temperature는 유사도 분포의 집중도를 바꿉니다. | positive와 negative의 경쟁 |
| 19 | [마스킹과 자기회귀 학습](./index.html#/lesson/masked-learning) | 가려진 위치를 복원하거나 이전 요소에서 다음 요소를 예측합니다. Teacher forcing은 학습 중 이전 정답을 입력으로 제공합니다. | loss에 포함되는 위치 |

### ML (Machine Learning)

데이터 속 패턴을 찾고, 예측하고, 설명합니다. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [선형 · 다항 회귀](./index.html#/lesson/linear-regression) | 가중합으로 연속 값을 예측하고 잔차를 최소화합니다. 다항 특성은 입력의 비선형 패턴을 선형 파라미터로 표현합니다. | 예측선과 잔차의 제곱 |
| 2 | [Ridge와 Lasso](./index.html#/lesson/ridge-lasso) | 오차에 가중치 크기 벌점을 더합니다. L2는 큰 계수를 완만하게 줄이고 L1은 일부 계수를 정확히 0으로 만들 수 있습니다. | 규제가 바꾸는 최적 계수 |
| 3 | [로지스틱 회귀](./index.html#/lesson/logistic-regression) | 선형 점수에 Sigmoid를 적용해 이진 확률을 모델링합니다. 임계값은 확률을 결정으로 바꾸는 별도 선택입니다. | 확률과 판단 임계값 |
| 4 | [Naive Bayes](./index.html#/lesson/naive-bayes) | 클래스가 주어졌을 때 특성들이 조건부 독립이라는 가정으로 클래스 사후확률을 계산합니다. | 조건부 가능도에서 사후확률로 |
| 5 | [k-NN과 거리](./index.html#/lesson/knn) | 가까운 k개 표본으로 분류·회귀합니다. 거리 척도와 특성 스케일에 민감하며 k는 국소성과 안정성을 조절합니다. | 가까운 이웃의 투표 |
| 6 | [SVM과 커널](./index.html#/lesson/svm) | 클래스 사이의 마진을 확보하면서 위반을 벌점으로 처리합니다. 커널은 내적 계산을 확장해 비선형 결정경계를 만들 수 있습니다. | 마진 폭과 Hinge 위반 |
| 7 | [결정트리](./index.html#/lesson/decision-tree) | 특성 임계값으로 데이터를 나눠 자식 노드의 불순도를 줄입니다. 깊이가 커질수록 훈련 데이터에 과하게 맞출 수 있습니다. | 분할이 줄이는 불순도 |
| 8 | [Bagging · Random Forest · Boosting](./index.html#/lesson/ensembles) | 여러 모델의 예측을 결합합니다. Bagging은 재표집 모델을 평균하고 Random Forest는 특성 무작위성을 더합니다. Boosting은 순차적으로 오차를 보정합니다. | 평균과 잔차 보정은 다른 계산 |
| 9 | [k-means](./index.html#/lesson/kmeans) | 각 점을 가장 가까운 중심에 할당하고 중심을 할당된 점의 평균으로 갱신합니다. 초기화와 k에 따라 국소 해가 달라집니다. | 할당 후 평균으로 중심 이동 |
| 10 | [Gaussian Mixture · EM](./index.html#/lesson/gmm-em) | 여러 Gaussian의 혼합으로 분포를 모델링하고 각 점의 군집 책임도를 계산합니다. EM은 책임도와 파라미터를 번갈아 갱신합니다. | 하드 할당 대신 책임도 |
| 11 | [계층적 군집과 DBSCAN](./index.html#/lesson/hierarchical-dbscan) | 계층적 군집은 가까운 군집을 병합합니다. DBSCAN은 ε 이웃의 밀도로 군집을 연결하고 희박한 점을 잡음으로 둘 수 있습니다. | 이웃의 밀도가 만드는 Core |
| 12 | [PCA · t-SNE · UMAP](./index.html#/lesson/dimensionality-reduction) | PCA는 선형 축으로 분산을 보존합니다. t-SNE·UMAP은 이웃 구조를 중심으로 저차원 배치를 만들며 그림의 모든 거리를 원래 거리로 해석할 수 없습니다. | 투영 방향과 보존 분산 |
| 13 | [밀도 추정과 이상 탐지](./index.html#/lesson/density-anomaly) | KDE는 커널을 합쳐 밀도를 추정합니다. Isolation Forest는 분리 경로, LOF는 이웃의 상대 밀도로 이상 정도를 평가합니다. | 커널을 더한 밀도 곡선 |
| 14 | [추천 시스템과 행렬분해](./index.html#/lesson/recommendation) | 사용자·아이템의 잠재벡터 내적으로 선호를 예측합니다. 관측하지 않은 평점을 실제 0점으로 취급하지 않는 것이 중요합니다. | 잠재벡터로 관측 평점 예측 |
| 15 | [준지도학습](./index.html#/lesson/semi-supervised) | 소량의 레이블과 다량의 무레이블 자료를 함께 씁니다. 의사 레이블의 오류가 강화될 수 있으므로 신뢰도와 검증을 관리합니다. | 의사 레이블을 쓸 표본 선택 |

### 강화학습

행동과 보상 사이에서 더 나은 선택을 배웁니다. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [강화학습 기초와 MDP](./index.html#/lesson/rl-basics) | Agent가 상태에서 행동하고 환경으로부터 보상과 다음 상태를 받습니다. 목표는 기대 누적 보상을 높이는 정책입니다. | 미래 보상을 현재 기준으로 합산 |
| 2 | [탐색과 활용 · Bandit](./index.html#/lesson/bandits) | 즉시 보상만 있는 선택 문제에서 미지의 행동을 시도하는 탐색과 좋은 행동을 반복하는 활용을 조절합니다. | 탐색 확률과 표본평균 갱신 |
| 3 | [가치함수와 Bellman 방정식](./index.html#/lesson/bellman) | 현재 보상과 다음 상태의 가치 사이의 자기 일관성을 이용합니다. 가치 반복과 정책 반복은 이 관계를 활용합니다. | 전이 확률을 가중한 다음 가치 |
| 4 | [Q-learning · SARSA · TD](./index.html#/lesson/qlearning) | 관측한 전이로 가치 추정을 갱신합니다. Q-learning은 다음 최대 Q, SARSA는 실제 다음 행동 Q를 목표에 사용합니다. | TD 오차로 가치표 수정 |
| 5 | [DQN](./index.html#/lesson/dqn) | Q-table 대신 신경망으로 행동 가치를 예측합니다. Replay buffer의 전이로 학습하고 별도 Target network로 목표를 안정화합니다. | Target network가 정하는 학습 목표 |
| 6 | [Policy Gradient · REINFORCE](./index.html#/lesson/policy-gradient) | 높은 Return을 낸 행동의 log 확률을 높이는 방향으로 정책을 학습합니다. Baseline은 편향을 추가하지 않으면서 분산을 줄일 수 있습니다. | 좋았던 행동의 확률을 높이는 신호 |
| 7 | [Actor–Critic · PPO](./index.html#/lesson/actor-critic-ppo) | Actor는 정책, Critic은 가치를 추정합니다. PPO의 clipped surrogate는 큰 정책 변화의 이득을 제한하지만 변화량의 엄격한 보장은 아닙니다. | Clipped surrogate의 두 항 |

### 수학

벡터, 미분, 확률. 모델을 이해하는 공통 언어. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [벡터 · 내적 · 투영](./index.html#/lesson/vectors) | 벡터는 크기와 방향을 표현합니다. 내적은 한 방향으로 얼마나 정렬되어 있는지 측정하고 투영·유사도의 기반이 됩니다. | 내적과 실제 투영 벡터 |
| 2 | [행렬과 선형변환](./index.html#/lesson/matrices) | 행렬곱의 안쪽 차원은 같아야 합니다. 행렬은 벡터의 방향·크기를 바꾸며 여러 벡터에 같은 변환을 적용할 수 있습니다. | 격자가 바뀌는 선형변환 |
| 3 | [고유값 · 고유벡터 · SVD](./index.html#/lesson/eigen-svd) | 고유벡터는 변환 후에도 방향이 유지되는 벡터입니다. SVD는 직사각 행렬도 직교 방향과 스케일로 분해합니다. | 축별 확대와 rank-1 근사 |
| 4 | [미분과 연쇄법칙](./index.html#/lesson/derivatives) | 미분은 작은 입력 변화에 대한 출력의 변화율입니다. 합성함수 미분은 중간 변화율을 곱해 계산합니다. | 할선에서 접선으로 |
| 5 | [편미분 · Gradient · 경사하강법](./index.html#/lesson/gradients) | Gradient는 각 입력 축의 편미분을 모은 벡터입니다. 음의 Gradient로 작은 이동을 하면 국소적으로 함수값을 줄일 수 있습니다. | 2차원 Gradient의 방향 |
| 6 | [확률변수와 확률분포](./index.html#/lesson/probability) | 이산 확률의 합은 1이고 연속 확률은 밀도의 적분으로 구합니다. 기댓값은 결과를 확률로 가중한 평균입니다. | 동전 결과의 평균과 퍼짐 |
| 7 | [통계와 추정](./index.html#/lesson/statistics) | 표본으로 모집단의 특성을 추정합니다. 분산·공분산과 신뢰구간에는 표본 수와 가정이 중요합니다. | 표본평균·분산·표준오차 |
| 8 | [조건부확률 · 베이즈 · MLE·MAP](./index.html#/lesson/bayes) | 사후확률은 사전확률과 자료의 가능도를 결합합니다. MLE는 가능도, MAP은 사전분포까지 포함해 파라미터를 추정합니다. | 양성 집단 안의 진짜 양성 |
| 9 | [엔트로피 · 교차엔트로피 · KL](./index.html#/lesson/information-theory) | 엔트로피는 분포의 불확실성입니다. 교차엔트로피는 다른 분포로 부호화하는 비용이며 KL은 두 비용의 차이입니다. | 이진 분포의 H·CE·KL |

### 파이토치

텐서를 만들고, 모델을 쓰고, 학습을 실행합니다. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [Tensor 기초](./index.html#/lesson/torch-tensors) | Tensor의 shape·dtype·device는 계산 가능한 형태를 결정합니다. 정수 ID,실수 feature,같은 device의 파라미터를 구분합니다. | Shape와 dtype의 저장량 |
| 2 | [Tensor 연산과 축](./index.html#/lesson/torch-operations) | matmul과 원소별 곱을 구분합니다. view는 stride 호환 조건이 있고 reshape는 필요하면 복사할 수 있습니다. | 원소별 곱과 행렬곱 비교 |
| 3 | [nn.Module과 모델 작성](./index.html#/lesson/torch-module) | __init__에 하위 레이어를 등록하고 forward에 계산을 작성합니다. ModuleList는 등록된 목록이며 Sequential은 정해진 순서로 실행합니다. | 등록한 두 Linear의 파라미터 |
| 4 | [nn과 functional](./index.html#/lesson/torch-functional) | nn.Module은 파라미터·버퍼·학습 모드 등을 관리합니다. functional 함수에는 필요한 상태·파라미터를 직접 전달합니다. | F.linear에 전달하는 Weight 방향 |
| 5 | [Autograd와 Gradient 누적](./index.html#/lesson/torch-autograd) | requires_grad가 있는 연산으로 계산 그래프를 만듭니다. backward는 gradient를 누적하고 detach는 해당 결과의 그래프 연결을 끊습니다. | 새 Forward의 backward가 누적하는 값 |
| 6 | [Dataset과 DataLoader](./index.html#/lesson/torch-data) | Dataset은 표본 조회를, DataLoader는 배치 구성·섞기·반복을 담당합니다. Transform은 입력을 모델에 맞게 바꿉니다. | 마지막 배치를 포함할까요? |
| 7 | [손실 함수와 정답 형식](./index.html#/lesson/torch-losses) | MSE는 연속 값, CrossEntropyLoss는 클래스 logits, BCEWithLogitsLoss는 이진·독립 레이블 logits에 대응합니다. | 정답 형식에 맞는 손실 |
| 8 | [학습 루프와 옵티마이저](./index.html#/lesson/torch-loop) | gradient 초기화,예측,손실,역전파,필요한 clipping,파라미터 갱신을 한 단계로 묶습니다. Scheduler의 호출 규칙은 종류에 따라 다릅니다. | 초기화·미분·갱신을 반복하기 |
| 9 | [학습 · 평가 · 추론 모드](./index.html#/lesson/torch-modes) | eval은 Dropout·BatchNorm 등의 동작을 바꾸며 자동미분을 끄지는 않습니다. no_grad·inference_mode는 gradient 기록을 제어합니다. | Module 모드와 미분 기록의 두 스위치 |
| 10 | [저장 · 복원 · 재현성 · 디버깅](./index.html#/lesson/torch-checkpoints) | state_dict에는 등록된 파라미터와 지속 버퍼가 들어갑니다. 학습 재개에는 옵티마이저·스케줄·단계 등도 필요할 수 있습니다. | Momentum 상태까지 복원하기 |

### 모델설계학습

차원을 맞추고, 학습을 안정화하고, 제대로 평가합니다. 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
| 1 | [학습 방식 지도](./index.html#/lesson/learning-paradigms) | 지도·비지도·자기지도·준지도·강화학습은 학습 신호의 출처를 구분합니다. 모델 구조 하나가 여러 방식으로 사용될 수 있습니다. | 학습 신호는 어디에서 올까요? |
| 2 | [텐서와 축의 의미](./index.html#/lesson/tensor-axes) | Batch·Channel·공간·시간·Feature 축을 구분합니다. 숫자상 shape가 같아도 축의 의미가 다르면 잘못된 계산일 수 있습니다. | 같은 표에서 평균을 낼 축 선택 |
| 3 | [레이어 차원과 모델 설계 계산기](./index.html#/lesson/shape-design) | 레이어를 연결하며 공간 크기와 feature 수를 추적합니다. Concat·Residual 조건,Conv·Pool 출력,Flatten 이후 Linear 입력을 확인합니다. | Conv→Pool→Flatten의 차원 추적 |
| 4 | [파라미터와 메모리 비용](./index.html#/lesson/model-cost) | 파라미터·활성값·gradient·옵티마이저 상태를 나누어 비용을 추정합니다. 학습 메모리는 가중치만의 크기보다 큽니다. | 가중치 밖의 학습 저장량 |
| 5 | [차원의 저주](./index.html#/lesson/curse-dimensionality) | 차원이 늘면 같은 표본 수가 공간을 덜 채우며 거리 기반 판단이 약해질 수 있습니다. 데이터의 실제 내재 차원도 중요합니다. | 공간을 채우는 데 필요한 격자 수 |
| 6 | [가중치 초기화](./index.html#/lesson/initialization) | 입출력 연결 수에 맞춰 초기 분산을 조절해 깊은 층의 신호 크기를 관리합니다. 활성화와 fan-in·fan-out에 맞는 방식을 선택합니다. | 연결 수에 맞춘 초기 분산 |
| 7 | [기울기 폭발 · 소실 · Clipping](./index.html#/lesson/training-stability) | 역전파에서 Jacobian이 반복 곱해져 기울기가 커지거나 작아질 수 있습니다. 큰 학습률은 별도로 파라미터 발산을 유발할 수 있습니다. | Gradient 방향을 유지하는 Norm clipping |
| 8 | [SGD · Momentum · RMSProp · AdamW](./index.html#/lesson/optimizers) | 학습률과 이동평균으로 업데이트 방향·크기를 조절합니다. AdamW는 적응적 gradient 업데이트와 weight decay를 분리합니다. | 같은 Gradient에 다른 갱신 규칙 |
| 9 | [학습률 · Warmup · Scheduler](./index.html#/lesson/learning-rate) | 학습률은 업데이트 크기를 결정합니다. Warmup은 시작 구간에서 키우고 Decay는 후반의 크기를 줄이는 전략입니다. | 학습률 경로가 만드는 실제 반복 |
| 10 | [입력 스케일 · 수치 안정성 · AMP](./index.html#/lesson/numerical-stability) | 입력 스케일은 최적화 조건에 영향을 줍니다. 큰 exp의 overflow,작은 값의 underflow,낮은 정밀도의 범위를 관리합니다. | 큰 Logit에서 직접 exp와 안정 계산 |
| 11 | [과적합 · 편향과 분산 · 규제](./index.html#/lesson/generalization) | 훈련 오차와 새로운 자료의 오차를 구분합니다. 복잡도·자료 양·L1/L2·Dropout·Early stopping을 검증 자료로 선택합니다. | 훈련 점과 새 점의 오차를 직접 계산 |
| 12 | [데이터 분할 · 교차검증 · 누수](./index.html#/lesson/validation-leakage) | 검증·테스트 정보가 학습과 전처리에 들어가면 평가가 낙관적으로 변합니다. 시간·사용자 등 데이터 생성 단위에 맞게 분할합니다. | 평균을 어디에서 fit했나요? |
| 13 | [평가 지표 · 임계값 · 불균형](./index.html#/lesson/metrics-imbalance) | Accuracy,Precision,Recall,F1과 ROC·PR은 다른 질문에 답합니다. 클래스 비율·오탐 비용에 따라 임계값을 선택합니다. | 혼동행렬에서 지표를 읽기 |
| 14 | [확률 보정 · 불확실성 · 진단](./index.html#/lesson/calibration-debugging) | 높은 확률이 실제 높은 정답률에 대응하는지 확인합니다. 학습 곡선과 활성값·gradient 분포로 계산·최적화 오류를 찾습니다. | 확률과 실제 양성 비율을 비교하기 |
| 15 | [전이학습과 Fine-tuning 설계](./index.html#/lesson/transfer-learning) | 사전학습한 표현을 재사용하고 일부 층을 고정하거나 전체를 조절합니다. 목표 데이터와 기반 모델의 차이에 맞게 선택합니다. | 고정할 파라미터와 Module 모드 |

### Transformer

기존 HTML을 iframe·HTML 주입 없이 React 컴포넌트와 상태로 이식했습니다. 아래 영역은 모두 한 본문에 펼쳐져 있습니다.

| 본문 영역 | 개념과 수식 해설 | 직접 해볼 실험 |
| :--- | :--- | :--- |
| 전체 구조 | 토큰·표현·logit, Encoder–Decoder, Decoder-only, Cross-attention, Post/Pre-LN | 구조 전환, 레이어 선택 |
| Self-attention·QKV | 세 역할, 내적·스케일·행별 확률·Value 가중합·causal mask | X 셀·Query 드래그, 키보드, 토큰·셀 선택, 온도·마스크 |
| Multi-head | head별 차원과 투영, Concat, 출력 weight의 의미 | 1·2·4개 head, head별 Q·K·V·출력 비교 |
| 블록 내부 | 위치 sin·cos, Residual 직접 경로, LayerNorm 평균·분산, 비선형 FFN | 위치·차원 쌍, 정규화 입력·강도, ReLU/GELU; 세 실험 모두 표시 |
| KV 캐시 | Prefill/Decode, 과거 K·V가 유지되는 조건, cache shape·메모리 | 증분 토큰 처리·재생·초기화, 출력 동일성·투영 수 비교 |

고정된 작은 입력·weight로 계산합니다. 언어적 의미·실제 생성 품질·실행 속도를 재현하지 않습니다. KV 계산 절약은 투영 벡터 수 기준이며 메모리 계산의 배치·층·head·원소 크기를 표시합니다.

### 모델 설계 계산기

Conv2d·MaxPool2d·Flatten·Linear·ReLU·Residual Add·Concat 레이어를 추가·삭제하고 설정을 바꿉니다. 각 레이어의 shape·Bias 포함 파라미터·FP32 가중치 저장량을 계산하고 연결 오류를 표시합니다. 분기 없는 모델은 Sequential 코드를 생성하며 분기는 forward 구현 필요성을 명시합니다. Conv는 groups=1, 정사각 커널, Pool은 ceil_mode=False입니다. 실제 PyTorch 실행기·GPU 메모리 측정기는 아닙니다.

### 공통 실험 읽는 법

각 입력을 바꾸면 결과와 수치 대입 과정이 다시 계산됩니다. 가로축 입력·세로축 결과를 선택하면 **다른 입력을 현재 값으로 고정한** 계산 곡선을 볼 수 있습니다. 연결선은 표본 계산을 이어 그린 것으로 이산 선택의 중간 의미나 학습 성능을 나타내지 않습니다. 막대 길이는 절댓값, 주황색은 음수입니다. 표시값은 반올림하므로 작은 값이 0처럼 보일 수 있고, 정의할 수 없는 결과는 미정의로 표시합니다.

## 조작 방법

- 카테고리·학습 방식·페이지를 고르고 본문을 아래로 읽습니다.
- 슬라이더·선택으로 입력과 비교 항목을 변경하고 현재 계산을 확인합니다.
- Transformer 입력 셀은 위아래 드래그나 ↑/↓로, Query·벡터는 평면 드래그로 조절합니다.
- Tab으로 컨트롤을 이동하며 슬라이더는 방향키를 지원합니다.
- 모바일에서 메뉴 버튼으로 카테고리를 열고, 큰 행렬·코드는 해당 영역 안에서 가로 스크롤합니다.
- 확인 문제에 먼저 답한 뒤 해설을 펼쳐 비교합니다. 학습 완료는 직접 표시합니다.

## 검증

```bash
npm test
npm run build
node scripts/readme.mjs
```

230개 검증은 전체 93개 설명의 존재와 구성, 92개 계산 모델의 입력 경계·유한 값, Softmax·책임도 정규화, 투영 직교성·미분, k-means 목적함수, PCA 복원, 다항 회귀·과적합 예제, clipping, Q-learning·SARSA·PPO, 안정 Softmax, PyTorch 누적·모드, 검색·실행 예산, LoRA·레이어 파라미터를 확인합니다. 기존 Transformer·차원 계산 검증과 선수 지식 순환 검사도 포함합니다. 320px 모바일에서 전체 93개 페이지의 본문·실험 표시와 페이지 가로 넘침을 브라우저로 검사했습니다. 로컬 파일 직접 실행은 이 앱 브라우저의 제한으로 확인하지 못했습니다.

## 저장소 구조

```text
ml-atlas/
├── src/
│   ├── App.tsx                     # 홈·목차·개인 기록·주제 라우팅
│   ├── main.tsx
│   ├── styles.css                  # 라이트모드·모바일·긴 본문
│   ├── data/
│   │   ├── curriculum.ts           # 순서·수식·차원·원문 링크
│   │   └── lessons/
│   │       ├── types.ts            # 정의·해설·예제의 구조
│   │       ├── glossary.ts         # 입문 용어·표기
│   │       ├── index.ts
│   │       ├── math.ts
│   │       ├── dl.ts
│   │       ├── ml.ts
│   │       ├── rl.ts
│   │       ├── llm.ts
│   │       ├── pytorch.ts
│   │       └── design.ts
│   ├── components/
│   │   ├── LessonReading.tsx       # 연속 본문·확인 문제
│   │   ├── TopicExperiment.tsx     # 입력·수치 대입·결과 곡선
│   │   ├── TopicScene.tsx          # 기하·군집·밀도 시각화
│   │   ├── Transformer.tsx         # Transformer 연속 실험
│   │   ├── TransformerExplanation.tsx
│   │   ├── NormalizationLab.tsx    # BN·LN 축과 모드 비교
│   │   ├── PyTorchGuide.tsx        # 10개 주제의 코드와 해설
│   │   ├── Labs.tsx                # 드래그·레이어·검색·GAN 등
│   │   └── UI.tsx
│   └── lib/
│       ├── lessonModelTypes.ts
│       ├── lessonModels.ts        # 92개 수치·규칙 계산 모델
│       ├── mathModels.ts
│       ├── dlModels.ts
│       ├── mlModels.ts
│       ├── rlModels.ts
│       ├── llmModels.ts
│       ├── pytorchModels.ts
│       ├── designModels.ts
│       ├── math.ts
│       ├── transformer.ts
│       ├── shapes.ts
│       ├── experiments.ts
│       ├── lessons.test.ts        # 전체 설명·주제 수치 검증
│       └── math.test.ts           # Transformer·기존 계산 검증
├── transformer/index.html         # 기존 주소 호환 이동
├── scripts/
│   ├── compat.mjs                 # 단일 파일 빌드
│   └── readme.mjs                 # 구현 목록에서 README 생성
├── index.html                     # 개발용 진입점
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── AGENTS.md
├── LICENSE                        # 코드: Apache License 2.0
├── LICENSE-CONTENT                # 학습 콘텐츠: CC BY 4.0
├── LICENSING.md                   # 적용 범위·저작자 표시 안내
├── NOTICE                         # 저작권·출처 고지
└── README.md
```

## 작성 원칙

1. 설명·계산·실험을 주제별로 작성하고 단순화한 가정을 밝힙니다.
2. 정의와 수식 기호를 먼저 설명하고 숫자를 대입해 계산을 연결합니다.
3. 본문은 세로로 이어지며 주요 설명을 탭이나 챕터에 숨기지 않습니다.
4. 실제 학습된 모델·서비스 호출을 가장하지 않습니다. 구현한 실험 범위만 기록합니다.
5. 새 페이지와 설명·실험 변경은 README·관련 수치 검증을 함께 갱신합니다.
6. 원문 참고 링크와 라이트모드·모바일·키보드 대안을 유지합니다.

## 참고 자료

- [Hugging Face — LLM course](https://huggingface.co/learn/llm-course/chapter1/1)
- [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)
- [LoRA](https://arxiv.org/abs/2106.09685)
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
- [OWL 2 Primer — W3C](https://www.w3.org/TR/owl2-primer/)
- [Microsoft GraphRAG](https://microsoft.github.io/graphrag/)
- [LLM Wiki — Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Effective harnesses — Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Deep Learning — Goodfellow, Bengio, Courville](https://www.deeplearningbook.org/)
- [PyTorch — BatchNorm1d](https://docs.pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html)
- [PyTorch — LayerNorm](https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)
- [Generative Adversarial Networks](https://arxiv.org/abs/1406.2661)
- [Wasserstein GAN](https://arxiv.org/abs/1701.07875)
- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [SimCLR](https://arxiv.org/abs/2002.05709)
- [scikit-learn — User guide](https://scikit-learn.org/stable/user_guide.html)
- [Sutton & Barto — Reinforcement Learning](http://incompleteideas.net/book/the-book-2nd.html)
- [Proximal Policy Optimization](https://arxiv.org/abs/1707.06347)
- [Mathematics for Machine Learning — authors’ textbook](https://mml-book.github.io/)
- [PyTorch — Learn the basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html)
- [PyTorch — Serialization semantics](https://docs.pytorch.org/docs/stable/notes/serialization.html)
- [Deep Learning — Practical methodology](https://www.deeplearningbook.org/contents/guidelines.html)
- [PyTorch — Reasoning about shapes](https://docs.pytorch.org/tutorials/recipes/recipes/reasoning_about_shapes.html)
- [Hugging Face — KV cache](https://huggingface.co/docs/transformers/en/cache_explanation)
- [PyTorch — Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)

## 라이선스

Copyright © 2026 aidevksh and contributors.

- **코드·학습용 코드 예제**: [Apache License 2.0](./LICENSE).
- **학습 글·그림·도식 및 README의 설명**: [CC BY 4.0](./LICENSE-CONTENT). 상업적 이용·판매·수정·재배포를 허용하며, 공유할 때 저작자·원본·라이선스 및 변경 여부 등을 표시합니다.

코드와 설명이 같은 소스 파일에 들어 있는 경우의 구분, 저작자 표시 예시 및 외부 자료의 취급은 [라이선스 적용 범위](./LICENSING.md)를 참고하세요. 빌드 결과에도 라이선스와 [출처 고지](./NOTICE)를 포함합니다.
