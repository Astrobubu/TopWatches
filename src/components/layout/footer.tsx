import Link from "next/link"
import { Shield, Truck, RotateCcw } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background px-6 md:px-16 mt-0">
      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Authenticated", desc: "Every watch verified by certified watchmakers." },
            { icon: Truck, title: "Insured Shipping", desc: "Fully insured delivery with real-time tracking." },
            { icon: RotateCcw, title: "14-Day Returns", desc: "Full money-back guarantee. Zero friction." },
          ].map(p => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary" style={{ borderRadius: 'var(--pill-radius)' }}>
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-foreground/50 text-xs leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-foreground/10 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <span className="font-serif font-bold text-2xl tracking-wide text-foreground block mb-4">Golden Watches</span>
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

        <div className="pt-6 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-foreground/30 font-sans text-xs">© 2026 Golden Watches. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
