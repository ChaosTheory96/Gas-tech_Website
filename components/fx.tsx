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
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

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

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Scrolls to a #hash target after a route change. Links like /delivery#process
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
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    };
    const id = window.setTimeout(jump, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
}
