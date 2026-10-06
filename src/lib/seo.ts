import { categories, categoryTopics, curriculum, getTopic } from '../data/curriculum';

export const SITE_URL = 'https://ml-atlas.ksh.ai.kr';
export const SITE_NAME = 'ml-atlas';
export const SOCIAL_IMAGE = `${SITE_URL}/social-icon.png`;
const homeDescription = '인공지능(AI)의 원리를 수식과 인터랙티브 시각화로 배우세요. LLM·딥러닝·머신러닝·강화학습부터 수학, PyTorch, CS 알고리즘까지 개념과 계산을 연결합니다.';
const categoryNames: Record<string, string> = { llm: 'LLM·대규모 언어 모델', dl: '딥러닝 (DL)', ml: '머신러닝 (ML)', rl: '강화학습 (RL)', math: '머신러닝 기초 수학', pytorch: 'PyTorch·파이토치', design: '신경망 모델 설계와 학습', cs: 'CS·컴퓨터 과학 알고리즘' };
type JsonObject = Record<string, unknown>;
export interface PageSeo {
  path: string; title: string; description: string; canonical: string;
  indexable: boolean; found: boolean; structuredData: JsonObject;
}
export const publicPaths = ['/', ...categories.map(c => `/category/${c.id}`), ...curriculum.map(t => `/lesson/${t.id}`), '/graph'];
export const buildPaths = [...publicPaths, '/saved', '/completed', '/404'];

export function normalizePath(path: string) {
  const pathname = path.split(/[?#]/)[0];
  return pathname === '/index.html' ? '/' : pathname.replace(/\/+$/, '') || '/';
}
export function pageSeo(input: string): PageSeo {
  let path = normalizePath(input);
  // Legacy Transformer section URLs represent the same continuous lesson.
  if (/^\/lesson\/transformer\/(structure|attention|heads|blocks|cache)$/.test(path)) path = '/lesson/transformer';
  const topic = /^\/lesson\/[^/]+$/.test(path) ? getTopic(path.split('/')[2]) : undefined;
  const category = /^\/category\/[^/]+$/.test(path) ? categories.find(c => c.id === path.split('/')[2]) : undefined;
  const privatePage = path === '/saved' || path === '/completed';
  const found = Boolean(topic || category || path === '/' || path === '/graph' || privatePage);
  const indexable = found && !privatePage;
  const canonical = `${SITE_URL}${path === '/404' || !found ? '/404' : path}`;
  let title = 'ml-atlas | 인공지능·머신러닝 수식과 시각화 학습';
  let description = homeDescription;
  if (topic) {
    const alias = topic.id === 'softmax' ? '소프트맥스·야코비안 미분' : topic.id === 'cross-entropy' ? 'Cross Entropy·미분' : '';
    title = `${topic.title}${alias ? ` (${alias})` : ''} | 수식·시각화 — ml-atlas`;
    description = `${topic.summary} 수식 전개, 입력·출력 차원, 계산 예제와 직접 조절하는 실험으로 ${topic.title}의 원리를 확인하세요.`;
  } else if (category) {
    title = `${categoryNames[category.id]} 학습 | 수식·시각화 — ml-atlas`;
    description = `${categoryNames[category.id]}의 기초부터 응용까지 ${categoryTopics(category.id).length}개 학습 노트. ${category.description} 수식·차원·계산 예제와 인터랙티브 실험을 학습 순서대로 탐색하세요.`;
  } else if (path === '/graph') {
    title = 'AI 개념 연결 지도 | 선수 지식·학습 흐름 — ml-atlas';
    description = '신경망, 순전파, 역전파부터 LLM과 CS 알고리즘까지. 학습 노트의 선수 지식·개념 링크·역링크를 따라 원리가 이어지는 이유를 탐색하세요.';
  } else if (privatePage) {
    title = `${path === '/saved' ? '북마크' : '학습 완료'} — ml-atlas`;
    description = '이 브라우저에 저장된 개인 학습 기록입니다.';
  } else if (!found) {
    title = '페이지를 찾을 수 없습니다 — ml-atlas';
    description = '요청한 학습 페이지가 없습니다. 학습 지도에서 개념을 찾아보세요.';
  }
  const graph: JsonObject[] = [];
  const website = { '@id': `${SITE_URL}/#website` };
  if (path === '/') graph.push({ '@type': 'WebSite', ...website, name: SITE_NAME, alternateName: 'ML Atlas', url: `${SITE_URL}/`, inLanguage: 'ko', description: homeDescription });
  if (indexable) {
    const page: JsonObject = { '@type': topic ? 'LearningResource' : category || path === '/' ? 'CollectionPage' : 'WebPage', '@id': `${canonical}#page`, url: canonical, name: topic?.title ?? categoryNames[category?.id ?? ''] ?? (path === '/graph' ? '개념 연결 지도' : SITE_NAME), description, inLanguage: 'ko', isPartOf: website, isAccessibleForFree: true };
    if (topic) Object.assign(page, { learningResourceType: '인터랙티브 학습 노트', educationalUse: 'self study', keywords: [topic.title, ...topic.tags], author: { '@type': 'Person', name: 'aidevksh', url: 'https://ksh.ai.kr', sameAs: ['https://github.com/aidevksh'] }, license: 'https://creativecommons.org/licenses/by/4.0/' });
    if (path === '/' || category) {
      const items = category ? categoryTopics(category.id).map(t => ({ name: t.title, url: `${SITE_URL}/lesson/${t.id}` })) : categories.map(c => ({ name: categoryNames[c.id], url: `${SITE_URL}/category/${c.id}` }));
      page.mainEntity = { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })) };
    }
    if (topic || category) {
      const c = category ?? categories.find(c => c.id === topic!.category)!;
      const crumbs = [{ name: '학습 지도', url: `${SITE_URL}/` }, { name: c.name, url: `${SITE_URL}/category/${c.id}` }, ...(topic ? [{ name: topic.title, url: canonical }] : [])];
      page.breadcrumb = { '@id': `${canonical}#breadcrumb` };
      graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: crumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })) });
    }
    graph.push(page);
  }
  return { path, title, description, canonical, indexable, found, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const jsonLd = (page: PageSeo) => JSON.stringify(page.structuredData).replace(/</g, '\\u003c');
export function renderSeoHead(page: PageSeo) {
  const meta = (key: string, content: string, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escapeAttribute(content)}" data-seo="true" />`;
  return [`<title>${escapeAttribute(page.title)}</title>`, meta('description', page.description), meta('robots', page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'), `<link rel="canonical" href="${escapeAttribute(page.canonical)}" data-seo="true" />`, meta('og:type', 'website', true), meta('og:site_name', SITE_NAME, true), meta('og:locale', 'ko_KR', true), meta('og:title', page.title, true), meta('og:description', page.description, true), meta('og:url', page.canonical, true), meta('og:image', SOCIAL_IMAGE, true), meta('og:image:width', '512', true), meta('og:image:height', '512', true), meta('og:image:alt', 'ml-atlas 보라색 신경망 로고', true), meta('twitter:card', 'summary'), meta('twitter:title', page.title), meta('twitter:description', page.description), meta('twitter:image', SOCIAL_IMAGE), ...(page.indexable ? [`<script id="site-structured-data" type="application/ld+json">${jsonLd(page)}</script>`] : [])].join('\n    ');
}

export function updateSeo(path: string) {
  const page = pageSeo(path);
  // Use the same metadata for the initial HTML and client-side navigation.
  const template = document.createElement('template');
  template.innerHTML = renderSeoHead(page);
  document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], [data-seo], #site-structured-data').forEach(node => node.remove());
  document.head.append(template.content);
}
