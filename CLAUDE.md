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
| `src/App.tsx` | App shell, header, routes, contact form and custom cursor |
| `src/home.tsx` | The homepage, "Through the O" |
| `src/pages.tsx` | Work, project, service and about pages |
| `src/data.ts` | All content |
| `src/seo.ts` | Routes and meta tags |
| `src/effects.tsx` | Motion effects |
| `src/index.css` | Brand tokens, effect styles and the homepage styles (`.home`) |

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

- **Themes:** every page but the homepage is Overcast (daylight). Wrap a section in `.theme-dark` for "lights down": the footer and the film player. The homepage has its own look; see "The homepage" below.
- **Type:** Golden Boy Gothic, our renamed cut of Special Gothic (SIL OFL), self-hosted in `public/fonts/`. `font-display` = Expanded Bold for headings; `font-sans` = Regular/Medium for text; `font-label` = Condensed Bold for uppercase labels, nav and buttons, tracking `tracking-label` (0.03em). `font-slug` = Courier Prime for sluglines and screenplay-style quotes. No italics, no wide tracking.
- **The sun:** `SunMark` (static, `currentColor`) in `effects.tsx`; files in `public/brand/`. In the font, ☀ (U+2600) is the outline sun and ☼ (U+263C) the solid one.
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
- **Intro card:** `index.html` shows it once per browser session; after that `html.intro-seen` is set. The same head script sets `html.js`, which the homepage zoom needs before first paint.

## The homepage: "Through the O" (Nov 18, 2026)

Robert asked to break from the brand book for the homepage ("go pure creative") and picked this design, so the homepage alone has its own look: true black (`--color-night`, because the letters only knock out the film over pure black), Instrument Serif italic (SIL OFL, `public/fonts/InstrumentSerif-Italic.woff2`) for the spoken lines, gold for the light. The brand-book rules on italics and gold italic lines don't apply on the homepage; they still apply everywhere else.

- **How it works:** each film plays inside its own name: a black layer with white type, `mix-blend-mode: multiply`, over the video. Scrolling scales that layer up around the hole (counter) of one letter until the camera is through it; then the title, text and button come up. Code in `src/home.tsx`, styles under `.home` / `.zoom` in `index.css`.
- **Order:** hero (the reel inside GOLDEN BOY; through the O) → five film chapters (Matman, EMOPI, Armadas Exterior, Hayes Hustle, Strain) → More work (rows; a clip or photo follows the mouse) → What I make (FILMS, PHOTOS, WEBSITES with the work inside the words) → about → FAQ (kept for the FAQ structured data) → LET'S MAKE ONE. with the phone.
- **Header:** on the homepage the site header sits over the hero, slides away as you scroll down and comes back as soon as you scroll up, anywhere on the page (`.home-header`, `data-state` set in `App.tsx`). Robert asked for this on Nov 18: once through the O, the tabs have to be one scroll-up away.
- **H1:** the hero line "Robert Lazau makes films, photos and websites for the people who run Portland.", visible on load. The positioning line ("Films, photos and websites for the people who run Portland.") comes up after the zoom.
- **Content:** `homeHero`, `homeFilms`, `homeMore`, `homeMake`, `homeAbout` in `data.ts`. Videos and posters in `public/home/` (desktop hero 16:9, `hero-portrait.mp4` is a 9:16 center crop for portrait screens). Valentines Model Mash and Hive Recovery Collective are off the homepage (Robert, Nov 18); they're still on the Work page.
- **Adding or swapping a film:** cut a 10–15 s loop of single clean shots (no burned-in titles), 1280x720, CRF 24–26, no audio, `+faststart`, plus a first-frame poster `.webp`; add an entry to `homeFilms` with a `target` letter that has a hole (A, D, O, P, B, R) and its `fit`.
- **`fit`:** the word's width at a 1px font size, so CSS can size it with no JavaScript (`font-size: calc(95.6cqw / var(--fit))`). Measure in the browser console on the site, then round up a hair:
  `s=document.createElement('span');s.style.cssText='font:700 100px "Golden Boy Gothic Expanded";letter-spacing:-0.02em;position:absolute;white-space:nowrap';s.textContent='MATMAN';document.body.append(s);console.log((s.getBoundingClientRect().width/100*1.005).toFixed(2));s.remove()`
- **Hero caption:** `homeHero.cuts` lists the first frame (24 fps) of each shot in `hero.mp4` and its film. Re-cut the reel → update the list.
- **Still versions:** with reduce motion or no JavaScript nothing zooms: the letters show the poster, and all the text sits under them in view. Videos never play with reduce motion or Save-Data, and chapter videos load only near the screen.

## Effects in `src/effects.tsx` (styles in `index.css`)

| Effect | What it does |
| --- | --- |
| `SunMark` | The static sun (outline or `solid`) for the header and footer. |
| `Letterbox` | Widescreen bars open the first time something scrolls into view. |
| `HoverPreview` | A silent clip plays on hover, or when centered on a phone. It loads only then. |
| `Theater` | "Lights down" film player (native `<dialog>`). Esc or a click on the dark area closes it. |
| `useCardGlow` + `.glow-card` | A warm work light follows the mouse on cards. |
| `.focus-grid` | Hover one card and the rest of the grid softens. |
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

- ProfessionalService (a LocalBusiness type) has the profile's phone, `hasMap` and `sameAs`; no street address, since it's a service-area business.
- Armadas Exterior has no project page yet (no full film on YouTube); its homepage button goes to Contact. Add a project once Robert sends the film and its year.
- The Disaster Preparedness ad's storm, rescue and grocery shots look like stock footage, so the homepage uses only its siren, exit-bar and map shots. Ask Robert before using the others.

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

