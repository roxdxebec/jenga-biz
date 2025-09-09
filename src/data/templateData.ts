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
  'bakery': {
    vision: {
      en: 'To be the neighborhood\'s favorite bakery, bringing fresh, delicious baked goods that bring families and communities together',
      sw: 'Kuwa jikoni la upishi wa kawaida la mtaa, kuleta vitu vya upishi vipya na vitamu vinavyoleta familia na jamii pamoja',
      ar: 'أن نكون المخبز المفضل في الحي، حيث نقدم منتجات طازجة ولذيذة تجمع العائلات والمجتمعات معًا',
      fr: 'Être la boulangerie préférée du quartier, apportant des produits frais et délicieux qui rassemblent les familles et les communautés'
    },
    mission: {
      en: 'Creating high-quality baked goods with fresh ingredients, exceptional service, and traditional recipes that satisfy every customer',
      sw: 'Kuunda bidhaa za upishi za ubora wa juu kwa viungo vipya, huduma ya kipekee, na mapishi ya jadi yanayoridhisha kila mteja',
      ar: 'إنتاج منتجات مخبوزة عالية الجودة بمكونات طازجة وخدمة استثنائية ووصفات تقليدية ترضي كل عميل',
      fr: 'Créer des produits de boulangerie de haute qualité avec des ingrédients frais, un service exceptionnel et des recettes traditionnelles qui satisfont chaque client'
    },
    targetMarket: {
      en: 'Local families, office workers, restaurants, cafes, schools, and special event planners seeking fresh baked goods',
      sw: 'Familia za mitaani, wafanyakazi wa ofisi, migahawa, viketi, shule, na wapanga matukio maalum wanaotafuta bidhaa za upishi zipya',
      ar: 'العائلات المحلية، موظفو المكاتب، المطاعم، المقاهي، المدارس، ومخططو الفعاليات الخاصة الذين يبحثون عن منتجات مخبوزة طازجة',
      fr: 'Familles locales, employés de bureau, restaurants, cafés, écoles et organisateurs d\'événements spéciaux recherchant des produits de boulangerie frais'
    },
    revenueModel: {
      en: 'Direct sales of bread, pastries, cakes, catering orders, custom cake orders, wholesale to local businesses',
      sw: 'Mauzo ya moja kwa moja ya mikate, vitale, keki, maagizo ya chakula, maagizo ya keki maalum, jumlani kwa biashara za mitaani',
      ar: 'المبيعات المباشرة للخبز والمعجنات والكعك، طلبات التموين، طلبات الكعك المخصصة، البيع بالجملة للشركات المحلية',
      fr: 'Ventes directes de pain, pâtisseries, gâteaux, commandes de restauration, commandes de gâteaux personnalisés, vente en gros aux entreprises locales'
    },
    valueProposition: {
      en: 'Fresh daily baked goods, competitive prices, custom orders, reliable delivery, quality ingredients, traditional and modern recipes',
      sw: 'Bidhaa za upishi zilizopikwa kila siku, bei za ushindani, maagizo maalum, utoaji wa kutegemewa, viungo vya ubora, mapishi ya jadi na ya kisasa',
      ar: 'منتجات مخبوزة طازجة يومية، أسعار تنافسية، طلبات مخصصة، توصيل موثوق، مكونات عالية الجودة، وصفات تقليدية وحديثة',
      fr: 'Produits frais cuits quotidiennement, prix compétitifs, commandes personnalisées, livraison fiable, ingrédients de qualité, recettes traditionnelles et modernes'
    },
    keyPartners: {
      en: 'Flour suppliers, local farmers for eggs and dairy, packaging suppliers, delivery services, local restaurants and cafes',
      sw: 'Wauzaji wa unga, wakulima wa mitaani kwa mayai na mazao ya ng\'ombe, wauzaji wa mifuko, huduma za utoaji, migahawa ya mitaani na viketi',
      ar: 'موردو الدقيق، المزارعون المحليون للبيض ومنتجات الألبان، موردو التغليف، خدمات التوصيل، المطاعم والمقاهي المحلية',
      fr: 'Fournisseurs de farine, agriculteurs locaux pour œufs et produits laitiers, fournisseurs d\'emballage, services de livraison, restaurants et cafés locaux'
    },
    marketingApproach: {
      en: 'Social media marketing, local community events, word-of-mouth referrals, seasonal promotions, loyalty programs',
      sw: 'Uuzaji kupitia mitandao ya kijamii, matukio ya jamii za mitaani, mapendekezo ya mdomo kwa mdomo, uuzaji wa msimu, mipango ya uongozi',
      ar: 'التسويق عبر وسائل التواصل الاجتماعي، فعاليات المجتمع المحلي، الإحالات الشفهية، العروض الترويجية الموسمية، برامج الولاء',
      fr: 'Marketing sur les réseaux sociaux, événements communautaires locaux, recommandations bouche-à-oreille, promotions saisonnières, programmes de fidélité'
    },
    operationalNeeds: {
      en: 'Commercial ovens, baking equipment, ingredients, packaging materials, display cases, Point of Sale system, delivery vehicle',
      sw: 'Matanuru ya kibiashara, vifaa vya upishi, viungo, nyenzo za mifuko, masanduku ya kuonyesha, mfumo wa Mahali pa Mauzo, gari la utoaji',
      ar: 'أفران تجارية، معدات الخبز، المكونات، مواد التغليف، واجهات العرض، نظام نقاط البيع، مركبة التوصيل',
      fr: 'Fours commerciaux, équipement de boulangerie, ingrédients, matériaux d\'emballage, vitrines d\'exposition, système de point de vente, véhicule de livraison'
    },
    growthGoals: {
      en: 'Add breakfast pastries line, establish wedding cake specialty, hire 2 additional bakers, expand catering services',
      sw: 'Kuongeza safu ya vitale vya kifungua kinywa, kuanzisha utaalamu wa keki za harusi, kuajiri wapishi 2 zaidi, kupanua huduma za chakula',
      ar: 'إضافة خط المعجنات للإفطار، إنشاء تخصص كعك الزفاف، توظيف خبازين إضافيين، توسيع خدمات التموين',
      fr: 'Ajouter une gamme de pâtisseries petit-déjeuner, établir une spécialité gâteaux de mariage, embaucher 2 boulangers supplémentaires, étendre les services de restauration'
    }
  },
  'mitumba': {
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
      fr: 'Espace de magasin, stockage pour l\'inventaire， transport pour la collecte des balles, équipement de tri, compte d\'argent mobile, caisse enregistreuse'
    },
    growthGoals: {
      en: 'Expand to online sales platform, add more product categories, establish multiple outlets, create wholesale distribution network',
      sw: 'Kupanua kwenda mfumo wa mauzo ya mtandaoni, kuongeza aina zaidi za bidhaa, kuanzisha maduka mengi, kuunda mtandao wa usambazaji wa jumla',
      ar: 'التوسع إلى منصة المبيعات عبر الإنترنت، إضافة المزيد من فئات المنتجات، إنشاء منافذ متعددة، إنشاء شبكة توزيع بالجملة',
      fr: 'Expansion vers une plateforme de vente en ligne, ajout de plus de catégories de produits, établissement de plusieurs points de vente, création d\'un réseau de distribution en gros'
    }
  },
  'auto-repair': {
    vision: {
      en: 'To be the most trusted automotive repair service in our area, known for honest pricing, quality work, and exceptional customer service',
      sw: 'Kuwa huduma ya ukarabati wa magari inayoaminika zaidi katika eneo letu, inayojulikana kwa bei za uaminifu, kazi ya ubora, na huduma ya kipekee kwa wateja',
      ar: 'أن نكون خدمة إصلاح السيارات الأكثر ثقة في منطقتنا، المعروفة بالأسعار الصادقة والعمل عالي الجودة وخدمة العملاء الاستثنائية',
      fr: 'Être le service de réparation automobile le plus fiable de notre région, connu pour ses prix honnêtes, son travail de qualité et son service client exceptionnel'
    },
    mission: {
      en: 'Providing reliable, affordable automotive repair and maintenance services with transparent pricing and skilled craftsmanship',
      sw: 'Kutoa huduma za ukarabati na matengenezo ya magari za kutegemewa na bei nafuu kwa bei wazi na ufundi wa ustadi',
      ar: 'تقديم خدمات إصلاح وصيانة السيارات الموثوقة وبأسعار معقولة مع تسعير شفاف وحرفية ماهرة',
      fr: 'Fournir des services de réparation et d\'entretien automobile fiables et abordables avec une tarification transparente et un savoir-faire qualifié'
    },
    targetMarket: {
      en: 'Vehicle owners, taxi operators, matatu owners, delivery companies, government fleets, and individual car owners',
      sw: 'Wamiliki wa magari, waendeshaji wa teksi, wamiliki wa matatu, makampuni ya utoaji, madereva za serikali, na wamiliki wa magari binafsi',
      ar: 'أصحاب المركبات، مشغلو سيارات الأجرة، أصحاب الماتاتو، شركات التوصيل، أساطيل الحكومة، وأصحاب السيارات الأفراد',
      fr: 'Propriétaires de véhicules, opérateurs de taxi, propriétaires de matatu, entreprises de livraison, flottes gouvernementales et propriétaires de voitures individuels'
    },
    revenueModel: {
      en: 'Repair services, maintenance packages, parts sales, diagnostic services, emergency roadside assistance',
      sw: 'Huduma za ukarabati, vifurushi vya matengenezo, mauzo ya sehemu, huduma za uchunguzi, msaada wa dharura wa barabarani',
      ar: 'خدمات الإصلاح، حزم الصيانة، مبيعات قطع الغيار، خدمات التشخيص، المساعدة الطارئة على الطريق',
      fr: 'Services de réparation, forfaits d\'entretien, vente de pièces, services de diagnostic, assistance routière d\'urgence'
    },
    valueProposition: {
      en: 'Honest pricing, quality repairs, quick turnaround, warranty on work, experienced mechanics, genuine parts',
      sw: 'Bei za uaminifu, ukarabati wa ubora, mzunguko wa haraka, dhamana ya kazi, mafundi wenye uzoefu, sehemu halisi',
      ar: 'أسعار صادقة، إصلاحات عالية الجودة، تسليم سريع، ضمان على العمل، ميكانيكيون ذوو خبرة، قطع أصلية',
      fr: 'Prix honnêtes, réparations de qualité, délai d\'exécution rapide, garantie sur le travail, mécaniciens expérimentés, pièces authentiques'
    },
    keyPartners: {
      en: 'Auto parts suppliers, towing services, insurance companies, vehicle dealerships, equipment suppliers',
      sw: 'Wasambazaji wa sehemu za magari, huduma za kuvuta, makampuni ya bima, mauzo ya magari, wasambazaji wa vifaa',
      ar: 'موردو قطع غيار السيارات، خدمات السحب، شركات التأمين، وكلاء السيارات، موردو المعدات',
      fr: 'Fournisseurs de pièces automobiles, services de remorquage, compagnies d\'assurance, concessionnaires de véhicules, fournisseurs d\'équipements'
    },
    marketingApproach: {
      en: 'Word-of-mouth referrals, local advertising, social media presence, customer loyalty programs, partnerships with fleet owners',
      sw: 'Mapendekezo ya mdomo kwa mdomo, matangazo ya mitaani, uwepo wa mitandao ya kijamii, mipango ya uongozi wa wateja, ushirikiano na wamiliki wa madereva',
      ar: 'إحالات الكلام الشفهي، الإعلان المحلي، الحضور على وسائل التواصل الاجتماعي، برامج ولاء العملاء، الشراكات مع أصحاب الأساطيل',
      fr: 'Références de bouche-à-oreille, publicité locale, présence sur les réseaux sociaux, programmes de fidélité client, partenariats avec les propriétaires de flottes'
    },
    operationalNeeds: {
      en: 'Workshop space, automotive tools, diagnostic equipment, parts inventory, lift/jack systems, safety equipment',
      sw: 'Nafasi ya warsha, zana za magari, vifaa vya uchunguzi, ghala la sehemu, mifumo ya kuinua/jack, vifaa vya usalama',
      ar: 'مساحة الورشة، أدوات السيارات، معدات التشخيص، مخزون قطع الغيار، أنظمة الرفع/الرافعة، معدات السلامة',
      fr: 'Espace d\'atelier, outils automobiles, équipement de diagnostic, inventaire de pièces, systèmes de levage/cric, équipement de sécurité'
    },
    growthGoals: {
      en: 'Add specialized services (AC repair, bodywork), hire additional mechanics, expand workshop space, offer mobile repair services',
      sw: 'Kuongeza huduma maalum (ukarabati wa AC, kazi ya mwili), kuajiri mafundi zaidi, kupanua nafasi ya warsha, kutoa huduma za ukarabati wa simu',
      ar: 'إضافة خدمات متخصصة (إصلاح التكييف، أعمال الهيكل)، توظيف ميكانيكيين إضافيين، توسيع مساحة الورشة، تقديم خدمات الإصلاح المتنقلة',
      fr: 'Ajouter des services spécialisés (réparation AC, carrosserie), embaucher des mécaniciens supplémentaires, agrandir l\'espace d\'atelier, offrir des services de réparation mobile'
    }
  },
  'cybercafe': {
    vision: {
      en: 'To be the leading digital services hub in our community, bridging the digital divide and empowering people with technology access',
      sw: 'Kuwa kituo cha huduma za kidijitali kinachongoza katika jamii yetu, kiunganisha pengo la kidijitali na kuwezesha watu kupata teknolojia',
      ar: 'أن نكون مركز الخدمات الرقمية الرائد في مجتمعنا، وسد الفجوة الرقمية وتمكين الناس من الوصول إلى التكنولوجيا',
      fr: 'Être le centre de services numériques leader dans notre communauté, comblant la fracture numérique et donnant aux gens l\'accès à la technologie'
    },
    mission: {
      en: 'Providing affordable internet access, computer services, and digital literacy training to empower our community',
      sw: 'Kutoa upatikanaji wa mtandao wa bei nafuu, huduma za kompyuta, na mafunzo ya ujuzi wa kidijitali ili kuwezesha jamii yetu',
      ar: 'توفير الوصول إلى الإنترنت بأسعار معقولة وخدمات الكمبيوتر والتدريب على محو الأمية الرقمية لتمكين مجتمعنا',
      fr: 'Fournir un accès Internet abordable, des services informatiques et une formation en littératie numérique pour autonomiser notre communauté'
    },
    targetMarket: {
      en: 'Students, job seekers, small business owners, government service users, and individuals without home internet access',
      sw: 'Wanafunzi, watafutaji kazi, wamiliki wa biashara ndogo, watumiaji wa huduma za serikali, na watu wasio na mtandao wa nyumbani',
      ar: 'الطلاب، الباحثون عن عمل، أصحاب الأعمال الصغيرة، مستخدمو الخدمات الحكومية، والأفراد الذين لا يملكون إنترنت منزلي',
      fr: 'Étudiants, demandeurs d\'emploi, propriétaires de petites entreprises, utilisateurs de services gouvernementaux et personnes sans accès Internet à domicile'
    },
    revenueModel: {
      en: 'Internet access fees, printing services, document typing, computer training, mobile money services, phone charging',
      sw: 'Ada za upatikanaji wa mtandao, huduma za kuchapisha, kuandika hati, mafunzo ya kompyuta, huduma za pesa za simu, kuchaji simu',
      ar: 'رسوم الوصول إلى الإنترنت، خدمات الطباعة، كتابة المستندات، تدريب الكمبيوتر، خدمات الأموال المحمولة، شحن الهاتف',
      fr: 'Frais d\'accès Internet, services d\'impression, saisie de documents, formation informatique, services d\'argent mobile, recharge de téléphone'
    },
    valueProposition: {
      en: 'Affordable rates, reliable internet, extended hours, additional services, friendly assistance, secure environment',
      sw: 'Viwango vya bei nafuu, mtandao wa kutegemewa, masaa ya ziada, huduma za ziada, msaada wa kirafiki, mazingira salama',
      ar: 'أسعار معقولة، إنترنت موثوق، ساعات ممتدة، خدمات إضافية، مساعدة ودية، بيئة آمنة',
      fr: 'Tarifs abordables, Internet fiable, heures prolongées, services supplémentaires, assistance amicale, environnement sécurisé'
    },
    keyPartners: {
      en: 'Internet service providers, computer suppliers, software vendors, mobile money agents, stationery suppliers',
      sw: 'Watoa huduma za mtandao, wasambazaji wa kompyuta, wachuuzi wa programu, mawakala wa pesa za simu, wasambazaji wa vifaa vya ofisi',
      ar: 'مقدمو خدمات الإنترنت، موردو الكمبيوتر، بائعو البرمجيات، وكلاء الأموال المحمولة، موردو القرطاسية',
      fr: 'Fournisseurs de services Internet, fournisseurs d\'ordinateurs, vendeurs de logiciels, agents d\'argent mobile, fournisseurs de papeterie'
    },
    marketingApproach: {
      en: 'Community outreach, student discounts, referral programs, local partnerships, social media marketing',
      sw: 'Kufikia jamii, punguzo za wanafunzi, mipango ya mapendekezo, ushirikiano wa mitaani, uuzaji wa mitandao ya kijamii',
      ar: 'التواصل المجتمعي، خصومات الطلاب، برامج الإحالة، الشراكات المحلية، التسويق عبر وسائل التواصل الاجتماعي',
      fr: 'Sensibilisation communautaire, remises étudiantes, programmes de parrainage, partenariats locaux, marketing sur les réseaux sociaux'
    },
    operationalNeeds: {
      en: 'Computers, internet connection, printers, furniture, security system, backup power, software licenses',
      sw: 'Kompyuta, muunganisho wa mtandao, vichapishi, samani, mfumo wa usalama, nguvu za hifadhi, leseni za programu',
      ar: 'أجهزة كمبيوتر، اتصال إنترنت، طابعات، أثاث، نظام أمان، طاقة احتياطية، تراخيص برمجيات',
      fr: 'Ordinateurs, connexion Internet, imprimantes, mobilier, système de sécurité, alimentation de secours, licences logicielles'
    },
    growthGoals: {
      en: 'Add gaming services, expand training programs, offer web design services, establish multiple locations',
      sw: 'Kuongeza huduma za michezo, kupanua mipango ya mafunzo, kutoa huduma za kubuni tovuti, kuanzisha maeneo mengi',
      ar: 'إضافة خدمات الألعاب، توسيع برامج التدريب، تقديم خدمات تصميم الويب، إنشاء مواقع متعددة',
      fr: 'Ajouter des services de jeux, étendre les programmes de formation, offrir des services de conception Web, établir plusieurs emplacements'
    }
  },
  'agribusiness': {
    vision: {
      en: 'To be a leading sustainable agricultural enterprise that feeds communities while preserving the environment',
      sw: 'Kuwa shirika la kilimo endelevu linalongoza ambalo linalisisha jamii huku likilinda mazingira',
      ar: 'أن نكون مؤسسة زراعية مستدامة رائدة تطعم المجتمعات مع الحفاظ على البيئة',
      fr: 'Être une entreprise agricole durable de premier plan qui nourrit les communautés tout en préservant l\'environnement'
    },
    mission: {
      en: 'Producing high-quality crops using sustainable farming practices to provide nutritious food and create employment',
      sw: 'Kuzalisha mazao ya ubora wa juu kwa kutumia mbinu za kilimo endelevu kutoa chakula chenye vitamini na kuunda ajira',
      ar: 'إنتاج محاصيل عالية الجودة باستخدام ممارسات زراعية مستدامة لتوفير غذاء مغذي وخلق فرص عمل',
      fr: 'Produire des cultures de haute qualité en utilisant des pratiques agricoles durables pour fournir des aliments nutritifs et créer des emplois'
    },
    targetMarket: {
      en: 'Local markets, restaurants, schools, food processors, export markets, agricultural cooperatives',
      sw: 'Masoko ya mitaani, migahawa, shule, wasindikaji wa chakula, masoko ya nje, vyama vya ushirika wa kilimo',
      ar: 'الأسواق المحلية، المطاعم، المدارس، معالجات الأغذية، أسواق التصدير، التعاونيات الزراعية',
      fr: 'Marchés locaux, restaurants, écoles, transformateurs alimentaires, marchés d\'exportation, coopératives agricoles'
    },
    revenueModel: {
      en: 'Direct crop sales, wholesale to distributors, farm-to-table services, value-added processing, contract farming',
      sw: 'Mauzo ya moja kwa moja ya mazao, jumla kwa wasambazaji, huduma za kutoka shambani hadi mezani, usindikaji wa kuongeza thamani, kilimo cha mkataba',
      ar: 'مبيعات المحاصيل المباشرة، البيع بالجملة للموزعين، خدمات من المزرعة إلى المائدة، المعالجة ذات القيمة المضافة، الزراعة التعاقدية',
      fr: 'Ventes directes de cultures, vente en gros aux distributeurs, services de la ferme à la table, transformation à valeur ajoutée, agriculture contractuelle'
    },
    valueProposition: {
      en: 'Fresh, organic produce, sustainable farming methods, reliable supply, competitive pricing, local sourcing',
      sw: 'Mazao mazuri na mazuri, mbinu za kilimo endelevu, ugavi wa kutegemewa, bei za ushindani, vyanzo vya mitaani',
      ar: 'منتجات طازجة وعضوية، طرق زراعة مستدامة، إمداد موثوق، أسعار تنافسية، مصادر محلية',
      fr: 'Produits frais et biologiques, méthodes de culture durables, approvisionnement fiable, prix compétitifs, approvisionnement local'
    },
    keyPartners: {
      en: 'Agricultural input suppliers, irrigation companies, equipment dealers, agricultural extension services, cooperatives',
      sw: 'Wasambazaji wa vitu vya kilimo, makampuni ya umwagiliaji, wachuuzi wa vifaa, huduma za upanuzi wa kilimo, vyama vya ushirika',
      ar: 'موردو المدخلات الزراعية، شركات الري، تجار المعدات، خدمات الإرشاد الزراعي، التعاونيات',
      fr: 'Fournisseurs d\'intrants agricoles, entreprises d\'irrigation, concessionnaires d\'équipements, services de vulgarisation agricole, coopératives'
    },
    marketingApproach: {
      en: 'Direct relationships with buyers, farmers markets, online platforms, agricultural trade shows, word-of-mouth',
      sw: 'Uhusiano wa moja kwa moja na wanunuzi, masoko ya wakulima, mifumo ya mtandaoni, maonyesho ya biashara ya kilimo, mdomo kwa mdomo',
      ar: 'علاقات مباشرة مع المشترين، أسواق المزارعين، منصات عبر الإنترنت، معارض التجارة الزراعية، الكلام الشفهي',
      fr: 'Relations directes avec les acheteurs, marchés fermiers, plateformes en ligne, salons commerciaux agricoles, bouche-à-oreille'
    },
    operationalNeeds: {
      en: 'Land, seeds, fertilizers, irrigation system, farming equipment, storage facilities, transportation, workers',
      sw: 'Ardhi, mbegu, mbolea, mfumo wa umwagiliaji, vifaa vya kilimo, vifaa vya kuhifadhi, usafiri, wafanyakazi',
      ar: 'الأرض، البذور، الأسمدة، نظام الري، معدات الزراعة، مرافق التخزين، النقل، العمال',
      fr: 'Terrain, graines, engrais, système d\'irrigation, équipement agricole, installations de stockage, transport, travailleurs'
    },
    growthGoals: {
      en: 'Expand acreage, add greenhouse farming, diversify crops, establish processing facility, enter export markets',
      sw: 'Kupanua eneo, kuongeza kilimo cha bustani, kutofautisha mazao, kuanzisha kituo cha usindikaji, kuingia masoko ya nje',
      ar: 'توسيع المساحة، إضافة الزراعة المحمية، تنويع المحاصيل، إنشاء مرفق معالجة، دخول أسواق التصدير',
      fr: 'Étendre la superficie, ajouter la culture en serre, diversifier les cultures, établir une installation de traitement, entrer sur les marchés d\'exportation'
    }
  }
};

export const getTemplateData = (language: string = 'en') => {
  const templates: TemplateData[] = [
    {
      id: 'bakery',
      name: 'Bakery',
      description: language === 'sw' ? 'Biashara ya upishi na vipindi' :
                  language === 'ar' ? 'أعمال المخبز والحلويات' :
                  language === 'fr' ? 'Affaires de boulangerie et pâtisserie' :
                  'Bakery and baked goods business',
      content: {
        vision: templateContents.bakery.vision[language] || templateContents.bakery.vision.en,
        mission: templateContents.bakery.mission[language] || templateContents.bakery.mission.en,
        targetMarket: templateContents.bakery.targetMarket[language] || templateContents.bakery.targetMarket.en,
        revenueModel: templateContents.bakery.revenueModel[language] || templateContents.bakery.revenueModel.en,
        valueProposition: templateContents.bakery.valueProposition[language] || templateContents.bakery.valueProposition.en,
        keyPartners: templateContents.bakery.keyPartners[language] || templateContents.bakery.keyPartners.en,
        marketingApproach: templateContents.bakery.marketingApproach[language] || templateContents.bakery.marketingApproach.en,
        operationalNeeds: templateContents.bakery.operationalNeeds[language] || templateContents.bakery.operationalNeeds.en,
        growthGoals: templateContents.bakery.growthGoals[language] || templateContents.bakery.growthGoals.en,
      }
    },
    {
      id: 'mitumba',
      name: 'Mitumba Shop',
      description: language === 'sw' ? 'Biashara ya nguo za mitumba' :
                  language === 'ar' ? 'متجر الملابس المستعملة' :
                  language === 'fr' ? 'Magasin de vêtements d\'occasion' :
                  'Second-hand clothing business',
      content: {
        vision: templateContents.mitumba.vision[language] || templateContents.mitumba.vision.en,
        mission: templateContents.mitumba.mission[language] || templateContents.mitumba.mission.en,
        targetMarket: templateContents.mitumba.targetMarket[language] || templateContents.mitumba.targetMarket.en,
        revenueModel: templateContents.mitumba.revenueModel[language] || templateContents.mitumba.revenueModel.en,
        valueProposition: templateContents.mitumba.valueProposition[language] || templateContents.mitumba.valueProposition.en,
        keyPartners: templateContents.mitumba.keyPartners[language] || templateContents.mitumba.keyPartners.en,
        marketingApproach: templateContents.mitumba.marketingApproach[language] || templateContents.mitumba.marketingApproach.en,
        operationalNeeds: templateContents.mitumba.operationalNeeds[language] || templateContents.mitumba.operationalNeeds.en,
        growthGoals: templateContents.mitumba.growthGoals[language] || templateContents.mitumba.growthGoals.en,
      }
    },
    {
      id: 'auto-repair',
      name: 'Auto Repair Shop',
      description: language === 'sw' ? 'Biashara ya ukarabati wa magari' :
                  language === 'ar' ? 'ورشة إصلاح السيارات' :
                  language === 'fr' ? 'Atelier de réparation automobile' :
                  'Automotive repair and maintenance business',
      content: {
        vision: templateContents['auto-repair'].vision[language] || templateContents['auto-repair'].vision.en,
        mission: templateContents['auto-repair'].mission[language] || templateContents['auto-repair'].mission.en,
        targetMarket: templateContents['auto-repair'].targetMarket[language] || templateContents['auto-repair'].targetMarket.en,
        revenueModel: templateContents['auto-repair'].revenueModel[language] || templateContents['auto-repair'].revenueModel.en,
        valueProposition: templateContents['auto-repair'].valueProposition[language] || templateContents['auto-repair'].valueProposition.en,
        keyPartners: templateContents['auto-repair'].keyPartners[language] || templateContents['auto-repair'].keyPartners.en,
        marketingApproach: templateContents['auto-repair'].marketingApproach[language] || templateContents['auto-repair'].marketingApproach.en,
        operationalNeeds: templateContents['auto-repair'].operationalNeeds[language] || templateContents['auto-repair'].operationalNeeds.en,
        growthGoals: templateContents['auto-repair'].growthGoals[language] || templateContents['auto-repair'].growthGoals.en,
      }
    },
    {
      id: 'cybercafe',
      name: 'Cybercafe',
      description: language === 'sw' ? 'Biashara ya huduma za mtandao na kompyuta' :
                  language === 'ar' ? 'مقهى إنترنت وخدمات الكمبيوتر' :
                  language === 'fr' ? 'Cybercafé et services informatiques' :
                  'Internet cafe and computer services business',
      content: {
        vision: templateContents.cybercafe.vision[language] || templateContents.cybercafe.vision.en,
        mission: templateContents.cybercafe.mission[language] || templateContents.cybercafe.mission.en,
        targetMarket: templateContents.cybercafe.targetMarket[language] || templateContents.cybercafe.targetMarket.en,
        revenueModel: templateContents.cybercafe.revenueModel[language] || templateContents.cybercafe.revenueModel.en,
        valueProposition: templateContents.cybercafe.valueProposition[language] || templateContents.cybercafe.valueProposition.en,
        keyPartners: templateContents.cybercafe.keyPartners[language] || templateContents.cybercafe.keyPartners.en,
        marketingApproach: templateContents.cybercafe.marketingApproach[language] || templateContents.cybercafe.marketingApproach.en,
        operationalNeeds: templateContents.cybercafe.operationalNeeds[language] || templateContents.cybercafe.operationalNeeds.en,
        growthGoals: templateContents.cybercafe.growthGoals[language] || templateContents.cybercafe.growthGoals.en,
      }
    },
    {
      id: 'agribusiness',
      name: 'Agribusiness',
      description: language === 'sw' ? 'Biashara ya kilimo na mazao' :
                  language === 'ar' ? 'الأعمال الزراعية والمنتجات' :
                  language === 'fr' ? 'Agrobusiness et production agricole' :
                  'Agricultural business and farming',
      content: {
        vision: templateContents.agribusiness.vision[language] || templateContents.agribusiness.vision.en,
        mission: templateContents.agribusiness.mission[language] || templateContents.agribusiness.mission.en,
        targetMarket: templateContents.agribusiness.targetMarket[language] || templateContents.agribusiness.targetMarket.en,
        revenueModel: templateContents.agribusiness.revenueModel[language] || templateContents.agribusiness.revenueModel.en,
        valueProposition: templateContents.agribusiness.valueProposition[language] || templateContents.agribusiness.valueProposition.en,
        keyPartners: templateContents.agribusiness.keyPartners[language] || templateContents.agribusiness.keyPartners.en,
        marketingApproach: templateContents.agribusiness.marketingApproach[language] || templateContents.agribusiness.marketingApproach.en,
        operationalNeeds: templateContents.agribusiness.operationalNeeds[language] || templateContents.agribusiness.operationalNeeds.en,
        growthGoals: templateContents.agribusiness.growthGoals[language] || templateContents.agribusiness.growthGoals.en,
      }
    }
  ];

  const sortedTemplates = templates.sort((a, b) => a.name.localeCompare(b.name));
  console.log('Template data generated:', sortedTemplates.length, 'templates');
  return sortedTemplates;
};
