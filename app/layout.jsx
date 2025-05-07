import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Land Associate by Dange Associate",
  description: "Premium land development and investment opportunities",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

import "./globals.css";
