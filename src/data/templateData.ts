
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
  console.log('Getting template data for language:', language);
  
  const templates: TemplateData[] = [
    {
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items',
      content: {
        vision: 'To be the most trusted source of quality second-hand clothing in our community, promoting sustainable fashion and affordability',
        mission: 'Providing affordable, quality clothing while promoting sustainable fashion choices and supporting local entrepreneurs',
        targetMarket: 'Price-conscious families, young professionals, students, fashion enthusiasts in urban and peri-urban areas aged 18-45',
        revenueModel: 'Direct sales from physical store, WhatsApp marketing, bulk sales to other retailers, seasonal promotions and discounts',
        valueProposition: 'Quality second-hand clothes at prices 60% lower than retail with unique fashion finds and personalized service',
        keyPartners: 'Bale suppliers, local tailors for alterations, WhatsApp business groups, chama members, fashion influencers',
        marketingApproach: 'Word-of-mouth referrals, WhatsApp business marketing, local community events, social media showcases, referral programs',
        operationalNeeds: 'Store space, storage for inventory, transportation for bale collection, sorting equipment, mobile money account, cash register',
        growthGoals: 'Expand to online sales platform, add more product categories, establish multiple outlets, create wholesale distribution network'
      }
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services',
      content: {
        vision: 'To be the premier digital services hub providing reliable internet access and digital literacy to bridge the digital divide',
        mission: 'Providing reliable internet access and comprehensive digital services while empowering our community through technology',
        targetMarket: 'Students, small business owners, job seekers, remote workers, and community members needing internet access and digital services',
        revenueModel: 'Hourly internet usage fees, printing and scanning services, document typing, computer training courses, phone charging, mobile money',
        valueProposition: 'Affordable, reliable internet access with comprehensive business services, technical support, and digital literacy training',
        keyPartners: 'Internet service providers, computer suppliers, local schools, government agencies, training institutes, mobile money agents',
        marketingApproach: 'Community outreach programs, student discounts, business partnerships, word-of-mouth referrals, local advertising',
        operationalNeeds: '15-20 computers, high-speed internet connection, printer, scanner, comfortable seating, security system, backup power',
        growthGoals: 'Add computer training classes, expand to 24/7 operations, introduce mobile money services, establish satellite locations'
      }
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals',
      content: {
        vision: 'To become the most trusted real estate agency in the region, known for integrity, transparency and exceptional service delivery',
        mission: 'Helping clients find their perfect homes and investment properties while providing expert guidance throughout the entire process',
        targetMarket: 'Home buyers, property sellers, real estate investors, renters in middle to upper income brackets, first-time homebuyers',
        revenueModel: 'Commission on property sales (3-6%), rental management fees (8-10%), property valuation services, consultation fees',
        valueProposition: 'Expert local market knowledge with personalized service, transparent pricing, comprehensive support, and proven track record',
        keyPartners: 'Property developers, banks and financial institutions, legal firms, home inspectors, contractors, insurance companies',
        marketingApproach: 'Online property listings, social media marketing, referral network, local advertising, open houses, community events',
        operationalNeeds: 'Office space, reliable vehicle, marketing materials, legal documentation systems, photography equipment, professional signage',
        growthGoals: 'Build team of 5 agents, establish property management division, expand to 3 new neighborhoods, create online platform'
      }
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
      content: {
        vision: 'To create unforgettable experiences through exceptional event planning, creative design, and flawless execution of memorable celebrations',
        mission: 'Turning our clients\' visions into reality through detailed planning, creative design, seamless coordination, and personalized service',
        targetMarket: 'Couples planning weddings, families celebrating milestones, corporate clients, community organizations, cultural associations',
        revenueModel: 'Event planning fees (10-15% of budget), vendor commissions, decoration rentals, coordination services, consultation fees',
        valueProposition: 'Stress-free event planning with attention to every detail, creative solutions, budget management, and cultural sensitivity',
        keyPartners: 'Event venues, caterers, photographers, florists, musicians, decorators, transportation services, equipment rental companies',
        marketingApproach: 'Social media showcasing past events, client referrals, wedding fairs, venue partnerships, community networking',
        operationalNeeds: 'Event planning software, vendor network, transportation, decoration storage, office space, portfolio materials',
        growthGoals: 'Establish partnerships with 5 premium venues, hire 2 assistants, launch corporate division, expand to destination events'
      }
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services',
      content: {
        vision: 'To capture life\'s precious moments with artistic excellence, preserving memories that last forever through stunning visual storytelling',
        mission: 'Providing high-quality photography and videography services that exceed client expectations and preserve cherished memories',
        targetMarket: 'Couples getting married, families, businesses needing marketing content, event organizers, social media influencers',
        revenueModel: 'Wedding packages, portrait sessions, event coverage, commercial photography, print sales, digital packages, video editing',
        valueProposition: 'Professional quality images with artistic flair, quick turnaround, competitive pricing, and personalized service approach',
        keyPartners: 'Wedding planners, event venues, printing services, equipment rental companies, other photographers, makeup artists',
        marketingApproach: 'Social media portfolio showcasing work, wedding shows, referral network, SEO-optimized website, client testimonials',
        operationalNeeds: 'Professional cameras, lenses, lighting equipment, editing software, studio space, transportation, backup equipment',
        growthGoals: 'Add drone photography services, establish permanent studio, hire assistant photographer, expand to commercial clients'
      }
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery',
      content: {
        vision: 'To be the fastest and most reliable food delivery service connecting hungry customers with their favorite meals efficiently',
        mission: 'Connecting hungry customers with their favorite restaurants through efficient, reliable delivery service and excellent customer experience',
        targetMarket: 'Busy professionals, students, families, elderly customers, office workers wanting convenient meal delivery solutions',
        revenueModel: 'Delivery fees per order, restaurant commission (15-20%), surge pricing during peak hours, subscription services',
        valueProposition: 'Fast, reliable delivery with real-time tracking, competitive fees, wide restaurant selection, and exceptional customer service',
        keyPartners: 'Local restaurants, delivery drivers, payment processors, app developers, motorcycle dealers, insurance companies',
        marketingApproach: 'Mobile app promotion, restaurant partnerships, social media advertising, referral programs, promotional campaigns',
        operationalNeeds: 'Delivery motorcycles, mobile app platform, GPS tracking system, insulated delivery bags, communication devices',
        growthGoals: 'Partner with 80+ restaurants, hire 15 full-time drivers, expand to 3 new areas, introduce grocery delivery'
      }
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services',
      content: {
        vision: 'To be the premier beauty destination where everyone feels beautiful, confident, and pampered in a welcoming environment',
        mission: 'Providing exceptional beauty and grooming services in a relaxing, professional environment that enhances natural beauty',
        targetMarket: 'Men and women of all ages seeking professional beauty, hair care, grooming services, and personal wellness',
        revenueModel: 'Hair cuts and styling, beauty treatments, nail services, product sales, special occasion packages, membership programs',
        valueProposition: 'Professional beauty services with personalized attention, relaxing atmosphere, skilled stylists, and competitive pricing',
        keyPartners: 'Beauty product suppliers, equipment vendors, beauty schools, local spas, wedding planners, fashion designers',
        marketingApproach: 'Social media before/after photos, loyalty programs, referral discounts, local advertising, influencer partnerships',
        operationalNeeds: 'Salon chairs, hair washing stations, beauty equipment, products inventory, comfortable waiting area, sound system',
        growthGoals: 'Add nail and spa services, hire 3 additional stylists, introduce men\'s grooming line, establish second location'
      }
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
      content: {
        vision: 'To provide safe, reliable, and affordable transportation while supporting drivers and contributing to community development',
        mission: 'Connecting people to their destinations safely while supporting local economy, providing employment, and serving our community',
        targetMarket: 'Daily commuters, students, shoppers, business people, delivery services, and anyone needing quick transportation',
        revenueModel: 'Per-trip passenger fares, delivery service fees, package transport charges, rental income from drivers, fuel commission',
        valueProposition: 'Fast, affordable transportation with experienced, safety-conscious riders, flexible service, and reliable availability',
        keyPartners: 'Motorcycle dealers, insurance companies, fuel stations, maintenance shops, loading companies, delivery businesses',
        marketingApproach: 'Community presence, customer referrals, mobile app integration, strategic location positioning, safety campaigns',
        operationalNeeds: 'Motorcycles, safety gear (helmets, reflective vests), licenses, insurance, maintenance tools, communication devices',
        growthGoals: 'Add 5 more motorcycles, establish delivery service partnerships, create driver training program, expand coverage area'
      }
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creation',
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services',
      content: {
        vision: 'To become the go-to content creator for businesses needing compelling, high-quality written materials that drive results',
        mission: 'Helping businesses communicate effectively through high-quality written content that engages audiences and converts readers',
        targetMarket: 'Small businesses, startups, marketing agencies, online publications, e-commerce companies, personal brands',
        revenueModel: 'Per-project fees, monthly retainer agreements, hourly rates, blog management packages, content strategy consulting',
        valueProposition: 'High-quality, engaging content delivered on time with quick revisions, SEO optimization, and industry expertise',
        keyPartners: 'Marketing agencies, web developers, graphic designers, SEO specialists, business consultants, online platforms',
        marketingApproach: 'Professional portfolio website, LinkedIn networking, content marketing, client referrals, guest posting',
        operationalNeeds: 'Computer, reliable internet, writing software, home office setup, project management tools, research resources',
        growthGoals: 'Establish 8 regular clients, expand into video script writing, hire virtual assistant, create online course'
      }
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

  console.log('Template data generated:', templates.length, 'templates');
  return templates;
};
