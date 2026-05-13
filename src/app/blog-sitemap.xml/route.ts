import { NextResponse } from 'next/server';

export async function GET() {
  let allPosts: any[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(
        `https://refones.com/blogs/wp-json/wp/v2/posts?_embed&per_page=100&page=${page}`,
        {
          next: { revalidate: 300 },
        }
      );

      if (!response.ok) {
        break;
      }

      totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1', 10);
      const posts = await response.json();
      allPosts = [...allPosts, ...posts];
      page++;
    } while (page <= totalPages);
  } catch (e) {
    console.error("Error fetching paginated posts for sitemap", e);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPosts.map((post: any) => `
      <url>
        <loc>https://refone.co.in/blog/${post.slug}</loc>
        <lastmod>${new Date(post.modified).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('')}
  </urlset>`;

  return new NextResponse(sitemap.trim(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
