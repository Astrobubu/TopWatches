import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#16a34a",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "Times New Roman, Times, serif",
          }}
        >
          GP
        </span>
      </div>
    ),
    { ...size }
  )
}
