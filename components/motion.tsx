"use client";
/* ---------------------------------------------------------------------------
   Motion layer (Framer Motion). Deliberately CALM/professional: enter-only
   reveals, counters and a hero word-rise — never a fade-OUT, never exit.

   Content-safety contract (hard rule): the server HTML and the no-JS /
   reduced-motion path must ALWAYS show final content. So every component here
   renders its STATIC final state until it has mounted on the client, and only
   then swaps to the animated variant. prefers-reduced-motion (via MotionConfig
   reducedMotion="user" in the layout + our own check) keeps everything static.
   --------------------------------------------------------------------------- */
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** True only after the first client paint, so SSR/no-JS stays fully visible. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Word-rise for headings. Provide the full text; it splits on spaces and
 * staggers each word up once. Falls back to plain text until mounted.
 */
export function SplitHeading({ text, className }: { text: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const plain = typeof text === "string" ? text : null;

  if (!mounted || reduce || !plain) {
    return <span className={className}>{text}</span>;
  }

  const words = plain.split(" ");
  return (
    <span className={className} aria-label={plain}>
      {words.map((w, i) => (
        <span key={i} className="w-split" aria-hidden="true">
          <motion.span
            className="w-split-in"
            initial={{ y: "0.9em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Animated number count-up. Renders the final value on the server and for
 * reduced-motion; counts up from 0 only when it scrolls into view on a
 * motion-enabled client.
 */
export function Counter({
  to,
  suffix = "",
  duration = 1200,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [val, setVal] = useState(to);

  useEffect(() => {
    if (!mounted || reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setVal(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduce, inView, to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/**
 * Above-the-fold entrance (used for the hero, which CSS reveals deliberately
 * exclude). Animates once on mount, never on exit. Static until mounted so the
 * server HTML / no-JS shows final content. `as` keeps the correct tag.
 */
export function RiseIn({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  if (!mounted || reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag =
    as === "span" ? motion.span : as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Process timeline (Home "04 / How we work"). site.css draws the connector
 * line via .steps.is-in li::before { transform:scaleX(1) } but nothing ever
 * added .is-in (site.js is not running). This observes the list and flips
 * .is-in once it scrolls into view, which triggers the existing CSS line-draw
 * + the enter-only item reveal in the polish block. Without JS / reduced
 * motion the list simply shows its final state (nothing hidden).
 */
export function StepsTimeline({
  steps,
}: {
  steps: { n: string; title: string; desc: string }[];
}) {
  const ref = useRef<HTMLOListElement>(null);
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const activate = !mounted || reduce ? true : inView;
  return (
    <ol ref={ref} className={activate ? "steps is-in" : "steps"} data-steps>
      {steps.map((s) => (
        <li key={s.n}>
          <span className="step-n">{s.n}</span>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Enter-only wrapper: fades/rises content in the first time it scrolls into
 * view, then stays put (no exit). Static until mounted so SSR/no-JS is safe.
 */
export function Reveal({
  children,
  y = 22,
  className,
  delay = 0,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();

  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
