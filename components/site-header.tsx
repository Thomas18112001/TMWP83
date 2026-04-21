"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site-data";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle button-sheen wave-ghost"
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {dark
        ? <Sun className="h-[15px] w-[15px]" />
        : <Moon className="h-[15px] w-[15px]" />
      }
    </button>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-wp-black/85 shadow-2xl backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        {/* Gradient overlay for readability over hero */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 60%, transparent 100%)"
          }}
        />

        <div className="relative px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 transition-transform duration-300 hover:scale-[1.015]"
              onClick={() => setOpen(false)}
            >
              <img
                src="/brand/logo-light.png"
                alt="TMWP83"
                className="h-10 w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.32)]"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden min-w-0 items-center justify-center gap-1 whitespace-nowrap lg:flex xl:gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="premium-link rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:text-white xl:px-4 xl:text-xs"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA + Theme Toggle */}
            <div className="flex shrink-0 items-center justify-end gap-2.5">
              <ThemeToggle />
              <Link
                href="/contact"
                className="button-sheen wave-red hidden items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-gradient-to-r from-wp-red via-[#e03d2f] to-wp-red-dark px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_16px_40px_rgba(213,36,29,0.38)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(213,36,29,0.5)] lg:inline-flex"
              >
                Nous Rejoindre
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="button-sheen wave-ghost rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/12 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/*
        Mobile menu overlay — always in the DOM so CSS transitions run on both
        open and close. pointer-events-none when hidden so it doesn't block clicks.
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-[100] flex flex-col bg-wp-black lg:hidden transition-[opacity,transform] duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Red glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.25),transparent_35%)]" />

        {/* Top bar */}
        <div className="relative flex h-20 shrink-0 items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <img src="/brand/logo-light.png" alt="TMWP83" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="button-sheen wave-ghost rounded-full p-2 text-white"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Nav links with staggered entrance */}
        <nav className="relative flex flex-1 flex-col justify-center gap-1 px-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-3xl font-extrabold uppercase tracking-tight text-white transition-[opacity,transform] hover:text-wp-red sm:text-4xl ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
              style={{
                transitionDuration: "280ms",
                transitionDelay: open ? `${60 + i * 45}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="relative px-8 pb-10">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={`button-sheen wave-red block w-full rounded-full bg-wp-red px-6 py-4 text-center text-lg font-bold uppercase tracking-wider text-white transition-[opacity,transform] ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{
              transitionDuration: "280ms",
              transitionDelay: open ? `${60 + NAV_LINKS.length * 45}ms` : "0ms",
            }}
          >
            Nous rejoindre
          </Link>
        </div>
      </div>
    </>
  );
}
