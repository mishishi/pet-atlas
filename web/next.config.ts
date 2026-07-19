import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // 2026-07-19: 图片走 TCB CDN,不在 Next.js Image Optimization 里处理
  // (unoptimized: true 时 remotePatterns 不强制检查,但保留以防未来开启)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.tcb.qcloud.la",
      },
      {
        protocol: "https",
        hostname: "*.cos.ap-shanghai.myqcloud.com",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
