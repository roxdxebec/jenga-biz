import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shirt, Tractor, Smartphone, Monitor, Sparkles, Calendar, Camera, Truck, Scissors, Car, PenTool, ChefHat, GraduationCap, Dumbbell, Baby, Share2, Search } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Template {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface DropdownTemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  onStartFromScratch?: () => void;
  onBack?: () => void;
  language?: string;
}

const DropdownTemplateSelector = ({ onTemplateSelect, onStartFromScratch, onBack, language = 'en' }: DropdownTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { trackTemplateUsage, trackJourney } = useAnalytics();

  useEffect(() => {
    trackJourney('/template-selector', 'page_view', { language });
  }, [language, trackJourney]);

  const translations = {
    en: {
      title: 'Choose Your Business Template',
      subtitle: 'Select a template that matches your business type to get started quickly',
      selectTemplate: 'Select a template...',
      getStarted: 'Get Started',
      startFromScratch: 'Start from Scratch (Custom Business)',
      searchPlaceholder: 'Search templates...'
    },
    sw: {
      title: 'Chagua Kiolezo cha Biashara Yako',
      subtitle: 'Chagua kiolezo kinacholingana na aina ya biashara yako ili uanze haraka',
      selectTemplate: 'Chagua kiolezo...',
      getStarted: 'Anza',
      startFromScratch: 'Anza Mwanzo (Biashara ya Kawaida)',
      searchPlaceholder: 'Tafuta violezo...'
    }
  };

  const templates: Template[] = [
    {
      id: 'agribusiness',
      name: language === 'sw' ? 'Biashara ya Kilimo' : 'Agribusiness',
      icon: Tractor,
      description: language === 'sw' ? 'Kilimo, mifugo, na bidhaa za kilimo' : 'Farming, livestock, and agricultural products'
    },
    {
      id: 'auto-repair',
      name: language === 'sw' ? 'Huduma za Ukarabati wa Magari' : 'Auto Repair Services',
      icon: Car,
      description: language === 'sw' ? 'Ukarabati na matengenezo ya magari' : 'Vehicle repair and maintenance'
    },
    {
      id: 'bakery',
      name: language === 'sw' ? 'Biashara ya Mkate' : 'Bakery',
      icon: ChefHat,
      description: language === 'sw' ? 'Kuoka mkate na keki' : 'Baking bread, cakes, and pastries'
    },
    {
      id: 'beauty-salon',
      name: language === 'sw' ? 'Salon ya Urembo na Ukonyaji' : 'Beauty Salon & Barber Shop',
      icon: Scissors,
      description: language === 'sw' ? 'Huduma za urembo na unyolaji' : 'Beauty and grooming services'
    },
    {
      id: 'boda-boda',
      name: language === 'sw' ? 'Biashara ya Boda Boda' : 'Boda Boda Business',
      icon: Car,
      description: language === 'sw' ? 'Usafiri wa boda boda na upeperishaji' : 'Motorcycle transport and delivery'
    },
    {
      id: 'cleaning-services',
      name: language === 'sw' ? 'Huduma za Usafi' : 'Cleaning Services',
      icon: Sparkles,
      description: language === 'sw' ? 'Usafi wa nyumba na makazi' : 'Home and office cleaning'
    },
    {
      id: 'cyber-cafe',
      name: language === 'sw' ? 'Cyber Café' : 'Cyber Café',
      icon: Monitor,
      description: language === 'sw' ? 'Huduma za intaneti na kielektroniki' : 'Internet and computer services'
    },
    {
      id: 'daycare',
      name: language === 'sw' ? 'Huduma za Malezi ya Watoto' : 'Daycare Services',
      icon: Baby,
      description: language === 'sw' ? 'Malezi na uangalizi wa watoto' : 'Child care and supervision'
    },
    {
      id: 'event-planning',
      name: language === 'sw' ? 'Upangaji wa Matukio' : 'Event Planning',
      icon: Calendar,
      description: language === 'sw' ? 'Kupanga harusi, sherehe na matukio' : 'Weddings, parties, and celebrations'
    },
    {
      id: 'fitness-training',
      name: language === 'sw' ? 'Mazoezi ya Mwili' : 'Fitness Training',
      icon: Dumbbell,
      description: language === 'sw' ? 'Mafunzo ya mazoezi na afya' : 'Personal training and fitness coaching'
    },
    {
      id: 'food-delivery',
      name: language === 'sw' ? 'Huduma za Upeperishaji Chakula' : 'Food Delivery Services',
      icon: Truck,
      description: language === 'sw' ? 'Upeperishaji wa chakula na vinywaji' : 'Food and beverage delivery'
    },
    {
      id: 'freelance-writing',
      name: language === 'sw' ? 'Uandishi wa Kujitegemea' : 'Freelance Writing & Content Creator',
      icon: PenTool,
      description: language === 'sw' ? 'Uandishi na utengenezaji maudhui' : 'Writing and content creation services'
    },
    {
      id: 'mitumba',
      name: language === 'sw' ? 'Biashara ya Mitumba' : 'Second-Hand Clothing (Mitumba)',
      icon: Shirt,
      description: language === 'sw' ? 'Uuzaji wa nguo za mitumba na bidhaa za mtindo' : 'Selling second-hand clothes and fashion items'
    },
    {
      id: 'mobile-money',
      name: language === 'sw' ? 'Wakala wa Pesa za Simu' : 'Mobile Money Agent',
      icon: Smartphone,
      description: language === 'sw' ? 'Huduma za kifedha za kielektroniki' : 'Electronic financial services'
    },
    {
      id: 'photography',
      name: language === 'sw' ? 'Upigaji Picha na Video' : 'Photography & Videography',
      icon: Camera,
      description: language === 'sw' ? 'Huduma za upigaji picha na video' : 'Professional photo and video services'
    },
    {
      id: 'real-estate',
      name: language === 'sw' ? 'Wakala wa Mali Isiyohamishika' : 'Real Estate Agency',
      icon: Monitor,
      description: language === 'sw' ? 'Uuzaji na kukodisha mali' : 'Property sales and rentals'
    },
    {
      id: 'social-media',
      name: language === 'sw' ? 'Huduma za Mitandao ya Kijamii' : 'Social Media Services',
      icon: Share2,
      description: language === 'sw' ? 'Usimamizi wa mitandao ya kijamii' : 'Social media management and marketing'
    },
    {
      id: 'tutoring',
      name: language === 'sw' ? 'Huduma za Ufundishaji' : 'Tutoring Services',
      icon: GraduationCap,
      description: language === 'sw' ? 'Mafunzo ya kibinafsi na darasa' : 'Private lessons and academic support'
    }
  ].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  const t = translations[language] || translations.en;

  const handleTemplateSelect = () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      trackTemplateUsage(template.id, template.name, 'selected');
      trackJourney('/template-selector', 'button_click', { 
        action: 'template_selected',
        templateId: template.id,
        templateName: template.name 
      });
      onTemplateSelect(template);
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

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

        {/* Start from Scratch Option */}
        {onStartFromScratch && (
          <div className="mb-8">
            <Card className="border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {t.startFromScratch}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6 text-sm">
                  {language === 'sw' ? 'Unda mkakati wa kibinafsi kutoka mwanzo' : 'Create a custom strategy from scratch'}
                </p>
                <Button
                  onClick={() => {
                    trackJourney('/template-selector', 'button_click', { 
                      action: 'start_from_scratch' 
                    });
                    onStartFromScratch?.();
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {t.getStarted}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Template Dropdown Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Select Business Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-full text-lg p-6">
                <SelectValue placeholder={t.selectTemplate} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <SelectItem key={template.id} value={template.id} className="p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Selected Template Preview */}
            {selectedTemplateData && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <selectedTemplateData.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedTemplateData.name}</h3>
                      <p className="text-gray-600">{selectedTemplateData.description}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTemplateSelect}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    size="lg"
                  >
                    {t.getStarted}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!selectedTemplate && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a template from the dropdown above to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DropdownTemplateSelector;