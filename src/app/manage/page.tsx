"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  Download,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Upload,
  ZoomIn,
} from "lucide-react"
import type { Watch } from "@/lib/types"

type ViewMode = "list" | "add" | "edit"

interface ImportedSpecs {
  movement?: string
  caseMaterial?: string
  caseSize?: string
  dialColor?: string
  bracelet?: string
  year?: number
}

interface ImageResult {
  url: string
  source: string
  thumbnail?: string
  label?: string
}

export default function ManagePage() {
  const [watches, setWatches] = useState<Watch[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>("list")
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null)

  // Import state
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResultPicker, setShowResultPicker] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    brand: "",
    model: "",
    reference: "",
    price: 0,
    description: "",
    category: "sport" as Watch["category"],
    condition: "unworn" as Watch["condition"],
    gender: "men" as Watch["gender"],
    featured: false,
    specs: {
      movement: "",
      caseMaterial: "",
      caseSize: "",
      dialColor: "",
      bracelet: "",
      year: new Date().getFullYear(),
    } as ImportedSpecs,
  })

  // Image state
  const [imageResults, setImageResults] = useState<ImageResult[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [searchingImages, setSearchingImages] = useState(false)
  const [imageSearchQuery, setImageSearchQuery] = useState("")
  const [imagePage, setImagePage] = useState(1)
  const [hasMoreImages, setHasMoreImages] = useState(false)
  const [loadingMoreImages, setLoadingMoreImages] = useState(false)

  // Zoom modal state
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // Saving state
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [processingImages, setProcessingImages] = useState(false)
  const [processStatus, setProcessStatus] = useState("")

  // List filter state
  const [listFilter, setListFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState<"" | Watch["gender"]>("")

  // Scroll position preservation
  const listScrollRef = useRef(0)

  // Rolex database search state
  const [rolexResults, setRolexResults] = useState<ImageResult[]>([])
  const [rolexSearching, setRolexSearching] = useState(false)
  const [rolexQuery, setRolexQuery] = useState("")
  const [rolexError, setRolexError] = useState("")

  const fetchWatches = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/watches")
      if (res.ok) {
        const data = await res.json()
        setWatches(data)
      }
    } catch {
      console.error("Failed to fetch watches")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWatches()
  }, [fetchWatches])

  const generateId = (brand: string, model: string, reference: string) => {
    const base = `${brand}-${model}-${reference}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    return base || "new-watch"
  }

  const resetForm = () => {
    setFormData({
      id: "",
      brand: "",
      model: "",
      reference: "",
      price: 0,
      description: "",
      category: "sport",
      condition: "unworn",
      gender: "men",
      featured: false,
      specs: {
        movement: "",
        caseMaterial: "",
        caseSize: "",
        dialColor: "",
        bracelet: "",
        year: new Date().getFullYear(),
      },
    })
    setSelectedImages([])
    setImageResults([])
    setSearchQuery("")
    setImageSearchQuery("")
    setSearchError("")
    setSearchResults([])
    setShowResultPicker(false)
    setImagePage(1)
    setHasMoreImages(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchError("")
    setSearchResults([])
    setShowResultPicker(false)

    try {
      const res = await fetch("/api/import/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSearchError(data.error || "Search failed")
        return
      }

      const results = data.results || []
      if (results.length === 0) {
        setSearchError("No results found. Try a different search term.")
        return
      }

      if (results.length === 1) {
        selectResult(results[0])
      } else {
        setSearchResults(results)
        setShowResultPicker(true)
      }
    } catch {
      setSearchError("Network error. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  const selectResult = (data: any) => {
    setShowResultPicker(false)
    setSearchResults([])

    setFormData((prev) => ({
      ...prev,
      brand: data.brand || prev.brand,
      model: data.model || prev.model,
      reference: data.reference || prev.reference,
      description: data.description || prev.description,
      id: generateId(
        data.brand || prev.brand,
        data.model || prev.model,
        data.reference || prev.reference
      ),
      specs: {
        movement: data.specs?.movement || prev.specs.movement,
        caseMaterial: data.specs?.caseMaterial || prev.specs.caseMaterial,
        caseSize: data.specs?.caseSize || prev.specs.caseSize,
        dialColor: data.specs?.dialColor || prev.specs.dialColor,
        bracelet: data.specs?.bracelet || prev.specs.bracelet,
        year: data.specs?.year || prev.specs.year,
      },
    }))

    setImageSearchQuery(`${data.brand || ""} ${data.model || ""} ${data.reference || ""}`.trim())
  }

  const handleImageSearch = async (page: number = 1) => {
    const query = imageSearchQuery || `${formData.brand} ${formData.model}`.trim()
    if (!query) return

    if (page === 1) {
      setSearchingImages(true)
      setImageResults([])
    } else {
      setLoadingMoreImages(true)
    }

    try {
      const res = await fetch("/api/import/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page }),
      })

      if (res.ok) {
        const data = await res.json()
        if (page === 1) {
          setImageResults(data.images || [])
        } else {
          setImageResults((prev) => {
            const existingUrls = new Set(prev.map((img: ImageResult) => img.url))
            const newImages = (data.images || []).filter((img: ImageResult) => !existingUrls.has(img.url))
            return [...prev, ...newImages]
          })
        }
        setImagePage(page)
        setHasMoreImages(data.hasMore ?? false)
      }
    } catch {
      console.error("Image search failed")
    } finally {
      setSearchingImages(false)
      setLoadingMoreImages(false)
    }
  }

  const toggleImage = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    )
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue

        const formDataUpload = new FormData()
        formDataUpload.append("file", file)
        formDataUpload.append("watchId", formData.id || "temp")
        formDataUpload.append("position", String(selectedImages.length))

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        })

        if (res.ok) {
          const data = await res.json()
          if (data.url) {
            setSelectedImages((prev) => [...prev, data.url])
          }
        }
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const watchId =
        formData.id ||
        generateId(formData.brand, formData.model, formData.reference)

      // Step 1: Process external images through our pipeline
      const externalUrls = selectedImages.filter(
        (url) => !url.includes("supabase.co")
      )
      const supabaseUrls = selectedImages.filter((url) =>
        url.includes("supabase.co")
      )

      let finalImages: Array<string | { url: string; url_thumb?: string; url_optimized?: string }> =
        supabaseUrls.map((url) => url)

      if (externalUrls.length > 0) {
        setProcessingImages(true)
        setProcessStatus(`Processing ${externalUrls.length} images...`)
        try {
          const processRes = await fetch("/api/process-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ watchId, urls: externalUrls }),
          })

          if (processRes.ok) {
            const processData = await processRes.json()
            for (const result of processData.results) {
              finalImages.push({
                url: result.url,
                url_thumb: result.url_thumb,
                url_optimized: result.url_optimized,
              })
            }
            // Update selected images to show the processed Supabase URLs
            setSelectedImages([
              ...supabaseUrls,
              ...processData.results.map((r: any) => r.url),
            ])
          } else {
            // Processing failed — save with original external URLs
            finalImages.push(...externalUrls)
          }
        } catch {
          finalImages.push(...externalUrls)
        } finally {
          setProcessingImages(false)
          setProcessStatus("")
        }
      }

      // Step 2: Save the watch with processed image URLs
      const watchData = {
        ...formData,
        id: watchId,
        images: finalImages,
      }

      const isEdit = view === "edit"
      const res = await fetch("/api/watches", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchData),
      })

      if (res.ok) {
        await fetchWatches()
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        const data = await res.json()
        alert(`Save failed: ${data.error}`)
      }
    } catch {
      alert("Network error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this watch?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/watches?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchWatches()
      }
    } catch {
      alert("Delete failed")
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (watch: Watch) => {
    listScrollRef.current = window.scrollY
    setFormData({
      id: watch.id,
      brand: watch.brand,
      model: watch.model,
      reference: watch.reference,
      price: watch.price,
      description: watch.description,
      category: watch.category,
      condition: watch.condition,
      gender: watch.gender || "men",
      featured: watch.featured,
      specs: { ...watch.specs },
    })
    setSelectedImages([...watch.images])
    setImageResults([])
    setRolexResults([])
    setRolexQuery("")
    setRolexError("")
    setEditingWatch(watch)
    setView("edit")
    window.scrollTo({ top: 0 })
  }

  const handleRolexSearch = async (overrideQuery?: string) => {
    const query = (overrideQuery || rolexQuery).trim() || formData.reference.trim()
    if (!query) return
    setRolexSearching(true)
    setRolexError("")
    setRolexResults([])

    // Extract reference from URL or raw input
    let ref = query
    const urlRefMatch = query.match(/(m\d+[a-z]*-\d+)/i)
    if (urlRefMatch) {
      ref = urlRefMatch[1].toLowerCase()
    } else {
      // Normalize: add "m" prefix and "-0001" suffix if missing
      ref = ref.toLowerCase().replace(/\s+/g, "")
      if (!ref.startsWith("m")) ref = "m" + ref
      if (!ref.includes("-")) ref = ref + "-0001"
    }

    // Build CDN URLs directly — media.rolex.com has CORS: * and no bot blocking
    const views = [
      "upright-c",
      "upright-c-shadow",
      "showcase",
      "raw-dial-constant-size-with-shadow",
      "bezel-constant-size-with-shadow",
    ]
    // Transforms: t_v7 gives highest quality, t_v7-main-configurator is the hero shot, no transform is raw
    const transforms = ["t_v7", "t_v7-main-configurator", ""]
    // Try current and recent catalogue years
    const years = ["2025", "2024", "2023"]

    const candidates: { url: string; label: string }[] = []
    for (const year of years) {
      for (const view of views) {
        for (const t of transforms) {
          const tPart = t ? `${t}/` : ""
          candidates.push({
            url: `https://media.rolex.com/image/upload/q_auto/f_auto/${tPart}c_limit,w_2440/v1/catalogue/${year}/${view}/${ref}`,
            label: `${view}${t ? ` (${t})` : ""} ${year}`,
          })
        }
      }
    }

    // Probe all URLs in parallel using <img> onload/onerror (no CORS issues)
    const probeImage = (candidate: { url: string; label: string }): Promise<{ url: string; label: string; w: number; h: number } | null> =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ url: candidate.url, label: candidate.label, w: img.naturalWidth, h: img.naturalHeight })
        img.onerror = () => resolve(null)
        img.src = candidate.url
      })

    try {
      const results = await Promise.all(candidates.map(probeImage))
      const found: ImageResult[] = []
      const seen = new Set<string>()

      for (const result of results) {
        if (!result) continue
        // Deduplicate by view+transform (same combo across years — keep first/newest)
        const viewKey = result.url.replace(/\/catalogue\/\d{4}\//, "/catalogue/YEAR/")
        if (seen.has(viewKey)) continue
        seen.add(viewKey)

        const thumb = result.url.replace(/c_limit,w_\d+/, "c_limit,w_640")
        found.push({
          url: result.url,
          thumbnail: thumb,
          source: "rolex.com",
          label: `${result.w}×${result.h}`,
        })
      }

      if (found.length === 0) {
        setRolexError("No images found. Check the reference number (e.g. m279173-0013).")
      } else {
        setRolexResults(found)
      }
    } catch {
      setRolexError("Network error. Please try again.")
    } finally {
      setRolexSearching(false)
    }
  }

  const handleSeed = async () => {
    if (!confirm("Seed database with existing watch data?")) return
    try {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      alert(data.message)
      if (data.seeded) await fetchWatches()
    } catch {
      alert("Seed failed")
    }
  }

  const [migrating, setMigrating] = useState(false)
  const [migrateStatus, setMigrateStatus] = useState("")

  const handleMigrateImages = async () => {
    if (!confirm("Download all external images and host them on Supabase? This may take a while.")) return
    setMigrating(true)
    let totalProcessed = 0
    let totalFailed = 0

    try {
      // Process in batches until done
      // eslint-disable-next-line no-constant-condition
      while (true) {
        setMigrateStatus(`Processing batch... (${totalProcessed} done, ${totalFailed} failed)`)
        const res = await fetch("/api/migrate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchSize: 5 }),
        })

        if (!res.ok) {
          const err = await res.json()
          alert(`Migration error: ${err.error}`)
          break
        }

        const data = await res.json()
        totalProcessed += data.processed
        totalFailed += data.failed

        if (data.remaining === 0) {
          setMigrateStatus(`Done! ${totalProcessed} processed, ${totalFailed} failed`)
          break
        }
      }

      await fetchWatches()
    } catch {
      alert("Migration failed")
    } finally {
      setMigrating(false)
      setTimeout(() => setMigrateStatus(""), 5000)
    }
  }

  // ─── ZOOM MODAL ────────────────────────────────────────────
  const ZoomModal = () => {
    if (!zoomImage) return null
    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        onClick={() => setZoomImage(null)}
      >
        <button
          onClick={() => setZoomImage(null)}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <img
          src={zoomImage}
          alt="Zoomed preview"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: "default" }}
        />
      </div>
    )
  }

  // ─── LIST VIEW ─────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans font-bold text-2xl text-foreground">
              Watch Management
            </h1>
            <p className="font-mono text-xs text-foreground/40 mt-1">
              {watches.length} watches in database
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSeed}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium bg-card text-foreground hover:bg-muted transition-colors"
              style={{
                borderRadius: "var(--pill-radius)",
                border: "var(--border-w) solid var(--border)",
              }}
            >
              <Download className="w-4 h-4" />
              Seed Data
            </button>
            <button
              onClick={handleMigrateImages}
              disabled={migrating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              style={{
                borderRadius: "var(--pill-radius)",
                border: "var(--border-w) solid var(--border)",
              }}
            >
              {migrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {migrating ? migrateStatus : "Migrate Images"}
            </button>
            <button
              onClick={() => {
                listScrollRef.current = window.scrollY
                resetForm()
                setView("add")
                window.scrollTo({ top: 0 })
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--pill-radius)" }}
            >
              <Plus className="w-4 h-4" />
              Add Watch
            </button>
          </div>
        </div>

        {/* Filter bar */}
        {watches.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  value={listFilter}
                  onChange={(e) => setListFilter(e.target.value)}
                  placeholder="Filter by brand, model, reference, size..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card text-foreground text-sm font-sans placeholder:text-foreground/30 outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "var(--pill-radius)",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
                {listFilter && (
                  <button
                    onClick={() => setListFilter("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
                  >
                    <X className="w-3.5 h-3.5 text-foreground/40" />
                  </button>
                )}
              </div>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
                className="px-3 py-2.5 bg-card text-foreground text-sm font-sans outline-none focus:ring-2 ring-primary/30"
                style={{
                  borderRadius: "var(--pill-radius)",
                  border: "var(--border-w) solid var(--border)",
                }}
              >
                <option value="">All</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : watches.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/40 text-lg mb-4">No watches in database</p>
            <p className="text-foreground/30 text-sm mb-6">
              Click "Seed Data" to import existing watches, or "Add Watch" to
              start fresh.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {(() => {
              const q = listFilter.toLowerCase().trim()
              let filtered = genderFilter
                ? watches.filter((w) => w.gender === genderFilter)
                : watches
              filtered = q
                ? filtered.filter((w) =>
                    [w.brand, w.model, w.reference, w.specs?.caseSize, w.specs?.caseMaterial, w.category, w.condition, w.gender]
                      .filter(Boolean)
                      .some((f) => f!.toLowerCase().includes(q))
                  )
                : filtered
              if (filtered.length === 0 && q) {
                return (
                  <div className="text-center py-12">
                    <p className="text-foreground/40 text-sm">No watches match &ldquo;{listFilter}&rdquo;</p>
                    <button onClick={() => setListFilter("")} className="text-primary text-xs mt-2 hover:underline">
                      Clear filter
                    </button>
                  </div>
                )
              }
              return filtered.map((watch, index) => (
              <div
                key={watch.id}
                className="flex items-center gap-4 p-4 bg-card transition-colors hover:bg-muted/50"
                style={{
                  borderRadius: "var(--card-radius)",
                  border: "var(--border-w) solid var(--border)",
                }}
              >
                {/* Number */}
                <span className="font-mono text-xs text-foreground/30 w-6 text-center shrink-0">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <div
                  className="w-16 h-16 shrink-0 bg-background overflow-hidden"
                  style={{ borderRadius: "var(--card-radius)" }}
                >
                  {watch.images[0] ? (
                    <img
                      src={watch.imageVariants?.[0]?.url_thumb || watch.images[0]}
                      alt={watch.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px] text-primary tracking-widest uppercase">
                      {watch.brand}
                    </p>
                    {watch.featured && (
                      <Star className="w-3 h-3 text-primary fill-primary" />
                    )}
                  </div>
                  <p className="font-sans font-semibold text-sm text-foreground truncate">
                    {watch.model}
                  </p>
                  <p className="font-mono text-[10px] text-foreground/40">
                    Ref. {watch.reference} | {watch.specs?.caseSize || "—"} | {watch.images.length} images
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-serif italic text-lg text-foreground">
                    <span className="font-mono text-xs text-muted-foreground not-italic">
                      AED{" "}
                    </span>
                    {watch.price.toLocaleString()}
                  </p>
                  <span
                    className="inline-block text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 text-foreground/50"
                    style={{
                      borderRadius: "var(--pill-radius)",
                      border: "var(--border-w) solid var(--border)",
                    }}
                  >
                    {watch.condition}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(watch)}
                    className="p-2 hover:bg-background transition-colors rounded-lg"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-foreground/50" />
                  </button>
                  <button
                    onClick={() => handleDelete(watch.id)}
                    disabled={deleting === watch.id}
                    className="p-2 hover:bg-destructive/10 transition-colors rounded-lg"
                    title="Delete"
                  >
                    {deleting === watch.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-destructive/60" />
                    )}
                  </button>
                </div>
              </div>
              ))
            })()}
          </div>
        )}
      </div>
    )
  }

  // ─── ADD / EDIT VIEW ───────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ZoomModal />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setView("list")
            resetForm()
            setRolexResults([])
            setRolexQuery("")
            setRolexError("")
            requestAnimationFrame(() => {
              window.scrollTo({ top: listScrollRef.current })
            })
          }}
          className="p-2 hover:bg-card transition-colors rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-sans font-bold text-2xl text-foreground">
          {view === "edit" ? "Edit Watch" : "Add New Watch"}
        </h1>
      </div>

      {/* Import Search Bar */}
      {view === "add" && (
        <div
          className="p-6 mb-8 bg-card"
          style={{
            borderRadius: "var(--card-radius)",
            border: "var(--border-w) solid var(--border)",
          }}
        >
          <h3 className="font-sans font-semibold text-sm text-foreground mb-1">
            Import Watch Details
          </h3>
          <p className="font-mono text-xs text-foreground/40 mb-4">
            Search by brand, model, or reference number to auto-fill details
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='e.g., "Rolex Submariner 126610LN"'
              className="flex-1 px-4 py-2.5 bg-background text-foreground text-sm font-sans placeholder:text-foreground/30 outline-none focus:ring-2 ring-primary/30"
              style={{
                borderRadius: "var(--pill-radius)",
                border: "var(--border-w) solid var(--border)",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-sans font-semibold bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ borderRadius: "var(--pill-radius)" }}
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
          {searchError && (
            <p className="text-destructive text-xs mt-2 font-mono">{searchError}</p>
          )}

          {/* Multiple Results Picker */}
          {showResultPicker && searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-mono text-foreground/50 uppercase tracking-wider">
                {searchResults.length} results found — select one:
              </p>
              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary transition-colors flex items-start justify-between gap-3"
                    style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
                  >
                    {r.thumbnail && (
                      <img
                        src={r.thumbnail}
                        alt={r.reference}
                        className="w-12 h-12 object-contain shrink-0 rounded bg-white"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-sans font-semibold text-sm text-foreground truncate">
                        {r.brand} {r.model}
                      </p>
                      <p className="font-mono text-xs text-foreground/50 mt-0.5">
                        Ref: {r.reference}
                      </p>
                      {r.specs?.caseSize && (
                        <p className="font-mono text-[10px] text-foreground/40 mt-0.5">
                          {[r.specs.caseSize, r.specs.caseMaterial, r.specs.dialColor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <ChevronLeft className="w-4 h-4 text-foreground/30 rotate-180 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Details */}
        <div className="space-y-6">
          <div
            className="p-6 bg-card space-y-4"
            style={{
              borderRadius: "var(--card-radius)",
              border: "var(--border-w) solid var(--border)",
            }}
          >
            <h3 className="font-sans font-semibold text-sm text-foreground">
              Basic Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, brand: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, model: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, reference: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Price (AED)
                </label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      price: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30 resize-none"
                style={{
                  borderRadius: "0.5rem",
                  border: "var(--border-w) solid var(--border)",
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      category: e.target.value as Watch["category"],
                    }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                >
                  <option value="dress">Dress</option>
                  <option value="sport">Sport</option>
                  <option value="dive">Dive</option>
                  <option value="chronograph">Chronograph</option>
                  <option value="pilot">Pilot</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      condition: e.target.value as Watch["condition"],
                    }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                >
                  <option value="unworn">Unworn</option>
                  <option value="preowned">Pre-Owned</option>
                  <option value="unwanted-gift">Unwanted Gift</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      gender: e.target.value as Watch["gender"],
                    }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-mono text-xs text-foreground/60">
                    Featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div
            className="p-6 bg-card space-y-4"
            style={{
              borderRadius: "var(--card-radius)",
              border: "var(--border-w) solid var(--border)",
            }}
          >
            <h3 className="font-sans font-semibold text-sm text-foreground">
              Specifications
            </h3>

            {(
              [
                ["movement", "Movement"],
                ["caseMaterial", "Case Material"],
                ["caseSize", "Case Size"],
                ["dialColor", "Dial"],
                ["bracelet", "Bracelet / Strap"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={(formData.specs as any)[key] || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      specs: { ...p.specs, [key]: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                  style={{
                    borderRadius: "0.5rem",
                    border: "var(--border-w) solid var(--border)",
                  }}
                />
              </div>
            ))}

            <div>
              <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.specs.year || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    specs: { ...p.specs, year: Number(e.target.value) },
                  }))
                }
                className="w-full px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                style={{
                  borderRadius: "0.5rem",
                  border: "var(--border-w) solid var(--border)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Images */}
        <div className="space-y-6">
          {/* Selected Images */}
          <div
            className="p-6 bg-card"
            style={{
              borderRadius: "var(--card-radius)",
              border: "var(--border-w) solid var(--border)",
            }}
          >
            <h3 className="font-sans font-semibold text-sm text-foreground mb-1">
              Selected Images ({selectedImages.length})
            </h3>
            <p className="font-mono text-xs text-foreground/40 mb-4">
              Click to remove. Click zoom icon to preview.
            </p>

            {selectedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {selectedImages.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="relative group aspect-square bg-background overflow-hidden"
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <img
                      src={url}
                      alt={`Selected ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setZoomImage(url)}
                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                        title="Zoom"
                      >
                        <ZoomIn className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => toggleImage(url)}
                        className="p-1.5 bg-destructive/60 hover:bg-destructive rounded-full transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-mono px-1.5 py-0.5 rounded">
                        MAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-foreground/20">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-mono">No images selected</p>
              </div>
            )}

            {/* Upload & Manual URL */}
            <div className="mt-4 space-y-3">
              {/* File Upload */}
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Upload Images
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-sans font-medium bg-background text-foreground hover:bg-muted transition-colors border-2 border-dashed border-foreground/20 hover:border-foreground/40"
                  style={{ borderRadius: "0.5rem" }}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Click to upload images"}
                </button>
              </div>

              {/* Manual URL input */}
              <div>
                <label className="block font-mono text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                  Add Image URL Manually
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    id="manual-image-url"
                    className="flex-1 px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                    style={{
                      borderRadius: "0.5rem",
                      border: "var(--border-w) solid var(--border)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget
                        if (input.value.trim()) {
                          setSelectedImages((prev) => [...prev, input.value.trim()])
                          input.value = ""
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "manual-image-url"
                      ) as HTMLInputElement
                      if (input?.value.trim()) {
                        setSelectedImages((prev) => [...prev, input.value.trim()])
                        input.value = ""
                      }
                    }}
                    className="px-3 py-2 bg-foreground text-background text-sm font-semibold hover:opacity-90"
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Search */}
          <div
            className="p-6 bg-card"
            style={{
              borderRadius: "var(--card-radius)",
              border: "var(--border-w) solid var(--border)",
            }}
          >
            <h3 className="font-sans font-semibold text-sm text-foreground mb-1">
              Search Images
            </h3>
            <p className="font-mono text-xs text-foreground/40 mb-4">
              Searches Watchbase, Bing &amp; Google for product images
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={imageSearchQuery}
                onChange={(e) => setImageSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleImageSearch(1)}
                placeholder="Search for images..."
                className="flex-1 px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                style={{
                  borderRadius: "0.5rem",
                  border: "var(--border-w) solid var(--border)",
                }}
              />
              <button
                onClick={() => handleImageSearch(1)}
                disabled={searchingImages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-foreground text-background hover:opacity-90 disabled:opacity-50"
                style={{ borderRadius: "0.5rem" }}
              >
                {searchingImages ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>

            {imageResults.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
                  {imageResults.map((img) => {
                    const isSelected = selectedImages.includes(img.url)
                    return (
                      <div
                        key={img.url}
                        className={`relative group aspect-square bg-background overflow-hidden transition-all ${
                          isSelected
                            ? "ring-2 ring-primary"
                            : "hover:ring-2 ring-foreground/20"
                        }`}
                        style={{ borderRadius: "0.5rem" }}
                      >
                        <img
                          src={img.thumbnail || img.url}
                          alt="Search result"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (target.src !== img.url) {
                              target.src = img.url
                            }
                          }}
                        />
                        {/* Hover overlay with zoom + select buttons */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setZoomImage(img.url)
                            }}
                            className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                            title="Zoom to inspect quality"
                          >
                            <ZoomIn className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleImage(img.url)
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isSelected
                                ? "bg-primary hover:bg-primary/80"
                                : "bg-white/20 hover:bg-white/40"
                            }`}
                            title={isSelected ? "Deselect" : "Select"}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 text-primary-foreground" />
                            ) : (
                              <Plus className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 py-0.5 rounded">
                          {img.source}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/10">
                  <p className="font-mono text-xs text-foreground/40">
                    {imageResults.length} images · Page {imagePage}
                  </p>
                  <div className="flex items-center gap-2">
                    {imagePage > 1 && (
                      <button
                        onClick={() => handleImageSearch(imagePage - 1)}
                        disabled={loadingMoreImages}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-background text-foreground hover:bg-muted transition-colors"
                        style={{
                          borderRadius: "0.5rem",
                          border: "var(--border-w) solid var(--border)",
                        }}
                      >
                        <ChevronLeft className="w-3 h-3" />
                        Prev
                      </button>
                    )}
                    <button
                      onClick={() => handleImageSearch(imagePage + 1)}
                      disabled={loadingMoreImages}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ borderRadius: "0.5rem" }}
                    >
                      {loadingMoreImages ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          Load More
                          <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-foreground/20">
                <Search className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-mono">
                  Search for watch images above
                </p>
              </div>
            )}
          </div>

          {/* Rolex Database Search */}
          <div
            className="p-6 bg-card"
            style={{
              borderRadius: "var(--card-radius)",
              border: "var(--border-w) solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-sans font-semibold text-sm text-foreground">
                Rolex Database
              </h3>
              <span className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider px-2 py-0.5 bg-foreground/5 rounded">rolex.com</span>
            </div>
            <p className="font-mono text-xs text-foreground/40 mb-4">
              Scrape official images from rolex.com — paste a reference or full URL
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={rolexQuery}
                onChange={(e) => setRolexQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRolexSearch() }}
                placeholder="Reference or full rolex.com URL"
                className="flex-1 px-3 py-2 bg-background text-foreground text-sm outline-none focus:ring-2 ring-primary/30"
                style={{
                  borderRadius: "0.5rem",
                  border: "var(--border-w) solid var(--border)",
                }}
              />
              <button
                onClick={() => handleRolexSearch()}
                disabled={rolexSearching}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-foreground text-background hover:opacity-90 disabled:opacity-50"
                style={{ borderRadius: "0.5rem" }}
              >
                {rolexSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Auto-fill from current watch reference */}
            {formData.reference && (
              <button
                onClick={() => {
                  setRolexQuery(formData.reference)
                  handleRolexSearch(formData.reference)
                }}
                disabled={rolexSearching}
                className="flex items-center gap-2 text-xs font-mono text-primary hover:text-foreground transition-colors mb-4 disabled:opacity-50"
              >
                <Download className="w-3 h-3" />
                Use current reference: {formData.reference}
              </button>
            )}

            {rolexError && (
              <p className="text-destructive text-xs mt-1 mb-3 font-mono">{rolexError}</p>
            )}

            {rolexResults.length > 0 && (
              <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto">
                {rolexResults.map((img) => {
                  const isSelected = selectedImages.includes(img.url)
                  return (
                    <div
                      key={img.url}
                      className={`relative group aspect-square bg-background overflow-hidden transition-all ${
                        isSelected
                          ? "ring-2 ring-primary"
                          : "hover:ring-2 ring-foreground/20"
                      }`}
                      style={{ borderRadius: "0.5rem" }}
                    >
                      <img
                        src={img.thumbnail || img.url}
                        alt="Rolex product"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget
                          if (img.thumbnail && target.src !== img.url) {
                            target.src = img.url
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setZoomImage(img.url)
                          }}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                          title="Zoom"
                        >
                          <ZoomIn className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImage(img.url)
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            isSelected
                              ? "bg-primary hover:bg-primary/80"
                              : "bg-white/20 hover:bg-white/40"
                          }`}
                          title={isSelected ? "Deselect" : "Select"}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            <Plus className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      {img.label && (
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 py-0.5 rounded truncate max-w-[90%]">
                          {img.label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {!rolexSearching && rolexResults.length === 0 && !rolexError && (
              <div className="py-6 text-center text-foreground/20">
                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-mono">
                  Search Rolex official images by reference
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || processingImages || !formData.brand || !formData.model}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-sans font-semibold transition-all disabled:opacity-50 ${
              saveSuccess
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
            style={{ borderRadius: "var(--pill-radius)" }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {processingImages
              ? processStatus
              : saving
                ? "Saving..."
                : saveSuccess
                  ? "Saved!"
                  : view === "edit"
                    ? "Update Watch"
                    : "Save Watch"}
          </button>
        </div>
      </div>
    </div>
  )
}
