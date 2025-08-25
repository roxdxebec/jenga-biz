import { useState } from 'react';
import TemplateDropdownSelector from '@/components/TemplateDropdownSelector';
import StrategyBuilder from '@/components/StrategyBuilder';
import MonthlyRevenueSection from '@/components/MonthlyRevenueSection';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import LanguageSelector from '@/components/LanguageSelector';
import ShareModal from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { Globe, Home, Save, Download, Bot, ArrowLeft } from 'lucide-react';
import { TemplateData } from '@/data/templateData';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('KE');
  const [strategyData, setStrategyData] = useState(null);

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
      back: 'Back'
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
      back: 'Rudi'
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
      back: 'رجوع'
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
      back: 'Retour'
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
      alert('Strategy saved successfully!');
    } else {
      alert('No strategy data to save');
    }
  };

  const generateAISummary = () => {
    if (!strategyData || !strategyData.businessName) {
      alert('Please complete your strategy first');
      return;
    }
    
    const summary = `
📈 Business Strategy Summary for ${strategyData.businessName || 'Your Business'}

🎯 Vision: ${strategyData.vision || 'Not defined'}
🚀 Mission: ${strategyData.mission || 'Not defined'}
👥 Target Market: ${strategyData.targetMarket || 'Not defined'}
💰 Revenue Model: ${strategyData.revenueModel || 'Not defined'}
⭐ Value Proposition: ${strategyData.valueProposition || 'Not defined'}
🤝 Key Partners: ${strategyData.keyPartners || 'Not defined'}
📢 Marketing: ${strategyData.marketingApproach || 'Not defined'}
⚙️ Operations: ${strategyData.operationalNeeds || 'Not defined'}
📊 Growth Goals: ${strategyData.growthGoals || 'Not defined'}

Created with Jenga Biz Africa ✨
    `;
    
    alert(`AI Summary Generated!\n\n${summary}`);
  };

  const downloadSummary = () => {
    if (!strategyData || !strategyData.businessName) {
      alert('Please complete your strategy first');
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
          
          <div>
            <BusinessMilestonesSection
              strategyData={strategyData}
              language={language}
            />
          </div>
          
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

          {/* Final Summary Section */}
          <div className="bg-white p-6 rounded-lg border border-blue-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Business Strategy Summary
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

      {/* Key Features Section - Above buttons for better context */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">Business Templates</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Choose from 15+ pre-built templates specifically designed for popular African businesses and market needs</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">Milestone Tracking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Set and track business milestones based on your current stage and growth goals with deadlines</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">Financial Tracking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Monitor daily revenue and expenses with calendar-based entries and generate financial reports</p>
          </div>
        </div>
        
        {/* Clear Call to Action */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to build your business strategy?</h2>
          <p className="text-gray-600 mb-8">Choose your preferred starting point:</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setCurrentView('templates')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex-1 max-w-xs relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.useTemplates}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <button
              onClick={handleStartFromScratch}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex-1 max-w-xs relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t.startFromScratch}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Templates:</strong> Quick start with proven business models</p>
            <p><strong>From Scratch:</strong> Build a completely custom strategy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;