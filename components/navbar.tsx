"use client";
/* ---------------------------------------------------------------------------
   Top navbar — the sole navigation (bottom dock retired by design).
   Ports the corrected behaviours: mega-menu toggles open AND closed (no
   :focus-within auto-open bug), solid-red/white active pill with white label
   held on hover/open, underline hover, scrolled state, and a hide-on-scroll-down
   / show-on-scroll-up drawer that stays locked while any overlay is open.
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, type NavItem } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { Icon } from "./icons";
import { useEnquiry } from "./enquiry";

/* usePathname() returns the served URL, trailing slash included, so every
   comparison here drops the slash first. Without this "/products/" + "/" would
   look for "/products//" and no product page would ever light the pill. */
const unslash = (p: string): string => (p.length > 1 ? p.replace(/\/$/, "") : p);

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  const path = unslash(pathname);
  const target = unslash(href);
  return path === target || path.startsWith(`${target}/`);
}

/* The Products pill covers the hub plus every product page, at whatever depth
   the client scheme puts it: /products/..., /gas-trains/ and /brands/gasvigil/. */
const PRODUCT_PATHS = PRODUCTS.map((p) => unslash(p.route));

function isProductsActive(pathname: string): boolean {
  const path = unslash(pathname);
  return path === "/products" || PRODUCT_PATHS.some((r) => path === r || path.startsWith(`${r}/`));
}

export function Navbar() {
  const pathname = usePathname();
  const { open } = useEnquiry();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const lastY = useRef(0);

  // Publish the real header height as --nav-h so every full-height hero and
  // sticky offset fits the frame, whatever the font scale or zoom.
  useEffect(() => {
    const head = document.querySelector<HTMLElement>(".site-head");
    if (!head) return;
    const set = () => document.documentElement.style.setProperty("--nav-h", `${Math.round(head.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(head);
    return () => ro.disconnect();
  }, []);

  // Close overlays on route change.
  useEffect(() => {
    setNavOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Desktop mega-menu close fix: site.css also opens the mega on
  // .has-mega:focus-within. Clicking the trigger focuses the button, so that
  // rule re-opens the panel every time React toggles it shut — the menu could
  // never be closed by clicking. While open, dismiss on an outside pointer
  // press and on Escape (the trigger itself blurs on click, see MegaItem).
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: PointerEvent) => {
      const host = document.querySelector("[data-mega]");
      if (host && !host.contains(e.target as Node)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const host = document.querySelector("[data-mega]");
      const hadFocus = host?.contains(document.activeElement);
      setMegaOpen(false);
      if (hadFocus) host?.querySelector<HTMLElement>(".mega-trigger")?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  // Mobile drawer: close on Escape or a tap outside, and lock page scroll while open.
  useEffect(() => {
    if (!navOpen) return;
    const html = document.documentElement;
    html.classList.add("nav-lock");
    const onDown = (e: PointerEvent) => {
      const head = document.querySelector(".site-head");
      if (head && !head.contains(e.target as Node)) setNavOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setNavOpen(false);
      document.querySelector<HTMLElement>(".nav-toggle")?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("nav-lock");
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  // Any link (or the quote button) pressed inside the nav closes the menus, even
  // when it targets the page you are already on or a #hash, where the pathname
  // never changes.
  const onNavClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as Element).closest("a, .nav-cta")) {
      setMegaOpen(false);
      setNavOpen(false);
    }
  };

  // Scroll: is-scrolled state + drawer.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 10);
        const locked = navOpen || megaOpen;
        if (locked || y < 120) setHidden(false);
        else if (y > lastY.current + 6) setHidden(true);
        else if (y < lastY.current - 6) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [navOpen, megaOpen]);

  const headClass = [
    "site-head",
    scrolled ? "is-scrolled" : "",
    pathname === "/" && !scrolled && !navOpen && !megaOpen ? "is-over-hero" : "",
    hidden ? "gt-head-hidden" : "",
  ].filter(Boolean).join(" ");

  const navClass = ["site-nav", navOpen ? "is-open" : ""].filter(Boolean).join(" ");

  return (
    <header className={headClass} id="top">
      <div className="wrap head-inner">
        <Link className="brand" href="/" aria-label="Gastech Combustions home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* gc-mark--static neutralises site.css's clip-path:inset(0 100% 0 0) reveal,
              which only un-clips when site.js adds .brand.revealed. site.js is not
              running here, so the mark was permanently clipped (invisible). The static
              modifier is the already-shipped footer treatment. */}
          <img className="gc-mark gc-mark--static" src="/assets/gc-logo.svg" alt="" aria-hidden="true" />
          <span className="brand-word"><b>GAS</b><span>TECH</span></span>
        </Link>

        <nav className={navClass} id="site-nav" aria-label="Primary" onClick={onNavClick}>
          {NAV.map((item) =>
            item.kind === "mega" ? (
              <MegaItem key={item.label} item={item} megaOpen={megaOpen} onToggle={() => setMegaOpen((v) => !v)} onSet={setMegaOpen} active={isProductsActive(pathname)} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                <span className="n">{item.num}</span>
                {item.label}
              </Link>
            ),
          )}
          <button
            className="btn btn--primary btn--sm nav-cta"
            type="button"
            onClick={() => open({ type: "sales", product: "General enquiry" })}
          >
            Get a Quote <Icon name="arrow" />
          </button>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

function MegaItem({
  item,
  megaOpen,
  onToggle,
  onSet,
  active,
}: {
  item: Extract<NavItem, { kind: "mega" }>;
  megaOpen: boolean;
  onToggle: () => void;
  onSet: (open: boolean) => void;
  active: boolean;
}) {
  const pathname = usePathname();
  const timer = useRef<number | undefined>(undefined);
  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 901px)").matches;
  const later = (open: boolean, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onSet(open), ms);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Keyboard: ArrowDown on the trigger opens and enters the panel; arrows, Home and
  // End walk the panel links; Tab out of the menu closes it.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const host = e.currentTarget;
    const links = Array.from(host.querySelectorAll<HTMLElement>(".mega a"));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (document.activeElement === host.querySelector(".mega-trigger") && e.key === "ArrowDown") {
      e.preventDefault();
      onSet(true);
      // wait for the panel to become visible (hidden links cannot take focus)
      window.setTimeout(() => links[0]?.focus(), 90);
    } else if (i >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
    } else if (i >= 0 && e.key === "Home") {
      e.preventDefault();
      links[0]?.focus();
    } else if (i >= 0 && e.key === "End") {
      e.preventDefault();
      links[links.length - 1]?.focus();
    }
  };

  return (
    <div
      className={["nav-item has-mega", megaOpen ? "is-open" : ""].filter(Boolean).join(" ")}
      data-mega
      onPointerEnter={(e) => { if (e.pointerType === "mouse" && canHover()) later(true, 90); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && canHover()) later(false, 200); }}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && !e.currentTarget.contains(next)) onSet(false);
      }}
    >
      <button
        className="mega-trigger"
        type="button"
        aria-expanded={megaOpen}
        aria-controls="mega-products"
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          // With a mouse on desktop the menu already opened on hover, so a click
          // keeps it open; touch and keyboard toggle.
          if (e.detail > 0 && canHover()) { window.clearTimeout(timer.current); onSet(true); }
          else onToggle();
        }}
      >
        <span className="n">{item.num}</span>
        {item.label} <span className="caret" aria-hidden="true" />
      </button>
      <div className="mega" id="mega-products">
        <div className="mega-inner">
          <Link className="mega-feature" href={item.feature.href}>
            {/* Decorative photo under a bottom scrim (see .mf-photo); lazy so the menu stays instant. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mf-photo" src={item.feature.img} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />
            <span className="mf-body">
              <span className="mf-title">{item.feature.title}</span>
              <span className="mf-sub">{item.feature.sub}</span>
              <span className="mf-cta">{item.feature.cta} <Icon name="arrow" prefix="mg" /></span>
            </span>
          </Link>
          {item.groups.map((group) => (
            <div className="mega-col" key={group.heading}>
              <p className="mega-h">{group.heading}</p>
              {group.items.map((c) => (
                <Link
                  key={c.href}
                  className={pathname === c.href ? "mega-card is-current" : "mega-card"}
                  href={c.href}
                  aria-current={pathname === c.href ? "page" : undefined}
                >
                  <span className="mc-ic"><Icon name={c.icon} prefix="mg" /></span>
                  <span className="mc-b"><b>{c.label}</b><small>{c.sub}</small></span>
                  <Icon name="arrow" prefix="mg" className="mc-go" />
                </Link>
              ))}
              {group.cta ? (
                <Link className="btn btn--primary mega-pill" href={group.cta.href}>
                  {group.cta.label} <Icon name="arrow" prefix="mg" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
