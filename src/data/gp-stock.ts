import type { Watch } from "@/lib/types"

function inferCategory(model: string): Watch["category"] {
  const m = model.toLowerCase()
  if (m.includes("submariner") || m.includes("sea dweller")) return "dive"
  if (m.includes("gmt") || m.includes("explorer") || m.includes("yacht")) return "sport"
  if (m.includes("daytona")) return "chronograph"
  if (m.includes("sky dweller") || m.includes("day date")) return "dress"
  if (m.includes("datejust") || m.includes("lady datejust") || m.includes("op")) return "dress"
  return "sport"
}

function makeId(row: number, brand: string, model: string, reference: string): string {
  return `${row}-${brand}-${model}-${reference}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface StockRow {
  row: number
  brand: string
  model: string
  reference: string
  caseSize: string
  description: string
  material: string
  dialColor: string
  bracelet: string
  year: number
}

const stockRows: StockRow[] = [
  { row: 1, brand: "Rolex", model: "Sea Dweller", reference: "126603-0001", caseSize: "43", description: "Black D S&G", material: "Steel & Gold", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 2, brand: "Rolex", model: "Datejust 2", reference: "126333-0014", caseSize: "41", description: "Black Index", material: "Steel & Gold", dialColor: "Black", bracelet: "Jubilee", year: 2024 },
  { row: 3, brand: "Rolex", model: "Datejust 2", reference: "126333-0013", caseSize: "41", description: "Black Index", material: "Steel & Gold", dialColor: "Black", bracelet: "Oyster", year: 2023 },
  { row: 4, brand: "Rolex", model: "Day Date", reference: "18388", caseSize: "36", description: "Full Gold", material: "Gold", dialColor: "Gold", bracelet: "President", year: 1992 },
  { row: 5, brand: "Rolex", model: "GMT Master 2", reference: "126711CHNR", caseSize: "40", description: "Rootbeer", material: "Steel & Rose Gold", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 6, brand: "Rolex", model: "Datejust 2", reference: "126333", caseSize: "41", description: "GOLD DIA G/S J", material: "Steel & Gold", dialColor: "", bracelet: "Jubilee", year: 2023 },
  { row: 7, brand: "Rolex", model: "Datejust 2", reference: "126231", caseSize: "36", description: "GRY69 R/S OY", material: "Steel & Rose Gold", dialColor: "Gray", bracelet: "Oyster", year: 2023 },
  { row: 8, brand: "Rolex", model: "Sky Dweller", reference: "336933-0003", caseSize: "42", description: "ROLEX SKY BLK G/S", material: "Steel & Gold", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 9, brand: "Rolex", model: "Explorer 2", reference: "226570-0002", caseSize: "42", description: "Explorer II", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 10, brand: "Rolex", model: "Datejust 2", reference: "126300-0008", caseSize: "41", description: "Grey Index", material: "Steel", dialColor: "Gray", bracelet: "Jubilee", year: 2025 },
  { row: 11, brand: "Rolex", model: "Datejust 2", reference: "126333-0006", caseSize: "41", description: "Black Diamond", material: "Steel & Gold", dialColor: "Black", bracelet: "Jubilee", year: 2024 },
  { row: 12, brand: "Rolex", model: "Submariner Date", reference: "116613LB", caseSize: "40", description: "Bluesy", material: "Steel & Gold", dialColor: "Blue", bracelet: "Oyster", year: 2017 },
  { row: 13, brand: "Rolex", model: "Datejust", reference: "126200", caseSize: "36", description: "Datejust 36 Blu Ind", material: "Steel", dialColor: "Blue", bracelet: "Oyster", year: 2025 },
  { row: 14, brand: "Rolex", model: "Datejust", reference: "126200", caseSize: "36", description: "Datejust 36 Blu Ind", material: "Steel", dialColor: "Blue", bracelet: "Oyster", year: 2024 },
  { row: 15, brand: "Rolex", model: "Yacht Master 2", reference: "116680-0002", caseSize: "44", description: "Steel white", material: "Steel", dialColor: "White", bracelet: "Oyster", year: 2023 },
  { row: 16, brand: "Rolex", model: "GMT Master 2", reference: "116710", caseSize: "40", description: "GMT-Master II", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2016 },
  { row: 17, brand: "Rolex", model: "Datejust 2", reference: "126331-0004", caseSize: "41", description: "Brown Diamond", material: "Steel & Rose Gold", dialColor: "Chocolate", bracelet: "Jubilee", year: 2024 },
  { row: 18, brand: "Rolex", model: "Datejust", reference: "126234-0045", caseSize: "36", description: "Wimbledon", material: "Steel", dialColor: "Wimbledon", bracelet: "Jubilee", year: 2024 },
  { row: 19, brand: "Rolex", model: "Datejust", reference: "126234-0015", caseSize: "36", description: "Black Index", material: "Steel", dialColor: "Black", bracelet: "Jubilee", year: 2023 },
  { row: 20, brand: "Rolex", model: "Datejust 2", reference: "126333", caseSize: "41", description: "Mother of Pearl", material: "Steel & Gold", dialColor: "MOP", bracelet: "Jubilee", year: 2024 },
  { row: 21, brand: "Rolex", model: "Datejust", reference: "126234", caseSize: "36", description: "Silver Index", material: "Steel", dialColor: "Silver", bracelet: "Jubilee", year: 2023 },
  { row: 22, brand: "Rolex", model: "Yacht Master 2", reference: "116681-0002", caseSize: "44", description: "Yachtmaster White", material: "Steel & Rose Gold", dialColor: "White", bracelet: "Oyster", year: 2023 },
  { row: 23, brand: "Rolex", model: "Datejust", reference: "116200", caseSize: "36", description: "Silver Index", material: "Steel", dialColor: "Silver", bracelet: "Oyster", year: 2017 },
  { row: 24, brand: "Rolex", model: "Datejust", reference: "126233", caseSize: "36", description: "Mother of Pearl", material: "Steel & Gold", dialColor: "MOP", bracelet: "Jubilee", year: 2024 },
  { row: 25, brand: "Rolex", model: "Submariner Date", reference: "126610LN", caseSize: "41", description: "Sub Date", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 26, brand: "Rolex", model: "Datejust", reference: "116244", caseSize: "36", description: "Flower Dial", material: "Steel", dialColor: "Blue Diamond", bracelet: "Jubilee", year: 2016 },
  { row: 27, brand: "Rolex", model: "Datejust 2", reference: "126333", caseSize: "41", description: "Silver Index", material: "Steel & Gold", dialColor: "Silver", bracelet: "Jubilee", year: 2024 },
  { row: 28, brand: "Rolex", model: "Datejust 2", reference: "126334", caseSize: "41", description: "Blue Roman", material: "Steel", dialColor: "Blue", bracelet: "Jubilee", year: 2025 },
  { row: 29, brand: "Rolex", model: "Submariner Date", reference: "116610LN", caseSize: "41", description: "Sub Date", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2017 },
  { row: 30, brand: "Rolex", model: "Lady Datejust", reference: "69158", caseSize: "26", description: "Full Gold", material: "Gold", dialColor: "Champagne", bracelet: "President", year: 2003 },
  { row: 31, brand: "Rolex", model: "Datejust", reference: "116234", caseSize: "36", description: "Blue Dial", material: "Steel", dialColor: "Flower", bracelet: "Jubilee", year: 2017 },
  { row: 32, brand: "Rolex", model: "Submariner Date", reference: "116610LV", caseSize: "41", description: "Green Hulk", material: "Steel", dialColor: "Green", bracelet: "Oyster", year: 2018 },
  { row: 33, brand: "Rolex", model: "Datejust 2", reference: "126333", caseSize: "41", description: "Wimbledon", material: "Steel & Gold", dialColor: "Wimbledon", bracelet: "Jubilee", year: 2025 },
  { row: 34, brand: "Rolex", model: "Yacht Master", reference: "16623", caseSize: "40", description: "Yachtmaster White", material: "Steel & Gold", dialColor: "White", bracelet: "Oyster", year: 2005 },
  { row: 35, brand: "Rolex", model: "Datejust", reference: "126234", caseSize: "36", description: "Mother of Pearl", material: "Steel", dialColor: "MOP", bracelet: "Jubilee", year: 2024 },
  { row: 36, brand: "Rolex", model: "Datejust 2", reference: "126300", caseSize: "41", description: "Wimbledon", material: "Steel", dialColor: "Wimbledon", bracelet: "Jubilee", year: 2024 },
  { row: 37, brand: "Rolex", model: "Lady Datejust", reference: "279383RBR", caseSize: "28", description: "Green", material: "Steel & Gold", dialColor: "Green", bracelet: "Jubilee", year: 2022 },
  { row: 38, brand: "Rolex", model: "Datejust 2", reference: "126331-0004", caseSize: "41", description: "Choco Diamond", material: "Steel & Rose Gold", dialColor: "Chocolate", bracelet: "Jubilee", year: 2023 },
  { row: 39, brand: "Rolex", model: "Yacht Master", reference: "126622-0001", caseSize: "40", description: "GRAY STEEL", material: "Steel", dialColor: "Gray", bracelet: "Oyster", year: 2022 },
  { row: 40, brand: "Rolex", model: "Yacht Master", reference: "126622-0002", caseSize: "40", description: "BLUE", material: "Steel", dialColor: "Blue", bracelet: "Oyster", year: 2021 },
  { row: 41, brand: "Rolex", model: "Yacht Master", reference: "126621-0001", caseSize: "40", description: "CHOCO", material: "Steel & Rose Gold", dialColor: "Chocolate", bracelet: "Oyster", year: 2022 },
  { row: 42, brand: "Rolex", model: "Yacht Master", reference: "126621-0002", caseSize: "40", description: "BLACK", material: "Steel & Rose Gold", dialColor: "Black", bracelet: "Oyster", year: 2023 },
  { row: 43, brand: "Rolex", model: "Datejust 2", reference: "126331-0004", caseSize: "41", description: "CHOC DIA", material: "Steel & Rose Gold", dialColor: "Chocolate", bracelet: "Jubilee", year: 2024 },
  { row: 44, brand: "Rolex", model: "Datejust 2", reference: "126333-0006", caseSize: "41", description: "BLACK DIA", material: "Steel & Gold", dialColor: "Black", bracelet: "Jubilee", year: 2024 },
  { row: 45, brand: "Rolex", model: "Datejust", reference: "126233-0015", caseSize: "36", description: "Gold Motiff", material: "Steel & Gold", dialColor: "Gold Motiff", bracelet: "Jubilee", year: 2023 },
  { row: 46, brand: "Rolex", model: "Datejust", reference: "126233-0015", caseSize: "36", description: "Gold Motiff", material: "Steel & Gold", dialColor: "Gold Motiff", bracelet: "Jubilee", year: 2023 },
  { row: 47, brand: "Rolex", model: "Lady Datejust", reference: "279173-0005", caseSize: "28", description: "Silver Index", material: "Steel & Gold", dialColor: "Silver", bracelet: "Jubilee", year: 2022 },
  { row: 48, brand: "Rolex", model: "Day Date", reference: "228345RBR", caseSize: "41", description: "Brown Baguette Dial", material: "Rose Gold", dialColor: "Brown Baguette", bracelet: "President", year: 2023 },
  { row: 49, brand: "Rolex", model: "Datejust", reference: "278273-0030", caseSize: "31", description: "Green Diamond", material: "Steel & Gold", dialColor: "Green", bracelet: "Jubilee", year: 2024 },
  { row: 50, brand: "Rolex", model: "Submariner Date", reference: "116610LN", caseSize: "41", description: "Sub Date", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2017 },
  { row: 51, brand: "Rolex", model: "Submariner Date", reference: "116610LN", caseSize: "41", description: "Sub Date", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2017 },
  { row: 52, brand: "Rolex", model: "Datejust", reference: "178271", caseSize: "31", description: "Pink", material: "Steel & Rose Gold", dialColor: "Pink", bracelet: "Jubilee", year: 2016 },
  { row: 53, brand: "Rolex", model: "Datejust", reference: "178271", caseSize: "31", description: "Pink", material: "Steel & Rose Gold", dialColor: "Pink", bracelet: "Jubilee", year: 2015 },
  { row: 54, brand: "Rolex", model: "Datejust", reference: "178271", caseSize: "31", description: "Pink", material: "Steel & Rose Gold", dialColor: "Pink", bracelet: "Jubilee", year: 2017 },
  { row: 55, brand: "Rolex", model: "Datejust", reference: "116233", caseSize: "36", description: "Mother of Pearl", material: "Steel & Gold", dialColor: "MOP", bracelet: "Jubilee", year: 1997 },
  { row: 56, brand: "Rolex", model: "GMT Master 2", reference: "116710LN", caseSize: "40", description: "Full Iced Diamonds", material: "Diamonds", dialColor: "Black with DIA", bracelet: "Oyster", year: 2013 },
  { row: 57, brand: "Rolex", model: "Lady Datejust", reference: "279173-0007", caseSize: "28", description: "Silver Diamond", material: "Steel & Gold", dialColor: "Silver", bracelet: "Jubilee", year: 2023 },
  { row: 58, brand: "Rolex", model: "Datejust", reference: "278273-0018", caseSize: "31", description: "Choco Roman", material: "Steel & Gold", dialColor: "", bracelet: "Jubilee", year: 2023 },
  { row: 59, brand: "Rolex", model: "Datejust", reference: "126281RBR", caseSize: "36", description: "Factory Diamond Bezel", material: "Steel & Gold", dialColor: "Wimbledon", bracelet: "Jubilee", year: 2024 },
  { row: 60, brand: "Rolex", model: "GMT Master 2", reference: "126713GRNR", caseSize: "40", description: "Zombie", material: "Steel & Gold", dialColor: "", bracelet: "Jubilee", year: 2023 },
  { row: 61, brand: "Rolex", model: "OP", reference: "124300-0002", caseSize: "41", description: "OP 41 Black", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2022 },
  { row: 62, brand: "Cartier", model: "Santos", reference: "2656", caseSize: "XL", description: "100 Diamond", material: "Steel", dialColor: "White", bracelet: "Leather", year: 2014 },
  { row: 63, brand: "Rolex", model: "Lady Datejust", reference: "69173", caseSize: "26", description: "Normal Dial", material: "Steel & Gold", dialColor: "", bracelet: "Jubilee", year: 1995 },
  { row: 64, brand: "Rolex", model: "Datejust 2", reference: "126300-0005", caseSize: "41", description: "White Index", material: "Steel", dialColor: "White", bracelet: "Oyster", year: 2025 },
  { row: 65, brand: "Rolex", model: "Lady Datejust", reference: "279173", caseSize: "28", description: "Mother of Pearl", material: "Steel & Gold", dialColor: "MOP", bracelet: "Jubilee", year: 2023 },
  { row: 66, brand: "Rolex", model: "Datejust 2", reference: "126331-0016", caseSize: "41", description: "Wimbledon", material: "Steel & Rose Gold", dialColor: "Wimbledon", bracelet: "Jubilee", year: 2024 },
  { row: 67, brand: "Rolex", model: "Lady Datejust", reference: "279173-0007", caseSize: "28", description: "Silver Diamond", material: "Steel & Gold", dialColor: "Silver", bracelet: "Jubilee", year: 2023 },
  { row: 68, brand: "Rolex", model: "Lady Datejust", reference: "279173-0003", caseSize: "28", description: "Silver Star", material: "Steel & Gold", dialColor: "Silver", bracelet: "Jubilee", year: 2024 },
  { row: 69, brand: "Rolex", model: "Datejust", reference: "126233-0025", caseSize: "36", description: "Green 6&9 Diamond", material: "Steel & Gold", dialColor: "Green", bracelet: "Jubilee", year: 2023 },
  { row: 70, brand: "Rolex", model: "Datejust", reference: "278271-0002", caseSize: "31", description: "White Roman", material: "Steel & Gold", dialColor: "White", bracelet: "Jubilee", year: 2023 },
  { row: 71, brand: "Rolex", model: "Sky Dweller", reference: "336933-0004", caseSize: "42", description: "Black Dial", material: "Steel & Gold", dialColor: "Black", bracelet: "Jubilee", year: 2025 },
  { row: 72, brand: "Rolex", model: "Datejust", reference: "178273", caseSize: "31", description: "Roman", material: "Steel & Gold", dialColor: "", bracelet: "Oyster", year: 2016 },
  { row: 73, brand: "Rolex", model: "Submariner No Date", reference: "124060", caseSize: "41", description: "Black", material: "Steel", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 74, brand: "Rolex", model: "Submariner Date", reference: "126613LN-0002", caseSize: "41", description: "Sub Date Gold", material: "Steel & Gold", dialColor: "Black", bracelet: "Oyster", year: 2024 },
  { row: 75, brand: "Rolex", model: "Yacht Master", reference: "126655-0002", caseSize: "40", description: "Oysterflex", material: "Rose Gold", dialColor: "Black", bracelet: "Oysterflex", year: 2024 },
  { row: 76, brand: "Rolex", model: "Lady Datejust", reference: "279173-0011", caseSize: "28", description: "Gold diamond", material: "Steel & Gold", dialColor: "Champagne", bracelet: "Jubilee", year: 2023 },
  { row: 77, brand: "Rolex", model: "Datejust 2", reference: "126334-0016", caseSize: "41", description: "Blue Diamond", material: "Steel", dialColor: "Blue", bracelet: "Jubilee", year: 2024 },
  { row: 78, brand: "Rolex", model: "Submariner", reference: "126613LB-0002", caseSize: "41", description: "Sub Blue", material: "Steel & Gold", dialColor: "Blue", bracelet: "Oyster", year: 2024 },
  { row: 79, brand: "Rolex", model: "Day Date", reference: "118239", caseSize: "36", description: "Full White Gold", material: "White Gold", dialColor: "", bracelet: "President", year: 0 },
  { row: 80, brand: "Rolex", model: "Submariner", reference: "116613LB", caseSize: "40", description: "Sub Blue", material: "Steel & Gold", dialColor: "Blue", bracelet: "Oyster", year: 2017 },
]

export const gpStock: Watch[] = stockRows.map((r) => ({
  id: makeId(r.row, r.brand, r.model, r.reference),
  brand: r.brand,
  model: r.model,
  reference: r.reference,
  price: 0,
  images: [],
  description: r.description,
  specs: {
    movement: "",
    caseMaterial: r.material,
    caseSize: r.caseSize ? `${r.caseSize}mm` : "",
    waterResistance: "",
    dialColor: r.dialColor,
    bracelet: r.bracelet,
    powerReserve: "",
    year: r.year || 0,
  },
  category: inferCategory(r.model),
  condition: "preowned" as const,
  featured: false,
}))
