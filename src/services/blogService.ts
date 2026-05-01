import { BlogPost } from '@/types/blog';

// Mock data based on the provided screenshot
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    slug: 'iphone-18-launch-date-in-india',
    title: 'iPhone 18 Launch Date in India: Expected Timeline & Availability',
    excerpt: 'QUICK ANSWER — IPHONE 18 LAUNCH Date In India Expected launch event: Second week of September 2026 (Apple Keynote, USA) [...]',
    coverImage: '/images/blog/iphone-18-launch.jpg', // Placeholder path
    author: 'refone.help',
    publishedAt: 'April 27, 2026',
    category: 'Blog',
    content: '<p>This is the full content for the iPhone 18 launch date blog post. Detailed information will be available here when the real API is connected.</p>',
  },
  {
    id: '2',
    slug: 'iphone-11-vs-iphone-12-refurbished',
    title: 'iPhone 11 vs iPhone 12 Refurbished — Which Should You Buy?',
    excerpt: 'REFONE PROMISE — SUPER QUALITY ONLY Refone sells only Super Quality Grade A certified refurbished iPhones. We never sell Good',
    coverImage: '/images/blog/iphone-11-vs-12.jpg', // Placeholder path
    author: 'refone.help',
    publishedAt: 'April 24, 2026',
    category: 'Blog',
    content: '<p>This is the full content comparing iPhone 11 and iPhone 12. Detailed information will be available here when the real API is connected.</p>',
  },
  {
    id: '3',
    slug: 'best-refurbished-iphones-under-20000',
    title: 'Best Refurbished iPhones Under ₹20000 in India (2026)',
    excerpt: 'You want an iPhone. You have ₹20000. Most people tell you it is impossible — that ₹20,000 only buys you',
    coverImage: '/images/blog/best-iphones-under-20000.jpg', // Placeholder path
    author: 'refone.help',
    publishedAt: 'April 22, 2026',
    category: 'Blog',
    content: '<p>This is the full content discussing the best iPhones under 20k. Detailed information will be available here when the real API is connected.</p>',
  },
  {
    id: '4',
    slug: 'refurbished-iphone-hidden-problems',
    title: 'Refurbished iPhone Hidden Problems Buyers Ignore (2026)',
    excerpt: 'When buying a refurbished iPhone, there are several hidden problems that buyers often ignore. Learn what to look out for.',
    coverImage: '/images/blog/hidden-problems.jpg', // Placeholder path
    author: 'refone.help',
    publishedAt: 'April 20, 2026',
    category: 'Blog',
    content: '<p>This is the full content about hidden problems. Detailed information will be available here when the real API is connected.</p>',
  },
  {
    id: '5',
    slug: 'best-refurbished-iphones-for-students-varanasi',
    title: 'Best Refurbished iPhones For Students in Varanasi (2026)',
    excerpt: 'Are you a student in Varanasi looking for a budget-friendly iPhone? Here are the best refurbished options available right now.',
    coverImage: '/images/blog/students-varanasi.jpg', // Placeholder path
    author: 'refone.help',
    publishedAt: 'April 18, 2026',
    category: 'Blog',
    content: '<p>This is the full content about phones for students in Varanasi. Detailed information will be available here when the real API is connected.</p>',
  }
];

export const blogService = {
  /**
   * Fetch all blog posts
   */
  async getBlogs(): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockBlogs;
  },

  /**
   * Fetch a single blog post by slug
   * @param slug The URL-friendly identifier for the blog
   */
  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const blog = mockBlogs.find((b) => b.slug === slug);
    return blog || null;
  },
};
