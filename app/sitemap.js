import { projects } from "@/lib/projects";

const BASE = "https://www.dangedeveloper.in";
// Bump this when page content changes, so Google re-crawls only when something really changed.
const UPDATED = new Date("2026-09-29");

const abs = (src) => (src.startsWith("http") ? src : `${BASE}${src}`);

const PROJECT_PRIORITY = { current: 0.9, upcoming: 0.9, ready: 0.8, completed: 0.6 };

export default function sitemap() {
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly", images: ["/project-imgg.webp", "/ghar.jpg"] },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly", images: ["/hero-legacy.webp"] },
    { path: "/about-us", priority: 0.7, changeFrequency: "monthly", images: ["/pramod.jpeg"] },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/site-map", priority: 0.3, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: UPDATED,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      ...(p.images ? { images: p.images.map(abs) } : {}),
    })),
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: UPDATED,
      changeFrequency: p.statusType === "completed" ? "yearly" : "weekly",
      priority: PROJECT_PRIORITY[p.statusType] ?? 0.6,
      images: [...new Set([p.heroImage, p.image, ...(p.gallery || []).map((g) => g.src)].filter((src) => src && !src.startsWith("http")))].map(abs),
    })),
  ];
}
