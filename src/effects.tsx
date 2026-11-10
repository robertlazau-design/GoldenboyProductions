// Small motion effects used around the site. Each one respects "reduce motion",
// leaves all text in the prerendered HTML, and animates only transform/opacity
// (plus SVG stroke offsets for the logo) so it stays smooth on phones.
import React from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react';

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;
const reducedMotion = () => matches('(prefers-reduced-motion: reduce)');
const finePointer = () => matches('(hover: hover) and (pointer: fine)');
const saveData = () =>
  typeof navigator !== 'undefined' && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

// ── Logo mark that draws itself ─────────────────────────────────────────────
// A vector rebuild of /logo-mark.png (traced against the 2048px master to
// within about a pixel): six lens petals, an open ring and the dot. The
// drawing animation lives in index.css (.logo-draw).
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
      <g fill="none" stroke="#e6be6d" strokeWidth={15} strokeLinejoin="round">
        <path className="logo-ring" d={RING} pathLength={1} />
        {PETALS.map((d, i) => (
          <path key={i} className="logo-petal" d={d} pathLength={1} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </g>
      <circle className="logo-dot" cx={C.x} cy={C.y + 795.5} r={28.5} fill="#e6be6d" />
    </svg>
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

// ── Buttons that lean toward the cursor ────────────────────────────────────
type MagneticProps = HTMLMotionProps<'a'> & { strength?: number; max?: number };
export function MagneticLink({ strength = 0.3, max = 10, onPointerMove, onPointerLeave, style, ...rest }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const enabled = React.useRef(false);
  React.useEffect(() => {
    enabled.current = finePointer() && !reducedMotion();
  }, []);
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));
  return (
    <motion.a
      {...rest}
      style={{ ...style, x: springX, y: springY }}
      onPointerMove={e => {
        if (enabled.current) {
          const r = e.currentTarget.getBoundingClientRect();
          x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
          y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
        }
        onPointerMove?.(e);
      }}
      onPointerLeave={e => {
        x.set(0);
        y.set(0);
        onPointerLeave?.(e);
      }}
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
    <section className="py-14 md:py-16 border-t border-white/5" aria-label={label}>
      <p className="text-center text-xs uppercase tracking-[0.25em] text-gold font-medium mb-8">{label}</p>
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
