export type TeamMember = {
  slug: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  image: string;
  bioEn: string[];
  bioAr: string[];
  comingSoon?: boolean;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "faraj-alhouty",
    nameEn: "Eng. Faraj Alhouty",
    nameAr: "المهندس فرج الحوطي",
    roleEn: "Chief Executive Officer | Strategic Business & Institutional Development",
    roleAr: "الرئيس التنفيذي | التطوير المؤسسي والأعمال الاستراتيجية",
    image: "/team/faraj.jpg",
    bioEn: [
      "Eng. Faraj Alhouty is a senior executive with more than 35 years of experience across Saudi Arabia's public, private, and non-profit sectors. His expertise spans corporate strategy, governance, complex commercial transactions, public-private partnerships, investment structuring, and large-scale project execution.",
      "Throughout his career, he has held senior leadership and advisory positions with Saudi Aramco, Boeing Saudi Arabia, the Ministry of Housing, and leading real estate, industrial, and technology enterprises. His experience includes contributing to strategic programmes valued at hundreds of billions of Saudi riyals, structuring international partnerships, leading multidisciplinary organisations, and advancing digital transformation initiatives.",
      "As Chief Executive Officer of TASHEEL LEGAL, he brings a commercially grounded, forward-looking perspective to the company's institutional development and client service. He focuses on aligning legal strategy with business objectives, identifying regulatory and contractual risks early, strengthening corporate governance, and structuring transactions and partnerships to protect client interests and support sustainable growth.",
      "He holds a Bachelor of Science in Engineering from the United States and has completed postgraduate studies in Business Administration in the United Kingdom. He combines analytical rigour, executive judgment, and practical knowledge of the Saudi business environment to help organisations navigate complexity with greater clarity and confidence."
    ],
    bioAr: [
      "المهندس فرج الحوطي هو قيادي تنفيذي يتمتع بخبرة تزيد عن 35 عاماً في القطاعات الحكومية والخاصة وغير الربحية في المملكة العربية السعودية. تشمل خبراته استراتيجية الشركات، والحوكمة، والمعاملات التجارية المعقدة، والشراكات بين القطاعين العام والخاص، وهيكلة الاستثمار، وتنفيذ المشاريع الكبرى.",
      "تولى خلال مسيرته المهنية مناصب قيادية واستشارية عليا في شركة أرامكو السعودية، وبوينغ السعودية، ووزارة الإسكان، وشركات رائدة في قطاعات العقار والصناعة والتقنية. وتشمل خبراته المساهمة في برامج استراتيجية تبلغ قيمتها مئات المليارات من الريالات السعودية، وهيكلة الشراكات الدولية، وقيادة المنظمات متعددة التخصصات، وتعزيز مبادرات التحول الرقمي.",
      "بصفته رئيساً تنفيذياً لشركة تسهيل للمحاماة والاستشارات القانونية، فإنه يجلب منظوراً تجارياً وتطلعياً نحو الأمام لتطوير الشركة المؤسسي وخدمة العملاء. ويركز على مواءمة الاستراتيجية القانونية مع أهداف الأعمال، والكشف المبكر عن المخاطر التنظيمية والتعاقدية، وتعزيز حوكمة الشركات، وهيكلة المعاملات والشراكات لحماية مصالح العملاء ودعم النمو المستدام.",
      "يحمل درجة البكالوريوس في الهندسة من الولايات المتحدة، وأكمل دراسات عليا في إدارة الأعمال في المملكة المتحدة. وهو يجمع بين الصرامة التحليلية، والحكم التنفيذي، والمعرفة العملية ببيئة الأعمال السعودية لمساعدة المؤسسات على تجاوز التعقيدات بقدر أكبر من الوضوح والثقة."
    ]
  },
  {
    slug: "dr-meshaan-bin-ejrif",
    nameEn: "Dr. Meshaan Bin Ejrif",
    nameAr: "د. مشعان بن عجرف",
    roleEn: "Managing Partner",
    roleAr: "الشريك المؤسس",
    image: "https://ui-avatars.com/api/?name=Meshaan+Bin+Ejrif&background=070D19&color=C5A880&size=800",
    bioEn: [],
    bioAr: [],
    comingSoon: true
  },
  {
    slug: "dr-mohammed-bin-ejrim",
    nameEn: "Dr. Mohammed Bin Ejrim",
    nameAr: "د. محمد بن عجرف",
    roleEn: "Managing Partner",
    roleAr: "الشريك المؤسس",
    image: "https://ui-avatars.com/api/?name=Mohammed+Bin+Ejrim&background=070D19&color=C5A880&size=800",
    bioEn: [],
    bioAr: [],
    comingSoon: true
  }
];
