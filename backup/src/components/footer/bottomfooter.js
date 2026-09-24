import Image from 'next/image';
import Link from 'next/link';
import styles from './bottomfooter.module.css';

export default function BottomFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Side: Disclaimer Section (70% width with bold encasing line) */}
        <div className={styles.disclaimerSection}>
          <p className={styles.disclaimerText}>
            Disclaimer: Financial and brokerage services involve market risks. Please review all institutional policies carefully prior to engaging in transactions. Past performance does not guarantee future results, and regulatory compliance is strictly maintained across all operations.
          </p>
        </div>

        {/* Right Side: Encountered Logo Part */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.png" 
              alt="Company Logo" 
              width={120} 
              height={120} 
              className={styles.logo}
              priority
            />
            <Link href="/dashboard/dflogin" className={styles.adminButton}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}