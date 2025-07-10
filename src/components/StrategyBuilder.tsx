
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Target, Users, DollarSign, Star, Handshake, Megaphone, Wrench, TrendingUp, Globe, Home, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';
import CoachingTip from '@/components/CoachingTip';

interface StrategyBuilderProps {
  template?: any;
  onStrategyChange?: (strategy: any) => void;
  onShowSummary?: () => void;
  onBack?: () => void;
  onHome?: () => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  country?: string;
  onCountryChange?: (country: string) => void;
  currency?: string;
  currencySymbol?: string;
}

const StrategyBuilder = ({ 
  template, 
  onStrategyChange, 
  onShowSummary, 
  onBack,
  onHome,
  language = 'en',
  onLanguageChange,
  country = 'KE',
  onCountryChange,
  currency = 'KES',
  currencySymbol = 'KSh'
}: StrategyBuilderProps) => {
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

  const { toast } = useToast();

  const templates = {
    'mitumba': {
      en: {
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
      sw: {
        businessName: 'Duka Langu la Mitumba',
        vision: 'Kuwa chanzo cha kuaminika zaidi cha nguo za mitumba za ubora katika jamii yangu',
        mission: 'Kutoa nguo za bei nafuu na za ubora huku nikihimiza uchaguzi wa mtindo endelevu',
        targetMarket: 'Familia zinazojali bei, wataalamu vijana, wanafunzi katika maeneo ya mijini na karibu na mijini',
        revenueModel: 'Mauzo ya moja kwa moja kutoka duka la kimwili na uuzaji wa WhatsApp, mauzo makubwa kwa wauzaji wengine',
        valueProposition: 'Nguo za mitumba za ubora kwa bei nafuu na huduma ya kibinafsi',
        keyPartners: 'Wasambazaji wa mabanda, mashona wa mitaani wa marekebisho, vikundi vya WhatsApp, wanachama wa chama',
        marketingApproach: 'Maneno ya mdomo, biashara ya WhatsApp, matukio ya kijamii ya mtaani, programu za marejeleo',
        operationalNeeds: 'Nafasi ya duka, uhifadhi wa bidhaa, usafiri wa kukusanya mabanda, akaunti ya pesa za simu',
        growthGoals: 'Panua hadi mauzo ya mtandaoni, ongeza kategoria zaidi za bidhaa, anzisha matawi mengi'
      },
      ar: {
        businessName: 'متجر الملابس المستعملة',
        vision: 'أن أكون المصدر الأكثر موثوقية للملابس المستعملة عالية الجودة في مجتمعي',
        mission: 'توفير ملابس عالية الجودة وبأسعار معقولة مع تعزيز خيارات الموضة المستدامة',
        targetMarket: 'العائلات الواعية بالأسعار، المهنيون الشباب، الطلاب في المناطق الحضرية وشبه الحضرية',
        revenueModel: 'المبيعات المباشرة من المتجر الفعلي والتسويق عبر واتساب، المبيعات بالجملة لتجار آخرين',
        valueProposition: 'ملابس مستعملة عالية الجودة بأسعار معقولة مع خدمة شخصية',
        keyPartners: 'موردو البالات، الخياطون المحليون للتعديلات، مجموعات واتساب، أعضاء الجمعيات',
        marketingApproach: 'التسويق الشفهي، أعمال واتساب، الأحداث المجتمعية المحلية، برامج الإحالة',
        operationalNeeds: 'مساحة المتجر، تخزين للمخزون، وسائل نقل لجمع البالات، حساب الأموال المحمولة',
        growthGoals: 'التوسع في المبيعات عبر الإنترنت، إضافة فئات منتجات أكثر، إنشاء منافذ متعددة'
      },
      fr: {
        businessName: 'Mon Magasin de Vêtements d\'Occasion',
        vision: 'Être la source la plus fiable de vêtements d\'occasion de qualité dans ma communauté',
        mission: 'Fournir des vêtements de qualité et abordables tout en promouvant des choix de mode durables',
        targetMarket: 'Familles soucieuses des prix, jeunes professionnels, étudiants dans les zones urbaines et périurbaines',
        revenueModel: 'Ventes directes du magasin physique et marketing WhatsApp, ventes en gros à d\'autres détaillants',
        valueProposition: 'Vêtements d\'occasion de qualité à des prix abordables avec un service personnalisé',
        keyPartners: 'Fournisseurs de balles, tailleurs locaux pour les retouches, groupes WhatsApp, membres de chama',
        marketingApproach: 'Bouche-à-oreille, entreprise WhatsApp, événements communautaires locaux, programmes de parrainage',
        operationalNeeds: 'Espace de magasin, stockage pour l\'inventaire, transport pour la collecte de balles, compte d\'argent mobile',
        growthGoals: 'Étendre aux ventes en ligne, ajouter plus de catégories de produits, établir plusieurs points de vente'
      }
    },
    'agribusiness': {
      en: {
        businessName: 'Green Valley Agribusiness',
        vision: 'To become the leading provider of fresh, organic produce in our region',
        mission: 'Connecting farmers with consumers through sustainable agricultural practices and fair trade',
        targetMarket: 'Health-conscious consumers, restaurants, schools, local markets, organic food enthusiasts',
        revenueModel: 'Direct farm sales, wholesale to retailers, farmers market stalls, subscription boxes',
        valueProposition: 'Fresh, organic produce delivered directly from farm to table with complete traceability',
        keyPartners: 'Local farmers, organic certification bodies, transportation companies, retail stores',
        marketingApproach: 'Social media marketing, farmers markets, partnerships with restaurants, community events',
        operationalNeeds: 'Farmland, irrigation systems, storage facilities, transportation, packaging materials',
        growthGoals: 'Expand cultivation area, add value-added products, establish processing facility'
      },
      sw: {
        businessName: 'Biashara ya Kilimo ya Green Valley',
        vision: 'Kuwa mtoa mkuu wa mazao safi na ya kiasili katika mkoa wetu',
        mission: 'Kuunganisha wakulima na wateja kupitia mbinu endelevu za kilimo na biashara ya haki',
        targetMarket: 'Wateja wanaojali afya, migahawa, shule, masoko ya mitaani, wapenda chakula cha kiasili',
        revenueModel: 'Mauzo ya moja kwa moja kutoka shambani, jumla kwa wauzaji, vibanda vya soko la wakulima',
        valueProposition: 'Mazao safi ya kiasili yanayopelekwa moja kwa moja kutoka shambani hadi mezani',
        keyPartners: 'Wakulima wa mitaani, mashirika ya udhibitisho wa kiasili, makampuni ya usafiri',
        marketingApproach: 'Uuzaji wa mitandao ya kijamii, masoko ya wakulima, ushirikiano na migahawa',
        operationalNeeds: 'Ardhi ya kilimo, mifumo ya umwagiliaji, ghala za uhifadhi, usafiri',
        growthGoals: 'Panua eneo la kilimo, ongeza bidhaa za thamani ya ziada, unda kituo cha uchakataji'
      },
      ar: {
        businessName: 'الأعمال الزراعية للوادي الأخضر',
        vision: 'أن نصبح المزود الرائد للمنتجات الطازجة والعضوية في منطقتنا',
        mission: 'ربط المزارعين بالمستهلكين من خلال الممارسات الزراعية المستدامة والتجارة العادلة',
        targetMarket: 'المستهلكون المهتمون بالصحة، المطاعم، المدارس، الأسواق المحلية، عشاق الطعام العضوي',
        revenueModel: 'مبيعات مباشرة من المزرعة، بيع بالجملة للتجار، أكشاك أسواق المزارعين',
        valueProposition: 'منتجات طازجة وعضوية تُسلم مباشرة من المزرعة إلى المائدة مع إمكانية التتبع الكامل',
        keyPartners: 'المزارعون المحليون، هيئات التصديق العضوي، شركات النقل، المتاجر',
        marketingApproach: 'التسويق عبر وسائل التواصل الاجتماعي، أسواق المزارعين، الشراكات مع المطاعم',
        operationalNeeds: 'أراضي زراعية، أنظمة ري، مرافق تخزين، نقل، مواد تعبئة',
        growthGoals: 'توسيع منطقة الزراعة، إضافة منتجات ذات قيمة مضافة، إنشاء مرفق معالجة'
      },
      fr: {
        businessName: 'Agrobusiness de la Vallée Verte',
        vision: 'Devenir le principal fournisseur de produits frais et biologiques de notre région',
        mission: 'Connecter les agriculteurs aux consommateurs grâce à des pratiques agricoles durables et au commerce équitable',
        targetMarket: 'Consommateurs soucieux de leur santé, restaurants, écoles, marchés locaux, amateurs de produits biologiques',
        revenueModel: 'Ventes directes de la ferme, vente en gros aux détaillants, stands de marchés fermiers',
        valueProposition: 'Produits frais et biologiques livrés directement de la ferme à la table avec traçabilité complète',
        keyPartners: 'Agriculteurs locaux, organismes de certification biologique, entreprises de transport, magasins',
        marketingApproach: 'Marketing sur les réseaux sociaux, marchés fermiers, partenariats avec restaurants',
        operationalNeeds: 'Terres agricoles, systèmes d\'irrigation, installations de stockage, transport',
        growthGoals: 'Étendre la zone de culture, ajouter des produits à valeur ajoutée, établir une installation de traitement'
      }
    },
    'mobile-money': {
      en: {
        businessName: 'QuickCash Mobile Money Services',
        vision: 'To be the most reliable and accessible mobile money service provider in our community',
        mission: 'Providing convenient, secure, and affordable financial services to underserved communities',
        targetMarket: 'Rural communities, small business owners, people without bank accounts, urban workers',
        revenueModel: 'Transaction fees, commission from mobile money operators, value-added services',
        valueProposition: 'Convenient, secure, and fast mobile money transactions with extended operating hours',
        keyPartners: 'Mobile network operators, banks, microfinance institutions, local businesses',
        marketingApproach: 'Community engagement, word-of-mouth, partnerships with local businesses, signage',
        operationalNeeds: 'Shop space, mobile phone, cash float, security measures, reliable internet connection',
        growthGoals: 'Add more service lines, expand to multiple locations, introduce bill payment services'
      },
      sw: {
        businessName: 'Huduma za Pesa za Simu za QuickCash',
        vision: 'Kuwa mtoa huduma wa pesa za simu muaminifu na unaofikiwa zaidi katika jamii yetu',
        mission: 'Kutoa huduma za kifedha zenye urahisi, usalama na bei nafuu kwa jamii zisizotumikiwa',
        targetMarket: 'Jamii za vijijini, wamiliki wa biashara ndogo, watu bila akaunti za benki, wafanyakazi wa mijini',
        revenueModel: 'Ada za muamala, kamisheni kutoka kwa waendeshaji wa pesa za simu, huduma za ziada',
        valueProposition: 'Miamala ya pesa za simu yenye urahisi, usalama na haraka na masaa ya kazi yaliyoongezwa',
        keyPartners: 'Waendeshaji wa mitandao ya simu, mabenki, taasisi za mikopo, biashara za mitaani',
        marketingApproach: 'Ushiriki wa kijamii, maneno ya mdomo, ushirikiano na biashara za mitaani, alama',
        operationalNeeds: 'Nafasi ya duka, simu ya mkononi, fedha za mzunguko, hatua za usalama, muunganisho wa mtandao',
        growthGoals: 'Ongeza mistari mingine ya huduma, panua hadi maeneo mengi, anzisha huduma za malipo ya bili'
      },
      ar: {
        businessName: 'خدمات الأموال المحمولة كويك كاش',
        vision: 'أن نكون مزود خدمات الأموال المحمولة الأكثر موثوقية وإتاحة في مجتمعنا',
        mission: 'توفير خدمات مالية مريحة وآمنة وبأسعار معقولة للمجتمعات المحرومة من الخدمات',
        targetMarket: 'المجتمعات الريفية، أصحاب الأعمال الصغيرة، الأشخاص بدون حسابات مصرفية، العمال الحضريون',
        revenueModel: 'رسوم المعاملات، عمولة من مشغلي الأموال المحمولة، خدمات ذات قيمة مضافة',
        valueProposition: 'معاملات أموال محمولة مريحة وآمنة وسريعة مع ساعات عمل ممتدة',
        keyPartners: 'مشغلو الشبكات المحمولة، البنوك، مؤسسات التمويل الأصغر، الأعمال المحلية',
        marketingApproach: 'المشاركة المجتمعية، التسويق الشفهي، الشراكات مع الأعمال المحلية، اللافتات',
        operationalNeeds: 'مساحة متجر، هاتف محمول، رصيد نقدي، تدابير أمنية، اتصال إنترنت موثوق',
        growthGoals: 'إضافة المزيد من خطوط الخدمة، التوسع إلى مواقع متعددة، تقديم خدمات دفع الفواتير'
      },
      fr: {
        businessName: 'Services d\'Argent Mobile QuickCash',
        vision: 'Être le fournisseur de services d\'argent mobile le plus fiable et accessible de notre communauté',
        mission: 'Fournir des services financiers pratiques, sécurisés et abordables aux communautés mal desservies',
        targetMarket: 'Communautés rurales, propriétaires de petites entreprises, personnes sans comptes bancaires, travailleurs urbains',
        revenueModel: 'Frais de transaction, commission des opérateurs d\'argent mobile, services à valeur ajoutée',
        valueProposition: 'Transactions d\'argent mobile pratiques, sécurisées et rapides avec des heures d\'ouverture étendues',
        keyPartners: 'Opérateurs de réseaux mobiles, banques, institutions de microfinance, entreprises locales',
        marketingApproach: 'Engagement communautaire, bouche-à-oreille, partenariats avec entreprises locales, signalisation',
        operationalNeeds: 'Espace de magasin, téléphone mobile, fonds de roulement, mesures de sécurité, connexion internet fiable',
        growthGoals: 'Ajouter plus de lignes de service, étendre à plusieurs emplacements, introduire des services de paiement de factures'
      }
    }
  };

  const translations = {
    en: {
      title: 'Build Your Business Strategy',
      subtitle: 'Create a comprehensive strategy for your business success',
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
      businessNamePlaceholder: 'Enter your business name...',
      visionPlaceholder: 'What is your long-term vision?',
      missionPlaceholder: 'What is your core purpose?',
      targetMarketPlaceholder: 'Who are your ideal customers?',
      revenueModelPlaceholder: 'How will you make money?',
      valuePropositionPlaceholder: 'What makes you unique?',
      keyPartnersPlaceholder: 'Who will you work with?',
      marketingApproachPlaceholder: 'How will you reach customers?',
      operationalNeedsPlaceholder: 'What do you need to operate?',
      growthGoalsPlaceholder: 'What are your expansion plans?',
      generateSummary: 'Generate AI Summary',
      language: 'Language',
      currency: 'Currency',
      home: 'Home',
      save: 'Save',
      coachingTips: {
        businessName: 'Choose a memorable name that reflects your brand and is easy to pronounce.',
        vision: 'Think big! Your vision should inspire and guide your long-term direction.',
        mission: 'Keep it clear and focused. What problem are you solving for your customers?',
        targetMarket: 'Be specific about your ideal customers. Age, income, location, and needs matter.',
        revenueModel: 'Consider multiple income streams. How will money flow into your business?',
        valueProposition: 'What makes customers choose you over competitors? Be specific and compelling.',
        keyPartners: 'Think about suppliers, distributors, and other businesses that can help you succeed.',
        marketingApproach: 'Focus on channels where your target customers spend their time.',
        operationalNeeds: 'List everything you need to run your business day-to-day.',
        growthGoals: 'Set realistic but ambitious goals for the next 1-3 years.'
      }
    },
    sw: {
      title: 'Jenga Mkakati wa Biashara Yako',
      subtitle: 'Unda mkakati wa kina kwa mafanikio ya biashara yako',
      businessName: 'Jina la Biashara',
      vision: 'Kauli ya Maono',
      mission: 'Kauli ya Dhamira',
      targetMarket: 'Soko Lengwa',
      revenueModel: 'Muundo wa Mapato',
      valueProposition: 'Toa la Kipekee',
      keyPartners: 'Washirika Wakuu',
      marketingApproach: 'Mbinu za Uuzaji',
      operationalNeeds: 'Mahitaji ya Uendeshaji',
      growthGoals: 'Malengo ya Ukuaji',
      businessNamePlaceholder: 'Ingiza jina la biashara yako...',
      visionPlaceholder: 'Maono yako ya muda mrefu ni yapi?',
      missionPlaceholder: 'Kusudi lako kuu ni lipi?',
      targetMarketPlaceholder: 'Wateja wako bora ni akina nani?',
      revenueModelPlaceholder: 'Utapataje pesa?',
      valuePropositionPlaceholder: 'Ni nini kinachokufanya wa kipekee?',
      keyPartnersPlaceholder: 'Utashirikiana na nani?',
      marketingApproachPlaceholder: 'Utawafikaje wateja?',
      operationalNeedsPlaceholder: 'Unahitaji nini kuendesha biashara?',
      growthGoalsPlaceholder: 'Mipango yako ya upanuzi ni ipi?',
      generateSummary: 'Tengeneza Muhtasari wa AI',
      language: 'Lugha',
      currency: 'Sarafu',
      home: 'Nyumbani',
      save: 'Hifadhi',
      coachingTips: {
        businessName: 'Chagua jina linalofikiriwa ambalo linaonyesha chapa yako na ni rahisi kutamka.',
        vision: 'Fikiria kubwa! Maono yako yanapaswa kuhamasisha na kuongoza mwelekeo wako wa muda mrefu.',
        mission: 'Iweke wazi na iwe na lengo. Ni tatizo gani unalihali kwa wateja wako?',
        targetMarket: 'Kuwa mahususi kuhusu wateja wako bora. Umri, mapato, mahali, na mahitaji ni muhimu.',
        revenueModel: 'Fikiria njia nyingi za kupata mapato. Pesa zitaingiaje katika biashara yako?',
        valueProposition: 'Ni nini kinachofanya wateja wakuchague badala ya washindani? Kuwa mahususi na mvutio.',
        keyPartners: 'Fikiria kuhusu wasambazaji, wasambazaji, na biashara zingine zinazoweza kukusaidia kufanikiwa.',
        marketingApproach: 'Zingatia njia ambapo wateja wako walengwa wanaotumia muda wao.',
        operationalNeeds: 'Orodhesha kila kitu unachohitaji kuendesha biashara yako kila siku.',
        growthGoals: 'Weka malengo ya uhalali lakini ya matumaini kwa miaka 1-3 ijayo.'
      }
    },
    ar: {
      title: 'بناء استراتيجية عملك',
      subtitle: 'إنشاء استراتيجية شاملة لنجاح عملك',
      businessName: 'اسم العمل',
      vision: 'بيان الرؤية',
      mission: 'بيان المهمة',
      targetMarket: 'السوق المستهدف',
      revenueModel: 'نموذج الإيرادات',
      valueProposition: 'اقتراح القيمة الفريدة',
      keyPartners: 'الشركاء الرئيسيون',
      marketingApproach: 'نهج التسويق',
      operationalNeeds: 'الاحتياجات التشغيلية',
      growthGoals: 'أهداف النمو',
      businessNamePlaceholder: 'أدخل اسم عملك...',
      visionPlaceholder: 'ما هي رؤيتك طويلة المدى؟',
      missionPlaceholder: 'ما هو هدفك الأساسي؟',
      targetMarketPlaceholder: 'من هم عملاؤك المثاليون؟',
      revenueModelPlaceholder: 'كيف ستحقق المال؟',
      valuePropositionPlaceholder: 'ما الذي يجعلك فريداً؟',
      keyPartnersPlaceholder: 'مع من ستعمل؟',
      marketingApproachPlaceholder: 'كيف ستصل إلى العملاء؟',
      operationalNeedsPlaceholder: 'ما الذي تحتاجه للعمل؟',
      growthGoalsPlaceholder: 'ما هي خطط التوسع؟',
      generateSummary: 'إنشاء ملخص بالذكاء الاصطناعي',
      language: 'اللغة',
      currency: 'العملة',
      home: 'الرئيسية',
      save: 'حفظ',
      coachingTips: {
        businessName: 'اختر اسماً لا يُنسى يعكس علامتك التجارية وسهل النطق.',
        vision: 'فكر بشكل كبير! يجب أن تلهم رؤيتك وتوجه اتجاهك طويل المدى.',
        mission: 'اجعلها واضحة ومركزة. ما المشكلة التي تحلها لعملائك؟',
        targetMarket: 'كن محدداً حول عملائك المثاليين. العمر والدخل والموقع والاحتياجات مهمة.',
        revenueModel: 'فكر في تدفقات دخل متعددة. كيف ستتدفق الأموال إلى عملك؟',
        valueProposition: 'ما الذي يجعل العملاء يختارونك على المنافسين؟ كن محدداً ومقنعاً.',
        keyPartners: 'فكر في الموردين والموزعين والشركات الأخرى التي يمكنها مساعدتك على النجاح.',
        marketingApproach: 'ركز على القنوات حيث يقضي عملاؤك المستهدفون وقتهم.',
        operationalNeeds: 'اسرد كل ما تحتاجه لتشغيل عملك يومياً.',
        growthGoals: 'ضع أهدافاً واقعية ولكن طموحة للسنوات 1-3 القادمة.'
      }
    },
    fr: {
      title: 'Construire Votre Stratégie d\'Entreprise',
      subtitle: 'Créer une stratégie complète pour le succès de votre entreprise',
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
      businessNamePlaceholder: 'Entrez le nom de votre entreprise...',
      visionPlaceholder: 'Quelle est votre vision à long terme?',
      missionPlaceholder: 'Quel est votre objectif principal?',
      targetMarketPlaceholder: 'Qui sont vos clients idéaux?',
      revenueModelPlaceholder: 'Comment allez-vous gagner de l\'argent?',
      valuePropositionPlaceholder: 'Qu\'est-ce qui vous rend unique?',
      keyPartnersPlaceholder: 'Avec qui allez-vous travailler?',
      marketingApproachPlaceholder: 'Comment allez-vous atteindre les clients?',
      operationalNeedsPlaceholder: 'De quoi avez-vous besoin pour fonctionner?',
      growthGoalsPlaceholder: 'Quels sont vos plans d\'expansion?',
      generateSummary: 'Générer un Résumé IA',
      language: 'Langue',
      currency: 'Devise',
      home: 'Accueil',
      save: 'Sauvegarder',
      coachingTips: {
        businessName: 'Choisissez un nom mémorable qui reflète votre marque et est facile à prononcer.',
        vision: 'Pensez grand! Votre vision devrait inspirer et guider votre direction à long terme.',
        mission: 'Gardez-la claire et ciblée. Quel problème résolvez-vous pour vos clients?',
        targetMarket: 'Soyez spécifique sur vos clients idéaux. L\'âge, le revenu, l\'emplacement et les besoins comptent.',
        revenueModel: 'Considérez plusieurs flux de revenus. Comment l\'argent affluera-t-il dans votre entreprise?',
        valueProposition: 'Qu\'est-ce qui fait que les clients vous choisissent plutôt que les concurrents? Soyez spécifique et convaincant.',
        keyPartners: 'Pensez aux fournisseurs, distributeurs et autres entreprises qui peuvent vous aider à réussir.',
        marketingApproach: 'Concentrez-vous sur les canaux où vos clients cibles passent leur temps.',
        operationalNeeds: 'Listez tout ce dont vous avez besoin pour gérer votre entreprise au quotidien.',
        growthGoals: 'Fixez des objectifs réalistes mais ambitieux pour les 1-3 prochaines années.'
      }
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    console.log('StrategyBuilder - useEffect triggered with template:', template);
    console.log('StrategyBuilder - Template type:', typeof template);
    console.log('StrategyBuilder - Template is null?', template === null);
    console.log('StrategyBuilder - Template has id?', template?.id);
    
    if (template && template.id) {
      console.log('StrategyBuilder - Processing template with id:', template.id);
      const templateContent = templates[template.id]?.[language] || templates[template.id]?.en;
      
      if (templateContent) {
        console.log('StrategyBuilder - Found template content:', templateContent);
        console.log('StrategyBuilder - Setting strategy with template content');
        setStrategy(templateContent);
        console.log('StrategyBuilder - Strategy updated successfully');
      } else {
        console.log('StrategyBuilder - Template content not found for:', template.id, 'language:', language);
      }
    }
  }, [template, language]);

  const handleInputChange = (field: string, value: string) => {
    const newStrategy = { ...strategy, [field]: value };
    setStrategy(newStrategy);
    onStrategyChange?.(newStrategy);
  };

  const handleSave = () => {
    toast({
      title: "Strategy Saved",
      description: "Your business strategy has been saved successfully!",
    });
  };

  const sections = [
    {
      id: 'businessName',
      title: t.businessName,
      icon: Star,
      placeholder: t.businessNamePlaceholder,
      tip: t.coachingTips.businessName,
      type: 'input'
    },
    {
      id: 'vision',
      title: t.vision,
      icon: Lightbulb,
      placeholder: t.visionPlaceholder,
      tip: t.coachingTips.vision,
      type: 'textarea'
    },
    {
      id: 'mission',
      title: t.mission,
      icon: Target,
      placeholder: t.missionPlaceholder,
      tip: t.coachingTips.mission,
      type: 'textarea'
    },
    {
      id: 'targetMarket',
      title: t.targetMarket,
      icon: Users,
      placeholder: t.targetMarketPlaceholder,
      tip: t.coachingTips.targetMarket,
      type: 'textarea'
    },
    {
      id: 'revenueModel',
      title: t.revenueModel,
      icon: DollarSign,
      placeholder: t.revenueModelPlaceholder,
      tip: t.coachingTips.revenueModel,
      type: 'textarea'
    },
    {
      id: 'valueProposition',
      title: t.valueProposition,
      icon: Star,
      placeholder: t.valuePropositionPlaceholder,
      tip: t.coachingTips.valueProposition,
      type: 'textarea'
    },
    {
      id: 'keyPartners',
      title: t.keyPartners,
      icon: Handshake,
      placeholder: t.keyPartnersPlaceholder,
      tip: t.coachingTips.keyPartners,
      type: 'textarea'
    },
    {
      id: 'marketingApproach',
      title: t.marketingApproach,
      icon: Megaphone,
      placeholder: t.marketingApproachPlaceholder,
      tip: t.coachingTips.marketingApproach,
      type: 'textarea'
    },
    {
      id: 'operationalNeeds',
      title: t.operationalNeeds,
      icon: Wrench,
      placeholder: t.operationalNeedsPlaceholder,
      tip: t.coachingTips.operationalNeeds,
      type: 'textarea'
    },
    {
      id: 'growthGoals',
      title: t.growthGoals,
      icon: TrendingUp,
      placeholder: t.growthGoalsPlaceholder,
      tip: t.coachingTips.growthGoals,
      type: 'textarea'
    }
  ];

  console.log('StrategyBuilder - Component rendering with template:', template);
  console.log('StrategyBuilder - Current strategy state:', strategy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            </div>
            
            {/* Utility Buttons - Mobile Stacked, Desktop Horizontal */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={onLanguageChange || (() => {})} 
              />
              
              <CountrySelector
                currentCountry={country}
                onCountryChange={onCountryChange || (() => {})}
              />
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-start w-full sm:w-auto"
                onClick={onHome || (() => window.location.href = '/')}
              >
                <Home className="w-4 h-4 mr-2" />
                <span>{t.home}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-start w-full sm:w-auto"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                <span>{t.save}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            console.log('StrategyBuilder - Rendering section:', section.id, 'with value:', strategy[section.id]);
            
            return (
              <Card key={section.id} className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Icon className="w-5 h-5 mr-2" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CoachingTip tip={section.tip} language={language} />
                  
                  {section.type === 'input' ? (
                    <Input
                      value={strategy[section.id] || ''}
                      onChange={(e) => handleInputChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      className="w-full"
                    />
                  ) : (
                    <Textarea
                      value={strategy[section.id] || ''}
                      onChange={(e) => handleInputChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={3}
                      className="w-full resize-none"
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Generate Summary Button */}
          <div className="text-center pt-8">
            <Button
              onClick={onShowSummary}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              {t.generateSummary}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
