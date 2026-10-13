// Server entry used at build time by scripts/prerender.mjs to write a static
// HTML file for every page, so crawlers and link previews get real content.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export { ALL_PATHS, SITE_URL, canonicalUrl, pageFromPath, pageMeta, pageJsonLd } from './seo';

export const render = (path: string) =>
  renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
