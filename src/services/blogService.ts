import { BlogPost } from '@/types/blog';

// The base URL for blog API requests, falling back to the one provided if env var is missing
const BLOG_BASE_URL = process.env.NEXT_BLOG_BASE_URL || 'https://refones.com';

export const blogService = {
  /**
   * Fetch all blog posts
   */
  async getBlogs(): Promise<BlogPost[]> {
    try {
      // Note: You may need to adjust the '/api/blogs' path to match your exact backend endpoint
      // e.g., '/api/posts' or '/wp-json/wp/v2/posts'
      const response = await fetch(`${BLOG_BASE_URL}/api/blogs`, {
        next: { revalidate: 60 }, // Cache for 60 seconds (adjust as needed)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      const data = await response.json();
      
      // If your API wraps the array in a 'data' property (like Laravel often does), use data.data
      const blogsList = Array.isArray(data) ? data : (data.data || []);
      
      return blogsList as BlogPost[];
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
      const response = await fetch(`${BLOG_BASE_URL}/api/blogs/${slug}`, {
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
