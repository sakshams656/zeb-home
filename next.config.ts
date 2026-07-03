import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack root to this app (avoids picking up ~/package-lock.json)
  turbopack: {
    root: projectRoot
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.zebpay.com",
        pathname: "/multicoins/**"
      },
      {
        protocol: "https",
        hostname: "zebpaylogstest.blob.core.windows.net",
        pathname: "/multicoins/**"
      }
    ]
  }
};

export default nextConfig;
