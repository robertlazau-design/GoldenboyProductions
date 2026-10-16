// Film reviews for the Favorite Movies tab.
//
// Each review is a Markdown file in src/reviews/ (copy _TEMPLATE.md). The part
// between the --- lines holds the details; everything below it is the review,
// with a blank line between paragraphs. Files whose names start with "_" are
// ignored. Cover images go in public/reviews/ and are referenced by file name.

export type Review = {
  slug: string;
  title: string;
  director: string;
  year: string;
  runtime: string;
  rating: string;
  cover: string;
  date: string;
  body: string;
};

const files = import.meta.glob('./reviews/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const parse = (path: string, raw: string): Review | null => {
  const slug = (path.split('/').pop() ?? '').replace(/\.md$/, '');
  if (!slug || slug.startsWith('_')) return null;
  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  if (!meta.title) return null;
  const cover = meta.cover ?? '';
  return {
    slug,
    title: meta.title,
    director: meta.director ?? '',
    year: meta.year ?? '',
    runtime: meta.runtime ?? '',
    rating: (meta.rating ?? '').replace(/\/\s*10$/, '').trim(),
    cover: !cover || /^https?:\/\//.test(cover) || cover.startsWith('/') ? cover : `/reviews/${cover}`,
    date: meta.date ?? '',
    body: match[2]
      .trim()
      .split(/\n\s*\n/)
      .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n'),
  };
};

export const reviews: Review[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .filter((r): r is Review => r !== null)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
