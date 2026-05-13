export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: [
      "https://refone.co.in/sitemap.xml",
      "https://refone.co.in/blog-sitemap.xml"
    ],
  };
}