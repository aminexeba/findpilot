import { db } from "@/lib/firebase"; // Adjust your firebase setup import path
import { collection, query, where, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";
import styles from "./slug.module.css";

async function getBlogData(slug) {
  // Safety check: if slug is undefined or empty, return null immediately
  if (!slug) return null;

  const collections = ["blog-product", "blog-service"];
  
  for (const colName of collections) {
    const q = query(collection(db, colName), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
  }
  return null;
}

export default async function BlogDetailPage({ params }) {
  // Await params to safely extract the dynamic slug (required in newer Next.js versions)
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  // Extract sections dynamically (section1, section2, section3, section4)
  const sections = [blog.section1, blog.section2, blog.section3, blog.section4].filter(
    (sec) => sec && sec.title && sec.content
  );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Left Side: Table of Contents (300px width) */}
        <aside className={styles.sidebar}>
          <h3 className={styles.tocTitle}>Table of Contents</h3>
          <ul className={styles.tocList}>
            {sections.map((sec, index) => {
              const sectionId = `section-${index + 1}`;
              return (
                <li key={index} className={styles.tocItem}>
                  <a href={`#${sectionId}`}>{sec.title}</a>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Center: Main Blog Article */}
        <main className={styles.mainContent}>
          {/* Hero Image - Top of blog full width, 400px height */}
          {blog.imageHero && (
            <img
              src={blog.imageHero}
              alt={blog.title || "Blog Hero"}
              className={styles.heroImage}
            />
          )}

          <div className={styles.articleBody}>
            {/* Meta Information (Author & Category) */}
            <div className={styles.metaInfo}>
              <span className={styles.author}>By {blog.author}</span>
              {blog.category && <span className={styles.categoryBadge}>{blog.category}</span>}
            </div>

            {/* Main Title */}
            <h1 className={styles.mainTitle}>{blog.title}</h1>

            {/* Render Sections (Paragraphs) */}
            {sections.map((sec, index) => {
              const sectionId = `section-${index + 1}`;
              return (
                <section key={index} id={sectionId} className={styles.sectionBlock}>
                  <h2 className={styles.sectionTitle}>{sec.title}</h2>
                  <p className={styles.sectionContent}>{sec.content}</p>
                </section>
              );
            })}

            {/* Ads Section */}
            {(blog.adsImage || blog.adsTitle || blog.adsLink) && (
              <div className={styles.adsSection}>
                {blog.adsImage && (
                  <img src={blog.adsImage} alt="Advertisement" className={styles.adsImage} />
                )}
                {blog.adsTitle && <h4 className={styles.adsTitle}>{blog.adsTitle}</h4>}
                {blog.adsLink && (
                  <a
                    href={blog.adsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.adsLinkBtn}
                  >
                    {blog.btnName || "Learn More"}
                  </a>
                )}
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}