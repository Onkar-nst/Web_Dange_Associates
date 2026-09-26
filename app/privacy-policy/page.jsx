import LegalPage from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy | Dange Associates" };

const contact = {
  en: "For any question about your data, call +91 7774882844 or email vedantdange18@gmail.com, or visit our office at Khadi Gram Sankul, beside ICICI Bank, Kalmeshwar 441501.",
  mr: "तुमच्या माहितीबद्दल कोणत्याही प्रश्नासाठी +91 7774882844 वर कॉल करा, vedantdange18@gmail.com वर ईमेल करा किंवा खादी ग्राम संकुल, आयसीआयसीआय बँकेजवळ, कळमेश्वर ४४१५०१ येथील आमच्या कार्यालयात या.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title={{ en: "Privacy Policy", mr: "गोपनीयता धोरण" }}
      updated={{ en: "How we handle the details you share with us.", mr: "तुम्ही आमच्यासोबत शेअर केलेली माहिती आम्ही कशी हाताळतो." }}
      sections={[
        {
          h: { en: "What we collect", mr: "आम्ही काय गोळा करतो" },
          p: {
            en: "When you fill in an enquiry or call-back form on this website, we receive the details you enter, such as your name, phone number, email address, preferred location and message.",
            mr: "या वेबसाइटवरील चौकशी किंवा कॉल-बॅक फॉर्म भरल्यावर तुम्ही दिलेली माहिती — नाव, फोन नंबर, ईमेल, पसंतीचे ठिकाण आणि संदेश — आम्हाला मिळते.",
          },
        },
        {
          h: { en: "How we use it", mr: "आम्ही ती कशी वापरतो" },
          p: {
            en: "We use these details only to respond to your enquiry, arrange site visits and share information about our projects that you asked for.",
            mr: "ही माहिती आम्ही फक्त तुमच्या चौकशीला उत्तर देण्यासाठी, साइट भेटीचे नियोजन करण्यासाठी आणि तुम्ही मागितलेली प्रकल्पांची माहिती देण्यासाठी वापरतो.",
          },
        },
        {
          h: { en: "Sharing", mr: "माहितीची देवाणघेवाण" },
          p: {
            en: "We do not sell your personal details. They are stored with the service providers that run this website and its forms.",
            mr: "आम्ही तुमची वैयक्तिक माहिती विकत नाही. ती या वेबसाइट आणि फॉर्म चालवणाऱ्या सेवा प्रदात्यांकडे साठवली जाते.",
          },
        },
        { h: { en: "Contact", mr: "संपर्क" }, p: contact },
      ]}
    />
  );
}
