import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Pull in only the icons that are actually used from the large
    // react-icons entry points (helps dev compile time and bundle graph).
    optimizePackageImports: [
      "react-icons/fa",
      "react-icons/fa6",
      "react-icons/fi",
      "react-icons/lia",
      "react-icons/hi",
      "react-icons/hi2",
      "react-icons/lu",
      "react-icons/md",
      "react-icons/tb",
      "react-icons/ai",
      "react-icons/io5",
      "react-icons/sl",
      "react-icons/pi",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5e96f9530a7c4c18bb5736a581da8ede.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fdn2.gsmarena.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "refones.com",
        port: "",
        pathname: "/blogs/wp-content/uploads/**",
      },
      ...[
        "www.apple.com", "images.samsung.com", "image01.oneplus.net", "lh3.googleusercontent.com",
        "in.nothing.tech", "image01.realme.net", "in-exstatic-vivofs.vivo.com", "image.oppo.com",
        "i.pinimg.com", "m.media-amazon.com", "via.placeholder.com", "i.pravatar.cc",
        "picsum.photos", "s3ng.cashify.in", "img.icons8.com", "www.gstatic.com",
      ].map((hostname) => ({ protocol: "https" as const, hostname, port: "", pathname: "/**" })),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
   async rewrites() {
    return [
      {
        source: "/test-image",
        destination:
          "https://refones.com/blogs/wp-content/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
