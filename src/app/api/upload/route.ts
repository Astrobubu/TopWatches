import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const watchId = formData.get("watchId") as string || "temp"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${watchId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await admin.storage
      .from("watch-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = admin.storage
      .from("watch-images")
      .getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
