'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchFinance from '@components/searchbars/searchfinance';
import styles from './financepage.module.css';

const CARDS_PER_PAGE = 20;

export default function FinancePage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Set browser tab title dynamically for client component
  useEffect(() => {
    document.title = 'Compare & Find Top Financial Companies | Offers & Rates';
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchListings() {
      try {
        const querySnapshot = await getDocs(collection(db, 'finance'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setListings(data);
          setFilteredListings(data);
        }
      } catch (error) {
        console.error('Error fetching finance listings:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchListings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchFinance component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredListings(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search/filter changes
  }, []);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredListings.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentListings = filteredListings.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engine Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Compare Financial Companies and Offers',
    description: 'Find and compare top financial companies, loans, rates, and services.',
    numberOfItems: filteredListings.length,
    itemListElement: currentListings.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'FinancialService',
        name: item.brand || item.title || 'Financial Service',
        description: item.details || '',
        image: item.image || 'https://via.placeholder.com/250x300',
        url: item.affiliatelink || '#',
      },
    })),
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading financial listings and offers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      {/* Schema.org JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header & Search Section */}
      <header className={styles.headerSection}>
        <SearchFinance listings={listings} onFilterChange={handleFilterChange} />
        <h1 className={styles.pageTitle}>Compare & Find Top Financial Companies</h1>
        <p className={styles.pageSubtitle}>
          Compare rates, financial services, and provider reviews to find the best option for your needs.
        </p>
      </header>

      {filteredListings.length === 0 ? (
        <p className={styles.noData}>No finance companies matching your criteria were found.</p>
      ) : (
        <>
          <section className={styles.grid} aria-label="Financial Services Directory">
            {currentListings.map((item) => {
              const brandName = item.brand || item.title || 'Finance Company';
              const refCode = item.id ? item.id.slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={item.image || 'https://via.placeholder.com/250x300'}
                      alt={`${brandName} official logo`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="250"
                      height="150"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>{item.tag || 'FEATURED'}</span>
                      <h2 className={styles.prominentBrand}>{brandName}</h2>
                      <span className={styles.cardCode}>REF-{refCode}</span>
                    </div>
                  </div>

                  {/* Visual Divider */}
                  <div className={styles.cardDivider} aria-hidden="true">
                    <div className={styles.notchLeft}></div>
                    <div className={styles.solidLine}></div>
                    <div className={styles.notchRight}></div>
                  </div>

                  {/* Bottom Section */}
                  <div className={styles.cardBottom}>
                    <div className={styles.detailsCol}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.detailsText}>{item.details}</p>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>Available in: </span>
                        <span className={styles.countriesList}>
                          {Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : item.countries || 'Global'}
                        </span>
                      </div>

                      {/* Google-Compliant Affiliate Link */}
                      <a
                        href={item.affiliatelink || '#'}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Visit official ${brandName} website`}
                      >
                        Visit Website &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Pagination Navigation">
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