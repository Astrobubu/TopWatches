import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || ""
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return "today"
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? "s" : ""} ago`
}

export async function POST() {
  if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY and GOOGLE_PLACE_ID env vars are required" },
      { status: 400 }
    )
  }

  try {
    // Fetch reviews from Google Places API (New)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}&reviews_sort=newest&language=en`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Google API error: ${data.status} - ${data.error_message || ""}` },
        { status: 502 }
      )
    }

    const googleReviews = data.result?.reviews || []
    if (googleReviews.length === 0) {
      return NextResponse.json({ message: "No reviews returned by Google", synced: 0 })
    }

    const supabase = createClient(supabaseUrl, supabaseService)

    let synced = 0
    for (const review of googleReviews) {
      const { error } = await supabase.from("reviews").upsert(
        {
          name: review.author_name,
          rating: review.rating,
          text: review.text || "",
          date: timeAgo(review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString()),
          google_review_id: `google_${review.time}_${review.author_name.replace(/\s+/g, "_")}`,
          avatar_url: review.profile_photo_url || null,
        },
        { onConflict: "google_review_id" }
      )
      if (!error) synced++
    }

    return NextResponse.json({
      synced,
      total: googleReviews.length,
      overall_rating: data.result?.rating,
      total_reviews: data.result?.user_ratings_total,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
