import LegalPage from "@/components/legal/LegalPage";

export const metadata = { title: "Terms of Use | Dange Associates" };

export default function Terms() {
  return (
    <LegalPage
      title={{ en: "Terms of Use", mr: "वापराच्या अटी" }}
      updated={{ en: "Please read these terms before using this website.", mr: "ही वेबसाइट वापरण्यापूर्वी कृपया या अटी वाचा." }}
      sections={[
        {
          h: { en: "Information on this website", mr: "वेबसाइटवरील माहिती" },
          p: {
            en: "Project details, images and descriptions on this website are for general information. Please confirm plot availability, sizes, prices and approvals with our office before making any decision.",
            mr: "या वेबसाइटवरील प्रकल्पांचे तपशील, चित्रे आणि वर्णने सामान्य माहितीसाठी आहेत. कोणताही निर्णय घेण्यापूर्वी प्लॉटची उपलब्धता, आकार, किंमत आणि मंजुरी आमच्या कार्यालयाकडून निश्चित करा.",
          },
        },
        {
          h: { en: "3D visualisations", mr: "3D दृश्ये" },
          p: {
            en: "The 3D fly-through and 3D models are illustrative. The sanctioned layout and registered documents are the final reference.",
            mr: "3D सफर आणि 3D मॉडेल्स प्रातिनिधिक आहेत. मंजूर लेआउट आणि नोंदणीकृत कागदपत्रे हाच अंतिम संदर्भ आहे.",
          },
        },
        {
          h: { en: "Contact", mr: "संपर्क" },
          p: {
            en: "Questions about these terms? Call +91 7774882844 or email vedantdange18@gmail.com.",
            mr: "या अटींबद्दल प्रश्न? +91 7774882844 वर कॉल करा किंवा vedantdange18@gmail.com वर ईमेल करा.",
          },
        },
      ]}
    />
  );
}
