'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import styles from './financectr.module.css';

export default function FinanceControlPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    details: '',
    affiliatelink: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const ITEMS_PER_PAGE = 30;

  // Fetch all publications from the 'finance' collection
  const fetchFinanceItems = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'finance'));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          brand: data.brand || '',
          title: data.title || '',
          tag: data.tag || '',
          details: data.details || '',
          affiliatelink: data.affiliatelink || '',
        });
      });
      setItems(list);
    } catch (error) {
      console.error('Error fetching finance items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceItems();
  }, []);

  // Filter items by Brand or Tag
  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const brandMatch = item.brand.toLowerCase().includes(term);
    const tagMatch = item.tag.toLowerCase().includes(term);
    return brandMatch || tagMatch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Start Edit Mode
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditFormData({
      title: item.title,
      details: item.details,
      affiliatelink: item.affiliatelink,
    });
  };

  // Cancel Edit Mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', details: '', affiliatelink: '' });
  };

  // Handle Edit Input Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Edits to Firestore
  const handleSaveEdit = async (id) => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'finance', id);
      await updateDoc(docRef, {
        title: editFormData.title,
        details: editFormData.details,
        affiliatelink: editFormData.affiliatelink,
      });

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...editFormData } : item
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete Handler
  const confirmDelete = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'finance', deleteModalItem.id));
      setItems((prev) => prev.filter((item) => item.id !== deleteModalItem.id));
      setDeleteModalItem(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header & Search */}
      <div className={styles.header}>
        <h1 className={styles.title}>Finance Control Panel</h1>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by brand or tag..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading listings...</div>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <div className={styles.noResults}>No listings found.</div>
          ) : (
            <div className={styles.grid}>
              {currentItems.map((item) => {
                const isEditingThis = editingId === item.id;

                return (
                  <div key={item.id} className={styles.card}>
                    {isEditingThis ? (
                      /* EDIT MODE */
                      <div className={styles.editForm}>
                        <h2 className={styles.brand}>{item.brand} (Editing)</h2>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Title</label>
                          <input
                            type="text"
                            name="title"
                            className={styles.editInput}
                            value={editFormData.title}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Details</label>
                          <textarea
                            name="details"
                            rows={3}
                            className={styles.editTextarea}
                            value={editFormData.details}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Affiliate Link</label>
                          <input
                            type="url"
                            name="affiliatelink"
                            className={styles.editInput}
                            value={editFormData.affiliatelink}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={styles.editActions}>
                          <button
                            className={styles.cancelBtn}
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                          >
                            Cancel
                          </button>
                          <button
                            className={styles.saveBtn}
                            onClick={() => handleSaveEdit(item.id)}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <>
                        <div className={styles.cardContent}>
                          {item.tag && <span className={styles.tag}>{item.tag}</span>}
                          <h2 className={styles.brand}>{item.brand}</h2>
                          <h3 className={styles.cardTitle}>{item.title}</h3>
                          {item.details && (
                            <p className={styles.cardDetails}>{item.details}</p>
                          )}

                          {item.affiliatelink && (
                            <a
                              href={item.affiliatelink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.affiliateBtn}
                            >
                              Visit Link ↗
                            </a>
                          )}
                        </div>

                        <div className={styles.cardFooter}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleStartEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => setDeleteModalItem(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Popup Modal */}
      {deleteModalItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{deleteModalItem.brand || deleteModalItem.title}</strong>?
            </p>
            <p className={styles.modalWarning}>This action cannot be undone.</p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteModalItem(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}