"use client";
/* ---------------------------------------------------------------------------
   SmoothScroll — GSAP ScrollSmoother provider (the Lenis-free "smoothness").

   Wraps ONLY the scrolling document (page content + footer). Fixed / sticky UI
   (navbar, scroll-progress, enquiry modal) is rendered OUTSIDE #smooth-content
   by app/layout.tsx, because ScrollSmoother transforms #smooth-content and any
   fixed/sticky descendant would be dragged or scaled with it.

   Safety contract (mirrors components/motion.tsx):
   - Server / no-JS render the final state. The two wrapper <div>s are inert
     until ScrollSmoother is created; nothing is hidden without JS.
   - Created only on a motion-allowed, fine-pointer client. Reduced-motion and
     touch keep NATIVE scroll (no hijack). When off, html.has-smooth is absent,
     so the navbar stays sticky and content keeps its natural flow.
   - Client-only dynamic import; gsap is never evaluated on the server.
   --------------------------------------------------------------------------- */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/* Minimal surface we actually call, so callers don't need the full gsap types. */
export type Smoother = {
  scrollTo: (value: number | string, smooth?: boolean) => void;
  scrollTop: (value: number, smooth?: boolean) => void;
};

export type ScrollState = { smoother: Smoother | null; ready: boolean };

const ScrollCtx = createContext<ScrollState>({ smoother: null, ready: false });

/* Module-level handle so consumers OUTSIDE the provider tree (e.g. HashScroller,
   which layout renders as a sibling before <SmoothScroll>) can reach the live
   smoother without a context dependency. Reactive consumers use the hook. */
let __smoother: Smoother | null = null;
export const getSmoother = (): Smoother | null => __smoother;

/** { smoother, ready } — `ready` flips true once the scroll path is decided
    (ScrollSmoother created, or native-scroll for touch / reduced-motion), so
    consumers initialise their choreography exactly once, with the right scroller. */
export const useScrollState = (): ScrollState => useContext(ScrollCtx);

/* Production QA verdict (user-reported): the hijack added 0.8s of scroll
   inertia on EVERY page and kept a permanent transform on #smooth-content,
   which composited all text away from native antialiasing (serrated fonts on
   Windows) and felt laggy. Native scroll is the shipping path; ScrollTrigger
   choreography in HomeScrollFx runs on the native scroller. Flip HIJACK back
   to true (with smooth <= 0.3) to restore ScrollSmoother if ever revisited. */
const HIJACK = false;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [smoother, setSmoother] = useState<Smoother | null>(null);
  const [ready, setReady] = useState(false);
  const ref = useRef<Smoother | null>(null);

  useEffect(() => {
    if (!HIJACK) { setReady(true); return; }
    // Only hijack scroll for a fine pointer that hasn't asked for reduced motion.
    const fine = window.matchMedia("(pointer:fine)").matches;
    const motionOK = window.matchMedia("(prefers-reduced-motion:no-preference)").matches;
    if (!fine || !motionOK) { setReady(true); return; }

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { default: ScrollTrigger }, { default: ScrollSmoother }] =
        await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrollSmoother")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      // Idempotent across Fast Refresh / remounts: reuse an existing instance.
      const existing = ScrollSmoother.get();
      if (existing) {
        ref.current = existing as unknown as Smoother;
        __smoother = existing as unknown as Smoother;
        setSmoother(existing as unknown as Smoother);
        setReady(true);
        return;
      }

      ctx = gsap.context(() => {
        const s = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 0.8,          // seconds of inertia; tuned in QA
          effects: false,       // we drive our own reveals in HomeScrollFx
          normalizeScroll: true,
          ignoreMobileResize: true,
        });
        // Switch the navbar to fixed + pad the content so nothing hides under it.
        document.documentElement.classList.add("has-smooth");
        ref.current = s as unknown as Smoother;
        __smoother = s as unknown as Smoother;
        setSmoother(s as unknown as Smoother);
        setReady(true);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert?.();
      document.documentElement.classList.remove("has-smooth");
      ref.current = null;
      __smoother = null;
    };
  }, []);

  // Route change: jump the smoothed scroller back to top, then let ScrollTrigger
  // re-measure once the new page (and its images) have laid out.
  useEffect(() => {
    if (ref.current) {
      try { ref.current.scrollTop(0, false); } catch { /* noop */ }
    } else {
      window.scrollTo(0, 0);
    }
    let raf1 = 0;
    const t = window.setTimeout(() => {
      import("gsap/ScrollTrigger").then(({ default: ST }) => {
        raf1 = requestAnimationFrame(() => ST.refresh());
      });
    }, 60);
    return () => { window.clearTimeout(t); cancelAnimationFrame(raf1); };
  }, [pathname]);

  return (
    <ScrollCtx.Provider value={{ smoother, ready }}>
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </ScrollCtx.Provider>
  );
}
