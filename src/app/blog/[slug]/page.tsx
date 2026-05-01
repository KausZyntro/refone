import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './blogDetail.module.css';
import { blogService } from '@/services/blogService';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await blogService.getBlogBySlug(params.slug);
  if (!blog) {
    return { title: 'Blog Not Found | Refone' };
  }
  return {
    title: `${blog.title} | Refone Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await blogService.getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.category}>{blog.category}</span>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{blog.author}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.date}>{blog.publishedAt}</span>
          </div>
        </header>

        <div className={styles.imageContainer}>
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className={styles.image}
            unoptimized // Remove this when using real configured image domains
          />
        </div>

        {/* Content rendering. In a real app, you might use a markdown renderer or sanitize HTML */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
