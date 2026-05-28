import Link from "next/link";
import styles from "./notFound.module.css";
import animationData from "../../public/lottie/not-found.json";

export const metadata = {
  title: "404 - Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className={styles["nfnd-notfound-container"]}>

      {/* Header */}
      {/* <header className={styles["nfnd-notfound-header"]}>
        <Link href="/" className={styles["nfnd-logo"]}>
          Refone
        </Link>
      </header> */}

      {/* Main Content */}
      <main className={styles["nfnd-notfound-main"]}>

        <h1 className={styles["nfnd-error-code"]}>404</h1>

        <h2 className={styles["nfnd-error-title"]}>
          Page Not Found
        </h2>

        <p className={styles["nfnd-error-description"]}>
          The page you are looking for does not exist or may have been removed.
        </p>

        <Link href="/" className={styles["nfnd-home-button"]}>
          Go Back Home
        </Link>

      </main>
    </div>
  );
}