'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './blogpage.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SearchBlog from '@components/searchbars/searchblog';

export default function BlogMotherPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 30; // 30 cards limit per page

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const productSnap = await getDocs(collection(db, "blog-product"));
        const serviceSnap = await getDocs(collection(db, "blog-service"));

        const productBlogs = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || doc.id,
          tag: doc.data().tag || '',
        }));

        const serviceBlogs = serviceSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || doc.id,
          tag: doc.data().tag || '',
        }));

        const combined = [...productBlogs, ...serviceBlogs];
        setBlogs(combined);
        setFilteredBlogs(combined);
      } catch (error) {
        console.error("Error fetching Firestore blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const handleFilterChange = ({ filteredResults }) => {
    setFilteredBlogs(filteredResults);
    setCurrentPage(1); // Reset to page 1 when user searches/filters
  };

  // --- Pagination Logic ---
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  // Get the blogs meant for the current page
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <main className={styles.blogPageContainer}>
        <p style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>Loading blogs...</p>
      </main>
    );
  }

  return (
    <main className={styles.blogPageContainer}>
      <div className={styles.searchBarWrapper}>
        <SearchBlog blogs={blogs} onFilterChange={handleFilterChange} />
      </div>

      <div className={styles.blogsGrid}>
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogExtractCard}>
              <img 
                src={blog.imageHero || 'https://via.placeholder.com/350x280'} 
                alt={blog.title} 
                className={styles.imageHero} 
              />
              <div className={styles.blogTitleContainer}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
              </div>
              <div className={styles.blogBtnContainer}>
                <Link 
                  href={`/navpages/article/${blog.slug || blog.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.readMoreBtn}
                >
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ffffff', padding: '40px 0' }}>
            No blog posts found matching your criteria.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className={styles.pageBtn}
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ''}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}