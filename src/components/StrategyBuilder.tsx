// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Target, Users, DollarSign, Star, Handshake, Megaphone, Wrench, TrendingUp, Globe, Home, Save, ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';
import CoachingTip from '@/components/CoachingTip';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  existingStrategy?: any;
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
  currencySymbol = 'KSh',
  existingStrategy
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
  const { trackStrategyStage, trackJourney } = useAnalytics();
  const stageStartTime = useRef<number>(Date.now());
  const completedFields = useRef<Set<string>>(new Set());

  // Templates are now loaded from the data file via the template prop

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
    console.log('=== STRATEGY BUILDER USEEFFECT DEBUG ===');
    console.log('Template received:', template);
    console.log('Existing strategy received:', existingStrategy);
    
    // Track strategy building stage start
    trackStrategyStage('strategy_building', 'started', { 
      templateId: template?.id,
      templateName: template?.name 
    });
    trackJourney('/strategy-builder', 'page_view', { 
      templateId: template?.id,
      language 
    });
    
    // First priority: load existing strategy data if editing
    if (existingStrategy && (existingStrategy.businessName || existingStrategy.vision || existingStrategy.mission)) {
      console.log('Loading existing strategy data');
      setStrategy(existingStrategy);
      onStrategyChange?.(existingStrategy);
    }
    // Second priority: load template data if creating new strategy
    else if (template && template.content) {
      console.log('Template has content - loading fields');
      const newStrategy = {
        businessName: template.name || '',
        vision: template.content.vision || '',
        mission: template.content.mission || '',
        targetMarket: template.content.targetMarket || '',
        revenueModel: template.content.revenueModel || '',
        valueProposition: template.content.valueProposition || '',
        keyPartners: template.content.keyPartners || '',
        marketingApproach: template.content.marketingApproach || '',
        operationalNeeds: template.content.operationalNeeds || '',
        growthGoals: template.content.growthGoals || ''
      };
      
      console.log('Setting strategy from template:', newStrategy);
      setStrategy(newStrategy);
      onStrategyChange?.(newStrategy);
      
      // Track template completion
      const filledFields = Object.values(template.content).filter(v => v && typeof v === 'string' && v.trim().length > 0).length;
      console.log('Filled fields count:', filledFields);
      if (filledFields > 0) {
        setTimeout(() => {
          trackStrategyStage('strategy_building', 'completed', {
            timeSpentSeconds: Math.floor((Date.now() - stageStartTime.current) / 1000),
            fieldsCompleted: filledFields,
            totalFields: 10,
            templateId: template.id
          });
        }, 2000);
      }
    } else {
      console.log('No template or template content provided');
    }
  }, [template, existingStrategy, onStrategyChange, trackStrategyStage, trackJourney, language]);

  const handleInputChange = (field: string, value: string) => {
    const newStrategy = { ...strategy, [field]: value };
    setStrategy(newStrategy);
    
    // Auto-save with debounce - trigger onStrategyChange immediately for real-time updates
    onStrategyChange?.(newStrategy);
    
    // Track field completion
    if (value && value.trim().length > 0) {
      completedFields.current.add(field);
    } else {
      completedFields.current.delete(field);
    }
    
    // Track form interaction
    trackJourney('/strategy-builder', 'form_interaction', {
      field,
      hasValue: value && value.trim().length > 0,
      totalCompleted: completedFields.current.size
    });
    
    // Track stage completion when most fields are filled
    if (completedFields.current.size >= 7) { // 70% completion threshold
      trackStrategyStage('strategy_building', 'completed', {
        timeSpentSeconds: Math.floor((Date.now() - stageStartTime.current) / 1000),
        fieldsCompleted: completedFields.current.size,
        totalFields: 10
      });
    }
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
    <div id="strategy-builder" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600">
          {t.subtitle}
        </p>
        {template && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Using template: <strong>{template.name}</strong>
            </span>
          </div>
        )}
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

      </div>
    </div>
  );
};

export default StrategyBuilder;
