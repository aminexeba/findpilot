'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './panel.module.css';

export default function PanelPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear session storage & cookies
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('user');
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect to login
    router.push('/dashboard/dflogin');
  };

  return (
    <div className={styles.panelContainer}>
      {/* Header */}
      <header className={styles.panelHeader}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.panelTitle}>Admin Dashboard</h1>
          <p className={styles.panelSubtitle}>Manage, publish, and control application content</p>
        </div>

        {/* Top-Right Logout Button */}
        <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </header>

      {/* Admin Quick Actions */}
      <section className={styles.panelSection}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.badge} ${styles.adminBadge}`}>System</span>
          <h2>Administration</h2>
        </div>
        <div className={styles.cardGrid}>
          <Link href="/dashboard/panel/publish-admin" className={`${styles.panelCard} ${styles.highlightCard}`}>
            <div className={`${styles.cardIcon} ${styles.adminIcon}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h3>Add Admin</h3>
              <p>Grant administrative permissions to a new user account.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-admin" className={`${styles.panelCard} ${styles.highlightCard}`}>
            <div className={`${styles.cardIcon} ${styles.adminIcon}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3.87-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h3>Control Admin</h3>
              <p>Manage existing admin users, roles, and permissions.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-contact" className={`${styles.panelCard} ${styles.highlightCard}`}>
            <div className={`${styles.cardIcon} ${styles.adminIcon}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h3>Control Contact</h3>
              <p>Manage contact form submissions and user messages.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Publishing Center */}
      <section className={styles.panelSection}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.badge} ${styles.publishBadge}`}>Create</span>
          <h2>Publish Center</h2>
        </div>
        <div className={styles.cardGrid}>
          <Link href="/dashboard/panel/publish-blog" className={styles.panelCard}>
            <div className={styles.cardIcon}>✍️</div>
            <div className={styles.cardContent}>
              <h3>Publish Blog</h3>
              <p>Create and feature blog articles and updates.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-product" className={styles.panelCard}>
            <div className={styles.cardIcon}>📦</div>
            <div className={styles.cardContent}>
              <h3>Publish Product</h3>
              <p>Add new physical or digital products to catalog.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-service" className={styles.panelCard}>
            <div className={styles.cardIcon}>🛠️</div>
            <div className={styles.cardContent}>
              <h3>Publish Service</h3>
              <p>List new service offerings for clients.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-hotel" className={styles.panelCard}>
            <div className={styles.cardIcon}>🏨</div>
            <div className={styles.cardContent}>
              <h3>Publish Hotel</h3>
              <p>List new hotel accommodation properties.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-insurance" className={styles.panelCard}>
            <div className={styles.cardIcon}>🛡️</div>
            <div className={styles.cardContent}>
              <h3>Publish Insurance</h3>
              <p>Add new insurance packages and plans.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-finance" className={styles.panelCard}>
            <div className={styles.cardIcon}>💳</div>
            <div className={styles.cardContent}>
              <h3>Publish Finance</h3>
              <p>Create new financial plans, loans, or banking offerings.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/publish-job" className={styles.panelCard}>
            <div className={styles.cardIcon}>💼</div>
            <div className={styles.cardContent}>
              <h3>Publish Job</h3>
              <p>Post open positions and recruitment listings.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Control Center */}
      <section className={styles.panelSection}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.badge} ${styles.controlBadge}`}>Manage</span>
          <h2>Control Panel</h2>
        </div>
        <div className={styles.cardGrid}>
          <Link href="/dashboard/panel/ctr-blog" className={styles.panelCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <h3>Control Blogs</h3>
              <p>Edit, unpublish, or delete product blog posts.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-product" className={styles.panelCard}>
            <div className={styles.cardIcon}>📦</div>
            <div className={styles.cardContent}>
              <h3>Control Product</h3>
              <p>Manage product inventories, prices, and catalog items.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-service" className={styles.panelCard}>
            <div className={styles.cardIcon}>🛠️</div>
            <div className={styles.cardContent}>
              <h3>Control Service</h3>
              <p>Update active service listings and customer requests.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-hotel" className={styles.panelCard}>
            <div className={styles.cardIcon}>🔑</div>
            <div className={styles.cardContent}>
              <h3>Control Hotel</h3>
              <p>Manage hotel listings, pricing, and availability.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-insurance" className={styles.panelCard}>
            <div className={styles.cardIcon}>📋</div>
            <div className={styles.cardContent}>
              <h3>Control Insurance</h3>
              <p>Update policy details and insurance terms.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-finance" className={styles.panelCard}>
            <div className={styles.cardIcon}>💰</div>
            <div className={styles.cardContent}>
              <h3>Control Finance</h3>
              <p>Monitor transactions, financial accounts, and fiscal data.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>

          <Link href="/dashboard/panel/ctr-job" className={styles.panelCard}>
            <div className={styles.cardIcon}>📂</div>
            <div className={styles.cardContent}>
              <h3>Control Job</h3>
              <p>Manage posted job openings and applicant statuses.</p>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}