"use client"

import { useState, useCallback, useRef } from "react"
import type { ImageVariant } from "@/lib/types"

interface ImageGalleryProps {
  images: string[]
  imageVariants?: ImageVariant[]
  modelName: string
}

export function ImageGallery({ images, imageVariants, modelName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const [zoomed, setZoomed] = useState(false)

  // Pick the right variant with fallback to the plain URL
  const getThumb = (i: number) => imageVariants?.[i]?.url_thumb || images[i]
  const getOptimized = (i: number) => imageVariants?.[i]?.url_optimized || images[i]
  const getOriginal = (i: number) => imageVariants?.[i]?.url || images[i]

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current
    if (!img) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    img.style.transformOrigin = `${x}% ${y}%`
  }, [])

  const handleMouseEnter = useCallback(() => {
    const img = imgRef.current
    if (img) {
      // Switch to full-res original on zoom
      const originalSrc = getOriginal(selectedIndex)
      if (img.src !== originalSrc) img.src = originalSrc
      img.style.transform = "scale(2.2)"
      setZoomed(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, imageVariants, images])

  const handleMouseLeave = useCallback(() => {
    const img = imgRef.current
    if (img) {
      img.style.transform = "scale(1)"
      img.style.transformOrigin = "center center"
      // Switch back to optimized
      const optimizedSrc = getOptimized(selectedIndex)
      if (img.src !== optimizedSrc) img.src = optimizedSrc
      setZoomed(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, imageVariants, images])

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden bg-background cursor-zoom-in"
        style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imgRef}
          src={getOptimized(selectedIndex)}
          alt={modelName}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
        />
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
  )
}
