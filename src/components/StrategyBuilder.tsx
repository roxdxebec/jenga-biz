import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Download, Eye, Wand2, Home, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StrategySummary from '@/components/StrategySummary';
import CustomerPersonaSection from '@/components/CustomerPersonaSection';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import MonthlyRevenueSection from '@/components/MonthlyRevenueSection';
import LanguageSelector from '@/components/LanguageSelector';
import CoachingTip from '@/components/CoachingTip';
import CountrySelector from '@/components/CountrySelector';

const StrategyBuilder = ({ template, onBack, onHome }) => {
  console.log('StrategyBuilder - Component rendering with template:', template);
  
  const [strategy, setStrategy] = useState({
    businessName: '',
    vision: '',
    mission: '',
    targetMarket: '',
    revenueModel: '',
    valueProposition: '',
    keyPartners: '',
    marketingApproach: '',
    operationalNeeds: '',
    growthGoals: ''
  });
  
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCountry, setCurrentCountry] = useState('KE');
  const { toast } = useToast();

  // Get currency info based on country
  const countries = [
    { code: 'KE', name: 'Kenya', currency: 'KES', symbol: 'KSh' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'USh' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TSh' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', symbol: 'FRw' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', symbol: 'Br' }
  ];

  const currentCountryInfo = countries.find(c => c.code === currentCountry) || countries[0];

  // Translation object
  const translations = {
    en: {
      strategyBuilder: 'Strategy Builder',
      customStrategy: 'Custom Strategy',
      businessName: 'Business Name',
      vision: 'Vision Statement',
      mission: 'Mission Statement',
      targetMarket: 'Target Market',
      revenueModel: 'Revenue Model',
      valueProposition: 'Unique Value Proposition',
      keyPartners: 'Key Partners',
      marketingApproach: 'Marketing Approach',
      operationalNeeds: 'Operational Needs',
      growthGoals: 'Growth Goals',
      save: 'Save',
      home: 'Home',
      back: 'Back',
      generateSummary: 'Generate AI Summary',
      generatingSummary: 'Generating Summary...',
      strategySaved: 'Strategy Saved!',
      strategySavedDesc: 'Your business strategy has been saved successfully.',
      testingNote: 'This feature will be part of Strategy Grid Pro (Tier 2) once live. Enjoy full access during testing.',
      enterPlaceholder: 'Enter your',
      describePlaceholder: 'Describe your',
      strategyTooltip: 'This roadmap is your business strategy in simple, actionable steps.',
      coachingTips: {
        businessName: 'Choose a name that\'s easy to remember and reflects what you do.',
        vision: 'Think big! What impact do you want your business to have in 5-10 years?',
        mission: 'Keep it simple and focused on the value you provide to customers.',
        targetMarket: 'Visualize your ideal customer — their age, income, daily needs, and lifestyle.',
        revenueModel: 'Focus on 2-3 main ways to make money rather than trying everything at once.',
        valueProposition: 'What makes you different from competitors? What unique value do you offer?',
        keyPartners: 'Think about who can help you succeed - suppliers, distributors, mentors.',
        marketingApproach: 'Start with one or two channels you can do well rather than trying everything.',
        operationalNeeds: 'List the essentials first - what do you absolutely need to start?',
        growthGoals: 'Set specific, measurable goals with realistic timelines.'
      }
    },
    sw: {
      strategyBuilder: 'Mjenzi wa Mkakati',
      customStrategy: 'Mkakati wa Kawaida',
      businessName: 'Jina la Biashara',
      vision: 'Kauli ya Maono',
      mission: 'Kauli ya Dhumuni',
      targetMarket: 'Soko la Lengo',
      revenueModel: 'Mfumo wa Mapato',
      valueProposition: 'Thamani ya Kipekee',
      keyPartners: 'Washirika Wakuu',
      marketingApproach: 'Mbinu za Uuzaji',
      operationalNeeds: 'Mahitaji ya Uendeshaji',
      growthGoals: 'Malengo ya Ukuaji',
      save: 'Hifadhi',
      home: 'Nyumbani',
      back: 'Rudi',
      generateSummary: 'Tengeneza Muhtasari wa AI',
      generatingSummary: 'Inatengeneza Muhtasari...',
      strategySaved: 'Mkakati Umehifadhiwa!',
      strategySavedDesc: 'Mkakati wako wa biashara umehifadhiwa kwa mafanikio.',
      testingNote: 'Kipengele hiki kitakuwa sehemu ya Strategy Grid Pro (Daraja la 2) baada ya kuanzishwa. Furahia ufikiaji kamili wakati wa upimaji.',
      enterPlaceholder: 'Ingiza',
      describePlaceholder: 'Eleza',
      strategyTooltip: 'Ramani hii ni mkakati wako wa biashara katika hatua rahisi na zinazoweza kutekelezwa.',
      coachingTips: {
        businessName: 'Chagua jina ambalo ni rahisi kukumbuka na linaonyesha unachofanya.',
        vision: 'Fikiria kubwa! Ni athari gani unayotaka biashara yako iwe nayo katika miaka 5-10?',
        mission: 'Iweke rahisi na lenga thamani unayotoa kwa wateja.',
        targetMarket: 'Ona mteja wako mzuri - umri wake, mapato, mahitaji ya kila siku, na mtindo wa maisha.',
        revenueModel: 'Zingatia njia 2-3 kuu za kupata pesa badala ya kujaribu kila kitu mara moja.',
        valueProposition: 'Ni nini kinachokufanya tofauti na washindani? Ni thamani gani ya kipekee unayotoa?',
        keyPartners: 'Fikiria ni nani anayeweza kukusaidia kufanikiwa - wasambazaji, wasafirishaji, washauri.',
        marketingApproach: 'Anza na chaneli moja au mbili unazoweza kuzifanya vizuri badala ya kujaribu kila kitu.',
        operationalNeeds: 'Orodhesha muhimu kwanza - ni nini unahitaji kabisa kuanza?',
        growthGoals: 'Weka malengo mahususi, yanayoweza kupimwa na yenye ratiba za busara.'
      }
    },
    ar: {
      strategyBuilder: 'منشئ الاستراتيجية',
      customStrategy: 'استراتيجية مخصصة',
      businessName: 'اسم الشركة',
      vision: 'بيان الرؤية',
      mission: 'بيان المهمة',
      targetMarket: 'السوق المستهدف',
      revenueModel: 'نموذج الإيرادات',
      valueProposition: 'اقتراح القيمة الفريدة',
      keyPartners: 'الشركاء الرئيسيون',
      marketingApproach: 'نهج التسويق',
      operationalNeeds: 'الاحتياجات التشغيلية',
      growthGoals: 'أهداف النمو',
      save: 'حفظ',
      home: 'الرئيسية',
      back: 'رجوع',
      generateSummary: 'إنشاء ملخص AI',
      generatingSummary: 'جاري إنشاء الملخص...',
      strategySaved: 'تم حفظ الاستراتيجية!',
      strategySavedDesc: 'تم حفظ استراتيجية عملك بنجاح.',
      testingNote: 'ستكون هذه الميزة جزءًا من Strategy Grid Pro (المستوى 2) بمجرد النشر. استمتع بالوصول الكامل أثناء الاختبار.',
      enterPlaceholder: 'أدخل',
      describePlaceholder: 'وصف',
      strategyTooltip: 'هذه الخريطة هي استراتيجية عملك في خطوات بسيطة وقابلة للتنفيذ.',
      coachingTips: {
        businessName: 'اختر اسماً سهل التذكر ويعكس ما تفعله.',
        vision: 'فكر بشكل كبير! ما التأثير الذي تريد أن يكون لعملك في 5-10 سنوات؟',
        mission: 'اجعلها بسيطة ومركزة على القيمة التي تقدمها للعملاء.',
        targetMarket: 'تصور عميلك المثالي - عمره ودخله واحتياجاته اليومية وأسلوب حياته.',
        revenueModel: ' Concentر على 2-3 طرق رئيسية لكسب المال بدلاً من تجربة كل شيء مرة واحدة.',
        valueProposition: 'ما الذي يجعلك مختلفاً عن المنافسين؟ ما القيمة الفريدة التي تقدمها؟',
        keyPartners: 'فكر في من يمكنه مساعدتك على النجاح - الموردين والموزعين والمرشدين.',
        marketingApproach: 'ابدأ بقناة أو قناتين يمكنك أن تجيدهما بدلاً من تجربة كل شيء.',
        operationalNeeds: 'اسرد الأساسيات أولاً - ما الذي تحتاجه بالضرورة للبدء؟',
        growthGoals: 'ضع أهدافاً محددة وقابلة للقياس مع جداول زمنية واقعية.'
      }
    },
    fr: {
      strategyBuilder: 'Constructeur de Stratégie',
      customStrategy: 'Stratégie Personnalisée',
      businessName: 'Nom de l\'Entreprise',
      vision: 'Déclaration de Vision',
      mission: 'Déclaration de Mission',
      targetMarket: 'Marché Cible',
      revenueModel: 'Modèle de Revenus',
      valueProposition: 'Proposition de Valeur Unique',
      keyPartners: 'Partenaires Clés',
      marketingApproach: 'Approche Marketing',
      operationalNeeds: 'Besoins Opérationnels',
      growthGoals: 'Objectifs de Croissance',
      save: 'Sauvegarder',
      home: 'Accueil',
      back: 'Retour',
      generateSummary: 'Générer un Résumé IA',
      generatingSummary: 'Génération du Résumé...',
      strategySaved: 'Stratégie Sauvegardée!',
      strategySavedDesc: 'Votre stratégie d\'entreprise a été sauvegardée avec succès.',
      testingNote: 'Cette fonctionnalité fera partie de Strategy Grid Pro (Niveau 2) une fois lancée. Profitez d\'un accès complet pendant les tests.',
      enterPlaceholder: 'Entrez votre',
      describePlaceholder: 'Décrivez votre',
      strategyTooltip: 'Cette feuille de route est votre stratégie d\'entreprise en étapes simples et réalisables.',
      coachingTips: {
        businessName: 'Choisissez un nom facile à retenir et qui reflète ce que vous faites.',
        vision: 'Pensez grand ! Quel impact voulez-vous que votre entreprise ait dans 5 à 10 ans ?',
        mission: 'Gardez-la simple et concentrée sur la valeur que vous apportez aux clients.',
        targetMarket: 'Visualisez votre client idéal - son âge, ses revenus, ses besoins quotidiens et son style de vie.',
        revenueModel: 'Concentrez-vous sur 2-3 moyens principaux de gagner de l\'argent plutôt que d\'essayer tout en même temps.',
        valueProposition: 'Qu\'est-ce qui vous rend différent des concurrents ? Quelle valeur unique offrez-vous ?',
        keyPartners: 'Pensez à qui peut vous aider à réussir - fournisseurs, distributeurs, mentors.',
        marketingApproach: 'Commencez par un ou deux canaux que vous pouvez bien faire plutôt que d\'essayer tout.',
        operationalNeeds: 'Listez d\'abord l\'essentiel - de quoi avez-vous absolument besoin pour commencer ?',
        growthGoals: 'Fixez des objectifs spécifiques et mesurables avec des délais réalistes.'
      }
    }
  };

  const t = translations[currentLanguage] || translations.en;

  // Comprehensive template data for all business types
  const templateData = {
    'online-retail': {
      businessName: 'My Online Store',
      vision: 'To become the leading online retailer for quality products in my region',
      mission: 'Providing convenient online shopping with reliable delivery and excellent customer service',
      targetMarket: 'Urban professionals, tech-savvy consumers, busy families seeking convenience',
      revenueModel: 'Product sales with markup, delivery fees, affiliate commissions, premium memberships',
      valueProposition: 'Quality products with doorstep delivery, competitive prices, and easy returns',
      keyPartners: 'Suppliers, logistics companies, payment processors, social media influencers',
      marketingApproach: 'Social media marketing, WhatsApp catalogs, Google ads, customer referrals',
      operationalNeeds: 'E-commerce platform, inventory storage, packaging materials, delivery network',
      growthGoals: 'Expand product range, establish physical showroom, build mobile app, enter new cities'
    },
    'agribusiness': {
      businessName: 'My Agribusiness',
      vision: 'To be a leading sustainable agricultural enterprise improving food security',
      mission: 'Producing quality crops using modern farming techniques while empowering local farmers',
      targetMarket: 'Local markets, restaurants, food processors, export companies, retail chains',
      revenueModel: 'Direct crop sales, value-added products, farming consultancy, equipment rental',
      valueProposition: 'Fresh, quality produce with consistent supply and competitive pricing',
      keyPartners: 'Seed suppliers, agricultural extension services, cooperatives, financial institutions',
      marketingApproach: 'Market associations, agricultural shows, direct buyer relationships, digital platforms',
      operationalNeeds: 'Land, farming equipment, irrigation system, storage facilities, transportation',
      growthGoals: 'Expand acreage, add processing unit, develop export markets, establish farmer network'
    },
    'mobile-money': {
      businessName: 'My Mobile Money Service',
      vision: 'To be the most trusted mobile money agent in my community',
      mission: 'Providing reliable financial services that connect people to digital economy',
      targetMarket: 'Unbanked population, small traders, remittance senders, bill payers',
      revenueModel: 'Transaction commissions, float interest, value-added services, bill payment fees',
      valueProposition: 'Convenient, secure money transfers with extended hours and friendly service',
      keyPartners: 'Mobile network operators, banks, microfinance institutions, local businesses',
      marketingApproach: 'Community engagement, referral programs, local advertising, partnership marketing',
      operationalNeeds: 'Shop space, cash float, mobile devices, security measures, network connectivity',
      growthGoals: 'Multiple outlets, additional services, agent network, digital payment integration'
    },
    'cyber-cafe': {
      businessName: 'My Cyber Café',
      vision: 'To be the premier digital services hub in my neighborhood',
      mission: 'Bridging the digital divide by providing affordable internet and computer services',
      targetMarket: 'Students, job seekers, small business owners, digital service seekers',
      revenueModel: 'Internet charges, printing services, typing services, computer training fees',
      valueProposition: 'Affordable internet access with additional services like printing and training',
      keyPartners: 'Internet service providers, equipment suppliers, educational institutions, government offices',
      marketingApproach: 'Student discounts, loyalty programs, community partnerships, local advertising',
      operationalNeeds: 'Computers, internet connection, printer, furniture, software licenses, security',
      growthGoals: 'Upgrade equipment, add gaming section, expand training programs, multiple locations'
    },
    'real-estate': {
      businessName: 'My Real Estate Agency',
      vision: 'To be the most trusted real estate partner in property transactions',
      mission: 'Connecting property owners with buyers and tenants through professional service',
      targetMarket: 'Property investors, homebuyers, tenants, landlords, developers',
      revenueModel: 'Sales commissions, rental commissions, property management fees, consultation charges',
      valueProposition: 'Expert market knowledge with honest advice and smooth transaction processes',
      keyPartners: 'Property developers, banks, lawyers, surveyors, contractors, insurance companies',
      marketingApproach: 'Online listings, referral network, property exhibitions, social media marketing',
      operationalNeeds: 'Office space, vehicle, marketing materials, legal documentation, database system',
      growthGoals: 'Build agent network, develop properties, expand service area, digital platform'
    },
    'cleaning-services': {
      businessName: 'My Cleaning Services',
      vision: 'To provide the highest quality cleaning services with exceptional customer care',
      mission: 'Creating clean, healthy environments for homes and businesses',
      targetMarket: 'Busy professionals, offices, hotels, restaurants, residential complexes',
      revenueModel: 'Service contracts, one-time cleaning fees, specialized cleaning charges, maintenance contracts',
      valueProposition: 'Reliable, thorough cleaning with eco-friendly products and flexible scheduling',
      keyPartners: 'Cleaning supply companies, equipment suppliers, facility managers, property managers',
      marketingApproach: 'Referral programs, online presence, corporate partnerships, door-to-door marketing',
      operationalNeeds: 'Cleaning supplies, equipment, transportation, uniforms, insurance, staff training',
      growthGoals: 'Hire more staff, specialized services, commercial contracts, franchise expansion'
    },
    'event-planning': {
      businessName: 'My Event Planning Service',
      vision: 'To create unforgettable experiences through exceptional event planning',
      mission: 'Turning celebrations into perfect memories with creative planning and flawless execution',
      targetMarket: 'Wedding couples, corporations, families, religious organizations, social groups',
      revenueModel: 'Planning fees, vendor commissions, package deals, coordination charges',
      valueProposition: 'Stress-free event planning with creative themes and reliable vendor network',
      keyPartners: 'Venues, caterers, decorators, photographers, musicians, florists, equipment rentals',
      marketingApproach: 'Portfolio showcasing, social media, vendor referrals, satisfied client testimonials',
      operationalNeeds: 'Planning tools, transportation, communication devices, vendor relationships, portfolio materials',
      growthGoals: 'Expand service offerings, build venue partnerships, hire assistants, establish brand'
    },
    'photography': {
      businessName: 'My Photography Studio',
      vision: 'To capture life\'s precious moments with artistic excellence',
      mission: 'Preserving memories through professional photography and videography services',
      targetMarket: 'Wedding couples, families, businesses, events, social media influencers',
      revenueModel: 'Session fees, package deals, print sales, digital products, commercial shoots',
      valueProposition: 'High-quality images with creative style and professional service',
      keyPartners: 'Equipment suppliers, photo labs, event planners, makeup artists, venue owners',
      marketingApproach: 'Portfolio marketing, social media showcase, referral programs, vendor partnerships',
      operationalNeeds: 'Camera equipment, lighting, editing software, studio space, transportation',
      growthGoals: 'Upgrade equipment, establish studio, expand into videography, build team'
    },
    'food-delivery': {
      businessName: 'My Food Delivery Service',
      vision: 'To be the fastest and most reliable food delivery service in the area',
      mission: 'Connecting hungry customers with their favorite meals through efficient delivery',
      targetMarket: 'Busy professionals, students, families, office workers, event organizers',
      revenueModel: 'Delivery fees, restaurant commissions, surge pricing, subscription plans',
      valueProposition: 'Fast, hot food delivery with real-time tracking and diverse restaurant options',
      keyPartners: 'Restaurants, delivery riders, payment processors, mapping services, food aggregators',
      marketingApproach: 'App-based marketing, restaurant partnerships, promotional offers, social media',
      operationalNeeds: 'Mobile app, delivery fleet, payment system, order management, customer support',
      growthGoals: 'Expand coverage area, increase restaurant partners, improve technology, scale operations'
    },
    'mitumba': {
      businessName: 'My Mitumba Store',
      vision: 'To be the most trusted source of quality second-hand clothing in my community',
      mission: 'Providing affordable, quality clothing while promoting sustainable fashion choices',
      targetMarket: 'Price-conscious families, young professionals, students in urban and peri-urban areas',
      revenueModel: 'Direct sales from physical store and WhatsApp marketing, bulk sales to other retailers',
      valueProposition: 'Quality second-hand clothes at affordable prices with personalized service',
      keyPartners: 'Bale suppliers, local tailors for alterations, WhatsApp groups, chama members',
      marketingApproach: 'Word-of-mouth, WhatsApp business, local community events, referral programs',
      operationalNeeds: 'Store space, storage for inventory, transportation for bale collection, mobile money account',
      growthGoals: 'Expand to online sales, add more product categories, establish multiple outlets'
    },
    'beauty-salon': {
      businessName: 'My Beauty Salon',
      vision: 'To be the premier beauty destination providing exceptional styling services',
      mission: 'Enhancing natural beauty through professional hair care and beauty treatments',
      targetMarket: 'Women of all ages, men seeking grooming, bridal parties, special occasion clients',
      revenueModel: 'Service fees, product sales, treatment packages, bridal packages, membership plans',
      valueProposition: 'Professional styling with quality products in a relaxing environment',
      keyPartners: 'Product suppliers, beauty schools, wedding planners, fashion designers, equipment suppliers',
      marketingApproach: 'Social media showcasing, referral incentives, loyalty programs, community events',
      operationalNeeds: 'Salon equipment, beauty products, furniture, licenses, trained staff, payment systems',
      growthGoals: 'Add more services, hire additional stylists, expand space, franchise opportunities'
    },
    'auto-repair': {
      businessName: 'My Auto Repair Shop',
      vision: 'To be the most trusted automotive service provider in the region',
      mission: 'Keeping vehicles safe and reliable through expert repair and maintenance services',
      targetMarket: 'Vehicle owners, taxi operators, delivery companies, government fleets, private individuals',
      revenueModel: 'Labor charges, parts markup, maintenance contracts, diagnostic fees, emergency services',
      valueProposition: 'Honest repairs with quality parts, experienced mechanics, and fair pricing',
      keyPartners: 'Parts suppliers, insurance companies, towing services, automotive training centers',
      marketingApproach: 'Referral programs, fleet partnerships, local advertising, online presence',
      operationalNeeds: 'Workshop space, tools and equipment, parts inventory, skilled mechanics, licenses',
      growthGoals: 'Expand services, modernize equipment, hire certified mechanics, multiple locations'
    },
    'boda-boda': {
      businessName: 'My Transport Service',
      vision: 'To provide safe, reliable, and affordable transportation in my area',
      mission: 'Connecting people to opportunities through dependable motorcycle transport',
      targetMarket: 'Daily commuters, students, market vendors, emergency transport needs',
      revenueModel: 'Per-trip charges, daily/weekly customer subscriptions, delivery services',
      valueProposition: 'Fast, reliable transport with good customer service and fair pricing',
      keyPartners: 'Boda boda SACCO, fuel stations, spare parts dealers, mobile money agents',
      marketingApproach: 'Customer referrals, SACCO networks, strategic location positioning, mobile app registration',
      operationalNeeds: 'Motorcycle maintenance, insurance, protective gear, mobile phone, SACCO membership',
      growthGoals: 'Own multiple motorcycles, hire other riders, add cargo services, digital platform integration'
    },
    'freelance-writing': {
      businessName: 'My Content Creation Service',
      vision: 'To be the go-to content creator for businesses seeking quality written content',
      mission: 'Helping businesses communicate effectively through compelling written content',
      targetMarket: 'Small businesses, startups, marketing agencies, bloggers, e-commerce sites',
      revenueModel: 'Per-word rates, project fees, retainer contracts, content packages, consulting fees',
      valueProposition: 'High-quality, engaging content that drives results with quick turnaround',
      keyPartners: 'Marketing agencies, web developers, graphic designers, business consultants',
      marketingApproach: 'Portfolio website, LinkedIn networking, content marketing, client referrals',
      operationalNeeds: 'Computer, internet connection, writing software, portfolio samples, payment system',
      growthGoals: 'Expand service offerings, build client base, increase rates, hire sub-contractors'
    },
    'bakery': {
      businessName: 'My Bakery',
      vision: 'To be the neighborhood\'s favorite bakery known for fresh, delicious baked goods',
      mission: 'Bringing joy to the community through freshly baked breads, cakes, and pastries',
      targetMarket: 'Local residents, offices, schools, restaurants, special event customers',
      revenueModel: 'Daily sales, custom orders, wholesale to retailers, catering services, delivery charges',
      valueProposition: 'Fresh, quality baked goods with traditional and modern varieties',
      keyPartners: 'Ingredient suppliers, equipment vendors, delivery services, event planners, local stores',
      marketingApproach: 'Local advertising, social media, loyalty programs, seasonal promotions',
      operationalNeeds: 'Baking equipment, ingredients, display cases, packaging, skilled bakers, permits',
      growthGoals: 'Expand product line, add café seating, wholesale expansion, additional locations'
    },
    'tutoring': {
      businessName: 'My Tutoring Center',
      vision: 'To be the leading educational support center improving student performance',
      mission: 'Empowering students to achieve academic excellence through personalized tutoring',
      targetMarket: 'Struggling students, exam candidates, homeschool families, adult learners',
      revenueModel: 'Hourly tutoring fees, group class rates, exam prep packages, online session charges',
      valueProposition: 'Personalized learning with experienced tutors and proven results',
      keyPartners: 'Schools, teachers, educational publishers, online platforms, parent associations',
      marketingApproach: 'School partnerships, parent referrals, academic performance testimonials, online presence',
      operationalNeeds: 'Teaching space, educational materials, whiteboards, computers, qualified tutors',
      growthGoals: 'Hire more tutors, expand subjects, online tutoring, franchising opportunities'
    },
    'fitness-training': {
      businessName: 'My Fitness Training Service',
      vision: 'To help people achieve their fitness goals through expert guidance and motivation',
      mission: 'Transforming lives through fitness with personalized training and wellness programs',
      targetMarket: 'Fitness enthusiasts, weight loss seekers, athletes, busy professionals, seniors',
      revenueModel: 'Personal training fees, group class rates, fitness packages, nutrition consulting',
      valueProposition: 'Expert fitness guidance with personalized programs and motivational support',
      keyPartners: 'Gyms, nutritionists, sports medicine doctors, equipment suppliers, wellness centers',
      marketingApproach: 'Transformation showcases, referral programs, social media, health seminars',
      operationalNeeds: 'Training space, fitness equipment, certification, insurance, marketing materials',
      growthGoals: 'Expand client base, add group classes, online programs, fitness facility'
    },
    'daycare': {
      businessName: 'My Daycare Center',
      vision: 'To provide the safest, most nurturing environment for children\'s early development',
      mission: 'Supporting working parents by providing quality childcare with educational activities',
      targetMarket: 'Working parents, single parents, families needing flexible childcare, employers',
      revenueModel: 'Daily care fees, monthly packages, extended hours charges, meal plans, activity fees',
      valueProposition: 'Safe, nurturing childcare with educational programs and flexible scheduling',
      keyPartners: 'Educational suppliers, healthcare providers, nutrition specialists, parent organizations',
      marketingApproach: 'Parent referrals, employer partnerships, community events, online reviews',
      operationalNeeds: 'Child-safe facility, toys and materials, qualified staff, licenses, insurance',
      growthGoals: 'Expand capacity, add educational programs, longer hours, additional locations'
    },
    'social-media': {
      businessName: 'My Social Media Agency',
      vision: 'To be the premier social media management service for growing businesses',
      mission: 'Helping businesses build strong online presence and engage with their customers',
      targetMarket: 'Small businesses, startups, restaurants, retail stores, service providers',
      revenueModel: 'Monthly management fees, content creation charges, advertising management, consulting fees',
      valueProposition: 'Professional social media presence with engaging content and measurable results',
      keyPartners: 'Content creators, graphic designers, photographers, marketing agencies, platform reps',
      marketingApproach: 'Portfolio showcasing, case studies, networking events, digital marketing',
      operationalNeeds: 'Design software, scheduling tools, analytics platforms, content creation equipment',
      growthGoals: 'Expand client base, hire team members, add video services, develop proprietary tools'
    },
    'handmade-crafts': {
      businessName: 'My Handmade Crafts Business',
      vision: 'To preserve traditional craftsmanship while creating beautiful, unique products',
      mission: 'Creating high-quality handmade items that celebrate local culture and artistry',
      targetMarket: 'Gift buyers, tourists, interior decorators, cultural enthusiasts, online shoppers',
      revenueModel: 'Direct sales, custom orders, wholesale to retailers, exhibition sales, online sales',
      valueProposition: 'Unique, authentic handmade products with cultural significance and quality craftsmanship',
      keyPartners: 'Material suppliers, retail stores, tourism boards, craft associations, online marketplaces',
      marketingApproach: 'Craft fairs, online marketplaces, social media, cultural events, tourist centers',
      operationalNeeds: 'Craft materials, tools, workspace, packaging supplies, display materials',
      growthGoals: 'Expand product line, teach workshops, export opportunities, artisan cooperative'
    }
  };

  useEffect(() => {
    console.log('StrategyBuilder - useEffect triggered with template:', template);
    console.log('StrategyBuilder - Template type:', typeof template);
    console.log('StrategyBuilder - Template is null?', template === null);
    console.log('StrategyBuilder - Template has id?', template?.id);
    
    if (template && template.id) {
      console.log('StrategyBuilder - Processing template with id:', template.id);
      const templateContent = templateData[template.id];
      console.log('StrategyBuilder - Found template content:', templateContent);
      
      if (templateContent) {
        console.log('StrategyBuilder - Setting strategy with template content');
        setStrategy(templateContent);
        console.log('StrategyBuilder - Strategy updated successfully');
      } else {
        console.log('StrategyBuilder - No template content found for id:', template.id);
        console.log('StrategyBuilder - Available template ids:', Object.keys(templateData));
      }
    } else if (template === null) {
      console.log('StrategyBuilder - Loading blank form for custom strategy');
      setStrategy({
        businessName: '',
        vision: '',
        mission: '',
        targetMarket: '',
        revenueModel: '',
        valueProposition: '',
        keyPartners: '',
        marketingApproach: '',
        operationalNeeds: '',
        growthGoals: ''
      });
      console.log('StrategyBuilder - Blank strategy loaded');
    } else {
      console.log('StrategyBuilder - Template is undefined or invalid:', template);
    }
  }, [template]);

  const handleInputChange = (field, value) => {
    console.log('StrategyBuilder - Input changed:', field, '=', value);
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('StrategyBuilder - Saving strategy:', strategy);
    localStorage.setItem('current-strategy', JSON.stringify(strategy));
    toast({
      title: t.strategySaved,
      description: t.strategySavedDesc,
    });
  };

  const handleGenerateSummary = () => {
    console.log('StrategyBuilder - Generating summary for strategy:', strategy);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 2000);
  };

  const sections = [
    { key: 'businessName', label: t.businessName, type: 'input' },
    { key: 'vision', label: t.vision, type: 'textarea' },
    { key: 'mission', label: t.mission, type: 'textarea' },
    { key: 'targetMarket', label: t.targetMarket, type: 'textarea' },
    { key: 'revenueModel', label: t.revenueModel, type: 'textarea' },
    { key: 'valueProposition', label: t.valueProposition, type: 'textarea' },
    { key: 'keyPartners', label: t.keyPartners, type: 'textarea' },
    { key: 'marketingApproach', label: t.marketingApproach, type: 'textarea' },
    { key: 'operationalNeeds', label: t.operationalNeeds, type: 'textarea' },
    { key: 'growthGoals', label: t.growthGoals, type: 'textarea' }
  ];

  console.log('StrategyBuilder - About to render with showSummary:', showSummary);
  console.log('StrategyBuilder - Current strategy state:', strategy);

  if (showSummary) {
    console.log('StrategyBuilder - Rendering StrategySummary component');
    return (
      <StrategySummary 
        strategy={strategy}
        onBack={() => setShowSummary(false)}
        onHome={onHome}
        language={currentLanguage}
      />
    );
  }

  console.log('StrategyBuilder - Rendering main form with sections:', sections.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {t.strategyBuilder}
                <span className="text-sm text-gray-500 ml-2" title={t.strategyTooltip}>
                  💡
                </span>
              </h1>
              {template && <p className="text-sm text-gray-600">{template.name} Template</p>}
              {template === null && <p className="text-sm text-gray-600">{t.customStrategy}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CountrySelector 
              currentCountry={currentCountry}
              onCountryChange={setCurrentCountry}
              language={currentLanguage}
            />
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
            <Button variant="outline" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              {t.home}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Strategy Form */}
          <div className="space-y-6">
            {sections.map((section) => {
              console.log('StrategyBuilder - Rendering section:', section.key, 'with value:', strategy[section.key]);
              return (
                <div key={section.key}>
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-gray-800">{section.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {section.type === 'input' ? (
                        <Input
                          value={strategy[section.key]}
                          onChange={(e) => handleInputChange(section.key, e.target.value)}
                          placeholder={`${t.enterPlaceholder} ${section.label.toLowerCase()}`}
                          className="w-full"
                        />
                      ) : (
                        <Textarea
                          value={strategy[section.key]}
                          onChange={(e) => handleInputChange(section.key, e.target.value)}
                          placeholder={`${t.describePlaceholder} ${section.label.toLowerCase()}`}
                          className="w-full min-h-[100px]"
                          rows={4}
                        />
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Coaching Tip for each section */}
                  <CoachingTip 
                    tip={t.coachingTips[section.key]}
                    language={currentLanguage}
                  />
                </div>
              );
            })}
          </div>

          {/* Testing Note */}
          <div className="mt-8 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center">
                {t.testingNote}
              </p>
            </div>
          </div>

          {/* Customer Persona Section */}
          <div className="mt-12">
            <CustomerPersonaSection 
              isPro={true} 
              strategyData={strategy} 
              language={currentLanguage}
            />
          </div>

          {/* Business Milestones Section */}
          <div className="mt-12">
            <BusinessMilestonesSection 
              isPro={true} 
              strategyData={strategy}
              language={currentLanguage}
            />
          </div>

          {/* Monthly Revenue Section */}
          <div className="mt-12">
            <MonthlyRevenueSection 
              isPro={true} 
              strategyData={strategy}
              language={currentLanguage}
              currency={currentCountryInfo.currency}
              currencySymbol={currentCountryInfo.symbol}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGenerateSummary}
              disabled={isGenerating || !strategy.businessName}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.generatingSummary}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {t.generateSummary}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
