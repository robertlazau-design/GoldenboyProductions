// Per-page search metadata. Used by the app when switching tabs and by
// scripts/prerender.mjs when it writes a static HTML file for each page.

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

export const tabFromPath = (pathname: string): Tab => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.keys(TAB_ROUTES) as Tab[]).find(tab => TAB_ROUTES[tab].path === clean);
  return match ?? 'home';
};

export const canonicalUrl = (tab: Tab) => `${SITE_URL}${TAB_ROUTES[tab].path}`;
