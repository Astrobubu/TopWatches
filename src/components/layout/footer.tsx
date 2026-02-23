import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background rounded-t-[var(--container-radius)] md:rounded-t-[var(--container-radius)] px-6 md:px-16 pt-16 pb-10 border-t border-border/30 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16 max-w-7xl mx-auto">
        <div className="md:col-span-2">
          <span className="font-serif font-bold text-2xl tracking-wide text-foreground block mb-4">TopWatches</span>
          <p className="text-foreground/40 font-sans max-w-xs leading-relaxed text-sm">
            Curated. Authenticated. Delivered. Your trusted marketplace for pre-owned luxury timepieces.
          </p>
        </div>
        <div>
          <h4 className="font-mono text-foreground text-xs tracking-widest mb-5 opacity-50 uppercase">Navigation</h4>
          <ul className="space-y-3 font-sans text-sm text-foreground/50">
            <li><Link href="/collections" className="hover:text-primary transition-colors">All Watches</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-foreground text-xs tracking-widest mb-5 opacity-50 uppercase">Legal</h4>
          <ul className="space-y-3 font-sans text-sm text-foreground/50">
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Authenticity Guarantee</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-foreground/30 font-sans text-xs">© 2026 TopWatches. All rights reserved.</p>
        <div className="flex items-center gap-2 bg-foreground/5 rounded-full px-3 py-1.5 border border-foreground/10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] text-foreground/50 tracking-wider">SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </footer>
  )
}
