"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  modelName: string
}

export function ImageGallery({ images, modelName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-background" style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}>
        <img
          src={images[selectedIndex]}
          alt={modelName}
          className="w-full h-full object-cover"
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
