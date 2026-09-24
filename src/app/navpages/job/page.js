'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchJob from '@components/searchbars/searchjob';
import styles from './jobpage.module.css';

const CARDS_PER_PAGE = 20;

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Set browser tab title dynamically targeting high-paying job SEO keywords
  useEffect(() => {
    document.title = 'Find High-Paying Jobs & Lucrative Careers | Top Salary Openings';
  }, []);

  // Fetch jobs from Firestore
  useEffect(() => {
    let isMounted = true;

    async function fetchJobs() {
      try {
        const querySnapshot = await getDocs(collection(db, 'job'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setJobs(data);
          setFilteredJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchJob component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredJobs(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search/filter changes
  }, []);

  // Pagination calculations using filtered results
  const totalPages = Math.ceil(filteredJobs.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engines (Schema.org ItemList + JobPosting)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Find High-Paying Jobs & Lucrative Careers',
    description: 'Explore top high-paying job opportunities, executive positions, high-salary tech roles, and remote careers.',
    numberOfItems: filteredJobs.length,
    itemListElement: currentJobs.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'JobPosting',
        title: item.title || item.jobTitle || 'High-Paying Role',
        hiringOrganization: {
          '@type': 'Organization',
          name: item.brand || item.company || item.employer || 'Top Employer',
        },
        description: item.details || item.description || '',
        image: item.image || 'https://via.placeholder.com/400x140?text=Job+Opportunity',
        url: item.affiliatelink || item.link || item.applyUrl || '#',
        jobLocation: {
          '@type': 'Place',
          address: Array.isArray(item.countries)
            ? item.countries.join(', ')
            : item.countries || item.location || 'Remote / Global',
        },
      },
    })),
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading high-paying job listings...</p>
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
        <SearchJob jobs={jobs} onFilterChange={handleFilterChange} />

        {/* H1 - Primary Keyword Heading for SEO */}
        <h1 className={styles.pageTitle}>Find High-Paying Jobs & Lucrative Careers</h1>

        <p className={styles.pageSubtitle}>
          Discover top-tier high-paying career opportunities, executive openings, and high-salary remote positions worldwide.
        </p>
      </header>

      {filteredJobs.length === 0 ? (
        <p className={styles.noData}>
          No high-paying jobs matching your search criteria were found.
        </p>
      ) : (
        <>
          <section className={styles.grid} aria-label="High Paying Jobs Directory">
            {currentJobs.map((item) => {
              const companyName =
                item.brand || item.company || item.employer || 'Top Employer';
              const jobTitle =
                item.title || item.jobTitle || 'High-Paying Role';
              const applyUrl =
                item.affiliatelink || item.link || item.applyUrl || '#';
              const refCode = item.id ? item.id.slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={
                        item.image ||
                        'https://via.placeholder.com/400x140?text=Job+Opportunity'
                      }
                      alt={`${companyName} - ${jobTitle}`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="400"
                      height="140"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>
                        {item.tag || item.salaryTag || 'HIGH SALARY'}
                      </span>

                      {/* H2 - Secondary Heading for Company / Employer Name */}
                      <h2 className={styles.prominentBrand}>{companyName}</h2>

                      <span className={styles.cardCode}>JOB-{refCode}</span>
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
                      {/* H3 - Tertiary Heading for Specific Job Title */}
                      <h3 className={styles.itemTitle}>{jobTitle}</h3>
                      <p className={styles.detailsText}>
                        {item.details || item.description}
                      </p>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>
                          {item.salary || item.price
                            ? 'Est. Compensation:'
                            : item.countries
                            ? 'Available in:'
                            : 'Category:'}
                        </span>
                        <span className={styles.countriesList}>
                          {item.salary || item.price
                            ? item.salary || `$${item.price}/yr`
                            : Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : item.countries || item.category || 'Global / Remote'}
                        </span>
                      </div>

                      {/* Google-Compliant Job Application Affiliate Link */}
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Apply for ${jobTitle} at ${companyName}`}
                      >
                        Apply Now &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Job Listings Pagination">
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