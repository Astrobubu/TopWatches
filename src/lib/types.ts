export interface ImageVariant {
  url: string
  url_thumb?: string
  url_optimized?: string
}

export interface Watch {
  id: string
  brand: string
  model: string
  reference: string
  price: number
  images: string[]
  imageVariants?: ImageVariant[]
  description: string
  specs: {
    movement: string
    caseMaterial: string
    caseSize: string
    dialColor: string
    bracelet: string
    year: number
  }
  category: "dress" | "sport" | "dive" | "chronograph" | "pilot"
  condition: "unworn" | "preowned" | "unwanted-gift"
  gender?: "men" | "women" | "unisex"
  scope?: string
  featured: boolean
}

export interface Brand {
  id: string
  name: string
  logo: string
  country: string
  founded: number
  description: string
}
