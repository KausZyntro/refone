import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(
      "https://refones.com/blogs/wp-json/wp/v2/posts?_embed&per_page=100",
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch posts");
      return [];
    }

    const posts = await response.json();

    const blogUrls = posts.map((post: any) => ({
      url: `https://refone.co.in/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      {
        url: "https://refone.co.in",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },

      {
        url: "https://refone.co.in/blog",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },

      ...blogUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return [
      {
        url: "https://refone.co.in",
        lastModified: new Date(),
      },
    ];
  }
}