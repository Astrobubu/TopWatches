import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-4">
        404
      </p>
      <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
        Page Not Found
      </h1>
      <p className="text-foreground/50 font-sans max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Browse our collection of luxury watches instead.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ borderRadius: "var(--card-radius)" }}
        >
          Go Home
        </Link>
        <Link
          href="/collections"
          className="px-6 py-3 font-sans font-semibold text-sm text-foreground/70 hover:text-primary transition-colors"
          style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
        >
          Browse Watches
        </Link>
      </div>
    </div>
  )
}
