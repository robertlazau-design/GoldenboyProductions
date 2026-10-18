// Project recaps: one page per finished project, with the recap interview,
// what went well, what surprised Robert, what caught him off guard, and
// behind-the-scenes photos.
//
// Each recap is a Markdown file in src/recaps/ (copy _TEMPLATE.md). The part
// between the --- lines holds the details; below it, each "## Heading" starts
// a section. A section called "Photos" lists one photo per line:
//   file-name.jpg | Caption
// Photos go in public/recaps/<recap file name>/. Files whose names start
// with "_" are ignored.

export type RecapPhoto = { src: string; caption: string };
export type RecapSection = { heading: string; paragraphs: string[] };

export type Recap = {
  slug: string;
  title: string;
  project: string;
  client: string;
  date: string;
  summary: string;
  video: string;
  cover: string;
  photographer: string;
  sections: RecapSection[];
  photos: RecapPhoto[];
};

const files = import.meta.glob('./recaps/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const isAbsolute = (s: string) => /^https?:\/\//.test(s) || s.startsWith('/');

// Accepts a YouTube link, a Google Drive share link or a video file URL,
// and returns something a page can embed.
export const embedUrl = (url: string): string => {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
};

const parse = (path: string, raw: string): Recap | null => {
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
  const local = (file: string) => (!file || isAbsolute(file) ? file : `/recaps/${slug}/${file}`);

  const sections: RecapSection[] = [];
  const photos: RecapPhoto[] = [];
  for (const block of ('\n' + match[2]).split(/\n##\s+/).slice(1)) {
    const [headingLine, ...rest] = block.split('\n');
    const heading = headingLine.trim();
    const text = rest.join('\n').trim();
    if (/^photos$/i.test(heading)) {
      for (const line of text.split('\n')) {
        const clean = line.replace(/^[-*]\s*/, '').trim();
        if (!clean) continue;
        const [file, ...caption] = clean.split('|');
        photos.push({ src: local(file.trim()), caption: caption.join('|').trim() });
      }
      continue;
    }
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean);
    if (heading && paragraphs.length) sections.push({ heading, paragraphs });
  }

  return {
    slug,
    title: meta.title,
    project: meta.project ?? '',
    client: meta.client ?? '',
    date: meta.date ?? '',
    summary: meta.summary ?? '',
    video: embedUrl(meta.video ?? ''),
    cover: local(meta.cover ?? '') || photos[0]?.src || '',
    photographer: meta.photographer ?? '',
    sections,
    photos,
  };
};

export const recaps: Recap[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .filter((r): r is Recap => r !== null)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const formatRecapDate = (date: string) => {
  const d = new Date(`${date}T12:00:00Z`);
  return isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};
