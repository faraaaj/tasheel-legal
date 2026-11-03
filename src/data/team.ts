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
      "Eng. Faraj Alhouty is a visionary senior executive whose career spans more than 35 years of transformative leadership across Saudi Arabia\'s public, private, and non-profit sectors. As the Chief Executive Officer of Tasheel Legal, he brings a commercially grounded, forward-looking perspective to the firm\'s institutional development, client service, and strategic growth. His expertise is unparalleled in corporate strategy, governance, complex commercial transactions, public-private partnerships, investment structuring, and large-scale project execution.",
      "Throughout his distinguished career, Eng. Alhouty has held senior leadership and advisory positions with some of the Kingdom\'s most influential organizations. He has served with Saudi Aramco, Boeing Saudi Arabia, the Ministry of Housing, and leading real estate, industrial, and technology enterprises. His experience includes contributing to strategic programmes valued at hundreds of billions of Saudi riyals, structuring international partnerships, leading multidisciplinary organisations, and advancing institutional transformation initiatives. This breadth of experience gives him a unique ability to navigate the complexities of the Saudi business landscape and align legal strategy with overarching commercial objectives.",
      "Eng. Alhouty possesses an exceptional track record in **government tenders and procurement**, having personally overseen the delivery of more than 350 tenders with billions of riyals awarded. His deep fluency in the Ministry of Housing, real estate development, and government procurement frameworks allows Tasheel Legal to offer unmatched strategic counsel to clients navigating the Kingdom\'s most complex public-private partnerships and mega-projects. He understands not just the legal requirements, but the operational, financial, and political realities that determine success in Saudi government contracting.",
      "Beyond the public sector, Eng. Alhouty brings deep private sector operational and strategic expertise. He has a proven ability to detect and diagnose deep structural and operational problems within enterprises, and to design and implement remedies that restore profitability and operational efficiency. His diagnostic approach draws on global best practices in turnaround management, focusing on rapid stabilization, liquidity protection, and sustainable performance improvement. He is adept at advising boards and executive teams on enterprise transformations, strategic business planning, and stakeholder negotiations.",
      "Eng. Alhouty also possesses deep experience in **joint ventures and acquisitions**, having structured and negotiated complex partnerships and transactions across multiple sectors. His approach to JVs is rooted in the firm\'s **Growth Co-Development** pillar—he does not simply draft agreements, but engineers partnerships that align incentives, protect minority interests, and create lasting commercial value. He is equally skilled in Q&A processes for complex transactions, ensuring that every material risk is identified, assessed, and addressed before commitment.",
      "In addition to his legal and strategic leadership, Eng. Alhouty brings a personal, hands-on background in technology. He has personally led the development of three top-tier government platforms, giving him a practical understanding of how digital infrastructure is designed, deployed, and governed. This experience allows him to bridge the gap between legal frameworks and operational reality, ensuring that technology-related mandates are grounded in real-world execution rather than abstract theory.",
      "As CEO of Tasheel Legal, Eng. Alhouty is the driving force behind the firm\'s commitment to **Preventative Legal Engineering**. He focuses on aligning legal strategy with business objectives, identifying regulatory and contractual risks early, and strengthening corporate governance. He ensures that the firm does not just react to legal problems, but actively engineers structures and transactions that protect client interests and support sustainable growth. His leadership ensures that every legal solution is pragmatic, commercially viable, and aligned with the client\'s long-term vision.",
      "Eng. Alhouty holds a Bachelor of Science in Engineering from the United States and has completed postgraduate studies in Business Administration in the United Kingdom. He combines analytical rigor, executive judgment, and practical knowledge of the Saudi business environment to help organisations navigate complexity with greater clarity and confidence. His leadership at Tasheel Legal is defined by his commitment to excellence, his deep understanding of the Saudi market, and his unwavering dedication to client success."
    ],
    bioAr: [
  "المهندس فرج الحوطي هو قيادي تنفيذي صاحب رؤية، تمتد مسيرته المهنية لأكثر من 35 عاماً من القيادة التحويلية في القطاعات الحكومية والخاصة وغير الربحية في المملكة العربية السعودية. وبصفته الرئيس التنفيذي لشركة تسهيل للمحاماة والاستشارات القانونية، فإنه يجلب منظوراً تجارياً وتطلعياً نحو الأمام لتطوير الشركة المؤسسي وخدمة العملاء والنمو الاستراتيجي. خبرته لا مثيل لها في استراتيجية الشركات، والحوكمة، والمعاملات التجارية المعقدة، والشراكات بين القطاعين العام والخاص، وهيكلة الاستثمار، وتنفيذ المشاريع الكبرى.",
  "طوال مسيرته المهنية المتميزة، شغل المهندس الحوطي مناصب قيادية واستشارية عليا في بعض من أكثر المنظمات تأثيراً في المملكة وعلى المستوى العالمي. وقد عمل مع شركة أرامكو السعودية، وبوينغ السعودية، ووزارة الإسكان، وشركات رائدة في قطاعات العقار والصناعة والتقنية. وتشمل خبراته المساهمة في برامج استراتيجية تبلغ قيمتها مئات المليارات من الريالات السعودية، وهيكلة الشراكات الدولية، وقيادة المنظمات متعددة التخصصات، وتعزيز مبادرات التحول المؤسسي. هذا الاتساع في الخبرة يمنحه قدرة فريدة على التنقل في تعقيدات بيئة الأعمال السعودية ومواءمة الاستراتيجية القانونية مع الأهداف التجارية الشاملة.",
  "يمتلك المهندس الحوطي سجلاً استثنائياً في **المناقصات والمشتريات الحكومية**، حيث أشرف شخصياً على تسليم أكثر من 350 مناقصة بقيمة مليارات الريالات. تتيح له معرفته العميقة بوزارة الإسكان وأطر التطوير العقاري والمشتريات الحكومية أن تقدم شركة تسهيل مشورة استراتيجية لا مثيل لها للعملاء الذين يتنقلون في الشراكات بين القطاعين العام والخاص ومشاريع المملكة الكبرى. وهو يفهم ليس فقط المتطلبات القانونية، بل الحقائق التشغيلية والمالية والسياسية التي تحدد النجاح في العقود الحكومية السعودية.",
  "خارج القطاع العام، يجلب المهندس الحوطي خبرة تشغيلية واستراتيجية عميقة في القطاع الخاص. لديه قدرة مثبتة على اكتشاف وتشخيص المشاكل الهيكلية والتشغيلية العميقة داخل المؤسسات، وتصميم وتنفيذ العلاجات التي تعيد الربحية والكفاءة التشغيلية. يعتمد نهجه التشخيصي على أفضل الممارسات العالمية في إدارة التحول، مع التركيز على الاستقرار السريع وحماية السيولة وتحسين الأداء المستدام. وهو بارع في تقديم المشورة لمجالس الإدارة والفرق التنفيذية بشأن تحولات المؤسسات والتخطيط الاستراتيجي للأعمال ومفاوضات أصحاب المصلحة.",
  "يمتلك المهندس الحوطي أيضاً خبرة عميقة في **المشاريع المشتركة والاستحواذات**، حيث قام بهيكلة والتفاوض على شراكات ومعاملات معقدة عبر قطاعات متعددة. يقوم نهجه في المشاريع المشتركة على ركن **تنمية وتطوير الأعمال** في الشركة - فهو لا يصوغ الاتفاقيات فحسب، بل يهندس شراكات توائم الحوافز وتحمي مصالح الأقلية وتخلق قيمة تجارية دائمة. وهو ماهر بنفس القدر في عمليات الأسئلة والأجوبة (Q&A) للمعاملات المعقدة، مما يضمن تحديد وتقييم ومعالجة كل مخاطر جوهرية قبل الالتزام.",
  "بالإضافة إلى قيادته القانونية والاستراتيجية، يجلب المهندس الحوطي خلفية شخصية وعملية في التقنية. لقد قاد شخصياً تطوير ثلاث منصات حكومية من الطراز الأول، مما يمنحه فهماً عملياً لكيفية تصميم البنية التحتية الرقمية ونشرها وحوكمتها. تتيح له هذه الخبرة سد الفجوة بين الأطر القانونية والواقع التشغيلي، مما يضمن أن التكليفات المتعلقة بالتقنية تستند إلى التنفيذ الفعلي وليس النظرية المجردة.",
  "بصفته رئيساً تنفيذياً لشركة تسهيل، فإن المهندس الحوطي هو القوة الدافعة وراء التزام الشركة بـ **الهندسة القانونية الوقائية**. ويركز على مواءمة الاستراتيجية القانونية مع أهداف الأعمال، والكشف المبكر عن المخاطر التنظيمية والتعاقدية، وتعزيز حوكمة الشركات. وهو يضمن أن الشركة لا تتفاعل فقط مع المشاكل القانونية، بل تعمل بنشاط على هندسة الهياكل والمعاملات التي تحمي مصالح العملاء وتدعم النمو المستدام. قيادته تضمن أن كل حل قانوني هو عملي ومجدي تجارياً ومتوافق مع رؤية العميل طويلة الأجل.",
  "يحمل المهندس الحوطي درجة البكالوريوس في الهندسة من الولايات المتحدة، وأكمل دراساته العليا في إدارة الأعمال في المملكة المتحدة. وهو يجمع بين الصرامة التحليلية، والحكم التنفيذي، والمعرفة العملية ببيئة الأعمال السعودية لمساعدة المؤسسات على تجاوز التعقيدات بقدر أكبر من الوضوح والثقة. تتميز قيادته في شركة تسهيل بالتزامه بالتميز، وفهمه العميق للسوق السعودي، وتفانيه الذي لا يتزعزع في تحقيق نجاح العملاء."
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
      "His Excellency Ibrahim Nasser Al-Sayari stands as a pillar of the Saudi legal and judicial system, bringing an extraordinary 37-year legacy of distinguished judicial service to Tasheel Legal. As one of the Kingdom\'s most eminent judicial figures, His Excellency embodies the firm\'s core pillar of **Judicial Insight**. His tenure is defined by 13 years of service at the Court of Appeal and 24 years at the First Instance Court, granting him an unparalleled, inside-out understanding of the Saudi judicial system. This depth of experience allows him to navigate the most complex legal challenges from the highest appellate levels to the foundational courts with absolute precision.",
      "Throughout his decorated career, His Excellency has been entrusted with the most critical judicial leadership roles in the nation. He has served as the President of the Criminal Court in Riyadh, the President of the General Court in Dammam, and the President of the General Court in Al-Bad\' (NEOM). In these capacities, he has directly shaped the legal frameworks governing the Kingdom\'s most vital economic and urban centers, including the futuristic NEOM project. His leadership in these pivotal jurisdictions has ensured justice and regulatory integrity at the highest levels, making him a key asset for clients navigating the complexities of Saudi Vision 2030 and its mega-projects.",
      "Beyond his judicial duties, His Excellency is a preeminent legal scholar. He is a certified judicial instructor by the Supreme Judicial Council and the Judicial Training Center of the Ministry of Justice. His academic contributions are vast, having served as a key member of the preparatory committees responsible for drafting the Sharia Procedure Law regulations. This role involved contributing to the very fabric of Saudi legal procedure, ensuring that the laws governing the Kingdom are both robust and aligned with modern legal standards. His expertise in this area offers clients a unique advantage in understanding the procedural nuances of litigation.",
      "His Excellency has authored numerous pivotal legal research papers and training programs. These include a comprehensive training package for the procedures of land title deeds and the steps for issuing deeds on archaeological sites, as well as a program on real estate disputes and their resolution. He has also prepared a training package on nullity in the Procedure Law, and has conducted comparative research on the rulings of litigants\' attendance and absence in the Procedure Law, compared to Islamic jurisprudence. His research on the rule of \'No Harm and No Harming\' (La Darar wa la Dirar), and his studies on the rules of usury (Riba) and the provisions of wills, demonstrate a profound intellectual rigor that informs his strategic counsel.",
      "At Tasheel Legal, His Excellency\'s strategic counsel offers an unmatched predictive edge. He embodies the firm\'s **Preventative Engineering** pillar by identifying legal vulnerabilities before they escalate. He leverages his decades of experience to foresee how judicial circuits and courts of appeal will view a case, allowing clients to navigate complex litigation, regulatory challenges, and dispute resolution with absolute confidence. His ability to analyze a dispute from the perspective of a former Chief Judge of Appeal gives our clients a distinct advantage in settlement negotiations and courtroom strategy.",
      "His presence at the firm is a testament to our commitment to providing **Judicial Insight** that is both practical and predictive. He does not just offer legal advice; he offers a window into the mind of the judiciary. For clients facing high-stakes litigation or seeking to structure their operations to avoid future legal entanglements, His Excellency\'s counsel is invaluable. He represents the gold standard of Saudi judicial expertise, making him an indispensable member of the Tasheel Legal team."
    ],
    bioAr: [
      "فضيلة المستشار إبراهيم بن ناصر السياري هو ركن أساسي في النظام القانوني والقضائي السعودي، حيث يجلب إلى شركة تسهيل إرثاً استثنائياً من الخدمة القضائية المتميزة يمتد لـ 37 عاماً. وبصفته أحد أبرز القامات القضائية في المملكة، يجسّد فضيلته ركن **الرؤية القضائية السابقة** في الشركة. تتميز مسيرته بـ 13 عاماً من الخدمة في محكمة الاستئناف و 24 عاماً في محكمة الدرجة الأولى، مما يمنحه فهماً عميقاً وفريداً للنظام القضائي السعودي من الداخل. يتيح له هذا العمق من الخبرة التنقل في التحديات القانونية الأكثر تعقيداً من أعلى مستويات الاستئناف إلى المحاكم الأساسية بدقة مطلقة.",
      "طوال مسيرته الحافلة، أُنيطت بفضيلته أهم الأدوار القيادية القضائية في الدولة. فقد شغل منصب رئيس المحكمة الجزائية في الرياض، ورئيس المحكمة العامة في الدمام، ورئيس المحكمة العامة في البدع (نيوم). وفي هذه المناصب، ساهم بشكل مباشر في تشكيل الأطر القانونية التي تحكم أهم المراكز الاقتصادية والحضرية في المملكة، بما في ذلك مشروع نيوم المستقبلي. وقد ضمنت قيادته في هذه الولايات القضائية المحورية العدالة والنزاهة التنظيمية على أعلى المستويات، مما يجعله أصلاً رئيسياً للعملاء الذين يتنقلون في تعقيدات رؤية السعودية 2030 ومشاريعها الكبرى.",
      "إلى جانب مهامه القضائية، فإن فضيلته هو عالم قانوني بارز. وهو مدرس قضائي معتمد من المجلس الأعلى للقضاء ومركز التدريب العدلي بوزارة العدل. مساهماته الأكاديمية واسعة، حيث شغل منصب عضو رئيسي في اللجان التحضيرية المسؤولة عن صياغة لوائح نظام المرافعات الشرعية. تضمن هذا الدور المساهمة في نسيج الإجراءات القانونية السعودية، مما يضمن أن القوانين التي تحكم المملكة قوية ومتوافقة مع المعايير القانونية الحديثة. تقدم خبرته في هذا المجال ميزة فريدة للعملاء في فهم التفاصيل الإجرائية للتقاضي.",
      "ألّف فضيلته العديد من الأبحاث القانونية وبرامج التدريب المحورية. وتشمل هذه الأبحاث حقيبة تدريبية لإجراءات حجج الاستحكام وخطوات إخراج الصكوك على المواقع الأثرية، بالإضافة إلى برنامج حول النزاعات العقارية وطرق حلها. كما أعد حقيبة تدريبية حول البطلان في نظام المرافعات، وأجرى بحثاً مقارناً حول أحكام حضور الخصوم وغيابهم في نظام المرافعات مقارنة بالفقه الإسلامي. كما أن أبحاثه حول قاعدة 'لا ضرر ولا ضرار'، ودراساته حول أحكام الربا وأحكام الوصية، تُظهر صرامة فكرية عميقة تُثري مشورته الاستراتيجية.",
      "في شركة تسهيل، تقدم مشورة فضيلته الاستراتيجية ميزة تنبؤية لا مثيل لها. وهو يجسّد ركن **الهندسة الوقائية** من خلال تحديد الثغرات القانونية قبل تفاقمها. يستفيد من عقود من الخبرة لتوقع كيف ستنظر الدوائر القضائية ومحاكم الاستئناف إلى قضية ما، مما يسمح للعملاء بالتنقل في التقاضي المعقد والتحديات التنظيمية وتسوية المنازعات بثقة مطلقة. إن قدرته على تحليل النزاع من منظور رئيس محكمة استئناف سابق تمنح عملاءنا ميزة واضحة في مفاوضات التسوية واستراتيجية قاعة المحكمة.",
      "إن وجوده في الشركة هو شهادة على التزامنا بتقديم **الرؤية القضائية** التي تكون عملية وتنبؤية في آن واحد. إنه لا يقدم المشورة القانونية فحسب؛ بل يقدم نافذة على عقلية القضاء. بالنسبة للعملاء الذين يواجهون تقاضياً عالي المخاطر أو يسعون إلى هيكلة عملياتهم لتجنب الارتباطات القانونية المستقبلية، فإن مشورة فضيلته لا تقدر بثمن. وهو يمثل المعيار الذهبي للخبرة القضائية السعودية، مما يجعله عضواً لا غنى عنه في فريق شركة تسهيل."
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
      "Abdulrahman Al-Obeid is a leading authority in corporate and commercial law and the founder of Al-Obeid Law Firm (License No. 4018/23). He brings to Tasheel Legal a profound mastery of corporate structuring, specializing in the establishment, transformation, and restructuring of major corporate entities, joint-stock companies, and holdings. His expertise lies in structuring robust corporate vehicles that are fully compliant with the latest Saudi Companies Law and the ambitious initiatives of Vision 2030. He embodies the firm\'s **Growth Co-Development** pillar, ensuring that our clients\' legal frameworks are not just defensive, but actively conducive to long-term commercial success.",
      "Mr. Al-Obeid\s litigation practice is exceptionally strong and renowned across the Kingdom. He has successfully represented a diverse range of clients before the highest judicial and quasi-judicial bodies. This includes the General Courts, the Commercial Courts, and the Labor Courts, as well as the Board of Grievances, the Commercial Papers Committees, and the Banking Disputes Committees. His deep understanding of these forums allows him to navigate complex commercial disputes with a level of precision that is unmatched in the market.",
      "He is particularly renowned for his ability to mediate and resolve complex, high-stakes commercial disputes between partners and shareholders. This practice aligns perfectly with the firm\'s **Preventative Engineering** philosophy, which prioritizes resolving conflicts efficiently and strategically before they escalate into costly, public litigation. By achieving resolutions that preserve business relationships while securing our clients\' interests, he provides a distinct advantage to companies seeking to maintain operational continuity.",
      "Mr. Al-Obeid possesses advanced, meticulous skills in drafting and reviewing complex commercial contracts, internal corporate bylaws, HR regulations, and comprehensive corporate governance frameworks. He regularly advises on the preparation of internal policies and procedures, ensuring that client operations are streamlined and compliant. He is a strong advocate for integrating **Backend Tech Architecture** into corporate governance, utilizing legal intelligence workflows to automate audits and ensure regulatory compliance.",
      "His prestigious client portfolio spans major institutions across a variety of critical sectors, including construction, information technology, retail, real estate investment, and financing. He has successfully guided numerous companies through the complex process of converting from sole establishments to joint-stock companies, as well as managing the intricate legalities of mergers, acquisitions, and corporate transformations. His practical, results-oriented approach has earned him the trust of some of the Kingdom\'s most prominent business families and institutions.",
      "He is an active member of the Riyadh Chamber of Lawyers and a foundational member of the Saudi Bar Association. His commitment to the legal profession is evident in his continuous efforts to drive the standard of corporate legal practice in the Kingdom. At Tasheel Legal, he leverages his extensive network and deep commercial insight to help clients identify opportunities, mitigate risks, and structure deals that drive sustainable growth. He is the trusted advisor that clients turn to when navigating the complexities of the Saudi business landscape."
    ],
    bioAr: [
      "عبدالرحمن العبيد هو سلطة رائدة في قانون الشركات والأعمال ومؤسس مكتب العبيد للمحاماة (رقم الترخيص 4018/23). يجلب إلى شركة تسهيل إتقاناً عميقاً لهيكلة الشركات، متخصصاً في تأسيس وتحويل وإعادة هيكلة الكيانات المؤسسية الكبرى والشركات المساهمة والشركات القابضة. تكمن خبرته في هيكلة الكيانات المؤسسية القوية المتوافقة تماماً مع نظام الشركات السعودي الجديد ومبادرات رؤية 2030 الطموحة. وهو يجسّد ركن **تنمية وتطوير الأعمال** في الشركة، مما يضمن أن أطر عملائنا القانونية ليست دفاعية فحسب، بل مواتية بنشاط للنجاح التجاري طويل الأجل.",
      "ممارسة الأستاذ عبدالرحمن في التقاضي قوية للغاية ومشهود لها في جميع أنحاء المملكة. لقد نجح في تمثيل مجموعة متنوعة من العملاء أمام أعلى الهيئات القضائية وشبه القضائية. ويشمل ذلك المحاكم العامة، والمحاكم التجارية، والمحاكم العمالية، بالإضافة إلى ديوان المظالم، ولجان الأوراق المالية، ولجان النزاعات المصرفية. يسمح له فهمه العميق لهذه المحافل بالتنقل في النزاعات التجارية المعقدة بمستوى من الدقة لا مثيل له في السوق.",
      "وهو معروف بشكل خاص بقدرته على التوسط وحل النزاعات التجارية المعقدة وعالية المخاطر بين الشركاء والمساهمين. تتماشى هذه الممارسة تماماً مع فلسفة **الهندسة الوقائية** للشركة، والتي تعطي الأولوية لحل النزاعات بكفاءة واستراتيجية قبل أن تتطور إلى تقاضٍ مكلف وعلني. ومن خلال تحقيق حلول تحافظ على علاقات العمل مع تأمين مصالح عملائنا، فإنه يوفر ميزة واضحة للشركات التي تسعى إلى الحفاظ على الاستمرارية التشغيلية.",
      "يمتلك الأستاذ عبدالرحمن مهارات متقدمة ودقيقة في صياغة ومراجعة العقود التجارية المعقدة، واللوائح الداخلية للشركات، ولوائح شؤون الموظفين، وأطر حوكمة الشركات الشاملة. وهو يقدم المشورة بانتظام بشأن إعداد السياسات والإجراءات الداخلية، مما يضمن تبسيط عمليات العملاء وامتثالها. وهو مدافع قوي عن دمج **الحلول التقنية الخلفية** في حوكمة الشركات، باستخدام سير عمل الذكاء القانوني لأتمتة عمليات التدقيق وضمان الامتثال التنظيمي.",
      "تمتد محفظة عملائه المرموقة لتشمل مؤسسات كبرى في مجموعة متنوعة من القطاعات الحيوية، بما في ذلك البناء، وتقنية المعلومات، والتجزئة، والاستثمار العقاري، والتمويل. لقد وجه بنجاح العديد من الشركات عبر العملية المعقدة للتحول من مؤسسات فردية إلى شركات مساهمة، بالإضافة إلى إدارة التعقيدات القانونية للاندماجات والاستحواذات وإعادة الهيكلة. وقد أكسبه نهجه العملي والموجه نحو النتائج ثقة بعض من أبرز العائلات والمؤسسات التجارية في المملكة.",
      "وهو عضو نشط في لجنة المحامين بغرفة الرياض وعضو مؤسس في الهيئة السعودية للمحامين. يظهر التزامه بالمهنة القانونية في جهوده المستمرة لرفع معايير الممارسة القانونية للشركات في المملكة. في شركة تسهيل، يستفيد من شبكته الواسعة ورؤيته التجارية العميقة لمساعدة العملاء على تحديد الفرص، وتخفيف المخاطر، وهيكلة الصفقات التي تدفع النمو المستدام. وهو المستشار الموثوق الذي يلجأ إليه العملاء عند التنقل في تعقيدات بيئة الأعمال السعودية."
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
      "Bandar Al-Mutairi is a highly credentialed legal professional specializing in commercial law and international investments. He holds a Ph.D. in Law (Commercial Law and International Investments) and a Master's in International Commercial Law, providing him with a deep academic foundation that informs his practical approach to complex corporate transactions.",
      "With 8 years of professional legal experience, Mr. Al-Mutairi has developed a robust practice encompassing law practice, legal consultations, and judicial pleadings. He is a licensed attorney by the Saudi Ministry of Justice and an active member of the Saudi Bar Association. His expertise lies in drafting and reviewing intricate contracts, conducting rigorous legal analysis, and managing case files with meticulous attention to detail.",
      "At Tasheel Legal, Mr. Al-Mutairi applies his specialized knowledge in commercial law to support the firm's corporate clients. He is skilled in negotiation and dispute resolution, consistently working to protect client interests while facilitating smooth commercial operations. His ability to navigate both local and international legal frameworks makes him a valuable asset to the team, particularly in matters involving cross-border investments and corporate structuring."
    ],
    bioAr: [
      "بندر المطيري هو محامٍ يتمتع بمؤهلات عالية في القانون التجاري والاستثمارات الدولية. يحمل درجة الدكتوراه في القانون (القانون التجاري والاستثمارات الدولية) وماجستير في القانون التجاري الدولي، مما يمنحه أساساً أكاديمياً عميقاً يثري نهجه العملي في المعاملات المؤسسية المعقدة.",
      "يتمتع الأستاذ بندر بخبرة قانونية عملية تبلغ 8 سنوات، طور خلالها ممارسة قوية تشمل ممارسة المحاماة والاستشارات القانونية والمرافعات القضائية. وهو محامٍ مرخص من وزارة العدل وعضو نشط في الهيئة السعودية للمحامين. تكمن خبرته في صياغة ومراجعة العقود المعقدة، وإجراء التحليل القانوني الدقيق، وإدارة ملفات القضايا باهتمام كبير بالتفاصيل.",
      "في شركة تسهيل، يوظف الأستاذ بندر معرفته المتخصصة في القانون التجاري لدعم عملاء الشركة. وهو ماهر في التفاوض وتسوية المنازعات، ويعمل باستمرار على حماية مصالح العملاء مع تسهيل العمليات التجارية السلسة. قدرته على التنقل في الأطر القانونية المحلية والدولية تجعله أصلاً قيماً للفريق، لا سيما في المسائل المتعلقة بالاستثمارات عبر الحدود وهيكلة الشركات."
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
      "Ibrahim Al-Balawi is a licensed Saudi legal practitioner and a certified legal consultant, accredited by the Saudi Authority for Accredited Legal Practitioners (SASL) and the Ministry of Justice (License No. 48692). He holds a Higher Diploma in Law from the Judicial Training Center of the Ministry of Justice and a Bachelor's degree in Law from the University of Tabuk, graduating with Very Good honors.",
      "Mr. Al-Balawi brings practical, hands-on experience in contract drafting and legal risk assessment. He has a proven track record in drafting and reviewing service contracts, non-disclosure agreements, and supplier agreements, ensuring full legal compliance while mitigating contractual risks. His background includes providing legal consultations and representing clients in civil, labor, and commercial cases, as well as attending court sessions and coordinating with judicial authorities.",
      "At Tasheel Legal, Mr. Al-Balawi supports the firm's corporate and commercial practice by ensuring that client documentation is legally sound and strategically protective. His expertise in legal research, drafting memoranda, and utilizing platforms like Najiz and Microsoft Office makes him an efficient and reliable member of the team. He is bilingual in Arabic and English, allowing him to serve a diverse range of clients effectively."
    ],
    bioAr: [
      "إبراهيم البلوي هو محامٍ سعودي مرخص ومستشار قانوني معتمد من الهيئة السعودية لاعتماد الممارسين القانونيين (SASL) ووزارة العدل (ترخيص رقم 48692). يحمل دبلوم عالٍ في المحاماة من مركز التدريب العدلي بوزارة العدل، وبكالوريوس في القانون (الأنظمة) من جامعة تبوك بتقدير جيد جداً.",
      "يجلب الأستاذ إبراهيم خبرة عملية في صياغة العقود وتقييم المخاطر القانونية. لديه سجل حافل في صياغة ومراجعة عقود الخدمات واتفاقيات عدم الإفصاح وعقود الموردين، مما يضمن الامتثال القانوني الكامل مع تخفيف المخاطر التعاقدية. تشمل خلفيته تقديم الاستشارات القانونية وتمثيل العملاء في القضايا المدنية والعمالية والتجارية أمام مختلف المحاكم، بالإضافة إلى حضور الجلسات القضائية والتنسيق مع الجهات القضائية.",
      "في شركة تسهيل، يدعم الأستاذ إبراهيم ممارسة الشركات والأعمال في الشركة من خلال ضمان أن وثائق العملاء سليمة قانونياً وتوفر حماية استراتيجية. خبرته في البحث القانوني وإعداد المذكرات واستخدام منصات مثل ناجز ومايكروسوفت أوفيس تجعله عضواً فعالاً وموثوقاً في الفريق. وهو يتقن اللغتين العربية والإنجليزية، مما يتيح له خدمة مجموعة متنوعة من العملاء بفعالية."
    ]
  }
];