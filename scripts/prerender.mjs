// Runs after `vite build` and the SSR build: renders every page to its own
// HTML file with page-specific title, description, canonical and social tags,
// and writes the sitemap. Vercel's cleanUrls serves /contact from contact.html.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const { render, TAB_ROUTES, canonicalUrl, SITE_URL, faqs } = await import(
  path.resolve('dist-server/entry-server.js')
);

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const setTag = (html, pattern, value) => {
  if (!pattern.test(html)) throw new Error(`prerender: tag not found in template: ${pattern}`);
  return html.replace(pattern, (_, before, after) => `${before}${escapeHtml(value)}${after}`);
};

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

for (const [tab, route] of Object.entries(TAB_ROUTES)) {
  const url = canonicalUrl(tab);
  let html = template;
  html = setTag(html, /(<title>)[^<]*(<\/title>)/, route.title);
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, route.description);
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, route.title);
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, route.description);
  html = setTag(html, /(<meta name="twitter:url" content=")[^"]*(")/, url);
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, route.title);
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, route.description);
  html = html.replace(
    '<!--page-jsonld-->',
    tab === 'home' ? `<script type="application/ld+json">${faqJsonLd}</script>` : '',
  );
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found');
  html = html.replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`);

  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  fs.writeFileSync(path.join(DIST, file), html);
  console.log(`prerendered ${route.path} -> ${file}`);
}

const today = new Date().toISOString().slice(0, 10);
const priority = { home: '1.0', contact: '0.8', bts: '0.7', movies: '0.5' };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(TAB_ROUTES)
  .map(
    (tab) => `  <url>
    <loc>${canonicalUrl(tab)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority[tab] ?? '0.5'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
console.log(`wrote sitemap.xml for ${SITE_URL}`);
