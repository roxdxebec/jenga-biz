
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

export const getTemplateData = (language: string = 'en'): TemplateData[] => {
  const templates: TemplateData[] = [
    {
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items',
      content: {
        vision: language === 'sw' ? 'Kuwa duka la kwanza la mitumba linalotoa nguo za ubora wa juu kwa bei nafuu' : 'To be the leading second-hand clothing store providing quality fashion at affordable prices',
        mission: language === 'sw' ? 'Kutoa nguo za mitumba za ubora wa juu kwa jamii yetu' : 'To provide high-quality second-hand clothing to our community',
        targetMarket: language === 'sw' ? 'Wanawake na wanaume wa umri wa miaka 18-45 wanaotafuta nguo za bei nafuu' : 'Men and women aged 18-45 looking for affordable fashion',
        revenueModel: language === 'sw' ? 'Uuzaji wa nguo za mitumba, ubadilishaji wa nguo' : 'Sales of second-hand clothing, clothing alterations',
        valueProposition: language === 'sw' ? 'Nguo za ubora wa juu kwa bei nafuu kuliko maduka ya kawaida' : 'High-quality clothing at prices 60% lower than retail stores',
        keyPartners: language === 'sw' ? 'Wauzaji wa mitumba, mafundi wa ushonaji' : 'Wholesale mitumba suppliers, tailors for alterations',
        marketingApproach: language === 'sw' ? 'Matangazo ya mitandaoni, ushirikiano na wafuasi wa mtindo' : 'Social media marketing, fashion influencer partnerships',
        operationalNeeds: language === 'sw' ? 'Duka, nguo za mitumba, vifaa vya kuhifadhi, mfanyakazi mmoja' : 'Retail space, inventory of clothing, storage equipment, one staff member',
        growthGoals: language === 'sw' ? 'Kuongeza duka la pili ndani ya mwaka mmoja' : 'Open second location within 12 months'
      }
    },
    {
      id: 'agribusiness',
      name: language === 'sw' ? 'Biashara ya Kilimo' : language === 'ar' ? 'الأعمال الزراعية' : language === 'fr' ? 'Agrobusiness' : 'Agribusiness',
      description: language === 'sw' ? 'Kilimo, mifugo, na bidhaa za kilimo' : language === 'ar' ? 'الزراعة وتربية المواشي والمنتجات الزراعية' : language === 'fr' ? 'Agriculture, élevage et produits agricoles' : 'Farming, livestock, and agricultural products',
      content: {
        vision: 'To become the leading sustainable agriculture business in the region',
        mission: 'To provide fresh, organic produce while supporting local food security',
        targetMarket: 'Local markets, restaurants, and households seeking fresh produce',
        revenueModel: 'Direct sales to markets, restaurants, and consumers',
        valueProposition: 'Fresh, organic produce grown using sustainable methods',
        keyPartners: 'Local markets, restaurants, agricultural cooperatives',
        marketingApproach: 'Farmers markets, social media, direct customer relationships',
        operationalNeeds: 'Land, seeds, farming equipment, irrigation system',
        growthGoals: 'Double production capacity and add 3 new crop varieties'
      }
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: {
        vision: 'To be the premier digital services hub in our community',
        mission: 'To provide reliable internet access and digital services to bridge the digital divide',
        targetMarket: 'Students, small business owners, and community members needing internet access',
        revenueModel: 'Hourly internet usage fees, printing services, document services',
        valueProposition: 'Affordable, reliable internet access with additional business services',
        keyPartners: 'Internet service providers, computer suppliers, local schools',
        marketingApproach: 'Community outreach, student discounts, business partnerships',
        operationalNeeds: '10-15 computers, high-speed internet, printer, comfortable seating',
        growthGoals: 'Add computer training classes and expand to 24/7 operations'
      }
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals',
      content: {
        vision: 'To become the most trusted real estate agency in the region',
        mission: 'To help clients find their perfect homes and investment properties',
        targetMarket: 'Home buyers, sellers, investors, and renters in middle to upper income brackets',
        revenueModel: 'Commission on property sales and rental management fees',
        valueProposition: 'Expert local market knowledge with personalized service',
        keyPartners: 'Property developers, banks, legal firms, home inspectors',
        marketingApproach: 'Online listings, social media, referral network, local advertising',
        operationalNeeds: 'Office space, vehicle, marketing materials, legal documentation',
        growthGoals: 'Build team of 3 agents and establish property management division'
      }
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : language === 'ar' ? 'خدمات التنظيف' : language === 'fr' ? 'Services de Nettoyage' : 'Cleaning Services',
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : language === 'ar' ? 'تنظيف المنازل والمكاتب' : language === 'fr' ? 'Nettoyage de maisons et bureaux' : 'Home and office cleaning',
      content: {
        vision: 'To be the leading cleaning service known for reliability and quality',
        mission: 'To provide exceptional cleaning services that give clients more time for what matters',
        targetMarket: 'Busy professionals, families, and small businesses',
        revenueModel: 'Recurring cleaning contracts and one-time cleaning services',
        valueProposition: 'Reliable, thorough cleaning with eco-friendly products',
        keyPartners: 'Cleaning supply companies, insurance providers, local businesses',
        marketingApproach: 'Word-of-mouth referrals, online reviews, local advertising',
        operationalNeeds: 'Cleaning supplies, transportation, uniforms, insurance',
        growthGoals: 'Hire 2 additional cleaners and add commercial cleaning services'
      }
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : language === 'ar' ? 'تنظيم الفعاليات' : language === 'fr' ? 'Organisation d\'Événements' : 'Event Planning',
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : language === 'ar' ? 'تنظيم الأعراس والحفلات والفعاليات' : language === 'fr' ? 'Organisation de mariages, fêtes et événements' : 'Weddings, parties, and celebrations',
      content: {
        vision: 'To create unforgettable experiences through exceptional event planning',
        mission: 'To turn our clients\' visions into reality through detailed planning and flawless execution',
        targetMarket: 'Couples planning weddings, families celebrating milestones, corporate clients',
        revenueModel: 'Event planning fees, vendor commissions, decoration rentals',
        valueProposition: 'Stress-free event planning with attention to every detail',
        keyPartners: 'Venues, caterers, photographers, florists, musicians',
        marketingApproach: 'Social media showcasing past events, referrals, wedding fairs',
        operationalNeeds: 'Event planning software, vendor network, transportation, storage',
        growthGoals: 'Establish partnerships with 3 premium venues and hire an assistant'
      }
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services',
      content: {
        vision: 'To capture life\'s precious moments with artistic excellence',
        mission: 'To provide high-quality photography and videography services that preserve memories',
        targetMarket: 'Couples, families, businesses, and event organizers',
        revenueModel: 'Session fees, package deals, print sales, digital deliveries',
        valueProposition: 'Professional quality images with quick turnaround and affordable pricing',
        keyPartners: 'Wedding planners, venues, printing services, equipment suppliers',
        marketingApproach: 'Social media portfolio, wedding shows, referral network',
        operationalNeeds: 'Professional cameras, lenses, lighting equipment, editing software',
        growthGoals: 'Add drone photography services and establish studio space'
      }
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery',
      content: {
        vision: 'To be the fastest and most reliable food delivery service in the area',
        mission: 'To connect hungry customers with their favorite restaurants through efficient delivery',
        targetMarket: 'Busy professionals, students, families, and anyone wanting convenient meal delivery',
        revenueModel: 'Delivery fees, restaurant commissions, subscription services',
        valueProposition: 'Fast, reliable delivery with real-time tracking and competitive fees',
        keyPartners: 'Local restaurants, delivery drivers, payment processors, app developers',
        marketingApproach: 'Mobile app promotion, restaurant partnerships, social media advertising',
        operationalNeeds: 'Delivery vehicles, mobile app, GPS tracking, insulated bags',
        growthGoals: 'Partner with 50+ restaurants and hire 10 full-time drivers'
      }
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services',
      content: {
        vision: 'To be the premier beauty destination where everyone feels beautiful and confident',
        mission: 'To provide exceptional beauty and grooming services in a welcoming environment',
        targetMarket: 'Men and women of all ages seeking professional beauty and grooming services',
        revenueModel: 'Service fees for cuts, styling, treatments, and beauty packages',
        valueProposition: 'Professional beauty services with personalized attention in a relaxing atmosphere',
        keyPartners: 'Beauty product suppliers, equipment vendors, beauty schools',
        marketingApproach: 'Social media before/after photos, loyalty programs, referral discounts',
        operationalNeeds: 'Salon chairs, beauty equipment, products, comfortable waiting area',
        growthGoals: 'Add nail services and hire 2 additional stylists'
      }
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance',
      content: {
        vision: 'To be the most trusted auto repair shop known for honest service and quality work',
        mission: 'To keep our community\'s vehicles safe and reliable through expert repair services',
        targetMarket: 'Vehicle owners seeking reliable, affordable auto repair and maintenance',
        revenueModel: 'Labor charges, parts markup, maintenance packages',
        valueProposition: 'Honest diagnostics, quality repairs, and fair pricing with warranty',
        keyPartners: 'Parts suppliers, towing services, insurance companies, car dealerships',
        marketingApproach: 'Word-of-mouth referrals, online reviews, local advertising',
        operationalNeeds: 'Garage space, diagnostic equipment, tools, parts inventory',
        growthGoals: 'Add tire services and expand to include light truck repairs'
      }
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery',
      content: {
        vision: 'To provide safe, reliable, and affordable transportation to our community',
        mission: 'To connect people to their destinations safely while supporting local economy',
        targetMarket: 'Commuters, students, shoppers, and anyone needing quick transportation',
        revenueModel: 'Per-trip fares, delivery fees, package transport charges',
        valueProposition: 'Fast, affordable transportation with experienced, safety-conscious riders',
        keyPartners: 'Motorcycle dealers, insurance companies, fuel stations, maintenance shops',
        marketingApproach: 'Community presence, customer referrals, mobile app integration',
        operationalNeeds: 'Motorcycles, safety gear, licenses, insurance, maintenance tools',
        growthGoals: 'Add 3 more motorcycles and establish delivery service partnerships'
      }
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creation',
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services',
      content: {
        vision: 'To become the go-to content creator for businesses needing compelling written materials',
        mission: 'To help businesses communicate effectively through high-quality written content',
        targetMarket: 'Small businesses, startups, marketing agencies, and online publications',
        revenueModel: 'Per-project fees, retainer agreements, hourly rates',
        valueProposition: 'High-quality, engaging content delivered on time with quick revisions',
        keyPartners: 'Marketing agencies, web developers, graphic designers, editors',
        marketingApproach: 'Portfolio website, LinkedIn networking, content marketing, referrals',
        operationalNeeds: 'Computer, reliable internet, writing software, home office setup',
        growthGoals: 'Establish 5 regular clients and expand into video script writing'
      }
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries',
      content: {
        vision: 'To be the neighborhood\'s favorite bakery known for fresh, delicious baked goods',
        mission: 'To bring joy to our community through freshly baked breads, cakes, and pastries',
        targetMarket: 'Local families, offices, restaurants, and special event customers',
        revenueModel: 'Daily sales of bread and pastries, custom cake orders, catering services',
        valueProposition: 'Fresh, homemade baked goods using quality ingredients at competitive prices',
        keyPartners: 'Flour suppliers, local cafes, event planners, grocery stores',
        marketingApproach: 'Social media photos, word-of-mouth, local events, loyalty cards',
        operationalNeeds: 'Commercial ovens, baking equipment, ingredients, retail display cases',
        growthGoals: 'Add coffee service and expand custom cake decorating services'
      }
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support',
      content: {
        vision: 'To help every student reach their full academic potential',
        mission: 'To provide personalized tutoring that builds confidence and improves academic performance',
        targetMarket: 'Students from primary through university level, and adult learners',
        revenueModel: 'Hourly tutoring rates, group class fees, exam preparation packages',
        valueProposition: 'Personalized instruction that adapts to each student\'s learning style',
        keyPartners: 'Schools, parents, educational supply companies, online learning platforms',
        marketingApproach: 'Parent referrals, school partnerships, online testimonials, social media',
        operationalNeeds: 'Teaching materials, comfortable learning space, educational resources',
        growthGoals: 'Hire 2 additional tutors and offer online tutoring services'
      }
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching',
      content: {
        vision: 'To help people achieve their fitness goals and live healthier, stronger lives',
        mission: 'To provide expert fitness guidance that transforms lives through sustainable health practices',
        targetMarket: 'Adults seeking weight loss, strength building, or overall fitness improvement',
        revenueModel: 'Personal training sessions, group classes, fitness program packages',
        valueProposition: 'Customized fitness programs with ongoing support and motivation',
        keyPartners: 'Gyms, nutritionists, sports equipment suppliers, health practitioners',
        marketingApproach: 'Client transformations on social media, referrals, fitness challenges',
        operationalNeeds: 'Fitness equipment, training space, certification, liability insurance',
        growthGoals: 'Open small gym facility and add nutrition counseling services'
      }
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision',
      content: {
        vision: 'To provide a safe, nurturing environment where children can learn and grow',
        mission: 'To support working families by providing quality childcare with educational activities',
        targetMarket: 'Working parents with children aged 6 months to 5 years',
        revenueModel: 'Daily/hourly childcare fees, registration fees, after-school care',
        valueProposition: 'Safe, educational childcare with flexible scheduling and caring staff',
        keyPartners: 'Educational toy suppliers, child development specialists, local schools',
        marketingApproach: 'Parent referrals, community bulletin boards, social media, open houses',
        operationalNeeds: 'Child-safe facility, toys and educational materials, insurance, licenses',
        growthGoals: 'Add after-school program and increase capacity to 20 children'
      }
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Management',
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing',
      content: {
        vision: 'To help businesses build strong online communities and grow their digital presence',
        mission: 'To create engaging social media strategies that connect businesses with their customers',
        targetMarket: 'Small to medium businesses, entrepreneurs, and personal brands',
        revenueModel: 'Monthly management retainers, content creation packages, advertising management fees',
        valueProposition: 'Professional social media management that increases engagement and drives sales',
        keyPartners: 'Graphic designers, photographers, web developers, advertising platforms',
        marketingApproach: 'Case studies, free consultations, networking events, online content',
        operationalNeeds: 'Computer, design software, social media tools, project management systems',
        growthGoals: 'Build client base to 15 regular accounts and add video content services'
      }
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : language === 'ar' ? 'وكيل الأموال المحمولة' : language === 'fr' ? 'Agent d\'Argent Mobile' : 'Mobile Money Agent',
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : language === 'ar' ? 'الخدمات المالية الإلكترونية' : language === 'fr' ? 'Services financiers électroniques' : 'Electronic financial services',
      content: {
        vision: 'To be the most trusted mobile money agent providing reliable financial services',
        mission: 'To bridge the gap between digital and traditional banking for our community',
        targetMarket: 'Community members needing mobile money services, cash deposits/withdrawals',
        revenueModel: 'Transaction commissions, service fees, airtime sales',
        valueProposition: 'Convenient, secure mobile money services with friendly, knowledgeable service',
        keyPartners: 'Mobile network operators, banks, microfinance institutions',
        marketingApproach: 'Community trust building, referrals, local advertising, reliability',
        operationalNeeds: 'Mobile phones, cash float, secure storage, transaction records',
        growthGoals: 'Add bill payment services and become super agent for other operators'
      }
    }
  ];

  return templates;
};
