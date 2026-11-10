export type TeamMember = {
  slug: string;
  nameEn: string;
  nameAr: string;
  fullNameEn: string;
  fullNameAr: string;
  roleEn: string;
  roleAr: string;
  tier: 'executive' | 'partner' | 'associate';
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
    fullNameEn: "Eng. Faraj Alhouty",
    fullNameAr: "المهندس فرج الحوطي",
    roleEn: "Chief Executive Officer",
    roleAr: "الرئيس التنفيذي",
    tier: "executive",
    image: "/team/faraj.jpg",
    bioEn: [
      "Eng. Faraj Alhouty is a visionary senior executive whose career spans more than 35 years of transformative leadership across Saudi Arabia's public, private, and non-profit sectors. As the Chief Executive Officer of Tasheel Legal, he brings a commercially grounded, forward-looking perspective to the firm's institutional development, client service, and strategic growth. His expertise is unparalleled in corporate strategy, governance, complex commercial transactions, public-private partnerships, investment structuring, and large-scale project execution.",
      "Throughout his distinguished career, Eng. Alhouty has held senior leadership and advisory positions with some of the most influential organizations in the Kingdom and globally. He has served with Saudi Aramco, Boeing Saudi Arabia, the Ministry of Housing, and leading real estate, industrial, and technology enterprises. His experience includes contributing to strategic programmes valued at hundreds of billions of Saudi riyals, structuring international partnerships, leading multidisciplinary organisations, and advancing institutional transformation initiatives. This breadth of experience gives him a unique ability to navigate the complexities of the Saudi business landscape and align legal strategy with overarching commercial objectives.",
      "Eng. Alhouty possesses an exceptional track record in **government tenders and procurement**, having personally overseen the delivery of more than 350 tenders with billions of riyals awarded. His deep fluency in the Ministry of Housing, real estate development, and government procurement frameworks allows Tasheel Legal to offer unmatched strategic counsel to clients navigating the Kingdom's most complex public-private partnerships and giga-project mandates. He understands not just the legal requirements, but the operational, financial, and political realities that determine success in Saudi government contracting.",
      "Beyond the public sector, Eng. Alhouty brings deep private sector operational and strategic expertise. He has a proven ability to detect and diagnose deep structural and operational problems within enterprises, and to design and implement remedies that restore profitability and operational efficiency. His diagnostic approach draws on global best practices in turnaround management, focusing on rapid stabilization, liquidity protection, and sustainable performance improvement. He is adept at advising boards and executive teams on enterprise transformations, strategic business planning, and stakeholder negotiations.",
      "Eng. Alhouty also possesses deep experience in **joint ventures and acquisitions**, having structured and negotiated complex partnerships and transactions across multiple sectors. His approach to JVs is rooted in the firm's **Growth Co-Development** pillar—he does not simply draft agreements, but engineers partnerships that align incentives, protect minority interests, and create lasting commercial value. He is equally skilled in Q&A processes for complex transactions, ensuring that every material risk is identified, assessed, and addressed before commitment.",
      "In addition to his legal and strategic leadership, Eng. Alhouty brings a personal, hands-on background in technology. He has personally led the development of three top-tier government platforms, giving him a practical understanding of how digital infrastructure is designed, deployed, and governed. This experience allows him to bridge the gap between legal frameworks and operational reality, ensuring that technology-related mandates are grounded in real-world execution rather than abstract theory.",
      "As CEO of Tasheel Legal, Eng. Alhouty is the driving force behind the firm's commitment to **Preventative Legal Engineering**. He focuses on aligning legal strategy with business objectives, identifying regulatory and contractual risks early, and strengthening corporate governance. He ensures that the firm does not just react to legal problems, but actively engineers structures and transactions that protect client interests and support sustainable growth. His leadership ensures that every legal solution is pragmatic, commercially viable, and aligned with the client's long-term vision.",
      "Eng. Alhouty holds a Bachelor of Science in Engineering from the United States and has completed postgraduate studies in Business Administration in the United Kingdom. He combines analytical rigour, executive judgment, and practical knowledge of the Saudi business environment to help organisations navigate complexity with greater clarity and confidence. His leadership at Tasheel Legal is defined by his commitment to excellence, his deep understanding of the Saudi market, and his unwavering dedication to client success."
    ],
    bioAr: [
      "المهندس فرج الحوطي هو قيادي تنفيذي صاحب رؤية، تمتد مسيرته المهنية لأكثر من 35 عاماً من القيادة التحويلية في القطاعات الحكومية والخاصة وغير الربحية في المملكة العربية السعودية. وبصفته الرئيس التنفيذي لشركة تسهيل للمحاماة والاستشارات القانونية، فإنه يجلب منظوراً تجارياً وتطلعياً نحو الأمام لتطوير الشركة المؤسسي وخدمة العملاء والنمو الاستراتيجي. خبرته لا مثيل لها في استراتيجية الشركات، والحوكمة، والمعاملات التجارية المعقدة، والشراكات بين القطاعين العام والخاص، وهيكلة الاستثمار، وتنفيذ المشاريع الكبرى.",
      "طوال مسيرته المهنية المتميزة، شغل المهندس الحوطي مناصب قيادية واستشارية عليا في بعض من أكثر المنظمات تأثيراً في المملكة وعلى المستوى العالمي. وقد عمل مع شركة أرامكو السعودية، وبوينغ السعودية، ووزارة الإسكان، وشركات رائدة في قطاعات العقار والصناعة والتقنية. وتشمل خبراته المساهمة في برامج استراتيجية تبلغ قيمتها مئات المليارات من الريالات السعودية، وهيكلة الشراكات الدولية، وقيادة المنظمات متعددة التخصصات، وتعزيز مبادرات التحول المؤسسي. هذا الاتساع في الخبرة يمنحه قدرة فريدة على التنقل في تعقيدات بيئة الأعمال السعودية ومواءمة الاستراتيجية القانونية مع الأهداف التجارية الشاملة.",
      "يمتلك المهندس الحوطي سجلاً استثنائياً في **المناقصات والمشتريات الحكومية**، حيث أشرف شخصياً على تسليم أكثر من 350 مناقصة بقيمة مليارات الريالات. تتيح له معرفته العميقة بوزارة الإسكان وأطر التطوير العقاري والمشتريات الحكومية أن تقدم شركة تسهيل مشورة استراتيجية لا مثيل لها للعملاء الذين يتنقلون في الشراكات بين القطاعين العام والخاص ومشاريع المملكة الكبرى. وهو يفهم ليس فقط المتطلبات القانونية، بل الحقائق التشغيلية والمالية والسياسية التي تحدد النجاح في السعودية.",
      "خارج القطاع العام، يجلب المهندس الحوطي خبرة تشغيلية واستراتيجية عميقة في القطاع الخاص. لديه قدرة مثبتة على اكتشاف وتشخيص المشاكل الهيكلية والتشغيلية العميقة داخل المؤسسات، وتصميم وتنفيذ العلاجات التي تعيد الربحية والكفاءة التشغيلية. يعتمد نهجه التشخيصي على أفضل الممارسات العالمية في إدارة التحول، مع التركيز على الاستقرار السريع وحماية السيولة وتحسين الأداء المستدام. وهو بارع في تقديم المشورة لمجالس الإدارة والفرق التنفيذية بشأن تحولات المؤسسات والتخطيط الاستراتيجي للأعمال ومفاوضات أصحاب المصلحة.",
      "يمتلك المهندس الحوطي أيضاً خبرة عميقة في **المشاريع المشتركة والاستحواذات**، حيث قام بهيكلة والتفاوض على شراكات ومعاملات معقدة عبر قطاعات متعددة. يقوم نهجه في المشاريع المشتركة على ركن **تنمية وتطوير الأعمال** في الشركة - فهو لا يصوغ الاتفاقيات فحسب، بل يهندس شراكات توائم الحوافز وتحمي مصالح الأقلية وتخلق قيمة تجارية دائمة. وهو ماهر بنفس القدر في عمليات الأسئلة والأجوبة (Q&A) للمعاملات المعقدة، مما يضمن تحديد وتقييم ومعالجة كل مخاطر جوهرية قبل الالتزام.",
      "بالإضافة إلى قيادته القانونية والاستراتيجية، يجلب المهندس الحوطي خبرة شخصية وعملية في التقنية. لقد قاد شخصياً تطوير ثلاث منصات حكومية من الطراز الأول، مما يمنحه فهماً عملياً لكيفية تصميم البنية التحتية الرقمية ونشرها وحوكمتها. تتيح له هذه الخبرة سد الفجوة بين الأطر القانونية والواقع التشغيلي، مما يضمن أن التكليفات المتعلقة بالتقنية تستند إلى التنفيذ الفعلي وليس النظرية المجردة.",
      "بصفته رئيساً تنفيذياً لشركة تسهيل، فإن المهندس الحوطي هو القوة الدافعة وراء التزام الشركة بـ **الهندسة القانونية الوقائية**. ويركز على مواءمة الاستراتيجية القانونية مع أهداف الأعمال، والكشف المبكر عن المخاطر التنظيمية والتعاقدية، وتعزيز حوكمة الشركات. وهو يضمن أن الشركة لا تتفاعل فقط مع المشاكل القانونية، بل تعمل بنشاط على هندسة الهياكل والمعاملات التي تحمي مصالح العملاء وتدعم النمو المستدام. قيادته تضمن أن كل حل قانوني هو عملي ومجدي تجارياً ومتوافق مع رؤية العميل طويلة الأجل.",
      "يحمل المهندس الحوطي درجة البكالوريوس في الهندسة من الولايات المتحدة، وأكمل دراساته العليا في إدارة الأعمال في المملكة المتحدة. وهو يجمع بين الصرامة التحليلية، والحكم التنفيذي، والمعرفة العملية ببيئة الأعمال السعودية لمساعدة المؤسسات على تجاوز التعقيدات بقدر أكبر من الوضوح والثقة. تتميز قيادته في شركة تسهيل بالتزامه بالتميز، وفهمه العميق للسوق السعودي، وتفانيه الذي لا يتزعزع في تحقيق نجاح العملاء."
    ]
  },
  {
    slug: "dr-meshaan-bin-ejrif",
    nameEn: "Dr. Meshaan Bin Ejrif",
    nameAr: "د. مشعان بن عجرف",
    fullNameEn: "Dr. Meshaan Bin Ejrif",
    fullNameAr: "د. مشعان بن عجرف",
    roleEn: "Managing Partner",
    roleAr: "الشريك المؤسس",
    tier: "executive",
    image: "/team/meshaan.jpg",
    bioEn: [
      "Dr. Meshaan Bin Ejrif is a highly specialized corporate and regulatory lawyer, bringing a unique blend of academic excellence and high-stakes practical experience to Tasheel Legal. He holds a Ph.D. in Law (Commercial Disputes & Arbitration) and a Master of Laws (LLM), equipping him with a deep understanding of complex legal frameworks and their application in the Saudi market.",
      "His practice is defined by his exceptional ability to structure, license, and ensure the regulatory compliance of large corporations. He has successfully guided multinational Fortune 500 companies through the complexities of Saudi business law, structuring their market entry and expansions with strategic precision. His expertise in M&A, tax strategies, and contract negotiations is specifically designed to meet the unique needs of large enterprises.",
      "At Tasheel Legal, Dr. Meshaan embodies the firm's **Preventative Engineering** pillar. He specializes in identifying regulatory bottlenecks and compliance gaps before they escalate, ensuring that his clients' legal structures are not just compliant, but strategically favorable for sustainable growth. He is an active member of the academic community at Imam Muhammad ibn Saud Islamic University, constantly updating his knowledge to provide clients with the most current legal insights.",
      "Dr. Meshaan's approach aligns perfectly with our **Growth Co-Development** philosophy. As Managing Partner, he leads the firm's strategic direction, ensuring that Tasheel Legal remains at the forefront of regulatory compliance and corporate law in the Kingdom. He is not just a legal advisor, but a strategic business partner to our clients, guiding them through complex transformations and empowering them to achieve sustainable growth. His leadership, combined with his deep analytical skills, is the driving force behind our mission to protect and elevate large institutions in Saudi Arabia."
    ],
    bioAr: [
      "الدكتور مشعان بن عجرف هو محامٍ متخصص في قانون الشركات والامتثال التنظيمي، يجلب إلى شركة تسهيل مزيجاً فريداً من التميز الأكاديمي والخبرة العملية عالية المستوى. يحمل درجة الدكتوراه في القانون (الوساطة في حل النزاعات التجارية) وماجستير في القانون (LLM)، مما يمنحه فهماً عميقاً للأطر القانونية المعقدة وتطبيقها في السوق السعودي.",
      "تتميز ممارسته بقدرته الاستثنائية على هيكلة وترخيص وضمان الامتثال التنظيمي للشركات الكبرى. لقد نجح في توجيه شركات Fortune 500 العالمية عبر تعقيدات نظام الأعمال السعودي، وهيكلة دخولها وتوسعها بدقة استراتيجية. وتشمل خبرته في عمليات الاندماج والاستحواذ، والاستراتيجيات الضريبية، والمفاوضات التعاقدية، المصممة خصيصاً لتلبية الاحتياجات الفريدة للمؤسسات الكبيرة.",
      "في شركة تسهيل، يجسد الدكتور مشعان ركن **الهندسة الوقائية** في الشركة. ويتخصص في تحديد الاختناقات التنظيمية والثغرات في الامتثال قبل تفاقمها، مما يضمن أن هياكل عملائه القانونية ليست متوافقة فحسب، بل مواتية استراتيجياً للنمو المستدام. وهو عضو نشط في المجتمع الأكاديمي بجامعة الإمام محمد بن سعود الإسلامية، ويقوم بتحديث معرفته باستمرار لتقديم أحدث الرؤى القانونية لعملائه.",
      "يتماشى نهج الدكتور مشعان تماماً مع فلسفة **تنمية وتطوير الأعمال** لدينا. وبصفته الشريك المؤسس، فإنه يقود التوجه الاستراتيجي للشركة، مما يضمن بقاء شركة تسهيل في طليعة الامتثال التنظيمي وقانون الشركات في المملكة. وهو ليس مجرد مستشار قانوني، بل شريك أعمال استراتيجي لعملائنا، يوجههم عبر التحولات المعقدة ويمكنهم من تحقيق النمو المستدام. إن قيادته، إلى جانب مهاراته التحليلية العميقة، هي القوة الدافعة وراء مهمتنا لحماية وتمكين المؤسسات الكبيرة في المملكة العربية السعودية."
    ]
  },
  {
    slug: "dr-mohammed-bin-ejrim",
    nameEn: "Dr. Mohammed Bin Ejrim",
    nameAr: "د. محمد بن عجرف",
    fullNameEn: "Dr. Mohammed Bin Ejrim",
    fullNameAr: "د. محمد بن عجرف",
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
    nameEn: "Partner, His Excellency",
    nameAr: "الشريك الشيخ",
    fullNameEn: "Sheikh Ibrahim Nasser Al-Sayari",
    fullNameAr: "إبراهيم بن ناصر السياري",
    roleEn: "Senior Counselor | Former Appeals Court President",
    roleAr: "مستشار أعلى | رئيس محكمة استئناف سابق",
    tier: "partner",
    image: "/team/ibrahim.jpg",
    bioEn: [
      "His Excellency Counselor Ibrahim bin Nasser Al-Sayari is a cornerstone of the Saudi legal and judicial system, bringing to Tasheel Law an exceptional legacy of distinguished judicial service spanning 37 years. As one of the Kingdom's most prominent judicial figures, His Excellency embodies the firm's Prior Judicial Vision pillar. His career includes 13 years on the Court of Appeal and 24 years on first-instance courts, giving him a deep and unique understanding of the Saudi judicial system from within. This depth of experience allows him to navigate the most complex legal challenges, from the highest levels of appeal down to the trial courts, with absolute precision.",
      "Throughout his distinguished career, His Excellency held the nation's most senior judicial leadership positions, serving as President of the Criminal Court in Riyadh, President of the General Court in Dammam, and President of the General Court in Al-Bad' (NEOM). In these roles, he directly shaped the legal frameworks governing some of the Kingdom's most important economic and urban centers, including the future NEOM project, ensuring justice and regulatory integrity at the highest levels and making him a key asset for clients navigating the complexities of Saudi Vision 2030 and its major projects.",
      "Beyond his judicial duties, His Excellency is a distinguished legal scholar. He is a certified judicial trainer accredited by the Supreme Judicial Council and the Ministry of Justice's Judicial Training Center. His academic contributions are extensive, including serving as a key member of the preparatory committees responsible for drafting the executive regulations of the Law of Pleading. This role placed him at the heart of Saudi legal procedure, helping ensure the Kingdom's governing laws remain robust and aligned with modern legal standards, giving clients a unique advantage in understanding the procedural details of litigation.",
      "His Excellency has authored numerous legal studies and pivotal training programs, including a training package on the procedures for deeds of continuous possession (hujaj al-istihkam) and the steps for issuing title deeds over archaeological sites, as well as a program on real estate disputes and their resolution. He has also prepared a training package on nullity under the Law of Pleading, and conducted comparative research on the rules governing litigants' attendance and absence under the Law of Pleading compared with Islamic jurisprudence. His research on the rule of 'no harm and no reciprocating harm,' alongside his studies on the rulings of usury (riba) and bequests, demonstrate a depth of intellectual rigor that enriches his strategic counsel.",
      "At Tasheel Law, His Excellency's strategic counsel offers an unmatched predictive advantage. He embodies the firm's Preventive Engineering pillar by identifying legal gaps before they escalate, drawing on decades of experience to anticipate how judicial circuits and appellate courts will view a case, enabling clients to navigate complex litigation, regulatory challenges, and dispute resolution with absolute confidence. His ability to analyze a dispute from the perspective of a former Court of Appeal president gives our clients a clear advantage in settlement negotiations and courtroom strategy.",
      "His presence at the firm is a testament to our commitment to delivering judicial vision that is both practical and predictive. He offers not just legal advice, but a window into judicial thinking. For clients facing high-stakes litigation or seeking to structure their operations to avoid future legal entanglements, His Excellency's counsel is invaluable. He represents the gold standard of Saudi judicial expertise, making him an indispensable member of the Tasheel Law team."
    ],
    bioAr: [
      "فضيلة الشيخ المحامي إبراهيم بن ناصر السياري هو ركن أساسي في النظام القانوني والقضائي السعودي، حيث يجلب إلى شركة تسهيل إرثا استثنائيا من الخدمة القضائية المتميزة يمتد لسبعة وثلاثين عاما. وبصفته أحد أبرز القامات القضائية في المملكة، يجسد فضيلته ركن الرؤية القضائية السابقة في الشركة. تتميز مسيرته بثلاثة عشر عاما من الخدمة في محكمة الاستئناف وأربعة وعشرين عاما في محكمة الدرجة الأولى، مما يمنحه فهما عميقا وفريدا للنظام القضائي السعودي من الداخل. يتيح له هذا العمق من الخبرة التنقل في التحديات القانونية الأكثر تعقيدا من أعلى مستويات الاستئناف إلى المحاكم الأساسية بدقة مطلقة.",
      "طوال مسيرته الحافلة، أنيطت بفضيلته أهم الأدوار القيادية القضائية في الدولة. فقد شغل منصب رئيس المحكمة الجزائية في الرياض، ورئيس المحكمة العامة في الدمام، ورئيس المحكمة العامة في البدع (نيوم). وفي هذه المناصب، ساهم بشكل مباشر في تشكيل الأطر القانونية التي تحكم أهم المراكز الاقتصادية والحضرية في المملكة، بما في ذلك مشروع نيوم المستقبلي، وقد ضمنت قيادته في هذه الولايات القضائية المحورية العدالة والنزاهة التنظيمية على أعلى المستويات، مما يجعله أصلا رئيسيا للعملاء الذين يتنقلون في تعقيدات رؤية السعودية 2030 ومشاريعها الكبرى.",
      "إلى جانب مهامه القضائية، فإن فضيلته عالم قانوني بارز. وهو مدرس قضائي معتمد من المجلس الأعلى للقضاء ومركز التدريب العدلي بوزارة العدل. مساهماته الأكاديمية واسعة، حيث شغل منصب عضو رئيسي في اللجان التحضيرية المسؤولة عن صياغة لوائح نظام المرافعات الشرعية. تضمن هذا الدور مساهمته في نسيج الإجراءات القانونية السعودية، مما يضمن أن القوانين التي تحكم المملكة قوية ومتوافقة مع المعايير القانونية الحديثة. تقدم خبرته في هذا المجال ميزة فريدة للعملاء في فهم التفاصيل الإجرائية للتقاضي.",
      "ألف فضيلته العديد من الأبحاث القانونية وبرامج التدريب المحورية. وتشمل هذه الأبحاث حقيبة تدريبية لإجراءات حجج الاستحكام وخطوات إخراج الصكوك على المواقع الأثرية، بالإضافة إلى برنامج حول النزاعات العقارية وطرق حلها. كما أعد حقيبة تدريبية حول البطلان في نظام المرافعات، وأجرى بحثا مقارنا حول أحكام حضور الخصوم وغيابهم في نظام المرافعات مقارنة بالفقه الإسلامي. كما أن أبحاثه حول قاعدة لا ضرر ولا ضرار، ودراساته حول أحكام الربا وأحكام الوصية، تظهر صرامة فكرية عميقة تثري مشورته الاستراتيجية.",
      "في شركة تسهيل، تقدم مشورة فضيلته الاستراتيجية ميزة تنبؤية لا مثيل لها. وهو يجسد ركن الهندسة الوقائية من خلال تحديد الثغرات القانونية قبل تفاقمها. يستفيد من عقود من الخبرة لتوقع كيف ستنظر الدوائر القضائية ومحاكم الاستئناف إلى قضية ما، مما يسمح للعملاء بالتنقل في التقاضي المعقد والتحديات التنظيمية وتسوية المنازعات بثقة مطلقة. إن قدرته على تحليل النزاع من منظور رئيس محكمة استئناف سابق تمنح عملاءنا ميزة واضحة في مفاوضات التسوية واستراتيجية قاعة المحكمة.",
      "إن وجوده في الشركة شهادة على التزامنا بتقديم الرؤية القضائية التي تكون عملية وتنبؤية في آن واحد. إنه لا يقدم المشورة القانونية فحسب، بل يقدم نافذة على عقلية القضاء. بالنسبة للعملاء الذين يواجهون تقاضيا عالي المخاطر أو يسعون إلى هيكلة عملياتهم لتجنب الارتباطات القانونية المستقبلية، فإن مشورة فضيلته لا تقدر بثمن. وهو يمثل المعيار الذهبي للخبرة القضائية السعودية، مما يجعله عضوا لا غنى عنه في فريق شركة تسهيل."
    ]
  },
  {
    slug: "abdulrahman-al-obeid",
    nameEn: "Partner, His Excellency",
    nameAr: "الشريك الشيخ",
    fullNameEn: "Sheikh Abdulrahman Sulaiman Alobaid",
    fullNameAr: "عبدالرحمن سليمان العبيد",
    roleEn: "Senior Counselor | Corporate and Business Law",
    roleAr: "مستشار أعلى | قانون الشركات والأعمال",
    tier: "partner",
    image: "/team/abdulrahman.jpg",
    bioEn: [
      "His Excellency Sheikh Abdulrahman Alobaid is a leading authority in corporate and business law, and founder of Alobaid Law Office for Legal Advocacy and Consultancy (License No. 836/40, dated 23/8/1440H). He brings to Tasheel Law a deep mastery of corporate structuring, having led the legal procedures to establish numerous companies and convert family-owned commercial entities into joint-stock companies, alongside structuring joint-stock and holding companies and amending their incorporation contracts in full alignment with the new Saudi Companies Law and Vision 2030 initiatives. He embodies the firm's Business Development pillar, ensuring our clients' legal frameworks are not merely defensive but actively favorable to long-term commercial success.",
      "His Excellency's litigation practice extends to representing clients before the General and Commercial Courts, the Board of Grievances, the Committee for the Resolution of Securities Disputes, the Office for the Resolution of Commercial Paper Disputes, the Banking Disputes Committee, and the Committee for Review and Adjudication of Competition Law Violations, in addition to enforcing judgments and commercial instruments before the Enforcement Court. This broad standing before the Kingdom's highest judicial and quasi-judicial bodies allows him to navigate complex commercial disputes with a level of precision unmatched in the market.",
      "He is particularly well known for his ability to mediate and resolve complex, high-stakes commercial disputes between partners and shareholders. This practice aligns closely with the firm's Preventive Engineering philosophy, which prioritizes resolving disputes efficiently and strategically before they escalate into costly, public litigation. By achieving solutions that preserve business relationships while securing our clients' interests, he offers a clear advantage to companies seeking to maintain operational continuity.",
      "His Excellency holds advanced, precise skills in drafting and reviewing complex commercial contracts, corporate bylaws, HR regulations, and comprehensive corporate governance frameworks, as well as preparing and reviewing financial regulations, administrative instructions, and internal work procedures. He regularly advises on the preparation of internal policies and procedures, keeping clients' operations streamlined and compliant, and is a strong advocate for embedding back-end technology solutions into corporate governance, drawing on legal-intelligence workflows to automate audit processes and ensure regulatory compliance.",
      "His Excellency's distinguished client portfolio spans major institutions across a range of vital sectors, including construction, information technology, retail, real estate investment, and finance: among them the General Organization for Social Insurance (GOSI), Al-Bina Al-Areeq Establishment, Mubdi Technology for Information Technology Establishment, Mulab Trading Establishment, the Cooperative Real Estate Investment Company, Al-Hejaz Contracting Company, Al-Andalus Real Estate Company, Al-Amthal Financial Leasing Company, and Tabraak Contracting Company, in addition to a large number of commercial, financial, and personal-status matters for individual clients. He is a member of the Lawyers Committee at the Riyadh Chamber and a founding member of the Saudi Bar Association. At Tasheel Law, His Excellency draws on his extensive network and deep commercial insight to help clients identify opportunities, mitigate risk, and structure deals that drive sustainable growth, and is the trusted advisor clients turn to when navigating the complexities of the Saudi business environment."
    ],
    bioAr: [
      "فضيلة الشيخ عبدالرحمن العبيد سلطة رائدة في قانون الشركات والأعمال، ومؤسس مكتب العبيد للمحاماة والاستشارات القانونية (الترخيص رقم 836/40 وتاريخ 23/8/1440هـ). يجلب فضيلته إلى شركة تسهيل إتقانا عميقا لهيكلة الشركات، حيث قاد الإجراءات القانونية لتأسيس عدد من الشركات وتحويل كيانات تجارية عائلية إلى شركات مساهمة، إلى جانب هيكلة الشركات المساهمة والشركات القابضة وتعديل عقود تأسيسها بما يتوافق تماما مع نظام الشركات السعودي الجديد ومبادرات رؤية 2030. وهو يجسد ركن تنمية وتطوير الأعمال في الشركة، بما يضمن أن أطر عملائنا القانونية ليست دفاعية فحسب، بل مواتية بنشاط للنجاح التجاري طويل الأجل.",
      "تمتد ممارسة فضيلته في التقاضي لتشمل تمثيل العملاء أمام المحاكم العامة والتجارية، وديوان المظالم، ولجنة الفصل في منازعات الأوراق المالية، ومكتب الفصل في منازعات الأوراق التجارية، واللجنة المصرفية، ولجنة النظر والفصل في مخالفات نظام المنافسة، إلى جانب تنفيذ الأحكام والأوراق التجارية لدى محكمة التنفيذ. يتيح له هذا الحضور الواسع أمام أعلى الهيئات القضائية وشبه القضائية في المملكة التنقل في النزاعات التجارية المعقدة بمستوى من الدقة لا مثيل له في السوق.",
      "وهو معروف بشكل خاص بقدرته على التوسط وحل النزاعات التجارية المعقدة وعالية المخاطر بين الشركاء والمساهمين. تتماشى هذه الممارسة تماما مع فلسفة الهندسة الوقائية للشركة، والتي تعطي الأولوية لحل النزاعات بكفاءة واستراتيجية قبل أن تتطور إلى تقاض مكلف وعلني. ومن خلال تحقيق حلول تحافظ على علاقات العمل مع تأمين مصالح عملائنا، فإنه يوفر ميزة واضحة للشركات التي تسعى إلى الحفاظ على الاستمرارية التشغيلية.",
      "يمتلك فضيلته مهارات متقدمة ودقيقة في صياغة ومراجعة العقود التجارية المعقدة، واللوائح الداخلية للشركات، ولوائح شؤون الموظفين، وأطر حوكمة الشركات الشاملة، إلى جانب إعداد ومراجعة اللوائح المالية والتعليمات الإدارية ولوائح إجراءات العمل الداخلية. وهو مدافع قوي عن دمج الحلول التقنية الخلفية في حوكمة الشركات، مستفيدا من سير عمل الذكاء القانوني لأتمتة عمليات التدقيق وضمان الامتثال التنظيمي.",
      "تمتد محفظة عملاء فضيلته المرموقة لتشمل مؤسسات بارزة في قطاعات حيوية متعددة، منها البناء وتقنية المعلومات والتجزئة والاستثمار العقاري والتمويل، ومن بينها المؤسسة العامة للتقاعد، ومؤسسة البناء العريق، ومؤسسة مبدع التقنية لتقنية المعلومات، ومؤسسة ملاب للتجارة، والشركة التعاونية للاستثمار العقاري، وشركة الحجاز للمقاولات، وشركة الأندلس العقارية، وشركة الأمثل للتأجير التمويلي، وشركة تبراك للمقاولات، إضافة إلى عدد كبير من القضايا التجارية والمالية والأحوال الشخصية لعدد من الأفراد. وهو عضو في لجنة المحامين بغرفة الرياض، وعضو أساسي في الهيئة السعودية للمحامين. في شركة تسهيل، يستفيد فضيلته من شبكته الواسعة ورؤيته التجارية العميقة لمساعدة العملاء على تحديد الفرص وتخفيف المخاطر وهيكلة الصفقات التي تدفع النمو المستدام، وهو المستشار الموثوق الذي يلجأ إليه العملاء عند التنقل في تعقيدات بيئة الأعمال السعودية."
    ]
  },

  // --- TIER 3: ASSOCIATES / LINE LAWYERS ---
  {
    slug: "bandar-al-mutairi",
    nameEn: "Dr. Bandar Salem Al-Mutairi",
    nameAr: "د. بندر سالم المطيري",
    fullNameEn: "Dr. Bandar Salem Al-Mutairi",
    fullNameAr: "د. بندر سالم المطيري",
    roleEn: "Associate | Commercial Law & International Investments",
    roleAr: "محامي أول | القانون التجاري والاستثمارات الدولية",
    tier: "associate",
    image: "/team/bandar.jpg",
    bioEn: [
      "Dr. Bandar Al-Mutairi is a highly credentialed legal professional specializing in commercial law and international investments. He holds a Ph.D. in Law (Commercial Law and International Investments) and a Master's in International Commercial Law, providing him with a deep academic foundation that informs his practical approach to complex corporate transactions.",
      "With 8 years of professional legal experience, Dr. Al-Mutairi has developed a robust practice encompassing law practice, legal consultations, and judicial pleadings. He is a licensed attorney by the Saudi Ministry of Justice and an active member of the Saudi Bar Association. His expertise lies in drafting and reviewing intricate contracts, conducting rigorous legal analysis, and managing case files with meticulous attention to detail.",
      "At Tasheel Legal, Dr. Al-Mutairi applies his specialized knowledge in commercial law to support the firm's corporate clients. He is skilled in negotiation and dispute resolution, consistently working to protect client interests while facilitating smooth commercial operations. His ability to navigate both local and international legal frameworks makes him a valuable asset to the team, particularly in matters involving cross-border investments and corporate structuring."
    ],
    bioAr: [
      "د. بندر المطيري هو محامٍ يتمتع بمؤهلات عالية في القانون التجاري والاستثمارات الدولية. يحمل درجة الدكتوراه في القانون (القانون التجاري والاستثمارات الدولية) وماجستير في القانون التجاري الدولي، مما يمنحه أساساً أكاديمياً عميقاً يثري نهجه العملي في المعاملات المؤسسية المعقدة.",
      "يتمتع الدكتور بندر بخبرة قانونية عملية تبلغ 8 سنوات، طور خلالها ممارسة قوية تشمل ممارسة المحاماة والاستشارات القانونية والمرافعات القضائية. وهو محامٍ مرخص من وزارة العدل وعضو نشط في الهيئة السعودية للمحامين. تكمن خبرته في صياغة ومراجعة العقود المعقدة، وإجراء التحليل القانوني الدقيق، وإدارة ملفات القضايا باهتمام كبير بالتفاصيل.",
      "في شركة تسهيل، يوظف الدكتور بندر معرفته المتخصصة في القانون التجاري لدعم عملاء الشركة. وهو ماهر في التفاوض وتسوية المنازعات، ويعمل باستمرار على حماية مصالح العملاء مع تسهيل العمليات التجارية السلسة. قدرته على التنقل في الأطر القانونية المحلية والدولية تجعله أصلاً قيماً للفريق، لا سيما في المسائل المتعلقة بالاستثمارات عبر الحدود وهيكلة الشركات."
    ]
  },
  {
    slug: "ibrahim-al-balawi",
    nameEn: "Ibrahim Al-Balawi",
    nameAr: "إبراهيم البلوي",
    fullNameEn: "Ibrahim Al-Balawi",
    fullNameAr: "إبراهيم البلوي",
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
      "يجلب الأستاذ إبراهيم خبرة عملية في صياغة العقود وتقييم المخاطر القانونية. لديه سجل حافل في صياغة ومراجعة عقود الخدمات واتفاقيات عدم الإفصاح وعقود الموردين، مما يضمن الامتثال القانوني الكامل مع تخفيف المخاطر التعاقدية. تشمل خلفيته تقديم الاستشارات القانونية وتمثيل العملاء في القضايا المدنية والعمالية والتجارية، بالإضافة إلى حضور الجلسات القضائية والتنسيق مع الجهات القضائية.",
      "في شركة تسهيل، يدعم الأستاذ إبراهيم ممارسة الشركات والأعمال في الشركة من خلال ضمان أن وثائق العملاء سليمة قانونياً وتوفر حماية استراتيجية. خبرته في البحث القانوني وإعداد المذكرات واستخدام منصات مثل ناجز ومايكروسوفت أوفيس تجعله عضواً فعالاً وموثوقاً في الفريق. وهو يتقن اللغتين العربية والإنجليزية، مما يتيح له خدمة مجموعة متنوعة من العملاء بفعالية."
    ]
  }
];
