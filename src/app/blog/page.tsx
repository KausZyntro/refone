import React from 'react';
import styles from './page.module.css';
import BlogCard from '@/components/blog/BlogCard';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Refone',
  description: 'Read the latest updates, tips, and news about refurbished iPhones from Refone.',
};

// Fetch function integrated directly into the page
// async function getBlogs(): Promise<BlogPost[]> {
//   const baseUrl = process.env.NEXT_BLOG_BASE_URL || 'https://refones.com';
//   try {
//     // Note: Adjust the '/api/blogs' path below if your backend uses a different endpoint (e.g., '/wp-json/wp/v2/posts' or '/api/posts')
//     const response = await fetch(`${baseUrl}/blogs`, {
//       next: { revalidate: 60 },
//     });
//     if (!response.ok) return [];
//     const data = await response.json();
//     return Array.isArray(data) ? data : (data.data || []);
//   } catch (error) {
//     console.error('Error fetching blogs:', error);
//     return [];
//   }
// }
// async function getBlogs(): Promise<BlogPost[]> {
//   const baseUrl = process.env.NEXT_BLOG_BASE_URL || 'https://refones.com/blogs/wp-json/wp/v2/posts';

//   try {
//     // Append _embed to get featured images and authors from WP
//     const url = baseUrl.includes('?') ? `${baseUrl}&_embed` : `${baseUrl}?_embed`;
//     console.log("Fetching blogs from:", url);

//     const response = await fetch(url, {
//       next: { revalidate: 60 },
//     });

//     // console.log("Response status:", response.status);
//     // console.log("Response ok:", response.ok);

//     const rawData = await response.json();
//     // console.log("API Response:", rawData);

//     if (!response.ok) return [];

//     return Array.isArray(rawData) ? rawData : (rawData.data || []);
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return [];
//   }
// }

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const url = "https://refones.com/blogs/wp-json/wp/v2/posts?_embed";

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    // ❗ Check BEFORE parsing JSON
    if (!response.ok) {
      console.error("API failed:", response.status);
      return [];
    }

    const text = await response.text();

    // ❗ Prevent crash if not JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON:", text);
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Blog fetch error:", error);
    return [];
  }
}

export default async function BlogPage() {
  // Call the dynamic API fetch
  const blogs = await getBlogs();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {blogs && blogs.length > 0 ? (
          <div className={styles.grid}>
            {blogs.map((blog, index) => (
              <BlogCard key={blog?.id || index} blog={blog} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666' }}>
            <h2>No blogs found</h2>
            <p>We couldn't fetch any articles. Please check your API endpoint or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
