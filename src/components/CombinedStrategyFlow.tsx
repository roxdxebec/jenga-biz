import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Save, Download, Share2, Sparkles } from 'lucide-react';
import StrategyBuilder from '@/components/StrategyBuilder';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import FinancialTracker from '@/components/FinancialTracker';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';
import { useStrategy } from '@/hooks/useStrategy';
import { useToast } from '@/hooks/use-toast';

interface CombinedStrategyFlowProps {
  template?: any;
  onBack?: () => void;
  onHome?: () => void;
  initialLanguage?: string;
}

const CombinedStrategyFlow = ({ 
  template, 
  onBack, 
  onHome, 
  initialLanguage = 'en' 
}: CombinedStrategyFlowProps) => {
  const { toast } = useToast();
  const { saveStrategy, currentStrategy, milestones: strategyMilestones } = useStrategy();
  const [language, setLanguage] = useState(initialLanguage);
  const [country, setCountry] = useState('KE');
  const [currency, setCurrency] = useState('KES');
  const [currencySymbol, setCurrencySymbol] = useState('KSh');
  const [strategy, setStrategy] = useState(null);
  const [milestones, setMilestones] = useState([]);

  const translations = {
    en: {
      backToTemplates: 'Back',
      home: 'Home',
      save: 'Save',
      language: 'Language',
      currency: 'Currency'
    },
    sw: {
      backToTemplates: 'Rudi',
      home: 'Nyumbani',
      save: 'Hifadhi',
      language: 'Lugha',
      currency: 'Sarafu'
    },
    ar: {
      backToTemplates: 'رجوع',
      home: 'الرئيسية',
      save: 'حفظ',
      language: 'اللغة',
      currency: 'العملة'
    },
    fr: {
      backToTemplates: 'Retour',
      home: 'Accueil',
      save: 'Sauvegarder',
      language: 'Langue',
      currency: 'Devise'
    }
  };

  const t = translations[language] || translations.en;

  // Update currency when country changes
  useEffect(() => {
    const currencyMap = {
      'KE': { currency: 'KES', symbol: 'KSh' },
      'UG': { currency: 'UGX', symbol: 'UGX' },
      'TZ': { currency: 'TZS', symbol: 'TZS' },
      'RW': { currency: 'RWF', symbol: 'RWF' },
      'NG': { currency: 'NGN', symbol: '₦' },
      'GH': { currency: 'GHS', symbol: 'GH₵' },
      'ZA': { currency: 'ZAR', symbol: 'R' },
      'EG': { currency: 'EGP', symbol: 'E£' },
      'MA': { currency: 'MAD', symbol: 'MAD' }
    };
    
    const countryData = currencyMap[country] || currencyMap['KE'];
    setCurrency(countryData.currency);
    setCurrencySymbol(countryData.symbol);
  }, [country]);

  const handleStrategyChange = (newStrategy) => {
    setStrategy(newStrategy);
  };

  const handleMilestonesChange = (newMilestones) => {
    setMilestones(newMilestones);
  };

  const handleSaveStrategy = async () => {
    if (!strategy) return;
    
    try {
      await saveStrategy(strategy, true);
      toast({
        title: 'Strategy Saved',
        description: 'Your business strategy has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save strategy. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveMilestones = async () => {
    toast({
      title: 'Milestones Saved',
      description: 'Your business milestones have been saved successfully.',
    });
  };

  const handleSaveFinancial = async () => {
    toast({
      title: 'Financial Data Saved',
      description: 'Your financial information has been saved successfully.',
    });
  };

  const handleAISummary = (section: string) => {
    toast({
      title: 'AI Summary',
      description: `Generating AI summary for ${section} section...`,
    });
  };

  const handleDownload = (section: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${section} summary...`,
    });
  };

  const handleShare = (section: string) => {
    toast({
      title: 'Share Link Generated',
      description: `Share link for ${section} has been copied to clipboard.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            {/* Left section - Logo and main actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <h1 className="text-xl font-bold text-gray-900">Jenga Biz Africa</h1>
              
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

            {/* Right section - Selectors */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              
              <CountrySelector
                currentCountry={country}
                onCountryChange={setCountry}
                language={language}
              />
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
                AI Summary
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
                AI Summary
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
                AI Summary
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
    </div>
  );
};

export default CombinedStrategyFlow;