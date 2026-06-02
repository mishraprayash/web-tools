import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['curlconverter', 'tree-sitter-bash', 'web-tree-sitter'],
};

export default nextConfig;