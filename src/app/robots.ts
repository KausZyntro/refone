export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        '/profile',
        '/my-orders',
        '/server-busy',
        '/animate',
      ],
    },

    sitemap: [
      "https://refone.co.in/sitemap.xml",
      "https://refone.co.in/blog-sitemap.xml"
    ],
  };
}