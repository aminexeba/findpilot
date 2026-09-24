'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './searchjob.module.css';

export default function SearchJob({ jobs = [], listings = [], onFilterChange }) {
  const jobList = jobs.length > 0 ? jobs : listings;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // 1. Extract unique Categories from Firestore tag or category fields
  const categories = useMemo(() => {
    const categorySet = new Set();
    jobList.forEach((item) => {
      const cat = item?.tag || item?.category;
      if (cat) categorySet.add(String(cat).trim());
    });
    return ['All', ...Array.from(categorySet)];
  }, [jobList]);

  // 2. Extract unique Countries from Firestore countries array/string field
  const countries = useMemo(() => {
    const countrySet = new Set();
    jobList.forEach((item) => {
      if (Array.isArray(item?.countries)) {
        item.countries.forEach((c) => c && countrySet.add(String(c).trim()));
      } else if (item?.countries) {
        countrySet.add(String(item.countries).trim());
      }
    });
    return ['All', ...Array.from(countrySet)];
  }, [jobList]);

  // 3. Filter jobs based on title/brand, category/tag, and countries
  const filteredResults = useMemo(() => {
    return jobList.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const titleMatch = (item.title || '').toLowerCase().includes(term);
      const brandMatch = (item.brand || '').toLowerCase().includes(term);
      const matchesSearch = titleMatch || brandMatch;

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const itemTag = (item.tag || item.category || '').toString().trim().toLowerCase();
        matchesCategory = itemTag === selectedCategory.trim().toLowerCase();
      }

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
  }, [jobList, searchTerm, selectedCategory, selectedCountry]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pass active filters and search results back to parent
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
    <div className={styles.searchJobContainer} ref={containerRef}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          width="16"
          height="16"
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
          placeholder="Search..."
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
                  {(item.tag || item.category) && `• ${item.tag || item.category}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.divider}></div>

      {/* Category Dropdown */}
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

      <div className={styles.divider}></div>

      {/* Country Dropdown */}
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