import React from 'react';
import ProductForm from '@/components/publishing/product';

export default function PublishProductPage() {
  return (
    <main style={styles.mainContainer}>
      <div style={styles.headerWrapper}>
        <h1 style={styles.pageTitle}>Publish Product Panel</h1>
        <p style={styles.pageSubtitle}>
          Create and manage your content dynamically across product and service collections.
        </p>
      </div>

      <ProductForm />
    </main>
  );
}

const styles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  headerWrapper: {
    maxWidth: '720px',
    margin: '0 auto 24px auto',
    textAlign: 'left',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: '0',
  },
};