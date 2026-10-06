import { describe,it,expect,vi,beforeAll,afterAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { curriculum } from '../data/curriculum';
let App:typeof import('../App').default;
let ConceptText:typeof import('../components/ConceptConnections').ConceptText;
const location={protocol:'file:',hash:'',pathname:'/'};
beforeAll(async()=>{vi.stubGlobal('window',{location});App=(await import('../App')).default;ConceptText=(await import('../components/ConceptConnections')).ConceptText;});
afterAll(()=>vi.unstubAllGlobals());
describe('React renders the expanded atlas and safe concept links',()=>{
 it.each(curriculum)('renders $id with authored expansion, explanation and valid SVG geometry',topic=>{location.hash=`#/lesson/${topic.id}`;const html=renderToStaticMarkup(<App/>);expect(html).toContain('수식을 전개하면');expect(html).toContain('계산을 하나의 흐름으로 연결하기');expect(html).toContain('사이트 정보');expect(html).not.toMatch(/(?:cx|cy|x1|y1|x2|y2)="(?:NaN|Infinity)/);expect(html).toContain(`#/category/${topic.category}`);expect(html).not.toContain('<iframe');});
 it('links terms without linking the current note or fragments inside English words',()=>{const html=renderToStaticMarkup(<ConceptText current="neural-network" text="신경망의 역전파에는 활성화 함수와 연쇄법칙이 필요합니다. ReLUspecial"/>);expect(html).toContain('#/lesson/activation');expect(html).toContain('#/lesson/derivatives');expect(html).not.toContain('#/lesson/neural-network');expect(html).not.toContain('>ReLU</a>special');});
 it('renders the map without nested SVG viewports and uses RL consistently',()=>{location.hash='';const html=renderToStaticMarkup(<App/>);expect(html).toContain('#/category/cs');expect(html).toContain('#/graph');expect(html).not.toContain('✳');expect(html).not.toContain('∿');const hero=html.split('class="hero-map"')[1].split('class="map-caption"')[0];expect(hero.match(/<svg\b/g)).toHaveLength(1);expect(html).toContain('(Reinforcement Learning)');location.hash='#/category/rl';expect(renderToStaticMarkup(<App/>)).toContain('RL (Reinforcement Learning)');location.hash='#/graph';expect(renderToStaticMarkup(<App/>)).toContain('연결 지도 중심 노트');});
});
