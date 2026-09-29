import { projects } from "@/lib/projects";

const BASE = "https://www.dangedeveloper.in";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/about-us", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p.path}`, lastModified: now, changeFrequency: "weekly", priority: p.priority })),
    ...projects.map((p) => ({ url: `${BASE}/projects/${p.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 })),
  ];
}
