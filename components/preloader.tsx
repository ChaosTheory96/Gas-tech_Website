"use client";
/* ---------------------------------------------------------------------------
   Preloader — a one-time branded intro overlay using the REAL Gastech logo
   (/assets/gc-logo.svg) + the GAS/TECH wordmark lockup. No invented motif.
   - Shows on the FIRST paint of a session only; a sessionStorage flag stops it
     replaying on every route change (route changes use app/loading.tsx instead).
   - It is a self-removing overlay, so page content is NEVER gated behind it and
     the `.js` class is never added. After it fades it unmounts entirely.
   - CLIENT DIRECTION: the overlay must NOT go away until its intro animation
     has FULLY played. Dismiss is therefore driven by a fixed choreography
     length (ANIM_MS) — never cut short on network speed. We additionally wait
     for the page to be ready so we never reveal a blank document, but we never
     dismiss before the animation completes.
   - Reduced-motion collapses the choreography to a brief, still-complete flash.
   --------------------------------------------------------------------------- */
import { useEffect, useState } from "react";

const SESSION_KEY = "gt-preloaded";

export function Preloader() {
  const [gone, setGone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked — treat as first visit */
    }
    if (seen) {
      setRemoved(true);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The full intro choreography. The logo wipe, wordmark rise and tagline
    // track all land inside this window (see BLOCK X in enhancements.css), so
    // holding for ANIM_MS guarantees the animation is never truncated.
    const animMs = reduce ? 700 : 2400;

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setGone(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setRemoved(true), reduce ? 250 : 650); // unmount after the fade
    };

    let ready = document.readyState === "complete";
    window.addEventListener("load", () => {
      ready = true;
    }, { once: true });

    // When the choreography has played out, only fade out once the page is also
    // ready — but never earlier than animMs, so the animation always completes.
    const finish = () => {
      if (ready) dismiss();
      else window.setTimeout(finish, 80);
    };
    const timer = window.setTimeout(finish, animMs);

    // Pathological safety net only (a load event that never fires). Always
    // later than animMs, so it can never cut the intro short.
    const cap = window.setTimeout(dismiss, animMs + 5000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(cap);
    };
  }, []);

  if (removed) return null;

  return (
    <div className="gt-preload" data-gone={gone ? "true" : "false"} aria-hidden="true">
      <div className="pl-stack">
        <span className="pl-lock">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pl-logo" src="/assets/gc-logo.svg" alt="" aria-hidden="true" />
          <span className="pl-word"><b>GAS</b><span>TECH</span></span>
        </span>
        <span className="pl-tag">Combustions</span>
      </div>
    </div>
  );
}
