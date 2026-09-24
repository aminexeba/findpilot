'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './searchservice.module.css';

export default function SearchService({ services = [], listings = [], onFilterChange }) {
  // Accepts services or listings for flexibility
  const serviceList = services.length > 0 ? services : listings;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // 1. Extract unique Categories from `category`, `tag`, or `serviceType` fields
  const categories = useMemo(() => {
    const categorySet = new Set();
    serviceList.forEach((item) => {
      const cat = item?.category || item?.tag || item?.serviceType;
      if (cat) categorySet.add(String(cat).trim());
    });
    return ['All', ...Array.from(categorySet)];
  }, [serviceList]);

  // 2. Extract unique Countries/Locations from `countries`, `country`, or `location`
  const countries = useMemo(() => {
    const countrySet = new Set();
    serviceList.forEach((item) => {
      const rawCountries = item?.countries || item?.country || item?.locations || item?.location;
      if (Array.isArray(rawCountries)) {
        rawCountries.forEach((c) => c && countrySet.add(String(c).trim()));
      } else if (rawCountries) {
        countrySet.add(String(rawCountries).trim());
      }
    });
    return ['All', ...Array.from(countrySet)];
  }, [serviceList]);

  // 3. Filter services based on title/provider/brand, category, and location/country
  const filteredResults = useMemo(() => {
    return serviceList.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const titleMatch = (item.title || item.name || '').toLowerCase().includes(term);
      const providerMatch = (item.provider || item.company || item.brand || '').toLowerCase().includes(term);
      const descMatch = (item.description || item.details || '').toLowerCase().includes(term);
      const matchesSearch = titleMatch || providerMatch || descMatch;

      // Category matching
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const itemCategory = (item.category || item.tag || item.serviceType || '')
          .toString()
          .trim()
          .toLowerCase();
        matchesCategory = itemCategory === selectedCategory.trim().toLowerCase();
      }

      // Country matching
      let matchesCountry = true;
      if (selectedCountry !== 'All') {
        const rawCountries = item.countries || item.country || item.locations || item.location;
        if (Array.isArray(rawCountries)) {
          matchesCountry = rawCountries.some(
            (c) => String(c).trim().toLowerCase() === selectedCountry.trim().toLowerCase()
          );
        } else {
          const itemCountry = rawCountries ? String(rawCountries).trim().toLowerCase() : '';
          matchesCountry = itemCountry === selectedCountry.trim().toLowerCase();
        }
      }

      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [serviceList, searchTerm, selectedCategory, selectedCountry]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pass filter state back to parent
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
    <div className={styles.searchServiceContainer} ref={containerRef}>
      {/* Search Input Box */}
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
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {/* Dynamic Suggestions Overlay */}
        {isFocused && searchTerm.trim() !== '' && filteredResults.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredResults.map((item) => (
              <li
                key={item.id || item.slug}
                className={styles.suggestionItem}
                onClick={() =>
                  handleSelectSuggestion(item.title || item.name || item.provider)
                }
              >
                <span className={styles.suggestionTitle}>
                  {item.title || item.name}
                </span>
                <span className={styles.suggestionMeta}>
                  {(item.provider || item.company) && `${item.provider || item.company} `}
                  {(item.category || item.tag) && `• ${item.category || item.tag}`}
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