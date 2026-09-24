'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './searchblog.module.css';

export default function SearchBlog({ blogs = [], onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // 1. Extract unique available tags (singular blog.tag) for the dropdown options
  const allTopics = [
    'All',
    ...new Set(
      blogs
        .map((blog) => (blog.tag ? String(blog.tag).trim() : null))
        .filter(Boolean)
    ),
  ];

  // 2. Filter blogs by search term (title) and selected tag
  const filteredSuggestions = blogs.filter((blog) => {
    const matchesTitle = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTopic = true;
    if (selectedTopic !== 'All') {
      const blogTag = blog.tag ? String(blog.tag).trim().toLowerCase() : '';
      matchesTopic = blogTag === selectedTopic.trim().toLowerCase();
    }

    return matchesTitle && matchesTopic;
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pass filter states and results back to the parent component for preview rendering
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        search: searchTerm,
        topic: selectedTopic,
        filteredResults: filteredSuggestions,
      });
    }
  }, [searchTerm, selectedTopic, blogs]);

  // Handle clicking a dropdown suggestion
  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    setIsFocused(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchWrapper}>
        {/* Search Icon */}
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
          placeholder="Search product & service blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {isFocused && searchTerm.trim() !== '' && filteredSuggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredSuggestions.map((blog) => (
              <li
                key={blog.slug || blog.id}
                className={styles.suggestionItem}
                onClick={() => handleSelectSuggestion(blog.title)}
              >
                {blog.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        className={styles.topicSelect}
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option value="All">All Topics</option>
        {allTopics
          .filter((topic) => topic !== 'All')
          .map((topic, index) => (
            <option key={index} value={topic}>
              {topic}
            </option>
          ))}
      </select>
    </div>
  );
}