
export interface TemplateData {
  id: string;
  name: string;
  description: string;
  content: {
    vision: string;
    mission: string;
    targetMarket: string;
    revenueModel: string;
    valueProposition: string;
    keyPartners: string;
    marketingApproach: string;
    operationalNeeds: string;
    growthGoals: string;
  };
}

interface TemplateContent {
  vision: { [key: string]: string };
  mission: { [key: string]: string };
  targetMarket: { [key: string]: string };
  revenueModel: { [key: string]: string };
  valueProposition: { [key: string]: string };
  keyPartners: { [key: string]: string };
  marketingApproach: { [key: string]: string };
  operationalNeeds: { [key: string]: string };
  growthGoals: { [key: string]: string };
}

const templateContents: { [key: string]: TemplateContent } = {
  'auto-repair': {
    vision: {
      en: 'To be the most trusted source of quality second-hand clothing in our community, promoting sustainable fashion and affordability',
      sw: 'Kuwa chanzo cha kuaminika zaidi cha nguo za mitumba za ubora katika jamii yetu, kikiimarisha mtindo endelevu na upatikanaji wa bei nafuu',
      ar: 'أن نكون المصدر الأكثر ثقة للملابس المستعملة عالية الجودة في مجتمعنا، وتعزيز الأزياء المستدامة والأسعار المعقولة',
      fr: 'Être la source la plus fiable de vêtements d\'occasion de qualité dans notre communauté, promouvant la mode durable et l\'accessibilité'
    },
    mission: {
      en: 'Providing affordable, quality clothing while promoting sustainable fashion choices and supporting local entrepreneurs',
      sw: 'Kutoa nguo za ubora na bei nafuu huku tukiimarisha uchaguzi wa mtindo endelevu na kuunga mkono wajasiriamali wa mitaani',
      ar: 'توفير ملابس عالية الجودة وبأسعار معقولة مع تعزيز خيارات الأزياء المستدامة ودعم رجال الأعمال المحليين',
      fr: 'Fournir des vêtements de qualité et abordables tout en promouvant des choix de mode durables et en soutenant les entrepreneurs locaux'
    },
    targetMarket: {
      en: 'Price-conscious families, young professionals, students, fashion enthusiasts in urban and peri-urban areas aged 18-45',
      sw: 'Familia zinazojali bei, vijana wanaofanya kazi, wanafunzi, wapenzi wa mtindo katika maeneo ya mijini na karibu na miji wenye umri wa miaka 18-45',
      ar: 'العائلات المهتمة بالأسعار، الشباب المهنيون، الطلاب، عشاق الأزياء في المناطق الحضرية وشبه الحضرية الذين تتراوح أعمارهم بين 18-45',
      fr: 'Familles soucieuses des prix, jeunes professionnels, étudiants, passionnés de mode dans les zones urbaines et périurbaines âgés de 18 à 45 ans'
    },
    revenueModel: {
      en: 'Direct sales from physical store, WhatsApp marketing, bulk sales to other retailers, seasonal promotions and discounts',
      sw: 'Mauzo ya moja kwa moja kutoka duka la kimwili, uuzaji wa WhatsApp, mauzo ya jumla kwa wachuuzi wengine, matangazo ya msimu na punguzo',
      ar: 'المبيعات المباشرة من المتجر المادي، التسويق عبر واتساب، المبيعات بالجملة لتجار التجزئة الآخرين، العروض الترويجية الموسمية والخصومات',
      fr: 'Ventes directes du magasin physique, marketing WhatsApp, ventes en gros à d\'autres détaillants, promotions saisonnières et remises'
    },
    valueProposition: {
      en: 'Quality second-hand clothes at prices 60% lower than retail with unique fashion finds and personalized service',
      sw: 'Nguo za mitumba za ubora kwa bei za chini kwa asilimia 60 kuliko za rejareja pamoja na vipengele vya kipekee vya mtindo na huduma za kibinafsi',
      ar: 'ملابس مستعملة عالية الجودة بأسعار أقل بنسبة 60% من البيع بالتجزئة مع اكتشافات أزياء فريدة وخدمة شخصية',
      fr: 'Vêtements d\'occasion de qualité à des prix 60% moins chers que le commerce de détail avec des trouvailles de mode uniques et un service personnalisé'
    },
    keyPartners: {
      en: 'Bale suppliers, local tailors for alterations, WhatsApp business groups, chama members, fashion influencers',
      sw: 'Wasambazaji wa mabeli, mshonaji wa mitaani kwa marekebisho, vikundi vya biashara vya WhatsApp, wanachama wa chama, watafikiri wa mtindo',
      ar: 'موردو البالات، الخياطون المحليون للتعديلات، مجموعات الأعمال على واتساب، أعضاء الجماعة، مؤثرو الأزياء',
      fr: 'Fournisseurs de balles, tailleurs locaux pour les retouches, groupes d\'affaires WhatsApp, membres de chama, influenceurs de mode'
    },
    marketingApproach: {
      en: 'Word-of-mouth referrals, WhatsApp business marketing, local community events, social media showcases, referral programs',
      sw: 'Mapendekezo ya mdomo kwa mdomo, uuzaji wa biashara ya WhatsApp, matukio ya jamii za mitaani, maonyesho ya mitandao ya kijamii, mipango ya mapendekezo',
      ar: 'إحالات الكلام الشفهي، التسويق التجاري عبر واتساب، فعاليات المجتمع المحلي، عروض وسائل التواصل الاجتماعي، برامج الإحالة',
      fr: 'Références de bouche-à-oreille, marketing commercial WhatsApp, événements communautaires locaux, showcases sur les réseaux sociaux, programmes de parrainage'
    },
    operationalNeeds: {
      en: 'Store space, storage for inventory, transportation for bale collection, sorting equipment, mobile money account, cash register',
      sw: 'Nafasi ya duka, ghala la bidhaa, usafiri wa ukusanyaji wa mabeli, vifaa vya upangaji, akaunti ya pesa za simu, mashine ya fedha',
      ar: 'مساحة المتجر، تخزين للمخزون، النقل لجمع البالات، معدات الفرز، حساب الأموال المحمولة، ماكينة تسجيل النقد',
      fr: 'Espace de magasin, stockage pour l\'inventaire، transport pour la collecte des balles, équipement de tri, compte d\'argent mobile, caisse enregistreuse'
    },
    growthGoals: {
      en: 'Expand to online sales platform, add more product categories, establish multiple outlets, create wholesale distribution network',
      sw: 'Kupanua kwenda mfumo wa mauzo ya mtandaoni, kuongeza aina zaidi za bidhaa, kuanzisha maduka mengi, kuunda mtandao wa usambazaji wa jumla',
      ar: 'التوسع إلى منصة المبيعات عبر الإنترنت، إضافة المزيد من فئات المنتجات، إنشاء منافذ متعددة، إنشاء شبكة توزيع بالجملة',
      fr: 'Expansion vers une plateforme de vente en ligne, ajout de plus de catégories de produits, établissement de plusieurs points de vente, création d\'un réseau de distribution en gros'
    }
  },
  'boda-boda': {
    vision: {
      en: 'To provide safe, reliable, and affordable transportation while supporting drivers and contributing to community development',
      sw: 'Kutoa usafiri salama, wa kutegemewa, na wa bei nafuu huku tukiwasaidia dereva na kuchangia maendeleo ya jamii',
      ar: 'توفير وسائل نقل آمنة وموثوقة ومعقولة التكلفة مع دعم السائقين والمساهمة في تنمية المجتمع',
      fr: 'Fournir un transport sûr, fiable et abordable tout en soutenant les conducteurs et en contribuant au développement communautaire'
    },
    mission: {
      en: 'Connecting people to their destinations safely while supporting local economy, providing employment, and serving our community',
      sw: 'Kuunganisha watu na maeneo wanayoelekea kwa usalama huku tukiuunga mkono uchumi wa mitaani, kutoa ajira, na kutumikia jamii yetu',
      ar: 'ربط الناس بوجهاتهم بأمان مع دعم الاقتصاد المحلي وتوفير فرص العمل وخدمة مجتمعنا',
      fr: 'Connecter les gens à leurs destinations en toute sécurité tout en soutenant l\'économie locale, en fournissant des emplois et en servant notre communauté'
    },
    targetMarket: {
      en: 'Daily commuters, students, shoppers, business people, delivery services, and anyone needing quick transportation',
      sw: 'Wasafiri wa kila siku, wanafunzi, wanunuzi, watu wa biashara, huduma za upeperishaji, na mtu yeyote anayehitaji usafiri wa haraka',
      ar: 'المسافرون اليوميون، الطلاب، المتسوقون، رجال الأعمال، خدمات التوصيل، وأي شخص يحتاج إلى وسائل نقل سريعة',
      fr: 'Navetteurs quotidiens, étudiants, acheteurs, gens d\'affaires, services de livraison, et toute personne ayant besoin de transport rapide'
    },
    revenueModel: {
      en: 'Per-trip passenger fares, delivery service fees, package transport charges, rental income from drivers, fuel commission',
      sw: 'Nauli za abiria kwa safari, ada za huduma za upeperishaji, gharama za usafirishaji wa mizigo, mapato ya kukodisha kutoka kwa madereva, komishan ya mafuta',
      ar: 'أجرة الركاب لكل رحلة، رسوم خدمات التوصيل، رسوم نقل الطرود، دخل الإيجار من السائقين، عمولة الوقود',
      fr: 'Tarifs passagers par voyage, frais de services de livraison, frais de transport de colis, revenus locatifs des conducteurs, commission carburant'
    },
    valueProposition: {
      en: 'Fast, affordable transportation with experienced, safety-conscious riders, flexible service, and reliable availability',
      sw: 'Usafiri wa haraka, wa bei nafuu na waendesha mzoefu, wanaojali usalama, huduma ya kubadilika, na upatikanaji wa kutegemewa',
      ar: 'وسائل نقل سريعة ومعقولة التكلفة مع راكبين ذوي خبرة وواعين بالسلامة، وخدمة مرنة، وتوفر موثوق',
      fr: 'Transport rapide et abordable avec des conducteurs expérimentés et soucieux de la sécurité, service flexible et disponibilité fiable'
    },
    keyPartners: {
      en: 'Motorcycle dealers, insurance companies, fuel stations, maintenance shops, loading companies, delivery businesses',
      sw: 'Wachuuzi wa pikipiki, makampuni ya bima, vituo vya mafuta, maduka ya matengenezo, makampuni ya upakiaji, biashara za upeperishaji',
      ar: 'تجار الدراجات النارية، شركات التأمين، محطات الوقود، ورش الصيانة، شركات التحميل، أعمال التوصيل',
      fr: 'Concessionnaires de motos, compagnies d\'assurance, stations-service, ateliers de maintenance, entreprises de chargement, entreprises de livraison'
    },
    marketingApproach: {
      en: 'Community presence, customer referrals, mobile app integration, strategic location positioning, safety campaigns',
      sw: 'Uwepo wa jamii, mapendekezo ya wateja, ujumuishaji wa programu za simu, miweka mikakati ya mahali, mipango ya usalama',
      ar: 'الحضور المجتمعي، إحالات العملاء، تكامل تطبيقات الهاتف المحمول، تموضع مواقع استراتيجي، حملات السلامة',
      fr: 'Présence communautaire, références clients, intégration d\'applications mobiles, positionnement stratégique, campagnes de sécurité'
    },
    operationalNeeds: {
      en: 'Motorcycles, safety gear (helmets, reflective vests), licenses, insurance, maintenance tools, communication devices',
      sw: 'Pikipiki, vifaa vya usalama (kofia za kinga, mikanda ya kuelea), leseni, bima, vifaa vya matengenezo, vifaa vya mawasiliano',
      ar: 'دراجات نارية، معدات السلامة (خوذات، سترات عاكسة)، تراخيص، تأمين، أدوات الصيانة، أجهزة الاتصال',
      fr: 'Motos, équipement de sécurité (casques, gilets réfléchissants), licences, assurance, outils de maintenance, dispositifs de communication'
    },
    growthGoals: {
      en: 'Add 5 more motorcycles, establish delivery service partnerships, create driver training program, expand coverage area',
      sw: 'Kuongeza pikipiki 5 zaidi, kuanzisha ushirikiano wa huduma za upeperishaji, kuunda programu ya mafunzo ya madereva, kupanua eneo la utumikaji',
      ar: 'إضافة 5 دراجات نارية أخرى، إنشاء شراكات خدمات التوصيل، إنشاء برنامج تدريب السائقين، توسيع منطقة التغطية',
      fr: 'Ajouter 5 motos supplémentaires, établir des partenariats de services de livraison, créer un programme de formation des conducteurs, étendre la zone de couverture'
    }
  },
  'daycare': {
    vision: {
      en: 'To provide a safe, nurturing environment where children can learn, grow, and develop to their fullest potential',
      sw: 'Kutoa mazingira salama, ya ulea ambayo watoto wanaweza kujifunza, kukua, na kuendeleza kwa uwezo wao kamili',
      ar: 'توفير بيئة آمنة ومغذية حيث يمكن للأطفال التعلم والنمو والتطوير إلى أقصى إمكاناتهم',
      fr: 'Fournir un environnement sûr et nourrissant où les enfants peuvent apprendre, grandir et se développer à leur plein potentiel'
    },
    mission: {
      en: 'Supporting working families by providing quality childcare with educational activities, loving care, and developmental support',
      sw: 'Kusaidia familia zinazofanya kazi kwa kutoa huduma za malezi ya watoto za ubora pamoja na shughuli za elimu, malezi ya upendo, na msaada wa maendeleo',
      ar: 'دعم العائلات العاملة من خلال توفير رعاية أطفال عالية الجودة مع الأنشطة التعليمية والرعاية المحبة والدعم التنموي',
      fr: 'Soutenir les familles qui travaillent en fournissant des services de garde d\'enfants de qualité avec des activités éducatives, des soins aimants et un soutien au développement'
    },
    targetMarket: {
      en: 'Working parents with children aged 6 months to 5 years, single parents, shift workers, families needing flexible care',
      sw: 'Wazazi wanaofanya kazi wenye watoto wa umri wa miezi 6 hadi miaka 5, wazazi wa kipeke, wafanyakazi wa mzunguko, familia zinazohitaji huduma za kubadilika',
      ar: 'الآباء العاملون الذين لديهم أطفال تتراوح أعمارهم بين 6 أشهر إلى 5 سنوات، والآباء المنفردون، وعمال النوبات، والعائلات التي تحتاج إلى رعاية مرنة',
      fr: 'Parents qui travaillent avec des enfants âgés de 6 mois à 5 ans, parents célibataires, travailleurs postés, familles ayant besoin de soins flexibles'
    },
    revenueModel: {
      en: 'Daily/weekly childcare fees, registration fees, after-school care, summer programs, meals, educational activities',
      sw: 'Ada za malezi ya watoto za kila siku/wiki, ada za usajili, malezi baada ya shule, mipango ya majira ya joto, chakula, shughuli za elimu',
      ar: 'رسوم رعاية الأطفال اليومية/الأسبوعية، رسوم التسجيل، الرعاية بعد المدرسة، البرامج الصيفية، الوجبات، الأنشطة التعليمية',
      fr: 'Frais de garde quotidiens/hebdomadaires, frais d\'inscription, garde après l\'école, programmes d\'été, repas, activités éducatives'
    },
    valueProposition: {
      en: 'Safe, educational childcare with flexible scheduling, caring qualified staff, developmental activities, and nutritious meals',
      sw: 'Malezi salama ya kielimu ya watoto yenye ratiba za kubadilika, wafanyakazi wenye sifa wa kujali, shughuli za maendeleo, na chakula chenye lishe',
      ar: 'رعاية أطفال آمنة وتعليمية مع جدولة مرنة وموظفين مؤهلين ومهتمين وأنشطة تنموية ووجبات مغذية',
      fr: 'Garde d\'enfants sûre et éducative avec horaires flexibles, personnel qualifié et attentionné, activités de développement et repas nutritifs'
    },
    keyPartners: {
      en: 'Educational toy suppliers, child development specialists, local schools, health clinics, food suppliers',
      sw: 'Wasambazaji wa vinyago vya kielimu, wataalamu wa maendeleo ya watoto, shule za mitaani, kliniki za afya, wasambazaji wa chakula',
      ar: 'موردو الألعاب التعليمية، أخصائيو تنمية الطفل، المدارس المحلية، العيادات الصحية، موردو الطعام',
      fr: 'Fournisseurs de jouets éducatifs, spécialistes du développement de l\'enfant, écoles locales, cliniques de santé, fournisseurs alimentaires'
    },
    marketingApproach: {
      en: 'Parent referrals, community bulletin boards, social media, open houses, partnerships with employers, pediatrician referrals',
      sw: 'Mapendekezo ya wazazi, mabao ya jamii, mitandao ya kijamii, nyumba za uwazi, ushirikiano na waajiri, mapendekezo ya madaktari wa watoto',
      ar: 'إحالات الآباء، لوحات الإعلانات المجتمعية، وسائل التواصل الاجتماعي، البيوت المفتوحة، الشراكات مع أصحاب العمل، إحالات أطباء الأطفال',
      fr: 'Références de parents, tableaux d\'affichage communautaires, médias sociaux, portes ouvertes, partenariats avec employeurs, références de pédiatres'
    },
    operationalNeeds: {
      en: 'Child-safe facility, toys and educational materials, security system, licenses, insurance, kitchen facilities',
      sw: 'Kituo salama cha watoto, vinyago na vifaa vya kielimu, mfumo wa usalama, leseni, bima, vifaa vya jikoni',
      ar: 'مرفق آمن للأطفال، ألعاب ومواد تعليمية، نظام أمني، تراخيص، تأمين، مرافق مطبخ',
      fr: 'Installation sécurisée pour enfants, jouets et matériels éducatifs, système de sécurité, licences, assurance, installations de cuisine'
    },
    growthGoals: {
      en: 'Add after-school program, increase capacity to 30 children, hire 2 teachers, establish pre-school curriculum',
      sw: 'Kuongeza mpango wa baada ya shule, kuongeza uwezo hadi watoto 30, kuajiri walimu 2, kuanzisha mtaala wa kabla ya shule',
      ar: 'إضافة برنامج ما بعد المدرسة، زيادة السعة إلى 30 طفلاً، توظيف 2 من المعلمين، وضع منهج ما قبل المدرسة',
      fr: 'Ajouter un programme après l\'école, augmenter la capacité à 30 enfants, embaucher 2 enseignants, établir un programme préscolaire'
    }
  },
  'cyber-cafe': {
    vision: {
      en: 'To be the premier digital services hub providing reliable internet access and digital literacy to bridge the digital divide',
      sw: 'Kuwa kituo kikuu cha huduma za kidijiti kinachotoa muunganisho wa mtandao wa kutegemewa na ujuzi wa kidijiti ili kuziba pengo la kidijiti',
      ar: 'أن نكون المركز الرئيسي للخدمات الرقمية الذي يوفر وصولاً موثوقاً للإنترنت ومحو الأمية الرقمية لسد الفجوة الرقمية',
      fr: 'Être le centre principal de services numériques fournissant un accès Internet fiable et une alphabétisation numérique pour combler la fracture numérique'
    },
    mission: {
      en: 'Providing reliable internet access and comprehensive digital services while empowering our community through technology',
      sw: 'Kutoa muunganisho wa mtandao wa kutegemewa na huduma kamili za kidijiti huku tukiwawezesha jamii yetu kupitia teknolojia',
      ar: 'توفير وصول موثوق للإنترنت وخدمات رقمية شاملة مع تمكين مجتمعنا من خلال التكنولوجيا',
      fr: 'Fournir un accès Internet fiable et des services numériques complets tout en autonomisant notre communauté grâce à la technologie'
    },
    targetMarket: {
      en: 'Students, small business owners, job seekers, remote workers, and community members needing internet access and digital services',
      sw: 'Wanafunzi, wamiliki wa biashara ndogo, watafutaji kazi, wafanyakazi wa mbali, na wanajamii wanaohitaji muunganisho wa mtandao na huduma za kidijiti',
      ar: 'الطلاب، أصحاب الأعمال الصغيرة، الباحثون عن العمل، العاملون عن بُعد، وأعضاء المجتمع الذين يحتاجون إلى الوصول إلى الإنترنت والخدمات الرقمية',
      fr: 'Étudiants, propriétaires de petites entreprises, demandeurs d\'emploi, travailleurs à distance et membres de la communauté ayant besoin d\'accès Internet et de services numériques'
    },
    revenueModel: {
      en: 'Hourly internet usage fees, printing and scanning services, document typing, computer training courses, phone charging, mobile money',
      sw: 'Ada za matumizi ya mtandao kwa saa, huduma za kuchapisha na kuchanganua, kuandika hati, kozi za mafunzo ya kompyuta, kuchaji simu, pesa za simu',
      ar: 'رسوم استخدام الإنترنت بالساعة، خدمات الطباعة والمسح الضوئي، كتابة المستندات، دورات تدريبية للكمبيوتر، شحن الهاتف، الأموال المحمولة',
      fr: 'Frais d\'utilisation Internet horaires, services d\'impression et de numérisation, saisie de documents, cours de formation informatique, charge de téléphone, argent mobile'
    },
    valueProposition: {
      en: 'Affordable, reliable internet access with comprehensive business services, technical support, and digital literacy training',
      sw: 'Muunganisho wa mtandao wa bei nafuu, wa kutegemewa na huduma kamili za biashara, msaada wa kifundi, na mafunzo ya ujuzi wa kidijiti',
      ar: 'وصول إنترنت موثوق ومعقول التكلفة مع خدمات أعمال شاملة ودعم فني وتدريب على محو الأمية الرقمية',
      fr: 'Accès Internet abordable et fiable avec services commerciaux complets, support technique et formation en alphabétisation numérique'
    },
    keyPartners: {
      en: 'Internet service providers, computer suppliers, local schools, government agencies, training institutes, mobile money agents',
      sw: 'Watoa huduma za mtandao, wasambazaji wa kompyuta, shule za mitaani, mashirika ya serikali, taasisi za mafunzo, mawakala wa pesa za simu',
      ar: 'مقدمو خدمات الإنترنت، موردو الكمبيوتر، المدارس المحلية، الوكالات الحكومية، معاهد التدريب، وكلاء الأموال المحمولة',
      fr: 'Fournisseurs de services Internet, fournisseurs d\'ordinateurs, écoles locales, agences gouvernementales, instituts de formation, agents d\'argent mobile'
    },
    marketingApproach: {
      en: 'Community outreach programs, student discounts, business partnerships, word-of-mouth referrals, local advertising',
      sw: 'Mipango ya kufikia jamii, punguzo za wanafunzi, ushirikiano wa kibiashara, mapendekezo ya mdomo kwa mdomo, matangazo ya mitaani',
      ar: 'برامج التوعية المجتمعية، خصومات الطلاب، الشراكات التجارية، الإحالات الشفهية، الإعلان المحلي',
      fr: 'Programmes de sensibilisation communautaire, remises étudiants, partenariats commerciaux, références de bouche-à-oreille, publicité locale'
    },
    operationalNeeds: {
      en: '15-20 computers, high-speed internet connection, printer, scanner, comfortable seating, security system, backup power',
      sw: 'Kompyuta 15-20, muunganisho wa mtandao wa kasi ya juu, kichapishi, kichanganuzi, viti vizuri, mfumo wa usalama, umeme wa hifadhi',
      ar: '15-20 كمبيوتر، اتصال إنترنت عالي السرعة، طابعة، ماسح ضوئي، مقاعد مريحة، نظام أمني، طاقة احتياطية',
      fr: '15-20 ordinateurs, connexion Internet haut débit, imprimante, scanner, sièges confortables, système de sécurité, alimentation de secours'
    },
    growthGoals: {
      en: 'Add computer training classes, expand to 24/7 operations, introduce mobile money services, establish satellite locations',
      sw: 'Kuongeza madarasa ya mafunzo ya kompyuta, kupanua hadi utendaji wa saa 24/7, kuanzisha huduma za pesa za simu, kuanzisha mahali pa anga',
      ar: 'إضافة فصول تدريب الكمبيوتر، التوسع إلى عمليات 24/7، تقديم خدمات الأموال المحمولة، إنشاء مواقع فرعية',
      fr: 'Ajouter des cours de formation informatique, étendre aux opérations 24/7, introduire des services d\'argent mobile, établir des emplacements satellites'
    }
  },
  'real-estate': {
    vision: {
      en: 'To become the most trusted real estate agency in the region, known for integrity, transparency and exceptional service delivery',
      sw: 'Kuwa wakala wa mali isiyohamishika wa kuaminika zaidi kanda, unaojulikana kwa uaminifu, uwazi na utendaji wa kipekee wa huduma',
      ar: 'أن نصبح وكالة العقارات الأكثر ثقة في المنطقة، معروفة بالنزاهة والشفافية والخدمة الاستثنائية',
      fr: 'Devenir l\'agence immobilière la plus fiable de la région, connue pour son intégrité, sa transparence et son service exceptionnel'
    },
    mission: {
      en: 'Helping clients find their perfect homes and investment properties while providing expert guidance throughout the entire process',
      sw: 'Kusaidia wateja kupata nyumba zao kamili na mali za uwekezaji huku tukitoa mwongozo wa kitaalamu katika mchakato mzima',
      ar: 'مساعدة العملاء في العثور على منازلهم المثالية والعقارات الاستثمارية مع توفير التوجيه الخبير طوال العملية بأكملها',
      fr: 'Aider les clients à trouver leurs maisons parfaites et propriétés d\'investissement tout en fournissant des conseils d\'experts tout au long du processus'
    },
    targetMarket: {
      en: 'Home buyers, property sellers, real estate investors, renters in middle to upper income brackets, first-time homebuyers',
      sw: 'Wanunuzi wa nyumba, wauzaji wa mali, wawekezaji wa mali isiyohamishika, wakodishaji wa kati hadi kundi la juu la kipato, wanunuzi wa kwanza wa nyumba',
      ar: 'مشتري المنازل، بائعي العقارات، مستثمري العقارات، المستأجرين في الشرائح الوسطى إلى العليا من الدخل، مشتري المنازل لأول مرة',
      fr: 'Acheteurs de maisons, vendeurs de propriétés, investisseurs immobiliers, locataires dans les tranches de revenus moyens à élevés, acheteurs de première maison'
    },
    revenueModel: {
      en: 'Commission on property sales (3-6%), rental management fees (8-10%), property valuation services, consultation fees',
      sw: 'Komishan ya mauzo ya mali (3-6%), ada za usimamizi wa ukodishaji (8-10%), huduma za uthamini wa mali, ada za ushauri',
      ar: 'عمولة على مبيعات العقارات (3-6%)، رسوم إدارة الإيجار (8-10%)، خدمات تقييم العقارات، رسوم الاستشارة',
      fr: 'Commission sur les ventes immobilières (3-6%), frais de gestion locative (8-10%), services d\'évaluation immobilière, frais de consultation'
    },
    valueProposition: {
      en: 'Expert local market knowledge with personalized service, transparent pricing, comprehensive support, and proven track record',
      sw: 'Ujuzi wa kitaalamu wa soko la mitaani na huduma za kibinafsi, bei za uwazi, msaada kamili, na rekodi ya uthibitisho',
      ar: 'معرفة خبيرة بالسوق المحلي مع خدمة شخصية، تسعير شفاف، دعم شامل، وسجل حافل مثبت',
      fr: 'Connaissance experte du marché local avec service personnalisé, tarification transparente, support complet et historique prouvé'
    },
    keyPartners: {
      en: 'Property developers, banks and financial institutions, legal firms, home inspectors, contractors, insurance companies',
      sw: 'Wajenzi wa mali, benki na taasisi za kifedha, makampuni ya kisheria, wakaguzi wa nyumba, wakandarasi, makampuni ya bima',
      ar: 'مطوري العقارات، البنوك والمؤسسات المالية، الشركات القانونية، مفتشي المنازل، المقاولين، شركات التأمين',
      fr: 'Promoteurs immobiliers, banques et institutions financières, cabinets juridiques, inspecteurs de maisons, entrepreneurs, compagnies d\'assurance'
    },
    marketingApproach: {
      en: 'Online property listings, social media marketing, referral network, local advertising, open houses, community events',
      sw: 'Orodha za mali mtandaoni, uuzaji wa mitandao ya kijamii, mtandao wa mapendekezo, matangazo ya mitaani, nyumba za uwazi, matukio ya jamii',
      ar: 'قوائم العقارات عبر الإنترنت، التسويق عبر وسائل التواصل الاجتماعي، شبكة الإحالة، الإعلان المحلي، البيوت المفتوحة، الفعاليات المجتمعية',
      fr: 'Listes de propriétés en ligne, marketing sur les réseaux sociaux, réseau de références, publicité locale, maisons ouvertes, événements communautaires'
    },
    operationalNeeds: {
      en: 'Office space, reliable vehicle, marketing materials, legal documentation systems, photography equipment, professional signage',
      sw: 'Nafasi ya ofisi, gari la kutegemewa, vifaa vya uuzaji, mifumo ya hati za kisheria, vifaa vya upigaji picha, maonyesho ya kitaalamu',
      ar: 'مساحة مكتبية، مركبة موثوقة، مواد تسويقية، أنظمة التوثيق القانوني، معدات التصوير، لافتات مهنية',
      fr: 'Espace de bureau, véhicule fiable, matériel marketing, systèmes de documentation légale, équipement photographique, signalisation professionnelle'
    },
    growthGoals: {
      en: 'Build team of 5 agents, establish property management division, expand to 3 new neighborhoods, create online platform',
      sw: 'Kujenga timu ya mawakala 5, kuanzisha idara ya usimamizi wa mali, kupanua hadi mitaa 3 mipya, kuunda jukwaa la mtandaoni',
      ar: 'بناء فريق من 5 وكلاء، إنشاء قسم إدارة العقارات، التوسع إلى 3 أحياء جديدة، إنشاء منصة عبر الإنترنت',
      fr: 'Construire une équipe de 5 agents, établir une division de gestion immobilière, s\'étendre à 3 nouveaux quartiers, créer une plateforme en ligne'
    }
  },
  'cleaning-services': {
    vision: {
      en: 'To be the leading cleaning service known for reliability, quality, eco-friendly practices and exceptional customer satisfaction',
      sw: 'Kuwa huduma ya usafi inayoongoza inayojulikana kwa kutegemewa, ubora, mazoea ya mazingira na ridhaa ya kipekee ya wateja',
      ar: 'أن نكون خدمة التنظيف الرائدة المعروفة بالموثوقية والجودة والممارسات الصديقة للبيئة والرضا الاستثنائي للعملاء',
      fr: 'Être le service de nettoyage leader connu pour sa fiabilité, sa qualité, ses pratiques écologiques et sa satisfaction client exceptionnelle'
    },
    mission: {
      en: 'Providing exceptional cleaning services that give clients more time for what matters most while maintaining healthy environments',
      sw: 'Kutoa huduma za usafi za kipekee zinazowapa wateja muda zaidi kwa yale yanayohusika zaidi huku tukidumisha mazingira ya afya',
      ar: 'توفير خدمات تنظيف استثنائية تمنح العملاء مزيدًا من الوقت لما يهم أكثر مع الحفاظ على البيئات الصحية',
      fr: 'Fournir des services de nettoyage exceptionnels qui donnent aux clients plus de temps pour ce qui compte le plus tout en maintenant des environnements sains'
    },
    targetMarket: {
      en: 'Busy professionals, families with children, elderly clients, small businesses, medical facilities, commercial establishments',
      sw: 'Wataalamu wa haraka, familia zenye watoto, wateja wazee, biashara ndogo, vituo vya matibabu, miundombinu ya kibiashara',
      ar: 'المهنيون المشغولون، الأسر التي لديها أطفال، العملاء المسنون، الشركات الصغيرة، المرافق الطبية، المؤسسات التجارية',
      fr: 'Professionnels occupés, familles avec enfants, clients âgés, petites entreprises, installations médicales, établissements commerciaux'
    },
    revenueModel: {
      en: 'Recurring weekly/monthly cleaning contracts, one-time deep cleaning services, specialized cleaning, emergency cleanup services',
      sw: 'Mikataba ya usafi ya kila wiki/mwezi inayorudia, huduma za usafi wa kina wa mara moja, usafi maalum, huduma za kusafisha ya dharura',
      ar: 'عقود التنظيف الأسبوعية/الشهرية المتكررة، خدمات التنظيف العميق لمرة واحدة، التنظيف المتخصص، خدمات التنظيف الطارئة',
      fr: 'Contrats de nettoyage récurrents hebdomadaires/mensuels, services de nettoyage en profondeur ponctuels, nettoyage spécialisé, services de nettoyage d\'urgence'
    },
    valueProposition: {
      en: 'Reliable, thorough cleaning with eco-friendly products, flexible scheduling, bonded staff, and satisfaction guarantee',
      sw: 'Usafi wa kutegemewa, wa kina na bidhaa za mazingira, ratiba za kubadilika, wafanyakazi walio na dhamana, na dhamana ya ridhaa',
      ar: 'تنظيف موثوق وشامل بمنتجات صديقة للبيئة، جدولة مرنة، موظفون مضمونون، وضمان الرضا',
      fr: 'Nettoyage fiable et approfondi avec des produits écologiques, planification flexible, personnel cautionné et garantie de satisfaction'
    },
    keyPartners: {
      en: 'Cleaning supply companies, insurance providers, local businesses, residential complexes, property management companies',
      sw: 'Makampuni ya vifaa vya usafi, watoa bima, biashara za mitaani, makazi ya uongozaji, makampuni ya usimamizi wa mali',
      ar: 'شركات إمدادات التنظيف، مقدمي التأمين، الشركات المحلية، المجمعات السكنية، شركات إدارة العقارات',
      fr: 'Entreprises de fournitures de nettoyage, fournisseurs d\'assurance, entreprises locales, complexes résidentiels, entreprises de gestion immobilière'
    },
    marketingApproach: {
      en: 'Word-of-mouth referrals, online reviews, door-to-door marketing, partnerships with realtors, social media presence',
      sw: 'Mapendekezo ya mdomo kwa mdomo, hakiki za mtandaoni, uuzaji wa mlango kwa mlango, ushirikiano na madalali wa mali, uwepo wa mitandao ya kijamii',
      ar: 'الإحالات الشفهية، المراجعات عبر الإنترنت، التسويق من باب إلى باب، الشراكات مع الوسطاء العقاريين، الوجود على وسائل التواصل الاجتماعي',
      fr: 'Références de bouche-à-oreille, avis en ligne, marketing de porte à porte, partenariats avec les agents immobiliers, présence sur les réseaux sociaux'
    },
    operationalNeeds: {
      en: 'Professional cleaning supplies, transportation vehicle, uniforms, insurance coverage, equipment storage, scheduling system',
      sw: 'Vifaa vya kitaalamu vya usafi, gari la usafiri, sare, ulinzi wa bima, hifadhi ya vifaa, mfumo wa ratiba',
      ar: 'إمدادات التنظيف المهنية، مركبة نقل، زي موحد، تغطية تأمينية، تخزين المعدات، نظام الجدولة',
      fr: 'Fournitures de nettoyage professionnelles, véhicule de transport, uniformes, couverture d\'assurance, stockage d\'équipement, système de planification'
    },
    growthGoals: {
      en: 'Hire 4 additional cleaners, add commercial cleaning services, establish franchise model, expand service area',
      sw: 'Kuajiri wasafi 4 zaidi, kuongeza huduma za usafi wa kibiashara, kuanzisha muundo wa franchise, kupanua eneo la huduma',
      ar: 'توظيف 4 منظفين إضافيين، إضافة خدمات التنظيف التجاري، إنشاء نموذج الامتياز، توسيع منطقة الخدمة',
      fr: 'Embaucher 4 nettoyeurs supplémentaires, ajouter des services de nettoyage commercial, établir un modèle de franchise, étendre la zone de service'
    }
  },
  'event-planning': {
    vision: {
      en: 'To create unforgettable experiences through exceptional event planning, creative design, and flawless execution of memorable celebrations',
      sw: 'Kuunda mazingira yasiyosahaulika kupitia upangaji wa kipekee wa matukio, muundo wa ubunifu, na utekelezaji usio na makosa wa sherehe za kumbukumbu',
      ar: 'إنشاء تجارب لا تُنسى من خلال التخطيط الاستثنائي للفعاليات والتصميم الإبداعي والتنفيذ الخالي من العيوب للاحتفالات المميزة',
      fr: 'Créer des expériences inoubliables grâce à une planification d\'événements exceptionnelle, un design créatif et une exécution parfaite de célébrations mémorables'
    },
    mission: {
      en: 'Turning our clients\' visions into reality through detailed planning, creative design, seamless coordination, and personalized service',
      sw: 'Kubadilisha miono ya wateja wetu kuwa ukweli kupitia upangaji wa kina, muundo wa ubunifu, uratibu usio na kikwazo, na huduma za kibinafsi',
      ar: 'تحويل رؤى عملائنا إلى واقع من خلال التخطيط المفصل والتصميم الإبداعي والتنسيق السلس والخدمة الشخصية',
      fr: 'Transformer les visions de nos clients en réalité grâce à une planification détaillée, un design créatif, une coordination transparente et un service personnalisé'
    },
    targetMarket: {
      en: 'Couples planning weddings, families celebrating milestones, corporate clients, community organizations, cultural associations',
      sw: 'Wanandoa wanaopanga harusi, familia zinazosherehekea hatua muhimu, wateja wa kikampuni, mashirika ya jamii, vyama vya kitamaduni',
      ar: 'الأزواج الذين يخططون للزفاف، العائلات التي تحتفل بالمعالم، العملاء من الشركات، المنظمات المجتمعية، الجمعيات الثقافية',
      fr: 'Couples planifiant des mariages, familles célébrant des étapes importantes, clients corporatifs, organisations communautaires, associations culturelles'
    },
    revenueModel: {
      en: 'Event planning fees (10-15% of budget), vendor commissions, decoration rentals, coordination services, consultation fees',
      sw: 'Ada za upangaji wa matukio (10-15% ya bajeti), komishan za wauzaji, ukodishaji wa mapambo, huduma za uratibu, ada za ushauri',
      ar: 'رسوم تخطيط الفعاليات (10-15% من الميزانية)، عمولات البائعين، إيجار الديكورات، خدمات التنسيق، رسوم الاستشارة',
      fr: 'Frais de planification d\'événements (10-15% du budget), commissions des fournisseurs, location de décorations, services de coordination, frais de consultation'
    },
    valueProposition: {
      en: 'Stress-free event planning with attention to every detail, creative solutions, budget management, and cultural sensitivity',
      sw: 'Upangaji wa matukio bila mshangao ukizingatia kila undani, suluhisho za ubunifu, usimamizi wa bajeti, na hali ya kitamaduni',
      ar: 'تخطيط فعاليات خالٍ من التوتر مع الاهتمام بكل التفاصيل، حلول إبداعية، إدارة الميزانية، والحساسية الثقافية',
      fr: 'Planification d\'événements sans stress avec attention aux moindres détails, solutions créatives, gestion budgétaire et sensibilité culturelle'
    },
    keyPartners: {
      en: 'Event venues, caterers, photographers, florists, musicians, decorators, transportation services, equipment rental companies',
      sw: 'Maeneo ya matukio, watoa chakula, wapiga picha, wafuliza maua, waimbaji, wapamba, huduma za usafiri, makampuni ya kukodisha vifaa',
      ar: 'أماكن الفعاليات، متعهدو الطعام، المصورون، منسقو الزهور، الموسيقيون، المزينون، خدمات النقل، شركات تأجير المعدات',
      fr: 'Lieux d\'événements, traiteurs, photographes, fleuristes, musiciens, décorateurs, services de transport, entreprises de location d\'équipement'
    },
    marketingApproach: {
      en: 'Social media showcasing past events, client referrals, wedding fairs, venue partnerships, community networking',
      sw: 'Mitandao ya kijamii inayoonyesha matukio ya zamani, mapendekezo ya wateja, maonesho ya harusi, ushirikiano wa maeneo, mtandao wa jamii',
      ar: 'وسائل التواصل الاجتماعي لعرض الفعاليات السابقة، إحالات العملاء، معارض الزفاف، شراكات الأماكن، التواصل المجتمعي',
      fr: 'Médias sociaux présentant les événements passés, références clients, salons de mariage, partenariats avec les lieux, réseautage communautaire'
    },
    operationalNeeds: {
      en: 'Event planning software, vendor network, transportation, decoration storage, office space, portfolio materials',
      sw: 'Programu za upangaji wa matukio, mtandao wa wauzaji, usafiri, hifadhi ya mapambo, nafasi ya ofisi, vifaa vya portfolio',
      ar: 'برنامج تخطيط الفعاليات، شبكة البائعين، النقل، تخزين الديكورات، مساحة مكتبية، مواد المحفظة',
      fr: 'Logiciel de planification d\'événements, réseau de fournisseurs, transport, stockage de décorations, espace de bureau, matériaux de portfolio'
    },
    growthGoals: {
      en: 'Establish partnerships with 5 premium venues, hire 2 assistants, launch corporate division, expand to destination events',
      sw: 'Kuanzisha ushirikiano na maeneo 5 ya hali ya juu, kuajiri wasaidizi 2, kuzindua idara ya kikampuni, kupanua hadi matukio ya marudio',
      ar: 'إنشاء شراكات مع 5 أماكن متميزة، توظيف 2 من المساعدين، إطلاق قسم الشركات، التوسع إلى فعاليات الوجهات',
      fr: 'Établir des partenariats avec 5 lieux premium, embaucher 2 assistants, lancer une division corporative, s\'étendre aux événements de destination'
    }
  },
  'photography': {
    vision: {
      en: 'To capture life\'s precious moments with artistic excellence, preserving memories that last forever through stunning visual storytelling',
      sw: 'Kunasa maalum ya maisha ya thamani kwa ubora wa kisanii, kuhifadhi kumbukumbu zinazodumu milele kupitia hadithi za kuona za kustaajabisha',
      ar: 'التقاط لحظات الحياة الثمينة بامتياز فني، والحفاظ على الذكريات التي تدوم إلى الأبد من خلال السرد البصري المذهل',
      fr: 'Capturer les moments précieux de la vie avec excellence artistique, préservant des souvenirs qui durent pour toujours grâce à une narration visuelle époustouflante'
    },
    mission: {
      en: 'Providing high-quality photography and videography services that exceed client expectations and preserve cherished memories',
      sw: 'Kutoa huduma za hali ya juu za upigaji picha na video zinazozidi matarajio ya wateja na kuhifadhi kumbukumbu za thamani',
      ar: 'توفير خدمات تصوير فوتوغرافي وفيديو عالية الجودة تتجاوز توقعات العملاء وتحافظ على الذكريات العزيزة',
      fr: 'Fournir des services de photographie et vidéographie de haute qualité qui dépassent les attentes des clients et préservent des souvenirs précieux'
    },
    targetMarket: {
      en: 'Couples getting married, families, businesses needing marketing content, event organizers, social media influencers',
      sw: 'Wanandoa wanaooana, familia, biashara zinazohitaji maudhui ya uuzaji, wapanga matukio, wataathiri wa mitandao ya kijamii',
      ar: 'الأزواج المتزوجون، العائلات، الشركات التي تحتاج محتوى تسويقي، منظمو الفعاليات، مؤثرو وسائل التواصل الاجتماعي',
      fr: 'Couples se mariant, familles, entreprises ayant besoin de contenu marketing, organisateurs d\'événements, influenceurs des médias sociaux'
    },
    revenueModel: {
      en: 'Wedding packages, portrait sessions, event coverage, commercial photography, print sales, digital packages, video editing',
      sw: 'Vifurushi vya harusi, vipindi vya picha za kibinafsi, kufunika matukio, upigaji picha wa kibiashara, mauzo ya kuchapisha, vifurushi vya kidijiti, kuhariri video',
      ar: 'باقات الزفاف، جلسات البورتريه، تغطية الفعاليات، التصوير التجاري، مبيعات الطباعة، الباقات الرقمية، تحرير الفيديو',
      fr: 'Forfaits mariage, séances de portrait, couverture d\'événements, photographie commerciale, ventes d\'impression, forfaits numériques, montage vidéo'
    },
    valueProposition: {
      en: 'Professional quality images with artistic flair, quick turnaround, competitive pricing, and personalized service approach',
      sw: 'Picha za ubora wa kitaalamu zenye utando wa kisanii, mzunguko wa haraka, bei za ushindani, na mbinu ya huduma za kibinafsi',
      ar: 'صور عالية الجودة المهنية مع ذوق فني، تسليم سريع، تسعير تنافسي، ونهج خدمة شخصية',
      fr: 'Images de qualité professionnelle avec flair artistique, délai de livraison rapide, prix compétitifs et approche de service personnalisé'
    },
    keyPartners: {
      en: 'Wedding planners, event venues, printing services, equipment rental companies, other photographers, makeup artists',
      sw: 'Wapanga harusi, maeneo ya matukio, huduma za kuchapisha, makampuni ya kukodisha vifaa, wapiga picha wengine, watengeneza vipodozi',
      ar: 'مخططو الزفاف، أماكن الفعاليات، خدمات الطباعة، شركات تأجير المعدات، مصورون آخرون، فنانو المكياج',
      fr: 'Planificateurs de mariage, lieux d\'événements, services d\'impression, entreprises de location d\'équipement, autres photographes, maquilleurs'
    },
    marketingApproach: {
      en: 'Social media portfolio showcasing work, wedding shows, referral network, SEO-optimized website, client testimonials',
      sw: 'Portfolio ya mitandao ya kijamii inayoonyesha kazi, maonesho ya harusi, mtandao wa mapendekezo, tovuti iliyoboresha SEO, ushahidi wa wateja',
      ar: 'محفظة وسائل التواصل الاجتماعي لعرض الأعمال، عروض الزفاف، شبكة الإحالة، موقع محسن لمحركات البحث، شهادات العملاء',
      fr: 'Portfolio de médias sociaux présentant le travail, salons de mariage, réseau de références, site web optimisé SEO, témoignages clients'
    },
    operationalNeeds: {
      en: 'Professional cameras, lenses, lighting equipment, editing software, studio space, transportation, backup equipment',
      sw: 'Kamera za kitaalamu, miwani, vifaa vya mwanga, programu za kuhariri, nafasi ya studio, usafiri, vifaa vya hifadhi',
      ar: 'كاميرات مهنية، عدسات، معدات إضاءة، برنامج تحرير، مساحة استوديو، نقل، معدات احتياطية',
      fr: 'Caméras professionnelles, objectifs, équipement d\'éclairage, logiciel d\'édition, espace studio, transport, équipement de sauvegarde'
    },
    growthGoals: {
      en: 'Add drone photography services, establish permanent studio, hire assistant photographer, expand to commercial clients',
      sw: 'Kuongeza huduma za upigaji picha wa drone, kuanzisha studio ya kudumu, kuajiri msaidizi wa upigaji picha, kupanua kwa wateja wa kibiashara',
      ar: 'إضافة خدمات تصوير الطائرات بدون طيار، إنشاء استوديو دائم، توظيف مساعد مصور، التوسع للعملاء التجاريين',
      fr: 'Ajouter des services de photographie par drone, établir un studio permanent, embaucher un assistant photographe, s\'étendre aux clients commerciaux'
    }
  },
  'food-delivery': {
    vision: {
      en: 'To be the fastest and most reliable food delivery service connecting hungry customers with their favorite meals efficiently',
      sw: 'Kuwa huduma ya haraka na ya kutegemewa zaidi ya utoaji chakula inayounganisha wateja wenye njaa na milo yao inayopendwa kwa ufanisi',
      ar: 'أن نكون خدمة توصيل الطعام الأسرع والأكثر موثوقية التي تربط العملاء الجياع بوجباتهم المفضلة بكفاءة',
      fr: 'Être le service de livraison de nourriture le plus rapide et le plus fiable reliant les clients affamés à leurs repas préférés efficacement'
    },
    mission: {
      en: 'Connecting hungry customers with their favorite restaurants through efficient, reliable delivery service and excellent customer experience',
      sw: 'Kuunganisha wateja wenye njaa na migahawa yao inayopendwa kupitia huduma ya ufanisi, ya kutegemewa ya utoaji na mazingira mazuri ya wateja',
      ar: 'ربط العملاء الجياع بمطاعمهم المفضلة من خلال خدمة توصيل فعالة وموثوقة وتجربة عملاء ممتازة',
      fr: 'Connecter les clients affamés à leurs restaurants préférés grâce à un service de livraison efficace et fiable et une excellente expérience client'
    },
    targetMarket: {
      en: 'Busy professionals, students, families, elderly customers, office workers wanting convenient meal delivery solutions',
      sw: 'Wataalamu wa haraka, wanafunzi, familia, wateja wazee, wafanyakazi wa ofisi wanaotaka suluhisho rahisi za utoaji chakula',
      ar: 'المهنيون المشغولون، الطلاب، العائلات، العملاء المسنون، عمال المكاتب الذين يريدون حلول توصيل وجبات مريحة',
      fr: 'Professionnels occupés, étudiants, familles, clients âgés, employés de bureau souhaitant des solutions de livraison de repas pratiques'
    },
    revenueModel: {
      en: 'Delivery fees per order, restaurant commission (15-20%), surge pricing during peak hours, subscription services',
      sw: 'Ada za utoaji kwa agizo, komishan ya mgahawa (15-20%), bei za juu wakati wa kilele, huduma za uandikishaji',
      ar: 'رسوم التوصيل لكل طلب، عمولة المطعم (15-20%)، تسعير الذروة خلال ساعات الذروة، خدمات الاشتراك',
      fr: 'Frais de livraison par commande, commission du restaurant (15-20%), tarification de pointe pendant les heures de pointe, services d\'abonnement'
    },
    valueProposition: {
      en: 'Fast, reliable delivery with real-time tracking, competitive fees, wide restaurant selection, and exceptional customer service',
      sw: 'Utoaji wa haraka, wa kutegemewa na ufuatiliaji wa wakati halisi, ada za ushindani, uchaguzi mpana wa migahawa, na huduma bora za wateja',
      ar: 'توصيل سريع وموثوق مع تتبع في الوقت الفعلي، رسوم تنافسية، مجموعة واسعة من المطاعم، وخدمة عملاء استثنائية',
      fr: 'Livraison rapide et fiable avec suivi en temps réel, frais compétitifs, large sélection de restaurants et service client exceptionnel'
    },
    keyPartners: {
      en: 'Local restaurants, delivery drivers, payment processors, app developers, motorcycle dealers, insurance companies',
      sw: 'Migahawa ya mitaani, madereva wa utoaji, wachakataji wa malipo, waendelezaji wa programu, wachuuzi wa pikipiki, makampuni ya bima',
      ar: 'المطاعم المحلية، سائقي التوصيل، معالجي المدفوعات، مطوري التطبيقات، تجار الدراجات النارية، شركات التأمين',
      fr: 'Restaurants locaux, livreurs, processeurs de paiement, développeurs d\'applications, concessionnaires de motos, compagnies d\'assurance'
    },
    marketingApproach: {
      en: 'Mobile app promotion, restaurant partnerships, social media advertising, referral programs, promotional campaigns',
      sw: 'Kutangaza programu za simu, ushirikiano wa migahawa, matangazo ya mitandao ya kijamii, mipango ya mapendekezo, kampeni za kutangaza',
      ar: 'ترويج تطبيقات الهاتف المحمول، شراكات المطاعم، إعلانات وسائل التواصل الاجتماعي، برامج الإحالة، حملات ترويجية',
      fr: 'Promotion d\'applications mobiles, partenariats de restaurants, publicité sur les réseaux sociaux, programmes de parrainage, campagnes promotionnelles'
    },
    operationalNeeds: {
      en: 'Delivery motorcycles, mobile app platform, GPS tracking system, insulated delivery bags, communication devices',
      sw: 'Pikipiki za utoaji, jukwaa la programu za simu, mfumo wa ufuatiliaji wa GPS, mifuko ya utoaji ya joto, vifaa vya mawasiliano',
      ar: 'دراجات نارية للتوصيل، منصة تطبيقات محمولة، نظام تتبع GPS، أكياس توصيل معزولة، أجهزة اتصال',
      fr: 'Motos de livraison, plateforme d\'applications mobiles, système de suivi GPS, sacs de livraison isolés, dispositifs de communication'
    },
    growthGoals: {
      en: 'Partner with 80+ restaurants, hire 15 full-time drivers, expand to 3 new areas, introduce grocery delivery',
      sw: 'Kushirikiana na migahawa 80+, kuajiri madereva 15 wa muda wote, kupanua hadi maeneo 3 mapya, kuanzisha utoaji wa mboga',
      ar: 'الشراكة مع أكثر من 80 مطعمًا، توظيف 15 سائقًا بدوام كامل، التوسع إلى 3 مناطق جديدة، تقديم توصيل البقالة',
      fr: 'Partenariat avec plus de 80 restaurants, embaucher 15 chauffeurs à temps plein, s\'étendre à 3 nouvelles zones, introduire la livraison d\'épicerie'
    }
  },
  'beauty-salon': {
    vision: {
      en: 'To be the premier beauty destination where everyone feels beautiful, confident, and pampered in a welcoming environment',
      sw: 'Kuwa marudio ya kwanza ya urembo ambapo kila mtu anahisi kuwa mzuri, kujiamini, na kudllaliwa katika mazingira ya kukaribishwa',
      ar: 'أن نكون وجهة الجمال الرائدة حيث يشعر الجميع بالجمال والثقة والدلال في بيئة ترحيبية',
      fr: 'Être la destination beauté premier où tout le monde se sent beau, confiant et choyé dans un environnement accueillant'
    },
    mission: {
      en: 'Providing exceptional beauty and grooming services in a relaxing, professional environment that enhances natural beauty',
      sw: 'Kutoa huduma za kipekee za urembo na upangaji katika mazingira ya kupumzika, ya kitaalamu yanayoongeza urembo wa asili',
      ar: 'توفير خدمات جمال وعناية استثنائية في بيئة مريحة ومهنية تعزز الجمال الطبيعي',
      fr: 'Fournir des services de beauté et de toilettage exceptionnels dans un environnement relaxant et professionnel qui rehausse la beauté naturelle'
    },
    targetMarket: {
      en: 'Men and women of all ages seeking professional beauty, hair care, grooming services, and personal wellness',
      sw: 'Wanaume na wanawake wa umri wote wanaotafuta urembo wa kitaalamu, utunzaji wa nywele, huduma za upangaji, na ustawi wa kibinafsi',
      ar: 'الرجال والنساء من جميع الأعمار الذين يسعون للجمال المهني ورعاية الشعر وخدمات العناية والعافية الشخصية',
      fr: 'Hommes et femmes de tous âges recherchant beauté professionnelle, soins capillaires, services de toilettage et bien-être personnel'
    },
    revenueModel: {
      en: 'Hair cuts and styling, beauty treatments, nail services, product sales, special occasion packages, membership programs',
      sw: 'Kukata na kupanga nywele, matibabu ya urembo, huduma za kucha, mauzo ya bidhaa, vifurushi vya sherehe maalum, mipango ya uanachama',
      ar: 'قص الشعر والتصفيف، علاجات الجمال، خدمات الأظافر، مبيعات المنتجات، باقات المناسبات الخاصة، برامج العضوية',
      fr: 'Coupes et coiffures, traitements de beauté, services d\'ongles, ventes de produits, forfaits occasions spéciales, programmes d\'adhésion'
    },
    valueProposition: {
      en: 'Professional beauty services with personalized attention, relaxing atmosphere, skilled stylists, and competitive pricing',
      sw: 'Huduma za urembo za kitaalamu na umakini wa kibinafsi, hali ya kupumzika, wastadi wenye ujuzi, na bei za ushindani',
      ar: 'خدمات جمال مهنية مع اهتمام شخصي، جو مريح، مصففون ماهرون، وتسعير تنافسي',
      fr: 'Services de beauté professionnels avec attention personnalisée, atmosphère relaxante, stylistes qualifiés et prix compétitifs'
    },
    keyPartners: {
      en: 'Beauty product suppliers, equipment vendors, beauty schools, local spas, wedding planners, fashion designers',
      sw: 'Wasambazaji wa bidhaa za urembo, wachuuzi wa vifaa, shule za urembo, spa za mitaani, wapanga harusi, wabunifu wa mtindo',
      ar: 'موردي منتجات التجميل، بائعي المعدات، مدارس التجميل، المنتجعات المحلية، مخططي الزفاف، مصممي الأزياء',
      fr: 'Fournisseurs de produits de beauté, vendeurs d\'équipement, écoles de beauté, spas locaux, planificateurs de mariage, créateurs de mode'
    },
    marketingApproach: {
      en: 'Social media before/after photos, loyalty programs, referral discounts, local advertising, influencer partnerships',
      sw: 'Picha za kabla/baada za mitandao ya kijamii, mipango ya uaminifu, punguzo za mapendekezo, matangazo ya mitaani, ushirikiano wa wataathiri',
      ar: 'صور قبل/بعد على وسائل التواصل الاجتماعي، برامج الولاء، خصومات الإحالة، الإعلان المحلي، شراكات المؤثرين',
      fr: 'Photos avant/après sur les réseaux sociaux, programmes de fidélité, remises de parrainage, publicité locale, partenariats d\'influenceurs'
    },
    operationalNeeds: {
      en: 'Salon chairs, hair washing stations, beauty equipment, products inventory, comfortable waiting area, sound system',
      sw: 'Viti vya salon, vituo vya kuosha nywele, vifaa vya urembo, orodha ya bidhaa, eneo la kusubiri la starehe, mfumo wa sauti',
      ar: 'كراسي الصالون، محطات غسيل الشعر، معدات التجميل، مخزون المنتجات، منطقة انتظار مريحة، نظام صوتي',
      fr: 'Chaises de salon, postes de lavage des cheveux, équipement de beauté, inventaire de produits, zone d\'attente confortable, système audio'
    },
    growthGoals: {
      en: 'Add nail and spa services, hire 3 additional stylists, introduce men\'s grooming line, establish second location',
      sw: 'Kuongeza huduma za kucha na spa, kuajiri wastadi 3 wa ziada, kuanzisha mstari wa upangaji wa wanaume, kuanzisha eneo la pili',
      ar: 'إضافة خدمات الأظافر والمنتجع الصحي، توظيف 3 مصففين إضافيين، تقديم خط العناية للرجال، إنشاء موقع ثانٍ',
      fr: 'Ajouter des services d\'ongles et de spa, embaucher 3 stylistes supplémentaires, introduire une ligne de toilettage pour hommes, établir un second emplacement'
    }
  }
};

export const getTemplateData = (language: string = 'en'): TemplateData[] => {
  console.log('Getting template data for language:', language);
  
  const getTranslatedContent = (templateId: string, language: string) => {
    const content = templateContents[templateId];
    if (!content) {
      // Fallback for templates not yet translated
      return {
        vision: 'Template content not yet available in this language',
        mission: 'Template content not yet available in this language',
        targetMarket: 'Template content not yet available in this language',
        revenueModel: 'Template content not yet available in this language',
        valueProposition: 'Template content not yet available in this language',
        keyPartners: 'Template content not yet available in this language',
        marketingApproach: 'Template content not yet available in this language',
        operationalNeeds: 'Template content not yet available in this language',
        growthGoals: 'Template content not yet available in this language'
      };
    }
    
    return {
      vision: content.vision[language] || content.vision.en,
      mission: content.mission[language] || content.mission.en,
      targetMarket: content.targetMarket[language] || content.targetMarket.en,
      revenueModel: content.revenueModel[language] || content.revenueModel.en,
      valueProposition: content.valueProposition[language] || content.valueProposition.en,
      keyPartners: content.keyPartners[language] || content.keyPartners.en,
      marketingApproach: content.marketingApproach[language] || content.marketingApproach.en,
      operationalNeeds: content.operationalNeeds[language] || content.operationalNeeds.en,
      growthGoals: content.growthGoals[language] || content.growthGoals.en
    };
  };
  
  const templates: TemplateData[] = [
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items',
      content: getTranslatedContent('auto-repair', language)
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: getTranslatedContent('cyber-cafe', language)
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals',
      content: getTranslatedContent('real-estate', language)
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : language === 'ar' ? 'خدمات التنظيف' : language === 'fr' ? 'Services de Nettoyage' : 'Cleaning Services',
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : language === 'ar' ? 'تنظيف المنازل والمكاتب' : language === 'fr' ? 'Nettoyage de maisons et bureaux' : 'Home and office cleaning',
      content: {
        vision: 'To be the leading cleaning service known for reliability, quality, eco-friendly practices and exceptional customer satisfaction',
        mission: 'Providing exceptional cleaning services that give clients more time for what matters most while maintaining healthy environments',
        targetMarket: 'Busy professionals, families with children, elderly clients, small businesses, medical facilities, commercial establishments',
        revenueModel: 'Recurring weekly/monthly cleaning contracts, one-time deep cleaning services, specialized cleaning, emergency cleanup services',
        valueProposition: 'Reliable, thorough cleaning with eco-friendly products, flexible scheduling, bonded staff, and satisfaction guarantee',
        keyPartners: 'Cleaning supply companies, insurance providers, local businesses, residential complexes, property management companies',
        marketingApproach: 'Word-of-mouth referrals, online reviews, door-to-door marketing, partnerships with realtors, social media presence',
        operationalNeeds: 'Professional cleaning supplies, transportation vehicle, uniforms, insurance coverage, equipment storage, scheduling system',
        growthGoals: 'Hire 4 additional cleaners, add commercial cleaning services, establish franchise model, expand service area'
      }
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : language === 'ar' ? 'تنظيم الفعاليات' : language === 'fr' ? 'Organisation d\'Événements' : 'Event Planning',
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : language === 'ar' ? 'تنظيم الأعراس والحفلات والفعاليات' : language === 'fr' ? 'Organisation de mariages, fêtes et événements' : 'Weddings, parties, and celebrations',
      content: getTranslatedContent('event-planning', language)
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services',
      content: getTranslatedContent('photography', language)
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery',
      content: getTranslatedContent('food-delivery', language)
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services',
      content: getTranslatedContent('beauty-salon', language)
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance',
      content: {
        vision: 'To be the most trusted auto repair shop known for honest service, quality work, fair pricing, and customer satisfaction',
        mission: 'Keeping our community\'s vehicles safe and reliable through expert repair services, preventive maintenance, and honest advice',
        targetMarket: 'Vehicle owners seeking reliable, affordable auto repair, maintenance services, and emergency roadside assistance',
        revenueModel: 'Labor charges for repairs, parts markup (20-30%), maintenance packages, emergency roadside assistance, diagnostic services',
        valueProposition: 'Honest diagnostics, quality repairs with warranty, fair pricing, excellent customer service, and quick turnaround',
        keyPartners: 'Auto parts suppliers, towing services, insurance companies, car dealerships, tire suppliers, equipment manufacturers',
        marketingApproach: 'Word-of-mouth referrals, online reviews, local advertising, partnerships with car dealers, community involvement',
        operationalNeeds: 'Garage space with lifts, diagnostic equipment, hand tools, parts inventory, waiting area, safety equipment',
        growthGoals: 'Add tire services, expand to include motorcycles, hire 2 additional mechanics, establish mobile repair service'
      }
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery',
      content: getTranslatedContent('boda-boda', language)
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: getTranslatedContent('cyber-cafe', language)
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision',
      content: getTranslatedContent('daycare', language)
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries',
      content: {
        vision: 'To be the neighborhood\'s favorite bakery known for fresh, delicious baked goods, quality ingredients, and exceptional service',
        mission: 'Bringing joy to our community through freshly baked breads, cakes, and pastries made with love and quality ingredients',
        targetMarket: 'Local families, offices, restaurants, schools, customers needing custom cakes for special events, breakfast commuters',
        revenueModel: 'Daily sales of bread and pastries, custom cake orders, catering services, wholesale to cafes, special occasion items',
        valueProposition: 'Fresh, homemade baked goods using quality ingredients at competitive prices with custom options and consistent quality',
        keyPartners: 'Flour and ingredient suppliers, local cafes, event planners, grocery stores, schools, wedding planners',
        marketingApproach: 'Social media photos of daily offerings, word-of-mouth, local events, loyalty cards, seasonal promotions',
        operationalNeeds: 'Commercial ovens, baking equipment, ingredients inventory, retail display cases, packaging materials, cash register',
        growthGoals: 'Add coffee service, expand custom cake decorating, hire 2 bakers, open second location, establish wholesale division'
      }
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support',
      content: {
        vision: 'To help every student reach their full academic potential and develop confidence, critical thinking, and love for learning',
        mission: 'Providing personalized tutoring that builds confidence, improves academic performance, and fosters lifelong learning skills',
        targetMarket: 'Students from primary through university level, adult learners, parents seeking academic support for children',
        revenueModel: 'Hourly tutoring rates, group class fees, exam preparation packages, online tutoring sessions, educational consulting',
        valueProposition: 'Personalized instruction that adapts to each student\'s learning style with proven results and flexible scheduling',
        keyPartners: 'Schools, parents, educational supply companies, online learning platforms, testing centers, academic institutions',
        marketingApproach: 'Parent referrals, school partnerships, online testimonials, social media success stories, community outreach',
        operationalNeeds: 'Teaching materials, comfortable learning space, educational resources, whiteboard, computer, assessment tools',
        growthGoals: 'Hire 3 additional tutors, offer online tutoring services, establish test prep center, create learning app'
      }
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching',
      content: {
        vision: 'To help people achieve their fitness goals and live healthier, stronger, more confident lives through personalized training',
        mission: 'Providing expert fitness guidance that transforms lives through sustainable health practices, motivation, and results-driven training',
        targetMarket: 'Adults seeking weight loss, strength building, overall fitness improvement, athletes, busy professionals, seniors',
        revenueModel: 'Personal training sessions, group fitness classes, fitness program packages, nutritional consultation, online coaching',
        valueProposition: 'Customized fitness programs with ongoing support, motivation, proven results, flexible scheduling, and holistic approach',
        keyPartners: 'Gyms, nutritionists, sports equipment suppliers, health practitioners, supplement stores, wellness centers',
        marketingApproach: 'Client transformation showcases on social media, referrals, fitness challenges, free consultations, community events',
        operationalNeeds: 'Fitness equipment, training space rental, certification maintenance, liability insurance, assessment tools',
        growthGoals: 'Open small gym facility, add nutrition counseling services, hire 2 trainers, launch online coaching platform'
      }
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision',
      content: {
        vision: 'To provide a safe, nurturing environment where children can learn, grow, and develop to their fullest potential',
        mission: 'Supporting working families by providing quality childcare with educational activities, loving care, and developmental support',
        targetMarket: 'Working parents with children aged 6 months to 5 years, single parents, shift workers, families needing flexible care',
        revenueModel: 'Daily/weekly childcare fees, registration fees, after-school care, summer programs, meals, educational activities',
        valueProposition: 'Safe, educational childcare with flexible scheduling, caring qualified staff, developmental activities, and nutritious meals',
        keyPartners: 'Educational toy suppliers, child development specialists, local schools, health clinics, food suppliers',
        marketingApproach: 'Parent referrals, community bulletin boards, social media, open houses, partnerships with employers, pediatrician referrals',
        operationalNeeds: 'Child-safe facility, toys and educational materials, security system, licenses, insurance, kitchen facilities',
        growthGoals: 'Add after-school program, increase capacity to 30 children, hire 2 teachers, establish pre-school curriculum'
      }
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Management',
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing',
      content: {
        vision: 'To help businesses build strong online communities and grow their digital presence effectively through strategic social media',
        mission: 'Creating engaging social media strategies that connect businesses with their customers, drive growth, and build brand loyalty',
        targetMarket: 'Small to medium businesses, entrepreneurs, personal brands, restaurants, retail stores, service providers',
        revenueModel: 'Monthly management retainers, content creation packages, advertising management fees, strategy consultations, training workshops',
        valueProposition: 'Professional social media management that increases engagement, followers, brand awareness, and drives measurable sales',
        keyPartners: 'Graphic designers, photographers, web developers, advertising platforms, content creators, influencers',
        marketingApproach: 'Case studies showcasing client success, free consultations, networking events, online content, referral programs',
        operationalNeeds: 'Computer, design software, social media management tools, project management systems, analytics tools',
        growthGoals: 'Build client base to 20 regular accounts, add video content services, hire content creator, develop training courses'
      }
    }
  ];

  // Sort templates alphabetically by name
  const sortedTemplates = templates.sort((a, b) => a.name.localeCompare(b.name));
  
  console.log('Template data generated:', sortedTemplates.length, 'templates');
  return sortedTemplates;
};
