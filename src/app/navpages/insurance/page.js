'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchInsurance from '@components/searchbars/searchinsurance';
import styles from './insurancepage.module.css';

const CARDS_PER_PAGE = 20;

export default function InsurancePage() {
  const [insuranceList, setInsuranceList] = useState([]);
  const [filteredInsurance, setFilteredInsurance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Set browser tab title dynamically for SEO and tab management
  useEffect(() => {
    document.title = 'Compare Top Insurance Plans & Coverage | Rates & Quotes';
  }, []);

  // Fetch insurance plans from Firestore
  useEffect(() => {
    let isMounted = true;

    async function fetchInsurance() {
      try {
        const querySnapshot = await getDocs(collection(db, 'insurance'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setInsuranceList(data);
          setFilteredInsurance(data);
        }
      } catch (error) {
        console.error('Error fetching insurance plans:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchInsurance();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchInsurance component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredInsurance(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search/filter changes
  }, []);

  // Pagination calculations using filtered results
  const totalPages = Math.ceil(filteredInsurance.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentInsurance = filteredInsurance.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engines (Schema.org ItemList + FinancialProduct)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Compare Top Insurance Plans & Coverage',
    description: 'Compare leading health, auto, travel, and life insurance plans, coverage options, and monthly premiums.',
    numberOfItems: filteredInsurance.length,
    itemListElement: currentInsurance.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: item.planName || item.title || item.name || 'Insurance Plan',
        provider: {
          '@type': 'Organization',
          name: item.provider || item.company || item.brand || item.title || 'Insurance Provider',
        },
        description: item.coverage || item.details || item.description || '',
        image: item.image || item.logo || 'https://via.placeholder.com/400x140?text=Insurance+Provider',
        url: item.quoteLink || item.affiliatelink || item.link || '#',
      },
    })),
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading insurance plans and quotes...</p>
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
        <SearchInsurance
          insuranceList={insuranceList}
          onFilterChange={handleFilterChange}
        />

        {/* H1 - Primary Keyword Heading for SEO */}
        <h1 className={styles.pageTitle}>Compare Top Insurance Plans & Coverage</h1>

        <p className={styles.pageSubtitle}>
          Discover dependable health, travel, auto, and life insurance policies. Compare monthly rates, deductible terms, and request instant quotes.
        </p>
      </header>

      {filteredInsurance.length === 0 ? (
        <p className={styles.noData}>
          No insurance plans matching your search criteria were found.
        </p>
      ) : (
        <>
          <section className={styles.grid} aria-label="Insurance Plans Directory">
            {currentInsurance.map((item) => {
              const providerName =
                item.provider ||
                item.company ||
                item.brand ||
                item.title ||
                'Insurance Provider';
              const planName =
                item.planName || item.title || item.name || 'Insurance Plan';
              const quoteUrl =
                item.quoteLink || item.affiliatelink || item.link || '#';
              const refCode = item.id ? item.id.slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={
                        item.image ||
                        item.logo ||
                        'https://via.placeholder.com/400x140?text=Insurance+Provider'
                      }
                      alt={`${providerName} logo - ${planName}`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="400"
                      height="140"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>
                        {item.tag || item.category || item.type || 'TOP COVERAGE'}
                      </span>

                      {/* H2 - Secondary Heading for Insurance Provider */}
                      <h2 className={styles.prominentBrand}>{providerName}</h2>

                      <span className={styles.cardCode}>INS-{refCode}</span>
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
                      {/* H3 - Tertiary Heading for Specific Plan Name */}
                      <h3 className={styles.itemTitle}>{planName}</h3>
                      <p className={styles.detailsText}>
                        {item.coverage || item.details || item.description}
                      </p>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>
                          {item.premium || item.price
                            ? 'Starting From:'
                            : 'Available in:'}
                        </span>
                        <span className={styles.countriesList}>
                          {item.premium || item.price
                            ? `$${item.premium || item.price}/mo`
                            : Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : item.countries || item.region || 'Worldwide'}
                        </span>
                      </div>

                      {/* Google-Compliant Affiliate Booking / Quote Link */}
                      <a
                        href={quoteUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Get a quote for ${planName} from ${providerName}`}
                      >
                        Get Quote &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Insurance Plans Pagination">
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