import Link from "next/link";
import Image from "next/image";
import styles from "./HomeBlogSlider.module.css";

interface Props {
  blogs: any[];
}

export default function HomeBlogSlider({ blogs }: Props) {
  return (
    <section className={styles.section}>
        <div className={styles.container}>
      <div className={styles.header}>
        <h2>Latest Blogs</h2>

        <Link href="/blog" className={styles.viewMore}>
          View More →
        </Link>
      </div>

      <div className={styles.slider}>
        {blogs.map((blog) => {
          const image =
            blog?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            blog?.yoast_head_json?.og_image?.[0]?.url ||
            "";

          return (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={image}
                  alt={blog.title.rendered}
                  fill
                  unoptimized
                  className={styles.image}
                />

                <div className={styles.overlay} />

                <h3 className={styles.title}>
                  {blog.title.rendered}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
}