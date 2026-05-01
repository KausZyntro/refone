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

  return (
    <Link href={`/blog/${blog.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {/* We use unoptimized for placeholders. In production, remove unoptimized and use valid image domains */}
        {!imgError ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className={styles.image}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className={styles.image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            No Image Available
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.category}>{blog.category}</div>
        <h3 className={styles.title}>{blog.title}</h3>
        <div className={styles.meta}>
          <span className={styles.author}>{blog.author}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.date}>{blog.publishedAt}</span>
        </div>
        <p className={styles.excerpt}>{blog.excerpt}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
