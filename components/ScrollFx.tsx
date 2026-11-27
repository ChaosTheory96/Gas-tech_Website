"use client";
/* ---------------------------------------------------------------------------
   ScrollFx: all scroll behaviour for every page, mounted once in app/layout.

   1. Eased scrolling (Lenis) on mouse devices. It moves the real scroll
      position, never transforms the page, so text stays sharp.
   2. Reveals: [data-reveal] ("mask" for headings) and the children of
      [data-stagger]; photo panels open up. [data-inview] elements get the
      classes "rv" then "in" for their own CSS animations.
   3. Parallax: the LAYERS table. Images and decoration only, in whole pixels.
   4. Wayfinding: a[data-spy] marks the section currently on screen.

   Safety: reduced motion leaves everything in its final state; anything already
   on screen is revealed by a fallback even if an observer never fires.
   --------------------------------------------------------------------------- */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const EASE = "cubic-bezier(.22,1,.36,1)";
const REVEAL_MS = 900;
const STEP_MS = 90;

const MEDIA = ".fac-media, .svc-media, .statement-fig, .map-frame";

/* depth = travel in px at the edge of the screen; scale keeps cover photos from
   showing their edges; alternate reverses every other element. */
const LAYERS: { sel: string; depth: number; scale?: number; alternate?: boolean }[] = [
  { sel: ".statement .statement-fig img", depth: 64, scale: 1.2 },
  { sel: ".fac-media img", depth: 48, scale: 1.16 },
  { sel: ".svc-media img", depth: 48, scale: 1.16 },
  { sel: ".ind-media img", depth: 30, scale: 1.14 },
  { sel: ".pa-feature img", depth: 30, scale: 1.12 },
  { sel: ".pcx .stage-img--cut", depth: 26 },
  { sel: ".pc .stage-img--cut", depth: 16 },
  { sel: ".sc-shot img", depth: 12 },
  { sel: ".brand-bento .bb", depth: 18, alternate: true },
];
/* red surfaces: their lit corners travel with the scroll */
const LIT = ".sec--dark, .p-panel--red";

let lenis: Lenis | null = null;
/** The eased scroller, when one is running. */
export const getLenis = () => lenis;

const locked = () => /(^|\s)(gt-lock|nav-lock|modal-lock)(\s|$)/.test(document.documentElement.className);

function useEasedScroll() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    let watch: MutationObserver | undefined;
    let gone = false;
    import("lenis").then(({ default: Scroller }) => {
      if (gone) return;
      // anchor links land below the header through html's scroll-padding-top
      lenis = new Scroller({ lerp: 0.11, wheelMultiplier: 1, anchors: true });
      const tick = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // the page is held still while a dialog, the menu or the page wipe is up
      const sync = () => (locked() ? lenis?.stop() : lenis?.start());
      watch = new MutationObserver(sync);
      watch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      sync();
    });
    return () => {
      gone = true;
      cancelAnimationFrame(raf);
      watch?.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

function frames(el: HTMLElement): Keyframe[] {
  if (el.matches(MEDIA))
    return [
      { opacity: 0, clipPath: "inset(14% 10% 14% 10% round 28px)" },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
    ];
  if (el.dataset.reveal === "mask")
    return [
      { opacity: 0, translate: "0 36px", clipPath: "inset(0 -4% 100% -4%)" },
      { opacity: 1, translate: "0 0", clipPath: "inset(-30% -4% -40% -4%)" },
    ];
  if (el.parentElement?.hasAttribute("data-stagger"))
    return [
      { opacity: 0, translate: "0 56px", scale: "0.95" },
      { opacity: 1, translate: "0 0", scale: "1" },
    ];
  return [
    { opacity: 0, translate: "0 36px" },
    { opacity: 1, translate: "0 0" },
  ];
}

function useReveals(pathname: string) {
  const landing = useRef(pathname);
  const moved = useRef(false);
  useEffect(() => {
    if (pathname !== landing.current) moved.current = true;
    /* On the page you land on, whatever is already on screen has been painted:
       hiding it again would flash it and delay the largest paint. */
    const painted = (el: Element) => !moved.current && el.getBoundingClientRect().top < window.innerHeight;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      document.querySelectorAll("[data-inview]").forEach((el) => el.classList.add("in"));
      return;
    }
    const armed = new Map<HTMLElement, number>(); // element -> stagger delay
    const timers: number[] = [];
    const arm = (el: HTMLElement, delay = 0) => {
      if (armed.has(el) || painted(el)) return;
      armed.set(el, delay);
      el.style.opacity = "0";
    };
    document.querySelectorAll<HTMLElement>("main [data-reveal]").forEach((el) => arm(el));
    document.querySelectorAll<HTMLElement>(MEDIA).forEach((el) => arm(el));
    document.querySelectorAll<HTMLElement>("main [data-stagger]").forEach((group) =>
      Array.from(group.children).forEach((c, i) => arm(c as HTMLElement, Math.min(i, 5) * STEP_MS)),
    );
    const inview = Array.from(document.querySelectorAll<HTMLElement>("main [data-inview]"));
    inview.forEach((el) => el.classList.add(...(painted(el) ? ["in"] : ["rv"])));

    const show = (el: HTMLElement) => {
      if (el.hasAttribute("data-inview")) el.classList.add("in");
      const delay = armed.get(el);
      if (delay === undefined) return;
      armed.delete(el);
      const run = el.animate(frames(el), { duration: REVEAL_MS, delay, easing: EASE, fill: "backwards" });
      el.style.opacity = "";
      run.onfinish = () => run.cancel();
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = () => {
      [...armed.keys(), ...inview].forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0) show(el);
      });
    };
    let wait: MutationObserver | undefined;
    const start = () => {
      [...armed.keys(), ...inview].forEach((el) => io.observe(el));
      timers.push(window.setTimeout(scan, 1600));
    };
    // after a page change, hold the reveals until the red transition panel has left
    if (document.documentElement.classList.contains("gt-lock")) {
      wait = new MutationObserver(() => {
        if (document.documentElement.classList.contains("gt-lock")) return;
        wait?.disconnect();
        start();
      });
      wait.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    } else start();

    return () => {
      wait?.disconnect();
      io.disconnect();
      timers.forEach(window.clearTimeout);
      armed.forEach((_, el) => (el.style.opacity = ""));
      armed.clear();
    };
  }, [pathname]);
}

function useParallax(pathname: string) {
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const small = window.matchMedia("(max-width: 900px)").matches ? 0.5 : 1;
    type Item = { el: HTMLElement; box: Element; depth: number; lit: boolean };
    const items: Item[] = [];
    LAYERS.forEach((l) =>
      document.querySelectorAll<HTMLElement>(l.sel).forEach((el, i) => {
        if (l.scale) el.style.scale = String(l.scale);
        items.push({ el, box: el.parentElement ?? el, depth: l.depth * small * (l.alternate && i % 2 ? -1 : 1), lit: false });
      }),
    );
    document.querySelectorAll<HTMLElement>(LIT).forEach((el) => items.push({ el, box: el, depth: 45 * small, lit: true }));

    let queued = 0;
    const paint = () => {
      queued = 0;
      const vh = window.innerHeight;
      for (const it of items) {
        const r = it.box.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        // -1 entering from below, 0 centred, 1 leaving at the top
        const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2)));
        if (it.lit) it.el.style.setProperty("--lit", `${Math.round(50 + p * it.depth)}%`);
        else it.el.style.translate = `0 ${Math.round(p * it.depth)}px`;
      }
    };
    const queue = () => {
      if (!queued) queued = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(queued);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      items.forEach((it) => {
        it.el.style.translate = "";
        it.el.style.scale = "";
        it.el.style.removeProperty("--lit");
      });
    };
  }, [pathname]);
}

/* the brand ticker runs faster while the page is moving */
function useTickerVelocity(pathname: string) {
  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".ticker-track");
    if (!track || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    let last = window.scrollY;
    let rate = 1;
    let raf = 0;
    const tick = () => {
      const speed = Math.abs(window.scrollY - last);
      last = window.scrollY;
      rate += (1 + Math.min(3, speed / 12) - rate) * 0.08;
      track.getAnimations().forEach((a) => (a.playbackRate = rate));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
}

function useSectionSpy(pathname: string) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[data-spy]"));
    if (!links.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.setAttribute("aria-current", String(a.hash === `#${e.target.id}`)));
        }),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    links.forEach((a) => {
      const target = document.getElementById(a.hash.slice(1));
      if (target) io.observe(target);
    });
    return () => io.disconnect();
  }, [pathname]);
}

export function ScrollFx() {
  const pathname = usePathname();

  // a new page starts at the top, unless the link points at a section
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  useEasedScroll();
  useReveals(pathname);
  useParallax(pathname);
  useTickerVelocity(pathname);
  useSectionSpy(pathname);
  return null;
}
