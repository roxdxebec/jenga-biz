
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import ShareModal from '@/components/ShareModal';

interface StrategySummaryProps {
  strategy: any;
  onBack: () => void;
  onHome: () => void;
  language?: string;
}

const StrategySummary = ({ strategy, onBack, onHome, language = 'en' }: StrategySummaryProps) => {
  const translations = {
    en: {
      strategySummary: 'Strategy Summary',
      backToBuilder: 'Back to Builder',
      home: 'Home',
      businessName: 'Business Name',
      vision: 'Vision Statement',
      mission: 'Mission Statement',
      targetMarket: 'Target Market',
      revenueModel: 'Revenue Model',
      valueProposition: 'Unique Value Proposition',
      keyPartners: 'Key Partners',
      marketingApproach: 'Marketing Approach',
      operationalNeeds: 'Operational Needs',
      growthGoals: 'Growth Goals'
    },
    sw: {
      strategySummary: 'Muhtasari wa Mkakati',
      backToBuilder: 'Rudi kwa Mjenzi',
      home: 'Nyumbani',
      businessName: 'Jina la Biashara',
      vision: 'Kauli ya Maono',
      mission: 'Kauli ya Dhumuni',
      targetMarket: 'Soko la Lengo',
      revenueModel: 'Mfumo wa Mapato',
      valueProposition: 'Thamani ya Kipekee',
      keyPartners: 'Washirika Wakuu',
      marketingApproach: 'Mbinu za Uuzaji',
      operationalNeeds: 'Mahitaji ya Uendeshaji',
      growthGoals: 'Malengo ya Ukuaji'
    },
    ar: {
      strategySummary: 'ملخص الاستراتيجية',
      backToBuilder: 'العودة إلى المنشئ',
      home: 'الرئيسية',
      businessName: 'اسم الشركة',
      vision: 'بيان الرؤية',
      mission: 'بيان المهمة',
      targetMarket: 'السوق المستهدف',
      revenueModel: 'نموذج الإيرادات',
      valueProposition: 'اقتراح القيمة الفريدة',
      keyPartners: 'الشركاء الرئيسيون',
      marketingApproach: 'نهج التسويق',
      operationalNeeds: 'الاحتياجات التشغيلية',
      growthGoals: 'أهداف النمو'
    },
    fr: {
      strategySummary: 'Résumé de la Stratégie',
      backToBuilder: 'Retour au Constructeur',
      home: 'Accueil',
      businessName: 'Nom de l\'Entreprise',
      vision: 'Déclaration de Vision',
      mission: 'Déclaration de Mission',
      targetMarket: 'Marché Cible',
      revenueModel: 'Modèle de Revenus',
      valueProposition: 'Proposition de Valeur Unique',
      keyPartners: 'Partenaires Clés',
      marketingApproach: 'Approche Marketing',
      operationalNeeds: 'Besoins Opérationnels',
      growthGoals: 'Objectifs de Croissance'
    }
  };

  const t = translations[language] || translations.en;

  const sections = [
    { key: 'businessName', label: t.businessName },
    { key: 'vision', label: t.vision },
    { key: 'mission', label: t.mission },
    { key: 'targetMarket', label: t.targetMarket },
    { key: 'revenueModel', label: t.revenueModel },
    { key: 'valueProposition', label: t.valueProposition },
    { key: 'keyPartners', label: t.keyPartners },
    { key: 'marketingApproach', label: t.marketingApproach },
    { key: 'operationalNeeds', label: t.operationalNeeds },
    { key: 'growthGoals', label: t.growthGoals }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToBuilder}
            </Button>
            <h1 className="text-xl font-bold text-gray-800">{t.strategySummary}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              {t.home}
            </Button>
            <ShareModal strategy={strategy} language={language} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {sections.map((section) => (
              <Card key={section.key} className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-800">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {strategy[section.key] || 'Not specified'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategySummary;
