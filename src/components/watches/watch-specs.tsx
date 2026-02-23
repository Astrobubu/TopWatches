import type { Watch } from "@/lib/types"

interface WatchSpecsProps {
  specs: Watch["specs"]
}

export function WatchSpecs({ specs }: WatchSpecsProps) {
  const specRows = [
    { label: "Movement", value: specs.movement },
    { label: "Case Material", value: specs.caseMaterial },
    { label: "Case Size", value: specs.caseSize },
    { label: "Water Resistance", value: specs.waterResistance },
    { label: "Dial Color", value: specs.dialColor },
    { label: "Bracelet", value: specs.bracelet },
    { label: "Power Reserve", value: specs.powerReserve },
    { label: "Year", value: specs.year.toString() },
  ]

  return (
    <div className="space-y-0">
      {specRows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between py-3 border-b border-border"
        >
          <span className="text-muted-foreground">{row.label}</span>
          <span className="font-medium text-right">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
