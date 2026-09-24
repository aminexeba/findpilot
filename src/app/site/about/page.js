

import Link from 'next/link';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | Curating Quality for Everyday Life',
  description: 'We are a specialized affiliate marketing agency dedicated to identifying and promoting highly crafted products and services.',
};

/**
 * Quora-Styled About Us Page
 * Route: http://localhost:3000/about
 * File: src/app/about/page.js
 */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <main className={styles.content}>
          <header className={styles.header}>
            <span className={styles.badge}>About Our Agency</span>
            <h1 className={styles.title}>Curating Quality for Everyday Life</h1>
            <p className={styles.subtitle}>
              We connect conscious consumers with exceptionally crafted products and services.
            </p>
          </header>

          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              We are a specialized affiliate marketing agency dedicated to identifying and promoting highly crafted products and services. We believe that great design, superior quality, and fair pricing should go hand in hand.
            </p>
            <p>
              Our goal is simple: to help people elevate their daily lives by discovering tools, services, and goods that offer genuine value and reliable performance.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What We Publish</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true" role="img">🔍</span>
                <div className={styles.cardTitle}>Product Reviews</div>
                <p className={styles.cardDesc}>
                  In-depth, unbiased evaluations testing real-world performance, durability, and craftsmanship.
                </p>
              </div>

              <div className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true" role="img">📚</span>
                <div className={styles.cardTitle}>Buying Guides</div>
                <p className={styles.cardDesc}>
                  Comprehensive comparisons designed to simplify complex choices and save you time and money.
                </p>
              </div>

              <div className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true" role="img">⭐</span>
                <div className={styles.cardTitle}>Recommendations</div>
                <p className={styles.cardDesc}>
                  Hand-picked selections that hit the sweet spot between exceptional quality and reasonable price.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Monetization & Transparency</h2>
            <div className={styles.disclosure}>
              <h3>Affiliate Commission Disclosure</h3>
              <p>
                We earn commissions through our referral links on product reviews, buying guides, and recommendations. When you purchase through our links, we may receive compensation from the merchant at zero extra cost to you. This model supports our independent research and allows us to keep publishing high-quality editorial content.
              </p>
            </div>
          </section>

          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>Want to Feature Your Brand?</h3>
            <p className={styles.ctaSubtitle}>
              Partner with us to feature your high-quality products in our next review or buyer guide.
            </p>
            <Link href="/site/pricing" className={styles.btn}>
              View Pricing Options
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}