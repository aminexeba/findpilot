"use client";

import React, { useState } from 'react';

/**
 * Quora-Styled Privacy & Commercial Disclosure Page
 * Route: http://localhost:3000/privacy
 * File: src/app/privacy/page.js
 */

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          max-width: 1040px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Sidebar Navigation */
        .qp-sidebar {
          position: sticky;
          top: 32px;
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 8px;
          padding: 16px 12px;
          box-shadow: var(--qp-shadow);
        }

        .qp-sidebar-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--qp-text-muted);
          margin-bottom: 12px;
          padding-left: 8px;
        }

        .qp-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .qp-nav-item {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 8px 12px;
          font-size: 13.5px;
          color: var(--qp-text-secondary);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-weight: 500;
        }

        .qp-nav-item:hover {
          background-color: var(--qp-border-light);
          color: var(--qp-text-primary);
        }

        .qp-nav-item.active {
          background-color: #fcebeb;
          color: var(--qp-red);
          font-weight: 600;
        }

        /* Main Content Card */
        .qp-content {
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 8px;
          padding: 40px;
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
          font-size: 30px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.4px;
        }

        .qp-meta {
          font-size: 13px;
          color: var(--qp-text-muted);
        }

        /* Typography & Sections */
        .qp-section {
          margin-bottom: 36px;
          scroll-margin-top: 40px;
        }

        .qp-section h2 {
          font-size: 19px;
          font-weight: 700;
          color: var(--qp-text-primary);
          margin: 0 0 12px 0;
          letter-spacing: -0.2px;
          border-bottom: 1px solid var(--qp-border-light);
          padding-bottom: 8px;
        }

        .qp-section p {
          font-size: 15px;
          color: var(--qp-text-primary);
          margin: 0 0 14px 0;
        }

        .qp-section ul {
          margin: 0 0 16px 0;
          padding-left: 20px;
        }

        .qp-section li {
          font-size: 14.5px;
          color: var(--qp-text-primary);
          margin-bottom: 6px;
        }

        /* Business Model Disclosure Callout Box */
        .qp-disclosure-box {
          background: var(--qp-callout-bg);
          border: 1px solid var(--qp-callout-border);
          border-left: 4px solid var(--qp-blue);
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }

        .qp-disclosure-box h3 {
          font-size: 15px;
          font-weight: 700;
          color: #1a41a8;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qp-disclosure-box p {
          font-size: 14px;
          color: #2c3e66;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .qp-disclosure-box p:last-child {
          margin-bottom: 0;
        }

        /* Footer Notes */
        .qp-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid var(--qp-border);
          font-size: 13px;
          color: var(--qp-text-muted);
        }

        .qp-link {
          color: var(--qp-blue);
          text-decoration: none;
        }

        .qp-link:hover {
          text-decoration: underline;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .qp-container {
            grid-template-columns: 1fr;
          }

          .qp-sidebar {
            display: none;
          }

          .qp-content {
            padding: 24px;
          }

          .qp-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="qp-container">
        {/* Left Sticky Navigation */}
        <aside className="qp-sidebar">
          <div className="qp-sidebar-title">Table of Contents</div>
          <nav className="qp-nav-list">
            <button
              className={`qp-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => scrollTo('overview')}
            >
              1. Overview & Purpose
            </button>
            <button
              className={`qp-nav-item ${activeSection === 'business-model' ? 'active' : ''}`}
              onClick={() => scrollTo('business-model')}
            >
              2. Brand & Affiliate Policy
            </button>
            <button
              className={`qp-nav-item ${activeSection === 'data-collection' ? 'active' : ''}`}
              onClick={() => scrollTo('data-collection')}
            >
              3. Data We Collect
            </button>
            <button
              className={`qp-nav-item ${activeSection === 'cookies' ? 'active' : ''}`}
              onClick={() => scrollTo('cookies')}
            >
              4. Cookies & Tracking
            </button>
            <button
              className={`qp-nav-item ${activeSection === 'third-parties' ? 'active' : ''}`}
              onClick={() => scrollTo('third-parties')}
            >
              5. Third-Party Merchants
            </button>
            <button
              className={`qp-nav-item ${activeSection === 'your-rights' ? 'active' : ''}`}
              onClick={() => scrollTo('your-rights')}
            >
              6. Your Rights & Contact
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="qp-content">
          <header className="qp-header">
            <span className="qp-badge">Legal Transparency</span>
            <h1 className="qp-title">Privacy Policy & Commercial Disclosure</h1>
            <div className="qp-meta">Last updated: September 2026 • 5 min read</div>
          </header>

          <section id="overview" className="qp-section">
            <h2>1. Overview & Purpose</h2>
            <p>
              Welcome to our platform. We operate a promotional review and comparison website dedicated to helping consumers find the best products, services, and digital tools on the market.
            </p>
            <p>
              This Privacy Policy details how we handle user data, how we work alongside commercial brands, and how our affiliate commission model operates to keep our content free for readers.
            </p>
          </section>

          <section id="business-model" className="qp-section">
            <h2>2. Commercial Model: Brand Promotion & Affiliate Earnings</h2>
            <p>
              We operate as a promotional review and comparison platform. To remain sustainable, we publish blogs, product evaluations, and comparison guides that generate qualified traffic for partner store and service pages.
            </p>

            <div className="qp-disclosure-box">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                Promotional & Affiliate Disclosure
              </h3>
              <p>
                <strong>Brand Representation:</strong> We showcase brand names, logos, product details, and trademarks to create comparative analysis articles. We leverage your brand equity to highlight your top features and present your products effectively to potential customers.
              </p>
              <p>
                <strong>Traffic & Blogging:</strong> We regularly publish editorial content and blogs designed to rank in search engines and increase targeted visitor traffic directly to your official store or service landing pages.
              </p>
              <p>
                <strong>Commission Disclosure:</strong> When readers click outbound partner links on our website and make a purchase or sign up for a service, we may earn an affiliate commission at zero additional cost to the user.
              </p>
            </div>
          </section>

          <section id="data-collection" className="qp-section">
            <h2>3. Data We Collect</h2>
            <p>We collect essential analytical data to optimize site performance and report traffic metrics to brand partners:</p>
            <ul>
              <li><strong>Usage Information:</strong> Device types, browser info, pages viewed, time spent on posts, and outbound partner links clicked.</li>
              <li><strong>Contact Submissions:</strong> Names and email addresses provided voluntarily via contact or newsletter forms.</li>
              <li><strong>Affiliate Parameters:</strong> Anonymized transaction tags to verify traffic sent to partner store pages.</li>
            </ul>
          </section>

          <section id="cookies" className="qp-section">
            <h2>4. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking tools to deliver a smooth user experience and verify affiliate referrals:
            </p>
            <ul>
              <li><strong>Technical Cookies:</strong> Required for site navigation, security, and page speed optimization.</li>
              <li><strong>Analytics Cookies:</strong> Help us monitor reader engagement across our blog posts.</li>
              <li><strong>Affiliate Tracking Cookies:</strong> Store short-lived session IDs when clicking to merchant stores to ensure proper commission attribution.</li>
            </ul>
          </section>

          <section id="third-parties" className="qp-section">
            <h2>5. Third-Party Merchants</h2>
            <p>
              Our articles contain links directing users to external store and service pages. Once you leave our domain, our privacy policy no longer applies. We encourage users to inspect the individual privacy policies of third-party merchants before making purchases.
            </p>
          </section>

          <section id="your-rights" className="qp-section">
            <h2>6. Your Rights & Contact Details</h2>
            <p>
              Under applicable data protection laws (including GDPR and CCPA), you reserve the right to request access to, updates for, or removal of any personal data stored with us.
            </p>
            <p>
              For brand representation inquiries, link updates, or privacy questions, reach out directly:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:megainspiring@outlook.com" className="qp-link">privacy@yourcompany.com</a>
            </p>
          </section>

          <footer className="qp-footer">
            <p>© {new Date().getFullYear()} Review & Comparison Media Group. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}