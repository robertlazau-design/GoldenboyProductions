# RobertLazau.com: notes for Claude

The portfolio site for Robert Lazau, director and producer, and his company Golden Boy Productions. Read this before changing anything.

## How Robert works

- **Never commit to `main`.** Use a feature branch and open a pull request; Robert merges.
- **Keep commits few.** Vercel has a daily build cap, so bundle related changes into one PR.
- **Show the change first.** Before opening a PR, send a side-by-side video (now vs. new) and the gzip size difference.
- **Don't invent facts.** No made-up numbers, client details, awards or quotes. If something is unknown, ask.
- **Client names:** only real clients that already appear on the site and that Robert has confirmed (`clientNames` in `src/data.ts`).

## Stack

- Vite, React 19 and Tailwind CSS 4, hosted on Vercel.
- Every route is prerendered to static HTML by `scripts/prerender.mjs`.
- `npm run build` builds and prerenders. `npm run lint` type-checks.

| File | What's in it |
| --- | --- |
| `src/App.tsx` | App shell, header, home page and custom cursor |
| `src/pages.tsx` | Work, project, service and about pages |
| `src/data.ts` | All content |
| `src/seo.ts` | Routes and meta tags |
| `src/effects.tsx` | Motion effects |
| `src/index.css` | Brand tokens and effect styles |

## Brand (the one place for the look)

The tokens live in `src/index.css`, in `@theme static`. Use the token classes, never hex:

| Token | Value | Use |
| --- | --- | --- |
| `gold` | `#dfb86c` | Accents, thin lines, buttons (`text-gold`, `border-gold/50`) |
| `ink` | `#060606` | The page black (`bg-ink`) |
| `paper` | `#f5f5f5` | Headline white (`text-paper`) |

- **Type:** Playfair Display (`font-serif`) for headings, with italics for accents. Inter (`font-sans`) for body text and small uppercase labels with wide tracking.
- **Feel:** dark and cinematic. Film grain, a lot of black space, thin gold rules. It should feel like a title sequence, not an app.

## Motion rules

- **Easing:** `--ease-cinematic` (`cubic-bezier(0.16, 1, 0.3, 1)`, or `[0.16, 1, 0.3, 1]` in motion/react) for reveals and entrances. `--ease-cut` (`cubic-bezier(0.76, 0, 0.24, 1)`) for things that open or close.
- **What to animate:** only `transform` and `opacity`, plus SVG stroke offsets. Never animate layout.
- **Reduce motion:** every effect needs a `prefers-reduced-motion` fallback that shows the finished state.
- **Mouse-only effects:** put them behind `(hover: hover) and (pointer: fine)`.
- **Text:** keep all of it in the prerendered HTML. Never hide content until JavaScript runs.
- **Libraries:** don't add animation libraries. `motion` is already in the bundle.
- **Phones:** check that nothing makes the page scroll sideways (`scrollWidth` must equal the viewport width).
- **Hero timing** follows the intro card in `index.html`. When the intro is skipped, `html.intro-seen` is set and everything starts sooner. First-visit times:

| Effect | Starts at |
| --- | --- |
| Logo draws | 1.05 s |
| Name reveal | 1.45 s |
| Spotlight | 1.5 s |
| Light sweep on the title | 3.3 s |

## Effects in `src/effects.tsx` (styles in `index.css`)

| Effect | What it does |
| --- | --- |
| `LogoMark` | Hero logo, rebuilt as an SVG from the 2048px master. It draws itself. |
| `RevealWords` | The name comes up word by word. |
| `.hero-spotlight` | A CSS projector beam that lands on the name. |
| `.shine-text` | One light sweep across "Director & Producer". |
| `Letterbox` | Widescreen bars open the first time something scrolls into view. |
| `HoverPreview` | A silent clip plays on hover, or when centered on a phone. It loads only then. |
| `Theater` | "Lights down" film player (native `<dialog>`). Esc or a click on the dark area closes it. |
| `useCardGlow` + `.glow-card` | A gold light follows the mouse on cards. |
| `.focus-grid` | Hover one card and the rest of the grid softens. |
| `MagneticLink` | Buttons lean toward the cursor. |
| `ClientStrip` | A slow marquee of client names. |
| `data-cursor` | The custom cursor shows a word: `Play` (plays here), `Watch` (opens a film page), `View` (opens a website). |

## Adding a preview clip

1. Cut a single shot of 2.5–4 s with no cuts in it, no audio and nothing sensitive in the frame.
2. Encode it with ffmpeg:

   ```bash
   ffmpeg -ss <start> -t <len> -i in.mp4 -map 0:v:0 -an -map_metadata -1 \
     -vf "scale=960:540,format=yuv420p" -c:v libx264 -profile:v high \
     -preset slow -crf 28 -movflags +faststart public/work/clips/<slug>.mp4
   ```

   Use 960x600 for 16:10 crops, and CRF 30–31 for busy drone footage.
3. Set `preview: "/work/clips/<slug>.mp4"` on the project in `src/data.ts`.

## Known to-dos

- Small labels in white/40 fail color contrast (axe `color-contrast`).
- Add LocalBusiness structured data once the Google Business Profile is verified.
- The home page title and H1 need location keywords.

## Lead events

- `src/leadEvents.ts` counts taps as Vercel Web Analytics custom events (Pro plan): `Call Click`, `Text Click`, `Email Click`, `Directions Click` and `Instagram Click`, from one click listener started in `src/main.tsx`. Properties: `page` and `spot` (nearest `data-spot`, else header/nav, footer, the section id, or page).
- The contact form (`handleContactSubmit` in `src/App.tsx`) sends `Form Sent` (page + project type) when EmailJS accepts it, and `Form Error` (page) when it doesn't.
- Two properties per event at most (Pro's limit). Never put names, emails or messages in an event.

