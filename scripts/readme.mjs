import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/data/curriculum.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { categories, curriculum, learningTrails } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const models = {};
for (const file of ['math','dl','ml','rl','llm','pytorch','design','cs']) {
  const text = await readFile(`src/lib/${file}Models.ts`, 'utf8');
  for (const match of text.matchAll(/^\s*(?:'([^']+)'|([a-z][\w-]*))\s*:\s*(?:model|base)\('([^']+)'|^\s*(?:'([^']+)'|([a-z][\w-]*))\s*:\s*\{\s*title\s*:\s*'([^']+)'/gm)) {
    models[match[1] || match[2] || match[4] || match[5]] = match[3] || match[6];
  }
}
models['neural-network'] += ' · 1→2→1 배치 SGD 반복·손실·예측 곡선';
models['torch-loop'] += ' · 7개 파라미터 단계별 반복 학습';
models.activation += ' · 6개 해석적 미분·미분 전개·상류 gradient';
models.softmax += ' · 몫 규칙·3×3 야코비안·확률과 미분 곡선';
models['cross-entropy'] += ' · p−y 전개·CE 접선·소프트 정답·logit 업데이트·BCE 미분';
models['torch-losses'] += ' · Softmax→CE→출력층 역전파';
models.transformer = 'QKV·멀티 헤드·위치·정규화·FFN·KV 캐시';
for (const topic of curriculum) if (!models[topic.id]) throw new Error(`README missing experiment: ${topic.id}`);
const anchor = c => ({dl:'dl-deep-learning',ml:'ml-machine-learning',rl:'rl-reinforcement-learning',math:'수학',pytorch:'파이토치',design:'모델설계학습',cs:'cs-computer-science'}[c.id] || c.id);
const escape = value => value.replaceAll('|','∣');
const sections = categories.map(c => `### ${c.name}

${c.description} 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 수식·연결 보강 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- | :--- |
${curriculum.filter(t=>t.category===c.id).map((t,i)=>`| ${i+1} | [${t.title}](./index.html#/lesson/${t.id}) | ${escape(t.summary)} | ${escape(t.expansion.explanation)} | ${escape(models[t.id])} |`).join('\n')}`).join('\n\n');
const csDetails=curriculum.filter(t=>t.category==='cs').map(t=>`#### ${t.title}\n\n[학습 페이지](./index.html#/lesson/${t.id}) · ${t.tags.join(' · ')}\n\n${t.expansion.explanation}\n\n${'```text'}\n${t.expansion.formula}\n${'```'}\n\n- 작은 예제: ${t.example}\n- 구현한 계산: ${models[t.id]}\n`).join('\n');
const refs = [...new Map(curriculum.flatMap(t=>t.references).map(ref=>[ref.url,ref])).values()];
const readme = `<div align="center">

# ML Atlas

**수식으로 이해하고, 시각화로 탐색하는 머신러닝 지도.**

LLM부터 수학까지, 개념을 작은 계산과 직접 움직이는 실험으로 연결합니다.<br>정의부터 차근차근 읽고, 수식을 풀어보고, 숫자가 바뀌는 과정을 확인하세요.

[학습 목차](#학습-목차) · [시작하기](#시작하기) · [Transformer](#transformer) · [참고 자료](#참고-자료)

</div>

## 이 프로젝트에서 할 수 있는 것

| 개념 이해 | 수식 해석 | 계산과 실험 |
| :--- | :--- | :--- |
| 왜 필요한지, 무엇인지, 어떻게 작동하는지 설명합니다. | 기호의 뜻과 입력·출력 차원을 풀어 읽습니다. | 손 계산과 슬라이더·선택·드래그 결과를 연결합니다. |

TypeScript·React로 구현한 라이트모드 반응형 학습 사이트입니다. **${curriculum.length}개 페이지 모두** 주제별 설명과 계산 실험을 제공합니다. 각 페이지는 동기·정의 → 작동 과정 → 수식·기호 → 계산 예제 → 시각화·실험 → 오해 설명·확인 문제 순서로 **세로로 이어집니다.** 챕터 전환 없이 본문을 읽으며, 참고 용어와 확인 문제의 해설은 필요할 때 펼칠 수 있습니다.

${curriculum.length-1}개 주제에는 각각의 수치·규칙 계산 모델과 입력별 결과 그래프이 있고, Transformer는 행렬·드래그·블록·캐시 실험을 제공합니다. 벡터 투영·변환 격자·접선과 할선·회귀 잔차·군집 위치·PCA 복원·밀도 곡선·신경망 순전파·이웃 메시지·그래프 hop·Ontology 타입 추론은 해당 계산을 직접 그립니다. CS의 BFS·DFS 그래프, 방향 가중 경로, min-heap, 누적합 구간, 자동미분 DAG도 계산에 따라 그립니다. BatchNorm·LayerNorm의 통계 축 비교, 파이토치 10개 주제의 코드 예제, 레이어 편집기 등 추가 실험도 연결합니다. **작은 계산 예제는 명시한 가정에서 동작하며 실제 학습 모델의 성능이나 LLM 응답을 재현하지 않습니다.** 여러 방법을 함께 다루는 페이지는 본문에서 차이를 설명하고 실험의 구현 범위를 밝힙니다.

카테고리 순서는 **LLM → DL → ML → RL → 수학 → 파이토치 → 모델설계학습 → CS**입니다. 화면에는 DL (Deep Learning), ML (Machine Learning), RL (Reinforcement Learning)으로 약어의 뜻을 함께 표시합니다. CS (Computer Science)에는 코딩테스트와 딥러닝 개발을 연결하는 15개 알고리즘 주제가 있습니다. 카테고리 안은 기초에서 응용으로 이어지며, 표시 순서와 실제 선수 지식은 구별합니다. 검색·학습 방식 필터·북마크·완료 표시·마지막 페이지 이어 읽기를 지원합니다.

모든 페이지에 수식·연산 전개를 추가했습니다. 본문 개념 링크, 설명이 있는 ${learningTrails.length}개 학습 흐름, 선수 지식·학습 흐름의 양방향 역링크와 [개념 연결 지도](./index.html#/graph)를 제공합니다. 신경망·PyTorch 학습 루프에는 순전파 → 손실 → 역전파 → 파라미터 갱신을 단계별·자동·20회 단위로 실행하는 실험이 있습니다. 활성화 6종은 해석적 미분·전개 과정·함수와 미분의 비교 그래프·상류 gradient 전달을 제공합니다. ReLU 계열의 0은 미분 없음, GELU는 tanh 근사임을 표시합니다.

[Softmax](./index.html#/lesson/softmax)와 [크로스 엔트로피](./index.html#/lesson/cross-entropy)는 몫 규칙의 두 경우 → 야코비안 → 확률 미분 −y/p → 연쇄법칙의 합 → logit 미분 (p−y)/τ → 배치 평균·출력층 가중치 갱신을 연결합니다. 세 logits·정답·온도·label smoothing을 조절하고, 야코비안 칸을 선택해 확률과 미분 곡선을 비교합니다. CE 손실의 접선과 미분, 국소 logit 업데이트, 이진 Sigmoid+BCE의 미분도 계산합니다. 클래스 가중치·ignore가 없는 한 표본 실험이며 실제 신경망 학습은 별도 페이지에서 다룹니다.

미분 설명은 개발자의 [소프트맥스 몫 규칙](https://velog.io/@aidevksh/소프트맥스-미분-몫-규칙), [소프트맥스와 크로스 엔트로피](https://velog.io/@aidevksh/소프트맥스와-크로스-엔트로피-미분), [MSE·Cross-Entropy](https://velog.io/@aidevksh/MSE-Cross-Entropy), Sigmoid·tanh·ReLU 글을 참고해 재구성했습니다. Sigmoid 글의 중간 전개는 d(e⁻ˣ)/dx=−e⁻ˣ의 부호를 바로잡았고, p−y가 확률 자체가 아닌 logit의 미분임을 명시했습니다. 공식 문서와 수치 미분으로 검산했으며 각 페이지의 참고 링크에서 원문을 볼 수 있습니다.

브랜드·카테고리 아이콘은 폰트에 의존하지 않는 SVG입니다. LLM은 텍스트 말풍선, DL은 단순한 층별 노드, ML은 산점도와 회귀선, RL은 보상과 순환 화살표로 표현합니다. 홈 지도에는 중첩 SVG 없이 도형을 직접 배치합니다. 보라색 브랜드 로고와 SVG·32px PNG 파비콘·180px Apple touch 아이콘은 같은 5개 노드·4개 연결을 사용하며 [공통 도형 데이터](./src/data/brand.ts)에서 생성합니다. 푸터의 **사이트 정보** 대화상자에는 [개발자 메일](mailto:aidevksh@gmail.com), [GitHub](https://github.com/aidevksh), [블로그](https://ksh.ai.kr), 라이선스를 표시합니다.

콘텐츠는 버전 관리하는 TypeScript 데이터입니다. 현재의 정적 학습 사이트에는 서버 DB가 필요하지 않습니다. 개인 기록은 이 브라우저의 localStorage에 저장합니다. 로그인·서버 DB·기기 간 동기화는 없으며 저장소가 차단되어도 학습 기능은 동작합니다.

## 시작하기

Node.js 22.12 이상(또는 Vite가 지원하는 20.19 이상)이 필요합니다.

\`\`\`bash
npm ci
npm run dev
\`\`\`

터미널의 로컬 URL을 엽니다. 포트 5173이 비어 있으면 [학습 지도](http://127.0.0.1:5173/)에서 시작합니다.

\`\`\`bash
npm run build
npm run preview
\`\`\`

빌드한 \`dist/index.html\`은 JS·CSS를 포함하는 단일 파일입니다. 파일 직접 열기를 지원하도록 구성했으며 브라우저의 로컬 파일·저장소 정책에 따라 동작이 다를 수 있습니다. 소스 \`index.html\`은 Vite 개발 서버에서 엽니다. 정적 호스팅에는 \`dist/\`를 배포합니다. hash 라우팅으로 별도 서버 rewrite 없이 주제 링크가 동작합니다. 기존 \`transformer/index.html\`과 \`#attention\` 등의 링크는 React의 연속 본문으로 이동합니다.

## 학습 목차

<!-- TOPICS:START -->
| 카테고리 | 페이지 수 | 구현한 학습 내용 |
| :--- | :--- | :--- |
${categories.map(c=>`| [${c.name}](#${anchor(c)}) | ${curriculum.filter(t=>t.category===c.id).length} | ${c.description} |`).join('\n')}
<!-- TOPICS:END -->

${sections}

### CS 주제별 범위

그래프·거리·문자열 알고리즘은 작은 고정 입력에서 실행하며, 복잡도·저장량 계산은 초 단위 벤치마크와 구별합니다. 배열·스택·큐·해시, Trie와 투 포인터의 이론을 설명하지만 해당 페이지의 계산 실험은 제목과 가정에 표시한 범위만 구현합니다.

${csDetails}

### Softmax와 크로스 엔트로피 미분

[Softmax 학습 페이지](./index.html#/lesson/softmax) · [크로스 엔트로피 학습 페이지](./index.html#/lesson/cross-entropy)

| 단계 | 설명과 수식 | 계산·시각화 |
| :--- | :--- | :--- |
| Softmax의 몫 규칙 | 자기 점수 pᵢ(1−pᵢ)/τ, 다른 점수 −pᵢpⱼ/τ를 각각 유도 | 3×3 야코비안 선택, 양·음 미분과 열 합 0 |
| 확률의 변화율 | J=(diag(p)−ppᵀ)/τ | 선택한 logit에 대한 확률·해석적 미분 곡선과 접선 |
| CE와 음의 로그우도 | 독립 표본의 확률 곱 → 로그 합, L=−Σy log p | one-hot 정답 변경, 정답 확률과 손실 |
| 확률에서 logit으로 | ∂L/∂p=−y/p, 모든 클래스 경로의 합으로 ∂L/∂z=(p−y)/τ | 두 미분의 수치 표, CE 손실·미분 곡선과 접선 |
| 소프트 정답·온도 | y=(1−ε)one-hot+ε/C, Σy=1에서 같은 미분식 | 온도·smoothing 슬라이더, 목표 분포와 gradient 재계산 |
| 출력층 갱신 | G=(P−Y)/(Bτ), ∂L̄/∂W=XᵀG, ∂L̄/∂X=GWᵀ | logits의 국소 경사하강 한 단계와 새 손실; 실제 가중치 갱신은 신경망 학습 실험에 연결 |
| 수치 안정성 | log-softmax와 LogSumExp, 확률 underflow와 손실 계산의 구분 | 안정 log 확률로 모든 CE 수치 계산 |
| 이진 BCE | Sigmoid 미분과 BCE의 분모 상쇄 → p−y | 이진 정답·logit 변경, BCE 손실·미분 곡선 |

z=[2,1,0], y=[1,0,0], τ=1일 때 p≈[0.665241,0.244728,0.090031], L≈0.407606입니다. 확률 미분은 [−1.503215,0,0], logit 미분은 [−0.334759,0.244728,0.090031]입니다. η=0.2로 logits를 한 번 직접 이동하면 새 손실은 약 0.3729로 낮아집니다. 이 국소 이동은 실제 모델의 가중치 학습과 구분하며, 클래스 가중치·ignore·weighted reduction은 별도 수식으로 설명합니다.

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

각 입력을 바꾸면 결과와 수치 대입 과정이 다시 계산됩니다. 가로축 입력·세로축 결과를 선택하면 **다른 입력을 현재 값으로 고정한** 계산 곡선을 볼 수 있습니다. 연속 입력은 표본을 선으로 잇고 선택·정수 입력은 점으로 표시합니다. 그래프는 선택한 계산 관계이며 학습 성능을 예측하지 않습니다. 막대 길이는 절댓값, 주황색은 음수입니다. 표시값은 반올림하므로 작은 값이 0처럼 보일 수 있고, 정의할 수 없는 결과는 미정의로 표시합니다.

## 조작 방법

- 카테고리·학습 방식·페이지를 고르고 본문을 아래로 읽습니다.
- 본문의 개념 링크와 하단 학습 흐름·역링크, 개념 연결 지도로 이동합니다.
- 신경망 학습 실험의 다음 단계·자동 반복·20회 업데이트로 손실과 7개 파라미터 변화를 봅니다.
- 푸터의 사이트 정보는 Escape·닫기 버튼·배경 클릭으로 닫습니다.
- 슬라이더·선택으로 입력과 비교 항목을 변경하고 현재 계산을 확인합니다.
- Transformer 입력 셀은 위아래 드래그나 ↑/↓로, Query·벡터는 평면 드래그로 조절합니다.
- Tab으로 컨트롤을 이동하며 슬라이더는 방향키를 지원합니다.
- 모바일에서 메뉴 버튼으로 카테고리를 열고, 큰 행렬·코드는 해당 영역 안에서 가로 스크롤합니다.
- 확인 문제에 먼저 답한 뒤 해설을 펼쳐 비교합니다. 학습 완료는 직접 표시합니다.

## 검증

\`\`\`bash
npm test
npm run build
node scripts/readme.mjs
\`\`\`

자동화 검증은 전체 ${curriculum.length}개 설명의 존재와 구성, ${curriculum.length-1}개 계산 모델의 입력 경계·유한 값, Softmax·책임도 정규화, 투영 직교성·미분, k-means 목적함수, PCA 복원, 다항 회귀·과적합 예제, clipping, Q-learning·SARSA·PPO, 안정 Softmax, PyTorch 누적·모드, 검색·실행 예산, LoRA·레이어 파라미터를 확인합니다. 기존 Transformer·차원 계산 검증과 선수 지식 순환 검사도 포함합니다. 활성화 6종과 신경망 파라미터 7개의 미분을 독립 중앙차분으로 비교하고, 실제 SGD 반복의 손실 감소·높은 학습률의 손실 증가를 확인합니다. Softmax 야코비안의 모든 원소와 CE·BCE의 logit 미분도 독립 중앙차분으로 확인하며, 열 합 0·소프트 정답·온도·underflow에 안정적인 손실·확신하며 틀린 출력의 gradient를 검증합니다. CS 정렬·lower_bound·BFS 거리·최단 경로 3종·heap invariant·KMP 겹침·MST·가지치기를 검증합니다. ${curriculum.length}개 페이지를 React로 정적 렌더링해 설명·연결과 SVG 좌표를 확인합니다. 홈 지도에는 중첩 SVG가 없음을 회귀 검사합니다. ${curriculum.length}개 노트의 수식 전개·학습 흐름·링크 대상과 선수 지식 순환도 검사합니다. 앱 브라우저에서 홈 지도·아이콘과 CE의 야코비안 선택·온도·smoothing·업데이트 후 손실 감소를 확인했고, 391px 모바일 viewport에서도 페이지 가로 넘침이 없음을 확인했습니다. 실제 iPhone Safari 검증은 별도로 필요합니다. file://용 해시 라우팅·단일 파일 빌드 구조는 유지합니다.

## 저장소 구조

\`\`\`text
ml-atlas/
├── src/
│   ├── App.tsx                     # 홈·목차·개인 기록·주제 라우팅
│   ├── main.tsx
│   ├── styles.css                  # 라이트모드·모바일·긴 본문
│   ├── data/
│   │   ├── brand.ts                # 로고·파비콘의 공통 도형
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
│   │       ├── design.ts
│   │       └── cs.ts              # 알고리즘 정의·예제·확인 문제
│   ├── components/
│   │   ├── LessonReading.tsx       # 연속 본문·확인 문제
│   │   ├── TopicExperiment.tsx     # 입력·수치 대입·결과 곡선
│   │   ├── CSScene.tsx            # BFS·경로·힙·누적합·계산 DAG
│   │   ├── TopicScene.tsx          # 기하·군집·밀도 시각화
│   │   ├── Transformer.tsx         # Transformer 연속 실험
│   │   ├── TransformerExplanation.tsx
│   │   ├── NormalizationLab.tsx    # BN·LN 축과 모드 비교
│   │   ├── PyTorchGuide.tsx        # 10개 주제의 코드와 해설
│   │   ├── Labs.tsx                # 드래그·레이어·검색·GAN 등
│   │   ├── ConceptConnections.tsx # 본문 링크·학습 흐름·역링크·지도
│   │   ├── TrainingLoop.tsx       # 단계별 실제 SGD 학습
│   │   ├── ActivationDerivation.tsx # 6종 미분 전개·곡선
│   │   ├── SoftmaxCrossEntropy.tsx # 야코비안·CE·BCE 미분·접선
│   │   ├── Brand.tsx              # 신경망 로고·SVG 아이콘
│   │   ├── AboutSite.tsx          # 개발자·링크·라이선스 팝업
│   │   └── UI.tsx
│   └── lib/
│       ├── lessonModelTypes.ts
│       ├── lessonModels.ts        # ${curriculum.length-1}개 수치·규칙 계산 모델
│       ├── mathModels.ts
│       ├── dlModels.ts
│       ├── mlModels.ts
│       ├── rlModels.ts
│       ├── llmModels.ts
│       ├── pytorchModels.ts
│       ├── designModels.ts
│       ├── csModels.ts            # 탐색·정렬·경로·힙·문자열
│       ├── conceptGraph.ts        # 본문 링크와 역링크의 동일 파싱
│       ├── rendering.test.tsx     # ${curriculum.length}개 페이지 React 렌더링
│       ├── classificationMath.ts  # 안정 CE·야코비안·BCE 미분
│       ├── classificationMath.test.ts # 독립 수치 미분·불변량
│       ├── learningMath.ts        # 해석적 미분·배치 역전파·SGD
│       ├── connections.test.ts    # 전개·연결·미분·알고리즘 검증
│       ├── math.ts
│       ├── transformer.ts
│       ├── shapes.ts
│       ├── experiments.ts
│       ├── lessons.test.ts        # 전체 설명·주제 수치 검증
│       └── math.test.ts           # Transformer·기존 계산 검증
├── public/                       # 신경망 SVG·PNG·Apple touch 아이콘
├── transformer/index.html         # 기존 주소 호환 이동
├── scripts/
│   ├── compat.mjs                 # 단일 파일 빌드
│   ├── icons.mjs                  # 같은 신경망 도형의 아이콘 재생성
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
\`\`\`

## 작성 원칙

1. 설명·계산·실험을 주제별로 작성하고 단순화한 가정을 밝힙니다.
2. 정의와 수식 기호를 먼저 설명하고 숫자를 대입해 계산을 연결합니다.
3. 본문은 세로로 이어지며 주요 설명을 탭이나 챕터에 숨기지 않습니다.
4. 실제 학습된 모델·서비스 호출을 가장하지 않습니다. 구현한 실험 범위만 기록합니다.
5. 새 페이지와 설명·실험 변경은 README·관련 수치 검증을 함께 갱신합니다.
6. 원문 참고 링크와 라이트모드·모바일·키보드 대안을 유지합니다.

## 참고 자료

${refs.map(ref=>`- [${ref.title}](${ref.url})`).join('\n')}
- [Hugging Face — KV cache](https://huggingface.co/docs/transformers/en/cache_explanation)
- [PyTorch — Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)

## 라이선스

Copyright © 2026 aidevksh and contributors.

- **코드·학습용 코드 예제**: [Apache License 2.0](./LICENSE).
- **학습 글·그림·도식 및 README의 설명**: [CC BY 4.0](./LICENSE-CONTENT). 상업적 이용·판매·수정·재배포를 허용하며, 공유할 때 저작자·원본·라이선스 및 변경 여부 등을 표시합니다.

코드와 설명이 같은 소스 파일에 들어 있는 경우의 구분, 저작자 표시 예시 및 외부 자료의 취급은 [라이선스 적용 범위](./LICENSING.md)를 참고하세요. 빌드 결과에도 라이선스와 [출처 고지](./NOTICE)를 포함합니다.
`;
await writeFile('README.md',readme);
console.log(`README updated: ${curriculum.length} lessons, ${Object.keys(models).length} experiments.`);
