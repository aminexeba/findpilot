"use client";

import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase'; // Adjust path to match your firebase.js location
import styles from './blogfm.module.css';

export default function BlogForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    tag: '',
    category: 'product',
    title1: '',
    paragraph1: '',
    title2: '',
    paragraph2: '',
    htmlContent: '',
    title3: '',
    paragraph3: '',
    title4: '',
    paragraph4: '',
    adsTitle: '',
    btnName: '',
    adsLink: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [adsImageFile, setAdsImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [existingTags, setExistingTags] = useState([]);

  // Fetch existing tags STRICTLY from 'blog-product', 'blog-service', and 'blog-general'
  useEffect(() => {
    const fetchExistingTags = async () => {
      try {
        const collectionsToFetch = ['blog-product', 'blog-service', 'blog-general'];
        
        // Query strictly the 3 target collections in parallel
        const snapshots = await Promise.all(
          collectionsToFetch.map((colName) => getDocs(collection(db, colName)))
        );

        const tagSet = new Set();
        snapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.tag && typeof data.tag === 'string') {
              tagSet.add(data.tag.trim());
            }
          });
        });

        setExistingTags(Array.from(tagSet));
      } catch (error) {
        console.error('Error fetching existing tags:', error);
      }
    };

    fetchExistingTags();
  }, []);

  // Helper function to generate a clean URL slug from the title
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-');  // Replace multiple - with single -
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

  const handleAdsFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAdsImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const docId = formData.title.trim();
      if (!docId) {
        throw new Error('Title cannot be empty as it serves as the Document ID.');
      }

      if (!imageFile) {
        throw new Error('Please select a hero image file to upload.');
      }

      // Generate the slug and preview URL
      const slugText = generateSlug(formData.title);
      const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'domain.com';
      const publishSlug = `${currentDomain}/${slugText}`;

      // Collection mapping for categories
      const collectionMap = {
        product: 'blog-product',
        service: 'blog-service',
        general: 'blog-general',
      };
      const collectionName = collectionMap[formData.category] || 'blog-product';

      // 1. Upload Hero Image to Firebase Storage under the "blog" folder
      const heroStoragePath = `blog/hero_${Date.now()}_${imageFile.name}`;
      const heroStorageRef = ref(storage, heroStoragePath);
      
      setStatus({ type: '', message: 'Uploading hero image...' });
      const heroSnapshot = await uploadBytes(heroStorageRef, imageFile);
      const imageHeroUrl = await getDownloadURL(heroSnapshot.ref);

      // 2. Upload Ads Image (if provided) under the "blog" folder
      let adsImageUrl = null;
      if (adsImageFile) {
        setStatus({ type: '', message: 'Uploading advertisement image...' });
        const adsStoragePath = `blog/ads_${Date.now()}_${adsImageFile.name}`;
        const adsStorageRef = ref(storage, adsStoragePath);
        const adsSnapshot = await uploadBytes(adsStorageRef, adsImageFile);
        adsImageUrl = await getDownloadURL(adsSnapshot.ref);
      }

      // 3. Prepare Payload
      const blogPayload = {
        title: formData.title,
        slug: slugText,
        publishSlug: publishSlug,
        author: formData.author,
        tag: formData.tag.trim(),
        category: formData.category,
        imageHero: imageHeroUrl,
        section1: {
          title: formData.title1 || null,
          content: formData.paragraph1,
        },
        section2: {
          title: formData.title2 || null,
          content: formData.paragraph2,
        },
        htmlContent: formData.htmlContent || null,
        section3: {
          title: formData.title3 || null,
          content: formData.paragraph3,
        },
        section4: {
          title: formData.title4 || null,
          content: formData.paragraph4,
        },
        ads: {
          adsTitle: formData.adsTitle || null,
          adsImage: adsImageUrl,
          btnName: formData.btnName || null,
          adsLink: formData.adsLink || null,
        },
        createdAt: new Date().toISOString(),
      };

      // 4. Save to Firestore
      setStatus({ type: '', message: 'Saving blog post...' });
      await setDoc(doc(db, collectionName, docId), blogPayload);

      // Add new tag to local state if it didn't exist prior
      const cleanTag = formData.tag.trim();
      if (cleanTag && !existingTags.includes(cleanTag)) {
        setExistingTags((prev) => [...prev, cleanTag]);
      }

      setStatus({
        type: 'success',
        message: `Successfully published to collection "${collectionName}" with ID "${docId}"! Slug: ${publishSlug}`,
      });

      // Reset form & files
      setFormData({
        title: '',
        author: '',
        tag: '',
        category: 'product',
        title1: '',
        paragraph1: '',
        title2: '',
        paragraph2: '',
        htmlContent: '',
        title3: '',
        paragraph3: '',
        title4: '',
        paragraph4: '',
        adsTitle: '',
        btnName: '',
        adsLink: '',
      });
      setImageFile(null);
      setAdsImageFile(null);
      e.target.reset();

    } catch (error) {
      console.error('Error publishing blog:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to publish blog. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Preview generated slug while typing title
  const liveSlugPreview = formData.title ? generateSlug(formData.title) : 'your-slug-here';

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Publish New Blog Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title (Doc ID)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter blog title..."
            className={styles.input}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Dedicated Page Slug Preview: <code>domain/{liveSlugPreview}</code>
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Author name..."
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tag</label>
          <input
            type="text"
            name="tag"
            list="existing-tags-list"
            value={formData.tag}
            onChange={handleChange}
            required
            placeholder="Select existing tag or type a new one..."
            className={styles.input}
          />
          <datalist id="existing-tags-list">
            {existingTags.map((tag, index) => (
              <option key={index} value={tag} />
            ))}
          </datalist>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="product">Product (blog-product)</option>
            <option value="service">Service (blog-service)</option>
            <option value="general">General (blog-general)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hero Image (Upload File)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={styles.input}
          />
        </div>

        {/* Paragraph 1 Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 1 Header (Title 1)</label>
          <input
            type="text"
            name="title1"
            value={formData.title1}
            onChange={handleChange}
            placeholder="Heading for paragraph 1 (h2)..."
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 1</label>
          <textarea
            name="paragraph1"
            value={formData.paragraph1}
            onChange={handleChange}
            required
            placeholder="Introduction paragraph..."
            className={styles.textarea}
          />
        </div>

        {/* Paragraph 2 Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 2 Header (Title 2)</label>
          <input
            type="text"
            name="title2"
            value={formData.title2}
            onChange={handleChange}
            placeholder="Heading for paragraph 2 (h2)..."
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 2</label>
          <textarea
            name="paragraph2"
            value={formData.paragraph2}
            onChange={handleChange}
            required
            placeholder="Second paragraph..."
            className={styles.textarea}
          />
        </div>

        {/* HTML Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Section HTML Content <span className={styles.optional}>(Optional)</span>
          </label>
          <textarea
            name="htmlContent"
            value={formData.htmlContent}
            onChange={handleChange}
            placeholder="<div>Paste your custom HTML here...</div>"
            className={`${styles.textarea} ${styles.codeArea}`}
          />
        </div>

        {/* Paragraph 3 Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 3 Header (Title 3)</label>
          <input
            type="text"
            name="title3"
            value={formData.title3}
            onChange={handleChange}
            placeholder="Heading for paragraph 3 (h2)..."
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 3</label>
          <textarea
            name="paragraph3"
            value={formData.paragraph3}
            onChange={handleChange}
            required
            placeholder="Third paragraph..."
            className={styles.textarea}
          />
        </div>

        {/* Paragraph 4 Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 4 Header (Title 4)</label>
          <input
            type="text"
            name="title4"
            value={formData.title4}
            onChange={handleChange}
            placeholder="Heading for paragraph 4 (h2)..."
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Paragraph 4</label>
          <textarea
            name="paragraph4"
            value={formData.paragraph4}
            onChange={handleChange}
            required
            placeholder="Concluding paragraph..."
            className={styles.textarea}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Advertisement Section (Optional)</legend>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Ads Title</label>
            <input
              type="text"
              name="adsTitle"
              value={formData.adsTitle}
              onChange={handleChange}
              placeholder="Special Offer Title"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Ads Image <span className={styles.optional}>(Upload File)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAdsFileChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Button Name</label>
            <input
              type="text"
              name="btnName"
              value={formData.btnName}
              onChange={handleChange}
              placeholder="e.g. Shop Now / Learn More"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ads Link</label>
            <input
              type="url"
              name="adsLink"
              value={formData.adsLink}
              onChange={handleChange}
              placeholder="https://target-url.com"
              className={styles.input}
            />
          </div>
        </fieldset>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Publishing...' : 'Publish Blog Post'}
        </button>

        {status.message && (
          <div className={`${styles.message} ${status.type === 'success' ? styles.success : styles.error}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}