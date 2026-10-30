// Routing and per-page search metadata. Used by the app when navigating and
// by scripts/prerender.mjs when it writes a static HTML file for each page.
import { faqs, finishedProjects, services, biography, type Project, type Service } from './data';
import { recaps, type Recap } from './recaps';

export const SITE_URL = 'https://www.robertlazau.com';

export type Tab = 'home' | 'movies' | 'recaps' | 'contact';

export const TAB_ROUTES: Record<Tab, { path: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Robert Lazau — Video & Websites | Golden Boy Productions',
    description:
      'Portland-area director and producer Robert Lazau makes commercials, short films and photos, and builds websites for Gresham and Portland small businesses.',
  },
  movies: {
    path: '/favorite-movies',
    title: 'Favorite Movies | Robert Lazau',
    description:
      'Films that shaped director Robert Lazau, with notes on why they matter. Recommend a movie for Robert to watch next.',
  },
  recaps: {
    path: '/recaps',
    title: 'Project Recaps | Robert Lazau, Golden Boy Productions',
    description:
      'After every project, Robert Lazau talks through the wins, the surprises and what caught him off guard, with behind-the-scenes photos and video.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Robert Lazau | Golden Boy Productions',
    description:
      'Hire Robert Lazau and Golden Boy Productions for a commercial, short film, photography, a website or media consulting in the Portland and Gresham area.',
  },
};

export const ABOUT_PATH = '/about';
export const WORK_PATH = '/work';
export const projectPath = (p: Project) => `/work/${p.slug}`;
export const servicePath = (s: Service) => `/services/${s.slug}`;
export const recapPath = (r: Recap) => `/recaps/${r.slug}`;

export type Page =
  | { kind: 'tab'; tab: Tab }
  | { kind: 'about' }
  | { kind: 'work' }
  | { kind: 'project'; project: Project }
  | { kind: 'service'; service: Service }
  | { kind: 'recap'; recap: Recap };

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export const pageFromPath = (pathname: string): Page => {
  const path = normalizePath(pathname);
  if (path === ABOUT_PATH) return { kind: 'about' };
  if (path === WORK_PATH) return { kind: 'work' };
  const project = finishedProjects.find(p => projectPath(p) === path);
  if (project) return { kind: 'project', project };
  const service = services.find(s => servicePath(s) === path);
  if (service) return { kind: 'service', service };
  const recap = recaps.find(r => recapPath(r) === path);
  if (recap) return { kind: 'recap', recap };
  const tab = (Object.keys(TAB_ROUTES) as Tab[]).find(t => TAB_ROUTES[t].path === path);
  return { kind: 'tab', tab: tab ?? 'home' };
};

// Every page the site serves, in sitemap order.
export const ALL_PATHS: string[] = [
  '/',
  WORK_PATH,
  ABOUT_PATH,
  ...services.map(servicePath),
  ...finishedProjects.map(projectPath),
  TAB_ROUTES.recaps.path,
  ...recaps.map(recapPath),
  TAB_ROUTES.contact.path,
  TAB_ROUTES.movies.path,
];

// The first option that fits within max characters (the last one if none does).
const fit = (max: number, ...options: string[]) => options.find((o) => o.length <= max) ?? options[options.length - 1];

export const pageMeta = (page: Page): { path: string; title: string; description: string } => {
  switch (page.kind) {
    case 'tab':
      return TAB_ROUTES[page.tab];
    case 'about':
      return {
        path: ABOUT_PATH,
        title: 'About Robert Lazau | Director & Producer',
        description:
          'Robert Lazau is a Portland-area director and producer who founded Golden Boy Productions to tell the stories happening in his own community.',
      };
    case 'work':
      return {
        path: WORK_PATH,
        title: 'Work — Films & Websites | Golden Boy Productions',
        description:
          'Selected work by Robert Lazau: commercials, PSAs, nonprofit spotlights and fashion films, plus websites for small businesses in Gresham and Portland.',
      };
    case 'project': {
      const p = page.project;
      return {
        path: projectPath(p),
        // Keep titles to 60 characters and descriptions to 155 so Google shows them whole.
        title: fit(60, `${p.title} — ${p.type} | Robert Lazau`, `${p.title} | Robert Lazau`),
        description: fit(155, `${p.description} By Robert Lazau, Golden Boy Productions.`, `${p.description} By Robert Lazau.`, p.description),
      };
    }
    case 'service':
      return { path: servicePath(page.service), title: page.service.title, description: page.service.description };
    case 'recap': {
      const r = page.recap;
      return {
        path: recapPath(r),
        title: `${r.title} — Project Recap | Robert Lazau`,
        description: r.summary || `Robert Lazau looks back on ${r.title}: the wins, the surprises and what caught him off guard, with behind-the-scenes photos.`,
      };
    }
  }
};

export const canonicalUrl = (path: string) => `${SITE_URL}${path}`;

const ORG = { '@type': 'Organization', name: 'Golden Boy Productions', url: `${SITE_URL}/` };
const PERSON = { '@type': 'Person', name: 'Robert Lazau', url: `${SITE_URL}/` };
const AREA = ['Portland, OR', 'Gresham, OR', 'Fairview, OR', 'Pacific Northwest'];

const breadcrumbs = (items: Array<[string, string]>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: canonicalUrl(path),
  })),
});

// Page-specific structured data, written into the prerendered HTML.
export const pageJsonLd = (page: Page): object[] => {
  switch (page.kind) {
    case 'tab':
      if (page.tab === 'recaps') {
        return [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Project Recaps',
            url: canonicalUrl(TAB_ROUTES.recaps.path),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: recaps.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.title, url: canonicalUrl(recapPath(r)) })),
            },
          },
          breadcrumbs([['Home', '/'], ['Project Recaps', TAB_ROUTES.recaps.path]]),
        ];
      }
      return page.tab === 'home'
        ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }]
        : [];
    case 'about':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          url: canonicalUrl(ABOUT_PATH),
          mainEntity: { ...PERSON, jobTitle: ['Director', 'Producer'], worksFor: ORG, description: biography.text.split('\n\n')[0] },
        },
        breadcrumbs([['Home', '/'], ['About', ABOUT_PATH]]),
      ];
    case 'work':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Work',
          url: canonicalUrl(WORK_PATH),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              ...finishedProjects.map(p => ({ name: p.title, url: canonicalUrl(projectPath(p)) })),
              ...(services.find(s => s.slug === 'web-design')?.sites ?? []).map(s => ({ name: `${s.name} website`, url: s.url })),
            ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
          },
        },
        breadcrumbs([['Home', '/'], ['Work', WORK_PATH]]),
      ];
    case 'project': {
      const p = page.project;
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.title,
          genre: p.type,
          description: p.description,
          url: canonicalUrl(projectPath(p)),
          image: canonicalUrl(p.image),
          dateCreated: p.year,
          creator: PERSON,
          producer: ORG,
          ...(p.client ? { sourceOrganization: { '@type': 'Organization', name: p.client } } : {}),
          ...(p.location ? { locationCreated: { '@type': 'Place', name: p.location } } : {}),
        },
        breadcrumbs([['Home', '/'], ['Work', WORK_PATH], [p.title, projectPath(p)]]),
      ];
    }
    case 'service': {
      const s = page.service;
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          serviceType: s.name,
          description: s.description,
          url: canonicalUrl(servicePath(s)),
          provider: ORG,
          areaServed: AREA,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: s.name,
            itemListElement: s.offerings.map(o => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: o.title, description: o.desc },
            })),
          },
        },
        breadcrumbs([['Home', '/'], [s.name, servicePath(s)]]),
      ];
    }
    case 'recap': {
      const r = page.recap;
      const url = canonicalUrl(recapPath(r));
      const image = r.cover ? (r.cover.startsWith('/') ? canonicalUrl(r.cover) : r.cover) : undefined;
      const project = finishedProjects.find(p => p.slug === r.project);
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${r.title}: Project Recap`,
          description: r.summary,
          url,
          ...(image ? { image } : {}),
          ...(r.date ? { datePublished: r.date } : {}),
          author: PERSON,
          publisher: ORG,
          ...(project ? { about: { '@type': 'CreativeWork', name: project.title, url: canonicalUrl(projectPath(project)) } } : {}),
          ...(r.video && image && r.date
            ? { video: { '@type': 'VideoObject', name: `${r.title}: Project Recap`, description: r.summary || r.title, thumbnailUrl: image, uploadDate: r.date, embedUrl: r.video } }
            : {}),
        },
        breadcrumbs([['Home', '/'], ['Project Recaps', TAB_ROUTES.recaps.path], [r.title, recapPath(r)]]),
      ];
    }
  }
};
