'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './jobfm.module.css';

export default function PublishJob() {
  const [formData, setFormData] = useState({
    brand: '',
    title: '',
    tag: '',
    details: '',
    countries: '',
    affiliatelink: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [existingTags, setExistingTags] = useState([]);
  const [existingCountries, setExistingCountries] = useState([]);

  // Fetch existing tags AND unique countries from the 'job' collection on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'job'));
        const tagSet = new Set();
        const countrySet = new Set();

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // 1. Collect unique tags
          if (data.tag && typeof data.tag === 'string') {
            tagSet.add(data.tag.trim());
          }

          // 2. Collect unique country names from the countries array
          if (Array.isArray(data.countries)) {
            data.countries.forEach((country) => {
              if (country && typeof country === 'string') {
                countrySet.add(country.trim());
              }
            });
          }
        });

        setExistingTags(Array.from(tagSet));
        setExistingCountries(Array.from(countrySet));
      } catch (error) {
        console.error('Error fetching existing tags & countries:', error);
      }
    };

    fetchExistingData();
  }, []);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!imageFile) {
        setMessage('Please select an image file to upload.');
        setLoading(false);
        return;
      }

      // 1. Upload image to Firebase Storage under the "job" folder
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `job/${uniqueFileName}`);
      
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Prepare Firestore Data (exact key structure maintained)
      const slug = generateSlug(formData.title);
      const docId = formData.brand.trim().toLowerCase().replace(/\s+/g, '-');
      const cleanTag = formData.tag.trim();
      const parsedCountries = formData.countries
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await setDoc(doc(db, 'job', docId), {
        ...formData,
        tag: cleanTag,
        image: downloadURL,
        slug: `/${slug}`,
        countries: parsedCountries,
        createdAt: new Date().toISOString(),
      });

      // 3. Update local state with newly added tag & countries
      if (cleanTag && !existingTags.includes(cleanTag)) {
        setExistingTags((prev) => [...prev, cleanTag]);
      }

      setExistingCountries((prev) => {
        const merged = new Set([...prev, ...parsedCountries]);
        return Array.from(merged);
      });

      setMessage('Job listing published successfully with image!');
      
      // 4. Reset Form
      setFormData({
        brand: '',
        title: '',
        tag: '',
        details: '',
        countries: '',
        affiliatelink: '',
      });
      setImageFile(null);
      
      const fileInput = document.getElementById('imageFileinput');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error writing document or uploading image: ', error);
      setMessage('Error publishing item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Publish Job Listing</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Company / Brand (Doc ID)</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="e.g., Apple"
              />
            </div>

            <div className={styles.field}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className={styles.field}>
              <label>Tag</label>
              <input
                type="text"
                name="tag"
                list="job-tags-list"
                value={formData.tag}
                onChange={handleChange}
                required
                placeholder="Select existing tag or type a new one..."
              />
              <datalist id="job-tags-list">
                {existingTags.map((tag, index) => (
                  <option key={index} value={tag} />
                ))}
              </datalist>
            </div>

            <div className={styles.field}>
              <label>Upload Image</label>
              <input
                id="imageFileinput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Countries (Comma-separated)</label>
              <input
                type="text"
                name="countries"
                list="job-countries-list"
                value={formData.countries}
                onChange={handleChange}
                required
                placeholder="Select existing or type comma-separated (e.g. US, UK)"
              />
              <datalist id="job-countries-list">
                {existingCountries.map((country, index) => (
                  <option key={index} value={country} />
                ))}
              </datalist>
            </div>

            <div className={styles.field}>
              <label>Affiliate Link</label>
              <input
                type="url"
                name="affiliatelink"
                value={formData.affiliatelink}
                onChange={handleChange}
                required
                placeholder="https://affiliate.link/xyz"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Key highlights or job descriptions..."
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Uploading & Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}