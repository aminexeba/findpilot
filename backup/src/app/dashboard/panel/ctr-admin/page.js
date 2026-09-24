'use client';

import React, { useState, useEffect } from 'react';
import styles from './adminctr.module.css';

export default function CtrAdminPage() {
  const [users, setUsers] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async (token = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users${token ? `?pageToken=${token}` : ''}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUsers(data.users);
      setPageToken(data.pageToken);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNextPage = () => {
    if (pageToken) {
      setTokenHistory((prev) => [...prev, pageToken]);
      fetchUsers(pageToken);
    }
  };

  const handlePrevPage = () => {
    const history = [...tokenHistory];
    history.pop();
    const prevToken = history[history.length - 1] || '';
    setTokenHistory(history);
    fetchUsers(prevToken);
  };

  const handleDelete = async (uid) => {
    if (!confirm('Are you sure you want to delete this user from Firebase Auth?')) return;

    try {
      const res = await fetch(`/api/admin/users?uid=${uid}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUsers(users.filter((user) => user.uid !== uid));
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: editingUser.uid,
          email: newEmail,
          password: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUsers(users.map((u) => (u.uid === editingUser.uid ? { ...u, email: newEmail } : u)));
      setEditingUser(null);
      setNewEmail('');
      setNewPassword('');
      alert('User updated successfully!');
    } catch (err) {
      alert(`Error updating user: ${err.message}`);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Firebase Auth Admin Panel</h1>

      {loading ? (
        <p className={styles.loadingText}>Loading records...</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className={styles.emptyRow}>No user records found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.uid}>
                      <td className={styles.uidCell}>{user.uid}</td>
                      <td>{user.email}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.editBtn}
                          onClick={() => {
                            setEditingUser(user);
                            setNewEmail(user.email);
                            setNewPassword('');
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(user.uid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.paginationContainer}>
            <button
              className={styles.pageBtn}
              onClick={handlePrevPage}
              disabled={tokenHistory.length === 0}
            >
              Previous
            </button>
            <button
              className={styles.pageBtn}
              onClick={handleNextPage}
              disabled={!pageToken}
            >
              Next
            </button>
          </div>
        </>
      )}

      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Edit User</h2>
            <form onSubmit={handleUpdate} className={styles.editForm}>
              <label>
                Email:
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                New Password (optional):
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </label>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}