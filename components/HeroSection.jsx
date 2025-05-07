"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "/components/LanguageContext";
import samplepic1 from "../public/samplepic1.png";

const HeroSection = () => {
  const { language } = useLanguage(); // Use the language context
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title:
        language === "en"
          ? "Invest in Your Future"
          : "तुमच्या भविष्यामध्ये गुंतवणूक करा",
      subtitle:
        language === "en"
          ? "NATP-Approved Projects with Clear Title Guarantee"
          : "NATP-मंजूर प्रकल्प स्पष्ट शीर्षक हमीसह",
      image: samplepic1, // Imported image from the public folder
      cta: language === "en" ? "Learn More" : "अधिक जाणून घ्या",
    },
    {
      title:
        language === "en"
          ? "Premium Amenities"
          : "उच्च दर्जाच्या सुविधांचा समावेश",
      subtitle:
        language === "en"
          ? "Modern Infrastructure for Contemporary Living"
          : "आधुनिक जीवनासाठी आधुनिक पायाभूत सुविधा",
      image: "/fd9f1b98bd765ffb9a2d62df2740f999.jpg",
      cta: language === "en" ? "View Amenities" : "सुविधा पहा",
    },
    {
      title:
        language === "en" ? "Luxury Living Spaces" : "आडव्या आरामदायक जागा",
      subtitle:
        language === "en"
          ? "Experience Comfort & Style Like Never Before"
          : "कधीही न अनुभवलेला आराम आणि शैली अनुभवाः",
      image:
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
      cta: language === "en" ? "Discover More" : "अधिक शोधा",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl">
              {slide.subtitle}
            </p>
            <a
              href="#why-invest"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-orange-500 w-10"
                : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
