import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// ...select components intentionally omitted in this page
import { ArrowLeft, Home, BarChart3, User, LogOut, Loader2, Eye } from 'lucide-react';
import { useBusinessTemplates } from '@/hooks/useBusinessTemplates';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/hooks/useAuth';
import { TemplatePreview } from '@/components/TemplatePreview';

const Templates = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [language, setLanguage] = useState<'en' | 'sw' | 'ar' | 'fr'>('en');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  
  const { templates, loading, error } = useBusinessTemplates();

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

  const t = translations[language as keyof typeof translations] || translations.en;

  // (handleGetStarted removed - templates navigate via direct selection)

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template);
  };

  const handleSelectTemplate = (template: any) => {
    setPreviewTemplate(null);
    // Convert database template to the format expected by the strategy page
    const templateData = {
      id: template.id,
      name: template.name,
      description: template.description,
      content: template.template_config
    };
    navigate('/strategy', { state: { template: templateData, language } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <img src="/jenga-biz-logo.png" alt="Jenga Biz Africa" className="h-12 w-auto" />
            
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
                            onLanguageChange={(lang: string) => setLanguage(lang as any)}
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
                    navigate('/');
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading templates...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load templates: {error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {template.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewTemplate(template)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              onClick={() => handleSelectTemplate(template)}
                              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                            >
                              {t.getStarted}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onSelect={handleSelectTemplate}
          onClose={() => setPreviewTemplate(null)}
          language={language}
        />
      )}
    </div>
  );
};

export default Templates;
