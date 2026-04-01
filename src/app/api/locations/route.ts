import { NextRequest, NextResponse } from "next/server"
import {
  getAllLocationPages,
  createLocationPage,
  updateLocationPage,
  deleteLocationPage,
} from "@/lib/locations"

export async function GET() {
  const pages = await getAllLocationPages()
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const page = await createLocationPage(body)
    return NextResponse.json(page)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create location page"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const page = await updateLocationPage(id, updates)
    return NextResponse.json(page)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  try {
    await deleteLocationPage(id)
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to delete"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
