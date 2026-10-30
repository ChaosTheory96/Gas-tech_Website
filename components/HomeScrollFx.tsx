"use client";
/* ---------------------------------------------------------------------------
   HomeScrollFx — scroll choreography for the homepage (pilot).

   Null-rendering: adds no markup, only wires motion to the sections the server
   already rendered, reading the existing data-reveal / data-stagger hooks.

   WHY reveals use IntersectionObserver, not ScrollTrigger:
   Content visibility must NEVER depend on the smoothed scroller binding. A
   ScrollTrigger that fails to fire (e.g. the classic ScrollSmoother scroller
   mismatch) strands a whole section at opacity:0 — an empty page. An
   IntersectionObserver measures real painted position, so it behaves identically
   with or without ScrollSmoother and cannot leave content hidden. Parallax and
   marquee velocity stay on ScrollTrigger because they are purely cosmetic — if
   they misfire, nothing disappears; only a subtle effect is absent.

   Safety contract:
   - Returns immediately under prefers-reduced-motion; content stays final-state.
   - Initialises exactly once, after SmoothScroll signals `ready` (kills the
     double-bind race that stranded reveals).
   - Cleanup disconnects observers and clears every inline style it set, so the
     DOM returns to its natural visible state on unmount / Fast Refresh.
   --------------------------------------------------------------------------- */
import { useEffect } from "react";
import { useScrollState } from "./SmoothScroll";

const EASE = "cubic-bezier(.22,1,.36,1)";

export function HomeScrollFx() {
  const { smoother, ready } = useScrollState();

  useEffect(() => {
    if (!ready) return;
    if (!window.matchMedia("(prefers-reduced-motion:no-preference)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let removeTicker: (() => void) | undefined;
    let fallback = 0;                                // in-viewport safety timer
    let removeScan: (() => void) | undefined;        // scroll-scan safety listener
    const styled = new Set<HTMLElement>();        // nodes carrying our inline reveal styles
    const observers: IntersectionObserver[] = [];

    /* ---- 1 · Reveals — IntersectionObserver + inline transitions ---------- */
    const arm = (el: HTMLElement) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      styled.add(el);
    };
    const fire = (el: HTMLElement, delay: number) => {
      el.style.transition = `opacity .9s ${EASE} ${delay}ms, transform .9s ${EASE} ${delay}ms`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      window.setTimeout(() => {
        // Landed: drop our inline styles so the element reverts to natural state.
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = "";
        styled.delete(el);
      }, 1000 + delay);
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        fire(e.target as HTMLElement, 0);
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 });
    observers.push(io);
    document.querySelectorAll<HTMLElement>("main [data-reveal]").forEach((el) => {
      arm(el);
      io.observe(el);
    });

    const gio = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const kids = Array.from((e.target as HTMLElement).children) as HTMLElement[];
        kids.forEach((k, i) => fire(k, i * 80));
        gio.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    observers.push(gio);
    document.querySelectorAll<HTMLElement>("main [data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((c) => arm(c as HTMLElement));
      gio.observe(group);
    });

    /* Safety net (independent of IO / rAF): reveal any armed node that is already
       on-screen. Runs on a timer (covers a tab that loaded hidden) and on scroll
       (covers any missed IO callback), so content can never be stranded invisible
       while leaving below-fold nodes armed for the intended scroll experience. */
    const scanInView = () => {
      if (!styled.size) return;
      Array.from(styled).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          fire(el, 0);
          io.unobserve(el);
          gio.unobserve(el);
        }
      });
    };
    fallback = window.setTimeout(scanInView, 1400);
    let scanQueued = false;
    const onScroll = () => {
      if (scanQueued) return;
      scanQueued = true;
      window.setTimeout(() => { scanQueued = false; scanInView(); }, 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    removeScan = () => window.removeEventListener("scroll", onScroll);

    /* ---- 2 · Parallax + marquee velocity — ScrollTrigger (cosmetic only) -- */
    (async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // ScrollTrigger runs on the native window scroller (hijack retired — see
      // SmoothScroll HIJACK). It would equally measure the smoothed position if
      // the smoother path were ever re-enabled.
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const parallax = (sel: string, amt: number, scale: number) => {
          gsap.utils.toArray<HTMLElement>(sel).forEach((el) => {
            gsap.set(el, { scale });
            gsap.fromTo(
              el,
              { yPercent: -amt },
              {
                yPercent: amt, ease: "none",
                scrollTrigger: {
                  trigger: el.closest("section") ?? el,
                  start: "top bottom", end: "bottom top", scrub: true,
                },
              },
            );
          });
        };
        parallax(".hero-media .hero-photo", 5, 1.14);
        parallax(".statement .statement-fig img", 6, 1.12);
        parallax(".fac-media img", 5, 1.12);

        /* Marquee velocity — modulate the existing CSS loop's playbackRate
           (no re-tween, no jump). Eases toward a scroll-velocity target and
           self-decays back to 1x when scrolling stops. */
        const track = document.querySelector<HTMLElement>(".ticker-track");
        if (track && typeof track.getAnimations === "function") {
          const anims = track.getAnimations().filter((a) => a instanceof CSSAnimation) as CSSAnimation[];
          if (anims.length) {
            const state = { rate: 1 };
            let target = 1;
            const onTick = () => {
              state.rate += (target - state.rate) * 0.08;
              target += (1 - target) * 0.04;
              anims.forEach((a) => { try { a.playbackRate = state.rate; } catch { /* noop */ } });
            };
            gsap.ticker.add(onTick);
            removeTicker = () => gsap.ticker.remove(onTick);
            ScrollTrigger.create({
              onUpdate: (self) => { target = 1 + Math.min(3, Math.abs(self.getVelocity()) / 900); },
            });
          }
        }

        /* Measure once everything (fonts/images) has laid out. */
        ScrollTrigger.refresh();
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad);
        if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
      }, "main");
    })();

    return () => {
      cancelled = true;
      if (fallback) window.clearTimeout(fallback);
      removeScan?.();
      observers.forEach((o) => o.disconnect());
      styled.forEach((el) => { el.style.opacity = ""; el.style.transform = ""; el.style.transition = ""; });
      styled.clear();
      removeTicker?.();
      ctx?.revert?.();
    };
  }, [ready, smoother]);

  return null;
}
