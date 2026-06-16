import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出模式 - 用于 Cloudflare Pages 部署
  output: "export",

  // 允许使用 <img> 标签（收款码、logo 图片用）
  images: {
    unoptimized: true,
  },

  // 自动添加尾斜杠，确保 Cloudflare 路由正确
  trailingSlash: true,
};

export default nextConfig;
