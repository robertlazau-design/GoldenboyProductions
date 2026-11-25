// Routing and per-page search metadata. Used by the app when navigating and
// by scripts/prerender.mjs when it writes a static HTML file for each page.
import { faqs, finishedProjects, recentWork, services, biography, trades, type Project, type Service } from './data';
import { recaps, type Recap } from './recaps';

export const SITE_URL = 'https://www.robertlazau.com';

export type Tab = 'home' | 'movies' | 'recaps' | 'contact';

// Tabs taken off the site for now: hidden from the menus and the sitemap, and
// vercel.json sends their old URLs elsewhere. Remove a tab from this list (and
// its redirect in vercel.json) to bring it back.
export const HIDDEN_TABS: Tab[] = ['movies', 'recaps'];
export const isTabShown = (tab: Tab) => !HIDDEN_TABS.includes(tab);

export const TAB_ROUTES: Record<Tab, { path: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Golden Boy Productions | Video Production & Websites in Portland, OR',
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
export const TRADES_PATH = '/trucking-towing-trades';
export const projectPath = (p: Project) => `/work/${p.slug}`;
export const servicePath = (s: Service) => `/services/${s.slug}`;
export const recapPath = (r: Recap) => `/recaps/${r.slug}`;

export type Page =
  | { kind: 'tab'; tab: Tab }
  | { kind: 'about' }
  | { kind: 'work' }
  | { kind: 'trades' }
  | { kind: 'project'; project: Project }
  | { kind: 'service'; service: Service }
  | { kind: 'recap'; recap: Recap };

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export const pageFromPath = (pathname: string): Page => {
  const path = normalizePath(pathname);
  if (path === ABOUT_PATH) return { kind: 'about' };
  if (path === WORK_PATH) return { kind: 'work' };
  if (path === TRADES_PATH) return { kind: 'trades' };
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
  TRADES_PATH,
  ...finishedProjects.map(projectPath),
  ...(isTabShown('recaps') ? [TAB_ROUTES.recaps.path, ...recaps.map(recapPath)] : []),
  TAB_ROUTES.contact.path,
  ...(isTabShown('movies') ? [TAB_ROUTES.movies.path] : []),
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
        title: 'Work: Films, Photos & Websites | Golden Boy Productions',
        description:
          'Recent work by Robert Lazau, newest first: commercial films, photo shoots and websites for businesses in Gresham and Portland, plus earlier PSAs and films.',
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
    case 'trades':
      return {
        path: TRADES_PATH,
        title: fit(60, 'Websites & Video for Trucking, Towing & Trades | Golden Boy', 'Trucking, Towing & Trades Websites | Golden Boy'),
        description: fit(155,
          'Websites, films and photos for trucking, towing and trade businesses in Portland and Gresham, by Robert Lazau: Matman Trucking, Tow Guys, FX4 and more.',
          'Websites, films and photos for trucking, towing and trade businesses in Portland and Gresham, by Robert Lazau of Golden Boy Productions.'),
      };
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
const AREA = ['Portland, OR', 'Gresham, OR', 'Fairview, OR', 'Pacific Northwest', 'Tigard, OR', 'Oregon'];

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
              ...recentWork.map(r => ({ name: r.kinds.includes('website') ? `${r.title} website` : r.title, url: r.url })),
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
    case 'trades':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Websites and video for trucking, towing and trade businesses',
          url: canonicalUrl(TRADES_PATH),
          about: ['Trucking', 'Towing', 'Skilled trades'].map(name => ({ '@type': 'Thing', name })),
          provider: ORG,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: trades.work.map((w, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${w.name}: ${w.what}`,
              ...(w.to ? { url: w.to.startsWith('/') ? canonicalUrl(w.to) : w.to } : {}),
            })),
          },
        },
        breadcrumbs([['Home', '/'], ['Trucking, Towing & Trades', TRADES_PATH]]),
      ];
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
            itemListElement: [
              ...(s.packages ?? []).map(pk => ({
                '@type': 'Offer',
                name: `${pk.name} website package`,
                price: pk.price,
                priceCurrency: 'USD',
                description: pk.summary,
                itemOffered: { '@type': 'Service', name: `${pk.name} website`, description: pk.items.join('; ') },
              })),
              ...s.offerings.map(o => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: o.title, description: o.desc },
              })),
            ],
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
