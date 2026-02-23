"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  modelName: string
}

export function ImageGallery({ images, modelName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main image - clickable to open dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square overflow-hidden bg-muted cursor-zoom-in">
            <img
              src={images[selectedIndex]}
              alt={modelName}
              className="w-full h-full object-cover"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">{modelName}</DialogTitle>
          <img
            src={images[selectedIndex]}
            alt={modelName}
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "aspect-square overflow-hidden border-2 transition-colors",
              i === selectedIndex
                ? "border-gold"
                : "border-transparent hover:border-border"
            )}
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
