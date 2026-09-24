import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Building2, 
  ShoppingBag, 
  Wrench, 
  Briefcase, 
  Sparkles, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

import Slides from '@/components/head/Slides';
import SearchHotel from '@components/searchbars/searchhotel';
import SearchInsurance from '@components/searchbars/searchinsurance';
import CityScene from '@components/anim/city';
import Bolling from '@/components/anim/bolling';

export const metadata = {
  title: 'Compare & Find Hotels, Flights, Insurance, and more | findpilot',
  description: 'Compare and find low prices on hotels, flights, insurance plans, local services, products, and career openings with FindPilot.cc. Your premier deal comparator.',
  keywords: [
    'compare hotel', 'find hotel', 'compare flight', 'find flight', 
    'compare insurance', 'find insurance', 'find jobs', 'find services', 
    'product deals', 'findpilot'
  ],
  alternates: {
    canonical: 'https://findpilot.cc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'FindPilot - Compare & Find Hotels, Flights, Insurance & More',
    description: 'Compare and find low prices on hotels, flights, insurance plans, local services, products, and dream careers.',
    url: 'https://findpilot.cc',
    siteName: 'FindPilot',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindPilot - Compare & Find Hotels, Flights, Insurance & More',
    description: 'Compare low prices on hotels, flights, insurance plans, products, local services, and career openings.',
  },
};

export default function HomePage() {
  const navItems = [
    { name: 'Find Service', href: '/navpages/service', icon: Wrench, desc: 'Hire verified local experts' },
    { name: 'Find Product', href: '/navpages/product', icon: ShoppingBag, desc: 'Shop trending items' },
    { name: 'Find Hotel', href: '/navpages/hotel', icon: Building2, desc: 'Book stays & properties' },
    { name: 'Find Finance', href: '/navpages/finance', icon: ShieldCheck, desc: 'Compare protection plans' },
    { name: 'Find Jobs', href: '/navpages/jobs', icon: Briefcase, desc: 'Explore career openings' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'FindPilot',
    'url': 'https://findpilot.cc',
    'description': 'Compare and find low prices on hotels, flights, insurance plans, products, local services, and career openings.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://findpilot.cc/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Slides />

      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.pillBadge}>
              <Sparkles size={16} /> Book your stays, flights, and services globally
            </div>
            <h1 className={styles.heroTitle}>
              Find your next stay, insurance, or dream career.
            </h1>
            <p className={styles.heroSubtitle}>
              Search low prices on hotels, homes, and much more...
            </p>
          </div>

          <div className={styles.searchWrapper}>
            <div className={styles.bookingBoxContainer}>
              <div className={styles.searchSectionBlock}>
                <h3 className={styles.bookingSearchTitle}>
                  <Building2 size={18} /> Stays & Accommodations
                </h3>
                <SearchHotel />
              </div>

              <div className={styles.searchSectionBlock} style={{ marginTop: '1.5rem' }}>
                <h3 className={styles.bookingSearchTitle}>
                  <ShieldCheck size={18} /> Protection & Insurance Plans
                </h3>
                <SearchInsurance />
              </div>
            </div>
          </div>

          <div className={styles.enhancedNavSection}>
            <div className={styles.enhancedNavHeader}>
              <Compass size={18} className={styles.compassIcon} />
              <span>Explore More Categories</span>
            </div>
            <div className={styles.navLinksGrid}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.name} href={item.href} className={styles.enhancedNavCard}>
                    <div className={styles.navCardIconWrapper}>
                      <IconComponent size={20} />
                    </div>
                    <div className={styles.navCardContent}>
                      <span className={styles.navCardTitle}>{item.name}</span>
                      <span className={styles.navCardDesc}>{item.desc}</span>
                    </div>
                    <ArrowRight size={16} className={styles.navCardArrow} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={styles.citySceneWrapper} style={{ width: '100%', marginTop: '3rem' }}>
            <CityScene />
          </div>

          <div className={styles.bollingSceneWrapper} style={{ width: '100%', marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Bolling />
          </div>
        </section>
      </div>
    </>
  );
}