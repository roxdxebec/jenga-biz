
import { useState } from 'react';
import TemplateDropdownSelector from '@/components/TemplateDropdownSelector';
import BusinessStageSelector from '@/components/BusinessStageSelector';
import StrategyBuilder from '@/components/StrategyBuilder';
import MonthlyRevenueSection from '@/components/MonthlyRevenueSection';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, DollarSign, Home, Save } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStage, setSelectedStage] = useState('');
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('KE');
  const [strategyData, setStrategyData] = useState(null);

  console.log('Index - Current view:', currentView);
  console.log('Index - Selected template:', selectedTemplate);
  console.log('Index - Selected stage:', selectedStage);

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

  const handleTemplateSelect = (template) => {
    console.log('Index - Template selected:', template);
    setSelectedTemplate(template);
    setCurrentView('stage-selector');
  };

  const handleStartFromScratch = () => {
    console.log('Index - Starting from scratch');
    setSelectedTemplate(null);
    setCurrentView('stage-selector');
  };

  const handleStageSelect = (stage: string) => {
    console.log('Index - Stage selected:', stage);
    setSelectedStage(stage);
    setCurrentView('builder');
  };

  const handleStrategyChange = (strategy) => {
    setStrategyData(strategy);
  };

  const handleBackToTemplates = () => {
    console.log('Index - Back to template selector');
    setCurrentView('templates');
    setSelectedTemplate(null);
    setSelectedStage('');
  };

  const handleBackToStageSelector = () => {
    console.log('Index - Back to stage selector');
    setCurrentView('stage-selector');
  };

  const handleBackToHome = () => {
    console.log('Index - Back to home');
    setCurrentView('home');
    setSelectedTemplate(null);
    setSelectedStage('');
  };

  const handleSave = () => {
    console.log('Saving strategy data');
  };

  // Template Selector View
  if (currentView === 'templates') {
    return (
      <TemplateDropdownSelector
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
        language={language}
      />
    );
  }

  // Business Stage Selector View
  if (currentView === 'stage-selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Strategy Grid</h1>
              </div>
              
              {/* Utility Buttons */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center justify-start w-full sm:w-auto">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="mr-2 text-sm">Language</span>
                  <LanguageSelector 
                    currentLanguage={language} 
                    onLanguageChange={setLanguage} 
                  />
                </div>
                
                <div className="flex items-center justify-start w-full sm:w-auto">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="mr-2 text-sm">Currency</span>
                  <CountrySelector
                    currentCountry={country}
                    onCountryChange={setCountry}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-start w-full sm:w-auto"
                  onClick={handleBackToTemplates}
                >
                  <Home className="w-4 h-4 mr-2" />
                  <span>Home</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BusinessStageSelector
            selectedStage={selectedStage}
            onStageSelect={handleStageSelect}
            language={language}
          />
        </div>
      </div>
    );
  }

  // Strategy Builder View with Trackers
  if (currentView === 'builder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Strategy Grid</h1>
              </div>
              
              {/* Utility Buttons */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center justify-start w-full sm:w-auto">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="mr-2 text-sm">Language</span>
                  <LanguageSelector 
                    currentLanguage={language} 
                    onLanguageChange={setLanguage} 
                  />
                </div>
                
                <div className="flex items-center justify-start w-full sm:w-auto">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="mr-2 text-sm">Currency</span>
                  <CountrySelector
                    currentCountry={country}
                    onCountryChange={setCountry}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-start w-full sm:w-auto"
                  onClick={handleBackToHome}
                >
                  <Home className="w-4 h-4 mr-2" />
                  <span>Home</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-start w-full sm:w-auto"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>Save</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="strategy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strategy">Strategy Builder</TabsTrigger>
              <TabsTrigger value="milestones">Milestones Tracker</TabsTrigger>
              <TabsTrigger value="finances">Revenue & Expense Tracker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategy" className="mt-6">
              <StrategyBuilder
                template={selectedTemplate}
                onStrategyChange={handleStrategyChange}
                onBack={handleBackToStageSelector}
                onHome={handleBackToHome}
                language={language}
                onLanguageChange={setLanguage}
                country={country}
                onCountryChange={setCountry}
                currency={currency}
                currencySymbol={currencySymbol}
              />
            </TabsContent>
            
            <TabsContent value="milestones" className="mt-6">
              <BusinessMilestonesSection
                businessStage={selectedStage}
                strategyData={strategyData}
                language={language}
              />
            </TabsContent>
            
            <TabsContent value="finances" className="mt-6">
              <MonthlyRevenueSection
                strategyData={strategyData}
                language={language}
                currency={currency}
                currencySymbol={currencySymbol}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6">
            African Business Strategy Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create a comprehensive business strategy tailored for the African market
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('templates')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Build Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Business Templates</h3>
            <p className="text-gray-600">Choose from 20+ pre-built templates for popular African businesses</p>
          </div>
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Milestone Trackers</h3>
            <p className="text-gray-600">Track business milestones based on your current stage and goals</p>
          </div>
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Financial Tracking</h3>
            <p className="text-gray-600">Monitor daily revenue and expenses with calendar-based entries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
