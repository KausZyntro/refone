module.exports = {
  siteUrl: "https://refone.co.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/blog-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://refone.co.in/blog-sitemap.xml',
    ],
  },
};