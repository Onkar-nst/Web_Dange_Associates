// Single source of truth for every project page.
// Text fields are bilingual: { en, mr }. Use `t(field, language)` to read them.
//
// NOTE: Details below are written from the information already on the site
// (locations, statuses, layout render). Please review plot counts, amenities
// and landmarks against the sanctioned layouts before publishing.

export const t = (field, language) =>
  field && typeof field === "object" && "en" in field ? field[language] ?? field.en : field;

const clearTitleFacts = {
  title: { en: "Clear title", mr: "स्पष्ट शीर्षक" },
  registry: { en: "Immediate registry", mr: "तात्काळ नोंदणी" },
};

export const projects = [
  {
    slug: "shree-ram-nagri-1",
    has3D: true,
    statusType: "current",
    status: { en: "Current Project", mr: "सध्याचा प्रकल्प" },
    name: { en: "Shree Ram Nagri-1", mr: "श्री राम नगरी-१" },
    location: {
      en: "State Highway 250, Kalemshwar, Bramni",
      mr: "राज्य महामार्ग २५०, कळमेश्वर, ब्रामणी",
    },
    mapQuery: "State Highway 250, Kalemshwar, Bramni",
    image: "/project-imgg.jpg",
    heroImage: "/project-imgg.jpg",
    tagline: {
      en: "A fully planned highway-front layout with wide roads, green spaces and a clubhouse.",
      mr: "रुंद रस्ते, हिरवीगार जागा आणि क्लबहाऊससह महामार्गालगतचा पूर्ण नियोजित लेआउट.",
    },
    description: {
      en: "Premium residential plots with clear titles and immediate possession. Fully developed layout with all modern amenities.",
      mr: "स्पष्ट शीर्षक आणि तात्काळ ताबा असलेले प्रीमियम निवासी प्लॉट. सर्व आधुनिक सुविधांसह पूर्णपणे विकसित लेआउट.",
    },
    longDescription: {
      en: [
        "Shree Ram Nagri-1 is our flagship layout on State Highway 250 near Kalmeshwar. It is planned as a complete neighbourhood, with a landscaped entrance boulevard, a grid of wide internal roads and more than 140 clearly demarcated residential plots.",
        "Every plot comes with a clear title and immediate registry. We walk you through each document before you pay, so you can focus on planning your home. The layout sets aside open space for a central garden, a kids' play area and a clubhouse with a swimming pool, so your family has room to grow.",
      ],
      mr: [
        "श्री राम नगरी-१ हा कळमेश्वरजवळ राज्य महामार्ग २५० वरील आमचा प्रमुख लेआउट आहे. सुशोभित प्रवेश मार्ग, रुंद अंतर्गत रस्त्यांचे जाळे आणि १४० पेक्षा जास्त स्पष्टपणे सीमांकित निवासी प्लॉटसह तो एक संपूर्ण वसाहत म्हणून नियोजित आहे.",
        "प्रत्येक प्लॉट स्पष्ट शीर्षक आणि तात्काळ नोंदणीसह येतो. पैसे देण्यापूर्वी आम्ही प्रत्येक कागदपत्र समजावून सांगतो, जेणेकरून तुम्ही तुमच्या घराच्या नियोजनावर लक्ष केंद्रित करू शकता. मध्यवर्ती उद्यान, मुलांचे खेळाचे मैदान आणि जलतरण तलावासह क्लबहाऊससाठी लेआउटमध्ये मोकळी जागा राखीव आहे.",
      ],
    },
    stats: [
      { value: "140+", label: { en: "Residential plots", mr: "निवासी प्लॉट" } },
      { value: "SH-250", label: { en: "Highway frontage", mr: "महामार्गालगत" } },
      { value: "100%", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
      { value: "4+", label: { en: "Lifestyle amenities", mr: "जीवनशैली सुविधा" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Bookings open", mr: "बुकिंग सुरू" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Registry", mr: "नोंदणी" }, value: clearTitleFacts.registry },
      { label: { en: "Possession", mr: "ताबा" }, value: { en: "Immediate", mr: "तात्काळ" } },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "SH-250, Bramni, Kalmeshwar", mr: "SH-250, ब्रामणी, कळमेश्वर" } },
    ],
    highlights: [
      { en: "Direct frontage on State Highway 250", mr: "राज्य महामार्ग २५० वर थेट दर्शनी भाग" },
      { en: "Landscaped entrance boulevard with a grand gate", mr: "भव्य प्रवेशद्वारासह सुशोभित प्रवेश मार्ग" },
      { en: "Wide internal roads with footpaths and avenue trees", mr: "पदपथ आणि झाडांसह रुंद अंतर्गत रस्ते" },
      { en: "Numbered plots with boundary stones at every corner", mr: "प्रत्येक कोपऱ्यावर सीमा दगडांसह क्रमांकित प्लॉट" },
      { en: "Choose your plot by Vastu, size or budget", mr: "वास्तु, आकार किंवा बजेटनुसार प्लॉट निवडा" },
      { en: "Every document explained before you pay", mr: "पैसे देण्यापूर्वी प्रत्येक कागदपत्र स्पष्ट" },
    ],
    amenities: [
      { icon: "entrance", label: { en: "Grand entrance gate", mr: "भव्य प्रवेशद्वार" } },
      { icon: "road", label: { en: "Wide internal roads", mr: "रुंद अंतर्गत रस्ते" } },
      { icon: "trees", label: { en: "Avenue plantation", mr: "रस्त्यालगत वृक्षारोपण" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "garden", label: { en: "Central garden", mr: "मध्यवर्ती उद्यान" } },
      { icon: "walk", label: { en: "Walking track", mr: "चालण्याचा ट्रॅक" } },
      { icon: "kids", label: { en: "Kids' play area", mr: "मुलांचे खेळाचे मैदान" } },
      { icon: "club", label: { en: "Clubhouse", mr: "क्लबहाऊस" } },
      { icon: "pool", label: { en: "Swimming pool", mr: "जलतरण तलाव" } },
      { icon: "sports", label: { en: "Sports court", mr: "क्रीडा कोर्ट" } },
      { icon: "fence", label: { en: "Compound wall", mr: "संरक्षक भिंत" } },
      { icon: "water", label: { en: "Water & electricity lines", mr: "पाणी आणि वीज जोडणी" } },
    ],
    connectivity: [
      { icon: "highway", label: { en: "State Highway 250", mr: "राज्य महामार्ग २५०" }, note: { en: "Right at the entrance", mr: "प्रवेशद्वाराजवळच" } },
      { icon: "town", label: { en: "Kalmeshwar town", mr: "कळमेश्वर शहर" }, note: { en: "Markets, banks & daily needs", mr: "बाजार, बँका आणि दैनंदिन गरजा" } },
      { icon: "industry", label: { en: "Kalmeshwar MIDC", mr: "कळमेश्वर एमआयडीसी" }, note: { en: "Industrial & job hub", mr: "औद्योगिक आणि रोजगार केंद्र" } },
      { icon: "school", label: { en: "Schools & colleges", mr: "शाळा आणि महाविद्यालये" }, note: { en: "In and around Kalmeshwar", mr: "कळमेश्वर आणि परिसरात" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "A short highway drive", mr: "महामार्गाने थोड्याच अंतरावर" } },
    ],
    gallery: [
      { src: "/project-imgg.jpg", caption: { en: "Master layout plan", mr: "मास्टर लेआउट प्लॅन" } },
    ],
  },
  {
    slug: "ready-to-move-homes",
    statusType: "ready",
    status: { en: "Ready to Move", mr: "तयार" },
    name: { en: "Ready to Move Homes", mr: "तयार घरे" },
    location: {
      en: "Beside Tahsil Office, Kalemshwar, Nagpur",
      mr: "तहसील कार्यालयाजवळ, कळमेश्वर, नागपूर",
    },
    mapQuery: "Tahsil Office, Kalemshwar, Nagpur",
    image: "/ghar.jpg",
    heroImage: "/ghar.jpg",
    tagline: {
      en: "Move in today, in the heart of Kalmeshwar.",
      mr: "कळमेश्वरच्या मध्यवर्ती भागात, आजच राहायला या.",
    },
    description: {
      en: "Move-in ready residential properties with complete documentation and legal clearance. Perfect for immediate occupancy.",
      mr: "संपूर्ण दस्तऐवजीकरण आणि कायदेशीर मंजुरीसह तयार निवासी मालमत्ता. तात्काळ वास्तव्यासाठी योग्य.",
    },
    longDescription: {
      en: [
        "Skip the construction wait. Our ready-to-move homes sit beside the Tahsil Office in Kalmeshwar, so government offices, markets, schools and clinics are all close by.",
        "Every home is handed over with complete documentation and legal clearance, so you can move in with confidence and start living from day one.",
      ],
      mr: [
        "बांधकामाची वाट पाहू नका. आमची तयार घरे कळमेश्वरमधील तहसील कार्यालयाजवळ आहेत, त्यामुळे सरकारी कार्यालये, बाजारपेठ, शाळा आणि दवाखाने जवळच आहेत.",
        "प्रत्येक घर संपूर्ण कागदपत्रे आणि कायदेशीर मंजुरीसह सुपूर्द केले जाते, जेणेकरून तुम्ही आत्मविश्वासाने पहिल्या दिवसापासून राहू शकता.",
      ],
    },
    stats: [
      { value: "0", label: { en: "Days of waiting", mr: "प्रतीक्षेचे दिवस" } },
      { value: "100%", label: { en: "Legal clearance", mr: "कायदेशीर मंजुरी" } },
      { value: "Town", label: { en: "Centre location", mr: "मध्यवर्ती ठिकाण" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Ready residential homes", mr: "तयार निवासी घरे" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Ready to move", mr: "राहण्यास तयार" } },
      { label: { en: "Documentation", mr: "कागदपत्रे" }, value: { en: "Complete", mr: "पूर्ण" } },
      { label: { en: "Possession", mr: "ताबा" }, value: { en: "Immediate", mr: "तात्काळ" } },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Beside Tahsil Office, Kalmeshwar", mr: "तहसील कार्यालयाजवळ, कळमेश्वर" } },
    ],
    highlights: [
      { en: "Move in immediately, no construction wait", mr: "बांधकामाची वाट न पाहता लगेच राहायला या" },
      { en: "Complete documentation and legal clearance", mr: "संपूर्ण कागदपत्रे आणि कायदेशीर मंजुरी" },
      { en: "Walking distance to the Tahsil Office", mr: "तहसील कार्यालय चालण्याच्या अंतरावर" },
      { en: "Markets, schools and clinics nearby", mr: "बाजार, शाळा आणि दवाखाने जवळ" },
    ],
    amenities: [
      { icon: "home", label: { en: "Ready-built homes", mr: "तयार बांधलेली घरे" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "road", label: { en: "Paved access roads", mr: "पक्के रस्ते" } },
      { icon: "docs", label: { en: "Complete paperwork", mr: "संपूर्ण कागदपत्रे" } },
    ],
    connectivity: [
      { icon: "town", label: { en: "Tahsil Office", mr: "तहसील कार्यालय" }, note: { en: "Right next door", mr: "अगदी शेजारी" } },
      { icon: "shop", label: { en: "Kalmeshwar market", mr: "कळमेश्वर बाजार" }, note: { en: "Daily needs close by", mr: "दैनंदिन गरजा जवळ" } },
      { icon: "school", label: { en: "Schools & colleges", mr: "शाळा आणि महाविद्यालये" }, note: { en: "Within town", mr: "शहरातच" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
  {
    slug: "dange-layout-1",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Dange Layout 1", mr: "डांगे लेआउट १" },
    location: { en: "Behind Panchayat Samiti, Kalemshwar", mr: "पंचायत समितीमागे, कळमेश्वर" },
    mapQuery: "Panchayat Samiti, Kalemshwar",
    image: "/project-imgg.jpg",
    heroImage: "/hero-legacy.png",
    tagline: {
      en: "Where our story began. Fully sold and home to happy families.",
      mr: "जिथून आमची कथा सुरू झाली. पूर्णपणे विकलेला आणि आनंदी कुटुंबांचे घर.",
    },
    description: {
      en: "Successfully completed residential layout with satisfied homeowners. All plots sold and occupied.",
      mr: "समाधानी घरमालकांसह यशस्वीरित्या पूर्ण झालेला निवासी लेआउट. सर्व प्लॉट विकले आणि व्यापलेले.",
    },
    longDescription: {
      en: [
        "Dange Layout 1, behind the Panchayat Samiti in Kalmeshwar, is where our commitment to clear titles and honest dealing first took shape.",
        "Today every plot is sold and the layout is a settled neighbourhood of homes. It shows what we promise on every new project.",
      ],
      mr: [
        "कळमेश्वरमधील पंचायत समितीमागील डांगे लेआउट १ मध्येच स्पष्ट शीर्षक आणि प्रामाणिक व्यवहाराची आमची बांधिलकी प्रथम आकाराला आली.",
        "आज प्रत्येक प्लॉट विकला गेला आहे आणि लेआउट घरांची स्थिर वसाहत बनला आहे. आम्ही प्रत्येक नवीन प्रकल्पात जे वचन देतो त्याचा हा पुरावा आहे.",
      ],
    },
    stats: [
      { value: "100%", label: { en: "Plots sold", mr: "प्लॉट विकले" } },
      { value: "✓", label: { en: "Families living", mr: "कुटुंबे राहतात" } },
      { value: "Town", label: { en: "Central location", mr: "मध्यवर्ती ठिकाण" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed & sold out", mr: "पूर्ण व विक्री संपली" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Behind Panchayat Samiti", mr: "पंचायत समितीमागे" } },
    ],
    highlights: [
      { en: "All plots sold and occupied", mr: "सर्व प्लॉट विकले आणि व्यापलेले" },
      { en: "Close to government offices", mr: "सरकारी कार्यालयांच्या जवळ" },
      { en: "An established, peaceful neighbourhood", mr: "प्रस्थापित, शांत परिसर" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "home", label: { en: "Homes built", mr: "घरे बांधली" } },
    ],
    connectivity: [
      { icon: "town", label: { en: "Panchayat Samiti", mr: "पंचायत समिती" }, note: { en: "Right in front", mr: "समोरच" } },
      { icon: "shop", label: { en: "Kalmeshwar market", mr: "कळमेश्वर बाजार" }, note: { en: "Nearby", mr: "जवळच" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
  {
    slug: "dange-layout-2",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Dange Layout 2", mr: "डांगे लेआउट २" },
    location: { en: "Opposite Regent High School, Kalemshwar", mr: "रेजेंट हायस्कूलसमोर, कळमेश्वर" },
    mapQuery: "Regent High School, Kalemshwar",
    image: "/project-imgg.jpg",
    heroImage: "/hero-legacy.png",
    tagline: {
      en: "A family neighbourhood across from the school gate.",
      mr: "शाळेच्या प्रवेशद्वारासमोर कुटुंबांसाठी वसाहत.",
    },
    description: {
      en: "Prime location residential development near educational institutions. Fully developed with modern infrastructure.",
      mr: "शैक्षणिक संस्थांजवळ प्रमुख स्थानावरील निवासी विकास. आधुनिक पायाभूत सुविधांसह पूर्णपणे विकसित.",
    },
    longDescription: {
      en: [
        "Dange Layout 2 sits directly opposite Regent High School, a favourite with families who want children to walk to school.",
        "The layout was delivered fully developed, with modern infrastructure in place, and is now a lively residential community.",
      ],
      mr: [
        "डांगे लेआउट २ थेट रेजेंट हायस्कूलसमोर आहे. मुलांना चालत शाळेत जाता यावे अशी इच्छा असलेल्या कुटुंबांची ही आवडती जागा आहे.",
        "आधुनिक पायाभूत सुविधांसह हा लेआउट पूर्णपणे विकसित करून सुपूर्द करण्यात आला आणि आता तो एक गजबजलेला निवासी समुदाय आहे.",
      ],
    },
    stats: [
      { value: "100%", label: { en: "Developed", mr: "विकसित" } },
      { value: "School", label: { en: "Opposite the gate", mr: "प्रवेशद्वारासमोर" } },
      { value: "✓", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed", mr: "पूर्ण" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Opp. Regent High School", mr: "रेजेंट हायस्कूलसमोर" } },
    ],
    highlights: [
      { en: "Opposite Regent High School", mr: "रेजेंट हायस्कूलसमोर" },
      { en: "Fully developed infrastructure", mr: "पूर्ण विकसित पायाभूत सुविधा" },
      { en: "Ideal for growing families", mr: "वाढत्या कुटुंबांसाठी आदर्श" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "school", label: { en: "School next door", mr: "शेजारी शाळा" } },
    ],
    connectivity: [
      { icon: "school", label: { en: "Regent High School", mr: "रेजेंट हायस्कूल" }, note: { en: "Directly opposite", mr: "थेट समोर" } },
      { icon: "shop", label: { en: "Kalmeshwar market", mr: "कळमेश्वर बाजार" }, note: { en: "Nearby", mr: "जवळच" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
  {
    slug: "dange-layout-3",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Dange Layout 3", mr: "डांगे लेआउट ३" },
    location: { en: "Behind PWS College, Kalemshwar Bypass Road", mr: "पीडब्ल्यूएस कॉलेजमागे, कळमेश्वर बायपास रोड" },
    mapQuery: "PWS College, Kalemshwar Bypass Road",
    image: "/project-imgg.jpg",
    heroImage: "/hero-legacy.png",
    tagline: {
      en: "Bypass-road connectivity beside a college campus.",
      mr: "महाविद्यालय परिसराजवळ बायपास रस्त्याची कनेक्टिव्हिटी.",
    },
    description: {
      en: "Strategic location on bypass road with excellent connectivity. Well-planned layout with all amenities.",
      mr: "उत्कृष्ट कनेक्टिव्हिटीसह बायपास रोडवर धोरणात्मक स्थान. सर्व सुविधांसह सुनियोजित लेआउट.",
    },
    longDescription: {
      en: [
        "Located behind PWS College on the Kalmeshwar Bypass Road, Dange Layout 3 combines a quiet residential setting with quick access to the bypass.",
        "The well-planned layout was delivered with all amenities and has grown into a settled neighbourhood.",
      ],
      mr: [
        "कळमेश्वर बायपास रोडवरील पीडब्ल्यूएस कॉलेजमागे असलेला डांगे लेआउट ३ शांत निवासी वातावरण आणि बायपासवर जलद प्रवेश यांचा मेळ घालतो.",
        "सर्व सुविधांसह हा सुनियोजित लेआउट सुपूर्द करण्यात आला आणि तो आता एक स्थिर वसाहत बनला आहे.",
      ],
    },
    stats: [
      { value: "Bypass", label: { en: "Road access", mr: "रस्ता प्रवेश" } },
      { value: "College", label: { en: "Next door", mr: "शेजारी" } },
      { value: "✓", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed", mr: "पूर्ण" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Kalmeshwar Bypass Road", mr: "कळमेश्वर बायपास रोड" } },
    ],
    highlights: [
      { en: "Quick access to the Kalmeshwar Bypass", mr: "कळमेश्वर बायपासवर जलद प्रवेश" },
      { en: "Beside PWS College", mr: "पीडब्ल्यूएस कॉलेजजवळ" },
      { en: "Well-planned layout with all amenities", mr: "सर्व सुविधांसह सुनियोजित लेआउट" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "trees", label: { en: "Plantation", mr: "वृक्षारोपण" } },
    ],
    connectivity: [
      { icon: "school", label: { en: "PWS College", mr: "पीडब्ल्यूएस कॉलेज" }, note: { en: "Right next door", mr: "अगदी शेजारी" } },
      { icon: "highway", label: { en: "Kalmeshwar Bypass", mr: "कळमेश्वर बायपास" }, note: { en: "Quick access", mr: "जलद प्रवेश" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
  {
    slug: "dange-layout-4",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Dange Layout 4", mr: "डांगे लेआउट ४" },
    location: { en: "Kohli Market Area, Mouza Kohli", mr: "कोहली मार्केट एरिया, मौजा कोहली" },
    mapQuery: "Kohli Market, Kalemshwar",
    image: "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=2232&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=2232&auto=format&fit=crop",
    tagline: {
      en: "A peaceful community beside the Kohli market.",
      mr: "कोहली बाजाराजवळ एक शांत समुदाय.",
    },
    description: {
      en: "Established residential community in Kohli market area. Complete infrastructure and peaceful environment.",
      mr: "कोहली मार्केट क्षेत्रात स्थापित निवासी समुदाय. संपूर्ण पायाभूत सुविधा आणि शांत वातावरण.",
    },
    longDescription: {
      en: [
        "Dange Layout 4 is an established residential community in the Kohli market area of Mouza Kohli.",
        "With complete infrastructure and a calm environment, it offers everyday convenience without the city bustle.",
      ],
      mr: [
        "डांगे लेआउट ४ हा मौजा कोहलीच्या कोहली मार्केट परिसरातील एक प्रस्थापित निवासी समुदाय आहे.",
        "संपूर्ण पायाभूत सुविधा आणि शांत वातावरणामुळे शहराच्या गर्दीशिवाय दैनंदिन सोय मिळते.",
      ],
    },
    stats: [
      { value: "Market", label: { en: "At your doorstep", mr: "दारात" } },
      { value: "100%", label: { en: "Infrastructure", mr: "पायाभूत सुविधा" } },
      { value: "✓", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed", mr: "पूर्ण" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Mouza Kohli", mr: "मौजा कोहली" } },
    ],
    highlights: [
      { en: "Beside the Kohli market", mr: "कोहली बाजाराजवळ" },
      { en: "Complete infrastructure", mr: "संपूर्ण पायाभूत सुविधा" },
      { en: "Calm, established neighbourhood", mr: "शांत, प्रस्थापित परिसर" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "shop", label: { en: "Market nearby", mr: "जवळ बाजार" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
    ],
    connectivity: [
      { icon: "shop", label: { en: "Kohli market", mr: "कोहली बाजार" }, note: { en: "Walking distance", mr: "चालण्याच्या अंतरावर" } },
      { icon: "town", label: { en: "Kalmeshwar town", mr: "कळमेश्वर शहर" }, note: { en: "Short drive", mr: "थोड्या अंतरावर" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
  {
    slug: "om-sai-ram-nagar-1",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Om Sai Ram Nagar 1", mr: "ओम साई राम नगर १" },
    location: { en: "National Highway 353J, Kohli", mr: "राष्ट्रीय महामार्ग ३५३जे, कोहली" },
    mapQuery: "National Highway 353J, Kohli, Kalemshwar",
    image: "/project-imgg.jpg",
    heroImage: "/hero-bg.png",
    tagline: {
      en: "Highway-facing plots on National Highway 353J.",
      mr: "राष्ट्रीय महामार्ग ३५३जे लगत महामार्गासमोरील प्लॉट.",
    },
    description: {
      en: "Highway-facing residential plots with excellent road connectivity. Ideal for modern living.",
      mr: "उत्कृष्ट रस्ता कनेक्टिव्हिटीसह महामार्गासमोरील निवासी प्लॉट. आधुनिक राहणीसाठी आदर्श.",
    },
    longDescription: {
      en: [
        "Om Sai Ram Nagar 1 faces National Highway 353J at Kohli, giving residents fast, direct road connectivity.",
        "The layout is planned for modern living, with developed roads and utilities that make it simple to build and settle in.",
      ],
      mr: [
        "ओम साई राम नगर १ कोहली येथे राष्ट्रीय महामार्ग ३५३जे च्या समोर आहे, ज्यामुळे रहिवाशांना जलद आणि थेट रस्ता कनेक्टिव्हिटी मिळते.",
        "आधुनिक राहणीसाठी नियोजित या लेआउटमध्ये विकसित रस्ते आणि सुविधा आहेत, ज्यामुळे घर बांधणे आणि स्थायिक होणे सोपे होते.",
      ],
    },
    stats: [
      { value: "NH-353J", label: { en: "Highway frontage", mr: "महामार्गालगत" } },
      { value: "✓", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
      { value: "100%", label: { en: "Developed", mr: "विकसित" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed", mr: "पूर्ण" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "NH-353J, Kohli", mr: "NH-353J, कोहली" } },
    ],
    highlights: [
      { en: "Faces National Highway 353J", mr: "राष्ट्रीय महामार्ग ३५३जे समोर" },
      { en: "Excellent road connectivity", mr: "उत्कृष्ट रस्ता कनेक्टिव्हिटी" },
      { en: "Planned for modern living", mr: "आधुनिक राहणीसाठी नियोजित" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "highway", label: { en: "Highway access", mr: "महामार्ग प्रवेश" } },
    ],
    connectivity: [
      { icon: "highway", label: { en: "NH-353J", mr: "NH-353J" }, note: { en: "Direct frontage", mr: "थेट दर्शनी भाग" } },
      { icon: "shop", label: { en: "Kohli market", mr: "कोहली बाजार" }, note: { en: "Nearby", mr: "जवळच" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Via highway", mr: "महामार्गाने" } },
    ],
  },
  {
    slug: "om-sai-ram-nagar-2",
    statusType: "completed",
    status: { en: "Completed", mr: "पूर्ण" },
    name: { en: "Om Sai Ram Nagar 2", mr: "ओम साई राम नगर २" },
    location: { en: "Behind PWS College, Kalemshwar Bypass Road", mr: "पीडब्ल्यूएस कॉलेजमागे, कळमेश्वर बायपास रोड" },
    mapQuery: "PWS College, Kalemshwar Bypass Road",
    image: "/project-imgg.jpg",
    heroImage: "/hero-bg.png",
    tagline: {
      en: "A family-friendly neighbourhood near the education hub.",
      mr: "शैक्षणिक केंद्राजवळ कुटुंबांसाठी अनुकूल परिसर.",
    },
    description: {
      en: "Well-established residential layout near educational hub. Family-friendly neighborhood with modern facilities.",
      mr: "शैक्षणिक केंद्राजवळ सुस्थापित निवासी लेआउट. आधुनिक सुविधांसह कुटुंब-अनुकूल परिसर.",
    },
    longDescription: {
      en: [
        "Om Sai Ram Nagar 2 is a well-established layout behind PWS College on the Kalmeshwar Bypass Road.",
        "With the college next door and modern facilities in place, it has become a family-friendly neighbourhood.",
      ],
      mr: [
        "ओम साई राम नगर २ हा कळमेश्वर बायपास रोडवरील पीडब्ल्यूएस कॉलेजमागील सुस्थापित लेआउट आहे.",
        "शेजारी महाविद्यालय आणि आधुनिक सुविधांमुळे तो कुटुंबांसाठी अनुकूल परिसर बनला आहे.",
      ],
    },
    stats: [
      { value: "College", label: { en: "Next door", mr: "शेजारी" } },
      { value: "Bypass", label: { en: "Road access", mr: "रस्ता प्रवेश" } },
      { value: "✓", label: { en: "Clear title", mr: "स्पष्ट शीर्षक" } },
    ],
    facts: [
      { label: { en: "Project type", mr: "प्रकल्प प्रकार" }, value: { en: "Residential plotted layout", mr: "निवासी प्लॉटेड लेआउट" } },
      { label: { en: "Status", mr: "स्थिती" }, value: { en: "Completed", mr: "पूर्ण" } },
      { label: { en: "Title", mr: "शीर्षक" }, value: clearTitleFacts.title },
      { label: { en: "Location", mr: "ठिकाण" }, value: { en: "Kalmeshwar Bypass Road", mr: "कळमेश्वर बायपास रोड" } },
    ],
    highlights: [
      { en: "Near the PWS College education hub", mr: "पीडब्ल्यूएस कॉलेज शैक्षणिक केंद्राजवळ" },
      { en: "Family-friendly neighbourhood", mr: "कुटुंबांसाठी अनुकूल परिसर" },
      { en: "Modern facilities in place", mr: "आधुनिक सुविधा उपलब्ध" },
    ],
    amenities: [
      { icon: "road", label: { en: "Developed roads", mr: "विकसित रस्ते" } },
      { icon: "water", label: { en: "Water & electricity", mr: "पाणी आणि वीज" } },
      { icon: "light", label: { en: "Street lights", mr: "पथदिवे" } },
      { icon: "school", label: { en: "Education hub", mr: "शैक्षणिक केंद्र" } },
    ],
    connectivity: [
      { icon: "school", label: { en: "PWS College", mr: "पीडब्ल्यूएस कॉलेज" }, note: { en: "Right next door", mr: "अगदी शेजारी" } },
      { icon: "highway", label: { en: "Kalmeshwar Bypass", mr: "कळमेश्वर बायपास" }, note: { en: "Quick access", mr: "जलद प्रवेश" } },
      { icon: "city", label: { en: "Nagpur city", mr: "नागपूर शहर" }, note: { en: "Easy road access", mr: "सुलभ रस्ता" } },
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
