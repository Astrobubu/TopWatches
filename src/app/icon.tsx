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
          background: "#0D0D12",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #C9A84C",
        }}
      >
        <span
          style={{
            color: "#C9A84C",
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            marginTop: -2,
            marginLeft: -2,
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size }
  )
}
