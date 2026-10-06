# ml-atlas SEO 운영 가이드

대표 주소는 **https://ml-atlas.ksh.ai.kr/**입니다. 목표는 검색한 개념의 정의·수식·미분·계산 예제로 바로 진입하게 하는 것입니다. 사이트맵은 URL 발견을 돕지만 색인이나 순위를 보장하지 않습니다. [Google 사이트맵 안내](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

## 적용한 전략

| 영역 | 구현 | 확인 방법 |
| :--- | :--- | :--- |
| 본문 발견 | 같은 React 컴포넌트로 홈·8개 카테고리·109개 노트·개념 지도 HTML 사전 렌더링 | JavaScript 실행 전에도 제목·정의·수식·예제·링크가 있음 |
| URL | 기존 `/lesson/{id}`, `/category/{id}` 유지, HTTPS 대표 도메인으로 self canonical | 새로고침·직접 진입, canonical과 사이트맵 일치 |
| 검색 결과 설명 | 고유 title·description, 홈 브랜드명, Softmax·CE 한/영 명칭 | 초기 HTML과 클라이언트 이동 후 모두 일치 |
| 공유 | Open Graph·Twitter 메타, 512px 보라 신경망 PNG | 메타 URL의 이미지가 HTTP 200으로 제공됨 |
| 파비콘 | 안정된 공개 URL의 96px PNG와 SVG·Apple 아이콘 | Googlebot-Image가 접근할 수 있음 |
| 구조화 데이터 | 홈 WebSite·CollectionPage, 카테고리 ItemList, 노트 LearningResource·BreadcrumbList | 본문·목차·breadcrumb 내용과 일치 |
| 내부 링크 | 카테고리 목차·선수 지식·본문 개념·학습 흐름·역링크의 실제 `a href` | 각 노트가 목차에서 발견됨 |
| 크롤링 | 빌드 시 실제 XML 사이트맵·plain-text robots 생성 | `/sitemap.xml`, `/robots.txt` MIME 확인 |
| 제외 | 북마크·완료 기록은 `noindex, follow`, 사이트맵에서 제외 | 검색엔진의 접근을 막지 않아 noindex를 읽게 함 |
| 오류·중복 | 없는 페이지는 Nginx HTTP 404, slash·index.html 별칭 301 | 오류 URL이 홈페이지 HTTP 200으로 바뀌지 않음 |
| 자산 | 깊은 페이지는 파일명에 해시가 있는 공통 JS·CSS 사용 | 페이지마다 큰 inline 자산을 반복 내려받지 않음 |
| 회귀 방지 | 빌드 후 전체 공개 HTML과 메타·사이트맵·제외 정책 검사 | `npm run build`, `npm run seo:check` |

검색엔진 전용 본문을 따로 만들지 않습니다. 사용자에게 보이는 컴포넌트를 그대로 렌더링하고 React hydration으로 조작 기능을 연결합니다. 개인 localStorage 기록은 hydration 이후 불러옵니다. 루트 `dist/index.html`은 기존처럼 JS·CSS를 포함하고 `file://`에서 hash 라우팅을 지원합니다. 깊은 정적 HTML은 HTTP 배포용입니다. 업데이트 날짜를 빌드 때마다 꾸며 넣지 않도록 sitemap `lastmod`는 생략했습니다.

구조화 데이터는 실제 콘텐츠를 설명합니다. LearningResource 자체의 Google 특수 검색 결과 표시를 약속하지 않으며, 평점·가짜 날짜·작동하지 않는 검색 액션은 추가하지 않습니다. [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [사이트 이름](https://developers.google.com/search/docs/appearance/site-names), [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [검색 파비콘](https://developers.google.com/search/docs/appearance/favicon-in-search)

## Nginx에 반영하기

1. `npm ci && npm run build`로 생성한 **dist 디렉터리 전체**를 현재 사이트의 document root에 배포합니다. 새 `lesson/`, `category/`, `graph/`, `saved/`, `completed/` 디렉터리도 포함해야 합니다.
2. 기존 `server` 블록의 root·TLS·보안 헤더는 실제 환경에 맞게 유지하고, 홈페이지로 돌리는 SPA `location /` 규칙을 [nginx-seo.conf](../deploy/nginx-seo.conf)의 규칙으로 교체합니다. 같은 location을 중복해서 추가하지 않습니다.
3. 실제 서버에서 `nginx -t` 성공 후 reload합니다. 기존 캐시가 있다면 HTML·robots·sitemap 캐시를 갱신합니다.
4. 아래 서버 감사 명령으로 HTML·MIME·404 응답을 검증합니다.

```bash
npm run seo:check -- https://ml-atlas.ksh.ai.kr
```

설정의 핵심은 `try_files $uri/index.html $uri =404;`입니다. 생성된 학습 본문을 먼저 찾고, 없는 주소에는 실제 404를 반환합니다. `/lesson/softmax`에 홈페이지 HTML만 반환하는 rewrite를 남겨두면 원본 HTML의 title·canonical이 틀려집니다. 서버에 별도의 정규식 location·proxy 규칙이 있다면 이 규칙보다 먼저 요청을 가로채지 않는지 확인하세요. `/transformer/index.html`의 호환 이동은 기존 section fragment를 유지합니다. [Nginx try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)

Nginx 설정은 해시 자산의 캐시 만료를 1년으로 지정합니다. 압축은 서버 또는 CDN에서 HTML·JS·CSS·XML에 적용하고, HTML·robots·sitemap에는 갱신 가능한 캐시를 사용합니다. 기존 보안 헤더가 location에서 덮어써지지 않도록 실제 서버 설정을 확인합니다. Core Web Vitals는 배포 후 Search Console과 PageSpeed Insights의 실제 보고서로 판단합니다. `npm run preview`는 사전 렌더링 페이지와 301·404 동작을 제공하는 로컬 정적 서버입니다. Nginx 바이너리 자체의 문법 검증을 대신하지 않습니다.

## Google Search Console 등록

1. Search Console에서 **도메인 속성 `ml-atlas.ksh.ai.kr`**을 추가하고 Google이 발급한 DNS TXT 값을 DNS 제공자에 넣어 소유권을 확인합니다. 기존 `ksh.ai.kr` 도메인 속성을 이미 인증했다면 그 하위 도메인도 해당 속성의 범위에 포함됩니다. 개별 사이트 보고서를 원하면 별도 속성을 추가합니다.
2. DNS 수정 없이 HTML 방식으로 진행하려면 **URL 접두어 속성 `https://ml-atlas.ksh.ai.kr/`**을 선택합니다. Google의 HTML 태그에서 `content` 토큰만 `GOOGLE_SITE_VERIFICATION` 환경변수에 설정한 뒤 빌드·배포합니다. 이 빌드는 발급받은 값이 있을 때만 확인 태그를 생성합니다. HTML 확인 파일 방식이면 원본 파일을 `public/`에 넣어 재빌드하며, 해당 URL이 파일 자체를 HTTP 200으로 제공하는지 확인합니다. 인증 후에도 확인 수단을 유지합니다.
3. 배포 감사가 통과하면 **Sitemaps → `sitemap.xml`**을 제출합니다. 전체 주소는 **https://ml-atlas.ksh.ai.kr/sitemap.xml**입니다.
4. URL 검사에서 홈페이지와 아래 대표 학습 페이지를 라이브 테스트합니다. 원본/렌더링 HTML에서 학습 본문·정규 URL·색인 허용 상태를 확인하고 필요한 페이지의 색인 생성을 요청합니다. 모든 URL에 반복 요청할 필요는 없습니다.

[Google 소유권 확인](https://support.google.com/webmasters/answer/9008080)에서 속성과 확인 방식별 조건을 확인할 수 있습니다. 소유권 토큰·DNS 접근·Google 계정은 저장소에 없으므로 등록 단계는 계정 소유자가 수행해야 합니다.

## 검색 의도와 콘텐츠 운영

검색량을 추정해서 단정하지 않고, 이미 구현한 페이지의 강점을 먼저 알립니다.

| 우선 학습 페이지 | 의도 예시 | 사용자가 바로 확인할 근거 |
| :--- | :--- | :--- |
| [Softmax](https://ml-atlas.ksh.ai.kr/lesson/softmax) | 소프트맥스 미분, softmax Jacobian | 몫 규칙·3×3 야코비안·미분 곡선 |
| [크로스 엔트로피](https://ml-atlas.ksh.ai.kr/lesson/cross-entropy) | cross entropy 미분, 왜 p−y인가 | 확률 미분과 logit 미분의 구분·연쇄법칙·실제 수치 |
| [Transformer](https://ml-atlas.ksh.ai.kr/lesson/transformer) | attention QKV, transformer 구조, KV cache | 행렬·차원·드래그·cache 비교 |
| [신경망](https://ml-atlas.ksh.ai.kr/lesson/neural-network) | 순전파 역전파 가중치 업데이트 | forward→loss→backward→update 반복과 손실 변화 |
| [활성화 함수](https://ml-atlas.ksh.ai.kr/lesson/activation) | sigmoid ReLU GELU 미분 | 6개 함수 미분 전개와 비교 그래프 |
| [정규화](https://ml-atlas.ksh.ai.kr/lesson/normalization) | BatchNorm LayerNorm 차이 | 통계 축·train/eval 수치 실험 |
| [CS 목차](https://ml-atlas.ksh.ai.kr/category/cs) | BFS DFS, 알고리즘 복잡도, 자동미분 DAG | 코딩테스트에서 딥러닝 개발로 이어지는 학습 순서 |

배포 직후에는 사이트맵 성공·소유권·대표 페이지 색인부터 확인합니다. 이후 검색 실적의 실제 질의와 연결된 페이지를 보고 용어·제목·설명을 보완합니다. 노출이 있는데 클릭이 낮은 페이지는 설명과 검색 의도의 일치부터 확인하고, 색인이 안 된 페이지는 상태 코드·canonical·본문·발견 경로를 먼저 검사합니다. 새로운 내용은 얇은 중복 페이지를 늘리기보다 계산·수식·예제·연결을 보강합니다.

개발자 블로그·GitHub README 등 관리하는 문서에서 관련 학습 페이지를 맥락에 맞게 직접 연결하면 사용자가 실험으로 이동하기 쉽습니다. 이번 변경은 외부 블로그를 수정하지 않습니다. 순위나 색인까지 걸리는 시간을 보장하지 않습니다.
