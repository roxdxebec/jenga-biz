
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getTemplateData, TemplateData } from '@/data/templateData';

interface TemplateDropdownSelectorProps {
  onTemplateSelect: (template: TemplateData) => void;
  onBack?: () => void;
  language?: string;
}

const TemplateDropdownSelector = ({ onTemplateSelect, onBack, language = 'en' }: TemplateDropdownSelectorProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const translations = {
    en: {
      title: 'Choose Your Business Template',
      subtitle: 'Select a template that matches your business type to get started quickly',
      selectBusinessType: 'Select a Business Type',
      getStarted: 'Get Started',
      selectFirst: 'Please select a business type first',
      back: 'Back'
    },
    sw: {
      title: 'Chagua Kiolezo cha Biashara Yako',
      subtitle: 'Chagua kiolezo kinacholingana na aina ya biashara yako ili uanze haraka',
      selectBusinessType: 'Chagua Aina ya Biashara',
      getStarted: 'Anza',
      selectFirst: 'Tafadhali chagua aina ya biashara kwanza',
      back: 'Rudi'
    },
    ar: {
      title: 'اختر قالب عملك',
      subtitle: 'حدد قالباً يتناسب مع نوع عملك للبدء بسرعة',
      selectBusinessType: 'اختر نوع العمل',
      getStarted: 'ابدأ',
      selectFirst: 'يرجى اختيار نوع العمل أولاً',
      back: 'رجوع'
    },
    fr: {
      title: 'Choisissez Votre Modèle d\'Entreprise',
      subtitle: 'Sélectionnez un modèle qui correspond à votre type d\'entreprise pour commencer rapidement',
      selectBusinessType: 'Sélectionner un Type d\'Entreprise',
      getStarted: 'Commencer',
      selectFirst: 'Veuillez d\'abord sélectionner un type d\'entreprise',
      back: 'Retour'
    }
  };

  const templates = getTemplateData(language);
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
        {/* Back Button */}
        {onBack && (
          <div className="mb-6">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Button>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default TemplateDropdownSelector;
