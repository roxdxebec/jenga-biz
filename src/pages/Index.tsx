import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Target, DollarSign, LogOut, User, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Jenga Biz Africa',
      subtitle: 'Build Your Business Strategy for the African Market',
      signOut: 'Sign Out',
      features: {
        templates: {
          title: 'Business Templates',
          description: 'Choose from 15+ pre-built templates specifically designed for popular African businesses and market needs',
          buttonText: 'Use Templates'
        },
        strategy: {
          title: 'Custom Strategy', 
          description: 'Build a completely custom business strategy from scratch with all features included - perfect for unique business models',
          buttonText: 'Start from Scratch'
        },
        milestones: {
          title: 'Milestone Tracking',
          description: 'Set and track business milestones based on your current stage and growth goals with deadlines',
          buttonText: 'Track Milestones'
        },
        financial: {
          title: 'Financial Tracking',
          description: 'Monitor daily revenue and expenses with calendar-based entries and generate financial reports',
          buttonText: 'Track Finances'
        }
      }
    },
    sw: {
      title: 'Jenga Biz Africa',
      subtitle: 'Jenga Mkakati wa Biashara Yako kwa Soko la Afrika',
      signOut: 'Toka',
      features: {
        templates: {
          title: 'Violezo vya Biashara',
          description: 'Chagua kutoka violezo 15+ vilivyotengenezwa maalum kwa biashara maarufu za Afrika na mahitaji ya soko',
          buttonText: 'Tumia Violezo'
        },
        strategy: {
          title: 'Mkakati wa Kawaida',
          description: 'Jenga mkakati wa biashara wa kipekee kutoka mwanzo hadi mwisho na vipengele vyote vimejumuishwa - bora kwa mifano ya kipekee ya biashara',
          buttonText: 'Anza Kutoka Mwanzo'
        },
        milestones: {
          title: 'Ufuatiliaji wa Malengo',
          description: 'Weka na fuatilia malengo ya biashara kulingana na hatua yako ya sasa na malengo ya ukuaji na tarehe za mwisho',
          buttonText: 'Fuatilia Malengo'
        },
        financial: {
          title: 'Ufuatiliaji wa Kifedha',
          description: 'Fuatilia mapato na matumizi ya kila siku na maingizo ya kalenda na tengeneza ripoti za kifedha',
          buttonText: 'Fuatilia Fedha'
        }
      }
    },
    ar: {
      title: 'جنجا بيز أفريقيا',
      subtitle: 'ابني استراتيجية عملك للسوق الأفريقي',
      signOut: 'تسجيل الخروج',
      features: {
        templates: {
          title: 'قوالب الأعمال',
          description: 'اختر من أكثر من 15 قالب مسبق الصنع مصمم خصيصاً للأعمال الأفريقية الشائعة واحتياجات السوق',
          buttonText: 'استخدم القوالب'
        },
        strategy: {
          title: 'استراتيجية مخصصة',
          description: 'ابني استراتيجية عمل مخصصة تماماً من الصفر مع تضمين جميع الميزات - مثالي للنماذج التجارية الفريدة',
          buttonText: 'ابدأ من الصفر'
        },
        milestones: {
          title: 'تتبع المعالم',
          description: 'ضع وتتبع معالم العمل بناءً على مرحلتك الحالية وأهداف النمو مع المواعيد النهائية',
          buttonText: 'تتبع المعالم'
        },
        financial: {
          title: 'التتبع المالي',
          description: 'راقب الإيرادات والمصروفات اليومية مع إدخالات تستند إلى التقويم وأنشئ تقارير مالية',
          buttonText: 'تتبع الأموال'
        }
      }
    },
    fr: {
      title: 'Jenga Biz Africa',
      subtitle: 'Construisez Votre Stratégie d\'Entreprise pour le Marché Africain',
      signOut: 'Se Déconnecter',
      features: {
        templates: {
          title: 'Modèles d\'Entreprise',
          description: 'Choisissez parmi plus de 15 modèles pré-construits spécialement conçus pour les entreprises africaines populaires et les besoins du marché',
          buttonText: 'Utiliser les Modèles'
        },
        strategy: {
          title: 'Stratégie Personnalisée',
          description: 'Construisez une stratégie d\'entreprise complètement personnalisée à partir de zéro avec toutes les fonctionnalités incluses - parfait pour les modèles d\'entreprise uniques',
          buttonText: 'Commencer de Zéro'
        },
        milestones: {
          title: 'Suivi des Jalons',
          description: 'Définissez et suivez les jalons d\'entreprise basés sur votre étape actuelle et vos objectifs de croissance avec des échéances',
          buttonText: 'Suivre les Jalons'
        },
        financial: {
          title: 'Suivi Financier',
          description: 'Surveillez les revenus et dépenses quotidiens avec des entrées basées sur le calendrier et générez des rapports financiers',
          buttonText: 'Suivre les Finances'
        }
      }
    }
  };

  const t = translations[language] || translations.en;

  const features = [
    {
      icon: FileText,
      title: t.features.templates.title,
      description: t.features.templates.description,
      buttonText: t.features.templates.buttonText,
      buttonColor: 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      onClick: () => navigate('/templates', { state: { language } })
    },
    {
      icon: Zap,
      title: t.features.strategy.title,
      description: t.features.strategy.description,
      buttonText: t.features.strategy.buttonText,
      buttonColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/strategy', { state: { language } })
    },
    {
      icon: Target,
      title: t.features.milestones.title,
      description: t.features.milestones.description,
      buttonText: t.features.milestones.buttonText,
      buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/milestones')
    },
    {
      icon: DollarSign,
      title: t.features.financial.title,
      description: t.features.financial.description,
      buttonText: t.features.financial.buttonText,
      buttonColor: 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      onClick: () => navigate('/financial-tracker')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t.signOut}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`${feature.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button 
                    onClick={feature.onClick}
                    className={`w-full ${feature.buttonColor} text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;