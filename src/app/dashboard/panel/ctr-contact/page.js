'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase'; // Adjust path if your firebase.js is in another folder
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import styles from './contactctr.module.css';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const CARDS_PER_PAGE = 30;

  // 1. Fetch live contact collection from Firestore
  useEffect(() => {
    const q = query(collection(db, 'contact'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(), // Automatically fetches all fields including selectedPlan
        }));
        setSubmissions(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contact submissions:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Filter contacts by email and selected status
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesEmail = item.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter;

      return matchesEmail && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  // Reset to first page when search query or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // 3. Pagination calculation (30 items per page)
  const totalPages = Math.ceil(filteredSubmissions.length / CARDS_PER_PAGE) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredSubmissions.slice(start, start + CARDS_PER_PAGE);
  }, [filteredSubmissions, currentPage]);

  // 4. Update status in Firestore
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const docRef = doc(db, 'contact', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper for Firestore Timestamp formatting
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    return new Date(timestamp).toString();
  };

  // Status badge style helper
  const getBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return styles.badgePaid;
      case 'unpaid':
        return styles.badgeUnpaid;
      case 'received':
        return styles.badgeReceived;
      case 'pending_invoice':
      default:
        return styles.badgePending;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Contact Submissions</h1>

        {/* TOP FILTERS & SEARCH */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search contact by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="pending_invoice">Pending Invoice</option>
          </select>
        </div>
      </header>

      {/* MAIN CARDS CONTAINER */}
      {loading ? (
        <div className={styles.centerText}>Loading submissions...</div>
      ) : paginatedSubmissions.length === 0 ? (
        <div className={styles.centerText}>No contact submissions found.</div>
      ) : (
        <div className={styles.grid}>
          {paginatedSubmissions.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.fullName}>{item.fullName || 'N/A'}</h3>
                  <span className={styles.date}>{formatDate(item.createdAt)}</span>
                </div>
                <span className={`${styles.badge} ${getBadgeClass(item.status)}`}>
                  {item.status ? item.status.replace('_', ' ') : 'pending'}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGroup}>
                  <strong>Email:</strong> {item.email || 'N/A'}
                </div>
                <div className={styles.infoGroup}>
                  <strong>Phone:</strong> {item.phone || 'N/A'}
                </div>
                <div className={styles.infoGroup}>
                  <strong>Country:</strong> {item.country || 'N/A'}
                </div>
                
                {/* PROMINENT SELECTED PLAN DISPLAY */}
                <div className={styles.infoGroup}>
                  <strong>Selected Plan:</strong>{' '}
                  <span style={{ 
                    backgroundColor: '#eff6ff', 
                    color: '#2563eb', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    fontSize: '12px'
                  }}>
                    {item.selectedPlan || 'N/A'}
                  </span>
                </div>

                <div className={styles.infoGroup}>
                  <strong>Agreed Invoice:</strong>{' '}
                  <span className={item.agreedToPayInvoice ? styles.agreedTrue : styles.agreedFalse}>
                    {item.agreedToPayInvoice ? 'Yes (True)' : 'No (False)'}
                  </span>
                </div>

                <div className={styles.messageBox}>
                  <strong>Message:</strong>
                  <p className={styles.messageText}>{item.message || 'No message provided.'}</p>
                </div>
              </div>

              {/* CARD FOOTER: EDIT STATUS */}
              <div className={styles.cardFooter}>
                <label className={styles.editLabel}>
                  Edit Status:
                  <select
                    value={item.status || 'pending_invoice'}
                    disabled={updatingId === item.id}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="received">Received</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="pending_invoice">Pending Invoice</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages} ({filteredSubmissions.length} Total)
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}