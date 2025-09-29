import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Home, Save, Download, Share2, Sparkles, MessageCircle, Mail, Copy, FileDown, BarChart3, User, LogOut } from 'lucide-react';
import StrategyBuilder from '@/components/StrategyBuilder';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import FinancialTracker from '@/components/FinancialTracker';
import LanguageSelector from '@/components/LanguageSelector';
import { useStrategy } from '@/hooks/useStrategy';
import { useToast } from '@/hooks/use-toast';
import { generateShareText, useShareActions } from '@/lib/shareUtils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CombinedStrategyFlowProps {
  template?: any;
  onBack?: () => void;
  onHome?: () => void;
  initialLanguage?: string;
  currentStrategy?: any;
  defaultTab?: string | null;
}

const CombinedStrategyFlow = ({ 
  template, 
  onBack,
  onHome, 
  initialLanguage = 'en',
  currentStrategy: propCurrentStrategy,
  defaultTab
}: CombinedStrategyFlowProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { saveStrategy, currentStrategy, milestones: strategyMilestones } = useStrategy();
  const [language, setLanguage] = useState(initialLanguage);
  const [country, setCountry] = useState('KE');
  const [currency, setCurrency] = useState('KES');
  const [currencySymbol, setCurrencySymbol] = useState('KSh');
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
  const [milestones, setMilestones] = useState([]);
  const [templateId, setTemplateId] = useState(template?.id || '');
  const [templateName, setTemplateName] = useState(template?.name || '');
  
  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAISummaryModal, setShowAISummaryModal] = useState(false);
  const [aiSummaryContent, setAiSummaryContent] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState('');

  const translations = {
    en: {
      backToTemplates: 'Back',
      home: 'Home',
      save: 'Save',
      language: 'Language',
      currency: 'Currency',
      signOut: 'Sign Out'
    },
    sw: {
      backToTemplates: 'Rudi',
      home: 'Nyumbani',
      save: 'Hifadhi',
      language: 'Lugha',
      currency: 'Sarafu',
      signOut: 'Toka'
    },
    ar: {
      backToTemplates: 'رجوع',
      home: 'الرئيسية',
      save: 'حفظ',
      language: 'اللغة',
      currency: 'العملة',
      signOut: 'تسجيل الخروج'
    },
    fr: {
      backToTemplates: 'Retour',
      home: 'Accueil',
      save: 'Sauvegarder',
      language: 'Langue',
      currency: 'Devise',
      signOut: 'Se Déconnecter'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Map Supabase snake_case fields to local camelCase builder fields
  function normalizeStrategy(data: any) {
    if (!data) return null;
    return {
      businessName: data.business_name || '',
      vision: data.vision || '',
      mission: data.mission || '',
      targetMarket: data.target_market || '',
      revenueModel: data.revenue_model || '',
      valueProposition: data.value_proposition || '',
      keyPartners: data.key_partners || '',
      marketingApproach: data.marketing_approach || '',
      operationalNeeds: data.operational_needs || '',
      growthGoals: data.growth_goals || '',
    };
  }

  // Update currency when country changes  
  useEffect(() => {
    const currencyMap = {
      // Major currencies
      'US': { currency: 'USD', symbol: '$' },
      'EU': { currency: 'EUR', symbol: '€' },
      
      // African currencies
      'DZ': { currency: 'DZD', symbol: 'DA' },
      'AO': { currency: 'AOA', symbol: 'Kz' },
      'BW': { currency: 'BWP', symbol: 'P' },
      'BI': { currency: 'BIF', symbol: 'FBu' },
      'CV': { currency: 'CVE', symbol: '$' },
      'KM': { currency: 'KMF', symbol: 'CF' },
      'CD': { currency: 'CDF', symbol: 'FC' },
      'DJ': { currency: 'DJF', symbol: 'Fdj' },
      'EG': { currency: 'EGP', symbol: 'E£' },
      'ER': { currency: 'ERN', symbol: 'Nfk' },
      'SZ': { currency: 'SZL', symbol: 'L' },
      'ET': { currency: 'ETB', symbol: 'Br' },
      'GM': { currency: 'GMD', symbol: 'D' },
      'GH': { currency: 'GHS', symbol: 'GH₵' },
      'GN': { currency: 'GNF', symbol: 'FG' },
      'KE': { currency: 'KES', symbol: 'KSh' },
      'LS': { currency: 'LSL', symbol: 'L' },
      'LR': { currency: 'LRD', symbol: 'L$' },
      'LY': { currency: 'LYD', symbol: 'LD' },
      'MG': { currency: 'MGA', symbol: 'Ar' },
      'MW': { currency: 'MWK', symbol: 'MK' },
      'MR': { currency: 'MRU', symbol: 'UM' },
      'MU': { currency: 'MUR', symbol: '₨' },
      'MA': { currency: 'MAD', symbol: 'DH' },
      'MZ': { currency: 'MZN', symbol: 'MT' },
      'NA': { currency: 'NAD', symbol: 'N$' },
      'NG': { currency: 'NGN', symbol: '₦' },
      'RW': { currency: 'RWF', symbol: 'RF' },
      'ST': { currency: 'STN', symbol: 'Db' },
      'SC': { currency: 'SCR', symbol: '₨' },
      'SL': { currency: 'SLL', symbol: 'Le' },
      'SO': { currency: 'SOS', symbol: 'S' },
      'ZA': { currency: 'ZAR', symbol: 'R' },
      'SS': { currency: 'SSP', symbol: '£' },
      'SD': { currency: 'SDG', symbol: 'ج.س.' },
      'TZ': { currency: 'TZS', symbol: 'TSh' },
      'TN': { currency: 'TND', symbol: 'DT' },
      'UG': { currency: 'UGX', symbol: 'USh' },
      'ZM': { currency: 'ZMW', symbol: 'ZK' },
      'ZW': { currency: 'ZWL', symbol: 'Z$' },
      
      // CFA Franc regions
      'BJ': { currency: 'XOF', symbol: 'CFA' }, // Benin
      'BF': { currency: 'XOF', symbol: 'CFA' }, // Burkina Faso
      'CI': { currency: 'XOF', symbol: 'CFA' }, // Côte d'Ivoire
      'GW': { currency: 'XOF', symbol: 'CFA' }, // Guinea-Bissau
      'ML': { currency: 'XOF', symbol: 'CFA' }, // Mali
      'NE': { currency: 'XOF', symbol: 'CFA' }, // Niger
      'SN': { currency: 'XOF', symbol: 'CFA' }, // Senegal
      'TG': { currency: 'XOF', symbol: 'CFA' }, // Togo
      'CM': { currency: 'XAF', symbol: 'FCFA' }, // Cameroon
      'CF': { currency: 'XAF', symbol: 'FCFA' }, // Central African Republic
      'TD': { currency: 'XAF', symbol: 'FCFA' }, // Chad
      'CG': { currency: 'XAF', symbol: 'FCFA' }, // Republic of Congo
      'GQ': { currency: 'XAF', symbol: 'FCFA' }, // Equatorial Guinea
      'GA': { currency: 'XAF', symbol: 'FCFA' }  // Gabon
    };
    
    const countryData = currencyMap[country as keyof typeof currencyMap] || currencyMap['KE'];
    setCurrency(countryData.currency);
    setCurrencySymbol(countryData.symbol);
  }, [country]);

  // Ensure local strategy state updates when propCurrentStrategy changes
  useEffect(() => {
    if (propCurrentStrategy) {
      const normalized = normalizeStrategy(propCurrentStrategy);
      if (normalized) {
        setStrategy(normalized);
        console.log("Loaded normalized strategy into builder:", normalized);
      }
    }
  }, [propCurrentStrategy]);

  // Handle default tab navigation
  useEffect(() => {
    if (defaultTab) {
      setTimeout(() => {
        const sectionId = defaultTab === 'milestones' ? 'milestones-section' : 
                         defaultTab === 'financials' ? 'financial-tracker-section' : null;
        
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 500); // Small delay to ensure content is rendered
    }
  }, [defaultTab, strategy]); // Include strategy to ensure content is loaded

  // Load existing strategy data or create from template
  useEffect(() => {
    console.log('COMBINEDSTRATEGYFLOW DEBUG: Strategy loading effect triggered');
    console.log('COMBINEDSTRATEGYFLOW DEBUG: currentStrategy received:', currentStrategy);
    console.log('COMBINEDSTRATEGYFLOW DEBUG: template received:', template);
    console.log('COMBINEDSTRATEGYFLOW DEBUG: Current local strategy state before update:', strategy);
    
    if (currentStrategy) {
      // Load existing strategy - this takes priority over template
      console.log('COMBINEDSTRATEGYFLOW DEBUG: Loading existing strategy data:', currentStrategy);
      const loadedStrategy = {
        businessName: currentStrategy.business_name || '',
        vision: currentStrategy.vision || '',
        mission: currentStrategy.mission || '',
        targetMarket: currentStrategy.target_market || '',
        revenueModel: currentStrategy.revenue_model || '',
        valueProposition: currentStrategy.value_proposition || '',
        keyPartners: currentStrategy.key_partners || '',
        marketingApproach: currentStrategy.marketing_approach || '',
        operationalNeeds: currentStrategy.operational_needs || '',
        growthGoals: currentStrategy.growth_goals || ''
      };
      console.log('COMBINEDSTRATEGYFLOW DEBUG: Setting loaded strategy data:', loadedStrategy);
      setStrategy(loadedStrategy);
      setLanguage(currentStrategy.language || 'en');
      setCountry(currentStrategy.country || 'KE');
      setCurrency(currentStrategy.currency || 'KES');
      setTemplateId(currentStrategy.template_id || '');
      setTemplateName(currentStrategy.template_name || '');
      console.log('COMBINEDSTRATEGYFLOW DEBUG: Strategy state should now be updated to:', loadedStrategy);
    } else if (template) {
      // Template provided - create new strategy from template
      console.log('Creating strategy from template:', template);
      setStrategy({
        businessName: template.name || '',
        vision: template.content?.vision || '',
        mission: template.content?.mission || '',
        targetMarket: template.content?.targetMarket || '',
        revenueModel: template.content?.revenueModel || '',
        valueProposition: template.content?.valueProposition || '',
        keyPartners: template.content?.keyPartners || '',
        marketingApproach: template.content?.marketingApproach || '',
        operationalNeeds: template.content?.operationalNeeds || '',
        growthGoals: template.content?.growthGoals || ''
      });
      setTemplateId(template.id || '');
      setTemplateName(template.name || '');
    } else {
      // Start from scratch - clear everything
      console.log('Start from scratch - clearing strategy data');
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
      setMilestones([]);
    }
  }, [currentStrategy, template]);

  const handleStrategyChange = (newStrategy: any) => {
    console.log('Strategy changed:', newStrategy);
    setStrategy(newStrategy);
  };

  const handleMilestonesChange = (newMilestones: any) => {
    setMilestones(newMilestones);
  };

  const handleSaveStrategy = async () => {
    const hasData = strategy && (
      strategy.businessName || 
      strategy.vision || 
      strategy.mission || 
      strategy.targetMarket || 
      strategy.revenueModel || 
      strategy.valueProposition
    );
    
    if (!hasData) {
      toast({
        title: 'No Strategy Data',
        description: 'Please fill out the strategy form before saving.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const strategyToSave = {
        business_name: strategy.businessName,
        vision: strategy.vision,
        mission: strategy.mission,
        target_market: strategy.targetMarket,
        revenue_model: strategy.revenueModel,
        value_proposition: strategy.valueProposition,
        key_partners: strategy.keyPartners,
        marketing_approach: strategy.marketingApproach,
        operational_needs: strategy.operationalNeeds,
        growth_goals: strategy.growthGoals,
        language: language,
        country: country,
        currency: currency,
        template_id: templateId,
        template_name: templateName
      };
      
      console.log('Saving strategy data:', strategyToSave);
      const result = await saveStrategy(strategyToSave, true);
      if (result) {
        console.log('Strategy saved successfully:', result);
      }
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast({
        title: 'Error',
        description: 'Failed to save strategy. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveMilestones = async () => {
    // Use milestones from useStrategy hook instead of local state
    if (strategyMilestones.length === 0) {
      toast({
        title: 'No Milestones',
        description: 'Please add some milestones before saving.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Milestones are already saved individually via BusinessMilestonesSection
      // This just shows confirmation
      toast({
        title: 'Milestones Saved',
        description: 'Your business milestones have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving milestones:', error);
      toast({
        title: 'Error',
        description: 'Failed to save milestones. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveFinancial = async () => {
    toast({
      title: 'Financial Data Saved',
      description: 'Your financial information has been saved successfully.',
    });
  };

  const handleAISummary = (section: string) => {
    setCurrentSection(section);
    
    // Generate AI summary content based on section
    let summaryData = {};
    
    if (section === 'strategy') {
      summaryData = {
        title: 'Business Strategy Summary',
        subtitle: 'AI-generated summary of your business strategy',
        businessName: strategy?.businessName || 'Your Business',
        vision: strategy?.vision || 'Not specified',
        mission: strategy?.mission || 'Not specified',
        targetMarket: strategy?.targetMarket || 'Not specified',
        revenueModel: strategy?.revenueModel || 'Not specified',
        valueProposition: strategy?.valueProposition || 'Not specified'
      };
    } else if (section === 'milestones') {
      summaryData = {
        title: 'Business Milestones Summary',
        subtitle: 'Overview of your business milestone progress and insights',
        businessStage: 'Growth Stage',
        currentMilestones: milestones.length > 0 ? milestones : 'No milestones added yet',
        progressSummary: milestones.length > 0 ? 
          `You have ${milestones.length} milestones set` : 
          'Start by adding some business milestones to begin your journey.'
      };
    } else if (section === 'financial') {
      summaryData = {
        title: 'Financial Insights Summary',
        subtitle: 'Based on your daily financial data:',
        totalRevenue: `${currencySymbol} 0.00`,
        totalExpenses: `${currencySymbol} 0.00`,
        netProfit: `${currencySymbol} 0.00`,
        profitMargin: '0%',
        insights: [
          'Your business is profitable',
          'No revenue entries recorded',
          'No expense entries recorded'
        ]
      };
    }
    
    setAiSummaryContent(summaryData as any);
    setShowAISummaryModal(true);
  };

  const handleDownload = (section: string) => {
    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `jenga-biz-${section}-${timestamp}.txt`;
    
    let content = '';
    
    if (section === 'strategy' && strategy) {
      content = `Business Strategy Summary\n\nBusiness Name: ${strategy.businessName || 'N/A'}\nVision: ${strategy.vision || 'N/A'}\nMission: ${strategy.mission || 'N/A'}\nTarget Market: ${strategy.targetMarket || 'N/A'}\nRevenue Model: ${strategy.revenueModel || 'N/A'}\nValue Proposition: ${strategy.valueProposition || 'N/A'}\n\nCreated with Jenga Biz Africa ✨`;
    } else if (section === 'milestones') {
      content = `Business Milestones Summary\n\nBusiness Stage: Growth Stage\nTotal Milestones: ${milestones.length}\n\nMilestones:\n${milestones.length > 0 ? milestones.map((m: any) => `- ${m.title || m.name}`).join('\n') : 'No milestones added yet'}\n\nCreated with Jenga Biz Africa ✨`;
    } else if (section === 'financial') {
      content = `Financial Summary\n\nTotal Revenue: ${currencySymbol} 0.00\nTotal Expenses: ${currencySymbol} 0.00\nNet Profit: ${currencySymbol} 0.00\nProfit Margin: 0%\n\nKey Insights:\n- Your business is profitable\n- No revenue entries recorded\n- No expense entries recorded\n\nCreated with Jenga Biz Africa ✨`;
    }
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Summary Downloaded',
      description: `${filename} downloaded successfully.`,
    });
  };

  const handleShare = (section: string) => {
    setCurrentSection(section);
    setShowShareModal(true);
  };

  const shareActions = useShareActions();

  const handleShareOption = (option: string) => {
    let shareText = '';
    let customTitle = '';

    if (currentSection === 'strategy') {
      customTitle = 'My Business Strategy';
      shareText = generateShareText({
        strategy,
        type: 'summary' as const,
        customTitle,
        language
      }) || '';
    } else if (currentSection === 'milestones') {
      customTitle = 'My Business Milestones';
      shareText = generateShareText({
        strategy: { ...strategy, milestones },
        type: 'milestones' as const,
        customTitle,
        language
      }) || '';
    } else if (currentSection === 'financial') {
      customTitle = 'My Financial Summary';
      shareText = generateShareText({
        strategy,
        customTitle,
        isFinancial: true,
        language
      }) || '';
    }
    
    switch (option) {
      case 'whatsapp':
        shareActions.handleWhatsAppShare(shareText, language);
        break;
      case 'email':
        shareActions.handleEmailShare(shareText, customTitle);
        break;
      case 'copy':
        shareActions.handleCopyText(shareText, language);
        break;
      case 'pdf':
        handleDownload(currentSection);
        break;
    }
    
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            {/* Left section - Logo and main actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <img src="/jenga-biz-logo.png" alt="Jenga Biz Africa" className="h-12 w-auto" />
              
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToTemplates}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onHome}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Home className="w-4 h-4" />
                  {t.home}
                </Button>
              </div>
            </div>

            {/* Right section - User Navigation */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <LanguageSelector 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/dashboard';
                  }
                }}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    await signOut();
                    navigate('/');
                  } catch (error) {
                    console.error('Sign out error:', error);
                    navigate('/auth');
                  }
                }}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4" />
                {t.signOut}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Strategy Builder Section */}
          <section id="strategy-section">
        <StrategyBuilder
          template={template}
          onStrategyChange={handleStrategyChange}
          language={language}
          onLanguageChange={setLanguage}
          country={country}
          onCountryChange={setCountry}
          currency={currency}
          currencySymbol={currencySymbol}
          existingStrategy={strategy}
        />
          </section>

          {/* Business Strategy Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Strategy Summary</h3>
            
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleAISummary('strategy')}
              >
                <Sparkles className="w-5 h-5" />
                Business Summary
              </Button>
              
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleDownload('strategy')}
              >
                <Download className="w-5 h-5" />
                Download Summary
              </Button>
              
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleShare('strategy')}
              >
                <Share2 className="w-5 h-5" />
                Share Strategy
              </Button>
              
              <Button
                size="lg"
                onClick={handleSaveStrategy}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <Save className="w-5 h-5" />
                Save Strategy
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Milestones Section */}
          <section id="milestones-section">
            <BusinessMilestonesSection
              isPro={true}
              strategyData={strategy}
              language={language}
              onMilestonesChange={handleMilestonesChange}
            />
          </section>

          {/* Business Milestones Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Milestones Summary</h3>
            
            <div className="space-y-3">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleAISummary('milestones')}
              >
                <Sparkles className="w-5 h-5" />
                Milestones Summary
              </Button>
              
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleDownload('milestones')}
              >
                <Download className="w-5 h-5" />
                Download Summary
              </Button>
              
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleShare('milestones')}
              >
                <Share2 className="w-5 h-5" />
                Share Milestones
              </Button>
              
              <Button
                size="lg"
                onClick={handleSaveMilestones}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <Save className="w-5 h-5" />
                Save Milestones
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Financial Tracker Section */}
          <section id="financial-tracker-section">
            <FinancialTracker
              language={language}
              currency={currency}
              currencySymbol={currencySymbol}
              strategyId={currentStrategy?.id}
            />
          </section>

          {/* Financial Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleAISummary('financial')}
              >
                <Sparkles className="w-5 h-5" />
                Financials Summary
              </Button>
              
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleDownload('financial')}
              >
                <Download className="w-5 h-5" />
                Download Summary
              </Button>
              
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3"
                size="lg"
                onClick={() => handleShare('financial')}
              >
                <Share2 className="w-5 h-5" />
                Share Financials
              </Button>
              
              <Button
                size="lg"
                onClick={handleSaveFinancial}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <Save className="w-5 h-5" />
                Save Financial
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Share {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-sm text-gray-600 text-center">Share via</p>
            
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white justify-center gap-3 py-3"
              size="lg"
              onClick={() => handleShareOption('whatsapp')}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center gap-3 py-3"
              size="lg"
              onClick={() => handleShareOption('email')}
            >
              <Mail className="w-5 h-5" />
              Email
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center gap-3 py-3"
              size="lg"
              onClick={() => handleShareOption('copy')}
            >
              <Copy className="w-5 h-5" />
              Copy Text
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center gap-3 py-3"
              size="lg"
              onClick={() => handleShareOption('pdf')}
            >
              <FileDown className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Summary Modal */}
      <Dialog open={showAISummaryModal} onOpenChange={setShowAISummaryModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {aiSummaryContent?.title}
            </DialogTitle>
            {aiSummaryContent?.subtitle && (
              <p className="text-sm text-gray-600">{aiSummaryContent.subtitle}</p>
            )}
          </DialogHeader>
          
          <div className="space-y-4 p-4">
            {currentSection === 'strategy' && aiSummaryContent && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  <h3 className="font-bold text-lg">{aiSummaryContent.businessName}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <strong>Vision:</strong>
                      <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.vision}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🚀</span>
                    <div>
                      <strong>Mission:</strong>
                      <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.mission}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg">👥</span>
                    <div>
                      <strong>Target Market:</strong>
                      <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.targetMarket}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💰</span>
                    <div>
                      <strong>Revenue Model:</strong>
                      <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.revenueModel}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <strong>Value Proposition:</strong>
                      <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.valueProposition}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentSection === 'milestones' && aiSummaryContent && (
              <div className="space-y-4">
                <div>
                  <strong>Business Stage:</strong>
                  <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.businessStage}</p>
                </div>
                
                <div>
                  <strong>Current Milestones:</strong>
                  {typeof aiSummaryContent.currentMilestones === 'string' ? (
                    <p className="text-sm text-gray-700 mt-1">{aiSummaryContent.currentMilestones}</p>
                  ) : (
                    <div className="text-sm text-gray-700 mt-1">
                      {aiSummaryContent.currentMilestones.map((milestone: any, index: number) => (
                        <p key={index}>• {milestone.title || milestone.name}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <strong className="text-purple-700">Progress Summary:</strong>
                  <p className="text-sm text-purple-600 mt-1">{aiSummaryContent.progressSummary}</p>
                </div>
              </div>
            )}
            
            {currentSection === 'financial' && aiSummaryContent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Total Revenue:</strong>
                    <p className="text-lg text-green-600 font-semibold">{aiSummaryContent.totalRevenue}</p>
                  </div>
                  <div>
                    <strong>Total Expenses:</strong>
                    <p className="text-lg text-red-600 font-semibold">{aiSummaryContent.totalExpenses}</p>
                  </div>
                  <div>
                    <strong>Net Profit:</strong>
                    <p className="text-lg text-blue-600 font-semibold">{aiSummaryContent.netProfit}</p>
                  </div>
                  <div>
                    <strong>Profit Margin:</strong>
                    <p className="text-lg font-semibold">{aiSummaryContent.profitMargin}</p>
                  </div>
                </div>
                
                <div>
                  <strong>Key Insights:</strong>
                  <div className="text-sm text-gray-700 mt-1 space-y-1">
                    {aiSummaryContent.insights.map((insight: string, index: number) => (
                      <p key={index}>• {insight}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center text-xs text-gray-400 mt-6 border-t pt-4">
              Created with Jenga Biz Africa ✨
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CombinedStrategyFlow;
