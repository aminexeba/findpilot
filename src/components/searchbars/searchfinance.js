'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './searchfinance.module.css';

export default function SearchFinance({ listings = [], onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // 1. Extract unique Categories from Firestore `tag` field
  const categories = useMemo(() => {
    const categorySet = new Set();
    listings.forEach((item) => {
      if (item?.tag) {
        categorySet.add(String(item.tag).trim());
      }
    });
    return ['All', ...Array.from(categorySet)];
  }, [listings]);

  // 2. Extract unique Countries from Firestore `countries` array/string field
  const countries = useMemo(() => {
    const countrySet = new Set();
    listings.forEach((item) => {
      if (Array.isArray(item?.countries)) {
        item.countries.forEach((c) => c && countrySet.add(String(c).trim()));
      } else if (item?.countries) {
        countrySet.add(String(item.countries).trim());
      }
    });
    return ['All', ...Array.from(countrySet)];
  }, [listings]);

  // 3. Filter listings based on title/brand, tag (category), and countries
  const filteredResults = useMemo(() => {
    return listings.filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase().trim());
      const brandMatch = (item.brand || '').toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesSearch = titleMatch || brandMatch;

      // Filter by `tag` (Category)
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const itemTag = item.tag ? String(item.tag).trim().toLowerCase() : '';
        matchesCategory = itemTag === selectedCategory.trim().toLowerCase();
      }

      // Filter by `countries`
      let matchesCountry = true;
      if (selectedCountry !== 'All') {
        if (Array.isArray(item.countries)) {
          matchesCountry = item.countries.some(
            (c) => String(c).trim().toLowerCase() === selectedCountry.trim().toLowerCase()
          );
        } else {
          const itemCountry = item.countries ? String(item.countries).trim().toLowerCase() : '';
          matchesCountry = itemCountry === selectedCountry.trim().toLowerCase();
        }
      }

      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [listings, searchTerm, selectedCategory, selectedCountry]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pass active filters and search results back to FinancePage
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        search: searchTerm,
        category: selectedCategory,
        country: selectedCountry,
        filteredResults,
      });
    }
  }, [searchTerm, selectedCategory, selectedCountry, filteredResults, onFilterChange]);

  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    setIsFocused(false);
  };

  return (
    <div className={styles.searchFinanceContainer} ref={containerRef}>
      {/* 1. Search Bar Input (LEFT SIDE) */}
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by title or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {/* Suggestions Dropdown */}
        {isFocused && searchTerm.trim() !== '' && filteredResults.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredResults.map((item) => (
              <li
                key={item.id || item.slug}
                className={styles.suggestionItem}
                onClick={() => handleSelectSuggestion(item.title || item.brand)}
              >
                <span className={styles.suggestionTitle}>{item.title}</span>
                <span className={styles.suggestionMeta}>
                  {item.brand && `${item.brand} `}
                  {item.tag && `• ${item.tag}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. Category Dropdown (MIDDLE - maps to `tag`) */}
      <div className={styles.selectWrapper}>
        <select
          className={styles.selectInput}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by Category"
        >
          <option value="All">All Categories</option>
          {categories
            .filter((cat) => cat !== 'All')
            .map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

      {/* 3. Country Dropdown (RIGHT - maps to `countries`) */}
      <div className={styles.selectWrapper}>
        <select
          className={styles.selectInput}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          aria-label="Filter by Country"
        >
          <option value="All">All Countries</option>
          {countries
            .filter((country) => country !== 'All')
            .map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}