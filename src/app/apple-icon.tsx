import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0D0D12",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "6px solid #C9A84C",
        }}
      >
        <span
          style={{
            color: "#C9A84C",
            fontSize: 110,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size }
  )
}
