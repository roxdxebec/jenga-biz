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
      en: 'To be the most trusted auto repair service providing reliable, efficient, and honest vehicle maintenance and repairs',
      sw: 'Kuwa huduma ya ukarabati wa magari inayoaminika zaidi ikitoa matengenezo na marekebisho ya magari ya kuaminika, ya ufanisi, na ya uaminifu',
      ar: 'أن نكون خدمة إصلاح السيارات الأكثر ثقة التي توفر صيانة وإصلاحات مركبات موثوقة وفعالة وصادقة',
      fr: 'Être le service de réparation automobile le plus fiable offrant un entretien et des réparations de véhicules fiables, efficaces et honnêtes'
    },
    mission: {
      en: 'Keeping vehicles safe and reliable through expert mechanical services, transparent pricing, and exceptional customer care',
      sw: 'Kuweka magari kuwa salama na ya kutegemewa kupitia huduma za umaarufu za mitambo, bei wazi, na huduma bora ya wateja',
      ar: 'الحفاظ على سلامة وموثوقية المركبات من خلال خدمات ميكانيكية خبيرة وأسعار شفافة ورعاية استثنائية للعملاء',
      fr: 'Maintenir les véhicules sûrs et fiables grâce à des services mécaniques experts, une tarification transparente et un service client exceptionnel'
    },
    targetMarket: {
      en: 'Vehicle owners, taxi drivers, boda boda operators, commercial fleet owners, individual car owners in urban and rural areas',
      sw: 'Wamiliki wa magari, madereva wa teksi, waendeshaji wa boda boda, wamiliki wa magari ya kibiashara, wamiliki wa magari binafsi katika maeneo ya mijini na vijijini',
      ar: 'أصحاب المركبات، سائقو التاكسي، مشغلو بودا بودا، أصحاب الأساطيل التجارية، أصحاب السيارات الفردية في المناطق الحضرية والريفية',
      fr: 'Propriétaires de véhicules, chauffeurs de taxi, opérateurs de boda boda, propriétaires de flottes commerciales, propriétaires individuels de voitures dans les zones urbaines et rurales'
    },
    revenueModel: {
      en: 'Hourly labor charges, parts markup, diagnostic fees, maintenance service packages, emergency roadside assistance',
      sw: 'Malipo ya kazi kwa saa, faida ya vipengee, ada za uchunguzi, vifurushi vya huduma za matengenezo, msaada wa dharura wa kando ya barabara',
      ar: 'رسوم العمالة بالساعة، هامش ربح قطع الغيار، رسوم التشخيص، حزم خدمات الصيانة، المساعدة الطارئة على الطريق',
      fr: 'Frais de main-d\'œuvre horaires, marge sur les pièces, frais de diagnostic, forfaits de services d\'entretien, assistance routière d\'urgence'
    },
    valueProposition: {
      en: 'Expert diagnostics, quality repairs using genuine parts, transparent pricing, fast turnaround, and warranty on all work',
      sw: 'Uchunguzi wa umaarufu, marekebisho ya ubora ukitumia vipengee halisi, bei wazi, haraka ya kurudi, na dhaman kwenye kazi zote',
      ar: 'تشخيصات خبيرة، إصلاحات عالية الجودة باستخدام قطع أصلية، أسعار شفافة، دوران سريع، وضمان على جميع الأعمال',
      fr: 'Diagnostics experts, réparations de qualité utilisant des pièces authentiques, tarification transparente, délai rapide et garantie sur tous les travaux'
    },
    keyPartners: {
      en: 'Auto parts suppliers, towing services, insurance companies, vehicle dealers, diagnostic equipment suppliers',
      sw: 'Wasambazaji wa vipengee vya magari, huduma za kukokota, makampuni ya bima, wachuuzi wa magari, wasambazaji wa vifaa vya uchunguzi',
      ar: 'موردو قطع غيار السيارات، خدمات السحب، شركات التأمين، وكلاء المركبات، موردو معدات التشخيص',
      fr: 'Fournisseurs de pièces automobiles, services de remorquage, compagnies d\'assurance, concessionnaires de véhicules, fournisseurs d\'équipements de diagnostic'
    },
    marketingApproach: {
      en: 'Customer referrals, local business partnerships, social media presence, vehicle inspection campaigns, loyalty programs',
      sw: 'Mapendekezo ya wateja, ushirikiano wa biashara za mitaani, uwepo wa mitandao ya kijamii, kampeni za ukaguzi wa magari, mipango ya uaminifu',
      ar: 'إحالات العملاء، شراكات الأعمال المحلية، الحضور على وسائل التواصل الاجتماعي، حملات فحص المركبات، برامج الولاء',
      fr: 'Références clients, partenariats commerciaux locaux, présence sur les réseaux sociaux, campagnes d\'inspection de véhicules, programmes de fidélité'
    },
    operationalNeeds: {
      en: 'Workshop space, diagnostic equipment, hand tools, spare parts inventory, vehicle lift, air compressor, safety equipment',
      sw: 'Nafasi ya warsha, vifaa vya uchunguzi, vifaa vya mkono, ghala la vipengee vya nyongeza, kifaa cha kuinua magari, msongeo wa hewa, vifaa vya usalama',
      ar: 'مساحة ورشة، معدات تشخيص، أدوات يدوية، مخزون قطع الغيار، رافعة مركبات، ضاغط هواء، معدات السلامة',
      fr: 'Espace d\'atelier, équipement de diagnostic, outils à main, inventaire de pièces de rechange, élévateur de véhicule, compresseur d\'air, équipement de sécurité'
    },
    growthGoals: {
      en: 'Add mobile repair services, hire 2 additional mechanics, offer 24/7 emergency service, expand to commercial fleet services',
      sw: 'Kuongeza huduma za ukarabati wa kufuatilia, kuajiri mafundi 2 zaidi, kutoa huduma za dharura za saa 24/7, kupanua hadi huduma za magari ya kibiashara',
      ar: 'إضافة خدمات الإصلاح المتنقلة، توظيف 2 من الميكانيكيين الإضافيين، تقديم خدمة طوارئ على مدار 24/7، التوسع إلى خدمات الأساطيل التجارية',
      fr: 'Ajouter des services de réparation mobile, embaucher 2 mécaniciens supplémentaires, offrir un service d\'urgence 24/7, étendre aux services de flotte commerciale'
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
      en: 'To be the leading digital access hub providing reliable internet services and digital solutions for our community',
      sw: 'Kuwa kituo cha kwanza cha ufikiaji wa kidijiti kinachotoa huduma za intaneti za kutegemewa na suluhisho za kidijiti kwa jamii yetu',
      ar: 'أن نكون مركز الوصول الرقمي الرائد الذي يوفر خدمات إنترنت موثوقة وحلول رقمية لمجتمعنا',
      fr: 'Être le centre d\'accès numérique leader fournissant des services internet fiables et des solutions numériques pour notre communauté'
    },
    mission: {
      en: 'Bridging the digital divide by providing affordable internet access, computer services, and digital literacy training',
      sw: 'Kuunganisha pengo la kidijiti kwa kutoa ufikiaji wa intaneti wa bei nafuu, huduma za kompyuta, na mafunzo ya ujuzi wa kidijiti',
      ar: 'سد الفجوة الرقمية من خلال توفير الوصول إلى الإنترنت بأسعار معقولة وخدمات الكمبيوتر والتدريب على محو الأمية الرقمية',
      fr: 'Combler la fracture numérique en fournissant un accès internet abordable, des services informatiques et une formation à l\'alphabétisation numérique'
    },
    targetMarket: {
      en: 'Students, job seekers, small business owners, remote workers, elderly learning technology, people without home internet',
      sw: 'Wanafunzi, watafutaji kazi, wamiliki wa biashara ndogo, wafanyakazi wa mbali, wazee wanaojifunza teknolojia, watu wasio na intaneti nyumbani',
      ar: 'الطلاب، الباحثون عن عمل، أصحاب الأعمال الصغيرة، العمال عن بُعد، كبار السن الذين يتعلمون التكنولوجيا، الأشخاص بدون إنترنت منزلي',
      fr: 'Étudiants, demandeurs d\'emploi, propriétaires de petites entreprises, travailleurs à distance, personnes âgées apprenant la technologie, personnes sans internet à domicile'
    },
    revenueModel: {
      en: 'Hourly internet access fees, printing and scanning services, document typing, training workshops, computer repairs',
      sw: 'Ada za ufikiaji wa intaneti kwa saa, huduma za kuchapisha na kuskaini, kuandika hati, warsha za mafunzo, ukarabati wa kompyuta',
      ar: 'رسوم الوصول إلى الإنترنت بالساعة، خدمات الطباعة والمسح الضوئي، كتابة المستندات، ورش التدريب، إصلاح أجهزة الكمبيوتر',
      fr: 'Frais d\'accès internet horaires, services d\'impression et de numérisation, frappe de documents, ateliers de formation, réparations d\'ordinateurs'
    },
    valueProposition: {
      en: 'Reliable high-speed internet, modern computers, printing services, technical support, and affordable rates',
      sw: 'Intaneti ya haraka ya kutegemewa, kompyuta za kisasa, huduma za kuchapisha, msaada wa kiufundi, na bei za bei nafuu',
      ar: 'إنترنت عالي السرعة موثوق، أجهزة كمبيوتر حديثة، خدمات طباعة، دعم فني، وأسعار معقولة',
      fr: 'Internet haut débit fiable, ordinateurs modernes, services d\'impression, support technique et tarifs abordables'
    },
    keyPartners: {
      en: 'Internet service providers, computer suppliers, software vendors, local schools, government offices, training institutions',
      sw: 'Watoa huduma za intaneti, wasambazaji wa kompyuta, wauza programu, shule za mitaani, ofisi za serikali, taasisi za mafunzo',
      ar: 'مقدمو خدمات الإنترنت، موردو أجهزة الكمبيوتر، بائعو البرامج، المدارس المحلية، المكاتب الحكومية، مؤسسات التدريب',
      fr: 'Fournisseurs de services internet, fournisseurs d\'ordinateurs, vendeurs de logiciels, écoles locales, bureaux gouvernementaux, institutions de formation'
    },
    marketingApproach: {
      en: 'Community outreach, student discounts, business partnerships, social media presence, referral programs',
      sw: 'Kutembea jamii, punguzo za wanafunzi, ushirikiano wa kibiashara, uwepo wa mitandao ya kijamii, mipango ya mapendekezo',
      ar: 'التوعية المجتمعية، خصومات الطلاب، الشراكات التجارية، الحضور على وسائل التواصل الاجتماعي، برامج الإحالة',
      fr: 'Sensibilisation communautaire, réductions étudiantes, partenariats commerciaux, présence sur les réseaux sociaux, programmes de parrainage'
    },
    operationalNeeds: {
      en: 'Computers, high-speed internet connection, printers, scanners, UPS systems, security cameras, comfortable seating',
      sw: 'Kompyuta, muunganisho wa intaneti wa haraka, printa, skaners, mifumo ya UPS, kamera za usalama, viti vya starehe',
      ar: 'أجهزة كمبيوتر، اتصال إنترنت عالي السرعة، طابعات، ماسحات ضوئية، أنظمة UPS، كاميرات أمنية، مقاعد مريحة',
      fr: 'Ordinateurs, connexion internet haut débit, imprimantes, scanners, systèmes UPS, caméras de sécurité, sièges confortables'
    },
    growthGoals: {
      en: 'Add gaming section, offer computer training courses, expand to mobile repair services, install faster internet',
      sw: 'Kuongeza sehemu ya michezo, kutoa kozi za mafunzo ya kompyuta, kupanua hadi huduma za ukarabati wa simu, kuweka intaneti ya haraka zaidi',
      ar: 'إضافة قسم الألعاب، تقديم دورات تدريب الكمبيوتر، التوسع إلى خدمات إصلاح الهواتف المحمولة، تثبيت إنترنت أسرع',
      fr: 'Ajouter une section jeux, offrir des cours de formation informatique, étendre aux services de réparation mobile, installer internet plus rapide'
    }
  }
};

export const getTemplateData = (language: string = 'en'): TemplateData[] => {
  console.log('Getting template data for language:', language);
  
  const getTranslatedContent = (templateId: string, language: string) => {
    const content = templateContents[templateId];
    if (!content) {
      // Fallback for templates not yet translated - provide empty fields for user to fill
      return {
        vision: '',
        mission: '',
        targetMarket: '',
        revenueModel: '',
        valueProposition: '',
        keyPartners: '',
        marketingApproach: '',
        operationalNeeds: '',
        growthGoals: ''
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
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items',
      content: getTranslatedContent('mitumba', language)
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance',
      content: getTranslatedContent('auto-repair', language)
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery',
      content: getTranslatedContent('boda-boda', language)
    },
    {
      id: 'agribusiness',
      name: language === 'sw' ? 'Biashara ya Kilimo' : language === 'ar' ? 'الأعمال الزراعية' : language === 'fr' ? 'Agrobusiness' : 'Agribusiness',
      description: language === 'sw' ? 'Kilimo, mifugo, na bidhaa za kilimo' : language === 'ar' ? 'الزراعة وتربية المواشي والمنتجات الزراعية' : language === 'fr' ? 'Agriculture, élevage et produits agricoles' : 'Farming, livestock, and agricultural products',
      content: getTranslatedContent('agribusiness', language)
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : language === 'ar' ? 'وكيل الأموال المحمولة' : language === 'fr' ? 'Agent d\'Argent Mobile' : 'Mobile Money Agent',
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : language === 'ar' ? 'الخدمات المالية الإلكترونية' : language === 'fr' ? 'Services financiers électroniques' : 'Electronic financial services',
      content: getTranslatedContent('mobile-money', language)
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
      content: getTranslatedContent('cleaning-services', language)
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
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creator',
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services',
      content: getTranslatedContent('freelance-writing', language)
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries',
      content: getTranslatedContent('bakery', language)
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support',
      content: getTranslatedContent('tutoring', language)
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching',
      content: getTranslatedContent('fitness-training', language)
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Services',
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing',
      content: getTranslatedContent('social-media', language)
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision',
      content: getTranslatedContent('daycare', language)
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: getTranslatedContent('cyber-cafe', language)
    }
  ];

  // Sort templates alphabetically by name
  const sortedTemplates = templates.sort((a, b) => a.name.localeCompare(b.name));
  
  console.log('Template data generated:', sortedTemplates.length, 'templates');
  return sortedTemplates;
};