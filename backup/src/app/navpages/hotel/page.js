'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchHotel from '@components/searchbars/searchhotel';
import styles from './hotelpage.module.css';

const CARDS_PER_PAGE = 20;

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Set browser tab title dynamically for SEO and browser tab management
  useEffect(() => {
    document.title = 'Explore & Compare Premier Hotels | Rates & Deals';
  }, []);

  // Fetch hotels from Firestore
  useEffect(() => {
    let isMounted = true;

    async function fetchHotels() {
      try {
        const querySnapshot = await getDocs(collection(db, 'hotel'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setHotels(data);
          setFilteredHotels(data);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHotels();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchHotel component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredHotels(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search/filter changes
  }, []);

  // Pagination calculations using filtered results
  const totalPages = Math.ceil(filteredHotels.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engines (Schema.org ItemList + Hotel)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Explore & Compare Hotels',
    description: 'Find and compare top luxury hotels, resorts, nightly rates, and accommodation offers.',
    numberOfItems: filteredHotels.length,
    itemListElement: currentHotels.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'Hotel',
        name: item.name || item.brand || item.title || 'Premier Hotel',
        description: item.details || item.description || '',
        image: item.image || item.photo || 'https://via.placeholder.com/400x140?text=Hotel+Image',
        url: item.bookingLink || item.affiliatelink || item.link || '#',
        address: item.location || item.city || item.address || 'Global',
      },
    })),
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading hotels and deals...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      {/* Schema.org JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header & Search Section */}
      <header className={styles.headerSection}>
        <SearchHotel hotels={hotels} onFilterChange={handleFilterChange} />
        
        {/* H1 - Primary Keyword Heading for SEO */}
        <h1 className={styles.pageTitle}>Explore & Compare Premier Hotels</h1>
        
        <p className={styles.pageSubtitle}>
          Discover luxury resorts, boutique hotels, and top room rates worldwide. Compare options and book your ideal accommodation.
        </p>
      </header>

      {filteredHotels.length === 0 ? (
        <p className={styles.noData}>No hotels matching your search criteria were found.</p>
      ) : (
        <>
          <section className={styles.grid} aria-label="Hotels Directory & Offers">
            {currentHotels.map((item) => {
              const hotelTitle = item.name || item.brand || item.title || 'Premier Hotel';
              const hotelLocation = item.location || item.city || item.address || item.title || 'Global';
              const bookingUrl = item.bookingLink || item.affiliatelink || item.link || '#';
              const refCode = item.id ? item.id.slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={item.image || item.photo || 'https://via.placeholder.com/400x140?text=Hotel+Image'}
                      alt={`${hotelTitle} in ${hotelLocation}`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="400"
                      height="140"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>{item.tag || item.rating || 'LUXURY'}</span>
                      
                      {/* H2 - Secondary Heading for Hotel Name */}
                      <h2 className={styles.prominentBrand}>{hotelTitle}</h2>
                      
                      <span className={styles.cardCode}>HTL-{refCode}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={styles.cardDivider} aria-hidden="true">
                    <div className={styles.notchLeft}></div>
                    <div className={styles.solidLine}></div>
                    <div className={styles.notchRight}></div>
                  </div>

                  {/* Bottom Section */}
                  <div className={styles.cardBottom}>
                    <div className={styles.detailsCol}>
                      {/* H3 - Tertiary Heading for Hotel Location / Sub-info */}
                      <h3 className={styles.itemTitle}>{hotelLocation}</h3>
                      <p className={styles.detailsText}>{item.details || item.description}</p>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>
                          {item.price ? 'Starting From:' : 'Location:'}
                        </span>
                        <span className={styles.countriesList}>
                          {item.price
                            ? `$${item.price} / night`
                            : Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : item.city || item.country || 'Global'}
                        </span>
                      </div>

                      {/* Google-Compliant Affiliate Booking Link */}
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Book a room at ${hotelTitle}`}
                      >
                        Book Now &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Hotels Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageBtn}
                aria-label="Go to previous page"
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
                aria-label="Go to next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}