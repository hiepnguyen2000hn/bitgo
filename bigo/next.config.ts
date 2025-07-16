import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['bitgo'],
    },

};

export default nextConfig;
