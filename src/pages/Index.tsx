
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Users, Target, TrendingUp, BookOpen, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import StrategyBuilder from '@/components/StrategyBuilder';
import TemplateSelector from '@/components/TemplateSelector';
import UserDashboard from '@/components/UserDashboard';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // home, templates, builder, dashboard
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { toast } = useToast();

  const languages = {
    en: 'English',
    sw: 'Kiswahili',
    ar: 'العربية',
    fr: 'Français'
  };

  const translations = {
    en: {
      title: 'Strategy Grid',
      subtitle: 'Empowering African Entrepreneurs',
      description: 'Build winning business strategies with tools designed for African markets',
      getStarted: 'Get Started',
      login: 'Login',
      features: {
        templates: 'Local Business Templates',
        templatesDesc: 'Pre-built strategies for common African businesses',
        ai: 'AI-Powered Insights',
        aiDesc: 'Get smart recommendations tailored to your market',
        mobile: 'Mobile-First Design',
        mobileDesc: 'Built for entrepreneurs on the go',
        multilingual: 'Multi-Language Support',
        multilingualDesc: 'Available in English, Kiswahili, Arabic, and French'
      },
      csr: 'Free for Kuza Catalyst Partners',
      commercial: 'Powered by Strategy Grid Ltd'
    },
    sw: {
      title: 'Strategy Grid',
      subtitle: 'Kuwezesha Wajasiriamali wa Afrika',
      description: 'Jenga mikakati ya biashara ya kushinda kwa zana zilizotengenezwa kwa masoko ya Afrika',
      getStarted: 'Anza',
      login: 'Ingia',
      features: {
        templates: 'Violezo vya Biashara za Ndani',
        templatesDesc: 'Mikakati iliyojengwa tayari kwa biashara za kawaida za Afrika',
        ai: 'Maarifa ya AI',
        aiDesc: 'Pata mapendekezo ya akili yanayofaa soko lako',
        mobile: 'Muundo wa Kwanza wa Simu',
        mobileDesc: 'Imejengwa kwa wajasiriamali wanaosafiri',
        multilingual: 'Msaada wa Lugha Nyingi',
        multilingualDesc: 'Inapatikana kwa Kiingereza, Kiswahili, Kiarabu, na Kifaransa'
      },
      csr: 'Bure kwa Washirika wa Kuza Catalyst',
      commercial: 'Inaendeshwa na Strategy Grid Ltd'
    }
  };

  const currentTranslation = translations[currentLanguage] || translations.en;

  const handleAuth = (success) => {
    if (success) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setCurrentView('dashboard');
      toast({
        title: "Welcome to Strategy Grid!",
        description: "You're now ready to build your business strategy.",
      });
    }
  };

  const handleTemplateSelect = (template) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTemplate(template);
    setCurrentView('builder');
  };

  const handleStartFromScratch = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTemplate(null);
    setCurrentView('builder');
  };

  if (currentView === 'dashboard' && isAuthenticated) {
    return <UserDashboard onBackToHome={() => setCurrentView('home')} onNewStrategy={() => setCurrentView('templates')} />;
  }

  if (currentView === 'builder') {
    return (
      <StrategyBuilder 
        template={selectedTemplate}
        onBack={() => setCurrentView('templates')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'templates') {
    return (
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{currentTranslation.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-32">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isAuthenticated ? (
              <Button onClick={() => setCurrentView('dashboard')} variant="outline">
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} variant="outline">
                {currentTranslation.login}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            {currentTranslation.subtitle}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {currentTranslation.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              onClick={() => setCurrentView('templates')}
            >
              {currentTranslation.getStarted}
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAuthModal(true)}
              >
                {currentTranslation.login}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentTranslation.features.templates}</h3>
              <p className="text-sm text-gray-600">{currentTranslation.features.templatesDesc}</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentTranslation.features.ai}</h3>
              <p className="text-sm text-gray-600">{currentTranslation.features.aiDesc}</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentTranslation.features.mobile}</h3>
              <p className="text-sm text-gray-600">{currentTranslation.features.mobileDesc}</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentTranslation.features.multilingual}</h3>
              <p className="text-sm text-gray-600">{currentTranslation.features.multilingualDesc}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              <span className="text-gray-600">{currentTranslation.commercial}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">{currentTranslation.csr}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
};

export default Index;
