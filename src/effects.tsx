// Small motion effects used around the site. Each one respects "reduce motion",
// leaves all text in the prerendered HTML, and animates only transform/opacity
// (plus SVG stroke offsets for the logo) so it stays smooth on phones.
import React from 'react';
import { formatTime, sunDay, type SunDay } from './sun';

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;
const reducedMotion = () => matches('(prefers-reduced-motion: reduce)');
const finePointer = () => matches('(hover: hover) and (pointer: fine)');
const saveData = () =>
  typeof navigator !== 'undefined' && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

// ── Logo mark that draws itself ─────────────────────────────────────────────
// A vector rebuild of the sun mark (traced against the 2048px master to
// within about a pixel): six lens petals, an open ring and the dot, drawn
// with the brand v2 sturdy line in currentColor. The drawing animation lives
// in index.css (.logo-draw).
const C = { x: 1023.5, y: 1007.5 };
const PETAL = { length: 668, bulge: 94 };
const ARC_R = (PETAL.length ** 2 / 4 + PETAL.bulge ** 2) / (2 * PETAL.bulge);
const RING_R = 791.5;
const RING_GAP = 11.85; // degrees either side of the bottom
const pt = (deg: number, r: number) => {
  const t = (deg * Math.PI) / 180;
  return `${(C.x + Math.sin(t) * r).toFixed(2)} ${(C.y - Math.cos(t) * r).toFixed(2)}`;
};
const PETALS = [0, 60, 120, 180, 240, 300].map(
  deg => `M${C.x} ${C.y} A${ARC_R.toFixed(2)} ${ARC_R.toFixed(2)} 0 0 1 ${pt(deg, PETAL.length)} A${ARC_R.toFixed(2)} ${ARC_R.toFixed(2)} 0 0 1 ${C.x} ${C.y}Z`,
);
const RING = `M${pt(180 + RING_GAP, RING_R)} A${RING_R} ${RING_R} 0 1 1 ${pt(180 - RING_GAP, RING_R)}`;

export function LogoMark({ className = '', label = 'Golden Boy Productions Logo' }: { className?: string; label?: string }) {
  return (
    <svg viewBox="140.5 136.5 1766 1766" className={`logo-draw ${className}`} role="img" aria-label={label}>
      <g fill="none" stroke="currentColor" strokeWidth={56} strokeLinejoin="round">
        <path className="logo-ring" d={RING} pathLength={1} />
        {PETALS.map((d, i) => (
          <path key={i} className="logo-petal" d={d} pathLength={1} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </g>
      <circle className="logo-dot" cx={C.x} cy={C.y + 795.5} r={44} fill="currentColor" />
    </svg>
  );
}

// ── The sun mark as a static icon (header, footer) ─────────────────────────
// Same outlines as public/brand/gb-sun.svg and gb-sun-solid.svg. Inline so it
// takes currentColor and needs no extra request.
const SUN_SOLID = "M366.0 375.0Q293.0 377.0 231.0 413.0Q162.0 453.0 123.0 523.0Q203.0 525.0 272.0 485.0Q335.0 449.0 373.0 387.0Q338.0 451.0 338.0 523.0Q338.0 603.0 380.0 671.0Q422.0 603.0 422.0 523.0Q422.0 451.0 387.0 387.0Q425.0 449.0 488.0 485.0Q557.0 525.0 637.0 523.0Q598.0 453.0 529.0 413.0Q467.0 377.0 394.0 375.0Q467.0 373.0 529.0 337.0Q598.0 297.0 637.0 227.0Q557.0 225.0 488.0 265.0Q425.0 301.0 387.0 363.0Q422.0 299.0 422.0 227.0Q422.0 147.0 380.0 79.0Q338.0 147.0 338.0 227.0Q338.0 299.0 373.0 363.0Q335.0 301.0 272.0 265.0Q203.0 225.0 123.0 227.0Q162.0 297.0 231.0 337.0Q293.0 373.0 366.0 375.0ZM305.0 732.0Q308.0 733.0 310.5 732.5Q313.0 732.0 315.5 730.5Q318.0 729.0 319.5 726.5Q321.0 724.0 321.5 721.5Q322.0 719.0 321.5 716.5Q321.0 714.0 319.5 711.5Q318.0 709.0 315.5 707.5Q313.0 706.0 311.0 705.0Q249.0 692.0 196.5 658.0Q144.0 624.0 107.0 573.5Q70.0 523.0 54.0 462.5Q38.0 402.0 44.5 340.0Q51.0 278.0 79.5 222.0Q108.0 166.0 154.5 124.0Q201.0 82.0 259.0 60.0Q317.0 38.0 380.0 38.0Q443.0 38.0 501.0 60.0Q559.0 82.0 605.5 124.0Q652.0 166.0 680.5 222.0Q709.0 278.0 715.5 340.0Q722.0 402.0 706.0 462.5Q690.0 523.0 653.0 573.5Q616.0 624.0 563.5 658.0Q511.0 692.0 449.0 705.0Q447.0 706.0 444.5 707.5Q442.0 709.0 440.5 711.5Q439.0 714.0 438.5 716.5Q438.0 719.0 438.5 721.5Q439.0 724.0 440.5 726.5Q442.0 729.0 444.5 730.5Q447.0 732.0 449.5 732.5Q452.0 733.0 455.0 732.0Q521.0 718.0 578.0 681.5Q635.0 645.0 675.0 590.0Q715.0 535.0 732.5 470.0Q750.0 405.0 743.0 337.5Q736.0 270.0 705.5 209.5Q675.0 149.0 624.5 104.0Q574.0 59.0 511.0 34.5Q448.0 10.0 380.0 10.0Q312.0 10.0 249.0 34.5Q186.0 59.0 135.5 104.0Q85.0 149.0 54.5 209.5Q24.0 270.0 17.0 337.5Q10.0 405.0 27.5 470.0Q45.0 535.0 85.0 590.0Q125.0 645.0 182.0 681.5Q239.0 718.0 305.0 732.0ZM405.0 728.0Q405.0 718.0 397.5 710.5Q390.0 703.0 380.0 703.0Q370.0 703.0 362.5 710.5Q355.0 718.0 355.0 728.0Q355.0 738.0 362.5 745.5Q370.0 753.0 380.0 753.0Q390.0 753.0 397.5 745.5Q405.0 738.0 405.0 728.0Z";
const SUN_OUTLINE = "M283.0 375.0Q252.0 385.0 224.0 401.0Q188.0 422.0 159.5 451.5Q131.0 481.0 111.0 517.0Q110.0 520.0 110.0 523.0Q109.0 526.0 110.0 528.5Q111.0 531.0 113.0 533.0Q115.0 535.0 117.5 536.0Q120.0 537.0 123.0 537.0Q164.0 538.0 204.0 528.0Q244.0 518.0 279.0 497.0Q308.0 481.0 332.0 459.0Q325.0 491.0 325.0 523.0Q325.0 564.0 336.0 604.0Q347.0 644.0 368.0 679.0Q370.0 681.0 373.0 683.0Q375.0 685.0 378.0 685.0Q381.0 685.0 383.5 684.5Q386.0 684.0 388.0 682.5Q390.0 681.0 392.0 679.0Q413.0 644.0 424.0 604.0Q435.0 564.0 435.0 523.0Q435.0 491.0 428.0 459.0Q452.0 481.0 481.0 497.0Q516.0 518.0 556.0 528.0Q596.0 538.0 637.0 537.0Q640.0 537.0 643.0 535.0Q646.0 534.0 647.5 532.0Q649.0 530.0 650.0 527.0Q651.0 524.0 650.5 521.5Q650.0 519.0 649.0 517.0Q629.0 481.0 600.5 451.5Q572.0 422.0 536.0 401.0Q508.0 385.0 477.0 375.0Q508.0 365.0 536.0 349.0Q572.0 328.0 600.5 298.5Q629.0 269.0 649.0 233.0Q650.0 230.0 650.0 227.0Q651.0 224.0 650.0 221.5Q649.0 219.0 647.0 217.0Q645.0 215.0 642.5 214.0Q640.0 213.0 637.0 213.0Q596.0 212.0 556.0 222.0Q516.0 232.0 481.0 253.0Q452.0 269.0 428.0 291.0Q435.0 259.0 435.0 227.0Q435.0 186.0 424.0 146.0Q413.0 106.0 392.0 71.0Q390.0 69.0 387.0 67.0Q385.0 65.0 382.0 65.0Q379.0 65.0 376.5 65.5Q374.0 66.0 372.0 67.5Q370.0 69.0 368.0 71.0Q347.0 106.0 336.0 146.0Q325.0 186.0 325.0 227.0Q325.0 259.0 332.0 291.0Q308.0 269.0 279.0 253.0Q244.0 232.0 204.0 222.0Q164.0 212.0 123.0 213.0Q120.0 213.0 117.0 215.0Q114.0 216.0 112.5 218.0Q111.0 220.0 110.0 223.0Q109.0 226.0 109.5 228.5Q110.0 231.0 111.0 233.0Q131.0 269.0 159.5 298.5Q188.0 328.0 224.0 349.0Q252.0 365.0 283.0 375.0ZM305.0 732.0Q308.0 733.0 310.5 732.5Q313.0 732.0 315.5 730.5Q318.0 729.0 319.5 726.5Q321.0 724.0 321.5 721.5Q322.0 719.0 321.5 716.5Q321.0 714.0 319.5 711.5Q318.0 709.0 315.5 707.5Q313.0 706.0 311.0 705.0Q249.0 692.0 196.5 658.0Q144.0 624.0 107.0 573.5Q70.0 523.0 54.0 462.5Q38.0 402.0 44.5 340.0Q51.0 278.0 79.5 222.0Q108.0 166.0 154.5 124.0Q201.0 82.0 259.0 60.0Q317.0 38.0 380.0 38.0Q443.0 38.0 501.0 60.0Q559.0 82.0 605.5 124.0Q652.0 166.0 680.5 222.0Q709.0 278.0 715.5 340.0Q722.0 402.0 706.0 462.5Q690.0 523.0 653.0 573.5Q616.0 624.0 563.5 658.0Q511.0 692.0 449.0 705.0Q447.0 706.0 444.5 707.5Q442.0 709.0 440.5 711.5Q439.0 714.0 438.5 716.5Q438.0 719.0 438.5 721.5Q439.0 724.0 440.5 726.5Q442.0 729.0 444.5 730.5Q447.0 732.0 449.5 732.5Q452.0 733.0 455.0 732.0Q521.0 718.0 578.0 681.5Q635.0 645.0 675.0 590.0Q715.0 535.0 732.5 470.0Q750.0 405.0 743.0 337.5Q736.0 270.0 705.5 209.5Q675.0 149.0 624.5 104.0Q574.0 59.0 511.0 34.5Q448.0 10.0 380.0 10.0Q312.0 10.0 249.0 34.5Q186.0 59.0 135.5 104.0Q85.0 149.0 54.5 209.5Q24.0 270.0 17.0 337.5Q10.0 405.0 27.5 470.0Q45.0 535.0 85.0 590.0Q125.0 645.0 182.0 681.5Q239.0 718.0 305.0 732.0ZM380.0 347.0Q369.0 324.0 362.0 300.0Q352.0 264.0 352.0 226.5Q352.0 189.0 362.0 154.0Q369.0 129.0 380.0 107.0Q391.0 129.0 398.0 154.0Q408.0 189.0 408.0 226.5Q408.0 264.0 398.0 300.0Q391.0 324.0 380.0 347.0ZM380.0 403.0Q391.0 426.0 398.0 450.0Q408.0 486.0 408.0 523.5Q408.0 561.0 398.0 596.0Q391.0 621.0 380.0 643.0Q369.0 621.0 362.0 596.0Q352.0 561.0 352.0 523.5Q352.0 486.0 362.0 450.0Q369.0 426.0 380.0 403.0ZM405.0 361.0Q418.0 340.0 436.0 322.0Q462.0 295.0 494.5 276.5Q527.0 258.0 563.0 249.0Q587.0 243.0 612.0 241.0Q598.0 262.0 581.0 280.0Q555.0 306.0 522.5 325.0Q490.0 344.0 454.0 353.0Q429.0 359.0 405.0 361.0ZM355.0 361.0Q331.0 359.0 306.0 353.0Q270.0 344.0 237.5 325.0Q205.0 306.0 179.0 280.0Q162.0 262.0 148.0 241.0Q173.0 243.0 197.0 249.0Q233.0 258.0 265.5 276.5Q298.0 295.0 324.0 322.0Q342.0 340.0 355.0 361.0ZM405.0 389.0Q429.0 391.0 454.0 397.0Q490.0 406.0 522.5 425.0Q555.0 444.0 581.0 470.0Q598.0 488.0 612.0 509.0Q587.0 507.0 563.0 501.0Q527.0 492.0 494.5 473.5Q462.0 455.0 436.0 428.0Q418.0 410.0 405.0 389.0ZM355.0 389.0Q342.0 410.0 324.0 428.0Q298.0 455.0 265.5 473.5Q233.0 492.0 197.0 501.0Q173.0 507.0 148.0 509.0Q162.0 488.0 179.0 470.0Q205.0 444.0 237.5 425.0Q270.0 406.0 306.0 397.0Q331.0 391.0 355.0 389.0ZM405.0 728.0Q405.0 718.0 397.5 710.5Q390.0 703.0 380.0 703.0Q370.0 703.0 362.5 710.5Q355.0 718.0 355.0 728.0Q355.0 738.0 362.5 745.5Q370.0 753.0 380.0 753.0Q390.0 753.0 397.5 745.5Q405.0 738.0 405.0 728.0Z";
export function SunMark({ solid = false, className = '' }: { solid?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 760.0 763.0" className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={solid ? SUN_SOLID : SUN_OUTLINE} />
    </svg>
  );
}

// ── Sun clock: golden hour over Portland, live ─────────────────────────────
// The sun mark rides a half-arc from sunrise (left) to sunset (right); the
// two gold segments are today's golden hours. Times are worked out in the
// browser (src/sun.ts). The prerendered HTML carries a plain fallback line,
// so nothing is hidden before JavaScript runs.
const ARC = { cx: 120, cy: 104, r: 92 };
const arcPoint = (f: number) => {
  const a = Math.PI * (1 - Math.min(1, Math.max(0, f)));
  return { x: ARC.cx + ARC.r * Math.cos(a), y: ARC.cy - ARC.r * Math.sin(a) };
};
const arcPath = (from: number, to: number) => {
  const p = arcPoint(from);
  const q = arcPoint(to);
  return `M${p.x.toFixed(1)} ${p.y.toFixed(1)} A${ARC.r} ${ARC.r} 0 0 1 ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
};
const range = ([a, b]: [Date, Date]) => `${formatTime(a).replace(/ [AP]M$/, '')}\u2013${formatTime(b)}`;

function sunStatus(now: Date, day: SunDay, tomorrow: SunDay | null) {
  const t = now.getTime();
  const [m0, m1] = day.morningGolden;
  const [e0, e1] = day.eveningGolden;
  if (t >= m0.getTime() && t < m1.getTime()) return { head: `Golden hour now, until ${formatTime(m1)}`, when: 'now' as const };
  if (t >= e0.getTime() && t < e1.getTime()) return { head: `Golden hour now, until ${formatTime(e1)}`, when: 'now' as const };
  if (t < m0.getTime()) return { head: `Next: ${range(day.morningGolden)}`, when: 'later' as const };
  if (t < e0.getTime()) return { head: `Today ${range(day.eveningGolden)}`, when: 'later' as const };
  return { head: tomorrow ? `Tomorrow ${range(tomorrow.morningGolden)}` : 'Tomorrow morning', when: 'later' as const };
}

export function SunClock({ className = '' }: { className?: string }) {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const minute = now ? Math.floor(now.getTime() / 60_000) : 0;
  const day = React.useMemo(() => (now ? sunDay(now) : null), [minute]); // eslint-disable-line react-hooks/exhaustive-deps
  const tomorrow = React.useMemo(() => (now ? sunDay(new Date(now.getTime() + 86_400_000)) : null), [minute]); // eslint-disable-line react-hooks/exhaustive-deps

  const len = day ? day.sunset.getTime() - day.sunrise.getTime() : 1;
  const frac = (d: Date) => (day ? (d.getTime() - day.sunrise.getTime()) / len : 0);
  const f = now && day ? frac(now) : null;
  const up = f !== null && f >= 0 && f <= 1;
  const sun = f === null ? null : up ? arcPoint(f) : { x: ARC.cx, y: ARC.cy + 16 };
  const status = now && day ? sunStatus(now, day, tomorrow) : null;

  return (
    <section className={`sun-clock flex items-center gap-5 md:gap-7 ${className}`} aria-label="Golden hour in Portland">
      <svg viewBox="0 0 240 140" className="w-28 sm:w-36 md:w-44 h-auto flex-none text-ink" aria-hidden="true" focusable="false">
        <path d={arcPath(0, 1)} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <line x1="8" y1={ARC.cy} x2="232" y2={ARC.cy} stroke="currentColor" strokeWidth="2" />
        {day && <path d={arcPath(0, frac(day.morningGolden[1]))} fill="none" stroke="var(--color-sun)" strokeWidth="7" />}
        {day && <path d={arcPath(frac(day.eveningGolden[0]), 1)} fill="none" stroke="var(--color-sun)" strokeWidth="7" />}
        {sun && (
          <svg x={sun.x - 13} y={sun.y - 13} width="26" height="26" viewBox="0 0 760.0 763.0" className="sun-clock-sun">
            <circle cx="380" cy="380" r="372" fill={up ? 'var(--color-ground)' : 'none'} />
            <path fill="currentColor" d={up ? SUN_SOLID : SUN_OUTLINE} />
          </svg>
        )}
      </svg>
      <div className="min-w-0">
        <p className="font-label uppercase tracking-label text-[13px] md:text-sm text-ink-muted">Golden hour in Portland</p>
        <p className="font-display text-lg sm:text-xl md:text-2xl leading-tight text-ink mt-1">{status ? status.head : 'Every day, the hour before sunset'}</p>
        {day && (
          <p className="font-slug text-[13px] md:text-sm text-ink-muted mt-1">
            Sunrise {formatTime(day.sunrise)} <span aria-hidden="true">/</span> Sunset {formatTime(day.sunset)}
          </p>
        )}
      </div>
    </section>
  );
}

// ── "Robert Lazau" fading in word by word ──────────────────────────────────
// The words stay real text with a normal space between them, so screen
// readers and search engines read the name as usual.
export function RevealWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="reveal-word" style={{ '--i': i } as React.CSSProperties}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}

// ── Widescreen reveal: black bars slide open the first time it's on screen ──
export function Letterbox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<'idle' | 'armed' | 'open'>('idle');
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    setState('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // two frames so the closed bars are painted before they open
        requestAnimationFrame(() => requestAnimationFrame(() => setState('open')));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`letterbox letterbox-${state} ${className}`}>
      {children}
      <span className="letterbox-bar letterbox-top" aria-hidden="true" />
      <span className="letterbox-bar letterbox-bottom" aria-hidden="true" />
    </div>
  );
}

// ── Silent preview loop for a project card ─────────────────────────────────
// With a mouse it plays while the pointer (or keyboard focus) is on the card
// marked data-preview-host. On phones it plays while the card sits in the
// middle of the screen. Nothing downloads until then, and it never plays for
// "reduce motion" or data-saver visitors.
export function HoverPreview({ src }: { src: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const video = ref.current;
    const host = video?.closest<HTMLElement>('[data-preview-host]');
    if (!video || !host || reducedMotion() || saveData()) return;
    video.muted = true;
    const start = () => {
      if (!video.getAttribute('src')) video.src = src;
      video.play().then(() => setVisible(true)).catch(() => {});
    };
    const stop = () => {
      video.pause();
      setVisible(false);
    };
    if (finePointer()) {
      host.addEventListener('pointerenter', start);
      host.addEventListener('pointerleave', stop);
      host.addEventListener('focusin', start);
      host.addEventListener('focusout', stop);
      return () => {
        host.removeEventListener('pointerenter', start);
        host.removeEventListener('pointerleave', stop);
        host.removeEventListener('focusin', start);
        host.removeEventListener('focusout', stop);
        video.pause();
      };
    }
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: '-35% 0px -35% 0px',
    });
    io.observe(host);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [src]);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}


// ── Soft gold light that follows the mouse across any .glow-card ───────────
export function useCardGlow() {
  React.useEffect(() => {
    if (!finePointer()) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.glow-card') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${e.clientX - r.left}px`);
      card.style.setProperty('--gy', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
}

// ── A slow strip of client names ───────────────────────────────────────────
export function ClientStrip({ names, label }: { names: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul className="client-row" aria-hidden={hidden || undefined}>
      {names.map(n => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
  return (
    <section className="py-14 md:py-16 border-t border-line" aria-label={label}>
      <p className="text-center text-xs uppercase font-label tracking-label text-accent font-medium mb-8">{label}</p>
      <div className="client-marquee">
        <div className="client-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

// ── "Lights down": a film opens big and centered while the page fades to black ──
// Uses the native <dialog>, so Esc closes it, keyboard focus stays inside, and
// focus returns to the play button afterwards. Clicking the dark area closes it.
// Closing always goes through onClose (the parent unmounts this), which keeps it
// safe under React's double-run effects in development.
export function Theater({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  // close the dialog first so the browser hands focus back to the play button
  const requestClose = () => {
    if (ref.current?.open) ref.current.close();
    closeRef.current();
  };
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const root = document.documentElement;
    const onCancel = (e: Event) => {
      e.preventDefault();
      dialog.close();
      closeRef.current();
    };
    dialog.addEventListener('cancel', onCancel);
    if (!dialog.open) dialog.showModal();
    root.classList.add('theater-open');
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      root.classList.remove('theater-open');
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="theater"
      aria-label={title}
      onClick={e => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <button type="button" className="theater-close" onClick={requestClose}>
        Close <span aria-hidden="true">✕</span>
      </button>
      <div className="theater-frame">
        <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    </dialog>
  );
}
