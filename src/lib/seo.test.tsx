import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { categories, curriculum } from '../data/curriculum';
import { jsonLd, normalizePath, pageSeo, publicPaths, renderSeoHead, SITE_URL } from './seo';

describe('searchable routes and original HTML', () => {
  it('registers every public note and category exactly once, with unique titles', () => {
    expect(new Set(publicPaths).size).toBe(curriculum.length + categories.length + 2);
    expect(new Set(publicPaths.map(path => pageSeo(path).title)).size).toBe(publicPaths.length);
    for (const path of publicPaths) {
      const page = pageSeo(path);
      expect(page.found && page.indexable).toBe(true);
      expect(page.canonical).toBe(`${SITE_URL}${path}`);
      expect(page.canonical).not.toMatch(/[?#]/);
      expect(page.description.length).toBeGreaterThan(30);
      expect(JSON.parse(jsonLd(page))['@graph'].some((node: { url?: string }) => node.url === page.canonical)).toBe(true);
    }
  });
  it.each(['/saved', '/completed', '/lesson/not-real', '/category/not-real', '/lesson/softmax/garbage', '/graph/garbage', '/saved/garbage', '/404'])('excludes %s from search', path => {
    const page = pageSeo(path);
    expect(page.indexable).toBe(false);
    expect(publicPaths).not.toContain(path);
    expect(renderSeoHead(page)).toContain('noindex, follow');
    expect(page.structuredData['@graph']).toEqual([]);
  });
  it('keeps legacy paths and duplicates on one canonical lesson', () => {
    expect(normalizePath('/index.html')).toBe('/');
    expect(pageSeo('/lesson/softmax/?utm_source=blog').canonical).toBe(`${SITE_URL}/lesson/softmax`);
    expect(pageSeo('/lesson/transformer/attention').canonical).toBe(`${SITE_URL}/lesson/transformer`);
  });
  it.each(['softmax', 'cross-entropy', 'transformer', 'cs-graph'])('renders the actual %s lesson without a browser', id => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(<App initialPath={`/lesson/${id}`} />);
    expect(html).toContain('id="lesson-definition"');
    expect(html).toContain('id="lesson-formula"');
    expect(html).toContain('수식을 전개하면');
    expect(html).toContain(`href="/category/${curriculum.find(t => t.id === id)!.category}"`);
    expect(html).not.toContain('#/lesson/');
    expect(html).not.toContain('<iframe');
  });
  it('does not present an invalid suffix as an existing lesson', () => {
    expect(renderToString(<App initialPath="/lesson/softmax/garbage" />)).toContain('노트를 찾을 수 없습니다.');
  });
  it('describes visible learning content and breadcrumbs without unsupported rich-result claims', () => {
    const page = pageSeo('/lesson/cross-entropy');
    const nodes = page.structuredData['@graph'] as Record<string, unknown>[];
    expect(nodes.some(node => node['@type'] === 'LearningResource')).toBe(true);
    const crumbs = nodes.find(node => node['@type'] === 'BreadcrumbList')!.itemListElement as { item: string; position: number }[];
    expect(crumbs.map(crumb => crumb.position)).toEqual([1, 2, 3]);
    expect(crumbs.at(-1)!.item).toBe(page.canonical);
    expect(jsonLd(page)).not.toMatch(/aggregateRating|SearchAction|dateModified|datePublished/);
    expect(renderSeoHead(page).match(/<link rel="canonical" /g)).toHaveLength(1);
    expect(pageSeo('/').structuredData['@graph']).toContainEqual(expect.objectContaining({ '@type': 'WebSite', name: 'ml-atlas', url: `${SITE_URL}/` }));
  });
});
