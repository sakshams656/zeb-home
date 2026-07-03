import { ImageResponse } from "next/og";

export const alt = "ZebPay — Trade Crypto in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #0c1d52 0%, #040812 100%)",
          color: "#f0f4ff",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-0.02em" }}>ZebPay</div>
        <div style={{ marginTop: 16, fontSize: 32, opacity: 0.85 }}>
          India&apos;s Pro-Grade Crypto Exchange
        </div>
      </div>
    ),
    { ...size }
  );
}
