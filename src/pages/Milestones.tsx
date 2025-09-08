import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import LanguageSelector from '@/components/LanguageSelector';

const Milestones = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const translations = {
    en: { back: 'Back', home: 'Home' },
    sw: { back: 'Rudi', home: 'Nyumbani' },
    ar: { back: 'رجوع', home: 'الرئيسية' },
    fr: { back: 'Retour', home: 'Accueil' }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t.home}
              </Button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Jenga Biz Africa</h1>
            <LanguageSelector 
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BusinessMilestonesSection language={language} />
      </main>
    </div>
  );
};

export default Milestones;