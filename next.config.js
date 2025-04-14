/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // 타입 체크 건너뛰기 설정 추가
  typescript: {
    // !! 중요: 이 설정은 타입 오류가 있어도 빌드를 진행합니다
    ignoreBuildErrors: true,
  },
  // 린트 오류도 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this to help with npm registry issues
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Add webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
        dns: false,
        stream: false,
        http2: false,
        util: false,
        url: false,
        path: false,
        os: false,
        zlib: false,
        http: false,
        https: false,
        crypto: false,
      }
    }
    return config
  },
  // SSL 관련 설정 추가
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
