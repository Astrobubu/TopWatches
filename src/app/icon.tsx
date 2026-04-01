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
          background: "#16a34a",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #fff",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            marginTop: -1,
          }}
        >
          GP
        </span>
      </div>
    ),
    { ...size }
  )
}
