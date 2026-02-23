"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-500 ease-out px-5 md:px-6 py-3 flex items-center justify-between ${scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-2xl"
          : "bg-transparent"
          }`}
        style={{ borderRadius: 'var(--pill-radius)', border: scrolled ? 'var(--border-w) solid var(--border)' : '1px solid transparent' }}
      >
        {/* Logo */}
        <Link href="/" className="font-sans font-bold text-xl md:text-2xl tracking-tight text-primary hover:text-accent transition-colors">
          TopWatches
        </Link>

        {/* Desktop Links & Switcher */}
        <div className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-foreground/80">
          <Link href="/collections" className="hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <ThemeSwitcher />
        </div>

        {/* Desktop CTA */}
        <Link
          href="/collections"
          className="hidden md:inline-flex bg-primary text-primary-foreground px-5 py-2 text-sm font-bold hover:bg-foreground hover:text-background transition-colors"
          style={{ borderRadius: 'var(--pill-radius)' }}
        >
          Shop Now
        </Link>

        {/* Mobile Toggle & Switcher */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-xl font-sans font-medium text-foreground">
          <Link href="/collections" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors">
            About
          </Link>
          <Link
            href="/collections"
            onClick={() => setMobileOpen(false)}
            className="bg-primary text-primary-foreground px-8 py-3 font-bold hover:bg-foreground hover:text-background transition-colors mt-4"
            style={{ borderRadius: 'var(--pill-radius)' }}
          >
            Shop Now
          </Link>
        </div>
      )}
    </>
  )
}
