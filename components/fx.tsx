"use client";
/* ---------------------------------------------------------------------------
   Motion bootstrap + page transition.
   - Adds `js-fx` (never `js`) so enhancements.css's scroll-driven reveal/parallax
     activate, while content that JS would otherwise hide stays visible as a
     safe fallback in engines without `animation-timeline`.
   - Drives the scroll-progress bar via a single inherited `--p` custom property.
   - Wraps each route's content in a short, calm fade so navigation feels
     continuous (View-Transitions equivalent, no WebGL, respects reduced-motion
     via MotionConfig in the layout).
   --------------------------------------------------------------------------- */
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getSmoother } from "./SmoothScroll";
import { EASE } from "./motion";

/* Route-change fade, seconds. */
const PAGE_FADE_DUR = 0.4;

export function FxBootstrap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-fx");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = root.scrollHeight - root.clientHeight;
        root.style.setProperty("--p", h > 0 ? String(Math.min(1, root.scrollTop / h)) : "0");
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("js-fx");
    };
  }, []);
  return null;
}

export function ScrollProgressBar() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <i />
    </div>
  );
}

/* Page transition: a full-screen red panel slides in from the left, holds
   while the next route loads, then slides out to the right. The page behind is
   scroll-locked until the panel has left. Only plain same-site link clicks are
   taken over; hash-only links, new tabs, downloads, modified clicks and browser
   back/forward keep their native behaviour (they get the short fade below). */
const WIPE_IN = 560; // ms, must match .gt-wipe in enhancements.css
const WIPE_OUT = 620;
const MIN_HOLD = 380; // the panel is never a flash: it stays at least this long
const MAX_HOLD = 6000; // safety: never trap the user behind the panel

type WipePhase = "idle" | "in" | "hold" | "out";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<WipePhase>("idle");
  const phaseRef = useRef<WipePhase>("idle");
  const target = useRef<string>("");
  const holdSince = useRef(0);
  const timers = useRef<number[]>([]);

  const go = (next: WipePhase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const finish = () => {
    go("out");
    later(() => {
      go("idle");
      document.documentElement.classList.remove("gt-lock");
    }, WIPE_OUT);
  };

  useEffect(() => {
    if (reduce) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url: URL;
      try { url = new URL(a.href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      if (phaseRef.current !== "idle") return; // already travelling: ignore extra clicks
      target.current = url.pathname + url.search + url.hash;
      document.documentElement.classList.add("gt-lock");
      go("in");
      later(() => {
        go("hold");
        holdSince.current = Date.now();
        router.push(target.current);
        later(() => { if (phaseRef.current === "hold") finish(); }, MAX_HOLD);
      }, WIPE_IN);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      document.documentElement.classList.remove("gt-lock");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, router]);

  // the new route has rendered: leave the panel after the minimum hold
  useEffect(() => {
    if (phaseRef.current !== "hold") return;
    const wait = Math.max(0, MIN_HOLD - (Date.now() - holdSince.current));
    later(() => { if (phaseRef.current === "hold") finish(); }, wait);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: PAGE_FADE_DUR, ease: EASE }}
      >
        {children}
      </motion.div>
      <div className="gt-wipe" data-phase={phase} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/gc-logo.svg" alt="" />
        <span className="gw-bar" />
      </div>
    </>
  );
}

/* Scrolls to a #hash target after a route change. Links like /about-us/#how
   navigate but App Router does not scroll to in-page anchors on its own, and
   the navbar is sticky, so we offset by its height. Runs only in the browser. */
export function HashScroller() {
  const pathname = usePathname();
  useEffect(() => {
    const jump = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      let el: HTMLElement | null = null;
      try { el = document.querySelector(hash); } catch { return; }
      if (!el) return;
      const navH =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 78;
      const top = el.getBoundingClientRect().top + window.scrollY - navH - 12;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // When ScrollSmoother is active, route through it so the jump is eased and
      // stays in sync with the smoothed scroller; otherwise use native scroll.
      const s = getSmoother();
      if (s && !reduce) { s.scrollTo(Math.max(0, top), true); }
      else { window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" }); }
    };
    const id = window.setTimeout(jump, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
}
