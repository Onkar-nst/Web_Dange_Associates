"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "./LanguageContext";
import { projects, t } from "@/lib/projects";

export default function SiteMapPage() {
  const { language } = useLanguage();
  const en = language === "en";

  const groups = [
    {
      title: en ? "Main pages" : "मुख्य पाने",
      links: [
        { href: "/", label: en ? "Home" : "मुखपृष्ठ" },
        { href: "/about-us", label: en ? "Our Story" : "आमची कथा" },
        { href: "/projects", label: en ? "All Projects" : "सर्व प्रकल्प" },
        { href: "/contact", label: en ? "Contact & Site Visit" : "संपर्क आणि साइट भेट" },
      ],
    },
    {
      title: en ? "Current & ready projects" : "सध्याचे आणि तयार प्रकल्प",
      links: projects.filter((p) => p.statusType !== "completed").map((p) => ({ href: `/projects/${p.slug}`, label: t(p.name, language), note: t(p.location, language) })),
    },
    {
      title: en ? "Completed projects" : "पूर्ण झालेले प्रकल्प",
      links: projects.filter((p) => p.statusType === "completed").map((p) => ({ href: `/projects/${p.slug}`, label: t(p.name, language), note: t(p.location, language) })),
    },
    {
      title: en ? "Legal" : "कायदेशीर",
      links: [
        { href: "/privacy-policy", label: en ? "Privacy Policy" : "गोपनीयता धोरण" },
        { href: "/terms", label: en ? "Terms of Use" : "वापराच्या अटी" },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white pb-24 pt-36">
        <div className="container mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">{en ? "Sitemap" : "साइटमॅप"}</h1>
          <p className="mt-3 text-slate-600">{en ? "Every page on the Dange Associates website." : "डांगे असोसिएट्स वेबसाइटवरील सर्व पाने."}</p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {groups.map((g) => (
              <section key={g.title}>
                <h2 className="border-b border-slate-200 pb-3 text-sm font-medium uppercase tracking-widest text-slate-500">{g.title}</h2>
                <ul className="mt-2 divide-y divide-slate-100">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group flex items-center justify-between gap-4 py-3">
                        <span>
                          <span className="block text-slate-900 group-hover:text-blue-800">{l.label}</span>
                          {l.note && <span className="block text-sm text-slate-500">{l.note}</span>}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-800" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
