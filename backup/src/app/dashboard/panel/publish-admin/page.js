"use client";

import React, { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './adminpbh.module.css';

// Initialize Firebase using environment variables from .env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Prevent duplicate initialization on hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Triggered when clicking "Add User" to open the confirmation modal
  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields.', type: 'error' });
      return;
    }
    setMessage({ text: '', type: '' });
    setShowModal(true);
  };

  // Triggered inside the modal to confirm and execute Firebase creation
  const handleConfirmCreate = async () => {
    setShowModal(false);
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage({ text: 'User successfully created in Firebase Auth!', type: 'success' });
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Navbar Simulation */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <span className={styles.navbarLogo}>Ndoubt.com Hello admin</span>
          <span className={styles.navbarSubtitle}>Admin Panel • User Management</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Add New Authenticated User</h2>
            <p>Create credentials directly in Firebase Authentication.</p>
          </div>

          {message.text && (
            <div className={`${styles.alertMessage} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleOpenModal} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Processing...' : 'Add User'}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Popup Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm User Creation</h3>
            <p>Please review the credentials before adding this user to Firebase Auth:</p>
            
            <div className={styles.modalDetails}>
              <div className={styles.detailRow}>
                <strong>Email:</strong> <span>{email}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Password:</strong> <span>{password}</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnSecondary} 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary} 
                onClick={handleConfirmCreate}
              >
                Confirm & Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}