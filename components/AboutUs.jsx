"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaLeaf,
  FaUsers,
  FaLightbulb,
  FaBuilding,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

const AboutUs = () => {
  const { language } = useLanguage(); // Use the language context
  // Animation controls for scroll-triggered animations
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const flipIn = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  // Theme colors
  const colors = {
    orange: "#FF6B00",
    lightOrange: "#FF8C38",
    black: "#111111",
    white: "#FFFFFF",
    blue: "#0056B3",
    lightBlue: "#007BFF",
    darkBlue: "#003A75",
  };

  return (
    <div className="overflow-hidden bg-white min-h-screen">
    {/* Company Introduction */}
    <section className="py-20 bg-gray-100 py-[110px] px-4 md:px-0">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
                <motion.div
                    className="md:w-1/2 mb-10 md:mb-0"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.span
                        style={{ color: colors.orange }}
                        className="font-semibold uppercase tracking-wider"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {language === "en" ? "Who We Are" : "आम्ही कोण आहोत"}
                    </motion.span>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-black my-4"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {language === "en" ? "Building Better" : "उत्तम बांधकाम"}{" "}
                        <span style={{ color: colors.orange }}>
                            {language === "en" ? "Futures" : "भविष्य"}
                        </span>
                    </motion.h2>
                    <motion.div
                        style={{ backgroundColor: colors.orange }}
                        className="h-1 w-24 mb-6"
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    />
                    <motion.p
                        className="text-black mb-6 text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        {language === "en"
                            ? "At Dange Associate and Developers, we're not just developing land – we're creating communities that transform the way people live, work, and thrive."
                            : "डांगे असोसिएट आणि डेव्हलपर्समध्ये, आम्ही फक्त जमीन विकसित करत नाही आहोत – आम्ही लोक ज्या प्रकारे राहतात, काम करतात आणि प्रगती करतात त्या प्रकारे समुदाय तयार करत आहोत."}
                    </motion.p>
                    <motion.p
                        className="text-black text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        {language === "en"
                            ? "Our mission is centered on enhancing livelihoods through thoughtful planning, quality construction, and responsible stewardship of the environment."
                            : "आमचे ध्येय विचारशील नियोजन, दर्जेदार बांधकाम आणि पर्यावरणाचे जबाबदार व्यवस्थापन यांद्वारे उपजीविका सुधारण्यावर केंद्रित आहे."}
                    </motion.p>
                </motion.div>
            </div>
        </div>
    </section>
      <section style={{ backgroundColor: "#F5F5F5" }} className="py-5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              style={{ color: colors.orange }}
              className="font-semibold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {language === "en" ? "Meet Our Team" : "आमची टीम भेटा"}
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-black my-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {language === "en" ? "Visionary Leadership" : "दूरदर्शी नेतृत्व"}
            </motion.h2>
            <motion.div
              style={{ backgroundColor: colors.orange }}
              className="h-1 w-24 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
              className="text-xl text-black max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {language === "en"
                ? "Meet the experts leading our mission to transform landscapes and enhance livelihoods."
                : "लँडस्केप्स बदलण्यासाठी आणि उपजीविका सुधारण्यासाठी आमच्या मिशनचे नेतृत्व करणाऱ्या तज्ञांना भेटा."}
            </motion.p>
          </motion.div>

          {/* Leadership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* CEO Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden transform transition-all duration-300 group-hover:shadow-2xl w-96 mx-auto">
                <div className="relative h-64">
                  <img
                    src="/pramod.jpeg"
                    alt="Pramod Dange - CEO"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 brightness-110"
                  />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {language === "en" ? "Pramod Dange" : "प्रमोद डांगे"}
                    </h3>
                    <p
                      style={{ color: colors.orange }}
                      className="font-medium text-lg opacity-80"
                    >
                      {language === "en"
                        ? "Founder & CEO"
                        : "संस्थापक आणि सीईओ"}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-black leading-relaxed">
                    {language === "en"
                      ? "Pramod Dange brings over 18 years of experience in land development. His visionary leadership has been instrumental in shaping the company's success and creating sustainable communities."
                      : "प्रमोद डांगे यांना जमीन विकासाचा १८ वर्षांहून अधिक अनुभव आहे. त्यांच्या दूरदर्शी नेतृत्वाने कंपनीच्या यशाला आकार देण्यात आणि शाश्वत समुदाय तयार करण्यात महत्त्वपूर्ण भूमिका बजावली आहे."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Co-Founder Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 group-hover:shadow-2xl w-96 mx-auto">
                <div className="relative h-64">
                  <img
                    src="/vedant.jpeg" // Corrected relative path for the image
                    alt="Vedant Dange - Co-Founder"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {language === "en" ? "Vedant Dange" : "वेदान्त डांगे"}
                    </h3>
                    <p
                      style={{ color: colors.orange }}
                      className="font-medium text-lg"
                    >
                      {language === "en" ? "Co-Founder" : "संस्थापक"}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-black leading-relaxed">
                    {language === "en"
                      ? "Vedant Dange holds a degree in Marketing and excels in management and brand strategy. As Co-Founder, he leads operations and drives impactful marketing efforts for the company’s growth."
                      : "वेदान्त डांगे यांना मार्केटिंगमध्ये पदवी आहे आणि व्यवस्थापन आणि ब्रँड धोरणात उत्कृष्टता आहे. सह-संस्थापक म्हणून, ते ऑपरेशन्सचे नेतृत्व करतात आणि कंपनीच्या वाढीसाठी प्रभावी मार्केटिंग प्रयत्नांना चालना देतात."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach Section with Animated Icons */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              style={{ color: colors.orange }}
              className="font-semibold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {language === "en" ? "Our Philosophy" : "आमची तत्त्वे"}
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-black my-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {language === "en" ? "Our Approach" : "आमचा दृष्टिकोन"}
            </motion.h2>
            <motion.div
              style={{ backgroundColor: colors.orange }}
              className="h-1 w-24 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
              className="text-xl text-black max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {language === "en"
                ? "Discover the principles that guide our development process and ensure exceptional results for our clients and communities."
                : "त्या तत्त्वांचा शोध घ्या जे आमच्या विकास प्रक्रियेला मार्गदर्शन करतात आणि आमच्या क्लायंट्स आणि समुदायांसाठी अपवादात्मक परिणाम सुनिश्चित करतात."}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Card 1 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaLeaf className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en"
                    ? "Sustainable Communities"
                    : "सतत राहणारे समुदाय"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "We develop properties that balance ecological responsibility with modern living standards, ensuring a positive impact on the environment and residents."
                    : "आम्ही अशी प्रॉपर्टीज विकसित करतो ज्या पर्यावरणीय जबाबदारी आणि आधुनिक जीवनमान यांचा समतोल साधतात, पर्यावरण आणि रहिवाशांवर सकारात्मक प्रभाव सुनिश्चित करतात."}
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaUsers className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en"
                    ? "Community Focus"
                    : "समुदायावर लक्ष केंद्रित"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "We prioritize the creation of thriving communities that enhance the livelihood of residents through thoughtful planning and amenities."
                    : "आम्ही विचारशील नियोजन आणि सुविधांच्या माध्यमातून रहिवाशांच्या उपजीविकेला वाव देणाऱ्या समृद्ध समुदायांच्या निर्मितीला प्राधान्य देतो."}
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaLightbulb className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en"
                    ? "Innovation & Quality"
                    : "नवीनता आणि गुणवत्ता"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "Our developments incorporate the latest in sustainable technologies and quality materials to create lasting value for our clients."
                    : "आमच्या विकासात शाश्वत तंत्रज्ञान आणि गुणवत्ता सामग्रीचा समावेश आहे ज्यामुळे आमच्या क्लायंटसाठी टिकाऊ मूल्य निर्माण होते."}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Second row of cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* Card 4 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaBuilding className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en" ? "Urban Excellence" : "शहरी उत्कृष्टता"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "We create developments that seamlessly integrate with existing urban landscapes while enhancing the overall aesthetic and functionality."
                    : "आम्ही अशी विकासे तयार करतो ज्या विद्यमान शहरी लँडस्केप्समध्ये निर्बाधपणे समाकलित होतात आणि एकूण सौंदर्य आणि कार्यक्षमता वाढवतात."}
                </p>
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaHandshake className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en"
                    ? "Client Partnership"
                    : "क्लायंट भागीदारी"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "We build long-term relationships with our clients, working collaboratively to understand and exceed their expectations at every stage."
                    : "आम्ही आमच्या क्लायंटसोबत दीर्घकालीन संबंध निर्माण करतो, प्रत्येक टप्प्यावर त्यांच्या अपेक्षांवर मात करण्यासाठी सहकार्याने काम करतो."}
                </p>
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: colors.orange }}
            >
              <div className="p-8">
                <motion.div
                  style={{ backgroundColor: colors.blue }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white rounded-full"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: colors.orange,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <FaChartLine className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {language === "en" ? "Value Creation" : "मूल्य निर्माण"}
                </h3>
                <p className="text-black text-center">
                  {language === "en"
                    ? "We focus on creating developments that appreciate in value over time, delivering long-term returns for investors and homeowners alike."
                    : "आम्ही अशी विकासे तयार करण्यावर लक्ष केंद्रित करतो ज्यामुळे कालांतराने मूल्य वाढते, गुंतवणूकदार आणि घरमालक दोघांसाठी दीर्घकालीन परतावा मिळतो."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        style={{ backgroundColor: colors.blue }}
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {language === "en"
              ? "Join Our Journey"
              : "आमच्या प्रवासात सामील व्हा"}
          </motion.h2>
          <motion.p
            className="text-xl text-white mb-8 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {language === "en"
              ? "Discover how Dange Associate and Developers can help you find your ideal property or investment opportunity."
              : "डांगे असोसिएट आणि डेव्हलपर्स कसे तुम्हाला तुमची आदर्श प्रॉपर्टी किंवा गुंतवणूक संधी शोधण्यात मदत करू शकतात हे शोधा."}
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            >
              {language === "en"
                ? "Contact Us Today"
                : "आजच आमच्याशी संपर्क साधा"}
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
