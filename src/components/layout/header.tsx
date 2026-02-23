"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/layout/search-bar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif font-bold text-2xl tracking-wider shrink-0"
          >
            KRONOS
          </Link>

          {/* Center: Search bar - desktop only */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchBar />
          </div>

          {/* Right: Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/collections">Collections</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">About</Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>

          {/* Right: Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-serif font-bold text-2xl tracking-wider">
              KRONOS
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-4 mt-4">
            {/* Mobile search */}
            <div className="mb-4">
              <SearchBar />
            </div>

            <Button
              variant="ghost"
              className="justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/collections">Collections</Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/about">About</Link>
            </Button>

            <div className="my-2 h-px bg-border" />

            <Button
              variant="ghost"
              className="justify-start gap-2"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="#">
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="#">
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
