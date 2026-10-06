import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/data/curriculum.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { categories, curriculum } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const models = {};
for (const file of ['math','dl','ml','rl','llm','pytorch','design']) {
  const text = await readFile(`src/lib/${file}Models.ts`, 'utf8');
  for (const match of text.matchAll(/^\s*(?:'([^']+)'|([a-z][\w-]*))\s*:\s*(?:model|base)\('([^']+)'|^\s*(?:'([^']+)'|([a-z][\w-]*))\s*:\s*\{\s*title\s*:\s*'([^']+)'/gm)) {
    models[match[1] || match[2] || match[4] || match[5]] = match[3] || match[6];
  }
}
models.transformer = 'QKV·멀티 헤드·위치·정규화·FFN·KV 캐시';
for (const topic of curriculum) if (!models[topic.id]) throw new Error(`README missing experiment: ${topic.id}`);
const anchor = c => ({dl:'dl-deep-learning',ml:'ml-machine-learning',rl:'강화학습',math:'수학',pytorch:'파이토치',design:'모델설계학습'}[c.id] || c.id);
const escape = value => value.replaceAll('|','∣');
const sections = categories.map(c => `### ${c.name}

${c.description} 모든 페이지에 정의·작동 과정·기호 해설·손 계산·수치 실험·오해 설명·확인 문제가 있습니다.

| 순서 | 학습 페이지 | 설명하는 내용 | 주제별 계산·실험 |
| :--- | :--- | :--- | :--- |
${curriculum.filter(t=>t.category===c.id).map((t,i)=>`| ${i+1} | [${t.title}](./index.html#/lesson/${t.id}) | ${escape(t.summary)} | ${escape(models[t.id])} |`).join('\n')}`).join('\n\n');
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

TypeScript·React로 구현한 라이트모드 반응형 학습 사이트입니다. **93개 페이지 모두** 주제별 설명과 계산 실험을 제공합니다. 각 페이지는 동기·정의 → 작동 과정 → 수식·기호 → 계산 예제 → 시각화·실험 → 오해 설명·확인 문제 순서로 **세로로 이어집니다.** 챕터 전환 없이 본문을 읽으며, 참고 용어와 확인 문제의 해설은 필요할 때 펼칠 수 있습니다.

92개 주제에는 각각의 수치·규칙 계산 모델과 입력별 결과 곡선이 있고, Transformer는 행렬·드래그·블록·캐시 실험을 제공합니다. 벡터 투영·변환 격자·접선과 할선·회귀 잔차·군집 위치·PCA 복원·밀도 곡선·신경망 순전파·이웃 메시지·그래프 hop·Ontology 타입 추론은 해당 계산을 직접 그립니다. BatchNorm·LayerNorm의 통계 축 비교, 파이토치 10개 주제의 코드 예제, 레이어 편집기 등 추가 실험도 연결합니다. **작은 계산 예제는 명시한 가정에서 동작하며 실제 학습 모델의 성능이나 LLM 응답을 재현하지 않습니다.** 여러 방법을 함께 다루는 페이지는 본문에서 차이를 설명하고 실험의 구현 범위를 밝힙니다.

카테고리 순서는 **LLM → DL → ML → 강화학습 → 수학 → 파이토치 → 모델설계학습**입니다. 화면에는 DL (Deep Learning), ML (Machine Learning)으로 약어의 뜻을 함께 표시합니다. 카테고리 안은 기초에서 응용으로 이어지고 관련 선수 지식을 링크합니다. 검색·학습 방식 필터·북마크·완료 표시·마지막 페이지 이어 읽기를 지원합니다.

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

\`\`\`bash
npm test
npm run build
node scripts/readme.mjs
\`\`\`

230개 검증은 전체 93개 설명의 존재와 구성, 92개 계산 모델의 입력 경계·유한 값, Softmax·책임도 정규화, 투영 직교성·미분, k-means 목적함수, PCA 복원, 다항 회귀·과적합 예제, clipping, Q-learning·SARSA·PPO, 안정 Softmax, PyTorch 누적·모드, 검색·실행 예산, LoRA·레이어 파라미터를 확인합니다. 기존 Transformer·차원 계산 검증과 선수 지식 순환 검사도 포함합니다. 320px 모바일에서 전체 93개 페이지의 본문·실험 표시와 페이지 가로 넘침을 브라우저로 검사했습니다. 로컬 파일 직접 실행은 이 앱 브라우저의 제한으로 확인하지 못했습니다.

## 저장소 구조

\`\`\`text
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
