import React from 'react';
import styles from './page.module.css';
import BlogCard from '@/components/blog/BlogCard';
import { blogService } from '@/services/blogService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Refone',
  description: 'Read the latest updates, tips, and news about refurbished iPhones from Refone.',
};

export default async function BlogPage() {
  // Fetch blogs using the mock service (ready for real API replacement)
  const blogs = await blogService.getBlogs();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
