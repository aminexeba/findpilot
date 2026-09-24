"use client";

import React from 'react';

/**
 * Quora-Styled Pricing Page for megainspiring
 * Route: http://localhost:3000/pricing
 * File: src/app/pricing/page.js
 */

export default function PricingPage() {
  const CONTACT_FORM_URL = "/site/contact";

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
          --qp-shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .qp-page {
          background-color: var(--qp-bg);
          color: var(--qp-text-primary);
          font-family: var(--qp-font);
          min-height: 100vh;
          padding: 48px 20px 80px 20px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .qp-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        /* Header Section */
        .qp-header-box {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 36px auto;
        }

        .qp-brand-badge {
          display: inline-block;
          background: var(--qp-red);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .qp-title {
          font-size: 34px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 12px 0;
          letter-spacing: -0.6px;
          line-height: 1.25;
        }

        .qp-subtitle {
          font-size: 17px;
          color: var(--qp-text-secondary);
          margin: 0 0 20px 0;
          font-weight: 400;
        }

        .qp-savings-banner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef9f2;
          border: 1px solid #c3ebd0;
          color: #1b7a3e;
          font-size: 13.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
        }

        /* Process Steps / Demarche Callout Box */
        .qp-process-box {
          background: var(--qp-callout-bg);
          border: 1px solid var(--qp-callout-border);
          border-radius: 10px;
          padding: 20px 24px;
          max-width: 820px;
          margin: 0 auto 48px auto;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .qp-process-icon {
          background: var(--qp-blue);
          color: #ffffff;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 800;
          font-size: 18px;
        }

        .qp-process-text {
          font-size: 14.5px;
          color: var(--qp-text-primary);
          line-height: 1.5;
        }

        .qp-process-text strong {
          color: var(--qp-blue);
        }

        /* Pricing Grid - 3 Columns */
        .qp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
          margin-bottom: 56px;
        }

        /* Card Styles */
        .qp-card {
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 10px;
          padding: 32px 26px;
          box-shadow: var(--qp-shadow);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .qp-card:hover {
          box-shadow: var(--qp-shadow-hover);
        }

        .qp-card.featured {
          border: 2px solid var(--qp-red);
        }

        .qp-pop-tag {
          position: absolute;
          top: -12px;
          right: 28px;
          background: var(--qp-red);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 3px 10px;
          border-radius: 12px;
        }

        .qp-plan-name {
          font-size: 22px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 6px 0;
        }

        .qp-plan-desc {
          font-size: 14px;
          color: var(--qp-text-secondary);
          margin: 0 0 24px 0;
          min-height: 48px;
        }

        /* Pricing Display */
        .qp-price-box {
          border-bottom: 1px solid var(--qp-border-light);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }

        .qp-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .qp-amount {
          font-size: 42px;
          font-weight: 800;
          color: var(--qp-text-primary);
          letter-spacing: -1px;
        }

        .qp-period {
          font-size: 15px;
          color: var(--qp-text-muted);
          font-weight: 500;
        }

        .qp-discount-badge {
          display: inline-block;
          margin-top: 8px;
          background: #fcebeb;
          color: var(--qp-red);
          font-size: 12px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        /* Features List */
        .qp-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          flex-grow: 1;
        }

        .qp-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: var(--qp-text-primary);
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .qp-check-icon {
          color: var(--qp-blue);
          font-weight: 800;
          font-size: 16px;
          line-height: 1;
          margin-top: 3px;
          flex-shrink: 0;
        }

        /* CTA Buttons */
        .qp-btn {
          display: block;
          width: 100%;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          padding: 13px 20px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.15s ease;
          box-sizing: border-box;
          cursor: pointer;
        }

        .qp-btn-primary {
          background-color: var(--qp-red);
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(185, 43, 39, 0.2);
        }

        .qp-btn-primary:hover {
          background-color: var(--qp-red-hover);
          transform: translateY(-1px);
        }

        .qp-btn-secondary {
          background-color: #ffffff;
          color: var(--qp-text-primary);
          border: 1px solid var(--qp-border);
        }

        .qp-btn-secondary:hover {
          background-color: var(--qp-border-light);
          border-color: var(--qp-text-muted);
        }

        /* Quora-Style Editorial FAQ Section */
        .qp-faq-section {
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 10px;
          padding: 40px;
          box-shadow: var(--qp-shadow);
        }

        .qp-faq-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 24px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--qp-border-light);
        }

        .qp-faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }

        .qp-faq-item h4 {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--qp-text-primary);
          margin: 0 0 6px 0;
        }

        .qp-faq-item p {
          font-size: 14px;
          color: var(--qp-text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .qp-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .qp-faq-grid {
            grid-template-columns: 1fr;
          }

          .qp-process-box {
            flex-direction: column;
            text-align: center;
          }

          .qp-card {
            padding: 28px 20px;
          }

          .qp-title {
            font-size: 26px;
          }

          .qp-faq-section {
            padding: 24px;
          }
        }
      `}</style>

      <div className="qp-container">
        {/* Page Header */}
        <header className="qp-header-box">
          <span className="qp-brand-badge">getting platform you're welcome </span>
          <h1 className="qp-title">Simple, Transparent Growth Plans</h1>
          <p className="qp-subtitle">
            We write, optimize, and rank targeted content to drive consistent traffic, or connect you directly with vetted product suppliers.
          </p>
          <div className="qp-savings-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Annual Billing Discount Applied Automatically
          </div>
        </header>

        {/* Process Steps / Démarche Explanation */}
        <div className="qp-process-box">
          <div className="qp-process-icon">i</div>
          <div className="qp-process-text">
            <strong>How Subscriptions & Invoicing Work:</strong> Select your plan below and fill out the contact form at <code>/index/contact</code>. Once submitted, a detailed payment invoice will be sent directly to your email address allowing you to pay securely by credit card.
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="qp-grid">
          {/* Plan 1: Starter Plan */}
          <div className="qp-card">
            <h2 className="qp-plan-name">Starter Plan</h2>
            <p className="qp-plan-desc">
              List your brand in our marketplace and get 2 dedicated blog posts published to kickstart your content visibility.
            </p>

            <div className="qp-price-box">
              <div className="qp-price-row">
                <span className="qp-amount">$20</span>
                <span className="qp-period">/ month</span>
              </div>
              <div className="qp-discount-badge">Billed Annually ($40 Off)</div>
            </div>

            <ul className="qp-features">
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Marketplace Brand Listing:</strong> Direct listing of your brand in our curated marketplace.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>2 Blog Posts:</strong> Fresh, SEO-optimized blog posts written and published to feature your product or service.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Direct Link Attribution:</strong> Strategic links placed inside content to direct traffic to your store or service page.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Traffic & Keyword Reports:</strong> Regular tracking on keyword visibility and visitor growth.</span>
              </li>
            </ul>

            <a
              href={CONTACT_FORM_URL}
              className="qp-btn qp-btn-secondary"
            >
              Fill out form
            </a>
          </div>

          {/* Plan 2: Pro Plan (Featured) */}
          <div className="qp-card featured">
            <span className="qp-pop-tag">Most Popular</span>
            <h2 className="qp-plan-name">Pro Plan</h2>
            <p className="qp-plan-desc">
              Marketplace listing combined with 4 Google-ranked blog posts engineered specifically to rank and drive high-intent buyer traffic.
            </p>

            <div className="qp-price-box">
              <div className="qp-price-row">
                <span className="qp-amount">$30</span>
                <span className="qp-period">/ month</span>
              </div>
              <div className="qp-discount-badge">Billed Annually ($60 Off)</div>
            </div>

            <ul className="qp-features">
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Marketplace Brand Listing:</strong> Premium, featured placement for your brand in our marketplace.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>4 Google-Ranked Blog Posts:</strong> Content published and targeted to rank high on Google search results.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Traffic Growth Engine:</strong> Specifically structured to drive organic search visitors directly to your brand.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Priority Keyword Targeting:</strong> Fast-track focus for competitive, high-intent buyer keywords.</span>
              </li>
            </ul>

            <a
              href={CONTACT_FORM_URL}
              className="qp-btn qp-btn-primary"
            >
              Fill out form 
            </a>
          </div>

          {/* Plan 3: Brokerage Plan */}
          <div className="qp-card">
            <h2 className="qp-plan-name">Brokerage Plan</h2>
            <p className="qp-plan-desc">
              Tailored product & service sourcing for businesses needing specific items, precise specs, and reliable suppliers.
            </p>

            <div className="qp-price-box">
              <div className="qp-price-row">
                <span className="qp-amount">$100</span>
                <span className="qp-period">+ 3% / deal</span>
              </div>
              <div className="qp-discount-badge">$100 Sourcing Fee + 3% Commission</div>
            </div>

            <ul className="qp-features">
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>$100 Sourcing Fee:</strong> Upfront service and initial specs verification fee.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Custom Specification Matching:</strong> Submit your exact product details, technical specs, and target pricing.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>Pre-Vetted Supplier Access:</strong> We connect you directly with verified suppliers tailored to your industry.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>3% Sourcing Fee:</strong> Transparent 3% commission on fulfilled sourcing deals or product orders.</span>
              </li>
              <li className="qp-feature-item">
                <span className="qp-check-icon">✓</span>
                <span><strong>End-to-End Deal Negotiation:</strong> Full support through sample verification, price negotiation, and closing terms.</span>
              </li>
            </ul>

            <a
              href={CONTACT_FORM_URL}
              className="qp-btn qp-btn-secondary"
            >
              Fill out form 
            </a>
          </div>
        </div>

        {/* Quora Style Editorial FAQ */}
        <section className="qp-faq-section">
          <h3 className="qp-faq-title">Frequently Asked Questions</h3>
          <div className="qp-faq-grid">
            <div className="qp-faq-item">
              <h4>How do I pay after filling out the form?</h4>
              <p>
                When you fill out the form at contact page, our team generates a payment invoice for your selected plan and sends it directly to your email address. You can complete your payment easily and securely via credit card right from the email link.
              </p>
            </div>
            <div className="qp-faq-item">
              <h4>How does tigi get us traffic?</h4>
              <p>
                We conduct targeted keyword research and write high-intent content optimized specifically for Google search algorithms. With our Pro Plan, we publish 4 blog posts designed to rank and direct active buyers directly to your business.
              </p>
            </div>
            <div className="qp-faq-item">
              <h4>How does the Brokerage Plan fee work?</h4>
              <p>
                The Brokerage Plan includes a <strong>$100 upfront sourcing fee</strong> to initiate supplier matching and specifications review, plus a <strong>3% commission fee</strong> based on the total transaction value upon successful deal fulfillment.
              </p>
            </div>
            <div className="qp-faq-item">
              <h4>How does the annual discount work?</h4>
              <p>
                Both subscription plans are billed annually. The Starter Plan saves you <strong>$40</strong> off the standard monthly rate, and the Pro Plan saves you <strong>$60</strong> per year.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}