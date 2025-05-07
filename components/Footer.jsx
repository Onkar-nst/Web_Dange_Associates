import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

const Footer = () => {
  const { language } = useLanguage(); // Use the language context

  const currentYear = new Date().getFullYear();
  const quickLinks = [
    language === "en" ? "Home" : "मुखपृष्ठ",
    language === "en" ? "Our Story" : "आमची कथा",
    language === "en" ? "Projects" : "प्रकल्प",
    language === "en" ? "Reach Us" : "आमच्याशी संपर्क साधा",
  ];
  const projects = [
    language === "en" ? "Shri Ram Nagari 1" : "श्री राम नगरी १",
    language === "en" ? "Shri Ram Nagari 2" : "श्री राम नगरी २",
    language === "en" ? "Dange Layout 1" : "डांगे लेआउट १",
    language === "en" ? "Dange Layout 2" : "डांगे लेआउट २",
    language === "en" ? "Dange Layout 3" : "डांगे लेआउट ३",
    language === "en" ? "Om Sai Ram Nagari " : "ॐ साई राम नगरी",
    language === "en" ? "Dange Layout 4" : "डांगे लेआउट ४",
    language === "en" ? "Shri Sai Ram Nagari 1" : "श्री साई राम नगरी १",
    language === "en" ? "Shri Sai Ram Nagari 2" : "श्री साई राम नगरी २",
    language === "en" ? "Dnyaneshwar Layout" : "ज्ञानेश्वर लेआउट",
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex items-start flex-col">
            {/* Company Name */}
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-400">
              Dange Associate
            </h3>
            {/* Logo */}
            <img
              src="/footer-logo.jpg" // Replace with the actual path to your logo
              alt="Dange Associate Logo"
              className="h-84 w-84 object-contain" // Increase size by 1.75x
            />
            <div>{/* Additional content can go here */}</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={
                      link === "Home"
                        ? "/"
                        : link === "Our Story"
                        ? "/about-us"
                        : link === "Projects"
                        ? "/projects"
                        : link === "Reach Us"
                        ? "/contact"
                        : "#"
                    }
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Our Projects</h4>
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project}>
                  <a className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {project}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                <span className="text-gray-400">
                  Dange Associates and Developer, beside ICICI bank,Kalmeshwar -
                  441501
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-400">+91 7774882844</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-400">vedantdange18@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-400">
                  Mon-Sat: 9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            © {currentYear} Dange Associate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
