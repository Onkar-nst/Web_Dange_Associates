"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage(); // Use the language context
  const pathname = usePathname();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: language === "en" ? "Home" : "मुखपृष्ठ", href: "/" },
    { name: language === "en" ? "Our Story" : "आमची कथा", href: "/about-us" },
    { name: language === "en" ? "Projects" : "प्रकल्प", href: "/projects" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed w-full z-50 border-b py-4 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-slate-100" : "bg-white shadow-sm border-gray-100"
      }`}
    >
      <div className="w-full px-4 md:px-10">
        <div className="flex justify-between items-center relative">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <img
                  src="/navbar-logo-removebg-preview.png" 
                  alt="Dange Associates"
                  className="h-16 w-auto object-contain transition-transform duration-700 group-hover:rotate-[20deg]" 
                />
                <span className="ml-2 text-2xl font-black text-slate-900 tracking-tighter italic">
                  Dange<span className="text-orange-600 group-hover:text-blue-600 transition-colors">Associates</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 font-poppins">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-semibold text-base hover:text-orange-600 transition-all duration-300 group ${isActive(link.href) ? "text-orange-600" : "text-slate-700"}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : "w-0"}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/contact"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
            >
              {language === "en" ? "Get in Touch" : "संपर्क साधा"}
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg transition-all duration-300 font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {language === "en" ? "मराठी" : "English"}
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-700"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden mt-4 bg-white shadow-xl p-6 absolute left-0 right-0 w-full top-16 z-50 border-t border-gray-100"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.06 }}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between font-semibold hover:text-blue-700 text-lg py-2 border-b border-slate-50 ${isActive(link.href) ? "text-orange-600" : "text-slate-800"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <Menu className="w-4 h-4 text-slate-300" />
                </Link>
                </motion.div>
              ))}
              <div className="pt-2">
                 <Link 
                  href="/contact"
                  className="w-full bg-emerald-700 text-white py-3 rounded-lg font-bold flex justify-center items-center"
                  onClick={() => setIsOpen(false)}
                 >
                   {language === "en" ? "Get in Touch" : "संपर्क साधा"}
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
