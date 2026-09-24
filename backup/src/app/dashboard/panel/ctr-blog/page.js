"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust your firebase import path as needed
import styles from './blogctr.module.css';

export default function CtrBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Input States for Search & Filter
  const [inputTitle, setInputTitle] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Applied Search States
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // Pagination States (30 cards per page)
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 30;

  // Deletion Modal States
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Saving Ads State
  const [savingAdId, setSavingAdId] = useState(null);

  // Helper function to extract the single ad object from fetched ads data
  const getSingleAd = (adsData) => {
    if (Array.isArray(adsData) && adsData.length > 0) {
      return adsData[0];
    }
    if (adsData && typeof adsData === "object" && !Array.isArray(adsData)) {
      return adsData; // handle case if object was saved previously
    }
    return null;
  };

  // Fetch blogs from Firestore collections
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setLoading(true);

        const [productSnapshot, serviceSnapshot] = await Promise.all([
          getDocs(collection(db, "blog-product")),
          getDocs(collection(db, "blog-service")),
        ]);

        const productBlogs = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          ads: doc.data().ads || [],
          category: "product",
        }));

        const serviceBlogs = serviceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          ads: doc.data().ads || [],
          category: "service",
        }));

        setBlogs([...productBlogs, ...serviceBlogs]);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  // Execute Search Action
  const handleSearchAction = (e) => {
    e.preventDefault();
    setSearchTitle(inputTitle);
    setSearchTag(inputTag);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Delete Blog Document
  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setIsDeleting(true);
      const collectionName = blogToDelete.category === "product" ? "blog-product" : "blog-service";
      
      await deleteDoc(doc(db, collectionName, blogToDelete.id));
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blogToDelete.id));
      setBlogToDelete(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete the blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 1. EDIT EXISTING AD FIELD LOCALLY
  const handleAdFieldChange = (blogId, field, value) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => {
        if (blog.id !== blogId) return blog;

        const currentAd = getSingleAd(blog.ads) || { adsTitle: "", adsLink: "", btnName: "" };
        const updatedAd = { ...currentAd, [field]: value };

        return { ...blog, ads: [updatedAd] };
      })
    );
  };

  // 2. CREATE A NEW AD IF NONE EXISTS
  const handleCreateAd = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => {
        if (blog.id !== blogId) return blog;
        return {
          ...blog,
          ads: [{ adsTitle: "", adsLink: "", btnName: "" }],
        };
      })
    );
  };

  // 3. REMOVE AD (SET TO EMPTY)
  const handleClearAd = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => {
        if (blog.id !== blogId) return blog;
        return { ...blog, ads: [] };
      })
    );
  };

  // 4. SAVE EDITED AD TO FIRESTORE
  const handleSaveAd = async (blog) => {
    try {
      setSavingAdId(blog.id);
      const collectionName = blog.category === "product" ? "blog-product" : "blog-service";
      const blogRef = doc(db, collectionName, blog.id);

      const adToSave = getSingleAd(blog.ads);
      const updatedAdsArray = adToSave ? [{
        adsTitle: adToSave.adsTitle || "",
        adsLink: adToSave.adsLink || "",
        btnName: adToSave.btnName || "",
      }] : [];

      await updateDoc(blogRef, {
        ads: updatedAdsArray,
      });

      alert("Ad details updated successfully in Firestore!");
    } catch (err) {
      console.error("Error saving ad details:", err);
      alert("Failed to save ad details. Please try again.");
    } finally {
      setSavingAdId(null);
    }
  };

  // Filter Logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesTitle = blog.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());
    
    const matchesTag = searchTag
      ? blog.tag?.toLowerCase().includes(searchTag.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;

    return matchesTitle && matchesTag && matchesCategory;
  });

  // Pagination (30 cards per page)
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  if (loading) return <div className={styles.loader}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Blog Control Dashboard</h2>
      </div>

      {/* Control Panel */}
      <form onSubmit={handleSearchAction} className={styles.controlsWrapper}>
        <div className={styles.topLeftActionRow}>
          <button type="submit" className={styles.searchActionBtn}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Search Blogs
          </button>
        </div>

        <div className={styles.controlsGrid}>
          <div className={styles.controlItem}>
            <label htmlFor="searchTitle">Title Keyword</label>
            <input
              id="searchTitle"
              type="text"
              placeholder="Search by title..."
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
          </div>

          <div className={styles.controlItem}>
            <label htmlFor="searchTag">Tag Keyword</label>
            <input
              id="searchTag"
              type="text"
              placeholder="Search by tag..."
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
            />
          </div>

          <div className={styles.controlItem}>
            <label htmlFor="categorySelect">Category Filter</label>
            <select
              id="categorySelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>
        </div>
      </form>

      {/* Counter */}
      <p className={styles.resultCount}>
        Showing {filteredBlogs.length > 0 ? indexOfFirstBlog + 1 : 0} - {Math.min(indexOfLastBlog, filteredBlogs.length)} of {filteredBlogs.length} blogs (Total fetched: {blogs.length})
      </p>

      {/* Grid: 30 cards per page, fixed height ~380px, autofit screen */}
      <div className={styles.blogGrid}>
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => {
            const adItem = getSingleAd(blog.ads);
            const isAdsEmpty = !adItem || (Array.isArray(blog.ads) && blog.ads.length === 0);

            return (
              <div key={blog.id} className={styles.blogCard}>
                <span
                  className={`${styles.badge} ${
                    blog.category === "product" ? styles.productBadge : styles.serviceBadge
                  }`}
                >
                  {blog.category}
                </span>

                <div className={styles.cardHeader}>
                  <h3 title={blog.title}>{blog.title}</h3>
                  <p className={styles.tagText}>
                    <strong>Tag:</strong> {blog.tag || "N/A"}
                  </p>
                </div>

                {/* Ads Control Section inside Card */}
                <div className={styles.adsCardBox}>
                  <div className={styles.adsBoxHeader}>
                    <span className={styles.adsBoxLabel}>📢 Ad Details</span>
                    {isAdsEmpty ? (
                      <span className={styles.adsEmptyBadge}>ads : empty</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.clearAdLink}
                        onClick={() => handleClearAd(blog.id)}
                      >
                        Remove Ad
                      </button>
                    )}
                  </div>

                  {isAdsEmpty ? (
                    <div className={styles.emptyAdState}>
                      <button
                        type="button"
                        className={styles.createAdBtn}
                        onClick={() => handleCreateAd(blog.id)}
                      >
                        + Add Ad Details
                      </button>
                    </div>
                  ) : (
                    <div className={styles.adFieldsContainer}>
                      <div className={styles.adFieldRow}>
                        <label>Title</label>
                        <input
                          type="text"
                          placeholder="adsTitle"
                          value={adItem?.adsTitle || ""}
                          onChange={(e) =>
                            handleAdFieldChange(blog.id, "adsTitle", e.target.value)
                          }
                        />
                      </div>

                      <div className={styles.adFieldRow}>
                        <label>Link</label>
                        <input
                          type="text"
                          placeholder="adsLink"
                          value={adItem?.adsLink || ""}
                          onChange={(e) =>
                            handleAdFieldChange(blog.id, "adsLink", e.target.value)
                          }
                        />
                      </div>

                      <div className={styles.adFieldRow}>
                        <label>Btn</label>
                        <input
                          type="text"
                          placeholder="btnName"
                          value={adItem?.btnName || ""}
                          onChange={(e) =>
                            handleAdFieldChange(blog.id, "btnName", e.target.value)
                          }
                        />
                      </div>

                      <button
                        type="button"
                        className={styles.saveAdBtn}
                        onClick={() => handleSaveAd(blog)}
                        disabled={savingAdId === blog.id}
                      >
                        {savingAdId === blog.id ? "Saving..." : "Save Ad Changes"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.stunningDeleteBtn}
                    onClick={() => setBlogToDelete(blog)}
                    title="Delete blog"
                  >
                    <svg className={styles.trashIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete Blog
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className={styles.noResults}>No blogs match your filter criteria.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>&quot;{blogToDelete.title}&quot;</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setBlogToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmDeleteBtn} 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}