// The homepage, "Through the O" (Nov 2026). Robert's films play inside giant
// letters, and scrolling flies the camera through the hole in one letter (its
// counter) and into the film. Robert asked to break from the brand book here,
// so this page has its own look; styles are under .home in index.css, words
// and files in data.ts (homeHero, homeFilms, homeMore, homeMake, homeAbout).
//
// Motion rules still hold: transform and opacity only, every bit of text is in
// the prerendered HTML, and with reduce motion (or no JavaScript) the page sits
// still with everything in view. Videos load only near the screen.
import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { biography, business, homeAbout, homeFilms, homeHero, homeMake, homeMore, type HomeFilm } from './data';
import { finePointer, reducedMotion, saveData } from './effects';
import type { LinkTo } from './pages';
import robertBackground from '../assets/robert_background.jpg';

type Fit = React.CSSProperties & { '--fit': number };
const fit = (n: number): Fit => ({ '--fit': n });

// A word with one letter marked as the way through.
function Word({ word, target }: { word: string; target?: number }) {
  if (target === undefined) return <>{word}</>;
  return (
    <>
      {word.slice(0, target)}
      <span data-target>{word[target]}</span>
      {word.slice(target + 1)}
    </>
  );
}

function Zoom({
  kind,
  id,
  label,
  spot,
  height,
  video,
  knock,
  frame,
  hint,
  after,
}: {
  kind: 'hero' | 'chapter';
  id?: string;
  label: string;
  spot: string;
  height: string;
  video: React.ReactNode;
  knock: React.ReactNode;
  frame: React.ReactNode;
  hint: string;
  after: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`zoom zoom-${kind}`}
      data-zoom={kind}
      data-spot={spot}
      aria-label={label}
      style={{ '--zoom-h': height } as React.CSSProperties}
    >
      <div className="zoom-stage">
        {video}
        <div className="zoom-frame">
          <div className="zoom-knock" aria-hidden="true">
            {knock}
          </div>
          {frame}
          <p className="zoom-hint zoom-fade home-serif" aria-hidden="true">
            {hint} &darr;
          </p>
        </div>
        <div className="zoom-shade" />
        <div className="zoom-after">{after}</div>
      </div>
    </section>
  );
}

function Chapter({ film, link }: { film: HomeFilm; link: LinkTo }) {
  const letter = film.word[film.target];
  return (
    <Zoom
      kind="chapter"
      label={film.title}
      spot={`home-${film.word.split(' ')[0].toLowerCase()}`}
      height="210vh"
      video={
        <video
          className="zoom-reel"
          data-src={film.loop}
          poster={film.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      }
      knock={
        <span className="zoom-word" style={fit(film.fit)}>
          <Word word={film.word} target={film.target} />
        </span>
      }
      frame={
        <>
          <p className="zoom-kicker zoom-fade home-mono">{film.kicker}</p>
          <div className="zoom-lede zoom-fade">
            <p className="zoom-lede-line home-serif">{film.lede}</p>
          </div>
        </>
      }
      hint={`through the ${letter}`}
      after={
        <>
          <div>
            <p className="zoom-who home-serif">{film.who}</p>
            <h2 className="zoom-title">{film.title}</h2>
            <p className="zoom-text">{film.text}</p>
          </div>
          <a {...link(film.to)} className="home-btn" data-cursor={film.cursor}>
            {film.cta} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </>
      }
    />
  );
}

// ── Find the hole in a letter (its counter) to fly through ────────────────
// Draws the letter on a canvas, floods the outside from the edges, and takes
// the middle of the largest enclosed white area. Returns its centre in the
// letter's own box, and its size, in CSS pixels.
function counterOf(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const fs = 300;
  const canvas = document.createElement('canvas');
  const g = canvas.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  const font = `700 ${fs}px ${cs.fontFamily}`;
  g.font = font;
  const m = g.measureText(el.textContent ?? '');
  const W = Math.ceil(m.width) + 4;
  const H = Math.ceil(m.fontBoundingBoxAscent + m.fontBoundingBoxDescent) + 4;
  canvas.width = W;
  canvas.height = H;
  g.font = font;
  g.fillStyle = '#fff';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#000';
  g.textBaseline = 'alphabetic';
  g.fillText(el.textContent ?? '', 0, m.fontBoundingBoxAscent);
  const d = g.getImageData(0, 0, W, H).data;
  const ink = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) ink[i] = d[i * 4] < 128 ? 1 : 0;
  const seen = new Uint8Array(W * H);
  const flood = (sx: number, sy: number) => {
    const stack = [sy * W + sx];
    const pts: number[] = [];
    while (stack.length) {
      const k = stack.pop()!;
      if (seen[k] || ink[k]) continue;
      seen[k] = 1;
      pts.push(k);
      const x = k % W;
      const y = (k / W) | 0;
      if (x > 0) stack.push(k - 1);
      if (x < W - 1) stack.push(k + 1);
      if (y > 0) stack.push(k - W);
      if (y < H - 1) stack.push(k + W);
    }
    return pts;
  };
  for (let x = 0; x < W; x++) {
    flood(x, 0);
    flood(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    flood(0, y);
    flood(W - 1, y);
  }
  let best: number[] = [];
  for (let i = 0; i < W * H; i++) {
    if (!seen[i] && !ink[i]) {
      const pts = flood(i % W, (i / W) | 0);
      if (pts.length > best.length) best = pts;
    }
  }
  if (!best.length) return null;
  let sx = 0;
  let sy = 0;
  for (const k of best) {
    sx += k % W;
    sy += (k / W) | 0;
  }
  const r = parseFloat(cs.fontSize) / fs;
  return { x: (sx / best.length) * r, y: (sy / best.length) * r, size: Math.sqrt(best.length) * r };
}

// ── Scroll: fly through the letter, then bring up the words ───────────────
function useThroughTheO(root: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const host = root.current;
    if (!host) return;
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const zooms = [...host.querySelectorAll<HTMLElement>('[data-zoom]')].map(sec => ({
      sec,
      hero: sec.dataset.zoom === 'hero',
      knock: sec.querySelector<HTMLElement>('.zoom-knock')!,
      target: sec.querySelector<HTMLElement>('[data-target]')!,
      fades: [...sec.querySelectorAll<HTMLElement>('.zoom-fade')],
      after: sec.querySelector<HTMLElement>('.zoom-after')!,
      shade: sec.querySelector<HTMLElement>('.zoom-shade')!,
      maxScale: 40,
    }));
    let frame = 0;
    let live = false;

    const clear = () => {
      for (const z of zooms) {
        for (const el of [z.knock, z.after, z.shade, ...z.fades]) {
          el.style.transform = '';
          el.style.opacity = '';
        }
      }
    };

    const update = () => {
      frame = 0;
      for (const z of zooms) {
        const travel = z.sec.offsetHeight - window.innerHeight;
        const start = z.hero ? 0.08 : 0.12;
        const len = z.hero ? 0.6 : 0.55;
        // A screen taller than the section (or a crawler's tall window): show the finished state.
        const p = travel > 0 ? Math.min(1, Math.max(0, -z.sec.getBoundingClientRect().top / travel)) : 1;
        const q = p < start ? 0 : Math.min(1, (p - start) / len);
        z.knock.style.transform = `scale(${1 + Math.pow(q, 3.2) * z.maxScale})`;
        z.knock.style.opacity = q >= 0.999 ? '0' : '1';
        const fade = String(Math.max(0, 1 - q * 3));
        for (const el of z.fades) el.style.opacity = fade;
        const a = Math.max(0, Math.min(1, (p - (start + len * 0.95)) / 0.14));
        z.after.style.opacity = String(a);
        z.after.style.transform = `translateY(${(1 - a) * 24}px)`;
        z.shade.style.opacity = String(a);
      }
    };
    const onScroll = () => {
      if (live && !frame) frame = requestAnimationFrame(update);
    };

    // Aim each zoom at the middle of its letter's hole.
    const aim = () => {
      live = motionOk.matches;
      if (!live) {
        clear();
        return;
      }
      for (const z of zooms) {
        z.knock.style.transform = 'none';
        const kr = z.knock.getBoundingClientRect();
        const tr = z.target.getBoundingClientRect();
        const c = counterOf(z.target) ?? { x: tr.width / 2, y: tr.height / 2, size: tr.width / 3 };
        z.knock.style.transformOrigin = `${tr.left - kr.left + c.x}px ${tr.top - kr.top + c.y}px`;
        z.maxScale = (Math.hypot(window.innerWidth, window.innerHeight) / Math.max(8, c.size)) * 1.9;
      }
      update();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(aim, 150);
    };
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) aim();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    motionOk.addEventListener('change', aim);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      motionOk.removeEventListener('change', aim);
      clear();
    };
  }, [root]);
}

// ── Videos: play only near the screen; never with reduce motion or Save-Data ──
function useFilms(root: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === 'undefined') return;
    const videos = [...host.querySelectorAll<HTMLVideoElement>('video.zoom-reel, video.make-film')];
    const still = () => reducedMotion() || saveData();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !still()) {
            v.muted = true;
            if (v.dataset.src && !v.getAttribute('src')) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: '300px 0px' },
    );
    videos.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, [root]);
}

// ── The hero caption names the film on screen ─────────────────────────────
function useHeroCaption(video: React.RefObject<HTMLVideoElement | null>, caption: React.RefObject<HTMLSpanElement | null>) {
  React.useEffect(() => {
    const v = video.current;
    const out = caption.current;
    if (!v || !out) return;
    let frame = 0;
    let shown = '';
    const tick = () => {
      const f = Math.floor(v.currentTime * 24);
      let name = homeHero.cuts[0][1];
      for (const [start, film] of homeHero.cuts) if (f >= start) name = film;
      if (name !== shown) out.textContent = shown = name;
      frame = v.paused ? 0 : requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    v.addEventListener('playing', run);
    v.addEventListener('seeked', run);
    if (!v.paused) run();
    return () => {
      cancelAnimationFrame(frame);
      v.removeEventListener('playing', run);
      v.removeEventListener('seeked', run);
    };
  }, [video, caption]);
}

// ── More work: a clip or photo follows the mouse over each row ─────────────
function useMoreWorkPeek(list: React.RefObject<HTMLUListElement | null>, peek: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const rows = list.current;
    const box = peek.current;
    const inner = box?.firstElementChild as HTMLElement | null;
    if (!rows || !box || !inner || !finePointer()) return;
    const show = (src: string) => {
      inner.replaceChildren();
      if (/\.mp4$/.test(src) && !reducedMotion() && !saveData()) {
        const v = document.createElement('video');
        Object.assign(v, { src, muted: true, loop: true, playsInline: true, autoplay: true });
        inner.append(v);
      } else if (!/\.mp4$/.test(src)) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        inner.append(img);
      } else {
        return;
      }
      inner.classList.add('on');
    };
    const hide = () => {
      inner.classList.remove('on');
      inner.querySelector('video')?.pause();
    };
    const move = (e: PointerEvent) => {
      box.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    const enter = (e: Event) => {
      const a = (e.currentTarget as HTMLElement).dataset.peek;
      if (a) show(a);
    };
    const anchors = [...rows.querySelectorAll<HTMLAnchorElement>('a[data-peek]')];
    anchors.forEach(a => {
      a.addEventListener('pointerenter', enter);
      a.addEventListener('pointerleave', hide);
    });
    rows.addEventListener('pointermove', move, { passive: true });
    return () => {
      anchors.forEach(a => {
        a.removeEventListener('pointerenter', enter);
        a.removeEventListener('pointerleave', hide);
      });
      rows.removeEventListener('pointermove', move);
      hide();
    };
  }, [list, peek]);
}

// ── LET'S MAKE ___: the last word changes once a second while it's on screen ──
// The page is built with ONE. only; the other words join after load, and never
// with reduce motion. Screen readers keep hearing "Let's make one."
function useCloseWords(slot: React.RefObject<HTMLSpanElement | null>, count: number) {
  const [cycling, setCycling] = React.useState(false);
  const [at, setAt] = React.useState(0);
  React.useEffect(() => {
    const el = slot.current;
    if (!el || count < 2 || reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    setCycling(true);
    let timer = 0;
    let seen = false;
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const start = () => {
      if (!timer && seen && !document.hidden) timer = window.setInterval(() => setAt(i => (i + 1) % count), 1000);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen) start();
      else stop();
    });
    io.observe(el);
    const visibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', visibility);
    return () => {
      io.disconnect();
      stop();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [slot, count]);
  return { cycling, at };
}

export function HomePage({ link, children }: { link: LinkTo; children?: React.ReactNode }) {
  const root = React.useRef<HTMLDivElement>(null);
  const heroVideo = React.useRef<HTMLVideoElement>(null);
  const heroCaption = React.useRef<HTMLSpanElement>(null);
  const moreList = React.useRef<HTMLUListElement>(null);
  const peek = React.useRef<HTMLDivElement>(null);
  const closeSlot = React.useRef<HTMLSpanElement>(null);
  useThroughTheO(root);
  useFilms(root);
  useHeroCaption(heroVideo, heroCaption);
  useMoreWorkPeek(moreList, peek);
  const close = useCloseWords(closeSlot, homeMake.close.words.length);

  const external = (to: string) => /^https?:/.test(to);
  const go = (to: string) => (external(to) ? { href: to, target: '_blank', rel: 'noopener' } : link(to));

  return (
    <div ref={root} className="home">
      {/* Hero: the reel inside GOLDEN BOY; scroll flies through the O */}
      <Zoom
        kind="hero"
        label="Golden Boy Productions"
        spot="hero"
        height="340vh"
        video={
          <video
            ref={heroVideo}
            className="zoom-reel"
            poster={homeHero.poster}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={homeHero.loop} type="video/mp4" media="(orientation: landscape)" />
            <source src={homeHero.loopPortrait} type="video/mp4" />
          </video>
        }
        knock={homeHero.word.map((w, i) => (
          <span key={w} className="zoom-word" style={fit(homeHero.fit)}>
            <Word word={w} target={i === 0 ? homeHero.target : undefined} />
          </span>
        ))}
        frame={
          <>
            <img className="zoom-face zoom-fade" src={robertBackground} alt="" width={1008} height={1024} fetchPriority="high" />
            <div className="zoom-lede zoom-fade">
              <h1 className="zoom-lede-line home-serif">
                Robert Lazau makes films, photos and websites for the people who run Portland.
              </h1>
              <p className="zoom-cap home-mono">
                In the letters: <span ref={heroCaption}>{homeHero.cuts[0][1]}</span>
              </p>
            </div>
          </>
        }
        hint="scroll to go through the O"
        after={
          <>
            <div>
              <p className="zoom-who home-serif">A Golden Boy production.</p>
              <p className="zoom-title">Films, photos and websites for the people who run Portland.</p>
              <p className="zoom-meta home-mono">{homeHero.films.join(' / ')}</p>
            </div>
            <a href="#work" className="home-btn">
              See the work <ArrowDown size={16} aria-hidden="true" />
            </a>
          </>
        }
      />

      <h2 id="work" className="home-rule home-mono scroll-mt-4">
        The work / {String(homeFilms.length).padStart(2, '0')} films
      </h2>
      {homeFilms.map(film => (
        <React.Fragment key={film.word}>
          <Chapter film={film} link={link} />
        </React.Fragment>
      ))}

      <section aria-labelledby="more-work" data-spot="home-more-work">
        <h2 id="more-work" className="home-rule home-mono">
          More work
        </h2>
        <ul ref={moreList} className="home-index">
          {homeMore.map((m, i) => (
            <li key={m.title}>
              <a {...go(m.to)} data-peek={m.peek} data-cursor={m.cursor}>
                <span className="home-mono text-aluminum">{String(homeFilms.length + i + 1).padStart(2, '0')}</span>
                <span className="home-index-t">{m.title}</span>
                <span className="home-index-m home-mono">{m.meta}</span>
              </a>
            </li>
          ))}
        </ul>
        <div ref={peek} className="home-peek" aria-hidden="true">
          <div className="home-peek-in" />
        </div>
      </section>

      <section aria-labelledby="make" data-spot="home-make">
        <h2 id="make" className="home-rule home-mono">
          What I make
        </h2>
        <div className="home-make">
          <div className="make-item">
            <div className="make-word">
              <div className="make-media">
                <video
                  className="make-film"
                  data-src={homeMake.films.loop}
                  poster={homeMake.films.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
              <span className="make-k" style={fit(homeMake.films.fit)} aria-hidden="true">
                FILMS
              </span>
            </div>
            <p className="make-note">
              <span className="home-serif">{homeMake.films.note}</span>
              <a {...link(homeMake.films.to)} className="home-mono">
                01 / Films <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
          <div className="make-item">
            <div className="make-word">
              <div className="make-media make-photos">
                {homeMake.photos.images.map(img => (
                  <img key={img.src} src={img.src} alt={img.alt} loading="lazy" style={{ objectPosition: img.pos }} />
                ))}
              </div>
              <span className="make-k" style={fit(homeMake.photos.fit)} aria-hidden="true">
                PHOTOS
              </span>
            </div>
            <p className="make-note">
              <span className="home-serif">{homeMake.photos.note}</span>
              <a {...link(homeMake.photos.to)} className="home-mono">
                02 / Photos <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
          <div className="make-item">
            <div className="make-word">
              <div className="make-media">
                <div className="make-strip">
                  {homeMake.websites.images.map(img => (
                    <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
                  ))}
                </div>
              </div>
              <span className="make-k" style={fit(homeMake.websites.fit)} aria-hidden="true">
                WEBSITES
              </span>
            </div>
            <p className="make-note">
              <span className="home-serif">{homeMake.websites.note}</span>
              <a {...link(homeMake.websites.to)} className="home-mono">
                03 / Websites <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="home-about" aria-label="About Robert" data-spot="home-about">
        <img src={robertBackground} alt="Robert Lazau in profile" width={1008} height={1024} loading="lazy" />
        <div className="max-w-[34ch]">
          <p className="home-about-quote home-serif">{biography.quote}</p>
          <p className="mt-5 text-lg leading-relaxed text-overcast">{homeAbout}</p>
          <p className="home-mono text-aluminum mt-6">Robert Lazau / Director &amp; Producer / Portland, OR</p>
          <a {...link('/about')} className="home-mono inline-flex items-center gap-2 mt-6 text-sun hover:text-overcast transition-colors">
            More about Robert <ArrowRight size={13} aria-hidden="true" />
          </a>
        </div>
      </section>

      {children}

      <section id="contact-cta" className="home-close" aria-label="Start a project" data-spot="home-close">
        <div className="make-word">
          <div className="make-media">
            <video
              className="make-film"
              data-src={homeMake.close.loop}
              poster={homeMake.close.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <span className="make-k" style={fit(homeMake.close.fit)}>
            LET&rsquo;S MAKE{' '}
            <span ref={closeSlot} className={`close-slot${close.cycling ? ' is-cycling' : ''}`}>
              {homeMake.close.words.map((w, i) =>
                i === 0 || close.cycling ? (
                  <span key={w} className={`close-w${i === close.at ? ' on' : ''}`} aria-hidden={i === 0 ? undefined : true}>
                    {w}
                  </span>
                ) : null,
              )}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3.5 mt-7">
          <a href={business.phoneHref} className="home-close-phone">
            <span className="sr-only">Call </span>
            {business.phone}
          </a>
          <a {...link('/contact')} className="home-btn">
            Start a project <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a {...link('/work')} className="home-btn home-btn-ghost">
            See all work
          </a>
        </div>
      </section>
    </div>
  );
}
