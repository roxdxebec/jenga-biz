
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shirt, Tractor, Smartphone, Monitor, Sparkles, Calendar, Camera, Truck, Scissors, Car, PenTool, ChefHat, GraduationCap, Dumbbell, Baby, Share2, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  language?: string;
}

const TemplateSelector = ({ onTemplateSelect, language = 'en' }: TemplateSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    en: {
      title: 'Choose Your Business Template',
      subtitle: 'Select a template that matches your business type to get started quickly',
      searchPlaceholder: 'Search business templates...',
      getStarted: 'Get Started'
    },
    sw: {
      title: 'Chagua Kiolezo cha Biashara Yako',
      subtitle: 'Chagua kiolezo kinacholingana na aina ya biashara yako ili uanze haraka',
      searchPlaceholder: 'Tafuta violezo vya biashara...',
      getStarted: 'Anza'
    },
    ar: {
      title: 'اختر قالب عملك',
      subtitle: 'حدد قالباً يتناسب مع نوع عملك للبدء بسرعة',
      searchPlaceholder: 'البحث في قوالب الأعمال...',
      getStarted: 'ابدأ'
    },
    fr: {
      title: 'Choisissez Votre Modèle d\'Entreprise',
      subtitle: 'Sélectionnez un modèle qui correspond à votre type d\'entreprise pour commencer rapidement',
      searchPlaceholder: 'Rechercher des modèles d\'entreprise...',
      getStarted: 'Commencer'
    }
  };

  const templates: Template[] = [
    {
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      icon: Shirt,
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items'
    },
    {
      id: 'agribusiness',
      name: language === 'sw' ? 'Biashara ya Kilimo' : language === 'ar' ? 'الأعمال الزراعية' : language === 'fr' ? 'Agrobusiness' : 'Agribusiness',
      icon: Tractor,
      description: language === 'sw' ? 'Kilimo, mifugo, na bidhaa za kilimo' : language === 'ar' ? 'الزراعة وتربية المواشي والمنتجات الزراعية' : language === 'fr' ? 'Agriculture, élevage et produits agricoles' : 'Farming, livestock, and agricultural products'
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : language === 'ar' ? 'وكيل الأموال المحمولة' : language === 'fr' ? 'Agent d\'Argent Mobile' : 'Mobile Money Agent',
      icon: Smartphone,
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : language === 'ar' ? 'الخدمات المالية الإلكترونية' : language === 'fr' ? 'Services financiers électroniques' : 'Electronic financial services'
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      icon: Monitor,
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services'
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      icon: Monitor,
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals'
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : language === 'ar' ? 'خدمات التنظيف' : language === 'fr' ? 'Services de Nettoyage' : 'Cleaning Services',
      icon: Sparkles,
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : language === 'ar' ? 'تنظيف المنازل والمكاتب' : language === 'fr' ? 'Nettoyage de maisons et bureaux' : 'Home and office cleaning'
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : language === 'ar' ? 'تنظيم الفعاليات' : language === 'fr' ? 'Organisation d\'Événements' : 'Event Planning',
      icon: Calendar,
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : language === 'ar' ? 'تنظيم الأعراس والحفلات والفعاليات' : language === 'fr' ? 'Organisation de mariages, fêtes et événements' : 'Weddings, parties, and celebrations'
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      icon: Camera,
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services'
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      icon: Truck,
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery'
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      icon: Scissors,
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services'
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      icon: Car,
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance'
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      icon: Car,
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery'
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creator',
      icon: PenTool,
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services'
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      icon: ChefHat,
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries'
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      icon: GraduationCap,
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support'
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      icon: Dumbbell,
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching'
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      icon: Baby,
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision'
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Services',
      icon: Share2,
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing'
    }
  ];

  const t = translations[language] || translations.en;

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.subtitle}
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-shadow duration-200 border-orange-200 hover:border-orange-300"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 text-sm">
                    {template.description}
                  </p>
                  <Button
                    onClick={() => onTemplateSelect(template)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {t.getStarted}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'sw' ? 'Hakuna violezo vilivyopatikana' : 
               language === 'ar' ? 'لم يتم العثور على قوالب' :
               language === 'fr' ? 'Aucun modèle trouvé' :
               'No templates found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
