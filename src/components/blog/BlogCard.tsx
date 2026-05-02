"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.css';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [imgError, setImgError] = useState(false);

  // Safely parse WordPress REST API data structures or fallback to normal objects
  const title = blog?.title?.rendered || blog?.title || 'Untitled';
  const slug = blog?.slug || '';
  
  // Try to find WordPress featured image from various possible locations
  const coverImage = blog?._embedded?.['wp:featuredmedia']?.[0]?.source_url 
                  || blog?.yoast_head_json?.og_image?.[0]?.url 
                  || blog?.jetpack_featured_media_url 
                  || blog?.coverImage 
                  || '';

  // Parse WordPress categories if embedded
  let category = 'Blog';
  if (blog?._embedded?.['wp:term']?.[0]?.[0]?.name) {
    category = blog._embedded['wp:term'][0][0].name;
  } else if (blog?.category) {
    category = blog.category;
  }

  // Parse WordPress author if embedded
  let author = 'Refone';
  if (blog?._embedded?.author?.[0]?.name) {
    author = blog._embedded.author[0].name;
  } else if (blog?.yoast_head_json?.author) {
    author = blog.yoast_head_json.author;
  } else if (blog?.author) {
    author = blog.author;
  }

  // Format WordPress date
  const rawDate = blog?.date || blog?.publishedAt;
  const publishedAt = rawDate ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  // WordPress excerpt usually contains HTML tags, strip them for the card
  const rawExcerpt = blog?.excerpt?.rendered || blog?.excerpt || '';
  const excerpt = typeof rawExcerpt === 'string' ? rawExcerpt.replace(/<[^>]+>/g, '').trim() : '';

  return (
    <Link href={slug ? `/blog/${slug}` : '#'} className={styles.card}>
      <div className={styles.imageContainer}>
        {/* We use unoptimized for placeholders. In production, remove unoptimized and use valid image domains */}
        {(!imgError && coverImage) ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className={styles.image}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className={styles.image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', backgroundColor: '#e9ecef' }}>
            No Image
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.category}>{category}</div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.author}>{author}</span>
          {publishedAt && <span className={styles.separator}>/</span>}
          <span className={styles.date}>{publishedAt}</span>
        </div>
        <p className={styles.excerpt}>{excerpt}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
