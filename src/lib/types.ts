export interface Watch {
  id: string
  brand: string
  model: string
  reference: string
  price: number
  images: string[]
  description: string
  specs: {
    movement: string
    caseMaterial: string
    caseSize: string
    waterResistance: string
    dialColor: string
    bracelet: string
    powerReserve: string
    year: number
  }
  category: "dress" | "sport" | "dive" | "chronograph" | "pilot"
  condition: "unworn" | "preowned" | "unwanted-gift"
  gender: "men" | "women" | "unisex"
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
