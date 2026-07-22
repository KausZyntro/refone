import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let allPosts: any[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(
        `https://refones.com/blogs/wp-json/wp/v2/posts?status=publish&_fields=slug,modified&per_page=100&page=${page}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`WP API Error: ${response.status}`);
      }

      totalPages = Number(
        response.headers.get("X-WP-TotalPages") || 1
      );

      const posts = await response.json();

      allPosts.push(...posts);

      page++;
    } while (page <= totalPages);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${allPosts
  .map(
    (post) => `
<url>
<loc>https://refone.co.in/blog/${post.slug}</loc>
<lastmod>${new Date(post.modified).toISOString()}</lastmod>
<changefreq>daily</changefreq>
<priority>0.8</priority>
</url>`
  )
  .join("")}

</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);

    return new NextResponse("Error generating sitemap", {
      status: 500,
    });
  }
}