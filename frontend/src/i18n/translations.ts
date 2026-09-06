// Static UI copy only — nav, buttons, headings, homepage sections, footer.
// Product/brand/category names and descriptions come from the database and
// are not translated here (no Nepali field exists on those records yet).
// Add new keys as more of the site is translated; useTranslation() falls
// back to the key itself if a translation is missing, so nothing crashes.
export const translations = {
  "nav.products": { en: "Products", np: "उत्पादनहरू" },
  "nav.brands": { en: "Brands", np: "ब्रान्डहरू" },
  "nav.company": { en: "Company", np: "कम्पनी" },
  "nav.support": { en: "Support", np: "सहयोग" },
  "nav.elibrary": { en: "E-Library", np: "ई-पुस्तकालय" },
  "nav.dealerNetwork": { en: "Dealer Network", np: "डिलर नेटवर्क" },
  "nav.talkToExpert": { en: "Talk to an Expert", np: "विशेषज्ञसँग कुरा गर्नुहोस्" },
  "nav.searchPlaceholder": { en: "Search equipment...", np: "उपकरण खोज्नुहोस्..." },

  "company.about": { en: "About us", np: "हाम्रो बारेमा" },
  "company.facilities": { en: "Facilities", np: "सुविधाहरू" },
  "company.news": { en: "News", np: "समाचार" },
  "company.events": { en: "Events", np: "कार्यक्रमहरू" },
  "company.careers": { en: "Careers", np: "जागिर अवसरहरू" },

  "support.contact": { en: "Contact us", np: "सम्पर्क गर्नुहोस्" },
  "support.faq": { en: "FAQ", np: "बारम्बार सोधिने प्रश्नहरू" },
  "support.warranty": { en: "Warranty", np: "वारेन्टी" },
  "support.quote": { en: "Request a quote", np: "मूल्य उद्धरण अनुरोध गर्नुहोस्" },

  "hero.eyebrow": { en: "Dental & Surgical Equipment · Nepal", np: "दन्त तथा शल्य उपकरण · नेपाल" },
  "hero.headline": { en: "Dental technology,", np: "दन्त प्रविधि," },
  "hero.headlineAccent": { en: "delivered and supported", np: "डेलिभरी र समर्थन सहित" },
  "hero.headlineTail": { en: "across Nepal", np: "नेपालभर" },
  "hero.body": {
    en: "Genuine dental units, sterilization, imaging and instruments for clinics nationwide, backed by expert product guidance and a dealer network near you.",
    np: "देशभरका क्लिनिकहरूका लागि वास्तविक डेन्टल युनिट, स्टेरिलाइजेसन, इमेजिङ र उपकरणहरू, साथै विशेषज्ञ सल्लाह र नजिकैको डिलर नेटवर्कको सहयोगसहित।",
  },
  "hero.primaryCta": { en: "Browse the catalogue", np: "क्याटलग हेर्नुहोस्" },
  "hero.secondaryCta": { en: "Talk to an expert", np: "विशेषज्ञसँग कुरा गर्नुहोस्" },
  "hero.serving": { en: "Serving", np: "सेवा पुर्‍याइने ठाउँहरू" },

  "city.Kathmandu": { en: "Kathmandu", np: "काठमाडौं" },
  "city.Pokhara": { en: "Pokhara", np: "पोखरा" },
  "city.Chitwan": { en: "Chitwan", np: "चितवन" },
  "city.Butwal": { en: "Butwal", np: "बुटवल" },
  "city.Biratnagar": { en: "Biratnagar", np: "विराटनगर" },

  "trust.nationwideDelivery": { en: "Nationwide delivery", np: "देशैभर डेलिभरी" },
  "trust.genuineProducts": { en: "Genuine products", np: "वास्तविक उत्पादनहरू" },
  "trust.expertSupport": { en: "Expert support", np: "विशेषज्ञ सहयोग" },
  "trust.dealerNetwork": { en: "Dealer network", np: "डिलर नेटवर्क" },

  "explore.eyebrow": { en: "Explore the range", np: "दायरा हेर्नुहोस्" },
  "explore.title": { en: "A full range for the modern practice", np: "आधुनिक अभ्यासका लागि पूर्ण दायरा" },
  "explore.description": {
    en: "From treatment units to everyday consumables, sourced from established manufacturers and supported across Nepal.",
    np: "उपचार युनिटदेखि दैनिक उपभोग्य वस्तुसम्म, स्थापित उत्पादकहरूबाट प्राप्त र नेपालभर समर्थित।",
  },
  "explore.dentalUnits.label": { en: "Dental units & equipment", np: "डेन्टल युनिट तथा उपकरण" },
  "explore.dentalUnits.hint": { en: "Treatment units, compressors, delivery systems", np: "उपचार युनिट, कम्प्रेसर, डेलिभरी प्रणाली" },
  "explore.instruments.label": { en: "Instruments & handpieces", np: "यन्त्र तथा ह्यान्डपिस" },
  "explore.instruments.hint": { en: "Hand instruments, rotary, endodontics", np: "हस्त यन्त्र, रोटरी, इन्डोडन्टिक्स" },
  "explore.sterilization.label": { en: "Sterilization & consumables", np: "स्टेरिलाइजेसन तथा उपभोग्य वस्तु" },
  "explore.sterilization.hint": {
    en: "Autoclaves, infection control, chairside materials",
    np: "अटोक्लेभ, संक्रमण नियन्त्रण, चेयरसाइड सामग्री",
  },
  "explore.cta": { en: "Explore", np: "हेर्नुहोस्" },

  "why.eyebrow": { en: "Why Smart Surgident", np: "किन Smart Surgident" },
  "why.title": { en: "A supply partner clinics can rely on", np: "क्लिनिकहरूले भरोसा गर्न सक्ने आपूर्ति साझेदार" },
  "why.description": {
    en: "We focus on genuine equipment, honest guidance and dependable support, before and long after the sale.",
    np: "हामी वास्तविक उपकरण, इमानदार सल्लाह र भरपर्दो सहयोगमा ध्यान दिन्छौं, बिक्री अघि र पछि दुबै समयमा।",
  },
  "why.genuine.title": { en: "Genuine products", np: "वास्तविक उत्पादनहरू" },
  "why.genuine.body": { en: "Supplied through proper channels, not grey imports.", np: "उचित माध्यमबाट आपूर्ति गरिन्छ, ग्रे आयातबाट होइन।" },
  "why.brands.title": { en: "Trusted brands", np: "भरपर्दो ब्रान्डहरू" },
  "why.brands.body": { en: "Equipment from established dental manufacturers.", np: "स्थापित डेन्टल उत्पादकहरूका उपकरणहरू।" },
  "why.guidance.title": { en: "Expert guidance", np: "विशेषज्ञ सल्लाह" },
  "why.guidance.body": {
    en: "Help choosing the right equipment for your practice.",
    np: "तपाईंको अभ्यासका लागि उपयुक्त उपकरण छनोटमा सहयोग।",
  },
  "why.reach.title": { en: "Nationwide reach", np: "देशैभर पहुँच" },
  "why.reach.body": { en: "Distribution and dealer presence across Nepal.", np: "नेपालभर वितरण र डिलर उपस्थिति।" },
  "why.install.title": { en: "Installation & support", np: "जडान तथा सहयोग" },
  "why.install.body": { en: "Setup assistance and after-sales service.", np: "सेटअप सहयोग र बिक्री पछिको सेवा।" },

  "imports.eyebrow": { en: "What we import", np: "हामी के आयात गर्छौं" },
  "imports.title": { en: "Equipment from trusted global manufacturers", np: "भरपर्दो विश्वव्यापी उत्पादकका उपकरणहरू" },
  "imports.description": {
    en: "A sample of the genuine dental and surgical equipment lines we bring into Nepal, sourced directly rather than through grey-market imports.",
    np: "नेपालमा ल्याइने वास्तविक डेन्टल तथा शल्य उपकरण लाइनहरूको नमूना, ग्रे-मार्केट आयातभन्दा सिधै प्राप्त गरिएको।",
  },

  "brands.eyebrow": { en: "Brands we carry", np: "हामीले राख्ने ब्रान्डहरू" },

  "promo.imaging.eyebrow": { en: "Diagnostic imaging", np: "डायग्नोस्टिक इमेजिङ" },
  "promo.imaging.headline": {
    en: "Precision intraoral imaging, built for everyday clinical use",
    np: "दैनिक क्लिनिकल प्रयोगका लागि बनाइएको सटीक इन्ट्राओरल इमेजिङ",
  },
  "promo.imaging.body": {
    en: "A digital sensor engineered for clear captures and a fast, low-friction workflow, so diagnosis is quicker and your team is confident from day one.",
    np: "स्पष्ट क्याप्चर र छिटो, सहज कार्यप्रवाहका लागि डिजाइन गरिएको डिजिटल सेन्सर, जसले निदानलाई छिटो र तपाईंको टिमलाई पहिलो दिनदेखि नै आत्मविश्वासी बनाउँछ।",
  },
  "promo.endodontics.eyebrow": { en: "Endodontics", np: "इन्डोडन्टिक्स" },
  "promo.endodontics.headline": {
    en: "Ultrasonic activation for cleaner canal preparation",
    np: "सफा क्यानल तयारीका लागि अल्ट्रासोनिक सक्रियता",
  },
  "promo.endodontics.body": {
    en: "Cordless ultrasonic irrigation and activation with multiple working modes and interchangeable tips for a range of root-canal requirements.",
    np: "विभिन्न रुट-क्यानल आवश्यकताका लागि धेरै कार्यमोड र साट्न मिल्ने टिपसहितको कर्डलेस अल्ट्रासोनिक इरिगेसन र सक्रियता।",
  },
  "promo.viewCatalogue": { en: "View catalogue", np: "क्याटलग हेर्नुहोस्" },

  "spotlight.eyebrow": { en: "In focus", np: "फोकसमा" },
  "spotlight.fallbackHeadline": { en: "Engineered for the modern operatory", np: "आधुनिक अपरेटरीका लागि डिजाइन गरिएको" },
  "spotlight.viewProduct": { en: "View product", np: "उत्पादन हेर्नुहोस्" },

  "dealerNetwork.eyebrow": { en: "Nationwide presence", np: "देशैभर उपस्थिति" },
  "dealerNetwork.title": { en: "Close to your clinic", np: "तपाईंको क्लिनिक नजिकै" },
  "dealerNetwork.description": {
    en: "A growing dealer network keeps genuine equipment, parts and support within reach across the country.",
    np: "बढ्दो डिलर नेटवर्कले वास्तविक उपकरण, पार्टपुर्जा र सहयोग देशभर पहुँचयोग्य बनाउँछ।",
  },
  "dealerNetwork.viewAll": { en: "View all dealers", np: "सबै डिलरहरू हेर्नुहोस्" },

  "elibrary.eyebrow": { en: "E-Library", np: "ई-पुस्तकालय" },
  "elibrary.title": { en: "Catalogues & product guides", np: "क्याटलग तथा उत्पादन गाइडहरू" },
  "elibrary.description": {
    en: "Specifications, manuals and reference material for the equipment we distribute.",
    np: "हामीले वितरण गर्ने उपकरणका विशेषता, म्यानुअल र सन्दर्भ सामग्री।",
  },
  "elibrary.open": { en: "Open the E-Library", np: "ई-पुस्तकालय खोल्नुहोस्" },
  "elibrary.openPdf": { en: "Open PDF", np: "PDF खोल्नुहोस्" },

  "finalCta.eyebrow": { en: "Clinic planning & equipment advice", np: "क्लिनिक योजना तथा उपकरण सल्लाह" },
  "finalCta.title": { en: "Planning a new clinic, or upgrading your setup?", np: "नयाँ क्लिनिक योजना बनाउँदै हुनुहुन्छ, वा सेटअप स्तरोन्नति गर्दै?" },
  "finalCta.body": {
    en: "Share your requirements and our team will help you choose the right equipment, plan the layout, and arrange delivery to your city.",
    np: "आफ्ना आवश्यकता बताउनुहोस्, हाम्रो टिमले उपयुक्त उपकरण छनोट, लेआउट योजना र तपाईंको सहरमा डेलिभरी मिलाउन सहयोग गर्नेछ।",
  },
  "finalCta.talkToExpert": { en: "Talk to an Expert", np: "विशेषज्ञसँग कुरा गर्नुहोस्" },
  "finalCta.browseCatalogue": { en: "Browse the catalogue", np: "क्याटलग हेर्नुहोस्" },

  "footer.tagline": {
    en: "Genuine dental and surgical equipment, distributed and supported across Nepal through a growing dealer network.",
    np: "वास्तविक डेन्टल तथा शल्य उपकरण, बढ्दो डिलर नेटवर्कमार्फत नेपालभर वितरण र समर्थित।",
  },
  "footer.address": { en: "Kathmandu, Nepal", np: "काठमाडौं, नेपाल" },
  "footer.company": { en: "Company", np: "कम्पनी" },
  "footer.products": { en: "Products", np: "उत्पादनहरू" },
  "footer.support": { en: "Support", np: "सहयोग" },
  "footer.network": { en: "Network", np: "नेटवर्क" },
  "footer.aboutUs": { en: "About us", np: "हाम्रो बारेमा" },
  "footer.facilities": { en: "Facilities", np: "सुविधाहरू" },
  "footer.news": { en: "News", np: "समाचार" },
  "footer.events": { en: "Events", np: "कार्यक्रमहरू" },
  "footer.careers": { en: "Careers", np: "जागिर अवसरहरू" },
  "footer.allProducts": { en: "All products", np: "सबै उत्पादनहरू" },
  "footer.brands": { en: "Brands", np: "ब्रान्डहरू" },
  "footer.elibrary": { en: "E-Library", np: "ई-पुस्तकालय" },
  "footer.contact": { en: "Contact", np: "सम्पर्क" },
  "footer.faq": { en: "FAQ", np: "प्रायः सोधिने प्रश्न" },
  "footer.warranty": { en: "Warranty", np: "वारेन्टी" },
  "footer.requestQuote": { en: "Request a quote", np: "मूल्य उद्धरण अनुरोध" },
  "footer.dealerNetwork": { en: "Dealer network", np: "डिलर नेटवर्क" },
  "footer.becomeDealer": { en: "Become a dealer", np: "डिलर बन्नुहोस्" },
  "footer.dealerLogin": { en: "Dealer login", np: "डिलर लगइन" },
  "footer.rights": { en: "All rights reserved.", np: "सर्वाधिकार सुरक्षित।" },
  "footer.privacyPolicy": { en: "Privacy Policy", np: "गोपनीयता नीति" },
  "footer.terms": { en: "Terms", np: "सर्तहरू" },
} as const;

export type TranslationKey = keyof typeof translations;
