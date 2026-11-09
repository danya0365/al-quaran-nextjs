import { execSync } from 'child_process';
import type { NextConfig } from "next";

const getCommitSha = () => {
  try {
    return (
      process.env.WORKERS_CI_COMMIT_SHA ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      execSync('git rev-parse HEAD').toString().trim()
    );
  } catch (e) {
    return 'local-dev';
  }
};

const nextConfig: NextConfig = {
  // รูปเสิร์ฟตรงจาก static assets ไม่ผ่าน Cloudflare Images (จำเป็นบน Workers)
  images: {
    unoptimized: true,
  },
  // ตั้ง NEXT_PUBLIC_APP_URL (optional) เพื่อ override absolute URL ตอน deploy บน Workers
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_COMMIT_SHA: getCommitSha(),
  },
};

export default nextConfig;
