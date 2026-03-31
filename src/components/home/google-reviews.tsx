"use client"

import { Star } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { useEffect, useState } from "react"

const GOOGLE_MAPS_URL = "https://search.google.com/local/writereview?placeid=ChIJZ7gB8SNDXz4RtnHpkXD54SQ"

interface Review {
  id?: string
  name: string
  rating: number
  text: string
  date: string
  avatar_url?: string | null
}

// Fallback reviews from Google Maps listing
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Ahmed Alghamdi",
    rating: 5,
    date: "1 month ago",
    text: "Top-notch dealings and trust",
  },
  {
    name: "Yunis Swidi",
    rating: 5,
    date: "2 years ago",
    text: "",
  },
  {
    name: "Pretty Becky",
    rating: 3,
    date: "4 years ago",
    text: "",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export function GoogleReviews() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS)

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
        }
      })
      .catch(() => {})
  }, [])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0"

  return (
    <section
      className="dark-section py-20 md:py-28 px-6 md:px-16"
      style={{ backgroundColor: 'var(--dark-section-bg)', color: 'var(--dark-section-text)' }}
    >
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16 dark-section-animate">
        <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">{t("reviews.verified")}</h3>
        <h2 className="font-serif italic text-3xl md:text-5xl mb-4">{t("reviews.title")}</h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-sans font-bold text-lg">{avgRating}</span>
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="opacity-40 text-sm font-sans">({reviews.length} {t("reviews.reviewsCount")})</span>
          </div>
        </div>
        <p className="font-mono text-[11px] opacity-40 mt-3">
          Golden Planet Watches — Gold Souq, Dubai
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review, i) => (
          <div
            key={review.id || review.name}
            className="p-6 dark-section-animate"
            style={{
              borderRadius: 'var(--card-radius)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
              backgroundColor: 'var(--dark-section-card)',
              color: 'var(--dark-section-text)',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 bg-primary/15 text-primary flex items-center justify-center font-sans font-bold text-sm"
                style={{ borderRadius: 'var(--pill-radius)' }}
              >
                {review.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-sans font-semibold text-sm">{review.name}</p>
                <p className="font-mono text-[10px] opacity-40">{review.date}</p>
              </div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <StarRating rating={review.rating} />
            <p className="opacity-60 text-sm leading-relaxed mt-3 font-sans">{review.text}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center mt-10 dark-section-animate" style={{ animationDelay: '0.6s' }}>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-sm text-primary hover:opacity-80 transition-opacity"
        >
          {t("reviews.seeAll")}
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" /></svg>
        </a>
      </div>
    </section>
  )
}
