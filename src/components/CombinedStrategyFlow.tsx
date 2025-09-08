import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Save } from 'lucide-react';
import StrategyBuilder from '@/components/StrategyBuilder';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import FinancialTracker from '@/components/FinancialTracker';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';

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

  const handleSave = () => {
    // Save all data
    console.log('Saving combined data:', { strategy, milestones });
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

          {/* AI Summary for Strategy */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🤖 AI Strategy Summary</h3>
            <p className="text-blue-800 text-sm">Your business strategy focuses on sustainable growth through targeted market expansion and efficient resource allocation.</p>
          </div>

          {/* Save Strategy Button */}
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3"
            >
              <Save className="w-5 h-5" />
              Save Strategy
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📤 Share
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📥 Download
            </Button>
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

          {/* AI Summary for Milestones */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">🤖 AI Milestones Summary</h3>
            <p className="text-purple-800 text-sm">Your milestones are well-structured with realistic timelines. Consider adding intermediate checkpoints for better tracking.</p>
          </div>

          {/* Save Milestones Button */}
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3"
            >
              <Save className="w-5 h-5" />
              Save Milestones
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📤 Share
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📥 Download
            </Button>
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

          {/* AI Summary for Financial Data */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">🤖 AI Financial Summary</h3>
            <p className="text-green-800 text-sm">Your financial health looks promising. Focus on maintaining positive cash flow and consider diversifying revenue streams.</p>
          </div>

          {/* Save Financial Button at the very end */}
          <div className="flex justify-center space-x-4 pt-8">
            <Button
              size="lg"
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3"
            >
              <Save className="w-5 h-5" />
              Save Financial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📤 Share
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              📥 Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedStrategyFlow;