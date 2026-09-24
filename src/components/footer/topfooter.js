import Link from 'next/link';
import styles from './topfooter.module.css';

export default function TopFooter() {
  const serviceLinks = [
    { name: 'Privacy', href: '/index/privacy' },
    { name: 'About us', href: '/index/about' },
    { name: 'Services', href: '/index/services' },
    { name: 'Brokerage solution', href: '/index/brokerage' },
    { name: 'Pricing', href: '/index/pricing' },
    { name: 'Contact us', href: '/index/contact' },
  ];

  const marketplaceLinks = [
    { name: 'Hotels', href: '/navpages/hotel' },
    { name: 'Insurance', href: '/navpages/insurance' },
    { name: 'Finance', href: '/navpages/finance' },
    { name: 'Services', href: '/navpages/service' },
    { name: 'Products', href: '/navpages/product' },
    { name: 'Jobs', href: '/navpages/jobs' },
    { name: 'Articles', href: '/navpages/article' },
    { name: 'Promote With Us', href: '/index/pricing' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Side: Service Company Links */}
        <div className={`${styles.section} ${styles.leftSection}`}>
          <h3 className={styles.heading}> Services we Provide at Tagi</h3>
          <ul className={styles.linkList}>
            {serviceLinks.map((link) => (
              <li key={link.href} className={styles.linkItem}>
                <Link href={link.href} className={styles.link}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Marketplace Links */}
        <div className={`${styles.section} ${styles.rightSection}`}>
          <h3 className={styles.heading}>Search Us Europe Brands</h3>
          <ul className={styles.linkList}>
            {marketplaceLinks.map((link) => (
              <li key={link.href} className={styles.linkItem}>
                <Link href={link.href} className={styles.link}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}