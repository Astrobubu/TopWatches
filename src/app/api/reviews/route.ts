import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - fetch all reviews (public)
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnon)
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ reviews: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - add or sync reviews (admin only)
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseService)
    const body = await req.json()
    const { reviews } = body

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: "reviews array is required" }, { status: 400 })
    }

    let inserted = 0
    for (const review of reviews) {
      const { error } = await supabase.from("reviews").upsert(
        {
          name: review.name,
          rating: review.rating,
          text: review.text,
          date: review.date,
          google_review_id: review.google_review_id || null,
          avatar_url: review.avatar_url || null,
        },
        { onConflict: "google_review_id" }
      )
      if (!error) inserted++
    }

    return NextResponse.json({ inserted, total: reviews.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
