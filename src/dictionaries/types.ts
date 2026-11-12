export interface CoreValue {
  number: string;
  title: string;
  body: string;
}

export interface PracticeArea {
  id: string;
  number: string;
  title: string;
  body: string;
}

export interface MethodStep {
  number: string;
  title: string;
  body: string;
}

export interface TeamMember {
  title: string;
  discipline: string;
  image: string;
}

export interface InsightItem {
  category: string;
  title: string;
  excerpt: string;
}

export interface LegalRegistration {
  label: string;
  value: string;
}

export interface WhoWeServeItem {
  title: string;
  description: string;
}

export interface WhoWeServeContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: WhoWeServeItem[];
}

export interface Dictionary {
  meta: { title: string; description: string };
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    monogram: string;
  };
  nav: {
    companyName: string;
    home: string;
    about: string;
    practice: string;
    packages: string;
    team: string;
    marketplace: string;
    insights: string;
    contact: string;
    login: string;
  };
  a11y: { skip: string; menu: string; close: string; nav: string };
  lang: { label: string; switchTo: "en" | "ar" };
  cta: { consultation: string; explore: string };
  hero: {
    eyebrow: string;
    headline: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
  };
  coreValues: {
    eyebrow: string;
    headline: string;
    lead: string;
    items: CoreValue[];
  };
  aboutFirm: {
    eyebrow: string;
    quote: string;
    quoteAuthor: string;
    headline: string;
    body: string;
    credentialsLabel: string;
    credentials: string[];
  };
  practiceAreas: {
    eyebrow: string;
    headline: string;
    lead: string;
    sidebarLabel: string;
    items: PracticeArea[];
  };
  methodology: {
    eyebrow: string;
    headline: string;
    lead: string;
    steps: MethodStep[];
  };
  team: {
    title: string;
    subtitle: string;
    eyebrow: string;
    headline: string;
    note: string;
    viewProfile: string;
    comingSoon: string;
    members: TeamMember[];
  };
  store: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    purchase: string;
    noPackages: string;
  };
  insights: {
    eyebrow: string;
    headline: string;
    lead: string;
    readMore: string;
    items: InsightItem[];
  };
  contact: {
    eyebrow: string;
    headline: string;
    subtext: string;
    freeConsultNotice: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    hoursLabel: string;
    hours: string;
    mapLabel: string;
    form: {
      name: string;
      email: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      submit: string;
      success: string;
      required: string;
      invalidEmail: string;
      hint: string;
    };
  };
  footer: {
    blurb: string;
    linksLabel: string;
    practiceLabel: string;
    contactLabel: string;
    dataLabel: string;
    marketIntelLabel: string;
    marketIntelText: string;
    directConsultation: string;
    legalLabel: string;
    registrations: LegalRegistration[];
    rights: string;
    privacy: string;
    terms: string;
    disclaimer: string;
  };
  whoWeServe: WhoWeServeContent;
}
