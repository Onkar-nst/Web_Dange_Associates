"use client";
import React, { useState } from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "./LanguageContext";

export default function ProjectsPage() {
  const { language } = useLanguage(); // Use the language context

  const [hoveredCard, setHoveredCard] = useState(null);

  const upcomingProjects = [
    {
      id: 1,
      name: language === "en" ? "Shri Ram Nagari 1" : "श्री राम नगरी १",
      location:
        language === "en"
          ? "Saoner road bypass, Kalmeshwar"
          : "सावनेर रोड बायपास, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Electricity", "Water Supply", "Temple", "Many More"]
          : ["वीज", "पाणीपुरवठा", "मंदिर", "अनेक अधिक"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzzHoz_ikAuZJS7_jWG6ZpfSvpl6Eyjh6Dw&s",
    },
    {
      id: 2,
      name: language === "en" ? "Shri Ram Nagari 2" : "श्री राम नगरी २",
      location:
        language === "en"
          ? "Saoner road bypass, Kalmeshwar"
          : "सावनेर रोड बायपास, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Electricity", "Water Supply", "Temple", "Many More"]
          : ["वीज", "पाणीपुरवठा", "मंदिर", "अनेक अधिक"],
      image:
        "https://thumbs.dreamstime.com/b/d-rendering-sketch-modern-cozy-house-river-garage-sale-rent-black-line-sketch-soft-light-shadows-126243909.jpg",
    },
  ];

  const previousProjects = [
    {
      id: 1,
      name: language === "en" ? "Dange Layout 1" : "डांगे लेआउट १",
      location:
        language === "en"
          ? "Infront of Regent high school, Kalmeshwar"
          : "रेजेंट हायस्कूलसमोर, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Electricity", "Water Supply", "Garden", "Many More"]
          : ["वीज", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://c8.alamy.com/comp/2CW59AF/3d-illustration-of-a-three-story-house-with-a-contemporary-architectural-design-in-black-and-white-with-the-clipping-path-included-in-the-file-2CW59AF.jpg",
    },
    {
      id: 2,
      name: language === "en" ? "Dange Layout 2" : "डांगे लेआउट २",
      location:
        language === "en"
          ? "PWS Kalmeshwar bypass, Kalmeshwar"
          : "पीडब्ल्यूएस कळमेश्वर बायपास, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Interner Road", "Water Supply", "Garden", "Many More"]
          : ["आंतर रस्ता", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://www.plan-it-all.com/wp-content/uploads/2022/01/EXT_01_02-1024x533.jpg",
    },
    {
      id: 3,
      name: language === "en" ? "Dange Layout 3" : "डांगे लेआउट ३",
      location:
        language === "en"
          ? "PWS Kalmeshwar bypass, Kalmeshwar"
          : "पीडब्ल्यूएस कळमेश्वर बायपास, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Interner Road", "Water Supply", "Garden", "Many More"]
          : ["आंतर रस्ता", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://img.freepik.com/premium-photo/3d-model-house-architectural-template-background-architectural-model-house_727625-197.jpg",
    },
    {
      id: 4,
      name: language === "en" ? "Om Sai Ram Nagari" : "ओम साई राम नगरी",
      location: language === "en" ? "Kohli, Nagpur" : "कोहली, नागपूर",
      amenities:
        language === "en"
          ? ["Cemnt Road", "Water Supply", "Garden", "Many More"]
          : ["सिमेंट रस्ता", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://thumbs.dreamstime.com/b/d-rendering-modern-house-hill-pool-black-line-craft-background-cozy-garage-sale-rent-sketch-white-spot-169495899.jpg",
    },
    {
      id: 5,
      name: language === "en" ? "Shri Sai Ram Nagari 2" : "श्री साई राम नगरी २",
      location:
        language === "en"
          ? "PWS college road, Kalmeshwar"
          : "पीडब्ल्यूएस कॉलेज रोड, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Main Entry Gate", "Water Supply", "Garden", "Many More"]
          : ["मुख्य प्रवेशद्वार", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3RLNoLsYW4-DOtV5N1gzd4JqPh8EsyX1hVQ&s",
    },
    {
      id: 6,
      name: language === "en" ? "Shri Sai Ram Nagri" : "श्री साई राम नगरी",
      location: language === "en" ? "Ghogli, Nagpur" : "घोगली, नागपूर",
      amenities:
        language === "en"
          ? ["Main Entry Gate", "Water Supply", "Garden", "Many More"]
          : ["मुख्य प्रवेशद्वार", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://media.istockphoto.com/id/91197381/vector/3d-technical-concept-draw.jpg?s=612x612&w=0&k=20&c=QFoYwtfHOWnp1UWteQhrR5j1SX9pPZC_80YRjZe_D84=",
    },
    {
      id: 7,
      name: language === "en" ? "Dange Layout 4" : "डांगे लेआउट ४",
      location: language === "en" ? "Tashil, kalameshwar" : "ताशिल, कळमेश्वर",
      amenities:
        language === "en"
          ? ["Electricity", "Water Supply", "Garden", "Many More"]
          : ["वीज", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://www.shutterstock.com/image-vector/house-traditional-architecture-plan-3d-600nw-2348676315.jpg",
    },
    {
      id: 8,
      name: language === "en" ? "Dnyaneshwar Layout" : "ज्ञानेश्वर लेआउट",
      location:
        language === "en"
          ? "Mahadula, koradi Mandir, Nagpur"
          : "महादुला, कोराडी मंदिर, नागपूर",
      amenities:
        language === "en"
          ? ["Electricity", "Water Supply", "Garden", "Many More"]
          : ["वीज", "पाणीपुरवठा", "बाग", "अनेक अधिक"],
      image:
        "https://easy-peasy.ai/cdn-cgi/image/quality=70,format=auto,width=300/https://media.easy-peasy.ai/bde24566-4917-4da0-b38b-1b363c4e00b6/aac9851b-4d2f-489a-ae00-211e7ff32a5e.png",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <Head>
          <title>
            {language === "en"
              ? "Projects | Premium Land Development"
              : "प्रकल्प | प्रीमियम जमीन विकास"}
          </title>
          <meta
            name="description"
            content={
              language === "en"
                ? "Explore our upcoming and previous land development projects"
                : "आमचे आगामी आणि मागील जमीन विकास प्रकल्प शोधा"
            }
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>

        <style jsx global>{`
          body {
            font-family: "Poppins", sans-serif;
            overflow-x: hidden;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 30px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0.8;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .bg-pattern {
            background-image: radial-gradient(#2563eb 1px, transparent 1px),
              radial-gradient(#2563eb 1px, transparent 1px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            opacity: 0.05;
          }

          .card-hover {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .card-hover:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .image-zoom {
            transition: transform 0.5s ease;
          }

          .card-hover:hover .image-zoom {
            transform: scale(1.05);
          }

          .button-slide-bg {
            position: relative;
            z-index: 1;
            overflow: hidden;
            transition: color 0.3s ease;
          }

          .button-slide-bg:before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: #ff6b00;
            transition: all 0.3s ease;
            z-index: -1;
          }

          .button-slide-bg:hover:before {
            left: 0;
          }

          .button-slide-bg:hover {
            color: white;
            border-color: #ff6b00;
          }
        `}</style>

        <div className="fixed inset-0 bg-pattern -z-10"></div>

        <div className="fixed top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 -z-10 animate-float"></div>
        <div
          className="fixed bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-10 -z-10 animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <main className="container mx-auto px-4 py-16 relative">
          {/* Top Section */}
          <div className="relative flex items-center justify-center mb-16 overflow-hidden animate-scaleIn">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-blue-500 opacity-30"></div>
            </div>
            <div className="relative bg-white px-10 py-2">
              <h2 className="text-3xl font-bold text-black tracking-wider">
                {language === "en" ? "UPCOMING" : "आगामी"}{" "}
                <span className="text-blue-600">
                  {language === "en" ? "PROJECTS" : "प्रकल्प"}
                </span>
              </h2>
            </div>
          </div>

          {/* Upcoming Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {upcomingProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-500 card-hover animate-fadeInUp border border-gray-100"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredCard(`upcoming-${project.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute top-5 left-5 bg-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full z-10">
                    {language === "en" ? "Coming Soon" : "लवकरच येत आहे"}
                  </div>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-80 object-cover image-zoom"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 mb-5 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {project.location}
                  </p>
                  <ul className="mb-8">
                    {project.amenities.map((amenity, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-center mb-2 transform transition-transform duration-300"
                        style={{
                          transform:
                            hoveredCard === `upcoming-${project.id}`
                              ? "translateX(10px)"
                              : "translateX(0)",
                          transitionDelay: `${index * 0.1}s`,
                        }}
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        project.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                    >
                      View on Map
                    </a>
                    <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl flex-1 button-slide-bg font-medium">
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center mb-16 overflow-hidden animate-scaleIn">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-orange-500 opacity-30"></div>
            </div>
            <div className="relative bg-white px-10 py-2">
              <h2 className="text-3xl font-bold text-black tracking-wider">
                {language === "en" ? "PREVIOUS" : "मागील"}{" "}
                <span className="text-orange-500">
                  {language === "en" ? "PROJECTS" : "प्रकल्प"}
                </span>
              </h2>
            </div>
          </div>

          {/* Previous Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {previousProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 card-hover animate-fadeInUp border border-gray-100"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(`previous-${project.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-64 object-cover image-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-bold">{project.location}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {project.location}
                  </p>
                  <ul className="mb-5">
                    {project.amenities.map((amenity, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-700 flex items-center mb-1 transform transition-transform duration-300"
                        style={{
                          transform:
                            hoveredCard === `previous-${project.id}`
                              ? "translateX(5px)"
                              : "translateX(0)",
                          transitionDelay: `${index * 0.1}s`,
                        }}
                      >
                        <svg
                          className="w-3 h-3 mr-1 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-2 text-sm">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        project.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl flex-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                    >
                      View on Map
                    </a>
                    <button className="border-2 border-blue-600 text-blue-600 px-3 py-2 rounded-xl flex-1 button-slide-bg font-medium">
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
