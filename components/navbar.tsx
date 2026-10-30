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
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

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

        <nav className={navClass} id="site-nav" aria-label="Primary">
          {NAV.map((item) =>
            item.kind === "mega" ? (
              <MegaItem key={item.label} item={item} megaOpen={megaOpen} onToggle={() => setMegaOpen((v) => !v)} active={isProductsActive(pathname)} />
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
  active,
}: {
  item: Extract<NavItem, { kind: "mega" }>;
  megaOpen: boolean;
  onToggle: () => void;
  active: boolean;
}) {
  const pathname = usePathname();
  return (
    <div
      className={["nav-item has-mega", megaOpen ? "is-open" : ""].filter(Boolean).join(" ")}
      data-mega
    >
      <button
        className="mega-trigger"
        type="button"
        aria-expanded={megaOpen}
        aria-controls="mega-products"
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          // Blur so site.css :focus-within doesn't pin the panel open after we
          // toggle it shut (the close bug). Keyboard focus still opens via
          // :focus-within; Tab users are unaffected.
          e.currentTarget.blur();
          onToggle();
        }}
      >
        <span className="n">{item.num}</span>
        {item.label} <span className="caret" aria-hidden="true" />
      </button>
      <div className="mega" id="mega-products">
        <div className="mega-inner">
          <Link className="mega-feature" href={item.feature.href}>
            {/* Red duotone photo under the panel copy (luminosity blend over the
                plate, see .mf-photo): kills the flat red block without touching
                the white-only-on-red-plate text rule. Decorative + lazy, so the
                menu stays instant. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mf-photo" src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=70" alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />
            <span className="mf-kicker">{item.feature.kicker}</span>
            <span className="mf-title">{item.feature.title}</span>
            <span className="mf-sub">{item.feature.sub}</span>
            <span className="mf-cta">{item.feature.cta} <Icon name="arrow" prefix="mg" /></span>
          </Link>
          {item.groups.map((group) => (
            <div className="mega-col" key={group.heading}>
              <p className="mega-h">{group.heading}</p>
              {group.items.map((c) => (
                <Link
                  key={c.href}
                  className={["mega-card", pathname === c.href ? "is-current" : ""].filter(Boolean).join(" ")}
                  href={c.href}
                  aria-current={pathname === c.href ? "page" : undefined}
                >
                  <span className="mc-ic"><Icon name={c.icon} prefix="mg" /></span>
                  <span className="mc-b"><b>{c.label}</b><small>{c.sub}</small></span>
                  <Icon name="arrow" prefix="mg" className="mc-go" />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
