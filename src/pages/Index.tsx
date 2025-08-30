import { useState, useEffect } from 'react';
import TemplateDropdownSelector from '@/components/TemplateDropdownSelector';
import StrategyBuilder from '@/components/StrategyBuilder';
import MonthlyRevenueSection from '@/components/MonthlyRevenueSection';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import LanguageSelector from '@/components/LanguageSelector';
import ShareModal from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Globe, Home, Save, Download, Bot, ArrowLeft, Target, Calendar, LogOut, BarChart3 } from 'lucide-react';
import { TemplateData } from '@/data/templateData';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { FinancialInsightsDashboard } from '@/components/analytics/FinancialInsightsDashboard';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { trackPageView, trackAction, getGeographicInfo } = useAnalytics();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('KE');
  const [strategyData, setStrategyData] = useState(null);
  const [showStrategySummary, setShowStrategySummary] = useState(false);
  const [showMilestonesSummary, setShowMilestonesSummary] = useState(false);
  const { toast } = useToast();

  // Show auth dialog if user is not authenticated and track page views
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, loading]);

  // Track page views when view changes
  useEffect(() => {
    const trackPage = async () => {
      if (user) {
        const geo = await getGeographicInfo();
        trackPageView(currentView, geo);
      }
    };
    trackPage();
  }, [currentView, user]);

  // Don't allow dialog to be closed if user is not authenticated
  const handleAuthDialogChange = (open: boolean) => {
    if (user) {
      setShowAuthDialog(open);
    }
    // If no user, keep dialog open
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAuthDialog(true);
    setCurrentView('home');
  };

  const currencyMap = {
    'KE': { currency: 'KES', symbol: 'KSh' },
    'TZ': { currency: 'TZS', symbol: 'TSh' },
    'UG': { currency: 'UGX', symbol: 'USh' },
    'RW': { currency: 'RWF', symbol: 'RWF' },
    'ET': { currency: 'ETB', symbol: 'Br' },
    'GH': { currency: 'GHS', symbol: '₵' },
    'NG': { currency: 'NGN', symbol: '₦' },
    'ZA': { currency: 'ZAR', symbol: 'R' },
    'EG': { currency: 'EGP', symbol: 'E£' },
    'MA': { currency: 'MAD', symbol: 'DH' },
    'US': { currency: 'USD', symbol: '$' },
    'GB': { currency: 'GBP', symbol: '£' },
    'FR': { currency: 'EUR', symbol: '€' },
    'DE': { currency: 'EUR', symbol: '€' }
  };

  const { currency, symbol: currencySymbol } = currencyMap[country] || currencyMap['KE'];

  const translations = {
    en: {
      title: 'Jenga Biz Africa',
      subtitle: 'Build Your Business Strategy for the African Market',
      startFromScratch: 'Start from Scratch',
      useTemplates: 'Use Templates',
      language: 'Language',
      home: 'Home',
      save: 'Save',
      aiSummary: 'AI Summary',
      downloadSummary: 'Download Summary',
      share: 'Share',
      back: 'Back',
      businessStrategySummary: 'Business Strategy Summary',
      businessMilestonesSummary: 'Business Milestones Summary',
      shareMilestones: 'Share Milestones',
      trackMilestones: 'Track Milestones',
      trackFinances: 'Track Finances',
      businessTemplates: 'Business Templates',
      businessTemplatesDesc: 'Choose from 15+ pre-built templates specifically designed for popular African businesses and market needs',
      customStrategy: 'Custom Strategy',
      customStrategyDesc: 'Build a completely custom business strategy from scratch with all features included - perfect for unique business models',
      milestoneTracking: 'Milestone Tracking',
      milestoneTrackingDesc: 'Set and track business milestones based on your current stage and growth goals with deadlines',
      financialTracking: 'Financial Tracking',
      financialTrackingDesc: 'Monitor daily revenue and expenses with calendar-based entries and generate financial reports',
      milestoneOverview: 'Overview of your business milestone progress and insights',
      businessStage: 'Business Stage',
      growthStage: 'Growth Stage',
      currentMilestones: 'Current Milestones',
      registerBusinessName: 'Register business name',
      openBankAccount: 'Open business bank account',
      launchMVP: 'Launch minimum viable product',
      complete: 'Complete',
      inProgress: 'In Progress',
      notStarted: 'Not Started',
      progressSummaryLabel: 'Progress Summary:',
      getProgressSummary: (milestones: any[]) => {
        const completed = milestones.filter(m => m.status === 'complete').length;
        const inProgress = milestones.filter(m => m.status === 'in-progress').length;
        const notStarted = milestones.filter(m => m.status === 'not-started').length;
        
        if (completed === 0 && inProgress === 0) {
          return `Great start! You have ${milestones.length} milestone${milestones.length > 1 ? 's' : ''} ready to begin. Set target dates and start working on your first milestone to build momentum.`;
        } else if (completed > 0) {
          return `Excellent progress! ${completed} milestone${completed > 1 ? 's' : ''} completed, ${inProgress} in progress, ${notStarted} not started. Keep the momentum going!`;
        } else {
          return `You're on track! ${inProgress} milestone${inProgress > 1 ? 's' : ''} in progress, ${notStarted} ready to start. Focus on completing your current tasks.`;
        }
      },
      generatedWith: 'Generated with Jenga Biz Africa ✨',
      aiGeneratedSummary: 'AI-generated summary of your business strategy',
      visionLabel: 'Vision',
      missionLabel: 'Mission',
      targetMarketLabel: 'Target Market',
      revenueModelLabel: 'Revenue Model',
      valuePropositionLabel: 'Value Proposition',
      notDefined: 'Not defined'
    },
    sw: {
      title: 'Jenga Biz Africa',
      subtitle: 'Jenga Mkakati wa Biashara Yako kwa Soko la Afrika',
      startFromScratch: 'Anza kutoka Mwanzo',
      useTemplates: 'Tumia Violezo',
      language: 'Lugha',
      home: 'Nyumbani',
      save: 'Hifadhi',
      aiSummary: 'Muhtasari wa AI',
      downloadSummary: 'Pakua Muhtasari',
      share: 'Shiriki',
      back: 'Rudi',
      businessStrategySummary: 'Muhtasari wa Mkakati wa Biashara',
      businessMilestonesSummary: 'Muhtasari wa Malengo ya Biashara',
      shareMilestones: 'Shiriki Malengo',
      trackMilestones: 'Fuatilia Malengo',
      trackFinances: 'Fuatilia Fedha',
      businessTemplates: 'Violezo vya Biashara',
      businessTemplatesDesc: 'Chagua kutoka violezo zaidi ya 15 vilivyoundwa maalum kwa biashara maarufu za Kiafrika na mahitaji ya soko',
      customStrategy: 'Mkakati wa Kibinafsi',
      customStrategyDesc: 'Jenga mkakati wa biashara wa kibinafsi kutoka mwanzo ukijumuisha vipengele vyote - kamili kwa miundo ya kibiashara ya kipekee',
      milestoneTracking: 'Ufuatiliaji wa Malengo',
      milestoneTrackingDesc: 'Weka na fuatilia malengo ya biashara kulingana na hatua yako ya sasa na malengo ya ukuaji pamoja na tarehe za mwisho',
      financialTracking: 'Ufuatiliaji wa Kifedha',
      financialTrackingDesc: 'Fuatilia mapato na matumizi ya kila siku pamoja na maingizo ya kalenda na kutengeneza ripoti za kifedha',
      milestoneOverview: 'Muhtasari wa maendeleo ya malengo ya biashara yako na maarifa',
      businessStage: 'Hatua ya Biashara',
      growthStage: 'Hatua ya Ukuaji',
      currentMilestones: 'Malengo ya Sasa',
      registerBusinessName: 'Sajili jina la biashara',
      openBankAccount: 'Fungua akaunti ya benki ya biashara',
      launchMVP: 'Zindua bidhaa ya kimsingi',
      complete: 'Imekamilika',
      inProgress: 'Inaendelea',
      notStarted: 'Haijuaanza',
      progressSummaryLabel: 'Muhtasari wa Maendeleo:',
      getProgressSummary: (milestones: any[]) => {
        const completed = milestones.filter(m => m.status === 'complete').length;
        const inProgress = milestones.filter(m => m.status === 'in-progress').length;
        const notStarted = milestones.filter(m => m.status === 'not-started').length;
        
        if (completed === 0 && inProgress === 0) {
          return `Mwanzo mzuri! Una malengo ${milestones.length} tayari kuanza. Weka tarehe za lengo na uanze kufanya kazi kwenye lengo lako la kwanza ili kujenga msukumo.`;
        } else if (completed > 0) {
          return `Maendeleo bora! Malengo ${completed} yamekamilika, ${inProgress} yanaendelea, ${notStarted} hayajaanza. Endelea na msukumo!`;
        } else {
          return `Uko njiani! Malengo ${inProgress} yanaendelea, ${notStarted} tayari kuanza. Lenga kukamilisha kazi zako za sasa.`;
        }
      },
      generatedWith: 'Imetengenezwa na Jenga Biz Africa ✨',
      aiGeneratedSummary: 'Muhtasari wa mkakati wa biashara yako uliotengenezwa na AI',
      visionLabel: 'Maono',
      missionLabel: 'Dhamira',
      targetMarketLabel: 'Soko Lengwa',
      revenueModelLabel: 'Mfumo wa Mapato',
      valuePropositionLabel: 'Pendekezo la Thamani',
      notDefined: 'Haijafafanuliwa'
    },
    ar: {
      title: 'جينجا بيز أفريقيا',
      subtitle: 'اصنع استراتيجية عملك للسوق الأفريقي',
      startFromScratch: 'ابدأ من الصفر',
      useTemplates: 'استخدم القوالب',
      language: 'اللغة',
      home: 'الرئيسية',
      save: 'حفظ',
      aiSummary: 'ملخص الذكاء الاصطناعي',
      downloadSummary: 'تحميل الملخص',
      share: 'مشاركة',
      back: 'رجوع',
      businessStrategySummary: 'ملخص استراتيجية الأعمال',
      businessMilestonesSummary: 'ملخص معالم الأعمال',
      shareMilestones: 'مشاركة المعالم',
      trackMilestones: 'تتبع المعالم',
      trackFinances: 'تتبع الماليات',
      businessTemplates: 'قوالب الأعمال',
      businessTemplatesDesc: 'اختر من أكثر من 15 قالبًا مُصممًا خصيصًا للأعمال الأفريقية الشائعة واحتياجات السوق',
      customStrategy: 'استراتيجية مخصصة',
      customStrategyDesc: 'ابنِ استراتيجية أعمال مخصصة تمامًا من البداية مع جميع الميزات المدرجة - مثالية للنماذج التجارية الفريدة',
      milestoneTracking: 'تتبع المعالم',
      milestoneTrackingDesc: 'حدد وتتبع معالم الأعمال بناءً على مرحلتك الحالية وأهداف النمو مع المواعيد النهائية',
      financialTracking: 'التتبع المالي',
      financialTrackingDesc: 'راقب الإيرادات والمصروفات اليومية مع إدخالات التقويم وإنتاج التقارير المالية',
      milestoneOverview: 'نظرة عامة على تقدم معالم أعمالك ورؤى',
      businessStage: 'مرحلة الأعمال',
      growthStage: 'مرحلة النمو',
      currentMilestones: 'المعالم الحالية',
      registerBusinessName: 'تسجيل اسم الشركة',
      openBankAccount: 'فتح حساب مصرفي تجاري',
      launchMVP: 'إطلاق المنتج الأساسي',
      complete: 'مكتمل',
      inProgress: 'قيد التنفيذ',
      notStarted: 'لم تبدأ',
      progressSummaryLabel: 'ملخص التقدم:',
      getProgressSummary: (milestones: any[]) => {
        const completed = milestones.filter(m => m.status === 'complete').length;
        const inProgress = milestones.filter(m => m.status === 'in-progress').length;
        const notStarted = milestones.filter(m => m.status === 'not-started').length;
        
        if (completed === 0 && inProgress === 0) {
          return `بداية رائعة! لديك ${milestones.length} معلم جاهز للبدء. حدد التواريخ المستهدفة وابدأ العمل على معلمك الأول لبناء الزخم.`;
        } else if (completed > 0) {
          return `تقدم ممتاز! ${completed} معلم مكتمل، ${inProgress} قيد التنفيذ، ${notStarted} لم تبدأ. استمر في الزخم!`;
        } else {
          return `أنت على الطريق الصحيح! ${inProgress} معلم قيد التنفيذ، ${notStarted} جاهز للبدء. ركز على إكمال مهامك الحالية.`;
        }
      },
      generatedWith: 'تم إنشاؤه بواسطة Jenga Biz Africa ✨',
      aiGeneratedSummary: 'ملخص استراتيجية عملك المُولد بالذكاء الاصطناعي',
      visionLabel: 'الرؤية',
      missionLabel: 'المهمة',
      targetMarketLabel: 'السوق المستهدف',
      revenueModelLabel: 'نموذج الإيرادات',
      valuePropositionLabel: 'عرض القيمة',
      notDefined: 'غير محدد'
    },
    fr: {
      title: 'Jenga Biz Africa',
      subtitle: 'Construisez votre stratégie d\'entreprise pour le marché africain',
      startFromScratch: 'Commencer de Zéro',
      useTemplates: 'Utiliser des Modèles',
      language: 'Langue',
      home: 'Accueil',
      save: 'Sauvegarder',
      aiSummary: 'Résumé IA',
      downloadSummary: 'Télécharger Résumé',
      share: 'Partager',
      back: 'Retour',
      businessStrategySummary: 'Résumé de la Stratégie d\'Entreprise',
      businessMilestonesSummary: 'Résumé des Jalons d\'Entreprise',
      shareMilestones: 'Partager les Jalons',
      trackMilestones: 'Suivre les Jalons',
      trackFinances: 'Suivre les Finances',
      businessTemplates: 'Modèles d\'Entreprise',
      businessTemplatesDesc: 'Choisissez parmi plus de 15 modèles pré-construits spécialement conçus pour les entreprises africaines populaires et les besoins du marché',
      customStrategy: 'Stratégie Personnalisée',
      customStrategyDesc: 'Construisez une stratégie d\'entreprise entièrement personnalisée à partir de zéro avec toutes les fonctionnalités incluses - parfait pour les modèles d\'entreprise uniques',
      milestoneTracking: 'Suivi des Jalons',
      milestoneTrackingDesc: 'Définissez et suivez les jalons commerciaux en fonction de votre étape actuelle et de vos objectifs de croissance avec des échéances',
      financialTracking: 'Suivi Financier',
      financialTrackingDesc: 'Surveillez les revenus et dépenses quotidiens avec des entrées de calendrier et générez des rapports financiers',
      milestoneOverview: 'Aperçu de vos progrès de jalons d\'entreprise et insights',
      businessStage: 'Étape d\'Affaires',
      growthStage: 'Étape de Croissance',
      currentMilestones: 'Jalons Actuels',
      registerBusinessName: 'Enregistrer le nom de l\'entreprise',
      openBankAccount: 'Ouvrir un compte bancaire professionnel',
      launchMVP: 'Lancer le produit minimal viable',
      complete: 'Terminé',
      inProgress: 'En Cours',
      notStarted: 'Pas Commencé',
      progressSummaryLabel: 'Résumé des Progrès:',
      getProgressSummary: (milestones: any[]) => {
        const completed = milestones.filter(m => m.status === 'complete').length;
        const inProgress = milestones.filter(m => m.status === 'in-progress').length;
        const notStarted = milestones.filter(m => m.status === 'not-started').length;
        
        if (completed === 0 && inProgress === 0) {
          return `Excellent début! Vous avez ${milestones.length} jalon${milestones.length > 1 ? 's' : ''} prêt${milestones.length > 1 ? 's' : ''} à commencer. Définissez des dates cibles et commencez à travailler sur votre premier jalon pour créer de l'élan.`;
        } else if (completed > 0) {
          return `Excellent progrès! ${completed} jalon${completed > 1 ? 's' : ''} terminé${completed > 1 ? 's' : ''}, ${inProgress} en cours, ${notStarted} pas commencé${notStarted > 1 ? 's' : ''}. Continuez sur votre lancée!`;
        } else {
          return `Vous êtes sur la bonne voie! ${inProgress} jalon${inProgress > 1 ? 's' : ''} en cours, ${notStarted} prêt${notStarted > 1 ? 's' : ''} à commencer. Concentrez-vous sur l'achèvement de vos tâches actuelles.`;
        }
      },
      generatedWith: 'Généré avec Jenga Biz Africa ✨',
      aiGeneratedSummary: 'Résumé généré par IA de votre stratégie commerciale',
      visionLabel: 'Vision',
      missionLabel: 'Mission',
      targetMarketLabel: 'Marché Cible',
      revenueModelLabel: 'Modèle de Revenus',
      valuePropositionLabel: 'Proposition de Valeur',
      notDefined: 'Non défini'
    }
  };

  const t = translations[language] || translations.en;

  const handleTemplateSelect = async (template: TemplateData) => {
    setSelectedTemplate(template);
    setCurrentView('builder');
    const geo = await getGeographicInfo();
    trackAction('select_template', { templateName: template.name }, geo);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setCurrentView('builder');
  };

  const scrollToSection = (sectionId: string) => {
    // First navigate to builder view, then scroll
    setSelectedTemplate(null);
    setCurrentView('builder');
    // Use setTimeout to ensure the component is rendered before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleStrategyChange = (strategy) => {
    setStrategyData(strategy);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedTemplate(null);
  };

  const handleBackToTemplates = () => {
    setCurrentView('templates');
  };

  const handleSave = async () => {
    if (strategyData) {
      localStorage.setItem('jenga-biz-strategy', JSON.stringify(strategyData));
      const geo = await getGeographicInfo();
      trackAction('save_strategy', { strategyName: strategyData.businessName }, geo);
      toast({
        title: "Success!",
        description: "Strategy saved successfully!",
      });
    } else {
      toast({
        title: "No Data",
        description: "No strategy data to save",
        variant: "destructive",
      });
    }
  };

  const generateAISummary = async () => {
    if (!strategyData || !strategyData.businessName) {
      toast({
        title: "Incomplete Strategy",
        description: "Please complete your strategy first",
        variant: "destructive",
      });
      return;
    }
    const geo = await getGeographicInfo();
    trackAction('generate_ai_summary', { strategyName: strategyData.businessName }, geo);
    setShowStrategySummary(true);
  };

  const downloadSummary = () => {
    if (!strategyData || !strategyData.businessName) {
      toast({
        title: "Incomplete Strategy", 
        description: "Please complete your strategy first",
        variant: "destructive",
      });
      return;
    }
    
    const createdWithText = language === 'sw' ? 'Imeundwa na Jenga Biz Africa' :
                           language === 'ar' ? 'تم إنشاؤه بواسطة Jenga Biz Africa' :
                           language === 'fr' ? 'Créé avec Jenga Biz Africa' :
                           'Created with Jenga Biz Africa';
    
    const summary = `${createdWithText} - ${t.businessStrategySummary}
    
Business Name: ${strategyData.businessName || 'Your Business'}
Vision: ${strategyData.vision || t.notDefined}
Mission: ${strategyData.mission || t.notDefined}
Target Market: ${strategyData.targetMarket || t.notDefined}
Revenue Model: ${strategyData.revenueModel || t.notDefined}
Value Proposition: ${strategyData.valueProposition || t.notDefined}
Key Partners: ${strategyData.keyPartners || t.notDefined}
Marketing Approach: ${strategyData.marketingApproach || t.notDefined}
Operational Needs: ${strategyData.operationalNeeds || t.notDefined}
Growth Goals: ${strategyData.growthGoals || t.notDefined}

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jenga-biz-strategy-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateMilestonesSummary = () => {
    setShowMilestonesSummary(true);
  };

  const downloadMilestonesSummary = () => {
    const createdWithText = language === 'sw' ? 'Imeundwa na Jenga Biz Africa' :
                           language === 'ar' ? 'تم إنشاؤه بواسطة Jenga Biz Africa' :
                           language === 'fr' ? 'Créé avec Jenga Biz Africa' :
                           'Created with Jenga Biz Africa';
    
    // Note: Currently no milestone data is available from the BusinessMilestonesSection component
    // This would ideally be passed as props from the parent component containing actual milestone data
    
    const summary = `${createdWithText} - ${t.businessMilestonesSummary}
    
Business Stage: Growth Stage
    
Current Status: Start by adding milestones to track your business progress

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jenga-biz-milestones-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Template Selector View
  if (currentView === 'templates') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 space-y-3">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setCurrentView('home')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>{t.back}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleBackToHome}
                >
                  <Home className="w-4 h-4 mr-2" />
                  <span>{t.home}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{t.save}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TemplateDropdownSelector
            onTemplateSelect={handleTemplateSelect}
            onBack={() => setCurrentView('home')}
            language={language}
          />
        </div>
      </div>
    );
  }

      // Strategy Builder View (Single Page)
  if (currentView === 'builder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Clean Top Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 space-y-3">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => selectedTemplate ? handleBackToTemplates() : handleBackToHome()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>{t.back}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleBackToHome}
                >
                  <Home className="w-4 h-4 mr-2" />
                  <span>{t.home}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{t.save}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <div>
            <StrategyBuilder
              template={selectedTemplate}
              onStrategyChange={handleStrategyChange}
              language={language}
              onLanguageChange={setLanguage}
              country={country}
              onCountryChange={setCountry}
              currency={currency}
              currencySymbol={currencySymbol}
            />
          </div>
          
          {/* Business Strategy Summary Section - moved here after Strategy Builder */}
          <div className="bg-white p-6 rounded-lg border border-blue-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              {t.businessStrategySummary}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={generateAISummary}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Bot className="w-4 h-4 mr-2" />
                {t.aiSummary}
              </Button>
              
              <Button
                onClick={downloadSummary}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.downloadSummary}
              </Button>
              
              <ShareModal strategy={strategyData || {}} language={language} />
            </div>
          </div>
          
          <div>
            <BusinessMilestonesSection
              strategyData={strategyData}
              language={language}
              onMilestonesChange={(milestones) => {
                setStrategyData(prev => ({ ...prev, businessMilestones: milestones }));
              }}
            />
          </div>
          
          {/* Business Milestones Summary Card */}
          <Card className="border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                {t.businessMilestonesSummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={generateMilestonesSummary}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  {t.aiSummary}
                </Button>
                
                <Button
                  onClick={downloadMilestonesSummary}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadSummary}
                </Button>
                
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t.shareMilestones}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div id="financial-section">
            <MonthlyRevenueSection
              strategyData={strategyData}
              language={language}
              currency={currency}
              currencySymbol={currencySymbol}
              country={country}
              onCountryChange={setCountry}
            />
          </div>
          
          {/* Phase 4 Financial Insights */}
          <div>
            <FinancialInsightsDashboard 
              currency={currency}
              currencySymbol={currencySymbol}
            />
          </div>

          {/* Strategy Summary Modal */}
          <Dialog open={showStrategySummary} onOpenChange={setShowStrategySummary}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-blue-600" />
                  {t.businessStrategySummary}
                </DialogTitle>
              <DialogDescription>
                {t.aiGeneratedSummary}
              </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">📈 {strategyData?.businessName || 'Your Business'}</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🎯 {t.visionLabel}:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.vision || t.notDefined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚀 {t.missionLabel}:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.mission || t.notDefined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>👥 {t.targetMarketLabel}:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.targetMarket || t.notDefined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💰 {t.revenueModelLabel}:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.revenueModel || t.notDefined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⭐ {t.valuePropositionLabel}:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.valueProposition || t.notDefined}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    {language === 'sw' ? 'Imeundwa na Jenga Biz Africa ✨' :
                     language === 'ar' ? 'تم إنشاؤه بواسطة Jenga Biz Africa ✨' :
                     language === 'fr' ? 'Créé avec Jenga Biz Africa ✨' :
                     'Created with Jenga Biz Africa ✨'}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Milestones Summary Modal */}
          <Dialog open={showMilestonesSummary} onOpenChange={setShowMilestonesSummary}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  {t.businessMilestonesSummary}
                </DialogTitle>
                <DialogDescription>
                  {t.milestoneOverview}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">{t.businessStage}: {t.growthStage}</h4>
                  
                   <div className="space-y-3">
                     <h5 className="font-medium text-gray-700">{t.currentMilestones}:</h5>
                     <div className="space-y-2 text-sm">
                       {strategyData?.businessMilestones && strategyData.businessMilestones.length > 0 ? 
                         strategyData.businessMilestones.map((milestone, index) => (
                           <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                             <span>📝 {milestone.title}</span>
                             <span className="text-gray-600 font-medium capitalize">{milestone.status.replace('-', ' ')}</span>
                           </div>
                         )) : (
                           <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                             <span className="text-gray-500">
                               {language === 'sw' ? 'Hakuna malengo yaliyoongezwa bado' :
                                language === 'ar' ? 'لم يتم إضافة معالم بعد' :
                                language === 'fr' ? 'Aucun jalon ajouté encore' :
                                'No milestones added yet'}
                             </span>
                           </div>
                         )
                       }
                     </div>
                   </div>

                   <div className="mt-4 p-3 bg-purple-50 rounded">
                     <p className="text-sm text-purple-700">
                       <strong>
                         {language === 'sw' ? 'Muhtasari wa Maendeleo:' :
                          language === 'ar' ? 'ملخص التقدم:' :
                          language === 'fr' ? 'Résumé des Progrès:' :
                          'Progress Summary:'}
                       </strong> {
                         (() => {
                           const milestoneCount = strategyData?.businessMilestones?.length || 0;
                           const completedCount = strategyData?.businessMilestones?.filter(m => m.status === 'complete').length || 0;
                           
                           if (milestoneCount === 0) {
                             return language === 'sw' ? 'Anza na kuongeza baadhi ya malengo ya biashara yako kuanza safari yako.' :
                                    language === 'ar' ? 'ابدأ بإضافة بعض معالم الأعمال لبدء رحلتك.' :
                                    language === 'fr' ? 'Commencez par ajouter quelques jalons d\'affaires pour commencer votre voyage.' :
                                    'Start by adding some business milestones to begin your journey.';
                           } else if (completedCount === 0) {
                             return language === 'sw' ? `Mwanzo mzuri! Una lengo ${milestoneCount} tayari kuanza. Weka tarehe za lengo na uanze kufanya kazi kwenye lengo lako la kwanza kujenga kasi.` :
                                    language === 'ar' ? `بداية رائعة! لديك ${milestoneCount} معلم جاهز للبدء. حدد التواريخ المستهدفة وابدأ العمل على معلمك الأول لبناء الزخم.` :
                                    language === 'fr' ? `Bon départ! Vous avez ${milestoneCount} jalon prêt à commencer. Définissez des dates cibles et commencez à travailler sur votre premier jalon pour créer de l'élan.` :
                                    `Great start! You have ${milestoneCount} milestone${milestoneCount > 1 ? 's' : ''} ready to begin. Set target dates and start working on your milestones to build momentum.`;
                           } else {
                             return language === 'sw' ? `Hongera! Umekamilisha lengo ${completedCount} kati ya ${milestoneCount}. Endelea na malengo mengine ili kufikia malengo yako ya biashara.` :
                                    language === 'ar' ? `تهانينا! لقد أكملت ${completedCount} من ${milestoneCount} معلم. تابع مع المعالم الأخرى لتحقيق أهداف عملك.` :
                                    language === 'fr' ? `Félicitations! Vous avez terminé ${completedCount} sur ${milestoneCount} jalons. Continuez avec les autres jalons pour atteindre vos objectifs commerciaux.` :
                                    `Congratulations! You've completed ${completedCount} out of ${milestoneCount} milestones. Continue with the others to achieve your business goals.`;
                           }
                         })()
                       }
                     </p>
                   </div>

                  <p className="text-xs text-gray-500 text-center mt-4">{t.generatedWith}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    );
  }

  // Analytics Dashboard View
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('home')}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <h1 className="text-xl font-bold text-foreground">{t.title} - Analytics</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={setLanguage} 
                />
                
                {user && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnalyticsDashboard />
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
              />
              
              {user && (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView('analytics')}
                    className="flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Key Features Section with individual buttons */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{t.businessTemplates}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.businessTemplatesDesc}</p>
            <button
              onClick={() => setCurrentView('templates')}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {t.useTemplates}
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-indigo-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{t.customStrategy}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.customStrategyDesc}</p>
            <button
              onClick={() => scrollToSection('strategy-builder')}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {t.startFromScratch}
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{t.milestoneTracking}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.milestoneTrackingDesc}</p>
            <button
              onClick={() => scrollToSection('milestones-section')}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {t.trackMilestones}
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{t.financialTracking}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.financialTrackingDesc}</p>
            <button
              onClick={() => scrollToSection('financial-section')}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {t.trackFinances}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={handleAuthDialogChange}
      />
    </div>
  );
};

export default Index;