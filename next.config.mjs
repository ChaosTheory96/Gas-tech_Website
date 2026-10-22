/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Deploy-ready on any Node host (next start) or a static target if desired.
  // External product imagery is served hotlinked via plain <img>, so the image
  // optimizer is left disabled to keep the build host-agnostic and dependency-free.
  images: { unoptimized: true },
};

export default nextConfig;
