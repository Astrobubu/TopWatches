import { NextRequest, NextResponse } from "next/server"
import {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
} from "@/lib/blog"

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "all"
  const posts = await getAllBlogPosts(status)
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const post = await createBlogPost(body)
    return NextResponse.json(post)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const post = await updateBlogPost(id, updates)
    return NextResponse.json(post)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  try {
    await deleteBlogPost(id)
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to delete post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
