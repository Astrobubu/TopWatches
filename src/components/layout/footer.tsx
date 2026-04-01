"use client"

import Link from "next/link"
import { Shield, Truck, RotateCcw, MapPin, Phone } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useTranslation()

  const pillars = [
    { icon: Shield, title: t("footer.authenticated"), desc: t("footer.authDesc") },
    { icon: Truck, title: t("footer.insuredShipping"), desc: t("footer.shippingDesc") },
    { icon: RotateCcw, title: t("footer.returns"), desc: t("footer.returnsDesc") },
  ]

  return (
    <footer className="bg-background px-6 md:px-16 mt-0">
      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map(p => (
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
            <span className="font-sans font-bold text-2xl tracking-tight text-foreground block mb-4">{t("brand")}</span>
            <p className="text-foreground/40 font-sans max-w-xs leading-relaxed text-sm">
              {t("tagline")}
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/60 mt-3">
              {t("footer.established")}
            </p>
            <div className="mt-4 space-y-2 text-foreground/40 text-xs font-sans">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                Al Dukhan Building, Shop No. 3, Gold Souq, Dubai, UAE
              </p>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                WhatsApp: +1234567890
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-foreground text-xs tracking-widest mb-5 opacity-50 uppercase">{t("footer.navigation")}</h4>
            <ul className="space-y-3 font-sans text-sm text-foreground/50">
              <li><Link href="/collections" className="hover:text-primary transition-colors">{t("nav.allWatches")}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{t("nav.aboutUs")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-foreground text-xs tracking-widest mb-5 opacity-50 uppercase">{t("footer.legal")}</h4>
            <ul className="space-y-3 font-sans text-sm text-foreground/50">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/condition-guide" className="hover:text-primary transition-colors">{t("footer.authenticity")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-foreground/10">
          <p className="text-foreground/30 font-sans text-[11px] leading-relaxed text-center max-w-2xl mx-auto mb-4 italic">
            We are not an official dealer for the products we sell and have no affiliation with the manufacturer. All brand names and trademarks are the property of their respective owners and are used for identification purposes only.
          </p>
          <p className="text-foreground/30 font-sans text-xs text-center">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
