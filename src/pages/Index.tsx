import { useState } from 'react';
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
import { Globe, Home, Save, Download, Bot, ArrowLeft, Target, Calendar } from 'lucide-react';
import { TemplateData } from '@/data/templateData';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('KE');
  const [strategyData, setStrategyData] = useState(null);
  const [showStrategySummary, setShowStrategySummary] = useState(false);
  const [showMilestonesSummary, setShowMilestonesSummary] = useState(false);
  const { toast } = useToast();

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
      progressSummaryText: 'You\'re making great progress! 1 milestone completed, 1 in progress. Keep focusing on your bank account setup to maintain momentum.',
      generatedWith: 'Generated with Jenga Biz Africa ✨',
      aiGeneratedSummary: 'AI-generated summary of your business strategy',
      visionLabel: 'Vision',
      missionLabel: 'Mission',
      targetMarketLabel: 'Target Market',
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
      progressSummaryText: 'Unafanya maendeleo mazuri! Lengo 1 limekamilika, 1 linaendelea. Endelea kulenga kuanzisha akaunti ya benki ili kudumisha msukumo.',
      generatedWith: 'Imetengenezwa na Jenga Biz Africa ✨',
      aiGeneratedSummary: 'Muhtasari wa mkakati wa biashara yako uliotengenezwa na AI',
      visionLabel: 'Maono',
      missionLabel: 'Dhamira',
      targetMarketLabel: 'Soko Lengwa',
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
      progressSummaryText: 'أنت تحرز تقدمًا رائعًا! معلم واحد مكتمل، واحد قيد التنفيذ. استمر في التركيز على إعداد حسابك المصرفي للحفاظ على الزخم.',
      generatedWith: 'تم إنشاؤه بواسطة Jenga Biz Africa ✨',
      aiGeneratedSummary: 'ملخص استراتيجية عملك المُولد بالذكاء الاصطناعي',
      visionLabel: 'الرؤية',
      missionLabel: 'المهمة',
      targetMarketLabel: 'السوق المستهدف',
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
      progressSummaryText: 'Vous faites d\'excellents progrès! 1 jalon terminé, 1 en cours. Continuez à vous concentrer sur la configuration de votre compte bancaire pour maintenir l\'élan.',
      generatedWith: 'Généré avec Jenga Biz Africa ✨',
      aiGeneratedSummary: 'Résumé généré par IA de votre stratégie commerciale',
      visionLabel: 'Vision',
      missionLabel: 'Mission',
      targetMarketLabel: 'Marché Cible',
      notDefined: 'Non défini'
    }
  };

  const t = translations[language] || translations.en;

  const handleTemplateSelect = (template: TemplateData) => {
    setSelectedTemplate(template);
    setCurrentView('builder');
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

  const handleSave = () => {
    if (strategyData) {
      localStorage.setItem('jenga-biz-strategy', JSON.stringify(strategyData));
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

  const generateAISummary = () => {
    if (!strategyData || !strategyData.businessName) {
      toast({
        title: "Incomplete Strategy",
        description: "Please complete your strategy first",
        variant: "destructive",
      });
      return;
    }
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
    
    const summary = `Jenga Biz Africa - Business Strategy Summary
    
Business Name: ${strategyData.businessName || 'Your Business'}
Vision: ${strategyData.vision || 'Not defined'}
Mission: ${strategyData.mission || 'Not defined'}
Target Market: ${strategyData.targetMarket || 'Not defined'}
Revenue Model: ${strategyData.revenueModel || 'Not defined'}
Value Proposition: ${strategyData.valueProposition || 'Not defined'}
Key Partners: ${strategyData.keyPartners || 'Not defined'}
Marketing Approach: ${strategyData.marketingApproach || 'Not defined'}
Operational Needs: ${strategyData.operationalNeeds || 'Not defined'}
Growth Goals: ${strategyData.growthGoals || 'Not defined'}

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
    // Mock milestone data for demonstration
    const milestones = [
      { title: 'Register business name', status: 'complete', targetDate: '2024-01-15' },
      { title: 'Open business bank account', status: 'in-progress', targetDate: '2024-02-01' },
      { title: 'Launch minimum viable product', status: 'not-started', targetDate: '2024-03-15' }
    ];
    
    const summary = `Jenga Biz Africa - Business Milestones Summary
    
Business Stage: Growth Stage
    
Milestones Progress:
${milestones.map(m => `- ${m.title} (${m.status.replace('-', ' ')}${m.targetDate ? ` - Target: ${m.targetDate}` : ''})`).join('\n')}

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
          
          <div>
            <MonthlyRevenueSection
              strategyData={strategyData}
              language={language}
              currency={currency}
              currencySymbol={currencySymbol}
              country={country}
              onCountryChange={setCountry}
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
                      <span>💰 Revenue Model:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.revenueModel || 'Not defined'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⭐ Value Proposition:</span>
                      <span className="font-medium text-right max-w-64">{strategyData?.valueProposition || 'Not defined'}</span>
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
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span>✅ {t.registerBusinessName}</span>
                        <span className="text-green-600 font-medium">{t.complete}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span>🔄 {t.openBankAccount}</span>
                        <span className="text-blue-600 font-medium">{t.inProgress}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>⏳ {t.launchMVP}</span>
                        <span className="text-gray-600 font-medium">{t.notStarted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-50 rounded">
                    <p className="text-sm text-purple-700">
                      <strong>{t.progressSummaryLabel}</strong> {t.progressSummaryText}
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

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            </div>
            
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
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
    </div>
  );
};

export default Index;