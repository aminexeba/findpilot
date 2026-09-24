import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function getAllBlogSlugs() {
  const collections = ["blog-product", "blog-service"];
  const articles = [];

  for (const colName of collections) {
    try {
      const querySnapshot = await getDocs(collection(db, colName));
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Reads the 'slug' key directly from your Firebase document
        if (data.slug) {
          articles.push({
            slug: data.slug, 
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(),
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching collection ${colName}:`, error);
    }
  }

  return articles;
}

export default async function sitemap() {
  const baseUrl = "https://findpilot.cc";
  const articles = await getAllBlogSlugs();

  return articles.map((article) => ({
    // article.slug inserts your Firebase 'slug' key here
    url: `${baseUrl}/navpages/article/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}