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
      fr: 'Ajouter des services spécialisés (réparation AC, carrosserie), embaucher des mécaniciens supplémentaires, agrandir l\'espace d\'atelier, offrir des services de réparation mobiles'
    }
  },
  'cybercafe': {
    vision: {
      en: 'To bridge the digital divide by providing accessible technology services to our community',
      sw: 'Kuunganisha pengo la kidijitali kwa kutoa huduma za teknolojia zinazoweza kupatikana kwa jamii yetu',
      ar: 'ردم الفجوة الرقمية من خلال توفير خدمات تكنولوجية يمكن الوصول إليها لمجتمعنا',
      fr: 'Combler la fracture numérique en fournissant des services technologiques accessibles à notre communauté'
    },
    mission: {
      en: 'Enabling digital literacy and connectivity through affordable computer and internet services',
      sw: 'Kuwezesha ujuzi wa kidijitali na muunganisho kupitia huduma za kompyuta na mtandao za bei nafuu',
      ar: 'تمكين محو الأمية الرقمية والاتصال من خلال خدمات الكمبيوتر والإنترنت بأسعار معقولة',
      fr: 'Permettre l\'alphabétisation numérique et la connectivité grâce à des services informatiques et internet abordables'
    },
    targetMarket: {
      en: 'Students, small business owners, job seekers, elderly citizens, and tourists needing internet access',
      sw: 'Wanafunzi, wamiliki wa biashara ndogo, wanaotafuta kazi, wazee, na watalii wanaohitaji kufikia mtandao',
      ar: 'الطلاب، أصحاب الأعمال الصغيرة، الباحثون عن عمل، كبار السن، والسياح الذين يحتاجون للوصول للإنترنت',
      fr: 'Étudiants, propriétaires de petites entreprises, demandeurs d\'emploi, personnes âgées et touristes ayant besoin d\'accès internet'
    },
    revenueModel: {
      en: 'Computer rental by hour, printing and scanning services, typing services, internet packages, computer training',
      sw: 'Ukodishaji wa kompyuta kwa saa, huduma za kuchapisha na kusoma, huduma za kuandika, vifurushi vya mtandao, mafunzo ya kompyuta',
      ar: 'تأجير الحاسوب بالساعة، خدمات الطباعة والمسح الضوئي، خدمات الكتابة، حزم الإنترنت، تدريب الحاسوب',
      fr: 'Location d\'ordinateurs à l\'heure, services d\'impression et de numérisation, services de frappe, forfaits internet, formation informatique'
    },
    valueProposition: {
      en: 'Fast internet, modern equipment, affordable rates, technical support, convenient location, flexible hours',
      sw: 'Mtandao wa haraka, vifaa vya kisasa, viwango vya bei nafuu, msaada wa kiufundi, mahali pazuri, masaa ya kubadilika',
      ar: 'إنترنت سريع، معدات حديثة، أسعار معقولة، دعم فني، موقع مناسب، ساعات مرنة',
      fr: 'Internet rapide, équipement moderne, tarifs abordables, support technique, emplacement pratique, horaires flexibles'
    },
    keyPartners: {
      en: 'Internet service providers, computer suppliers, software vendors, printing supplies, training institutions',
      sw: 'Watoa huduma za mtandao, wasambazaji wa kompyuta, wauzaji wa programu, vifaa vya kuchapisha, taasisi za mafunzo',
      ar: 'مقدمو خدمات الإنترنت، موردو الحاسوب، بائعو البرمجيات، مستلزمات الطباعة، مؤسسات التدريب',
      fr: 'Fournisseurs de services internet, fournisseurs d\'ordinateurs, vendeurs de logiciels, fournitures d\'impression, institutions de formation'
    },
    marketingApproach: {
      en: 'Local advertising, student discounts, business partnerships, community outreach, social media presence',
      sw: 'Matangazo ya mitaani, punguzo za wanafunzi, ushirikiano wa biashara, kufikia jamii, uwepo wa mitandao ya kijamii',
      ar: 'الإعلان المحلي، خصومات الطلاب، شراكات الأعمال، التواصل المجتمعي، الحضور على وسائل التواصل الاجتماعي',
      fr: 'Publicité locale, remises étudiantes, partenariats commerciaux, sensibilisation communautaire, présence sur les réseaux sociaux'
    },
    operationalNeeds: {
      en: 'Computers, printers, internet connection, UPS systems, furniture, air conditioning, security system',
      sw: 'Kompyuta, mashine za kuchapisha, muunganisho wa mtandao, mifumo ya UPS, samani, hewa baridi, mfumo wa usalama',
      ar: 'أجهزة كمبيوتر، طابعات، اتصال إنترنت، أنظمة UPS، أثاث، تكييف هواء، نظام أمني',
      fr: 'Ordinateurs, imprimantes, connexion internet, systèmes UPS, mobilier, climatisation, système de sécurité'
    },
    growthGoals: {
      en: 'Add training programs, expand to mobile services, offer web design, add gaming section, franchise model',
      sw: 'Kuongeza mipango ya mafunzo, kupanua kwa huduma za simu, kutoa muundo wa wavuti, kuongeza sehemu ya mchezo, mfano wa franchise',
      ar: 'إضافة برامج تدريبية، التوسع للخدمات المحمولة، تقديم تصميم المواقع، إضافة قسم الألعاب، نموذج الامتياز',
      fr: 'Ajouter des programmes de formation, s\'étendre aux services mobiles, offrir la conception web, ajouter une section jeux, modèle de franchise'
    }
  },
  'agribusiness': {
    vision: {
      en: 'To be a leading sustainable agriculture enterprise that feeds communities while preserving the environment',
      sw: 'Kuwa shirika la kilimo endelevu linalongoza linalolisha jamii huku likihifadhi mazingira',
      ar: 'أن نكون مؤسسة زراعية مستدامة رائدة تطعم المجتمعات مع الحفاظ على البيئة',
      fr: 'Être une entreprise agricole durable de premier plan qui nourrit les communautés tout en préservant l\'environnement'
    },
    mission: {
      en: 'Producing high-quality crops using sustainable farming practices that benefit farmers, consumers, and the environment',
      sw: 'Kuzalisha mazao ya ubora wa juu kwa kutumia mbinu za kilimo endelevu zinazofaidika wakulima, watumiaji, na mazingira',
      ar: 'إنتاج محاصيل عالية الجودة باستخدام ممارسات زراعية مستدامة تفيد المزارعين والمستهلكين والبيئة',
      fr: 'Produire des cultures de haute qualité en utilisant des pratiques agricoles durables qui profitent aux agriculteurs, aux consommateurs et à l\'environnement'
    },
    targetMarket: {
      en: 'Local markets, supermarket chains, food processors, restaurants, export markets, and direct consumers',
      sw: 'Masoko ya mitaani, minyororo ya maduka makuu, wachakataji wa chakula, migahawa, masoko ya nje, na watumiaji wa moja kwa moja',
      ar: 'الأسواق المحلية، سلاسل السوبر ماركت، معالجات الأغذية، المطاعم، أسواق التصدير، والمستهلكون المباشرون',
      fr: 'Marchés locaux, chaînes de supermarchés, transformateurs alimentaires, restaurants, marchés d\'exportation et consommateurs directs'
    },
    revenueModel: {
      en: 'Crop sales, value-added products, agro-processing, farm consulting, equipment rental, training services',
      sw: 'Mauzo ya mazao, bidhaa za thamani iliyoongezwa, usindikaji wa kilimo, ushauri wa shamba, ukodishaji wa vifaa, huduma za mafunzo',
      ar: 'مبيعات المحاصيل، المنتجات ذات القيمة المضافة، المعالجة الزراعية، الاستشارات الزراعية، تأجير المعدات، خدمات التدريب',
      fr: 'Ventes de cultures, produits à valeur ajoutée, agro-transformation, conseil agricole, location d\'équipement, services de formation'
    },
    valueProposition: {
      en: 'Organic produce, sustainable practices, reliable supply, competitive pricing, traceability, technical expertise',
      sw: 'Mazao ya asili, mbinu endelevu, ugavi wa kutegemewa, bei za ushindani, ufuatiliaji, ujuzi wa kiufundi',
      ar: 'المنتجات العضوية، الممارسات المستدامة، الإمداد الموثوق، التسعير التنافسي، القابلية للتتبع، الخبرة التقنية',
      fr: 'Produits biologiques, pratiques durables, approvisionnement fiable, prix compétitifs, traçabilité, expertise technique'
    },
    keyPartners: {
      en: 'Seed suppliers, fertilizer companies, equipment dealers, buyers, cooperatives, research institutions',
      sw: 'Wauzaji wa mbegu, makampuni ya mbolea, wachuuzi wa vifaa, wanunuzi, ushirikiano, taasisi za utafiti',
      ar: 'موردو البذور، شركات الأسمدة، تجار المعدات، المشترون، التعاونيات، مؤسسات البحث',
      fr: 'Fournisseurs de semences, compagnies d\'engrais, concessionnaires d\'équipement, acheteurs, coopératives, institutions de recherche'
    },
    marketingApproach: {
      en: 'Direct sales, farmer cooperatives, digital marketing, trade shows, contract farming, sustainability certifications',
      sw: 'Mauzo ya moja kwa moja, ushirikiano wa wakulima, uuzaji wa kidijitali, maonyesho ya biashara, kilimo cha mkataba, vyeti vya uendelevu',
      ar: 'المبيعات المباشرة، تعاونيات المزارعين، التسويق الرقمي، المعارض التجارية، الزراعة التعاقدية، شهادات الاستدامة',
      fr: 'Ventes directes, coopératives d\'agriculteurs, marketing numérique, salons professionnels, agriculture contractuelle, certifications de durabilité'
    },
    operationalNeeds: {
      en: 'Farm land, seeds, fertilizers, irrigation systems, storage facilities, transportation, processing equipment',
      sw: 'Ardhi ya shamba, mbegu, mbolea, mifumo ya umwagiliaji, vituo vya uhifadhi, usafiri, vifaa vya usindikaji',
      ar: 'أراضي زراعية، بذور، أسمدة، أنظمة ري، مرافق تخزين، نقل، معدات معالجة',
      fr: 'Terres agricoles, semences, engrais, systèmes d\'irrigation, installations de stockage, transport, équipement de transformation'
    },
    growthGoals: {
      en: 'Expand acreage, add greenhouse farming, diversify crops, establish processing facility, enter export markets',
      sw: 'Kupanua eneo, kuongeza kilimo cha bustani, kutofautisha mazao, kuanzisha kituo cha usindikaji, kuingia masoko ya nje',
      ar: 'توسيع المساحة، إضافة الزراعة المحمية، تنويع المحاصيل، إنشاء مرفق معالجة، دخول أسواق التصدير',
      fr: 'Étendre la superficie, ajouter la culture en serre, diversifier les cultures, établir une installation de traitement, entrer sur les marchés d\'exportation'
    }
  },
  'restaurant': {
    vision: {
      en: 'To become the most beloved dining destination in our community',
      sw: 'Kuwa mahali pa chakula penye kupendwa zaidi katika jamii yetu',
      ar: 'أن نصبح وجهة الطعام الأكثر حبًا في مجتمعنا',
      fr: 'Devenir la destination culinaire la plus appréciée de notre communauté'
    },
    mission: {
      en: 'Serving delicious, fresh meals with exceptional hospitality',
      sw: 'Kutoa chakula kitamu na kipya kwa ukarimu wa kipekee',
      ar: 'تقديم وجبات لذيذة وطازجة بضيافة استثنائية',
      fr: 'Servir des repas délicieux et frais avec une hospitalité exceptionnelle'
    },
    targetMarket: {
      en: 'Local residents, office workers, families, tourists',
      sw: 'Wakazi wa mitaani, wafanyakazi wa ofisi, familia, watalii',
      ar: 'السكان المحليون، موظفو المكاتب، العائلات، السياح',
      fr: 'Résidents locaux, employés de bureau, familles, touristes'
    },
    revenueModel: {
      en: 'Food sales, beverages, catering services, delivery',
      sw: 'Mauzo ya chakula, vinywaji, huduma za chakula, utoaji',
      ar: 'مبيعات الطعام، المشروبات، خدمات التموين، التوصيل',
      fr: 'Ventes de nourriture, boissons, services de restauration, livraison'
    },
    valueProposition: {
      en: 'Fresh ingredients, authentic flavors, excellent service',
      sw: 'Viungo vipya, ladha halisi, huduma bora',
      ar: 'مكونات طازجة، نكهات أصيلة، خدمة ممتازة',
      fr: 'Ingrédients frais, saveurs authentiques, excellent service'
    },
    keyPartners: {
      en: 'Food suppliers, delivery services, local farmers',
      sw: 'Wauzaji wa chakula, huduma za utoaji, wakulima wa mitaani',
      ar: 'موردو الطعام، خدمات التوصيل، المزارعون المحليون',
      fr: 'Fournisseurs alimentaires, services de livraison, agriculteurs locaux'
    },
    marketingApproach: {
      en: 'Social media, local advertising, customer referrals',
      sw: 'Mitandao ya kijamii, matangazo ya mitaani, mapendekezo ya wateja',
      ar: 'وسائل التواصل الاجتماعي، الإعلان المحلي، إحالات العملاء',
      fr: 'Médias sociaux, publicité locale, références clients'
    },
    operationalNeeds: {
      en: 'Kitchen equipment, dining furniture, POS system',
      sw: 'Vifaa vya jikoni, samani za chakula, mfumo wa POS',
      ar: 'معدات المطبخ، أثاث الطعام، نظام نقطة البيع',
      fr: 'Équipement de cuisine, mobilier de salle à manger, système POS'
    },
    growthGoals: {
      en: 'Expand menu, add catering, open second location',
      sw: 'Kupanua menyu, kuongeza chakula, kufungua mahali pa pili',
      ar: 'توسيع القائمة، إضافة التموين، افتتاح موقع ثاني',
      fr: 'Élargir le menu, ajouter la restauration, ouvrir un deuxième emplacement'
    }
  },
  'salon': {
    vision: {
      en: 'To be the premier beauty destination for modern African women',
      sw: 'Kuwa mahali pa urembo pa kwanza kwa wanawake wa Kiafrika wa kisasa',
      ar: 'أن نكون الوجهة الأولى للجمال للنساء الأفريقيات العصريات',
      fr: 'Être la destination beauté de premier plan pour les femmes africaines modernes'
    },
    mission: {
      en: 'Enhancing natural beauty through professional services',
      sw: 'Kuboresha uzuri wa asili kupitia huduma za kitaalamu',
      ar: 'تعزيز الجمال الطبيعي من خلال خدمات احترافية',
      fr: 'Sublimer la beauté naturelle grâce à des services professionnels'
    },
    targetMarket: {
      en: 'Women aged 18-50, professionals, brides, students',
      sw: 'Wanawake wenye umri wa miaka 18-50, wataalamu, wake wa harusi, wanafunzi',
      ar: 'النساء من 18 إلى 50 سنة، المحترفات، العرائس، الطالبات',
      fr: 'Femmes de 18 à 50 ans, professionnelles, mariées, étudiantes'
    },
    revenueModel: {
      en: 'Hair services, makeup, manicures, beauty products',
      sw: 'Huduma za nywele, mapambo, manicures, bidhaa za urembo',
      ar: 'خدمات الشعر، المكياج، العناية بالأظافر، منتجات التجميل',
      fr: 'Services capillaires, maquillage, manucures, produits de beauté'
    },
    valueProposition: {
      en: 'Professional stylists, quality products, affordable prices',
      sw: 'Wasanii wa kitaalamu, bidhaa za ubora, bei nafuu',
      ar: 'مصممون محترفون، منتجات ذات جودة، أسعار معقولة',
      fr: 'Stylists professionnels, produits de qualité, prix abordables'
    },
    keyPartners: {
      en: 'Beauty product suppliers, equipment vendors',
      sw: 'Wauzaji wa bidhaa za urembo, wauzaji wa vifaa',
      ar: 'موردو منتجات التجميل، بائعو المعدات',
      fr: 'Fournisseurs de produits de beauté, vendeurs d\'équipements'
    },
    marketingApproach: {
      en: 'Social media showcases, referral programs, partnerships',
      sw: 'Maonyesho ya mitandao ya kijamii, mipango ya rufaa, ushirikiano',
      ar: 'عروض وسائل التواصل الاجتماعي، برامج الإحالة، شراكات',
      fr: 'Présentations sur les réseaux sociaux, programmes de parrainage, partenariats'
    },
    operationalNeeds: {
      en: 'Salon chairs, styling tools, beauty products, mirrors',
      sw: 'Viti vya salon, zana za mtindo, bidhaa za urembo, vioo',
      ar: 'كراسي الصالون، أدوات التصفيف، منتجات التجميل، مرايا',
      fr: 'Chaises de salon, outils de coiffure, produits de beauté, miroirs'
    },
    growthGoals: {
      en: 'Add spa services, hire more stylists, launch product line',
      sw: 'Ongeza huduma za spa, ajiri wasanii zaidi, anzisha mstari wa bidhaa',
      ar: 'إضافة خدمات السبا، توظيف مصممين إضافيين، إطلاق خط منتجات',
      fr: 'Ajouter des services de spa, embaucher plus de stylistes, lancer une ligne de produits'
    }
  },
  'grocery': {
    vision: {
      en: 'To be the neighborhood\'s trusted source for fresh groceries',
      sw: 'Kuwa chanzo kinachoaminika cha bidhaa safi za nyumbani',
      ar: 'أن نكون المصدر الموثوق للبقالة الطازجة في الحي',
      fr: 'Être la source de confiance du quartier pour les produits frais'
    },
    mission: {
      en: 'Providing fresh, quality groceries at affordable prices',
      sw: 'Kutoa bidhaa safi na za ubora kwa bei nafuu',
      ar: 'توفير بقالة طازجة وعالية الجودة بأسعار معقولة',
      fr: 'Fournir des produits frais et de qualité à des prix abordables'
    },
    targetMarket: {
      en: 'Local households, working families, small businesses',
      sw: 'Nyumba za mitaani, familia zinazofanya kazi, biashara ndogo',
      ar: 'الأسر المحلية، العائلات العاملة، الشركات الصغيرة',
      fr: 'Ménages locaux, familles actives, petites entreprises'
    },
    revenueModel: {
      en: 'Retail sales, bulk purchases, home delivery',
      sw: 'Mauzo ya rejareja, ununuzi wa jumla, utoaji nyumbani',
      ar: 'مبيعات التجزئة، الشراء بالجملة، التوصيل إلى المنزل',
      fr: 'Ventes au détail, achats en gros, livraison à domicile'
    },
    valueProposition: {
      en: 'Fresh products, competitive prices, convenient location',
      sw: 'Bidhaa safi, bei za ushindani, mahali panapofaa',
      ar: 'منتجات طازجة، أسعار تنافسية، موقع ملائم',
      fr: 'Produits frais, prix compétitifs, emplacement pratique'
    },
    keyPartners: {
      en: 'Wholesalers, local farmers, delivery services',
      sw: 'Wauzaji wa jumla, wakulima wa mitaani, huduma za utoaji',
      ar: 'تجار الجملة، المزارعون المحليون، خدمات التوصيل',
      fr: 'Grossistes, agriculteurs locaux, services de livraison'
    },
    marketingApproach: {
      en: 'Community engagement, loyalty programs, promotions',
      sw: 'Ushirikiano wa jamii, mipango ya uaminifu, matangazo',
      ar: 'مشاركة المجتمع، برامج الولاء، العروض الترويجية',
      fr: 'Engagement communautaire, programmes de fidélité, promotions'
    },
    operationalNeeds: {
      en: 'Shelving, refrigeration, POS system, inventory',
      sw: 'Rafu, friji, mfumo wa POS, hesabu',
      ar: 'أرفف، تبريد، نظام نقاط البيع، المخزون',
      fr: 'Étagères, réfrigération, système POS, inventaire'
    },
    growthGoals: {
      en: 'Expand product range, add delivery service, open branches',
      sw: 'Kupanua aina za bidhaa, kuongeza huduma ya utoaji, kufungua matawi',
      ar: 'توسيع نطاق المنتجات، إضافة خدمة التوصيل، فتح فروع',
      fr: 'Élargir la gamme de produits, ajouter un service de livraison, ouvrir des succursales'
    }
  },
  'tailoring': {
    vision: {
      en: 'To be the go-to tailor for quality custom clothing',
      sw: 'Kuwa mshonaji wa kwanza kwa nguo za ubora wa hali ya juu',
      ar: 'أن نكون الخياط المفضل للملابس المخصصة عالية الجودة',
      fr: 'Être le tailleur de référence pour des vêtements sur mesure de qualité'
    },
    mission: {
      en: 'Creating beautiful, well-fitted clothing for every occasion',
      sw: 'Kutengeneza nguo nzuri na zinazofaa kwa kila tukio',
      ar: 'صنع ملابس جميلة ومناسبة لكل مناسبة',
      fr: 'Créer des vêtements beaux et bien ajustés pour chaque occasion'
    },
    targetMarket: {
      en: 'Professionals, students, fashion-conscious individuals',
      sw: 'Wataalamu, wanafunzi, watu wanaojali mtindo',
      ar: 'المحترفون، الطلاب، الأفراد المهتمون بالموضة',
      fr: 'Professionnels, étudiants, personnes soucieuses de la mode'
    },
    revenueModel: {
      en: 'Custom tailoring, alterations, uniform contracts',
      sw: 'Ushonaji maalum, marekebisho, mikataba ya sare',
      ar: 'الخياطة المخصصة، التعديلات، عقود الزي الرسمي',
      fr: 'Confection sur mesure, retouches, contrats d\'uniformes'
    },
    valueProposition: {
      en: 'Perfect fit, quality craftsmanship, timely delivery',
      sw: 'Ulinganifu kamili, ufundi wa ubora, utoaji kwa wakati',
      ar: 'مقاس مثالي، حرفة عالية الجودة، تسليم في الوقت المحدد',
      fr: 'Ajustement parfait, savoir-faire de qualité, livraison ponctuelle'
    },
    keyPartners: {
      en: 'Fabric suppliers, sewing machine vendors, dry cleaners',
      sw: 'Wauzaji wa vitambaa, wauzaji wa mashine za kushona, wavuvi wa nguo',
      ar: 'موردو الأقمشة، بائعو ماكينات الخياطة، منظفو الملابس',
      fr: 'Fournisseurs de tissus, vendeurs de machines à coudre, pressings'
    },
    marketingApproach: {
      en: 'Word of mouth, social media, fashion shows',
      sw: 'Maneno ya mdomo, mitandao ya kijamii, maonyesho ya mitindo',
      ar: 'الكلام الشفهي، وسائل التواصل الاجتماعي، عروض الأزياء',
      fr: 'Bouche à oreille, réseaux sociaux, défilés de mode'
    },
    operationalNeeds: {
      en: 'Sewing machines, measuring tools, fabric inventory',
      sw: 'Mashine za kushona, zana za kupima, hesabu ya vitambaa',
      ar: 'ماكينات الخياطة، أدوات القياس، مخزون الأقمشة',
      fr: 'Machines à coudre, outils de mesure, inventaire de tissus'
    },
    growthGoals: {
      en: 'Hire assistants, expand to ready-made clothes, online orders',
      sw: 'Ajiri wasaidizi, panua kwa nguo tayari, maagizo mtandaoni',
      ar: 'توظيف مساعدين، التوسع إلى الملابس الجاهزة، الطلبات عبر الإنترنت',
      fr: 'Embaucher des assistants, étendre aux vêtements prêts-à-porter, commandes en ligne'
    }
  },
  'boutique': {
    vision: {
      en: 'To be the premier fashion destination for style-conscious shoppers',
      sw: 'Kuwa mahali pa kwanza kwa wanunuzi wanaojali mtindo',
      ar: 'أن نكون الوجهة الأولى للأزياء للمتسوقين المهتمين بالأناقة',
      fr: 'Être la destination mode de premier choix pour les acheteurs soucieux du style'
    },
    mission: {
      en: 'Curating the latest fashion trends at accessible prices',
      sw: 'Kuchagua mitindo ya hivi punde kwa bei zinazopatikana',
      ar: 'تنسيق أحدث صيحات الموضة بأسعار معقولة',
      fr: 'Sélectionner les dernières tendances de la mode à des prix accessibles'
    },
    targetMarket: {
      en: 'Fashion-forward women, young professionals, teenagers',
      sw: 'Wanawake wanaofuata mtindo, wataalamu vijana, vijana',
      ar: 'النساء المهتمات بالموضة، المحترفون الشباب، المراهقون',
      fr: 'Femmes à la mode, jeunes professionnels, adolescents'
    },
    revenueModel: {
      en: 'Clothing sales, accessories, personal styling services',
      sw: 'Mauzo ya mavazi, vifaa vya mtindo, huduma za mtindo binafsi',
      ar: 'مبيعات الملابس، الإكسسوارات، خدمات تنسيق شخصية',
      fr: 'Ventes de vêtements, accessoires, services de stylisme personnel'
    },
    valueProposition: {
      en: 'Trendy styles, affordable luxury, personalized service',
      sw: 'Mitindo ya mtindo, anasa la bei nafuu, huduma binafsi',
      ar: 'أنماط عصرية، رفاهية بأسعار معقولة، خدمة مخصصة',
      fr: 'Styles tendance, luxe abordable, service personnalisé'
    },
    keyPartners: {
      en: 'Fashion wholesalers, accessories suppliers, style influencers',
      sw: 'Wauzaji wa rejareja wa mtindo, wasambazaji wa vifaa, watu wenye ushawishi wa mtindo',
      ar: 'تجار الجملة للأزياء، موردي الإكسسوارات، المؤثرين في الموضة',
      fr: 'Grossistes en mode, fournisseurs d\'accessoires, influenceurs de style'
    },
    marketingApproach: {
      en: 'Social media, fashion events, influencer partnerships',
      sw: 'Mitandao ya kijamii, matukio ya mtindo, ushirikiano na watu wenye ushawishi',
      ar: 'وسائل التواصل الاجتماعي، فعاليات الموضة، شراكات مع المؤثرين',
      fr: 'Réseaux sociaux, événements de mode, partenariats avec influenceurs'
    },
    operationalNeeds: {
      en: 'Display fixtures, inventory, fitting rooms, POS',
      sw: 'Vifaa vya kuonyesha, hesabu, vyumba vya kupima, mfumo wa POS',
      ar: 'تركيبات عرض، مخزون، غرف قياس، نظام نقاط البيع',
      fr: 'Présentoirs, inventaire, cabines d\'essayage, système POS'
    },
    growthGoals: {
      en: 'Launch online store, add menswear, expand accessories',
      sw: 'Anzisha duka la mtandaoni, ongeza mavazi ya wanaume, panua vifaa',
      ar: 'إطلاق متجر إلكتروني، إضافة ملابس رجالية، توسيع الإكسسوارات',
      fr: 'Lancer une boutique en ligne, ajouter des vêtements pour hommes, élargir les accessoires'
    }
  },
  'pharmacy': {
    vision: {
      en: 'To be the community\'s trusted healthcare partner',
      sw: 'Kuwa mshirika wa afya anayeaminika katika jamii',
      ar: 'أن نكون شريك الرعاية الصحية الموثوق به في المجتمع',
      fr: 'Être le partenaire de santé de confiance de la communauté'
    },
    mission: {
      en: 'Providing quality medicines and health advice to our community',
      sw: 'Kutoa dawa za ubora na ushauri wa afya kwa jamii yetu',
      ar: 'توفير أدوية ذات جودة ونصائح صحية لمجتمعنا',
      fr: 'Fournir des médicaments de qualité et des conseils de santé à notre communauté'
    },
    targetMarket: {
      en: 'Local residents, healthcare facilities, chronic patients',
      sw: 'Wakazi wa mitaani, vituo vya afya, wagonjwa wa muda mrefu',
      ar: 'المقيمون المحليون، مرافق الرعاية الصحية، المرضى المزمنون',
      fr: 'Résidents locaux, établissements de santé, patients chroniques'
    },
    revenueModel: {
      en: 'Prescription drugs, OTC medicines, health consultations',
      sw: 'Dawa za agizo, dawa zisizo za agizo, ushauri wa afya',
      ar: 'الأدوية بوصفة طبية، الأدوية بدون وصفة، الاستشارات الصحية',
      fr: 'Médicaments sur ordonnance, médicaments en vente libre, consultations de santé'
    },
    valueProposition: {
      en: 'Licensed pharmacist, quality medicines, health advice',
      sw: 'Mtaalamu wa dawa aliyeidhinishwa, dawa za ubora, ushauri wa afya',
      ar: 'صيدلي مرخص، أدوية ذات جودة، نصائح صحية',
      fr: 'Pharmacien agréé, médicaments de qualité, conseils de santé'
    },
    keyPartners: {
      en: 'Drug distributors, healthcare providers, insurance companies',
      sw: 'Wasambazaji wa dawa, watoa huduma za afya, makampuni ya bima',
      ar: 'موزعو الأدوية، مقدمو الرعاية الصحية، شركات التأمين',
      fr: 'Distributeurs de médicaments, prestataires de soins, compagnies d\'assurance'
    },
    marketingApproach: {
      en: 'Community health programs, doctor referrals, health talks',
      sw: 'Mipango ya afya ya jamii, rufaa za madaktari, mazungumzo ya afya',
      ar: 'برامج الصحة المجتمعية، إحالات الأطباء، محاضرات صحية',
      fr: 'Programmes de santé communautaire, recommandations de médecins, conférences santé'
    },
    operationalNeeds: {
      en: 'Drug storage, dispensing equipment, consultation room',
      sw: 'Uhifadhi wa dawa, vifaa vya kugawa, chumba cha ushauri',
      ar: 'تخزين الأدوية، معدات الصرف، غرفة الاستشارة',
      fr: 'Stockage des médicaments, équipement de distribution, salle de consultation'
    },
    growthGoals: {
      en: 'Add health screening, expand to medical supplies, home delivery',
      sw: 'Ongeza uchunguzi wa afya, panua kwa vifaa vya matibabu, utoaji nyumbani',
      ar: 'إضافة فحوصات صحية، التوسع في المستلزمات الطبية، التوصيل للمنازل',
      fr: 'Ajouter le dépistage de santé, étendre aux fournitures médicales, livraison à domicile'
    }
  },
  'electronics': {
    vision: {
      en: 'To be the leading electronics retailer in our area',
      sw: 'Kuwa muuzaji mkuu wa vifaa vya umeme katika eneo letu',
      ar: 'أن نكون بائع الإلكترونيات الرائد في منطقتنا',
      fr: 'Être le principal détaillant d\'électronique dans notre région'
    },
    mission: {
      en: 'Providing quality electronics with excellent after-sales service',
      sw: 'Kutoa vifaa vya umeme vya ubora na huduma bora baada ya mauzo',
      ar: 'توفير إلكترونيات عالية الجودة مع خدمة ما بعد البيع الممتازة',
      fr: 'Fournir des produits électroniques de qualité avec un excellent service après-vente'
    },
    targetMarket: {
      en: 'Tech enthusiasts, students, professionals, businesses',
      sw: 'Wapenzi wa teknolojia, wanafunzi, wataalamu, biashara',
      ar: 'محبو التكنولوجيا، الطلاب، المحترفون، الشركات',
      fr: 'Passionnés de technologie, étudiants, professionnels, entreprises'
    },
    revenueModel: {
      en: 'Electronics sales, repairs, accessories, warranties',
      sw: 'Mauzo ya vifaa vya umeme, ukarabati, vifaa vya ziada, dhamana',
      ar: 'مبيعات الإلكترونيات، الإصلاحات، الإكسسوارات، الضمانات',
      fr: 'Ventes d\'électronique, réparations, accessoires, garanties'
    },
    valueProposition: {
      en: 'Quality products, competitive prices, repair services',
      sw: 'Bidhaa za ubora, bei za ushindani, huduma za ukarabati',
      ar: 'منتجات ذات جودة، أسعار تنافسية، خدمات إصلاح',
      fr: 'Produits de qualité, prix compétitifs, services de réparation'
    },
    keyPartners: {
      en: 'Electronics suppliers, repair technicians, warranty providers',
      sw: 'Wauzaji wa vifaa vya umeme, mafundi wa ukarabati, watoa dhamana',
      ar: 'موردو الإلكترونيات، فنيي الإصلاح، مزودو الضمان',
      fr: 'Fournisseurs d\'électronique, techniciens de réparation, fournisseurs de garantie'
    },
    marketingApproach: {
      en: 'Digital marketing, tech demonstrations, customer reviews',
      sw: 'Uuzaji wa kidijitali, maonyesho ya teknolojia, maoni ya wateja',
      ar: 'التسويق الرقمي، عروض التكنولوجيا، مراجعات العملاء',
      fr: 'Marketing digital, démonstrations technologiques, avis clients'
    },
    operationalNeeds: {
      en: 'Display cases, repair tools, inventory, security system',
      sw: 'Masanduku ya kuonyesha, zana za ukarabati, hesabu, mfumo wa usalama',
      ar: 'حالات العرض، أدوات الإصلاح، المخزون، نظام الأمان',
      fr: 'Vitrines, outils de réparation, inventaire, système de sécurité'
    },
    growthGoals: {
      en: 'Add mobile repair services, expand online, franchise model',
      sw: 'Ongeza huduma za ukarabati wa simu, panua mtandaoni, mfano wa leseni',
      ar: 'إضافة خدمات إصلاح الهواتف المحمولة، التوسع عبر الإنترنت، نموذج الامتياز',
      fr: 'Ajouter des services de réparation mobile, étendre en ligne, modèle de franchise'
    }
  },
  'stationery': {
    vision: {
      en: 'To be the one-stop shop for all educational and office needs',
      sw: 'Kuwa duka la kila kitu kwa mahitaji yote ya elimu na ofisi',
      ar: 'أن نكون المتجر الشامل لجميع الاحتياجات التعليمية والمكتبية',
      fr: 'Être la boutique unique pour tous les besoins éducatifs et de bureau'
    },
    mission: {
      en: 'Supporting education and business with quality supplies',
      sw: 'Kusaidia elimu na biashara kwa vifaa vya ubora',
      ar: 'دعم التعليم والأعمال بمستلزمات ذات جودة',
      fr: 'Soutenir l\'éducation et les affaires avec des fournitures de qualité'
    },
    targetMarket: {
      en: 'Students, teachers, offices, small businesses',
      sw: 'Wanafunzi, walimu, ofisi, biashara ndogo',
      ar: 'الطلاب، المعلمون، المكاتب، الشركات الصغيرة',
      fr: 'Étudiants, enseignants, bureaux, petites entreprises'
    },
    revenueModel: {
      en: 'Stationery sales, printing services, bulk orders',
      sw: 'Mauzo ya vifaa vya shule, huduma za uchapishaji, maagizo makubwa',
      ar: 'مبيعات القرطاسية، خدمات الطباعة، الطلبات بالجملة',
      fr: 'Ventes de papeterie, services d\'impression, commandes en gros'
    },
    valueProposition: {
      en: 'Complete range, competitive prices, printing services',
      sw: 'Aina kamili, bei za ushindani, huduma za uchapishaji',
      ar: 'مجموعة كاملة، أسعار تنافسية، خدمات الطباعة',
      fr: 'Gamme complète, prix compétitifs, services d\'impression'
    },
    keyPartners: {
      en: 'Stationery wholesalers, printing suppliers, schools',
      sw: 'Wauzaji wa rejareja wa vifaa, wasambazaji wa uchapishaji, shule',
      ar: 'تجار الجملة للقرطاسية، موردي الطباعة، المدارس',
      fr: 'Grossistes en papeterie, fournisseurs d\'impression, écoles'
    },
    marketingApproach: {
      en: 'School partnerships, back-to-school promotions, bulk discounts',
      sw: 'Ushirikiano wa shule, matangazo ya kurudi shuleni, punguzo la jumla',
      ar: 'شراكات مدرسية، عروض العودة إلى المدرسة، خصومات بالجملة',
      fr: 'Partenariats scolaires, promotions de rentrée, remises en gros'
    },
    operationalNeeds: {
      en: 'Shelving, printing equipment, cash register, inventory',
      sw: 'Rafu, vifaa vya uchapishaji, mashine ya fedha, hesabu',
      ar: 'أرفف، معدات الطباعة، ماكينة تسجيل النقد، المخزون',
      fr: 'Étagères, équipement d\'impression, caisse enregistreuse, inventaire'
    },
    growthGoals: {
      en: 'Add photocopy services, expand to uniforms, online catalog',
      sw: 'Ongeza huduma za kunakili, panua kwa sare, katalogi mtandaoni',
      ar: 'إضافة خدمات النسخ، التوسع إلى الزي الرسمي، كتالوج عبر الإنترنت',
      fr: 'Ajouter des services de photocopie, étendre aux uniformes, catalogue en ligne'
    }
  },
  'mobile-money': {
    vision: {
      en: 'To be the most reliable mobile money service provider',
      sw: 'Kuwa mtoa huduma wa pesa za simu anayeaminika zaidi',
      ar: 'أن نكون مزود خدمة الأموال المحمولة الأكثر موثوقية',
      fr: 'Être le fournisseur de services d\'argent mobile le plus fiable'
    },
    mission: {
      en: 'Facilitating convenient and secure financial transactions',
      sw: 'Kuwezesha miamala ya kifedha rahisi na salama',
      ar: 'تسهيل المعاملات المالية المريحة والآمنة',
      fr: 'Faciliter des transactions financières pratiques et sécurisées'
    },
    targetMarket: {
      en: 'Local residents, small businesses, unbanked population',
      sw: 'Wakazi wa mitaani, biashara ndogo, watu wasio na akaunti benki',
      ar: 'المقيمون المحليون، الشركات الصغيرة، السكان غير المتعاملين مع البنوك',
      fr: 'Résidents locaux, petites entreprises, population non bancarisée'
    },
    revenueModel: {
      en: 'Transaction commissions, airtime sales, bill payments',
      sw: 'Kamisheni za miamala, mauzo ya muda wa simu, malipo ya bili',
      ar: 'عمولات المعاملات، مبيعات رصيد الهاتف، دفع الفواتير',
      fr: 'Commissions sur transactions, ventes de crédit, paiements de factures'
    },
    valueProposition: {
      en: 'Fast service, secure transactions, convenient location',
      sw: 'Huduma ya haraka, miamala salama, mahali panapofaa',
      ar: 'خدمة سريعة، معاملات آمنة، موقع ملائم',
      fr: 'Service rapide, transactions sécurisées, emplacement pratique'
    },
    keyPartners: {
      en: 'Mobile network operators, banks, utility companies',
      sw: 'Watoa huduma za mtandao wa simu, benki, makampuni ya huduma',
      ar: 'مشغلو شبكات الهاتف المحمول، البنوك، شركات المرافق',
      fr: 'Opérateurs de réseau mobile, banques, compagnies de services publics'
    },
    marketingApproach: {
      en: 'Community trust building, referral programs, visibility',
      sw: 'Kujenga imani ya jamii, mipango ya rufaa, uonekano',
      ar: 'بناء ثقة المجتمع، برامج الإحالة، الظهور',
      fr: 'Renforcement de la confiance communautaire, programmes de parrainage, visibilité'
    },
    operationalNeeds: {
      en: 'Mobile phones, cash float, secure storage, signage',
      sw: 'Simu za mkononi, fedha za biashara, hifadhi salama, alama',
      ar: 'هواتف محمولة، رأس مال نقدي، تخزين آمن، لافتات',
      fr: 'Téléphones mobiles, fonds de caisse, stockage sécurisé, signalisation'
    },
    growthGoals: {
      en: 'Add more services, increase float, train more agents',
      sw: 'Ongeza huduma zaidi, ongeza fedha za biashara, funza mawakala zaidi',
      ar: 'إضافة المزيد من الخدمات، زيادة رأس المال، تدريب المزيد من الوكلاء',
      fr: 'Ajouter plus de services, augmenter le fonds de roulement, former plus d\'agents'
    }
  },
  'barbershop': {
    vision: {
      en: 'To be the neighborhood\'s premier men\'s grooming destination',
      sw: 'Kuwa mahali pa kwanza pa urembo wa wanaume katika mtaa',
      ar: 'أن نكون الوجهة الأولى للعناية بالرجل في الحي',
      fr: 'Être la destination de premier choix pour le toilettage masculin dans le quartier'
    },
    mission: {
      en: 'Providing professional grooming services in a welcoming environment',
      sw: 'Kutoa huduma za urembo za kitaalamu katika mazingira ya kukaribisha',
      ar: 'تقديم خدمات العناية الشخصية المهنية في بيئة مرحبة',
      fr: 'Fournir des services de toilettage professionnels dans un environnement accueillant'
    },
    targetMarket: {
      en: 'Men of all ages, professionals, students, local residents',
      sw: 'Wanaume wa rika zote, wataalamu, wanafunzi, wakazi wa mtaa',
      ar: 'الرجال من جميع الأعمار، المحترفون، الطلاب، السكان المحليون',
      fr: 'Hommes de tous âges, professionnels, étudiants, résidents locaux'
    },
    revenueModel: {
      en: 'Haircuts, shaves, grooming products, membership packages',
      sw: 'Kunyolewa nywele, kunyoa, bidhaa za urembo, vifurushi vya uanachama',
      ar: 'قص الشعر، الحلاقة، منتجات العناية، باقات العضوية',
      fr: 'Coupe de cheveux, rasage, produits de toilettage, forfaits d\'abonnement'
    },
    valueProposition: {
      en: 'Skilled barbers, modern techniques, comfortable atmosphere',
      sw: 'Wanyoa wenye ujuzi, mbinu za kisasa, mazingira ya starehe',
      ar: 'حلاقون مهرة، تقنيات حديثة، جو مريح',
      fr: 'Barbiers qualifiés, techniques modernes, ambiance confortable'
    },
    keyPartners: {
      en: 'Grooming product suppliers, equipment vendors, local businesses',
      sw: 'Wauzaji wa bidhaa za urembo, wauzaji wa vifaa, biashara za mtaa',
      ar: 'موردو منتجات العناية، بائعو المعدات، الشركات المحلية',
      fr: 'Fournisseurs de produits de toilettage, vendeurs d\'équipements, entreprises locales'
    },
    marketingApproach: {
      en: 'Word of mouth, social media, community presence',
      sw: 'Maneno ya mdomo, mitandao ya kijamii, uwepo wa jamii',
      ar: 'الكلام الشفهي، وسائل التواصل الاجتماعي، الحضور المجتمعي',
      fr: 'Bouche à oreille, réseaux sociaux, présence communautaire'
    },
    operationalNeeds: {
      en: 'Barber chairs, grooming tools, mirrors, sound system',
      sw: 'Viti vya kunyoa, zana za urembo, vioo, mfumo wa sauti',
      ar: 'كراسي الحلاقة، أدوات العناية، مرايا، نظام صوتي',
      fr: 'Chaises de barbier, outils de toilettage, miroirs, système sonore'
    },
    growthGoals: {
      en: 'Add spa services, hire more barbers, launch grooming products',
      sw: 'Ongeza huduma za spa, ajiri wanyoa zaidi, anzisha bidhaa za urembo',
      ar: 'إضافة خدمات السبا، توظيف حلاقين أكثر، إطلاق منتجات العناية',
      fr: 'Ajouter des services de spa, embaucher plus de barbiers, lancer des produits de toilettage'
    }
  },
  'fitness': {
    vision: {
      en: 'To be the community\'s leading health and fitness destination',
      sw: 'Kuwa mahali pa kwanza pa afya na mazoezi katika jamii',
      ar: 'أن نكون الوجهة الرائدة للصحة واللياقة في المجتمع',
      fr: 'Être la destination santé et fitness leader de la communauté'
    },
    mission: {
      en: 'Promoting healthy lifestyles through fitness and wellness programs',
      sw: 'Kukuza maisha yenye afya kupitia mazoezi na mipango ya ustawi',
      ar: 'تعزيز أنماط الحياة الصحية من خلال برامج اللياقة والعافية',
      fr: 'Promouvoir des modes de vie sains grâce à des programmes de fitness et bien-être'
    },
    targetMarket: {
      en: 'Health-conscious individuals, professionals, athletes, seniors',
      sw: 'Watu wanaojali afya, wataalamu, wanariadha, wazee',
      ar: 'الأفراد المهتمون بالصحة، المحترفون، الرياضيون، كبار السن',
      fr: 'Personnes soucieuses de leur santé, professionnels, athlètes, seniors'
    },
    revenueModel: {
      en: 'Membership fees, personal training, group classes, nutrition plans',
      sw: 'Ada za uanachama, mafunzo binafsi, madarasa ya kikundi, mipango ya lishe',
      ar: 'رسوم العضوية، التدريب الشخصي، دروس جماعية، خطط تغذية',
      fr: 'Frais d\'adhésion, entraînement personnel, cours collectifs, plans nutritionnels'
    },
    valueProposition: {
      en: 'Modern equipment, certified trainers, flexible schedules',
      sw: 'Vifaa vya kisasa, wakufunzi waliothibitishwa, ratiba zinazobadilika',
      ar: 'معدات حديثة، مدربون معتمدون، جداول مرنة',
      fr: 'Équipements modernes, entraîneurs certifiés, horaires flexibles'
    },
    keyPartners: {
      en: 'Equipment suppliers, nutrition brands, health professionals',
      sw: 'Wauzaji wa vifaa, chapa za lishe, wataalamu wa afya',
      ar: 'موردو المعدات، علامات تجارية للتغذية، محترفو الصحة',
      fr: 'Fournisseurs d\'équipement, marques de nutrition, professionnels de santé'
    },
    marketingApproach: {
      en: 'Health campaigns, social media, referral programs, events',
      sw: 'Kampeni za afya, mitandao ya kijamii, mipango ya rufaa, matukio',
      ar: 'حملات صحية، وسائل التواصل الاجتماعي، برامج الإحالة، فعاليات',
      fr: 'Campagnes de santé, réseaux sociaux, programmes de parrainage, événements'
    },
    operationalNeeds: {
      en: 'Exercise equipment, changing rooms, sound system, mats',
      sw: 'Vifaa vya mazoezi, vyumba vya kubadilisha nguo, mfumo wa sauti, mazulia',
      ar: 'معدات التمرين، غرف تبديل الملابس، نظام صوت، حصائر',
      fr: 'Équipements d\'exercice, vestiaires, système sonore, tapis'
    },
    growthGoals: {
      en: 'Add nutrition center, expand classes, outdoor programs',
      sw: 'Ongeza kituo cha lishe, panua madarasa, mipango ya nje',
      ar: 'إضافة مركز تغذية، توسيع الفصول، برامج خارجية',
      fr: 'Ajouter un centre de nutrition, étendre les cours, programmes en plein air'
    }
  },
  'transport': {
    vision: {
      en: 'To be the most reliable transport service in our region',
      sw: 'Kuwa huduma ya usafiri inayotegemewa zaidi katika eneo letu',
      ar: 'أن نكون خدمة النقل الأكثر موثوقية في منطقتنا',
      fr: 'Être le service de transport le plus fiable de notre région'
    },
    mission: {
      en: 'Providing safe, comfortable, and timely transport solutions',
      sw: 'Kutoa suluhisho za usafiri salama, za starehe, na kwa wakati',
      ar: 'توفير حلول نقل آمنة ومريحة وفي الوقت المناسب',
      fr: 'Fournir des solutions de transport sûres, confortables et ponctuelles'
    },
    targetMarket: {
      en: 'Commuters, tourists, businesses, cargo clients',
      sw: 'Wasafiri wa kila siku, watalii, biashara, wateja wa mizigo',
      ar: 'المسافرون اليوميون، السياح، الشركات، عملاء الشحن',
      fr: 'Navetteurs, touristes, entreprises, clients de fret'
    },
    revenueModel: {
      en: 'Passenger fares, cargo fees, charter services, delivery',
      sw: 'Ada za abiria, ada za mizigo, huduma za kukodisha, utoaji',
      ar: 'أجرة الركاب، رسوم الشحن، خدمات الاستئجار، التوصيل',
      fr: 'Tarifs passagers, frais de fret, services de location, livraison'
    },
    valueProposition: {
      en: 'Reliable schedules, competitive rates, safety first',
      sw: 'Ratiba za kuaminika, viwango vya ushindani, usalama kwanza',
      ar: 'جداول موثوقة، أسعار تنافسية، السلامة أولاً',
      fr: 'Horaires fiables, tarifs compétitifs, sécurité avant tout'
    },
    keyPartners: {
      en: 'Fuel suppliers, mechanics, insurance companies, terminals',
      sw: 'Wauzaji wa mafuta, mafundi, makampuni ya bima, vituo vya usafiri',
      ar: 'موردو الوقود، الميكانيكيون، شركات التأمين، المحطات',
      fr: 'Fournisseurs de carburant, mécaniciens, compagnies d\'assurance, terminaux'
    },
    marketingApproach: {
      en: 'Route advertising, customer loyalty, partnerships',
      sw: 'Matangazo ya njia, uaminifu wa wateja, ushirikiano',
      ar: 'إعلانات الطرق، ولاء العملاء، الشراكات',
      fr: 'Publicité sur les itinéraires, fidélisation client, partenariats'
    },
    operationalNeeds: {
      en: 'Vehicles, fuel, maintenance tools, permits, insurance',
      sw: 'Magari, mafuta, zana za matengenezo, vibali, bima',
      ar: 'مركبات، وقود، أدوات صيانة، تصاريح، تأمين',
      fr: 'Véhicules, carburant, outils d\'entretien, permis, assurance'
    },
    growthGoals: {
      en: 'Expand routes, add vehicles, GPS tracking, mobile app',
      sw: 'Kupanua njia, kuongeza magari, ufuatiliaji wa GPS, programu ya simu',
      ar: 'توسيع الطرق، إضافة مركبات، تتبع GPS، تطبيق جوال',
      fr: 'Étendre les itinéraires, ajouter des véhicules, suivi GPS, application mobile'
    }
  },
  'laundry': {
    vision: {
      en: 'To be the most trusted laundry service in our community',
      sw: 'Kuwa huduma ya kufulia inayotegemewa zaidi katika jamii yetu',
      ar: 'أن نكون خدمة الغسيل الأكثر موثوقية في مجتمعنا',
      fr: 'Être le service de blanchisserie le plus fiable de notre communauté'
    },
    mission: {
      en: 'Providing professional laundry services with care and convenience',
      sw: 'Kutoa huduma za kufulia za kitaalamu kwa uangalifu na urahisi',
      ar: 'تقديم خدمات غسيل احترافية مع العناية والراحة',
      fr: 'Fournir des services de blanchisserie professionnels avec soin et commodité'
    },
    targetMarket: {
      en: 'Busy professionals, families, students, hotels, restaurants',
      sw: 'Wataalamu wenye shughuli nyingi, familia, wanafunzi, hoteli, migahawa',
      ar: 'المحترفون المشغولون، العائلات، الطلاب، الفنادق، المطاعم',
      fr: 'Professionnels occupés, familles, étudiants, hôtels, restaurants'
    },
    revenueModel: {
      en: 'Washing services, dry cleaning, ironing, pickup/delivery',
      sw: 'Huduma za kufulia, kusafisha kavu, kupiga chupa, kuchukua/kutoa',
      ar: 'خدمات الغسيل، التنظيف الجاف، الكي، الاستلام/التوصيل',
      fr: 'Services de lavage, nettoyage à sec, repassage, collecte/livraison'
    },
    valueProposition: {
      en: 'Quality cleaning, quick turnaround, competitive prices',
      sw: 'Usafi wa ubora, mzunguko wa haraka, bei za ushindani',
      ar: 'تنظيف عالي الجودة، سرعة التنفيذ، أسعار تنافسية',
      fr: 'Nettoyage de qualité, délai rapide, prix compétitifs'
    },
    keyPartners: {
      en: 'Detergent suppliers, equipment vendors, delivery services',
      sw: 'Wauzaji wa sabuni, wauzaji wa vifaa, huduma za utoaji',
      ar: 'موردو المنظفات، بائعو المعدات، خدمات التوصيل',
      fr: 'Fournisseurs de détergents, vendeurs d\'équipements, services de livraison'
    },
    marketingApproach: {
      en: 'Local advertising, customer referrals, corporate contracts',
      sw: 'Matangazo ya mitaani, rufaa za wateja, mikataba ya kampuni',
      ar: 'الإعلان المحلي، إحالات العملاء، عقود الشركات',
      fr: 'Publicité locale, recommandations clients, contrats d\'entreprise'
    },
    operationalNeeds: {
      en: 'Washing machines, dryers, ironing equipment, chemicals',
      sw: 'Mashine za kufulia, mashine za kukausha, vifaa vya kupiga chupa, kemikali',
      ar: 'غسالات، مجففات، معدات الكي، مواد كيميائية',
      fr: 'Machines à laver, sèche-linge, équipements de repassage, produits chimiques'
    },
    growthGoals: {
      en: 'Add pickup service, expand capacity, franchise model',
      sw: 'Ongeza huduma ya kuchukua, panua uwezo, mfano wa leseni',
      ar: 'إضافة خدمة الاستلام، توسيع السعة، نموذج الامتياز',
      fr: 'Ajouter un service de collecte, augmenter la capacité, modèle de franchise'
    }
  },
  'daycare': {
    vision: {
      en: 'To provide the best early childhood development in our community',
      sw: 'Kutoa maendeleo bora ya utotoni katika jamii yetu',
      ar: 'توفير أفضل تنمية للطفولة المبكرة في مجتمعنا',
      fr: 'Offrir le meilleur développement de la petite enfance dans notre communauté'
    },
    mission: {
      en: 'Nurturing young minds through play, learning, and care',
      sw: 'Kukuza akili za watoto kupitia michezo, kujifunza, na utunzaji',
      ar: 'رعاية العقول الصغيرة من خلال اللعب والتعلم والرعاية',
      fr: 'Nourrir les jeunes esprits par le jeu, l\'apprentissage et les soins'
    },
    targetMarket: {
      en: 'Working parents, young families, single parents',
      sw: 'Wazazi wanaofanya kazi, familia changa, wazazi wa watoto pekee',
      ar: 'الآباء العاملون، العائلات الشابة، الآباء العزاب',
      fr: 'Parents actifs, jeunes familles, parents célibataires'
    },
    revenueModel: {
      en: 'Monthly fees, registration fees, meal programs, extended hours',
      sw: 'Ada za kila mwezi, ada za usajili, mipango ya chakula, masaa ya ziada',
      ar: 'رسوم شهرية، رسوم تسجيل، برامج وجبات، ساعات ممتدة',
      fr: 'Frais mensuels, frais d\'inscription, programmes de repas, heures prolongées'
    },
    valueProposition: {
      en: 'Qualified caregivers, educational programs, safe environment',
      sw: 'Wahudumu wenye sifa, mipango ya elimu, mazingira salama',
      ar: 'مقدمو رعاية مؤهلون، برامج تعليمية، بيئة آمنة',
      fr: 'Soignants qualifiés, programmes éducatifs, environnement sûr'
    },
    keyPartners: {
      en: 'Educational suppliers, nutrition providers, pediatricians',
      sw: 'Wauzaji wa vifaa vya elimu, watoa lishe, madaktari wa watoto',
      ar: 'موردو المواد التعليمية، مزودو التغذية، أطباء الأطفال',
      fr: 'Fournisseurs éducatifs, fournisseurs de nutrition, pédiatres'
    },
    marketingApproach: {
      en: 'Parent networks, community events, educational workshops',
      sw: 'Mitandao ya wazazi, matukio ya jamii, warsha za elimu',
      ar: 'شبكات الآباء، فعاليات المجتمع، ورش عمل تعليمية',
      fr: 'Réseaux de parents, événements communautaires, ateliers éducatifs'
    },
    operationalNeeds: {
      en: 'Play equipment, educational materials, safety gear, kitchen',
      sw: 'Vifaa vya kuchezea, vifaa vya elimu, vifaa vya usalama, jikoni',
      ar: 'معدات اللعب، مواد تعليمية، معدات السلامة، مطبخ',
      fr: 'Équipements de jeu, matériel éducatif, équipements de sécurité, cuisine'
    },
    growthGoals: {
      en: 'Add preschool programs, expand age groups, multiple locations',
      sw: 'Ongeza mipango ya shule ya awali, panua makundi ya umri, maeneo mengi',
      ar: 'إضافة برامج ما قبل المدرسة، توسيع الفئات العمرية، مواقع متعددة',
      fr: 'Ajouter des programmes préscolaires, élargir les groupes d\'âge, plusieurs sites'
    }
  },
  'boda-boda': {
    vision: {
      en: 'To provide safe, reliable, and affordable motorcycle transport services in our community',
      sw: 'Kutoa huduma salama, za kutegemewa, na bei nafuu za usafiri wa pikipiki katika jamii yetu',
      ar: 'توفير خدمات نقل آمنة وموثوقة وبأسعار معقولة بالدراجات النارية في مجتمعنا',
      fr: 'Fournir des services de transport sûrs, fiables et abordables en moto dans notre communauté'
    },
    mission: {
      en: 'Connecting people and delivering goods efficiently while creating income opportunities',
      sw: 'Kuunganisha watu na kusafirisha bidhaa kwa ufanisi huku tukiunda fursa za kipato',
      ar: 'ربط الناس وتوصيل البضائع بكفاءة مع خلق فرص دخل',
      fr: 'Connecter les personnes et livrer les marchandises efficacement tout en créant des opportunités de revenus'
    },
    targetMarket: {
      en: 'Daily commuters, students, small business owners, delivery clients, tourists',
      sw: 'Wasafiri wa kila siku, wanafunzi, wamiliki wa biashara ndogo, wateja wa utoaji, watalii',
      ar: 'الركاب اليوميون، الطلاب، أصحاب الأعمال الصغيرة، عملاء التوصيل، السياح',
      fr: 'Navetteurs quotidiens, étudiants, propriétaires de petites entreprises, clients de livraison, touristes'
    },
    revenueModel: {
      en: 'Per trip fares, package delivery fees, daily rental rates, commission from app platforms',
      sw: 'Nauli za safari, ada za utoaji wa vifurushi, viwango vya kukodisha vya kila siku, kamisheni kutoka majukwaa ya programu',
      ar: 'أجرة الرحلة الواحدة، رسوم توصيل الطرود، أسعار الإيجار اليومي، عمولة من منصات التطبيقات',
      fr: 'Tarifs par voyage, frais de livraison de colis, tarifs de location quotidiens, commission des plateformes d\'applications'
    },
    valueProposition: {
      en: 'Quick and reliable transport, affordable fares, door-to-door service, flexible payment options',
      sw: 'Usafiri wa haraka na wa kutegemewa, nauli za bei nafuu, huduma ya mlango hadi mlango, chaguzi za malipo zinazobadilika',
      ar: 'نقل سريع وموثوق، أجرة معقولة، خدمة من الباب إلى الباب، خيارات دفع مرنة',
      fr: 'Transport rapide et fiable, tarifs abordables, service porte-à-porte, options de paiement flexibles'
    },
    keyPartners: {
      en: 'Fuel stations, motorcycle dealers, mobile money providers, insurance companies, delivery apps',
      sw: 'Vituo vya mafuta, mauzo ya pikipiki, watoa huduma za pesa za simu, makampuni ya bima, programu za utoaji',
      ar: 'محطات الوقود، تجار الدراجات النارية، مزودي الأموال المحمولة، شركات التأمين، تطبيقات التوصيل',
      fr: 'Stations-service, concessionnaires de motos, fournisseurs d\'argent mobile, compagnies d\'assurance, applications de livraison'
    },
    marketingApproach: {
      en: 'Word-of-mouth referrals, social media presence, partnerships with local businesses, rider app platforms',
      sw: 'Mapendekezo ya mdomo kwa mdomo, uwepo wa mitandao ya kijamii, ushirikiano na biashara za mitaani, majukwaa ya programu za waendesha',
      ar: 'إحالات الكلام الشفهي، الحضور على وسائل التواصل الاجتماعي، الشراكات مع الشركات المحلية، منصات تطبيقات الراكبين',
      fr: 'Références de bouche-à-oreille, présence sur les réseaux sociaux, partenariats avec les entreprises locales, plateformes d\'applications de chauffeurs'
    },
    operationalNeeds: {
      en: 'Motorcycle, protective gear, mobile phone, GPS navigation, maintenance tools, insurance',
      sw: 'Pikipiki, vifaa vya ulinzi, simu ya mkononi, uwongozi wa GPS, zana za matengenezo, bima',
      ar: 'دراجة نارية، معدات واقية، هاتف محمول، ملاحة GPS، أدوات صيانة، تأمين',
      fr: 'Moto, équipement de protection, téléphone mobile, navigation GPS, outils de maintenance, assurance'
    },
    growthGoals: {
      en: 'Add delivery services, acquire additional motorcycles, join ride-hailing platforms, hire other riders',
      sw: 'Kuongeza huduma za utoaji, kupata pikipiki za ziada, kujiunga na majukwaa ya kupanga safari, kuajiri waendesha wengine',
      ar: 'إضافة خدمات التوصيل، الحصول على دراجات نارية إضافية، الانضمام إلى منصات استدعاء الركوب، توظيف راكبين آخرين',
      fr: 'Ajouter des services de livraison, acquérir des motos supplémentaires, rejoindre les plateformes de covoiturage, embaucher d\'autres chauffeurs'
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
      name: 'Mitumba',
      description: language === 'sw' ? 'Biashara ya nguo za mitumba' :
                  language === 'ar' ? 'تجارة الملابس المستعملة' :
                  language === 'fr' ? 'Commerce de vêtements d\'occasion' :
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
      name: 'Cyber Café',
      description: language === 'sw' ? 'Biashara ya huduma za mtandao na kompyuta' :
                  language === 'ar' ? 'مقهى إنترنت وخدمات الكمبيوتر' :
                  language === 'fr' ? 'Cybercafé et services informatiques' :
                  'Cyber café and computer services business',
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
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: language === 'sw' ? 'Biashara ya chakula na mgahawa' : 'Food service and restaurant business',
      content: {
        vision: templateContents.restaurant.vision[language] || templateContents.restaurant.vision.en,
        mission: templateContents.restaurant.mission[language] || templateContents.restaurant.mission.en,
        targetMarket: templateContents.restaurant.targetMarket[language] || templateContents.restaurant.targetMarket.en,
        revenueModel: templateContents.restaurant.revenueModel[language] || templateContents.restaurant.revenueModel.en,
        valueProposition: templateContents.restaurant.valueProposition[language] || templateContents.restaurant.valueProposition.en,
        keyPartners: templateContents.restaurant.keyPartners[language] || templateContents.restaurant.keyPartners.en,
        marketingApproach: templateContents.restaurant.marketingApproach[language] || templateContents.restaurant.marketingApproach.en,
        operationalNeeds: templateContents.restaurant.operationalNeeds[language] || templateContents.restaurant.operationalNeeds.en,
        growthGoals: templateContents.restaurant.growthGoals[language] || templateContents.restaurant.growthGoals.en,
      }
    },
    {
      id: 'salon',
      name: 'Beauty Salon',
      description: language === 'sw' ? 'Biashara ya urembo na upamba' : 'Beauty and grooming services',
      content: {
        vision: 'To be the premier beauty destination for modern African women',
        mission: 'Enhancing natural beauty through professional services',
        targetMarket: 'Women aged 18-50, professionals, brides, students',
        revenueModel: 'Hair services, makeup, manicures, beauty products',
        valueProposition: 'Professional stylists, quality products, affordable prices',
        keyPartners: 'Beauty product suppliers, equipment vendors',
        marketingApproach: 'Social media showcases, referral programs, partnerships',
        operationalNeeds: 'Salon chairs, styling tools, beauty products, mirrors',
        growthGoals: 'Add spa services, hire more stylists, launch product line'
      }
    },
    {
      id: 'grocery',
      name: 'Grocery Store',
      description: language === 'sw' ? 'Duka la vitu vya nyumbani' : 'Retail grocery and household goods',
      content: {
        vision: 'To be the neighborhood\'s trusted source for fresh groceries',
        mission: 'Providing fresh, quality groceries at affordable prices',
        targetMarket: 'Local households, working families, small businesses',
        revenueModel: 'Retail sales, bulk purchases, home delivery',
        valueProposition: 'Fresh products, competitive prices, convenient location',
        keyPartners: 'Wholesalers, local farmers, delivery services',
        marketingApproach: 'Community engagement, loyalty programs, promotions',
        operationalNeeds: 'Shelving, refrigeration, POS system, inventory',
        growthGoals: 'Expand product range, add delivery service, open branches'
      }
    },
    {
      id: 'tailoring',
      name: 'Tailoring Shop',
      description: language === 'sw' ? 'Biashara ya ushonaji na ukarabati nguo' : 'Custom clothing and alterations',
      content: {
        vision: 'To be the go-to tailor for quality custom clothing',
        mission: 'Creating beautiful, well-fitted clothing for every occasion',
        targetMarket: 'Professionals, students, fashion-conscious individuals',
        revenueModel: 'Custom tailoring, alterations, uniform contracts',
        valueProposition: 'Perfect fit, quality craftsmanship, timely delivery',
        keyPartners: 'Fabric suppliers, sewing machine vendors, dry cleaners',
        marketingApproach: 'Word of mouth, social media, fashion shows',
        operationalNeeds: 'Sewing machines, measuring tools, fabric inventory',
        growthGoals: 'Hire assistants, expand to ready-made clothes, online orders'
      }
    },
    {
      id: 'boutique',
      name: 'Fashion Boutique',
      description: language === 'sw' ? 'Duka la mavazi ya mtindo' : 'Fashion retail and accessories',
      content: {
        vision: 'To be the premier fashion destination for style-conscious shoppers',
        mission: 'Curating the latest fashion trends at accessible prices',
        targetMarket: 'Fashion-forward women, young professionals, teenagers',
        revenueModel: 'Clothing sales, accessories, personal styling services',
        valueProposition: 'Trendy styles, affordable luxury, personalized service',
        keyPartners: 'Fashion wholesalers, accessories suppliers, style influencers',
        marketingApproach: 'Social media, fashion events, influencer partnerships',
        operationalNeeds: 'Display fixtures, inventory, fitting rooms, POS',
        growthGoals: 'Launch online store, add menswear, expand accessories'
      }
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      description: language === 'sw' ? 'Duka la dawa na afya' : 'Pharmaceutical and health services',
      content: {
        vision: 'To be the community\'s trusted healthcare partner',
        mission: 'Providing quality medicines and health advice to our community',
        targetMarket: 'Local residents, healthcare facilities, chronic patients',
        revenueModel: 'Prescription drugs, OTC medicines, health consultations',
        valueProposition: 'Licensed pharmacist, quality medicines, health advice',
        keyPartners: 'Drug distributors, healthcare providers, insurance companies',
        marketingApproach: 'Community health programs, doctor referrals, health talks',
        operationalNeeds: 'Drug storage, dispensing equipment, consultation room',
        growthGoals: 'Add health screening, expand to medical supplies, home delivery'
      }
    },
    {
      id: 'electronics',
      name: 'Electronics Shop',
      description: language === 'sw' ? 'Duka la vifaa vya umeme' : 'Consumer electronics and repairs',
      content: {
        vision: 'To be the leading electronics retailer in our area',
        mission: 'Providing quality electronics with excellent after-sales service',
        targetMarket: 'Tech enthusiasts, students, professionals, businesses',
        revenueModel: 'Electronics sales, repairs, accessories, warranties',
        valueProposition: 'Quality products, competitive prices, repair services',
        keyPartners: 'Electronics suppliers, repair technicians, warranty providers',
        marketingApproach: 'Digital marketing, tech demonstrations, customer reviews',
        operationalNeeds: 'Display cases, repair tools, inventory, security system',
        growthGoals: 'Add mobile repair services, expand online, franchise model'
      }
    },
    {
      id: 'stationery',
      name: 'Stationery Shop',
      description: language === 'sw' ? 'Duka la vifaa vya shule na ofisi' : 'School and office supplies',
      content: {
        vision: 'To be the one-stop shop for all educational and office needs',
        mission: 'Supporting education and business with quality supplies',
        targetMarket: 'Students, teachers, offices, small businesses',
        revenueModel: 'Stationery sales, printing services, bulk orders',
        valueProposition: 'Complete range, competitive prices, printing services',
        keyPartners: 'Stationery wholesalers, printing suppliers, schools',
        marketingApproach: 'School partnerships, back-to-school promotions, bulk discounts',
        operationalNeeds: 'Shelving, printing equipment, cash register, inventory',
        growthGoals: 'Add photocopy services, expand to uniforms, online catalog'
      }
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money Shop',
      description: language === 'sw' ? 'Biashara ya huduma za pesa za simu' : 'Mobile financial services',
      content: {
        vision: 'To be the most reliable mobile money service provider',
        mission: 'Facilitating convenient and secure financial transactions',
        targetMarket: 'Local residents, small businesses, unbanked population',
        revenueModel: 'Transaction commissions, airtime sales, bill payments',
        valueProposition: 'Fast service, secure transactions, convenient location',
        keyPartners: 'Mobile network operators, banks, utility companies',
        marketingApproach: 'Community trust building, referral programs, visibility',
        operationalNeeds: 'Mobile phones, cash float, secure storage, signage',
        growthGoals: 'Add more services, increase float, train more agents'
      }
    },
    {
      id: 'barbershop',
      name: 'Barbershop',
      description: language === 'sw' ? 'Duka la kunyoa na kutengeneza nywele' : 'Men\'s grooming and hair services',
      content: {
        vision: 'To be the neighborhood\'s premier men\'s grooming destination',
        mission: 'Providing professional grooming services in a welcoming environment',
        targetMarket: 'Men of all ages, professionals, students, local residents',
        revenueModel: 'Haircuts, shaves, grooming products, membership packages',
        valueProposition: 'Skilled barbers, modern techniques, comfortable atmosphere',
        keyPartners: 'Grooming product suppliers, equipment vendors, local businesses',
        marketingApproach: 'Word of mouth, social media, community presence',
        operationalNeeds: 'Barber chairs, grooming tools, mirrors, sound system',
        growthGoals: 'Add spa services, hire more barbers, launch grooming products'
      }
    },
    {
      id: 'fitness',
      name: 'Fitness Center',
      description: language === 'sw' ? 'Kituo cha mazoezi na afya' : 'Health and fitness services',
      content: {
        vision: 'To be the community\'s leading health and fitness destination',
        mission: 'Promoting healthy lifestyles through fitness and wellness programs',
        targetMarket: 'Health-conscious individuals, professionals, athletes, seniors',
        revenueModel: 'Membership fees, personal training, group classes, nutrition plans',
        valueProposition: 'Modern equipment, certified trainers, flexible schedules',
        keyPartners: 'Equipment suppliers, nutrition brands, health professionals',
        marketingApproach: 'Health campaigns, social media, referral programs, events',
        operationalNeeds: 'Exercise equipment, changing rooms, sound system, mats',
        growthGoals: 'Add nutrition center, expand classes, outdoor programs'
      }
    },
    {
      id: 'transport',
      name: 'Transport Service',
      description: language === 'sw' ? 'Biashara ya usafiri na mizigo' : 'Passenger and cargo transport',
      content: {
        vision: 'To be the most reliable transport service in our region',
        mission: 'Providing safe, comfortable, and timely transport solutions',
        targetMarket: 'Commuters, tourists, businesses, cargo clients',
        revenueModel: 'Passenger fares, cargo fees, charter services, delivery',
        valueProposition: 'Reliable schedules, competitive rates, safety first',
        keyPartners: 'Fuel suppliers, mechanics, insurance companies, terminals',
        marketingApproach: 'Route advertising, customer loyalty, partnerships',
        operationalNeeds: 'Vehicles, fuel, maintenance tools, permits, insurance',
        growthGoals: 'Expand routes, add vehicles, GPS tracking, mobile app'
      }
    },
    {
      id: 'laundry',
      name: 'Laundry Service',
      description: language === 'sw' ? 'Huduma za kufulia na kusafisha nguo' : 'Laundry and dry cleaning services',
      content: {
        vision: 'To be the most trusted laundry service in our community',
        mission: 'Providing professional laundry services with care and convenience',
        targetMarket: 'Busy professionals, families, students, hotels, restaurants',
        revenueModel: 'Washing services, dry cleaning, ironing, pickup/delivery',
        valueProposition: 'Quality cleaning, quick turnaround, competitive prices',
        keyPartners: 'Detergent suppliers, equipment vendors, delivery services',
        marketingApproach: 'Local advertising, customer referrals, corporate contracts',
        operationalNeeds: 'Washing machines, dryers, ironing equipment, chemicals',
        growthGoals: 'Add pickup service, expand capacity, franchise model'
      }
    },
    {
      id: 'daycare',
      name: 'Daycare Center',
      description: language === 'sw' ? 'Kituo cha malezi ya watoto' : 'Childcare and early education',
      content: {
        vision: 'To provide the best early childhood development in our community',
        mission: 'Nurturing young minds through play, learning, and care',
        targetMarket: 'Working parents, young families, single parents',
        revenueModel: 'Monthly fees, registration fees, meal programs, extended hours',
        valueProposition: 'Qualified caregivers, educational programs, safe environment',
        keyPartners: 'Educational suppliers, nutrition providers, pediatricians',
        marketingApproach: 'Parent networks, community events, educational workshops',
        operationalNeeds: 'Play equipment, educational materials, safety gear, kitchen',
        growthGoals: 'Add preschool programs, expand age groups, multiple locations'
      }
    },
    {
      id: 'boda-boda',
      name: 'Boda Boda',
      description: language === 'sw' ? 'Huduma za usafiri wa pikipiki' :
                  language === 'ar' ? 'خدمات تاكسي الدراجات النارية والتوصيل' :
                  language === 'fr' ? 'Services de taxi moto et de livraison' :
                  'Motorcycle taxi and delivery services',
      content: {
        vision: templateContents['boda-boda'].vision[language] || templateContents['boda-boda'].vision.en,
        mission: templateContents['boda-boda'].mission[language] || templateContents['boda-boda'].mission.en,
        targetMarket: templateContents['boda-boda'].targetMarket[language] || templateContents['boda-boda'].targetMarket.en,
        revenueModel: templateContents['boda-boda'].revenueModel[language] || templateContents['boda-boda'].revenueModel.en,
        valueProposition: templateContents['boda-boda'].valueProposition[language] || templateContents['boda-boda'].valueProposition.en,
        keyPartners: templateContents['boda-boda'].keyPartners[language] || templateContents['boda-boda'].keyPartners.en,
        marketingApproach: templateContents['boda-boda'].marketingApproach[language] || templateContents['boda-boda'].marketingApproach.en,
        operationalNeeds: templateContents['boda-boda'].operationalNeeds[language] || templateContents['boda-boda'].operationalNeeds.en,
        growthGoals: templateContents['boda-boda'].growthGoals[language] || templateContents['boda-boda'].growthGoals.en,
      }
    }
  ];

  const sortedTemplates = templates.sort((a, b) => a.name.localeCompare(b.name));
  console.log('Template data generated:', sortedTemplates.length, 'templates');
  return sortedTemplates;
};
