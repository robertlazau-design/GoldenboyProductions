# RobertLazau.com: notes for Claude

The portfolio site for Robert Lazau, director and producer, and his company Golden Boy Productions. Read this before changing anything.

## How Robert works

- **Never commit to `main`.** Use a feature branch and open a pull request; Robert merges.
- **Keep commits few.** Vercel has a daily build cap, so bundle related changes into one PR.
- **Show the change first.** Before opening a PR, send a side-by-side video (now vs. new) and the gzip size difference.
- **Don't invent facts.** No made-up numbers, client details, awards or quotes. If something is unknown, ask.
- **Client names:** only real clients that already appear on the site and that Robert has confirmed (`clientNames` in `src/data.ts`).

## Business details (match the Google Business Profile)

These match Golden Boy Productions' verified Google Business Profile. Use them exactly, and change them only when the profile changes. They live in `business` in `src/data.ts` (header, footer, Contact page) and in the Organization and ProfessionalService JSON-LD in `index.html`.

| Field | Value |
| --- | --- |
| Name | Golden Boy Productions |
| Address | None. It's a service-area business, so never add a street address. |
| Phone (shown) | (503) 863-8966 |
| Phone (link) | `tel:+15038638966` |
| Phone (JSON-LD) | `"+1-503-863-8966"` |
| Google profile | https://maps.google.com/?cid=2653123704889832847 (`hasMap` and `sameAs`) |
| Google review link | https://g.page/r/CY91IOfzydEkECE/review |
| LinkedIn | https://www.linkedin.com/company/golden-boy-productions/ |
| Golden Boy Instagram | https://www.instagram.com/goldenboyproductionss/ |
| Robert's Instagram | https://www.instagram.com/robertrgb/ (Person `sameAs`, with IMDb) |
| Service area on the profile | Oregon, Tigard, Gresham, Portland |

- The review link is for everyone who worked with us. No screening and no "happy clients only" wording.
- Label the two Instagrams clearly: "Golden Boy on Instagram" and "Robert on Instagram".
- `areaServed` keeps its older entries (Fairview, Pacific Northwest) and adds the profile's (Tigard, Oregon). Change it in both `index.html` and `AREA` in `src/seo.ts`.

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

Brand v2, "Work Light" (Nov 2026). Full brand book: the Golden Boy Productions design system (https://claude.ai/artifact/RPwLHPjmLXq4EngjVhq98X). The tokens live in `src/index.css`. Use the token classes, never hex:

| Token | Overcast (default) | `.theme-dark` | Use |
| --- | --- | --- | --- |
| `ground` | `#ecebe6` | `#191a17` | Page background (`bg-ground`) |
| `ground-raised` | `#f6f5f1` | `#24251f` | Cards and form fields |
| `ink` | `#191a17` | `#ecebe6` | Text (`text-ink`), 14.6:1 |
| `ink-muted` | `#4a4b46` | `#b9b8b1` | Secondary text. Never lighter, never `ink/40`-style opacity for text |
| `line` | asphalt 18% | overcast 20% | Rules and card borders (`border-line`) |
| `accent` | `#6b5000` brass | `#ebb517` gold | Gold when it has to be text: links, hovers, icons |
| `sun` | `#ebb517` | same | October Gold. Fills only: buttons, slugline tape, the sun. Never text on Overcast (1.6:1) |
| `on-sun` | `#191a17` | same | Text on a `sun` fill |

Also `overcast`, `asphalt`, `aluminum`, `slate`, `hi-vis` as fixed palette colors.

- **Themes:** the page is Overcast (daylight). Wrap a section in `.theme-dark` for "lights down": the home header and hero, the footer, the film player.
- **Type:** Golden Boy Gothic, our renamed cut of Special Gothic (SIL OFL), self-hosted in `public/fonts/`. `font-display` = Expanded Bold for headings; `font-sans` = Regular/Medium for text; `font-label` = Condensed Bold for uppercase labels, nav and buttons, tracking `tracking-label` (0.03em). `font-slug` = Courier Prime for sluglines and screenplay-style quotes. No italics, no wide tracking.
- **The sun:** `SunMark` (static, `currentColor`) and `LogoMark` (draws itself) in `effects.tsx`; files in `public/brand/`. In the font, ☀ (U+2600) is the outline sun and ☼ (U+263C) the solid one.
- **Slugline tape:** `.slug` in `index.css`. Real places and times only: `EXT. TRUCK YARD - GRESHAM, OR - MORNING`.
- **Never:** gold italic accent words, tiny caps tracked wide, corner crop marks, gradients or glows as decoration, fake film grain, metallic gold. (A scrim over a photo is fine.)
- **Feel:** daylight, crew not agency. It should feel like a call sheet and a truck door, not a luxury title sequence.

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
| `LogoMark` | Hero sun mark, rebuilt as an SVG from the 2048px master, in `currentColor` with the v2 sturdy line. It draws itself. |
| `SunMark` | The static sun (outline or `solid`) for the header and footer. |
| `RevealWords` | The name comes up word by word. |
| `.hero-spotlight` | A CSS projector beam that lands on the name. |
| `.shine-text` | One light sweep across "Director & Producer". |
| `Letterbox` | Widescreen bars open the first time something scrolls into view. |
| `HoverPreview` | A silent clip plays on hover, or when centered on a phone. It loads only then. |
| `Theater` | "Lights down" film player (native `<dialog>`). Esc or a click on the dark area closes it. |
| `useCardGlow` + `.glow-card` | A warm work light follows the mouse on cards. |
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

- The home page H1 needs location keywords (the title got them in Nov 2026).
- ProfessionalService (a LocalBusiness type) has the profile's phone, `hasMap` and `sameAs`; no street address, since it's a service-area business.

## Lead events

- `src/leadEvents.ts` counts taps as Vercel Web Analytics custom events (Pro plan): `Call Click`, `Text Click`, `Email Click`, `Review Click`, `Google Profile Click`, `Directions Click` and `Instagram Click`, from one click listener started in `src/main.tsx`. Properties: `page` and `spot` (nearest `data-spot`, else footer, header/nav, the section id, or page).
- The Google profile link (`maps.google.com/?cid=…`) counts as `Google Profile Click`, not `Directions Click`. Both Instagram links count as `Instagram Click`.
- The contact form (`handleContactSubmit` in `src/App.tsx`) sends `Form Sent` (page + project type) when EmailJS accepts it, and `Form Error` (page) when it doesn't.
- Two properties per event at most (Pro's limit). Never put names, emails or messages in an event.

## Google Ads tracking

| What | Value |
| --- | --- |
| Google tag (in `index.html`, right after `<head>`) | `GTM-NVZ26P6K` |
| Google Ads account | `AW-18579845176` |
| Contact form conversion label | `AW-18579845176/6tqtCK2U9rkdELjgx5tF` |
| Phone tap conversion label | `AW-18579845176/hNhLCLCU9rkdELjgx5tF` |

- Use the tag and conversion snippets exactly as Google gave them. No GA4, enhanced conversions or other Google add-ons unless Robert asks.
- `trackAdsConversion` in `src/leadEvents.ts` is the only code that calls `gtag`. It checks `typeof window.gtag === 'function'` first and never throws, so an ad blocker can't cause errors.
- Contact conversion: fired in `handleContactSubmit` (`src/App.tsx`) only after EmailJS accepts the message, once per send. Never on the button click or on an error.
- Phone conversion: the site-wide click listener fires it on every `tel:` tap (header, footer, Contact), next to the Vercel `Call Click` event.
- Each prerendered page must have the Google tag exactly once. Never test by sending a real message through the form.
- There's no Content-Security-Policy today. If one is added, allow the hosts in Google's CSP guide for the Google tag.
- There's no privacy page. If one is added, it should say the site uses Google Ads measurement.

