'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Search from '@/components/head/Search';
import styles from './Topbar.module.css';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarContainer}>
        {/* Mobile Hamburger Toggle Button */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line1Open : ''}`} />
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line2Open : ''}`} />
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line3Open : ''}`} />
        </button>

        {/* Logo Slot */}
        <div className={styles.logoSlot}>
          <Link href="/" className={styles.logoLink} onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Search Bar - Resized / Flexible for small screens */}
        <div className={styles.middle}>
          <Search />
        </div>

        {/* Navigation Links */}
        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.navMenuOpen : ''}`}>
          <Link href="/index/privacy" className={styles.link} onClick={closeMenu}>
            Privacy
          </Link>
          <Link href="/index/about" className={styles.link} onClick={closeMenu}>
            About&nbsp;us
          </Link>
          <Link href="/index/services" className={styles.link} onClick={closeMenu}>
            Services
          </Link>
          <Link href="/index/brokerage" className={styles.link} onClick={closeMenu}>
            Brokerage solution
          </Link>
          <Link href="/index/pricing" className={styles.link} onClick={closeMenu}>
            Pricing
          </Link>

          {/* Mobile CTA Button (inside menu for small screens) */}
          <div className={styles.mobileCtaSlot}>
            <Link href="/index/contact" className={styles.ctaBtn} onClick={closeMenu}>
              Contact us 
            </Link>
          </div>
        </nav>

        {/* Google Translator Component Container */}
        <div 
          id="google_translate_element" 
          className={styles.translatorSlot}
        />

        {/* Right CTA (Desktop) */}
        <div className={styles.right}>
          <Link href="/index/contact" className={styles.ctaBtn} onClick={closeMenu}>
            contact us
          </Link>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  );
}