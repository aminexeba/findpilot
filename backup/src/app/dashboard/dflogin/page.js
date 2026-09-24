'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

import styles from './login.module.css';

const googleProvider = new GoogleAuthProvider();

export default function DFlogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // =====================================================
  // EMAIL + PASSWORD LOGIN (Pure Firebase Auth)
  // =====================================================
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Authenticate strictly with Firebase Auth
      await signInWithEmailAndPassword(auth, cleanEmail, password);

      // Store session metadata for 30-minute layout check
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('auth_time', Date.now().toString());

      // Navigate to dashboard panel
      router.push('/dashboard/panel');
    } catch (err) {
      // Use optional chaining to safely extract the error code without triggering dev overlays
      const errorCode = err?.code || '';

      switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;

        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;

        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;

        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;

        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;

        default:
          setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN (Pure Firebase Auth)
  // =====================================================
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Authenticate strictly with Google Popup
      await signInWithPopup(auth, googleProvider);

      // Store session metadata for 30-minute layout check
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('auth_time', Date.now().toString());

      // Navigate to dashboard panel
      router.push('/dashboard/panel');
    } catch (err) {
      // Use optional chaining to safely extract the error code without triggering dev overlays
      const errorCode = err?.code || '';

      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          setError('Google Sign-In was cancelled.');
          break;

        case 'auth/popup-blocked':
          setError('Google Sign-In popup was blocked by your browser.');
          break;

        case 'auth/unauthorized-domain':
          setError('This domain is not authorized for Google Sign-In.');
          break;

        case 'auth/account-exists-with-different-credential':
          setError(
            'An account already exists with this email using another sign-in method.'
          );
          break;

        default:
          setError('Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>DF Admin</h1>

          <p className={styles.subtitle}>
            A place to manage and view control panel insights
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />

          <span className={styles.dividerText}>Or continue with</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className={styles.googleBtn}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />

            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />

            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />

            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Login with Gmail
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.footer}>
          By continuing, you indicate that you agree to DF's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}