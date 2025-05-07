import React from "react";
import CountUp from "react-countup";
import { useLanguage } from "./LanguageContext";

const Stats = () => {
  const { language } = useLanguage(); // Use the language context

  const statsData = [
    {
      number: 8,
      suffix: "+",
      label: language === "en" ? "Landmark Projects" : "महत्त्वाचे प्रकल्प",
    },
    {
      number: 973,
      suffix: "+",
      label: language === "en" ? "Happy Families" : "आनंदी कुटुंबे",
    },
    {
      number: 18,
      suffix: "+",
      label:
        language === "en"
          ? "Years Of Building Trust"
          : "विश्वास निर्माणाची वर्षे",
    },
    {
      number: 740520,
      suffix: "+",
      label:
        language === "en" ? "Sq. Ft. Under Planning" : "चौरस फूट नियोजनाखाली",
    },
    {
      number: 609840,
      suffix: "+",
      label:
        language === "en" ? "Sq. Ft. Under Development" : "चौरस फूट विकासाखाली",
    },
    {
      number: 1524600,
      suffix: "+",
      label: language === "en" ? "Sq. Ft. Sold" : "चौरस फूट विकले",
    },
  ];

  return (
    <div
      className="flex items-center justify-center bg-white
    -50 py-12 px-4 border-t border-b border-black-200"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
        {statsData.map((item, index) => (
          <div key={index}>
            <h2 className="text-orange-600 text-5xl ">
              <CountUp
                start={0}
                end={item.number}
                duration={5.5}
                decimals={item.number % 1 !== 0 ? 2 : 0}
              />
              {item.suffix}
            </h2>
            <p className="text-gray-700 mt-2 text-lg">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
