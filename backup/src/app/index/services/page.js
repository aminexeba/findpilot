import React from 'react';
import Link from 'next/link';

/**
 * Quora-Styled About Us Page
 * Route: http://localhost:3000/about
 * File: src/app/about/page.js
 */

export const metadata = {
  title: 'compare hotel, insurance, finance and more_ writing blog service | findpilot ',
  description:
    'Learn about FindPilot, a specialized agency connecting conscious consumers with exceptionally crafted products, unbiased reviews, buying guides, and supplier sourcing.',
  keywords: [
    'FindPilot',
    'About FindPilot',
    'product reviews',
    'buying guides',
    'product recommendations',
    'affiliate agency',
    'product sourcing',
    'quality curation'
  ],
  openGraph: {
    title: 'About Us | FindPilot',
    description:
      'Learn about FindPilot, a specialized agency connecting conscious consumers with exceptionally crafted products, buying guides, and reliable recommendations.',
    url: 'https://findpilot.cc/about',
    siteName: 'FindPilot',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | FindPilot',
    description:
      'Learn about FindPilot, a specialized agency connecting conscious consumers with exceptionally crafted products and trusted recommendations.'
  }
};

export default function AboutPage() {
  return (
    <div className="qp-page">
      <style>{`
        /* Quora Core Design System */
        :root {
          --qp-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
          --qp-bg: #f7f7f8;
          --qp-card-bg: #ffffff;
          --qp-text-primary: #282829;
          --qp-text-secondary: #636466;
          --qp-text-muted: #8e8f91;
          --qp-red: #b92b27;
          --qp-red-hover: #a1231f;
          --qp-blue: #2e69ff;
          --qp-blue-hover: #1a53e6;
          --qp-border: #e2e2e3;
          --qp-border-light: #f1f1f2;
          --qp-callout-bg: #f8faff;
          --qp-callout-border: #cbdcff;
          --qp-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .qp-page {
          background-color: var(--qp-bg);
          color: var(--qp-text-primary);
          font-family: var(--qp-font);
          min-height: 100vh;
          padding: 40px 20px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .qp-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Main Content Card */
        .qp-content {
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 8px;
          padding: 48px;
          box-shadow: var(--qp-shadow);
        }

        .qp-header {
          border-bottom: 1px solid var(--qp-border);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .qp-badge {
          display: inline-block;
          background: var(--qp-red);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .qp-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        }

        .qp-subtitle {
          font-size: 18px;
          color: var(--qp-text-secondary);
          margin: 0;
          font-weight: 400;
        }

        /* Editorial Content */
        .qp-section {
          margin-bottom: 36px;
        }

        .qp-section h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--qp-text-primary);
          margin: 0 0 14px 0;
          letter-spacing: -0.2px;
          border-bottom: 1px solid var(--qp-border-light);
          padding-bottom: 8px;
        }

        .qp-section p {
          font-size: 15.5px;
          color: var(--qp-text-primary);
          margin: 0 0 16px 0;
          line-height: 1.7;
        }

        /* Grid for Core Offerings */
        .qp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 24px 0 32px 0;
        }

        .qp-card {
          border: 1px solid var(--qp-border);
          border-radius: 6px;
          padding: 20px;
          background: #fafafa;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .qp-card:hover {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-color: var(--qp-blue);
        }

        .qp-card-icon {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .qp-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--qp-text-primary);
          margin-bottom: 6px;
        }

        .qp-card-desc {
          font-size: 13.5px;
          color: var(--qp-text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        /* Disclosure Box */
        .qp-disclosure {
          background: var(--qp-callout-bg);
          border: 1px solid var(--qp-callout-border);
          border-left: 4px solid var(--qp-blue);
          border-radius: 6px;
          padding: 20px;
          margin: 28px 0;
        }

        .qp-disclosure h3 {
          font-size: 15px;
          font-weight: 700;
          color: #1a41a8;
          margin: 0 0 6px 0;
        }

        .qp-disclosure p {
          font-size: 14px;
          color: #2c3e66;
          margin: 0;
          line-height: 1.5;
        }

        /* Bottom Call to Action Section */
        .qp-cta-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--qp-border);
          text-align: center;
          background: #fbfbfc;
          border-radius: 8px;
          padding: 36px 24px;
          border: 1px solid var(--qp-border);
        }

        .qp-cta-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 8px 0;
        }

        .qp-cta-subtitle {
          font-size: 14.5px;
          color: var(--qp-text-secondary);
          margin: 0 0 24px 0;
        }

        .qp-btn {
          display: inline-block;
          background-color: var(--qp-red);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 0.15s ease, transform 0.1s ease;
          box-shadow: 0 2px 4px rgba(185, 43, 39, 0.2);
        }

        .qp-btn:hover {
          background-color: var(--qp-red-hover);
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .qp-content {
            padding: 24px;
          }

          .qp-grid {
            grid-template-columns: 1fr;
          }

          .qp-title {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="qp-container">
        <main className="qp-content">
          <header className="qp-header">
            <span className="qp-badge">About Our Agency</span>
            <h1 className="qp-title">Curating Quality for Everyday Life</h1>
            <p className="qp-subtitle">
              We connect conscious consumers with exceptionally crafted products and services.
            </p>
          </header>

          <section className="qp-section">
            <h2>Our Mission</h2>
            <p>
              We are a specialized affiliate marketing agency dedicated to identifying and promoting highly crafted products and services. We believe that great design, superior quality, and fair pricing should go hand in hand.
            </p>
            <p>
              Our goal is simple: to help people elevate their daily lives by discovering tools, services, and goods that offer genuine value and reliable performance.
            </p>
          </section>

          <section className="qp-section">
            <h2>What We Publish</h2>
            <div className="qp-grid">
              <div className="qp-card">
                <div className="qp-card-icon">🔍</div>
                <div className="qp-card-title">Product Reviews</div>
                <p className="qp-card-desc">
                  In-depth, unbiased evaluations testing real-world performance, durability, and craftsmanship.
                </p>
              </div>

              <div className="qp-card">
                <div className="qp-card-icon">📚</div>
                <div className="qp-card-title">Buying Guides</div>
                <p className="qp-card-desc">
                  Comprehensive comparisons designed to simplify complex choices and save you time and money.
                </p>
              </div>

              <div className="qp-card">
                <div className="qp-card-icon">⭐</div>
                <div className="qp-card-title">Recommendations</div>
                <p className="qp-card-desc">
                  Hand-picked selections that hit the sweet spot between exceptional quality and reasonable price.
                </p>
              </div>
            </div>
          </section>

          <section className="qp-section">
            <h2>Monetization & Transparency</h2>
            <div className="qp-disclosure">
              <h3>Affiliate Commission Disclosure</h3>
              <p>
                We earn commissions through our referral links on product reviews, buying guides, and recommendations. When you purchase through our links, we may receive compensation from the merchant at zero extra cost to you. This model supports our independent research and allows us to keep publishing high-quality editorial content.
              </p>
            </div>
          </section>

          <div className="qp-cta-section">
            <h3 className="qp-cta-title">Want to Feature Your Brand?</h3>
            <p className="qp-cta-subtitle">
              Partner with us to feature your high-quality products in our next review or buyer guide.
            </p>
            <Link href="/index/pricing" className="qp-btn">
              View Pricing Options
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}