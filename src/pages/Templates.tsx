import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home, BarChart3, User, LogOut } from 'lucide-react';
import { getTemplateData } from '@/data/templateData';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/hooks/useAuth';

const Templates = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState('en');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  const templates = getTemplateData(language);

  const translations = {
    en: {
      title: 'Choose Your Business Template',
      subtitle: 'Select a template that matches your business type to get started quickly',
      selectTemplate: 'Select a Business Type',
      getStarted: 'Get Started',
      back: 'Back',
      home: 'Home',
      signOut: 'Sign Out'
    },
    sw: {
      title: 'Chagua Kiolezo cha Biashara Yako',
      subtitle: 'Chagua kiolezo kinachofaa aina ya biashara yako ili uanze haraka',
      selectTemplate: 'Chagua Aina ya Biashara',
      getStarted: 'Anza',
      back: 'Rudi',
      home: 'Nyumbani',
      signOut: 'Toka'
    },
    ar: {
      title: 'اختر قالب عملك',
      subtitle: 'اختر قالباً يطابق نوع عملك للبدء بسرعة',
      selectTemplate: 'اختر نوع العمل',
      getStarted: 'ابدأ',
      back: 'رجوع',
      home: 'الرئيسية',
      signOut: 'تسجيل الخروج'
    },
    fr: {
      title: 'Choisissez Votre Modèle d\'Entreprise',
      subtitle: 'Sélectionnez un modèle qui correspond à votre type d\'entreprise pour commencer rapidement',
      selectTemplate: 'Sélectionner un Type d\'Entreprise',
      getStarted: 'Commencer',
      back: 'Retour',
      home: 'Accueil',
      signOut: 'Se Déconnecter'
    }
  };

  const t = translations[language] || translations.en;

  const handleGetStarted = () => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        navigate('/strategy', { state: { template, language } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <img src="/src/assets/jenga-biz-logo.png" alt="Jenga Biz Africa" className="h-12 w-auto" />
            
            {/* Mobile-responsive navigation - Match Index.tsx */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Home className="w-4 h-4" />
                {t.home}
              </Button>
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
                    navigate('/auth');
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Template Selection Card */}
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">{t.selectTemplate}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectTemplate} />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleGetStarted}
              disabled={!selectedTemplateId}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg"
            >
              {t.getStarted}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Templates;