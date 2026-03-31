"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import type { ImageVariant } from "@/lib/types"

interface ImageGalleryProps {
  images: string[]
  imageVariants?: ImageVariant[]
  modelName: string
}

export function ImageGallery({ images, imageVariants, modelName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadingFullRes, setLoadingFullRes] = useState(false)
  const [fullResLoaded, setFullResLoaded] = useState<Set<number>>(new Set())
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Hover zoom state
  const [hoverZoom, setHoverZoom] = useState(false)
  const mainImgRef = useRef<HTMLImageElement>(null)

  const getThumb = (i: number) => imageVariants?.[i]?.url_thumb || images[i]
  const getOriginal = (i: number) => imageVariants?.[i]?.url || images[i]

  // Preload full-res for current image
  useEffect(() => {
    if (fullResLoaded.has(selectedIndex)) return
    setLoadingFullRes(true)
    const img = new Image()
    img.onload = () => {
      setFullResLoaded(prev => new Set(prev).add(selectedIndex))
      setLoadingFullRes(false)
    }
    img.onerror = () => setLoadingFullRes(false)
    img.src = getOriginal(selectedIndex)
    return () => { img.onload = null; img.onerror = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  const isReady = fullResLoaded.has(selectedIndex)
  const currentSrc = isReady ? getOriginal(selectedIndex) : getThumb(selectedIndex)

  // Hover zoom handlers — only when full-res is loaded
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = mainImgRef.current
    if (!img || !isReady) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    img.style.transformOrigin = `${x}% ${y}%`
  }, [isReady])

  const handleMouseEnter = useCallback(() => {
    if (!isReady) return
    const img = mainImgRef.current
    if (img) {
      img.style.transform = "scale(2.5)"
      setHoverZoom(true)
    }
  }, [isReady])

  const handleMouseLeave = useCallback(() => {
    const img = mainImgRef.current
    if (img) {
      img.style.transform = "scale(1)"
      img.style.transformOrigin = "center center"
      setHoverZoom(false)
    }
  }, [])

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square overflow-hidden bg-background group"
          style={{
            borderRadius: 'var(--card-radius)',
            border: 'var(--border-w) solid var(--border)',
            cursor: isReady ? (hoverZoom ? 'zoom-out' : 'zoom-in') : 'default',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => { handleMouseLeave(); setLightboxOpen(true) }}
        >
          <img
            ref={mainImgRef}
            src={currentSrc}
            alt={modelName}
            className="w-full h-full object-contain transition-transform duration-200 ease-out"
          />

          {/* Click to expand hint — show when not hover-zooming */}
          {!hoverZoom && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ borderRadius: 'var(--pill-radius)' }}>
              <ZoomIn className="w-3 h-3 text-foreground/50" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-foreground/50">
                {isReady ? "Hover to zoom \u00B7 Click to expand" : "Loading..."}
              </span>
            </div>
          )}

          {/* Loading bar */}
          {loadingFullRes && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
              <div className="h-[3px] w-full bg-foreground/5 overflow-hidden">
                <div className="h-full bg-primary" style={{ animation: 'galleryProgress 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
              </div>
            </div>
          )}

          {/* Status pill */}
          {loadingFullRes && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 shadow-sm" style={{ borderRadius: 'var(--pill-radius)', animation: 'galleryFadeIn 0.2s ease-out' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-foreground/60">Loading full resolution</span>
            </div>
          )}
          {!loadingFullRes && isReady && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 shadow-sm pointer-events-none" style={{ borderRadius: 'var(--pill-radius)', animation: 'galleryFadeOut 2s ease-out forwards' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-foreground/60">Full resolution</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="aspect-square overflow-hidden bg-background transition-colors"
              style={{
                borderRadius: 'calc(var(--card-radius) * 0.5)',
                border: `2px solid ${i === selectedIndex ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              <img
                src={getThumb(i)}
                alt={`${modelName} view ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          imageVariants={imageVariants}
          modelName={modelName}
          initialIndex={selectedIndex}
          fullResLoaded={fullResLoaded}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setSelectedIndex}
        />
      )}
    </>
  )
}

/* ═══════════════════ LIGHTBOX ═══════════════════ */

interface LightboxProps {
  images: string[]
  imageVariants?: ImageVariant[]
  modelName: string
  initialIndex: number
  fullResLoaded: Set<number>
  onClose: () => void
  onIndexChange: (i: number) => void
}

function Lightbox({ images, imageVariants, modelName, initialIndex, fullResLoaded, onClose, onIndexChange }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [didDrag, setDidDrag] = useState(false)
  const [loadingLB, setLoadingLB] = useState(false)
  const [loadedLB, setLoadedLB] = useState<Set<number>>(new Set(fullResLoaded))
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const getOriginal = (i: number) => imageVariants?.[i]?.url || images[i]
  const getThumb = (i: number) => imageVariants?.[i]?.url_thumb || images[i]

  // Load full-res for current lightbox image
  useEffect(() => {
    if (loadedLB.has(index)) return
    setLoadingLB(true)
    const img = new Image()
    img.onload = () => {
      setLoadedLB(prev => new Set(prev).add(index))
      setLoadingLB(false)
    }
    img.onerror = () => setLoadingLB(false)
    img.src = getOriginal(index)
    return () => { img.onload = null; img.onerror = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Reset zoom on image switch
  useEffect(() => {
    setScale(1)
    setPos({ x: 0, y: 0 })
  }, [index])

  // Keyboard: Escape, arrows
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goTo(index - 1)
      if (e.key === "ArrowRight") goTo(index + 1)
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Scroll to zoom — native listener for passive: false
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      setScale(prev => {
        const delta = e.deltaY > 0 ? -0.4 : 0.4
        const next = Math.max(0.5, Math.min(15, prev + delta))
        if (next <= 1) setPos({ x: 0, y: 0 })
        return next
      })
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [])

  const goTo = (i: number) => {
    const next = (i + images.length) % images.length
    setIndex(next)
    onIndexChange(next)
  }

  // Drag to pan — pointer capture on the container
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDidDrag(false)
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
    if (scale > 1) {
      setDragging(true)
      containerRef.current?.setPointerCapture(e.pointerId)
    }
  }, [scale, pos])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDidDrag(true)
    setPos({
      x: dragStart.current.px + dx,
      y: dragStart.current.py + dy,
    })
  }, [dragging])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setDragging(false)
    // Single click (no drag) — toggle zoom
    if (!didDrag) {
      if (scale > 1) {
        setScale(1)
        setPos({ x: 0, y: 0 })
      } else {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.width / 2 - e.clientX + rect.left
        const cy = rect.height / 2 - e.clientY + rect.top
        setScale(4)
        setPos({ x: cx * 3, y: cy * 3 })
      }
    }
  }, [didDrag, scale])

  const currentSrc = loadedLB.has(index) ? getOriginal(index) : getThumb(index)

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm" style={{ animation: 'galleryFadeIn 0.15s ease-out' }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/40 tracking-wider">
            {index + 1} / {images.length}
          </span>
          {loadingLB && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-white/40">Loading HD</span>
            </div>
          )}
          {!loadingLB && loadedLB.has(index) && (
            <div className="flex items-center gap-2" style={{ animation: 'galleryFadeOut 2.5s ease-out forwards' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-white/40">Full resolution</span>
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Loading bar */}
      {loadingLB && (
        <div className="absolute top-0 left-0 right-0 z-50 h-[2px] bg-white/5 overflow-hidden">
          <div className="h-full bg-primary" style={{ animation: 'galleryProgress 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
        </div>
      )}

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button onClick={() => goTo(index - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => goTo(index + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Image canvas — drag + scroll zoom */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden select-none touch-none"
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          src={currentSrc}
          alt={modelName}
          draggable={false}
          className="max-w-[90vw] max-h-[85vh] object-contain pointer-events-none"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 200ms ease-out',
          }}
        />
      </div>

      {/* Bottom thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-14 h-14 overflow-hidden transition-all"
              style={{
                borderRadius: '6px',
                border: `2px solid ${i === index ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}`,
                opacity: i === index ? 1 : 0.5,
              }}
            >
              <img
                src={imageVariants?.[i]?.url_thumb || images[i]}
                alt={`${modelName} ${i + 1}`}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom % */}
      {scale !== 1 && (
        <div className="absolute bottom-4 right-4 z-50 font-mono text-[11px] text-white/30 tracking-wider">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  )
}
