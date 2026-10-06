import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { categories, categoryTopics, curriculum, getTopic, type CategoryId, type Topic } from './data/curriculum';
import Transformer from './components/Transformer';
import { Lab } from './components/Labs';
import { readings } from './data/lessons';
import { lessonModels } from './lib/lessonModels';
import { ReadingBefore, ReadingAfter } from './components/LessonReading';
import TopicExperiment from './components/TopicExperiment';
import NormalizationLab from './components/NormalizationLab';
import PyTorchGuide from './components/PyTorchGuide';
import ActivationDerivation from './components/ActivationDerivation';
import TrainingLoop from './components/TrainingLoop';
import SoftmaxCrossEntropy from './components/SoftmaxCrossEntropy';
import { LearningConnections, ConceptMap } from './components/ConceptConnections';
import { NetworkMark, NetworkGlyph, CategoryIcon, CategoryGlyph, ConceptMapIcon } from './components/Brand';
import AboutSite from './components/AboutSite';
import { currentPath, href, navigate, subscribe } from './lib/route';

const extendedLabs = new Set(['softmax','vectors','gradients','derivatives','probability','linear-regression','kmeans','gan','rag','shape-design','qlearning']);
const learningTags = new Set(['지도', '비지도', '자기지도', '준지도', '강화']);
const tagLabel = (tag: string) => learningTags.has(tag) ? `${tag}학습` : tag;
function readList(key: string) {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && Boolean(getTopic(id))) : []; } catch { return []; }
}
function useStoredList(key: string) {
  const [value, setValue] = useState<string[]>(() => readList(key));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional, including in file:// mode. */ } }, [key, value]);
  const toggle = (id: string) => setValue(current => current.includes(id) ? current.filter(old => old !== id) : [...current, id]);
  return [value, toggle] as const;
}
function categoryStyle(id: CategoryId): CSSProperties { return { '--category-color': categories.find(c => c.id === id)!.color } as CSSProperties; }
function CategoryName({ category }: { category: typeof categories[number] }) {
  return category.shortName ? <>{category.shortName}<small className="category-full-name">{category.name.slice(category.shortName.length)}</small></> : <>{category.name}</>;
}
function Kind() { return <span className="kind with-lab">설명 · 계산 · 실험</span>; }
function TopicRow({ topic, index, done, saved, onSave }: { topic: Topic; index: number; done: boolean; saved: boolean; onSave: () => void }) {
  return <div className="topic-row"><a href={href(`/lesson/${topic.id}`)} className="topic-link"><span className={`topic-number ${done ? 'done' : ''}`}>{done ? '✓' : String(index + 1).padStart(2, '0')}</span><div><h3>{topic.title}</h3><p>{topic.summary}</p><div className="topic-meta"><Kind />{topic.tags.map(tag => <span key={tag}>{tagLabel(tag)}</span>)}</div></div><span className="row-arrow" aria-hidden>↗</span></a><button className={`save-button ${saved ? 'saved' : ''}`} aria-label={`${topic.title} 북마크 ${saved ? '해제' : '추가'}`} aria-pressed={saved} onClick={onSave}>{saved ? '◆' : '◇'}</button></div>;
}
function MiniArt({ type, compact = false }: { type: CategoryId | 'transformer'; compact?: boolean }) {
  return <svg width="240" height="120" viewBox="0 0 240 120" className={`mini-art ${compact ? 'compact' : ''}`} aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
    {type === 'llm' || type === 'transformer' ? <><path d="M36 24H138A10 10 0 0 1 148 34V72A10 10 0 0 1 138 82H61L36 98V82A10 10 0 0 1 26 72V34A10 10 0 0 1 36 24Z" fill="currentColor" opacity=".09" /><path d="M45 43H125M45 57H111M45 71H89M158 58H178M172 52L178 58L172 64" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="189" y="43" width="30" height="30" rx="7" fill="currentColor" opacity=".2" /></>
      : type === 'dl' ? <><path d="M40 35H116L198 60L116 85H40" fill="none" stroke="currentColor" strokeWidth="2" opacity=".5" />{[[40,35],[40,85],[116,35],[116,85],[198,60]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="8" fill="currentColor" />)}</>
      : type === 'ml' ? <><path d="M30 20V99H214" fill="none" stroke="currentColor" opacity=".25" strokeWidth="2" /><path d="M43 87L204 28" stroke="currentColor" strokeWidth="2" />{[[52,73],[78,81],[104,53],[134,60],[164,33],[192,41]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="4" fill="currentColor" opacity=".65" />)}</>
      : type === 'rl' ? <><rect x="27" y="42" width="62" height="38" rx="12" fill="currentColor" opacity=".1" /><rect x="158" y="42" width="55" height="38" rx="7" fill="currentColor" opacity=".1" /><g fill="none" stroke="currentColor" strokeWidth="2"><path d="M59 35V27H186V35M181 30L186 35L191 30M186 87V96H59V87M54 92L59 87L64 92" /></g><g fill="currentColor" fontSize="12" textAnchor="middle"><text x="58" y="65">에이전트</text><text x="185" y="65">환경</text><text x="122" y="20">행동</text><text x="122" y="113">보상</text></g></>
      : type === 'cs' ? <><rect x="29" y="16" width="182" height="91" rx="8" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" /><path d="M29 36H211" stroke="currentColor" opacity=".2" /><path d="M89 52L71 71L89 90M151 52L169 71L151 90M128 48L111 94" fill="none" stroke="currentColor" strokeWidth="2.5" /></>
      : type === 'math' ? <><path d="M30 95H220M90 105V15" stroke="currentColor" opacity=".25" /><path d="M90 95L185 30M90 95L210 72" stroke="currentColor" strokeWidth="2" /><circle cx="185" cy="30" r="5" fill="currentColor" /><circle cx="210" cy="72" r="5" fill="currentColor" /></>
      : <>{[0, 1, 2, 3].map(i => <g key={i}><rect x={22 + i * 53} y={35 - i * 3} width="36" height={50 + i * 6} rx="5" fill="none" stroke="currentColor" opacity=".5" /><text x={28 + i * 53} y="64" fill="currentColor" fontSize="12">{[4, 8, 8, 2][i]}</text>{i < 3 && <path d={`M${59 + i * 53} 60H${73 + i * 53}`} stroke="currentColor" />}</g>)}</>}
  </svg>;
}
function Home({ completed, resume }: { completed: string[]; resume: string }) {
  return <><section className="home-hero"><div className="hero-text"><div className="eyebrow"><span className="tiny-dot" /> AI · MACHINE LEARNING ATLAS</div><h1>인공지능의 원리를,<br /><em>하나의 지도로.</em></h1><p>LLM·딥러닝·머신러닝의 수식을 읽고, 직접 움직이며 계산을 따라가세요.<br />수학·PyTorch·CS 알고리즘까지 이어지는 개념 학습 지도.</p><div className="hero-actions"><a className="button primary" href={href(resume ? `/lesson/${resume}` : '/lesson/llm-basics')}>{resume ? '이어서 학습하기' : 'LLM부터 시작하기'} <span>→</span></a><a className="text-link" href={href('/category/math')}>기초 수학부터 ↗</a></div><div className="hero-stats"><span><b>{String(categories.length).padStart(2,'0')}</b> 카테고리</span><span><b>{curriculum.length}</b> 학습 노트</span><span><b>{curriculum.length}</b> 주제별 실험</span></div></div><div className="hero-map" aria-hidden><svg width="460" height="370" viewBox="0 0 460 370"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#dedbd4" /></pattern></defs><rect width="460" height="370" fill="url(#dots)" /><ellipse cx="230" cy="185" rx="174" ry="124" fill="none" stroke="#d9d4e3" strokeDasharray="3 8" /><ellipse cx="230" cy="185" rx="105" ry="74" fill="none" stroke="#e3dfe9" />{[[100, 83], [230, 45], [363, 80], [407, 185], [358, 280], [230, 325], [99, 280], [53, 185]].map(([x, y], i) => <g key={i}><path d={`M230 185L${x} ${y}`} stroke={categories[i].color} opacity=".25" /><circle cx={x} cy={y} r="26" fill="#fff" stroke="#e5e0d8" /><g transform={`translate(${x-12},${y-12})`} style={{color:categories[i].color}}><CategoryGlyph id={categories[i].id}/></g><text x={x} y={y + 44} textAnchor="middle" fontSize="11" fill="#7c7b86">{categories[i].shortName ?? categories[i].name}{categories[i].shortName && <tspan x={x} dy="14" fontSize="9">({categories[i].english})</tspan>}</text></g>)}<circle cx="230" cy="185" r="52" fill="#f0edf7" stroke="#e3ddeb" /><g transform="translate(214,147)"><NetworkGlyph/></g><text x="230" y="203" textAnchor="middle" fontSize="14" fill="#514868">ml-atlas</text></svg><div className="map-caption">CONCEPTS CONNECT. UNDERSTANDING GROWS.</div></div></section>
    <div className="section-heading"><div><div className="eyebrow">EXPLORE THE MAP</div><h2>어디부터 탐색할까요?</h2></div><span>기초에서 응용으로, 카테고리별 추천 순서</span></div>
    <div className="category-grid">{categories.map((category, i) => { const topics = categoryTopics(category.id), done = topics.filter(t => completed.includes(t.id)).length; return <a key={category.id} href={href(`/category/${category.id}`)} className="category-card" style={categoryStyle(category.id)}><div className="category-card-top"><span>{String(i + 1).padStart(2, '0')}</span><span className="category-symbol"><CategoryIcon id={category.id}/></span></div><h3><CategoryName category={category} /></h3>{!category.shortName && <span className="category-english">{category.english}</span>}<p>{category.description}</p><MiniArt type={category.id} /><div className="category-card-footer"><span>{topics.length}개 노트{done > 0 ? ` · ${done}개 완료` : ''}</span><b>→</b></div></a>; })}</div>
    <div className="section-heading"><div><div className="eyebrow">LEARN BY DOING</div><h2>숫자가 움직이면, 이해도 움직입니다.</h2></div><span>직접 계산하는 실험</span></div><div className="featured-grid">{['transformer', 'shape-design', 'rag'].map(id => { const t = getTopic(id)!; return <a key={id} className="featured-card" href={href(`/lesson/${id}`)} style={categoryStyle(t.category)}><MiniArt type={id === 'transformer' ? 'transformer' : t.category} compact /><div><Kind /><h3>{t.title}</h3><p>{id === 'transformer' ? 'Q·K·V를 움직여 문맥이 모이는 과정 보기' : id === 'shape-design' ? '레이어를 연결하고 차원·파라미터 계산하기' : '검색 순위와 근거 문맥을 직접 바꾸기'}</p></div><span>↗</span></a>; })}</div>
    <div className="learning-note"><NetworkMark/><div><b>정답을 외우기보다, 관계를 이해하기.</b><p>각 노트는 핵심 개념·수식·차원·수치 예제를 연결합니다. 실험은 작은 입력과 명시한 가정으로 계산됩니다.</p></div></div>
  </>;
}
function CategoryPage({ id, completed, saved, toggleSave }: { id: CategoryId; completed: string[]; saved: string[]; toggleSave: (id: string) => void }) {
  const c = categories.find(c => c.id === id)!, topics = categoryTopics(id), done = topics.filter(t => completed.includes(t.id)).length;
  const [tag, setTag] = useState('전체');
  const visible = topics.filter(t => tag === '전체' || t.tags.includes(tag));
  const tags = [...new Set(topics.flatMap(t => t.tags))].filter(tag => id === 'cs' || learningTags.has(tag));
  return <div style={categoryStyle(id)}><div className="breadcrumb"><a href={href('/')}>학습 지도</a><span>/</span>{c.name}</div><section className="category-intro"><div><div className="eyebrow">{c.english}</div><h1><CategoryName category={c} /><span className="title-dot">.</span></h1><p>{c.description}</p><div className="inline-meta">{topics.length}개 학습 노트 <span>·</span> {done}개 완료 <span>·</span> 기초 → 응용</div></div><MiniArt type={id} /></section><div className="category-progress"><div style={{ width: `${done / topics.length * 100}%` }} /></div>
    <div className="filter-bar"><div className="filter-chips" role="group" aria-label="학습 방식 필터">{['전체', ...tags].map(value => <button key={value} className={tag === value ? 'active' : ''} aria-pressed={tag === value} onClick={() => setTag(value)}>{value === '전체' ? value : tagLabel(value)}</button>)}</div><span className="all-topics-experiment">모든 주제에 설명과 실험이 있어요</span></div>
    {visible.length ? [...new Set(visible.map(t => t.group))].map((group, i) => <section className="topic-group" key={group}><div className="group-heading"><span>{String(i + 1).padStart(2, '0')}</span><h2>{group}</h2><small>{visible.filter(t => t.group === group).length}개 노트</small></div><div className="topic-list">{visible.filter(t => t.group === group).map(t => <TopicRow key={t.id} topic={t} index={topics.indexOf(t)} done={completed.includes(t.id)} saved={saved.includes(t.id)} onSave={() => toggleSave(t.id)} />)}</div></section>) : <div className="empty-state">이 조건에 맞는 노트가 없습니다. 필터를 바꿔보세요.</div>}
  </div>;
}
function LessonPage({ topic, completed, saved, toggleComplete, toggleSave }: { topic: Topic; completed: string[]; saved: string[]; toggleComplete: (id: string) => void; toggleSave: (id: string) => void }) {
  const category = categories.find(c => c.id === topic.category)!, ordered = categoryTopics(topic.category), index = ordered.indexOf(topic);
  return <div className="lesson-page" style={categoryStyle(topic.category)}><div className="breadcrumb"><a href={href('/')}>학습 지도</a><span>/</span><a href={href(`/category/${category.id}`)}>{category.name}</a><span>/</span>{topic.group}</div><div className="lesson-intro"><div><div className="eyebrow">{category.english} · {String(index + 1).padStart(2, '0')} / {ordered.length}</div><h1>{topic.title}</h1><p>{topic.summary}</p><div className="topic-meta"><Kind />{topic.tags.map(tag => <span key={tag}>{tagLabel(tag)}</span>)}</div></div><button className={`button bookmark ${saved.includes(topic.id) ? 'active' : ''}`} aria-pressed={saved.includes(topic.id)} onClick={() => toggleSave(topic.id)}>{saved.includes(topic.id) ? '◆ 저장됨' : '◇ 북마크'}</button></div>
    {topic.prerequisites.length > 0 && <div className="prerequisites"><span>먼저 알면 좋아요</span>{topic.prerequisites.map(id => <a key={id} href={href(`/lesson/${id}`)}>{getTopic(id)?.title} ↗</a>)}</div>}
    <ReadingBefore topic={topic} content={readings[topic.id]} />
    {topic.id === 'transformer' ? <Transformer /> : <TopicExperiment topicId={topic.id} model={lessonModels[topic.id]} />}
    {topic.id === 'activation' && <ActivationDerivation/>}
    {['softmax','cross-entropy','torch-losses'].includes(topic.id) && <SoftmaxCrossEntropy/>}
    {['neural-network','torch-loop'].includes(topic.id) && <TrainingLoop/>}
    {topic.id === 'normalization' && <NormalizationLab />}
    {topic.category === 'pytorch' && <PyTorchGuide topicId={topic.id} />}
    {extendedLabs.has(topic.id) && topic.lab && <section className="extended-lab"><h2>다른 시각으로 더 탐색하기</h2><p>위에서 읽은 원리를 아래 실험의 값과 연결해 보세요. 각 실험의 입력과 가정을 확인하면 계산을 더 자세히 따라갈 수 있습니다.</p><Lab topic={topic} /></section>}
    <ReadingAfter topicId={topic.id} content={readings[topic.id]} />
    <LearningConnections topic={topic}/>
    <section className="references"><h2>더 깊이 읽기</h2>{topic.references.map(ref => <a key={ref.url} href={ref.url} target="_blank" rel="noreferrer">{ref.title} ↗</a>)}{topic.id === 'transformer' && <a href="https://huggingface.co/docs/transformers/en/cache_explanation" target="_blank" rel="noreferrer">Hugging Face — KV cache ↗</a>}</section>
    <div className="lesson-complete"><div><b>개념 사이의 연결을 발견했나요?</b><p>학습 완료 표시는 이 브라우저에 저장됩니다.</p></div><button className={`button ${completed.includes(topic.id) ? '' : 'primary'}`} aria-pressed={completed.includes(topic.id)} onClick={() => toggleComplete(topic.id)}>{completed.includes(topic.id) ? '✓ 학습 완료 · 되돌리기' : '학습 완료 표시 ✓'}</button></div>
    <nav className="lesson-pagination" aria-label="추천 학습 순서">{index > 0 ? <a href={href(`/lesson/${ordered[index - 1].id}`)}><small>← 이전 노트</small><b>{ordered[index - 1].title}</b></a> : <a href={href(`/category/${category.id}`)}><small>← 목차</small><b>{category.name} 학습 순서</b></a>}{index + 1 < ordered.length ? <a href={href(`/lesson/${ordered[index + 1].id}`)}><small>다음 노트 →</small><b>{ordered[index + 1].title}</b></a> : <a href={href(`/category/${category.id}`)}><small>목차로 →</small><b>카테고리 다시 보기</b></a>}</nav>
  </div>;
}
export default function App() {
  const [path, setPath] = useState(currentPath), [query, setQuery] = useState(''), [menu, setMenu] = useState(false);
  const [completed, toggleComplete] = useStoredList('ml-atlas:completed'), [saved, toggleSave] = useStoredList('ml-atlas:saved');
  const [resume, setResume] = useState(() => { try { return getTopic(localStorage.getItem('ml-atlas:resume') ?? '')?.id ?? ''; } catch { return ''; } });
  const menuButton = useRef<HTMLButtonElement>(null), sidebar = useRef<HTMLElement>(null), main = useRef<HTMLElement>(null);
  const segments = path.replace(/^\//, '').split('/'), type = segments[0], id = segments[1] ?? '';
  const topic = type === 'lesson' ? getTopic(id) : undefined, activeCategory = topic?.category ?? (type === 'category' ? id : '');
  useEffect(() => subscribe(() => { setPath(currentPath()); setQuery(''); setMenu(false); }), []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); main.current?.focus({ preventScroll: true }); document.title = topic ? `${topic.title} — ml-atlas` : activeCategory ? `${categories.find(c => c.id === activeCategory)?.name ?? '학습 지도'} — ml-atlas` : 'ml-atlas'; if (topic?.id === 'transformer') { const oldSection = path.split('/')[3]; if (['structure','attention','heads','blocks','cache'].includes(oldSection)) requestAnimationFrame(() => document.getElementById(`transformer-${oldSection}`)?.scrollIntoView()); } if (topic) { setResume(topic.id); try { localStorage.setItem('ml-atlas:resume', topic.id); } catch { /* Optional persistence. */ } } }, [path, topic, activeCategory]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement as HTMLElement | null;
    sidebar.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(false); menuButton.current?.focus(); }
      if (e.key === 'Tab') { const elements = sidebar.current?.querySelectorAll<HTMLElement>('a,button'); if (!elements?.length) return; const first = elements[0], last = elements[elements.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    const media = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (media.matches) setMenu(false); };
    const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; window.addEventListener('keydown', key); media.addEventListener('change', resize);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', key); media.removeEventListener('change', resize); previous?.focus(); };
  }, [menu]);
  const searchResults = curriculum.filter(t => `${t.title} ${t.summary} ${t.group} ${categories.find(c => c.id === t.category)?.name} ${t.tags.join(' ')}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const personalTopics = type === 'saved' ? curriculum.filter(t => saved.includes(t.id)) : curriculum.filter(t => completed.includes(t.id));
  return <div className="app-shell" onClickCapture={e => { const link = (e.target as HTMLElement).closest('a'), target = link?.getAttribute('href'); if (!target || !/^#?\//.test(target)) return; setQuery(''); setMenu(false); if (target.startsWith('/') && !link!.target && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate(target); } }}><a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); main.current?.focus(); }}>본문으로 건너뛰기</a>
    <aside className={`sidebar ${menu ? 'open' : ''}`} ref={sidebar} id="site-navigation" role={menu ? 'dialog' : undefined} aria-modal={menu || undefined} aria-label={menu ? '카테고리 메뉴' : undefined}><a className="brand" href={href('/')}><NetworkMark className="brand-mark"/><span>ml-atlas<small>THEORY, MADE VISIBLE</small></span></a><button className="mobile-close icon-button" aria-label="메뉴 닫기" onClick={() => setMenu(false)}>×</button><nav aria-label="주 메뉴"><a href={href('/')} className={`nav-home ${(!type || type === '') && !query ? 'active' : ''}`} aria-current={!type && !query ? 'page' : undefined}><span>⊙</span>학습 지도</a><a href={href('/graph')} className={`nav-home ${type === 'graph' ? 'active' : ''}`} aria-current={type === 'graph' ? 'page' : undefined}><ConceptMapIcon/>개념 연결 지도</a><div className="nav-label">CATEGORIES</div>{categories.map(category => <a key={category.id} href={href(`/category/${category.id}`)} className={`category-nav ${activeCategory === category.id && !query ? 'active' : ''}`} aria-current={activeCategory === category.id && !query ? 'page' : undefined} style={categoryStyle(category.id)}><span><CategoryIcon id={category.id}/></span><b><CategoryName category={category} /></b><small>{categoryTopics(category.id).length}</small></a>)}<div className="nav-label second">MY LEARNING</div><a className={`personal-nav ${type === 'saved' ? 'active' : ''}`} href={href('/saved')}><span>◇</span>북마크<small>{saved.length}</small></a><a className={`personal-nav ${type === 'completed' ? 'active' : ''}`} href={href('/completed')}><span>✓</span>학습 완료<small>{completed.length}</small></a></nav><div className="sidebar-bottom"><div className="sidebar-progress"><span>나의 학습 기록</span><b>{completed.length} / {curriculum.length}</b></div><div className="progress-track"><i style={{ width: `${completed.length / curriculum.length * 100}%` }} /></div><p>한 개념씩, 연결해 나가세요.</p><span className="sidebar-edition">AN OPEN LEARNING NOTEBOOK</span></div></aside>
    {menu && <button className="menu-backdrop" aria-label="메뉴 닫기" onClick={() => setMenu(false)} tabIndex={-1} />}
    <div className="app-content" inert={menu || undefined}><header className="topbar"><div className="topbar-left"><button className="menu-toggle icon-button" ref={menuButton} aria-label="카테고리 메뉴 열기" aria-expanded={menu} aria-controls="site-navigation" onClick={() => setMenu(v => !v)}>☰</button><a className="mobile-brand" href={href('/')}><NetworkMark/> ml-atlas</a><span className="topbar-label">수식으로 이해하고, 시각화로 탐색하기</span></div><div className="search-box"><span aria-hidden>⌕</span><input type="search" aria-label="학습 주제 검색" placeholder="개념 검색하기" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="검색 초기화" onClick={() => setQuery('')}>×</button>}</div><a className="topbar-bookmark" href={href('/saved')} aria-label="북마크 보기">◇</a></header>
      <main id="main-content" ref={main} tabIndex={-1} className="main-content">
        {query.trim() ? <><div className="eyebrow">FIND A CONCEPT</div><h1 className="search-title">“{query}” 검색 결과</h1><p className="results-count" role="status">{searchResults.length}개 노트</p><div className="topic-list">{searchResults.map((t, i) => <TopicRow key={t.id} topic={t} index={i} done={completed.includes(t.id)} saved={saved.includes(t.id)} onSave={() => toggleSave(t.id)} />)}</div>{!searchResults.length && <div className="empty-state">검색 결과가 없습니다. 다른 이름이나 관련 개념을 입력해보세요.</div>}</>
          : !type ? <Home completed={completed} resume={resume} />
          : type === 'category' && categories.some(c => c.id === id) ? <CategoryPage key={id} id={id as CategoryId} completed={completed} saved={saved} toggleSave={toggleSave} />
          : type === 'graph' ? <ConceptMap/>
          : topic ? <LessonPage key={topic.id} topic={topic} completed={completed} saved={saved} toggleComplete={toggleComplete} toggleSave={toggleSave} />
          : type === 'saved' || type === 'completed' ? <><div className="eyebrow">MY LEARNING</div><h1 className="search-title">{type === 'saved' ? '북마크' : '학습 완료'}</h1><p className="results-count">{personalTopics.length}개 노트 · 이 브라우저의 학습 기록</p>{personalTopics.length ? <div className="topic-list">{personalTopics.map((t, i) => <TopicRow key={t.id} topic={t} index={i} done={completed.includes(t.id)} saved={saved.includes(t.id)} onSave={() => toggleSave(t.id)} />)}</div> : <div className="empty-state"><b>아직 기록이 없습니다.</b><p>노트를 북마크하거나 학습 완료를 표시해보세요.</p><a className="button" href={href('/')}>학습 지도 둘러보기 →</a></div>}</>
          : <div className="empty-state"><h1>노트를 찾을 수 없습니다.</h1><a className="button" href={href('/')}>학습 지도로 돌아가기 →</a></div>}
      </main><footer className="site-footer"><a className="footer-brand" href={href('/')}><NetworkMark/> ml-atlas</a><span>© 2026 <a href="https://github.com/aidevksh/ml-atlas" target="_blank" rel="noreferrer">aidevksh &amp; contributors</a></span><AboutSite/><div className="footer-licenses"><a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noreferrer">코드 Apache 2.0 ↗</a><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">학습 콘텐츠 CC BY 4.0 ↗</a></div></footer></div>
  </div>;
}
