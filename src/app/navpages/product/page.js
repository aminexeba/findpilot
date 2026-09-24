'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchProduct from '@components/searchbars/searchproduct';
import styles from './productpage.module.css';

const CARDS_PER_PAGE = 20;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Set browser tab title dynamically targeting "find best quality products" SEO keywords
  useEffect(() => {
    document.title = 'Find Best Quality Products & Top Deals | Verified Recommendations';
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'product'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle updates from SearchProduct component
  const handleFilterChange = useCallback(({ filteredResults }) => {
    setFilteredProducts(filteredResults);
    setCurrentPage(1); // Reset to first page whenever search/filter changes
  }, []);

  // Pagination calculations using filtered results
  const totalPages = Math.ceil(filteredProducts.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search Engines (Schema.org ItemList + Product)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Find Best Quality Products & Top Deals',
    description: 'Browse top-rated, high-quality products across popular categories with verified deals and discounts.',
    numberOfItems: filteredProducts.length,
    itemListElement: currentProducts.map((item, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      item: {
        '@type': 'Product',
        name: item.title || item.name || 'Premium Product',
        brand: {
          '@type': 'Brand',
          name: item.brand || item.company || item.manufacturer || 'Top Brand',
        },
        description: item.details || item.description || '',
        image: item.image || 'https://via.placeholder.com/400x140?text=Product+Image',
        url: item.affiliatelink || item.link || '#',
        offers: item.price
          ? {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: item.currency || 'USD',
              availability: 'https://schema.org/InStock',
            }
          : undefined,
      },
    })),
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loading} role="status">
          <p>Loading best quality products...</p>
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
        <SearchProduct products={products} onFilterChange={handleFilterChange} />

        {/* H1 - Primary Keyword Heading for SEO */}
        <h1 className={styles.pageTitle}>Find Best Quality Products</h1>

        <p className={styles.pageSubtitle}>
          Discover top-rated items, premium brands, and top deals. Compare features and find verified quality recommendations across all categories.
        </p>
      </header>

      {filteredProducts.length === 0 ? (
        <p className={styles.noData}>
          No products matching your search criteria were found.
        </p>
      ) : (
        <>
          <section className={styles.grid} aria-label="Best Quality Products Directory">
            {currentProducts.map((item) => {
              const brandName =
                item.brand || item.company || item.manufacturer || 'Top Brand';
              const productTitle =
                item.title || item.name || 'Premium Product';
              const productUrl =
                item.affiliatelink || item.link || '#';
              const refCode = item.id ? item.id.slice(0, 5).toUpperCase() : 'N/A';

              return (
                <article key={item.id} className={styles.affiliateCard}>
                  {/* Top Section */}
                  <div className={styles.cardTop}>
                    <img
                      src={
                        item.image ||
                        'https://via.placeholder.com/400x140?text=Product+Image'
                      }
                      alt={`${brandName} - ${productTitle}`}
                      className={styles.brandImage}
                      loading="lazy"
                      width="400"
                      height="140"
                    />
                    <div className={styles.cardHeaderMeta}>
                      <span className={styles.tag}>
                        {item.tag || item.category || 'BEST QUALITY'}
                      </span>

                      {/* H2 - Secondary Heading for Brand / Manufacturer */}
                      <h2 className={styles.prominentBrand}>{brandName}</h2>

                      <span className={styles.cardCode}>SKU-{refCode}</span>
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
                      {/* H3 - Tertiary Heading for Specific Product Name */}
                      <h3 className={styles.itemTitle}>{productTitle}</h3>
                      <p className={styles.detailsText}>
                        {item.details || item.description}
                      </p>
                    </div>

                    <div className={styles.actionCol}>
                      <div className={styles.countriesWrapper}>
                        <span className={styles.countriesLabel}>
                          {item.price
                            ? 'Price:'
                            : item.countries
                            ? 'Available in:'
                            : 'Category:'}
                        </span>
                        <span className={styles.countriesList}>
                          {item.price
                            ? `$${item.price}`
                            : Array.isArray(item.countries)
                            ? item.countries.join(', ')
                            : item.countries || item.category || 'Global'}
                        </span>
                      </div>

                      {/* Google-Compliant Affiliate Product Link */}
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={styles.ctaBtn}
                        title={`Buy ${productTitle} from ${brandName}`}
                      >
                        View Product &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Products Pagination">
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