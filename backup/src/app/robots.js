export default function robots() {
  const baseUrl = "https://findpilot.cc";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/sitemap-dynamic.xml`,
    ],
  };
}