import Link from "next/link";
import Image from "next/image";
import styles from "./HomeBlogSlider.module.css";

interface Props {
  blogs: any[];
}

// Category badge color map
const CATEGORY_COLORS: Record<string, string> = {
  smartphones: "#7c3aed",
  "tips & tricks": "#0ea5e9",
  "e-waste": "#10b981",
  "refone updates": "#006aaf",
  technology: "#f59e0b",
  default: "#006aaf",
};


function getCategoryColor(category: string): string {
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS.default;
}

function getReadTime(content: string): string {
  const words = content?.replace(/<[^>]+>/g, "").split(/\s+/).length || 0;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function HomeBlogSlider({ blogs }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.heading}>Recent Articles</h2>
          <Link href="/blog" className={styles.viewAll}>
            View All Articles&nbsp;→
          </Link>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {blogs.map((blog) => {
            const image =
              blog?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              blog?.yoast_head_json?.og_image?.[0]?.url ||
              blog?.jetpack_featured_media_url ||
              blog?.coverImage ||
              "";

            const rawTitle =
              blog?.title?.rendered || blog?.title || "Untitled";
            const title = rawTitle.replace(/<[^>]+>/g, "");

            const rawExcerpt =
              blog?.excerpt?.rendered || blog?.excerpt || "";
            const excerpt = rawExcerpt.replace(/<[^>]+>/g, "").trim();

            let category = "Blog";
            if (blog?._embedded?.["wp:term"]?.[0]?.[0]?.name) {
              category = blog._embedded["wp:term"][0][0].name;
            } else if (blog?.category) {
              category = blog.category;
            }

            const rawDate = blog?.date || blog?.publishedAt || "";
            const formattedDate = rawDate
              ? new Date(rawDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            const readTime = getReadTime(
              blog?.content?.rendered || blog?.content || ""
            );

            const badgeColor = getCategoryColor(category);

            return (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className={styles.card}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      unoptimized
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                  {/* Category badge (Desktop) */}
                  <span
                    className={`${styles.badge} ${styles.badgeDesktop}`}
                    style={{ background: badgeColor }}
                  >
                    {category}
                  </span>
                </div>

                {/* Content */}
                <div className={styles.content}>
                  {/* Category badge (Mobile) */}
                  <span
                    className={`${styles.badge} ${styles.badgeMobile}`}
                    style={{ background: badgeColor }}
                  >
                    {category}
                  </span>
                  <h3 className={styles.title}>{title}</h3>
                  {excerpt && (
                    <p className={styles.excerpt}>{excerpt}</p>
                  )}
                  <div className={styles.meta}>
                    {formattedDate && (
                      <span className={styles.date}>{formattedDate}</span>
                    )}
                    {formattedDate && readTime && (
                      <span className={styles.dot}>·</span>
                    )}
                    <span className={styles.readTime}>{readTime}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}