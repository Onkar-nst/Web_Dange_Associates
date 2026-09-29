export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://www.dangedeveloper.in/sitemap.xml",
    host: "https://www.dangedeveloper.in",
  };
}
