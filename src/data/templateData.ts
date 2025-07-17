
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
        vision: 'To become the leading sustainable agriculture business providing fresh produce to local and regional markets',
        mission: 'To provide fresh, organic produce while supporting local food security and sustainable farming practices',
        targetMarket: 'Local markets, restaurants, households, and food processing companies seeking fresh produce',
        revenueModel: 'Direct sales to markets, restaurants, wholesale to distributors, value-added processing',
        valueProposition: 'Fresh, organic produce grown using sustainable methods with consistent quality and competitive pricing',
        keyPartners: 'Local markets, restaurants, agricultural cooperatives, seed suppliers, equipment dealers',
        marketingApproach: 'Farmers markets participation, restaurant partnerships, social media, direct customer relationships',
        operationalNeeds: 'Agricultural land, seeds, farming equipment, irrigation system, storage facilities, transportation',
        growthGoals: 'Double production capacity, add 3 new crop varieties, establish processing facility within 18 months'
      }
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: {
        vision: 'To be the premier digital services hub providing reliable internet access and digital literacy to our community',
        mission: 'To provide reliable internet access and digital services while bridging the digital divide in our community',
        targetMarket: 'Students, small business owners, job seekers, and community members needing internet access and digital services',
        revenueModel: 'Hourly internet usage fees, printing services, document typing, computer training courses, phone charging',
        valueProposition: 'Affordable, reliable internet access with additional business services and technical support',
        keyPartners: 'Internet service providers, computer suppliers, local schools, government agencies, training institutes',
        marketingApproach: 'Community outreach, student discounts, business partnerships, word-of-mouth referrals',
        operationalNeeds: '15-20 computers, high-speed internet connection, printer, scanner, comfortable seating, security system',
        growthGoals: 'Add computer training classes, expand to 24/7 operations, introduce mobile money services within 12 months'
      }
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals',
      content: {
        vision: 'To become the most trusted real estate agency in the region, known for integrity and exceptional service',
        mission: 'To help clients find their perfect homes and investment properties while providing expert guidance throughout the process',
        targetMarket: 'Home buyers, sellers, investors, renters in middle to upper income brackets, first-time homebuyers',
        revenueModel: 'Commission on property sales (3-6%), rental management fees (8-10%), property valuation services',
        valueProposition: 'Expert local market knowledge with personalized service, transparent pricing, and comprehensive support',
        keyPartners: 'Property developers, banks, legal firms, home inspectors, contractors, insurance companies',
        marketingApproach: 'Online property listings, social media marketing, referral network, local advertising, open houses',
        operationalNeeds: 'Office space, vehicle, marketing materials, legal documentation, photography equipment, signage',
        growthGoals: 'Build team of 5 agents, establish property management division, expand to 3 new neighborhoods within 24 months'
      }
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : language === 'ar' ? 'خدمات التنظيف' : language === 'fr' ? 'Services de Nettoyage' : 'Cleaning Services',
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : language === 'ar' ? 'تنظيف المنازل والمكاتب' : language === 'fr' ? 'Nettoyage de maisons et bureaux' : 'Home and office cleaning',
      content: {
        vision: 'To be the leading cleaning service known for reliability, quality, and eco-friendly practices',
        mission: 'To provide exceptional cleaning services that give clients more time for what matters most to them',
        targetMarket: 'Busy professionals, families with children, elderly clients, small businesses, medical facilities',
        revenueModel: 'Recurring weekly/monthly cleaning contracts, one-time deep cleaning services, specialized cleaning',
        valueProposition: 'Reliable, thorough cleaning with eco-friendly products, flexible scheduling, and bonded staff',
        keyPartners: 'Cleaning supply companies, insurance providers, local businesses, residential complexes',
        marketingApproach: 'Word-of-mouth referrals, online reviews, door-to-door marketing, partnership with realtors',
        operationalNeeds: 'Cleaning supplies, transportation vehicle, uniforms, insurance, equipment storage',
        growthGoals: 'Hire 4 additional cleaners, add commercial cleaning services, establish franchise model within 18 months'
      }
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : language === 'ar' ? 'تنظيم الفعاليات' : language === 'fr' ? 'Organisation d\'Événements' : 'Event Planning',
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : language === 'ar' ? 'تنظيم الأعراس والحفلات والفعاليات' : language === 'fr' ? 'Organisation de mariages, fêtes et événements' : 'Weddings, parties, and celebrations',
      content: {
        vision: 'To create unforgettable experiences through exceptional event planning and flawless execution',
        mission: 'To turn our clients\' visions into reality through detailed planning, creative design, and seamless coordination',
        targetMarket: 'Couples planning weddings, families celebrating milestones, corporate clients, community organizations',
        revenueModel: 'Event planning fees (10-15% of budget), vendor commissions, decoration rentals, coordination services',
        valueProposition: 'Stress-free event planning with attention to every detail, creative solutions, and budget management',
        keyPartners: 'Event venues, caterers, photographers, florists, musicians, decorators, transportation services',
        marketingApproach: 'Social media showcasing past events, referrals, wedding fairs, venue partnerships',
        operationalNeeds: 'Event planning software, vendor network, transportation, decoration storage, office space',
        growthGoals: 'Establish partnerships with 5 premium venues, hire 2 assistants, launch corporate division within 15 months'
      }
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services',
      content: {
        vision: 'To capture life\'s precious moments with artistic excellence and preserve memories that last forever',
        mission: 'To provide high-quality photography and videography services that exceed client expectations',
        targetMarket: 'Couples getting married, families, businesses needing marketing content, event organizers',
        revenueModel: 'Wedding packages, portrait sessions, event coverage, commercial photography, print sales',
        valueProposition: 'Professional quality images with artistic flair, quick turnaround, and competitive pricing',
        keyPartners: 'Wedding planners, event venues, printing services, equipment rental companies, other photographers',
        marketingApproach: 'Social media portfolio showcasing work, wedding shows, referral network, SEO-optimized website',
        operationalNeeds: 'Professional cameras, lenses, lighting equipment, editing software, studio space, transportation',
        growthGoals: 'Add drone photography services, establish permanent studio, hire assistant photographer within 12 months'
      }
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery',
      content: {
        vision: 'To be the fastest and most reliable food delivery service connecting hungry customers with their favorite meals',
        mission: 'To connect hungry customers with their favorite restaurants through efficient, reliable delivery service',
        targetMarket: 'Busy professionals, students, families, elderly customers wanting convenient meal delivery',
        revenueModel: 'Delivery fees per order, restaurant commission (15-20%), surge pricing during peak hours',
        valueProposition: 'Fast, reliable delivery with real-time tracking, competitive fees, and wide restaurant selection',
        keyPartners: 'Local restaurants, delivery drivers, payment processors, app developers, motorcycle dealers',
        marketingApproach: 'Mobile app promotion, restaurant partnerships, social media advertising, referral programs',
        operationalNeeds: 'Delivery motorcycles, mobile app platform, GPS tracking system, insulated delivery bags',
        growthGoals: 'Partner with 80+ restaurants, hire 15 full-time drivers, expand to 3 new areas within 18 months'
      }
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services',
      content: {
        vision: 'To be the premier beauty destination where everyone feels beautiful, confident, and pampered',
        mission: 'To provide exceptional beauty and grooming services in a welcoming, relaxing environment',
        targetMarket: 'Men and women of all ages seeking professional beauty, hair care, and grooming services',
        revenueModel: 'Hair cuts and styling, beauty treatments, nail services, product sales, special occasion packages',
        valueProposition: 'Professional beauty services with personalized attention, relaxing atmosphere, and competitive pricing',
        keyPartners: 'Beauty product suppliers, equipment vendors, beauty schools, local spas, wedding planners',
        marketingApproach: 'Social media before/after photos, loyalty programs, referral discounts, local advertising',
        operationalNeeds: 'Salon chairs, hair washing stations, beauty equipment, products inventory, comfortable waiting area',
        growthGoals: 'Add nail and spa services, hire 3 additional stylists, introduce men\'s grooming line within 15 months'
      }
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance',
      content: {
        vision: 'To be the most trusted auto repair shop known for honest service, quality work, and fair pricing',
        mission: 'To keep our community\'s vehicles safe and reliable through expert repair services and preventive maintenance',
        targetMarket: 'Vehicle owners seeking reliable, affordable auto repair, maintenance, and emergency services',
        revenueModel: 'Labor charges for repairs, parts markup (20-30%), maintenance packages, emergency roadside assistance',
        valueProposition: 'Honest diagnostics, quality repairs with warranty, fair pricing, and excellent customer service',
        keyPartners: 'Auto parts suppliers, towing services, insurance companies, car dealerships, tire suppliers',
        marketingApproach: 'Word-of-mouth referrals, online reviews, local advertising, partnerships with car dealers',
        operationalNeeds: 'Garage space with lifts, diagnostic equipment, hand tools, parts inventory, waiting area',
        growthGoals: 'Add tire services, expand to include motorcycles, hire 2 additional mechanics within 12 months'
      }
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery',
      content: {
        vision: 'To provide safe, reliable, and affordable transportation while supporting drivers and community development',
        mission: 'To connect people to their destinations safely while supporting local economy and providing employment',
        targetMarket: 'Daily commuters, students, shoppers, business people, and anyone needing quick transportation',
        revenueModel: 'Per-trip passenger fares, delivery service fees, package transport charges, rental income from drivers',
        valueProposition: 'Fast, affordable transportation with experienced, safety-conscious riders and flexible service',
        keyPartners: 'Motorcycle dealers, insurance companies, fuel stations, maintenance shops, loading/delivery companies',
        marketingApproach: 'Community presence, customer referrals, mobile app integration, strategic location positioning',
        operationalNeeds: 'Motorcycles, safety gear (helmets, reflective vests), licenses, insurance, maintenance tools',
        growthGoals: 'Add 5 more motorcycles, establish delivery service partnerships, create driver training program within 18 months'
      }
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creation',
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services',
      content: {
        vision: 'To become the go-to content creator for businesses needing compelling, high-quality written materials',
        mission: 'To help businesses communicate effectively through high-quality written content that engages and converts',
        targetMarket: 'Small businesses, startups, marketing agencies, online publications, e-commerce companies',
        revenueModel: 'Per-project fees, monthly retainer agreements, hourly rates, blog management packages',
        valueProposition: 'High-quality, engaging content delivered on time with quick revisions and SEO optimization',
        keyPartners: 'Marketing agencies, web developers, graphic designers, SEO specialists, business consultants',
        marketingApproach: 'Professional portfolio website, LinkedIn networking, content marketing, client referrals',
        operationalNeeds: 'Computer, reliable internet, writing software, home office setup, project management tools',
        growthGoals: 'Establish 8 regular clients, expand into video script writing, hire virtual assistant within 15 months'
      }
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries',
      content: {
        vision: 'To be the neighborhood\'s favorite bakery known for fresh, delicious baked goods and exceptional service',
        mission: 'To bring joy to our community through freshly baked breads, cakes, and pastries made with love',
        targetMarket: 'Local families, offices, restaurants, schools, and customers needing custom cakes for special events',
        revenueModel: 'Daily sales of bread and pastries, custom cake orders, catering services, wholesale to cafes',
        valueProposition: 'Fresh, homemade baked goods using quality ingredients at competitive prices with custom options',
        keyPartners: 'Flour and ingredient suppliers, local cafes, event planners, grocery stores, schools',
        marketingApproach: 'Social media photos of daily offerings, word-of-mouth, local events, loyalty cards',
        operationalNeeds: 'Commercial ovens, baking equipment, ingredients inventory, retail display cases, packaging materials',
        growthGoals: 'Add coffee service, expand custom cake decorating, hire 2 bakers, open second location within 20 months'
      }
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support',
      content: {
        vision: 'To help every student reach their full academic potential and develop confidence in learning',
        mission: 'To provide personalized tutoring that builds confidence, improves academic performance, and fosters love for learning',
        targetMarket: 'Students from primary through university level, adult learners, parents seeking academic support for children',
        revenueModel: 'Hourly tutoring rates, group class fees, exam preparation packages, online tutoring sessions',
        valueProposition: 'Personalized instruction that adapts to each student\'s learning style with proven results',
        keyPartners: 'Schools, parents, educational supply companies, online learning platforms, testing centers',
        marketingApproach: 'Parent referrals, school partnerships, online testimonials, social media success stories',
        operationalNeeds: 'Teaching materials, comfortable learning space, educational resources, whiteboard, computer',
        growthGoals: 'Hire 3 additional tutors, offer online tutoring services, establish test prep center within 12 months'
      }
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching',
      content: {
        vision: 'To help people achieve their fitness goals and live healthier, stronger, more confident lives',
        mission: 'To provide expert fitness guidance that transforms lives through sustainable health practices and motivation',
        targetMarket: 'Adults seeking weight loss, strength building, overall fitness improvement, athletes, busy professionals',
        revenueModel: 'Personal training sessions, group fitness classes, fitness program packages, nutritional consultation',
        valueProposition: 'Customized fitness programs with ongoing support, motivation, and proven results',
        keyPartners: 'Gyms, nutritionists, sports equipment suppliers, health practitioners, supplement stores',
        marketingApproach: 'Client transformation showcases on social media, referrals, fitness challenges, free consultations',
        operationalNeeds: 'Fitness equipment, training space rental, certification maintenance, liability insurance',
        growthGoals: 'Open small gym facility, add nutrition counseling services, hire 2 trainers within 18 months'
      }
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision',
      content: {
        vision: 'To provide a safe, nurturing environment where children can learn, grow, and develop to their fullest potential',
        mission: 'To support working families by providing quality childcare with educational activities and loving care',
        targetMarket: 'Working parents with children aged 6 months to 5 years, single parents, shift workers',
        revenueModel: 'Daily/weekly childcare fees, registration fees, after-school care, summer programs, meals',
        valueProposition: 'Safe, educational childcare with flexible scheduling, caring qualified staff, and developmental activities',
        keyPartners: 'Educational toy suppliers, child development specialists, local schools, health clinics',
        marketingApproach: 'Parent referrals, community bulletin boards, social media, open houses, partnerships with employers',
        operationalNeeds: 'Child-safe facility, toys and educational materials, security system, licenses, insurance',
        growthGoals: 'Add after-school program, increase capacity to 30 children, hire 2 teachers within 15 months'
      }
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Management',
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing',
      content: {
        vision: 'To help businesses build strong online communities and grow their digital presence effectively',
        mission: 'To create engaging social media strategies that connect businesses with their customers and drive growth',
        targetMarket: 'Small to medium businesses, entrepreneurs, personal brands, restaurants, retail stores',
        revenueModel: 'Monthly management retainers, content creation packages, advertising management fees, strategy consultations',
        valueProposition: 'Professional social media management that increases engagement, followers, and drives sales',
        keyPartners: 'Graphic designers, photographers, web developers, advertising platforms, content creators',
        marketingApproach: 'Case studies showcasing client success, free consultations, networking events, online content',
        operationalNeeds: 'Computer, design software, social media management tools, project management systems',
        growthGoals: 'Build client base to 20 regular accounts, add video content services, hire content creator within 12 months'
      }
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : language === 'ar' ? 'وكيل الأموال المحمولة' : language === 'fr' ? 'Agent d\'Argent Mobile' : 'Mobile Money Agent',
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : language === 'ar' ? 'الخدمات المالية الإلكترونية' : language === 'fr' ? 'Services financiers électroniques' : 'Electronic financial services',
      content: {
        vision: 'To be the most trusted mobile money agent providing reliable, secure financial services to our community',
        mission: 'To bridge the gap between digital and traditional banking while providing essential financial services',
        targetMarket: 'Community members needing mobile money services, cash deposits/withdrawals, bill payments',
        revenueModel: 'Transaction commissions (1-3% per transaction), service fees, airtime sales, bill payment commissions',
        valueProposition: 'Convenient, secure mobile money services with friendly, knowledgeable service and competitive rates',
        keyPartners: 'Mobile network operators (Safaricom, Airtel), banks, microfinance institutions, utility companies',
        marketingApproach: 'Community trust building, referrals, local advertising, reliability and security emphasis',
        operationalNeeds: 'Mobile phones, adequate cash float, secure storage, transaction records, point-of-sale systems',
        growthGoals: 'Add bill payment services, become super agent for multiple operators, open second location within 18 months'
      }
    }
  ];

  return templates;
};
