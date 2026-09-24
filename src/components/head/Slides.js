'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Slides.module.css';

export const slidesData = [
  // 1. Flight Image Slide
  {
    id: 1,
    imageSrc: '/slides/flight.jpg',
    tag: 'GLOBAL TRAVEL',
    title: 'Explore Flights & Destinations',
    description: 'Find seamless flight options, flexible bookings, and exclusive routes tailored to your travel aspirations.',
    cta: 'Book Flights',
    badge: 'Best Airfares'
  },
  // 2. Hotel Image Slide
  {
    id: 2,
    imageSrc: '/slides/hotel.jpg',
    tag: 'LUXURY & STAY',
    title: 'Handpicked Hotel Destinations',
    description: 'Unwind in carefully vetted accommodations offering unmatched comfort, stellar locations, and premium hospitality.',
    cta: 'Browse Hotels',
    badge: 'Top-Rated Stays'
  },
    // 3. Insurance Image Slide
  {
    id: 3,
    imageSrc: '/slides/insurance.jpg',
    tag: 'PROTECTION',
    title: 'Reliable Insurance Coverages',
    description: 'Safeguard your future, travel, and assets with comprehensive insurance plans customized for absolute peace of mind.',
    cta: 'View Policies',
    badge: 'Trusted Coverage'
  },
  // 4. Job Image Slide
  {
    id: 4,
    imageSrc: '/slides/job.jpg',
    tag: 'CAREER GROWTH',
    title: 'Discover Job & Career Opportunities',
    description: 'Connect with top-tier employers, remote roles, and high-growth professional avenues designed for your skill set.',
    cta: 'Explore Jobs',
    badge: 'Top Employers'
  },

  // 5. Product Image Slide
  {
    id: 5,
    imageSrc: '/slides/product.jpg',
    tag: 'ESSENTIAL GEAR',
    title: 'Top-Tier Curated Products',
    description: 'Explore everyday essentials, lifestyle upgrades, and tech innovations tested thoroughly for maximum durability and style.',
    cta: 'Shop Products',
    badge: 'Editor’s Choice'
  }
];

export default function Slides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 4000); // Rotates every 4 seconds
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div 
      className={`${styles.bannerContainer} ${styles.hideOnMobile}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.innerContainer}>
        {slidesData.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${isActive ? styles.activeSlide : ''}`}
            >
              {/* Text Editorial Content */}
              <div className={styles.textContent}>
                <div className={styles.tagRow}>
                  <span className={styles.tag}>{slide.tag}</span>
                </div>

                <h2 className={styles.title}>
                  {slide.title}
                </h2>

                <p className={styles.description}>
                  {slide.description}
                </p>

                <div className={styles.actionRow}>
                  <button className={styles.ctaButton}>
                    {slide.cta}
                  </button>
                  <span className={styles.badge}>
                    {slide.badge}
                  </span>
                </div>
              </div>

              {/* Dynamic Visual Wrapper: Image layout */}
              <div className={styles.illustrationWrapper}>
                <div className={styles.illustrationCard}>
                  <div className={styles.imageContainer}>
                    <Image 
                      src={slide.imageSrc} 
                      alt={slide.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 500px"
                      priority={index === 0}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicators */}
        <div className={styles.indicators}>
          {slidesData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`${styles.dot} ${currentSlide === idx ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        {/* Arrow Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1))}
          className={`${styles.navArrow} ${styles.prevArrow}`}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slidesData.length)}
          className={`${styles.navArrow} ${styles.nextArrow}`}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}