import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageContext";
import SmoothScroll from "../components/motion/SmoothScroll";
import ScrollProgress from "../components/motion/ScrollProgress";
import VanishingTitles from "../components/motion/VanishingTitles";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://www.dangedeveloper.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dange Developers (Dange Associates) | Clear-Title Plots in Kalmeshwar & Nagpur",
    template: "%s | Dange Developers",
  },
  description:
    "Dange Developers (Dange Associates) – 18+ years of trusted land development in Kalmeshwar & Nagpur. NATP-sanctioned residential plots with clear title, immediate registry and possession.",
  keywords: [
    "Dange Developers",
    "Dange Associates",
    "plots in Kalmeshwar",
    "plots in Nagpur",
    "residential plots Nagpur",
    "NATP sanctioned plots",
    "Shree Ram Nagri",
    "land developer Kalmeshwar",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Dange Developers",
    title: "Dange Developers (Dange Associates) | Clear-Title Plots in Kalmeshwar & Nagpur",
    description: "NATP-sanctioned residential plots with clear title and immediate registry in Kalmeshwar & Nagpur.",
    images: [{ url: "/project-imgg.webp", width: 1920, height: 907, alt: "Shree Ram Nagri-1 layout by Dange Developers" }],
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Dange Associates",
  alternateName: ["Dange Developers", "Dange Developer"],
  url: SITE_URL,
  logo: `${SITE_URL}/navbar-logo-removebg-preview.png`,
  image: `${SITE_URL}/project-imgg.webp`,
  telephone: ["+91-7774882844", "+91-9112379641"],
  email: "vedantdange18@gmail.com",
  foundingDate: "2006",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Block No. 7, Khadi Gram Sankul, beside ICICI Bank",
    addressLocality: "Kalmeshwar",
    addressRegion: "Maharashtra",
    postalCode: "441501",
    addressCountry: "IN",
  },
  areaServed: ["Kalmeshwar", "Nagpur", "Katol"],
  openingHours: "Mo-Sa 09:00-18:00",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        <SmoothScroll />
        <ScrollProgress />
        <VanishingTitles />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
