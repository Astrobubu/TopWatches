"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  modelName: string
}

export function ImageGallery({ images, modelName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const [zoomed, setZoomed] = useState(false)

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
      img.style.transform = "scale(2.2)"
      setZoomed(true)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const img = imgRef.current
    if (img) {
      img.style.transform = "scale(1)"
      img.style.transformOrigin = "center center"
      setZoomed(false)
    }
  }, [])

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
          src={images[selectedIndex]}
          alt={modelName}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
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
              src={img}
              alt={`${modelName} view ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
