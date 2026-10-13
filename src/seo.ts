// Routing and per-page search metadata. Used by the app when navigating and
// by scripts/prerender.mjs when it writes a static HTML file for each page.
import { faqs, finishedProjects, services, biography, type Project, type Service } from './data';

export const SITE_URL = 'https://www.robertlazau.com';

export type Tab = 'home' | 'movies' | 'bts' | 'contact';

export const TAB_ROUTES: Record<Tab, { path: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Robert Lazau — Director & Producer | Golden Boy Productions',
    description:
      'Robert Lazau is a Portland-area director and producer and the founder of Golden Boy Productions, making commercials, short films and photography for brands, nonprofits and cities.',
  },
  movies: {
    path: '/favorite-movies',
    title: 'Favorite Movies | Robert Lazau',
    description:
      'Films that shaped director Robert Lazau, with notes on why they matter. Recommend a movie for Robert to watch next.',
  },
  bts: {
    path: '/behind-the-scenes',
    title: 'Behind the Scenes | Robert Lazau — Golden Boy Productions',
    description:
      'On-set photos and clips from Golden Boy Productions shoots: interviews, studio fashion shoots, commercials and short films around Portland, Oregon.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Robert Lazau | Golden Boy Productions',
    description:
      'Hire Robert Lazau and Golden Boy Productions for a commercial, short film, photography or media consulting in the Portland area. Send a message or email directly.',
  },
};

export const ABOUT_PATH = '/about';
export const projectPath = (p: Project) => `/work/${p.slug}`;
export const servicePath = (s: Service) => `/services/${s.slug}`;

export type Page =
  | { kind: 'tab'; tab: Tab }
  | { kind: 'about' }
  | { kind: 'project'; project: Project }
  | { kind: 'service'; service: Service };

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export const pageFromPath = (pathname: string): Page => {
  const path = normalizePath(pathname);
  if (path === ABOUT_PATH) return { kind: 'about' };
  const project = finishedProjects.find(p => projectPath(p) === path);
  if (project) return { kind: 'project', project };
  const service = services.find(s => servicePath(s) === path);
  if (service) return { kind: 'service', service };
  const tab = (Object.keys(TAB_ROUTES) as Tab[]).find(t => TAB_ROUTES[t].path === path);
  return { kind: 'tab', tab: tab ?? 'home' };
};

// Every page the site serves, in sitemap order.
export const ALL_PATHS: string[] = [
  '/',
  ABOUT_PATH,
  ...services.map(servicePath),
  ...finishedProjects.map(projectPath),
  TAB_ROUTES.bts.path,
  TAB_ROUTES.contact.path,
  TAB_ROUTES.movies.path,
];

export const pageMeta = (page: Page): { path: string; title: string; description: string } => {
  switch (page.kind) {
    case 'tab':
      return TAB_ROUTES[page.tab];
    case 'about':
      return {
        path: ABOUT_PATH,
        title: 'About Robert Lazau | Director & Producer, Golden Boy Productions',
        description:
          'Robert Lazau is a Portland-area director and producer who founded Golden Boy Productions to tell the stories happening in his own community.',
      };
    case 'project': {
      const p = page.project;
      return {
        path: projectPath(p),
        title: `${p.title} — ${p.type} | Robert Lazau`,
        description: `${p.description} ${p.role}: Robert Lazau, Golden Boy Productions.`,
      };
    }
    case 'service':
      return { path: servicePath(page.service), title: page.service.title, description: page.service.description };
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
        breadcrumbs([['Home', '/'], [p.title, projectPath(p)]]),
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
  }
};
