import SiteMapPage from "@/components/SiteMapPage";

export const metadata = {
  title: "Sitemap",
  description: "All pages and projects on the Dange Developers (Dange Associates) website.",
  alternates: { canonical: "/site-map" },
};

export default function Page() {
  return <SiteMapPage />;
}
