<div align="center">

# ML Atlas

**수식으로 이해하고, 시각화로 탐색하는 머신러닝 지도.**

머신러닝의 핵심 이론을 작은 행렬과 직접 움직이는 실험으로 연결합니다.<br>
읽고, 드래그하고, 계산이 바뀌는 과정을 눈으로 확인하세요.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-7060cf?style=flat-square)](./LICENSE)
![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=20263a)

[학습 목차](#학습-목차) · [시작하기](#시작하기) · [작성 원칙](#작성-원칙) · [참고 자료](#참고-자료)

</div>

---

## 이 프로젝트에서 할 수 있는 것

| 수식 읽기 | 시각화 탐색 | 직접 실험 |
| :--- | :--- | :--- |
| 각 개념의 수식과 행렬 크기를 함께 확인합니다. | 레이어 구조, 히트맵, 벡터, 계산 흐름을 따라갑니다. | 드래그·슬라이더·버튼으로 값을 바꾸고 결과를 비교합니다. |

라이트모드 화면으로 구성하며, 각 주제의 HTML·CSS·JavaScript를 **하나의 HTML 파일**에 담습니다. 파일을 브라우저에서 바로 열어 학습할 수 있습니다.

## 학습 목차

<!-- TOPICS:START — 새 학습 주제를 추가할 때 이 목차와 아래 상세 내용을 함께 갱신합니다. -->
| 주제 | 다루는 핵심 이론 | 학습 파일 |
| :--- | :--- | :--- |
| [Transformer](#transformer) | 전체 구조 · QKV · 멀티 헤드 · 위치 인코딩 · Residual / LayerNorm · FFN · KV 캐시 | [transformer/index.html](./transformer/index.html) |
<!-- TOPICS:END -->

### Transformer

토큰이 문맥 정보를 모으고 다음 토큰을 예측하는 과정을 다섯 파트로 탐색합니다.

| 파트 | 주요 내용 | 직접 해볼 실험 |
| :--- | :--- | :--- |
| 전체 구조 | Encoder–Decoder, Decoder-only, Cross-attention, 학습과 생성 | 구조 전환, 레이어 클릭으로 역할·수식 확인 |
| Self-attention · QKV | 선형 투영, scaled dot-product, softmax, causal mask | 입력 행렬·Query 벡터 드래그, 마스크·온도 조절 |
| Multi-head attention | 헤드별 투영, Concat, 출력 투영 | 1·2·4개 헤드 전환, 헤드별 행렬 비교 |
| 블록 내부 | Sinusoidal 위치 인코딩, Residual, LayerNorm, FFN | 위치·차원 쌍 이동, 정규화 입력 변경, ReLU / GELU 비교 |
| KV 캐시 | Prefill / Decode, K·V 재사용, 메모리 비용 | 토큰별 처리, 누적 투영 계산량과 출력 동일성 비교 |

> 수치 예제는 학습된 언어 모델이 아닌, 계산 원리를 관찰하기 위한 작은 입력과 가중치를 사용합니다. KV 캐시 비교의 절약률은 K·V 투영 수를 기준으로 하며 실제 실행시간을 뜻하지 않습니다.

## 시작하기

### 바로 열기

```bash
git clone https://github.com/aidevksh/ml-atlas.git
cd ml-atlas
```

`transformer/index.html`을 브라우저에서 엽니다. 설치나 빌드 없이 사용할 수 있습니다.

### 로컬 서버로 열기

Python이 설치되어 있다면 저장소 루트에서 실행합니다.

```bash
python -m http.server 8080 --bind 127.0.0.1
```

[Transformer 열기](http://127.0.0.1:8080/transformer/)

### 조작 방법

- **클릭**: 학습 파트, 레이어, 토큰, 어텐션 셀, 헤드를 선택합니다.
- **드래그**: 입력 행렬 셀을 위아래로, Query 벡터의 보라색 점을 평면에서 움직입니다.
- **슬라이더**: 온도, 위치, 정규화 입력, FFN 입력, 캐시 메모리의 문맥 길이를 바꿉니다.
- **키보드**: `Tab`으로 이동하고, 입력 행렬 셀은 `↑` / `↓`로 값을 조절합니다.
- **초기화**: QKV 실험이나 KV 캐시 토큰 처리를 처음부터 다시 시작합니다.

## 저장소 구조

```text
ml-atlas/
├── transformer/
│   └── index.html     # Transformer: HTML + CSS + JavaScript
├── AGENTS.md          # 작업 규칙과 목차 유지 원칙
├── LICENSE            # Apache License 2.0
└── README.md          # 프로젝트 소개와 학습 목차
```

## 작성 원칙

1. **주제마다 한 파일**: `<topic>/index.html` 안에 HTML·CSS·JavaScript를 모두 작성합니다.
2. **라이트모드**: 모든 학습 화면에 같은 밝은 테마를 적용합니다.
3. **수식과 시각화 연결**: 기호, 행렬 크기, 화면의 값 사이 관계를 설명합니다.
4. **계산에 연결된 상호작용**: 값을 바꾸면 실제 계산 결과와 시각화가 함께 갱신됩니다.
5. **예제의 범위 명시**: 단순화한 가정과 실제 모델의 차이를 설명합니다.
6. **목차 함께 갱신**: 새 학습 주제를 추가하거나 기존 파트를 바꾸면 이 README의 학습 목차·상세 내용·저장소 구조도 함께 갱신합니다. 구현된 내용만 목차에 올립니다.

작업 시의 구체적인 규칙은 [AGENTS.md](./AGENTS.md)를 참고하세요.

## 참고 자료

- [Attention Is All You Need — Vaswani et al.](https://arxiv.org/abs/1706.03762): Transformer, attention, 위치 인코딩, FFN의 원 논문.
- [How caching works — Hugging Face](https://huggingface.co/docs/transformers/en/cache_explanation): KV 캐시의 동작과 메모리 구조.

## 라이선스

[Apache License 2.0](./LICENSE). 라이선스 조건에 따라 사용·수정·배포할 수 있습니다.
