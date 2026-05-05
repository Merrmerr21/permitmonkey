import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Bundle the server/skills/**/*.md tree into the deployed serverless
  // function so the verify-citations server action can run Method 1 (skill
  // reference lookup) in production. Without this, fs.readdir against
  // ../server/skills resolves to nothing on Vercel — Method 1 silently
  // fails and every verified citation falls through to Method 2 only.
  //
  // The path is relative to the next.config.ts location (frontend/), so
  // ../server/skills walks up to repo root and into server/.
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  outputFileTracingIncludes: {
    "/**": ["../server/skills/**/*.md"],
  },
  // Several <Image quality="85"> usages exist in landing-page hero artwork.
  // Next.js 16 requires every quality value to be declared up-front.
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;
