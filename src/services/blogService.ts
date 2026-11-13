import { BlogPost } from '@/types/blog';

// The base URL for blog API requests, falling back to the one provided if env var is missing
const BLOG_BASE_URL = process.env.NEXT_BLOG_BASE_URL || 'https://refones.com';

export const blogService = {
  
  async getBlogs(limit = 4): Promise<BlogPost[]> {
      const page = 1;
    try {
      // Note: You may need to adjust the '/api/blogs' path to match your exact backend endpoint
      // e.g., '/api/posts' or '/wp-json/wp/v2/posts'
      // Only request what the homepage renders: 100 embedded posts used to be
      // fetched (and returned ~9 MB) just to show four cards.
      const separator = BLOG_BASE_URL.includes("?") ? "&" : "?";
      const response = await fetch(
        `${BLOG_BASE_URL}${separator}_embed&per_page=${limit}&page=${page}`,
        {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      const data = await response.json();
      
      // If your API wraps the array in a 'data' property (like Laravel often does), use data.data
      const blogsList = Array.isArray(data) ? data : (data.data || []);
      
      return (blogsList as BlogPost[]).slice(0, limit);
    } catch (error) {
      console.error('Error in getBlogs:', error);
      return []; // Return empty array on error to prevent page crash
    }
  },

  /**
   * Fetch a single blog post by slug
   * @param slug The URL-friendly identifier for the blog
   */
  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Note: Adjust the '/api/blogs/${slug}' path to match your exact backend endpoint
      const response = await fetch(`${BLOG_BASE_URL}?slug=${slug}&_embed`, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch blog ${slug}: ${response.status}`);
      }

      const data = await response.json();
      
      // If your API wraps the object in a 'data' property, use data.data
      const blogData = data.data ? data.data : data;
      
      return blogData as BlogPost;
    } catch (error) {
      console.error(`Error in getBlogBySlug for ${slug}:`, error);
      return null;
    }
  },
};
