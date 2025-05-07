"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage(); // Use the language context

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
    {
      name: language === "en" ? "Reach Us" : "आमच्याशी संपर्क साधा",
      href: "/contact",
    },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 py-[10px] ${
        isScrolled
          ? "bg-gray-100 shadow-md py-3"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/navbar-logo.jpg" // Replace with the actual image name in the public folder
                alt="Logo"
                className="h-12 w-14 mr-4 object-contain" // Adjust size as needed
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-orange-500">
                Dange Associate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-poppins">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-semibold text-lg px-3 py-2 transition-all duration-300 rounded-md group ${
                  isScrolled
                    ? "text-orange-900 hover:text-blue-700"
                    : "text-black hover:text-orange-400"
                }`}
              >
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-blue-500 transition-all duration-500 group-hover:w-full"></span>
                {link.name}
              </Link>
            ))}
            <div className="mt-4 md:mt-0">
              <button
                onClick={toggleLanguage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                {language === "en" ? "मराठी" : "English"}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-800" : "text-black"
              }`}
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
        {isOpen && (
          <div className="md:hidden mt-4 bg-gradient-to-br from-blue-200 via-white to-orange-200 rounded-3xl shadow-2xl p-8 absolute left-4 right-4 top-16 z-50 border border-gray-300 backdrop-blur-2xl transition-all duration-500 ease-in-out animate-fade-in">
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 font-semibold text-gray-800 hover:text-blue-700 text-xl transition-all duration-300 border-b pb-3 border-gray-200 hover:border-orange-400 hover:pl-2 hover:tracking-wider"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Language Toggle Button */}
      </div>
    </nav>
  );
};

export default Navbar;
