// src/app/not-found.jsx
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.notFoundContainer}>
      <div className={styles.card}>
        <div className={styles.errorCode}>404</div>
        <span className={styles.badge}>Page Not Found</span>

        <h1 className={styles.title}>Lost your way?</h1>
        <p className={styles.description}>
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <div className={styles.actionGroup}>
          <Link href="/" className={styles.primaryBtn}>
            Back to Home
          </Link>
        </div>

        <div className={styles.quickLinks}>
          <span className={styles.quickLinksTitle}>Popular Destinations</span>
          <div className={styles.linksGrid}>
            <Link href="/" className={styles.linkItem}>
              🏠 Home
            </Link>
            <Link href="/site/services" className={styles.linkItem}>
              🛠️ Services
            </Link>
            <Link href="/site/brokerage" className={styles.linkItem}>
              📦 brokerage
            </Link>
            <Link href="/site/contact" className={styles.linkItem}>
              📞 Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}