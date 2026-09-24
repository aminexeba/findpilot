"use client";

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Stunning Payment & Plan Selection Form
 * Route/Collection Target: contact -> payment-[fullname]
 * File: components/forms/contact.js
 */

export default function ContactForm({ 
  title = "Select a plan enter your details", 
  badge = "Payment Invoice Request" 
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    email: '',
    phone: '',
    selectedPlan: 'starter', // Default option
    message: '',
    agreedToPayInvoice: false,
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: '',
  });

  // Calculate current word count for the message field
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(formData.message);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'message') {
      const words = countWords(value);
      // Enforce max 100 words restriction on input
      if (words > 100 && value.length > formData.message.length) {
        return; 
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: '' });

    try {
      if (wordCount > 100) {
        throw new Error("Message exceeds the maximum limit of 100 words.");
      }

      if (!formData.agreedToPayInvoice) {
        throw new Error("Please check the agreement box confirming payment upon receipt of invoice.");
      }

      // Generate clean document ID (e.g., "John Doe" -> "payment-john-doe")
      const clientSlug = formData.fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!clientSlug) {
        throw new Error("Please enter a valid full name.");
      }

      const docId = `payment-${clientSlug}`;
      const docRef = doc(db, 'contact', docId);

      // Publish directly to "contact" collection with doc ID "payment-[fullname]"
      await setDoc(docRef, {
        fullName: formData.fullName,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        selectedPlan: formData.selectedPlan,
        message: formData.message,
        wordCount: wordCount,
        agreedToPayInvoice: formData.agreedToPayInvoice,
        status: 'pending_invoice',
        createdAt: serverTimestamp(),
      });

      setStatus({ submitting: false, success: true, error: '' });

      // Reset form
      setFormData({
        fullName: '',
        country: '',
        email: '',
        phone: '',
        selectedPlan: 'starter',
        message: '',
        agreedToPayInvoice: false,
      });
    } catch (err) {
      console.error("Firestore payment submission error:", err);
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Failed to submit invoice request. Please try again.',
      });
    }
  };

  return (
    <div className="qp-form-wrapper">
      <style>{`
        /* Quora Core Design System */
        :root {
          --qp-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
          --qp-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .qp-form-wrapper {
          font-family: var(--qp-font);
          color: var(--qp-text-primary);
          width: 100%;
          max-width: 740px;
          margin: 0 auto;
          box-sizing: border-box;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .qp-form-card {
          background: var(--qp-card-bg);
          border: 1px solid var(--qp-border);
          border-radius: 12px;
          padding: 40px;
          box-shadow: var(--qp-shadow);
        }

        .qp-form-header {
          border-bottom: 1px solid var(--qp-border-light);
          padding-bottom: 20px;
          margin-bottom: 28px;
        }

        .qp-form-badge {
          display: inline-block;
          background: var(--qp-red);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .qp-form-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--qp-text-primary);
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
          text-transform: capitalize;
        }

        .qp-form-subtitle {
          font-size: 14.5px;
          color: var(--qp-text-secondary);
          margin: 0;
        }

        /* Form Structure */
        .qp-form-body {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .qp-form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .qp-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .qp-form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .qp-form-label {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--qp-text-primary);
        }

        .qp-word-counter {
          font-size: 12px;
          color: var(--qp-text-muted);
          font-weight: 600;
        }

        .qp-word-counter.warning {
          color: var(--qp-red);
        }

        .qp-form-input,
        .qp-form-select,
        .qp-form-textarea {
          width: 100%;
          font-family: var(--qp-font);
          font-size: 14px;
          color: var(--qp-text-primary);
          background: #ffffff;
          border: 1px solid var(--qp-border);
          border-radius: 8px;
          padding: 11px 14px;
          box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .qp-form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23282829%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 14px top 50%;
          background-size: 10px auto;
          padding-right: 36px;
          font-weight: 600;
        }

        .qp-form-input:focus,
        .qp-form-select:focus,
        .qp-form-textarea:focus {
          outline: none;
          border-color: var(--qp-blue);
          box-shadow: 0 0 0 3px rgba(46, 105, 255, 0.15);
        }

        .qp-form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* Invoice Agreement Checkbox Box */
        .qp-checkbox-box {
          background: var(--qp-callout-bg);
          border: 1px solid var(--qp-callout-border);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }

        .qp-checkbox-box:hover {
          border-color: var(--qp-blue);
        }

        .qp-checkbox-input {
          width: 19px;
          height: 19px;
          margin-top: 2px;
          accent-color: var(--qp-red);
          cursor: pointer;
          flex-shrink: 0;
        }

        .qp-checkbox-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--qp-text-primary);
          user-select: none;
          line-height: 1.4;
        }

        /* Submit Button */
        .qp-form-btn {
          background-color: var(--qp-red);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          padding: 14px 28px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
          box-shadow: 0 3px 6px rgba(185, 43, 39, 0.25);
          width: 100%;
        }

        .qp-form-btn:hover:not(:disabled) {
          background-color: var(--qp-red-hover);
          transform: translateY(-1px);
        }

        .qp-form-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Alert Feedback */
        .qp-alert-success {
          background: #eef9f2;
          border: 1px solid #c3ebd0;
          color: #1b7a3e;
          font-size: 14px;
          font-weight: 600;
          padding: 14px 18px;
          border-radius: 8px;
          margin-bottom: 22px;
        }

        .qp-alert-error {
          background: #fcebeb;
          border: 1px solid #f7c5c5;
          color: var(--qp-red);
          font-size: 14px;
          font-weight: 600;
          padding: 14px 18px;
          border-radius: 8px;
          margin-bottom: 22px;
        }

        @media (max-width: 640px) {
          .qp-form-card {
            padding: 24px;
          }
          .qp-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="qp-form-card">
        <header className="qp-form-header">
          <span className="qp-form-badge">{badge}</span>
          <h2 className="qp-form-title">{title}</h2>
          <p className="qp-form-subtitle">
            Fill out your contact info and choose a plan. You will receive an official payment invoice sent directly to your email.
          </p>
        </header>

        {status.success && (
          <div className="qp-alert-success">
            ✓ Your plan request has been submitted! An invoice will be sent to your email address shortly.
          </div>
        )}

        {status.error && (
          <div className="qp-alert-error">
            ✕ {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="qp-form-body">
          {/* Row 1: Full Name & Country */}
          <div className="qp-form-row">
            <div className="qp-form-field">
              <label className="qp-form-label" htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="qp-form-input"
              />
            </div>

            <div className="qp-form-field">
              <label className="qp-form-label" htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                required
                placeholder="e.g. United States, France"
                value={formData.country}
                onChange={handleChange}
                className="qp-form-input"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone Number */}
          <div className="qp-form-row">
            <div className="qp-form-field">
              <label className="qp-form-label" htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="qp-form-input"
              />
            </div>

            <div className="qp-form-field">
              <label className="qp-form-label" htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="qp-form-input"
              />
            </div>
          </div>

          {/* Row 3: Select Plan Dropdown */}
          <div className="qp-form-field">
            <label className="qp-form-label" htmlFor="selectedPlan">Select a Plan *</label>
            <select
              id="selectedPlan"
              name="selectedPlan"
              required
              value={formData.selectedPlan}
              onChange={handleChange}
              className="qp-form-select"
            >
              <option value="starter">Starter Plan ($20/mo - Marketplace listing + 2 blog posts)</option>
              <option value="pro">Pro Plan ($30/mo - Marketplace listing + 4 Google-ranked blog posts)</option>
              <option value="brokerage">Brokerage Plan ($100 fee + 3% per deal)</option>
            </select>
          </div>

          {/* Row 4: Message (Max 100 words) */}
          <div className="qp-form-field">
            <div className="qp-form-label-row">
              <label className="qp-form-label" htmlFor="message">Message *</label>
              <span className={`qp-word-counter ${wordCount >= 95 ? 'warning' : ''}`}>
                {wordCount} / 100 words max
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell us briefly about your brand or specific requirements (maximum 100 words)..."
              value={formData.message}
              onChange={handleChange}
              className="qp-form-textarea"
            />
          </div>

          {/* Row 5: Invoice Agreement Checkbox */}
          <label className="qp-checkbox-box">
            <input
              type="checkbox"
              name="agreedToPayInvoice"
              required
              checked={formData.agreedToPayInvoice}
              onChange={handleChange}
              className="qp-checkbox-input"
            />
            <span className="qp-checkbox-text">
              I will pay when I receive the invoice for the plan I chosen.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.submitting}
            className="qp-form-btn"
          >
            {status.submitting ? 'Submitting Invoice Request...' : 'Submit & Request Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}