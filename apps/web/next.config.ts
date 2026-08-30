import "@recall-ai/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  logging: {
    browserToTerminal: false,
  },
};

export default nextConfig;
