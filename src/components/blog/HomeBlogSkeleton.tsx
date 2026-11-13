import styles from "./HomeBlogSlider.module.css";

const shimmer = {
  background: "linear-gradient(90deg, #e9ecef 25%, #f4f5f7 37%, #e9ecef 63%)",
  borderRadius: 4,
} as const;

export default function HomeBlogSkeleton() {
  return (
    <section className={styles.section} aria-hidden="true">
      <div className={styles.container}>
        <div className={styles.header}>
          <div style={{ ...shimmer, width: 200, height: 32 }} />
          <div style={{ ...shimmer, width: 120, height: 24, borderRadius: 20 }} />
        </div>

        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.imageWrapper}>
                <div style={{ ...shimmer, width: "100%", height: "100%", borderRadius: 0 }} />
              </div>
              <div className={styles.content}>
                <div style={{ ...shimmer, width: "100%", height: 18 }} />
                <div style={{ ...shimmer, width: "80%", height: 18 }} />
                <div style={{ ...shimmer, width: "45%", height: 14, marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
