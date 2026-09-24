'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchService from '@components/searchbars/searchservice';
import styles from './servicepage.module.css';

const CARDS_PER_PAGE = 20;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Set browser tab title dynamically targeting "find best services" SEO keywords
  useEffect(() => {
    document.title = 'Find Best Services & Top Professional Solutions | Verified Providers';
  }, []);

  // Fetch services from Firestore
  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function fetchServices() {
      try {
        const querySnapshot = await getDocs(collection(db, 'service'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setServices(data);
          setFilteredServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchService component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredServices(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search or filter changes
  }, []);

  // Pagination calculations using filtered results
  const totalPages = Math.ceil(filteredServices.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentServices = filteredServices.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engines (Schema.org ItemList + Service)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Find Best Professional Services & Local Solutions',
    description: 'Explore top-rated professional services, local providers, and expert solutions across all industries.',
    numberOfItems: filteredServices.length,
    itemListElement: currentServices.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'Service',
        name: item.title || item.name || 'Professional Service',
        provider: {
          '@type': 'Organization',
          name: item.provider || item.company || item.brand || 'Verified Provider',
        },
        description: item.details || item.description || '',
        image: item.image || 'https://via.placeholder.com/400x140?text=Service+Image',
        url: item.affiliatelink || item.link || item.url || '#',
        areaServed: Array.isArray(item.countries)
          ? item.countries.join(', ')
          : item.countries || item.country || item.location || 'Global',
      },
    })),
  };

  // Hydration safety check: wait until client mounts before evaluating dynamic layout trees
  if (!mounted || loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading best service providers...</p>
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
        <SearchService services={services} onFilterChange={handleFilterChange} />

        {/* H1 - Primary Keyword Heading for SEO */}
        <h1 className={styles.pageTitle}>Find Best Professional Services</h1>

        <p className={styles.pageSubtitle}>
          Connect with trusted experts, top-rated agencies, and verified service providers worldwide.
        </p>
      </header>

      {filteredServices.length === 0 ? (
        <p className={styles.noData}>
          No services matching your search criteria were found.
        </p>
      ) : (
        <>
          <section className={styles.grid} aria-label="Professional Services Directory">
            {currentServices.map((item) => {
              const providerName =
                item.provider || item.company || item.brand || item.title || 'Verified Provider';
              const serviceTitle =
                item.title || item.name || 'Professional Service';
              const serviceUrl =
                item.affiliatelink || item.link || item.url || '#';
              const refCode = item.id ? String(item.id).slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={
                        item.image ||
                        'https://via.placeholder.com/400x140?text=Service+Image'
                      }
                      alt={`${providerName} - ${serviceTitle}`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="400"
                      height="140"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>
                        {item.tag || item.category || 'BEST SERVICE'}
                      </span>

                      {/* H2 - Secondary Heading for Service Provider / Company */}
                      <h2 className={styles.prominentBrand}>{providerName}</h2>

                      <span className={styles.cardCode}>SVC-{refCode}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={styles.cardDivider} aria-hidden="true">
                    <div className={styles.notchLeft} />
                    <div className={styles.solidLine} />
                    <div className={styles.notchRight} />
                  </div>

                  {/* Bottom Section */}
                  <div className={styles.cardBottom}>
                    <div className={styles.detailsCol}>
                      {/* H3 - Tertiary Heading for Specific Service Title */}
                      <h3 className={styles.itemTitle}>{serviceTitle}</h3>
                      <div className={styles.detailsText}>
                        {item.details || item.description}
                      </div>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>
                          {item.countries || item.country || item.location
                            ? 'Available in:'
                            : 'Category:'}
                        </span>
                        <span className={styles.countriesList}>
                          {Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : Array.isArray(item.locations)
                            ? item.locations.join(', ')
                            : item.countries || item.country || item.location || item.category || 'Global'}
                        </span>
                      </div>

                      {/* Google-Compliant Service Referral Link */}
                      <a
                        href={serviceUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Book or Learn More about ${serviceTitle} from ${providerName}`}
                      >
                        View Service &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Services Directory Pagination">
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