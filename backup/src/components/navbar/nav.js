'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './nav.module.css';

export default function Nav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Hotels', href: '/navpages/hotel' },
    { name: 'Insurance', href: '/navpages/insurance' },
    { name: 'Finance', href: '/navpages/finance' },
    { name: 'Products', href: '/navpages/product' },
    { name: 'Services', href: '/navpages/service' },
    { name: 'Jobs', href: '/navpages/job' },
    { name: 'Articles', href: '/navpages/article' },
  ];

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbarContainer}>
        {/* Left Side: Available Opportunities with Red Animated Arrow */}
        <div className={styles.logo}>
          <Link href="/" className={styles.opportunitiesLink}>
            <span>Available Opportunities</span>
            <span className={styles.animatedArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={styles.mobileMenuToggle} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.open : ''}`}></span>
        </button>

        {/* Navigation Tabs */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: CTA */}
        <div className={styles.navCtaContainer}>
          <Link href="/index/contact" className={styles.navCta}>
            Go Live
          </Link>
        </div>
      </nav>
    </header>
  );
}