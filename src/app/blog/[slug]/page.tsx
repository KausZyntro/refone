import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './blogDetail.module.css';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};


import Link from 'next/link';

// Fetch function integrated directly into the page
async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_BLOG_BASE_URL || 'http://refones.com/blogs/wp-json/wp/v2/posts';
  try {
    // Append slug and _embed for WordPress REST API
    const fetchUrl = baseUrl.includes('?') ? `${baseUrl}&slug=${slug}&_embed` : `${baseUrl}?slug=${slug}&_embed`;
    const response = await fetch(fetchUrl, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    
    const data = await response.json();
    // WordPress returns an array of matching posts when queried by slug
    const blogData = Array.isArray(data) ? data[0] : (data.data || data);
    return blogData || null;
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;
//   const blog = await getBlogBySlug(slug);
//   console.log(blog);
//   if (!blog) {
//     return { title: 'Blog Not Found | Refone' };
//   }
//   return {
//     title: `${blog.title} | Refone Blog`,
//     description: blog.excerpt,
//   };
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug} = await params; 
  console.log('Slug:', slug);

  const blog = await getBlogBySlug(slug);
   console.log('Blog Data:', blog);

  if (!blog) {
    return {
      title: 'Blog | Refone',
      description: 'Read the latest updates, tips, and news about refurbished iPhones from Refone.',
    };
  }


  return {
    title: `${slug} | Refone`,
    alternates: {
      canonical: `https://refone.co.in/blog/${slug}`,
    },
    description:
      blog?.excerpt?.rendered ||
      blog?.excerpt ||
      'Read the latest updates, tips, and news about refurbished iPhones from Refone.',
  };
  
}

function fixTOCLinks(html) {
  if (!html) return '';
 
  // Replace full WordPress URL with only hash
  return html.replace(
    /https:\/\/refones\.com\/blogs\/[^#]+(#.*?)"/g,
    '$1"'
  );
}

export default async function BlogDetailPage({ params }: Props) {
  
  const { slug } = await params;
  // Call the dynamic API fetch
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Safely parse WordPress REST API data structures
  const title = blog?.title?.rendered || blog?.title || 'Untitled';
  
  const coverImage = blog?._embedded?.['wp:featuredmedia']?.[0]?.source_url 
                  || blog?.yoast_head_json?.og_image?.[0]?.url 
                  || blog?.jetpack_featured_media_url 
                  || blog?.coverImage 
                  || '';

  // Parse WordPress author
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
  const publishedAt = rawDate ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  // WordPress HTML content
  // const contentHtml = blog?.content?.rendered || blog?.content || '';

  const rawHtml = blog?.content?.rendered || blog?.content || '';
const contentHtml = fixTOCLinks(rawHtml);



  return (
    <article className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Breadcrumbs matching design */}
        {/* <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/blog">Blog</Link>
          <span>›</span>
          {title}
        </div> */}

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{author}</span>
            {publishedAt && <span className={styles.separator}>/</span>}
            <span className={styles.date}>{publishedAt}</span>
          </div>
        </header>

        {/* <div className={styles.imageContainer}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className={styles.image}
              unoptimized
            />
          ) : (
             <div className={styles.image} style={{ backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
               No Image Available
             </div>
          )}
        </div> */}

        {/* 
          Raw HTML rendering from API.
          The .content class in blogDetail.module.css handles styling 
          for all typography (h2, p, ul, li, img, blockquote) coming from the API.
        */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Static Comment Section from Design */}
        <div className={styles.commentSection}>
          <h3 className={styles.commentTitle}>Leave a Reply</h3>
          <p className={styles.commentSubtitle}>Your email address will not be published. Required fields are marked *</p>
          
          <form className={styles.commentForm}>
            <div className={styles.formGroup}>
              <label htmlFor="comment">Comment *</label>
              <textarea id="comment" className={styles.formTextarea} required></textarea>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input type="text" id="name" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="website">Website</label>
                <input type="url" id="website" className={styles.formInput} />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="saveInfo" />
              <label htmlFor="saveInfo">
                Save my name, email, and website in this browser for the next time I comment.
              </label>
            </div>

            <button type="submit" className={styles.submitBtn}>Post Comment</button>
          </form>
        </div>

      </div>
    </article>
  );
}
