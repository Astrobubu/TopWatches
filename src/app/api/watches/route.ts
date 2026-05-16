import { NextRequest, NextResponse } from "next/server"
import { getWatches, createWatch, updateWatch, deleteWatch } from "@/lib/db"
import type { Watch } from "@/lib/types"

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function summarizeWatch(watch: Watch) {
  return {
    id: watch.id,
    brand: watch.brand,
    model: watch.model,
    reference: watch.reference,
    price: watch.price,
    images: watch.images?.slice(0, 1) ?? [],
    imageVariants: watch.imageVariants?.slice(0, 1) ?? [],
    specs: {
      caseSize: watch.specs?.caseSize,
      year: watch.specs?.year,
    },
    category: watch.category,
    condition: watch.condition,
    gender: watch.gender,
    scope: watch.scope,
    featured: watch.featured,
    soldOut: watch.soldOut,
  }
}

export async function GET(req: NextRequest) {
  try {
    const watches = await getWatches()
    const view = req.nextUrl.searchParams.get("view")
    const payload = view === "summary" ? watches.map(summarizeWatch) : watches

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Vercel-CDN-Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const watch = await createWatch(body)
    return NextResponse.json(watch, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
    const watch = await updateWatch(id, data)
    return NextResponse.json(watch)
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
    await deleteWatch(id)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
