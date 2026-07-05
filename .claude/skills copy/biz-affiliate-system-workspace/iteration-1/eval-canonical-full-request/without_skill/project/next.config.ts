import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // `beforeFiles` is checked before filesystem routes, so this overrides
      // the existing src/app/page.tsx and serves the AI AGENT SUMMIT page at "/".
      // The Summit's own routes (/ai-agent-summit/thanh-toan, checkout, mailer
      // links) keep working unchanged because /ai-agent-summit still exists.
      beforeFiles: [{ source: "/", destination: "/ai-agent-summit" }],
    };
  },
};

export default nextConfig;
