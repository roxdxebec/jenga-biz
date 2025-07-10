
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateDropdownSelectorProps {
  onTemplateSelect: (template: Template) => void;
  onStartFromScratch?: () => void;
  language?: string;
}

const TemplateDropdownSelector = ({ onTemplateSelect, onStartFromScratch, language = 'en' }: TemplateDropdownSelectorProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const translations = {
    en: {
      title: 'Choose Your Business Template',
      subtitle: 'Select a template that matches your business type to get started quickly',
      selectBusinessType: 'Select a Business Type',
      buildFromScratch: 'Build from Scratch (Custom Business)',
      buildFromScratchDesc: 'Create a custom strategy from the ground up',
      getStarted: 'Get Started',
      selectFirst: 'Please select a business type first'
    },
    sw: {
      title: 'Chagua Kiolezo cha Biashara Yako',
      subtitle: 'Chagua kiolezo kinacholingana na aina ya biashara yako ili uanze haraka',
      selectBusinessType: 'Chagua Aina ya Biashara',
      buildFromScratch: 'Jenga kutoka Mwanzo (Biashara ya Kawaida)',
      buildFromScratchDesc: 'Unda mkakati wa kibinafsi kutoka chini kabisa',
      getStarted: 'Anza',
      selectFirst: 'Tafadhali chagua aina ya biashara kwanza'
    },
    ar: {
      title: 'اختر قالب عملك',
      subtitle: 'حدد قالباً يتناسب مع نوع عملك للبدء بسرعة',
      selectBusinessType: 'اختر نوع العمل',
      buildFromScratch: 'ابدأ من الصفر (عمل مخصص)',
      buildFromScratchDesc: 'إنشاء استراتيجية مخصصة من الألف إلى الياء',
      getStarted: 'ابدأ',
      selectFirst: 'يرجى اختيار نوع العمل أولاً'
    },
    fr: {
      title: 'Choisissez Votre Modèle d\'Entreprise',
      subtitle: 'Sélectionnez un modèle qui correspond à votre type d\'entreprise pour commencer rapidement',
      selectBusinessType: 'Sélectionner un Type d\'Entreprise',
      buildFromScratch: 'Construire de Zéro (Entreprise Personnalisée)',
      buildFromScratchDesc: 'Créer une stratégie personnalisée à partir de zéro',
      getStarted: 'Commencer',
      selectFirst: 'Veuillez d\'abord sélectionner un type d\'entreprise'
    }
  };

  const templates: Template[] = [
    {
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : language === 'ar' ? 'تجارة الملابس المستعملة' : language === 'fr' ? 'Commerce de Vêtements d\'Occasion' : 'Second-Hand Clothing (Mitumba)',
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : language === 'ar' ? 'بيع الملابس المستعملة ومنتجات الأزياء' : language === 'fr' ? 'Vente de vêtements d\'occasion et produits de mode' : 'Selling second-hand clothes and fashion items'
    },
    {
      id: 'agribusiness',
      name: language === 'sw' ? 'Biashara ya Kilimo' : language === 'ar' ? 'الأعمال الزراعية' : language === 'fr' ? 'Agrobusiness' : 'Agribusiness',
      description: language === 'sw' ? 'Kilimo, mifugo, na bidhaa za kilimo' : language === 'ar' ? 'الزراعة وتربية المواشي والمنتجات الزراعية' : language === 'fr' ? 'Agriculture, élevage et produits agricoles' : 'Farming, livestock, and agricultural products'
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : language === 'ar' ? 'وكيل الأموال المحمولة' : language === 'fr' ? 'Agent d\'Argent Mobile' : 'Mobile Money Agent',
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : language === 'ar' ? 'الخدمات المالية الإلكترونية' : language === 'fr' ? 'Services financiers électroniques' : 'Electronic financial services'
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : language === 'ar' ? 'مقهى إنترنت' : language === 'fr' ? 'Cybercafé' : 'Cyber Café',
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : language === 'ar' ? 'خدمات الإنترنت والإلكترونيات' : language === 'fr' ? 'Services internet et électroniques' : 'Internet and computer services'
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : language === 'ar' ? 'وكالة العقارات' : language === 'fr' ? 'Agence Immobilière' : 'Real Estate Agency',
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : language === 'ar' ? 'بيع وتأجير العقارات' : language === 'fr' ? 'Vente et location immobilière' : 'Property sales and rentals'
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : language === 'ar' ? 'خدمات التنظيف' : language === 'fr' ? 'Services de Nettoyage' : 'Cleaning Services',
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : language === 'ar' ? 'تنظيف المنازل والمكاتب' : language === 'fr' ? 'Nettoyage de maisons et bureaux' : 'Home and office cleaning'
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : language === 'ar' ? 'تنظيم الفعاليات' : language === 'fr' ? 'Organisation d\'Événements' : 'Event Planning',
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : language === 'ar' ? 'تنظيم الأعراس والحفلات والفعاليات' : language === 'fr' ? 'Organisation de mariages, fêtes et événements' : 'Weddings, parties, and celebrations'
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : language === 'ar' ? 'التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Photographie et Vidéographie' : 'Photography & Videography',
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : language === 'ar' ? 'خدمات التصوير الفوتوغرافي والفيديو' : language === 'fr' ? 'Services de photographie et vidéographie' : 'Professional photo and video services'
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : language === 'ar' ? 'خدمات توصيل الطعام' : language === 'fr' ? 'Services de Livraison de Nourriture' : 'Food Delivery Services',
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : language === 'ar' ? 'توصيل الطعام والمشروبات' : language === 'fr' ? 'Livraison de nourriture et boissons' : 'Food and beverage delivery'
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : language === 'ar' ? 'صالون تجميل وحلاقة' : language === 'fr' ? 'Salon de Beauté et Coiffure' : 'Beauty Salon & Barber Shop',
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : language === 'ar' ? 'خدمات التجميل والحلاقة' : language === 'fr' ? 'Services de beauté et coiffure' : 'Beauty and grooming services'
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : language === 'ar' ? 'خدمات إصلاح السيارات' : language === 'fr' ? 'Services de Réparation Auto' : 'Auto Repair Services',
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : language === 'ar' ? 'إصلاح وصيانة السيارات' : language === 'fr' ? 'Réparation et entretien automobile' : 'Vehicle repair and maintenance'
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : language === 'ar' ? 'أعمال الدراجات النارية' : language === 'fr' ? 'Business de Moto-taxi' : 'Boda Boda Business',
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : language === 'ar' ? 'نقل الدراجات النارية والتوصيل' : language === 'fr' ? 'Transport et livraison en moto-taxi' : 'Motorcycle transport and delivery'
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : language === 'ar' ? 'الكتابة المستقلة' : language === 'fr' ? 'Rédaction Freelance' : 'Freelance Writing & Content Creator',
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : language === 'ar' ? 'الكتابة وإنشاء المحتوى' : language === 'fr' ? 'Rédaction et création de contenu' : 'Writing and content creation services'
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : language === 'ar' ? 'مخبز' : language === 'fr' ? 'Boulangerie' : 'Bakery',
      description: language === 'sw' ? 'Kuoka mkate na keki' : language === 'ar' ? 'خبز الخبز والكعك' : language === 'fr' ? 'Cuisson de pain et gâteaux' : 'Baking bread, cakes, and pastries'
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : language === 'ar' ? 'خدمات التدريس' : language === 'fr' ? 'Services de Tutorat' : 'Tutoring Services',
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : language === 'ar' ? 'التعليم الخاص والفصول الدراسية' : language === 'fr' ? 'Enseignement privé et cours' : 'Private lessons and academic support'
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : language === 'ar' ? 'التدريب البدني' : language === 'fr' ? 'Entraînement Fitness' : 'Fitness Training',
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : language === 'ar' ? 'تدريب اللياقة البدنية والصحة' : language === 'fr' ? 'Entraînement de fitness et santé' : 'Personal training and fitness coaching'
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : language === 'ar' ? 'خدمات رعاية الأطفال' : language === 'fr' ? 'Services de Garde d\'Enfants' : 'Daycare Services',
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : language === 'ar' ? 'رعاية ومراقبة الأطفال' : language === 'fr' ? 'Garde et surveillance d\'enfants' : 'Child care and supervision'
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : language === 'ar' ? 'خدمات وسائل التواصل الاجتماعي' : language === 'fr' ? 'Services de Médias Sociaux' : 'Social Media Services',
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : language === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' : language === 'fr' ? 'Gestion des médias sociaux' : 'Social media management and marketing'
    }
  ];

  const t = translations[language] || translations.en;

  const handleGetStarted = () => {
    if (!selectedTemplateId) {
      alert(t.selectFirst);
      return;
    }

    const selectedTemplate = templates.find(template => template.id === selectedTemplateId);
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.subtitle}
          </p>
        </div>

        {/* Template Dropdown */}
        <Card className="mb-8 border-orange-200">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {t.selectBusinessType}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder={t.selectBusinessType} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id} className="py-3">
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12 text-lg font-semibold"
              disabled={!selectedTemplateId}
            >
              {t.getStarted}
            </Button>
          </CardContent>
        </Card>

        {/* Build from Scratch Option */}
        {onStartFromScratch && (
          <Card className="border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {t.buildFromScratch}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 text-sm">
                {t.buildFromScratchDesc}
              </p>
              <Button
                onClick={onStartFromScratch}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {t.getStarted}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplateDropdownSelector;
