"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Search, User, ShoppingBag, Menu, X, ChevronDown,
} from "lucide-react";
import gsap from "gsap";

import { useCart } from "@/lib/cart-context";
import SearchOverlay from "@/components/search/SearchOverlay";
import BrandsMenu from "@/components/layout/menus/BrandsMenu";
import FlavorsMenu from "@/components/layout/menus/FlavorsMenu";
import InfoAccountMenu from "@/components/layout/menus/InfoAccountMenu";
import { brands } from "@/lib/data";
import { flavors } from "@/lib/data";
import { getFlavorIcon } from "@/lib/flavorIcons";

type MegaKey = "brands" | "flavors" | "info";
type MobileExpandKey = "brands" | "flavors" | "info" | null;

const navLinks: { label: string; href: string; mega?: MegaKey }[] = [
  { label: "Home", href: "/" },
  { label: "Brands", href: "/brands", mega: "brands" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "On Sale", href: "/sale" },
  { label: "Flavors", href: "/flavors", mega: "flavors" },
  { label: "Bundles", href: "/bundles" },
  { label: "Info and Account", href: "/account", mega: "info" },
];

export default function Navbar() {
  const [openMega, setOpenMega] = useState<MegaKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<MobileExpandKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const pathname = usePathname();

  // ── GSAP refs (mobile only) ──
  // drawerRef: the sliding panel itself
  const drawerRef = useRef<HTMLDivElement>(null);
  // backdropRef: the semi-transparent overlay behind the drawer
  const backdropRef = useRef<HTMLDivElement>(null);
  // navItemsRef: all individual nav rows inside the drawer
  const navItemsRef = useRef<HTMLElement[]>([]);
  // hamburgerRef / closeRef: icon buttons for scale feedback
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // True only when the viewport is ≤ 768 px at mount.
  // We read this once and never re-read it so desktop is never affected.
  const isMobileRef = useRef(false);
  useEffect(() => {
    isMobileRef.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  // ── Drawer open animation ──
  const animateOpen = useCallback(() => {
    if (!isMobileRef.current) return;

    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Skip all animation — just make visible
      gsap.set(drawer, { x: 0 });
      gsap.set(backdrop, { opacity: 1 });
      return;
    }

    // Kill any in-progress tweens on these elements
    gsap.killTweensOf([drawer, backdrop, navItemsRef.current]);

    // Drawer slides in from the right (starts 100% off-screen)
    gsap.fromTo(
      drawer,
      { x: "100%" },
      { x: 0, duration: 0.42, ease: "power3.out" }
    );

    // Backdrop fades in
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );

    // Nav items stagger up from slight offset — only items currently in the DOM
    if (navItemsRef.current.length) {
      gsap.fromTo(
        navItemsRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          ease: "power2.out",
          stagger: 0.07,   // 0.07 s between each link
          delay: 0.18,     // let the drawer arrive first
        }
      );
    }
  }, []);

  // ── Drawer close animation ──
  const animateClose = useCallback((onComplete?: () => void) => {
    if (!isMobileRef.current) {
      onComplete?.();
      return;
    }

    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) { onComplete?.(); return; }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(drawer, { x: "100%" });
      gsap.set(backdrop, { opacity: 0 });
      onComplete?.();
      return;
    }

    gsap.killTweensOf([drawer, backdrop]);

    // Drawer slides back out
    gsap.to(drawer, { x: "100%", duration: 0.35, ease: "power3.in" });

    // Backdrop fades out; call onComplete when done so React state updates
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete,
    });
  }, []);

  // Run open animation whenever mobileOpen becomes true
  useEffect(() => {
    if (mobileOpen) {
      animateOpen();
    }
  }, [mobileOpen, animateOpen]);

  // Helper: collect nav item DOM nodes into ref array
  const collectNavItem = (el: HTMLElement | null) => {
    if (el && !navItemsRef.current.includes(el)) {
      navItemsRef.current.push(el);
    }
  };

  const closeMobile = () => {
    animateClose(() => {
      setMobileOpen(false);
      setMobileExpanded(null);
      navItemsRef.current = []; // reset for next open
    });
  };

  const toggleMobileExpand = (key: MobileExpandKey) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  // ── Hamburger button scale feedback (mobile) ──
  const handleHamburgerPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobileRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.97 },
        { scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
    e.stopPropagation();
    setMobileOpen(true);
  };

  // ── Close button scale feedback (mobile) ──
  const handleClosePress = () => {
    if (!isMobileRef.current) { closeMobile(); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && closeRef.current) {
      gsap.fromTo(
        closeRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
    closeMobile();
  };

  const isActive = (link: typeof navLinks[0]) => {
    if (link.href === "/") return pathname === "/";
    if (link.mega === "brands") return pathname.startsWith("/brands");
    if (link.mega === "flavors") return pathname.startsWith("/flavors");
    if (link.mega === "info") return pathname.startsWith("/account") || pathname.startsWith("/contact");
    return pathname === link.href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logos/store-logo.png"
            alt="My Store"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            My Store
          </span>
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-7" onMouseLeave={() => setOpenMega(null)}>
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => setOpenMega(link.mega ?? null)}
            >
              {link.mega ? (
                <button
                  type="button"
                  onClick={() => setOpenMega(openMega === link.mega ? null : link.mega!)}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors ${isActive(link) ? "text-primary" : "text-[#111111] hover:text-primary"}`}
                  aria-expanded={openMega === link.mega}
                >
                  {link.label}
                  <ChevronDown size={14} />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors ${isActive(link) ? "text-primary" : "text-[#111111] hover:text-primary"}`}
                >
                  {link.label}
                </Link>
              )}

              {link.mega === "brands" && openMega === "brands" && <BrandsMenu />}
              {link.mega === "flavors" && openMega === "flavors" && <FlavorsMenu />}
              {link.mega === "info" && openMega === "info" && <InfoAccountMenu />}
            </div>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-ink-soft hover:text-primary transition-colors"
          >
            <Search size={20} />
          </button>
          <Link href="/account" aria-label="Sign in" className="hidden sm:block text-ink-soft hover:text-primary transition-colors">
            <User size={20} />
          </Link>
          <button
            aria-label="Cart"
            onClick={openCart}
            className="relative text-ink-soft hover:text-primary transition-colors"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </button>

          {/* Hamburger — scale feedback on mobile press */}
          <button
            ref={hamburgerRef}
            aria-label="Open menu"
            className="lg:hidden text-ink-soft"
            onClick={handleHamburgerPress}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* ─── Mobile drawer ─── */}
      {mobileOpen && (
        /*
         * Backdrop — ref'd so GSAP can fade it independently.
         * Opacity starts at 0; animateOpen() drives it to 1.
         */
        <div
          ref={backdropRef}
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          style={{ opacity: 0 }}  // GSAP animates from here
          onClick={(e) => { e.stopPropagation(); closeMobile(); }}
        >
          {/*
           * Drawer panel — starts translateX(100%) off-screen;
           * animateOpen() slides it to translateX(0).
           */}
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 h-screen w-80 max-w-[90vw] flex flex-col bg-white shadow-2xl"
            style={{ transform: "translateX(100%)" }} // GSAP animates from here
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4 shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logos/store-logo.png"
                  alt="My Store"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <span className="font-display text-base font-bold text-ink">My Store</span>
              </div>
              {/* Close button — scale feedback on press */}
              <button
                ref={closeRef}
                onClick={handleClosePress}
                aria-label="Close menu"
                className="rounded-full p-1.5 text-ink-soft hover:bg-tint hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Nav items — scrollable ── */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <div className="flex flex-col gap-0.5">

                {/* Home — collectNavItem captures DOM ref for stagger */}
                <Link
                  href="/"
                  ref={collectNavItem}
                  onClick={closeMobile}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  style={{ opacity: 0 }} // GSAP stagger drives to 1
                >
                  Home
                </Link>

                {/* Brands accordion */}
                <div ref={collectNavItem} style={{ opacity: 0 }}>
                  <button
                    type="button"
                    onClick={() => toggleMobileExpand("brands")}
                    aria-expanded={mobileExpanded === "brands"}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  >
                    <span>Brands</span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-faint transition-transform duration-200 ${mobileExpanded === "brands" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpanded === "brands" && (
                    <div className="flex flex-col gap-0.5 pl-3">
                      {brands.map((b) => (
                        <Link
                          key={b.id}
                          href={`/brands/${b.slug}`}
                          onClick={closeMobile}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                        >
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-[#e8ecf0] bg-white">
                            <Image
                              src={b.logo_url}
                              alt={b.name}
                              fill
                              className="object-contain p-0.5"
                              sizes="28px"
                            />
                          </div>
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Arrivals */}
                <Link
                  href="/new-arrivals"
                  ref={collectNavItem}
                  onClick={closeMobile}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  style={{ opacity: 0 }}
                >
                  New Arrivals
                </Link>

                {/* On Sale */}
                <Link
                  href="/sale"
                  ref={collectNavItem}
                  onClick={closeMobile}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  style={{ opacity: 0 }}
                >
                  On Sale
                </Link>

                {/* Flavors accordion */}
                <div ref={collectNavItem} style={{ opacity: 0 }}>
                  <button
                    type="button"
                    onClick={() => toggleMobileExpand("flavors")}
                    aria-expanded={mobileExpanded === "flavors"}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  >
                    <span>Flavors</span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-faint transition-transform duration-200 ${mobileExpanded === "flavors" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpanded === "flavors" && (
                    <div className="flex flex-col gap-0.5 pl-3">
                      {flavors.map((f) => {
                        const { icon: Icon, color } = getFlavorIcon(f.name);
                        return (
                          <Link
                            key={f.id}
                            href={`/flavors/${f.slug}`}
                            onClick={closeMobile}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                          >
                            <span
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${color}1a` }}
                            >
                              <Icon size={14} style={{ color }} />
                            </span>
                            {f.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bundles */}
                <Link
                  href="/bundles"
                  ref={collectNavItem}
                  onClick={closeMobile}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  style={{ opacity: 0 }}
                >
                  Bundles
                </Link>

                {/* Info and Account accordion */}
                <div ref={collectNavItem} style={{ opacity: 0 }}>
                  <button
                    type="button"
                    onClick={() => toggleMobileExpand("info")}
                    aria-expanded={mobileExpanded === "info"}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                  >
                    <span>Info and Account</span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-faint transition-transform duration-200 ${mobileExpanded === "info" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpanded === "info" && (
                    <div className="flex flex-col gap-0.5 pl-3">
                      <Link
                        href="/account"
                        onClick={closeMobile}
                        className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/contact"
                        onClick={closeMobile}
                        className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-tint hover:text-primary"
                      >
                        Contact
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
