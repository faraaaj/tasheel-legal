export type TeamMember = {
  slug: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  tier: "executive" | "partner" | "associate";
  image: string;
  bioEn: string[];
  bioAr: string[];
  comingSoon?: boolean;
};

export const teamMembers: TeamMember[] = [
  // --- TIER 1: EXECUTIVE MANAGEMENT ---
  {
    slug: "faraj-alhouty",
    nameEn: "Eng. Faraj Alhouty",
    nameAr: "المهندس فرج الحوطي",
    roleEn: "Chief Executive Officer",
    roleAr: "الرئيس التنفيذي",
    tier: "executive",
    image: "/team/faraj.jpg",
    bioEn: [
      "Eng. Faraj Alhouty is a senior executive with more than 35 years of experience across Saudi Arabia\'s public, private, and non-profit sectors. His expertise spans corporate strategy, governance, complex commercial transactions, public-private partnerships, investment structuring, and large-scale project execution.",
      "Throughout his career, he has held senior leadership and advisory positions with Saudi Aramco, Boeing Saudi Arabia, the Ministry of Housing, and leading real estate, industrial, and technology enterprises.",
      "As Chief Executive Officer of TASHEEL LEGAL, he brings a commercially grounded, forward-looking perspective to the company\'s institutional development and client service."
    ],
    bioAr: [
      "المهندس فرج الحوطي هو قيادي تنفيذي يتمتع بخبرة تزيد عن 35 عاماً في القطاعات الحكومية والخاصة وغير الربحية في المملكة العربية السعودية. تشمل خبراته استراتيجية الشركات، والحوكمة، والمعاملات التجارية المعقدة، والشراكات بين القطاعين العام والخاص، وهيكلة الاستثمار، وتنفيذ المشاريع الكبرى.",
      "تولى خلال مسيرته المهنية مناصب قيادية واستشارية عليا في شركة أرامكو السعودية، وبوينغ السعودية، ووزارة الإسكان، وشركات رائدة في قطاعات العقار والصناعة والتقنية.",
      "بصفته رئيساً تنفيذياً لشركة تسهيل للمحاماة والاستشارات القانونية، فإنه يجلب منظوراً تجارياً وتطلعياً نحو الأمم لتطوير الشركة المؤسسي وخدمة العملاء."
    ]
  },
  {
    slug: "dr-meshaan-bin-ejrif",
    nameEn: "Dr. Meshaan Bin Ejrif",
    nameAr: "د. مشعان بن عجرف",
    roleEn: "Managing Partner",
    roleAr: "الشريك المؤسس",
    tier: "executive",
    image: "/team/meshaan.jpg",
    bioEn: ["Full profile coming soon."],
    bioAr: ["السيرة الذاتية الكاملة قريباً."],
    comingSoon: true
  },
  {
    slug: "dr-mohammed-bin-ejrim",
    nameEn: "Dr. Mohammed Bin Ejrim",
    nameAr: "د. محمد بن عجرف",
    roleEn: "Managing Partner",
    roleAr: "الشريك المؤسس",
    tier: "executive",
    image: "/team/mohammed.jpg",
    bioEn: ["Full profile coming soon."],
    bioAr: ["السيرة الذاتية الكاملة قريباً."],
    comingSoon: true
  },

  // --- TIER 2: PARTNERS / SENIOR COUNSEL ---
  {
    slug: "ibrahim-al-sayari",
    nameEn: "Ibrahim Nasser Al-Sayari",
    nameAr: "إبراهيم بن ناصر السياري",
    roleEn: "Senior Counsel (Former Chief Judge of Appeal)",
    roleAr: "مستشار أول (رئيس محكمة استئناف سابق)",
    tier: "partner",
    image: "/team/ibrahim.jpg",
    bioEn: [
      "A distinguished legal veteran with 37 years of judicial service, including 13 years at the Court of Appeal and 24 years at the First Instance Court.",
      "Former President of the Criminal Court in Riyadh, the General Court in Dammam, and the General Court in Al-Bad\' (NEOM).",
      "Certified judicial instructor by the Supreme Judicial Council and a former member of the preparatory committees for the Sharia Procedure Law regulations."
    ],
    bioAr: [
      "مستشار قانوني بارز يتمتع بخبرة قضائية تبلغ 37 عاماً، منها 13 عاماً في محكمة الاستئناف و 24 عاماً في محكمة الدرجة الأولى.",
      "شغل منصب رئيس المحكمة الجزائية في الرياض، ورئيس المحكمة العامة في الدمام، ورئيس المحكمة العامة في البدع (نيوم).",
      "مدرس قضائي معتمد من المجلس الأعلى للقضاء، وعضو سابق في اللجان التحضيرية لوضع اللوائح التنفيذية لنظام المرافعات الشرعية."
    ]
  },
  {
    slug: "abdulrahman-al-obeid",
    nameEn: "Abdulrahman Al-Obeid",
    nameAr: "عبدالرحمن العبيد",
    roleEn: "Partner | Corporate & Commercial Law",
    roleAr: "شريك | قانون الشركات والأعمال",
    tier: "partner",
    image: "/team/abdulrahman.jpg",
    bioEn: [
      "Founder of Al-Obeid Law Firm (License No. 4018/23), with extensive experience in corporate establishment, transformation, and restructuring.",
      "Represented clients before the General, Commercial, and Labor Courts, as well as the Board of Grievances, Commercial Papers Committees, and Banking Disputes Committees.",
      "Possesses deep expertise in drafting and reviewing contracts, internal bylaws, HR regulations, and mediating commercial disputes between partners."
    ],
    bioAr: [
      "مؤسس مكتب العبيد للمحاماة (رقم الترخيص 4018/23)، ويتمتع بخبرة واسعة في تأسيس الشركات وتحويلها وإعادة هيكلتها.",
      "مثل العملاء أمام المحاكم العامة والتجارية والعمالية، وديوان المظالم، ولجان الأوراق المالية، ولجان النزاعات المصرفية.",
      "يمتلك خبرة عميقة في إعداد ومراجعة العقود واللوائح الداخلية ولوائح شؤون الموظفين، والتوسط في حل النزاعات التجارية بين الشركاء."
    ]
  },

  // --- TIER 3: ASSOCIATES / LINE LAWYERS ---
  {
    slug: "bandar-al-mutairi",
    nameEn: "Bandar Salem Al-Mutairi",
    nameAr: "بندر سالم المطيري",
    roleEn: "Associate | Commercial Law & International Investments",
    roleAr: "محامي أول | القانون التجاري والاستثمارات الدولية",
    tier: "associate",
    image: "/team/bandar.jpg",
    bioEn: [
      "Holds a Ph.D. in Law (Commercial Law and International Investments) and a Master's in International Commercial Law.",
      "Brings 8 years of professional legal experience, including law practice, legal consultations, and judicial pleadings.",
      "Licensed Attorney by the Saudi Ministry of Justice and a member of the Saudi Bar Association. Specializes in contract drafting, negotiation, and legal analysis."
    ],
    bioAr: [
      "يحمل درجة الدكتوراه في القانون (القانون التجاري والاستثمارات الدولية) وماجستير في القانون التجاري الدولي.",
      "يتمتع بخبرة عملية في المجال القانوني تبلغ 8 سنوات، تشمل ممارسة المحاماة والاستشارات القانونية والمرافعات القضائية.",
      "محامٍ مرخص من وزارة العدل وعضو في الهيئة السعودية للمحامين. يتخصص في صياغة العقود والتفاوض والتحليل القانوني."
    ]
  },
  {
    slug: "ibrahim-al-balawi",
    nameEn: "Ibrahim Al-Balawi",
    nameAr: "إبراهيم البلوي",
    roleEn: "Associate | Legal Consultant",
    roleAr: "محامي | مستشار قانوني",
    tier: "associate",
    image: "/team/ibrahim-balawi.jpg",
    bioEn: [
      "A Saudi legal practitioner accredited by the Saudi Authority for Accredited Legal Practitioners (SASL) and licensed by the Ministry of Justice (License No. 48692).",
      "Experienced in drafting and reviewing service contracts, NDAs, and supplier agreements, ensuring legal compliance and mitigating contractual risks.",
      "Has provided legal consultations and represented clients in civil, labor, and commercial cases before various courts."
    ],
    bioAr: [
      "محامٍ سعودي معتمد من الهيئة السعودية لاعتماد الممارسين القانونيين (SASL) ومرخص من وزارة العدل (ترخيص رقم 48692).",
      "خبير في صياغة ومراجعة عقود الخدمات واتفاقيات عدم الإفصاح وعقود الموردين، مع ضمان الامتثال القانوني وتقليل المخاطر التعاقدية.",
      "قدم استشارات قانونية ومثل العملاء في القضايا المدنية والعمالية والتجارية أمام مختلف المحاكم."
    ]
  }
];