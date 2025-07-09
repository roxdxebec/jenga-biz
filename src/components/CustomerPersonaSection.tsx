
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomerPersonaSectionProps {
  isPro?: boolean;
  strategyData?: any;
  language?: string;
}

const CustomerPersonaSection = ({ isPro = true, strategyData = null, language = 'en' }: CustomerPersonaSectionProps) => {
  const [selectedPersona, setSelectedPersona] = useState('');
  const [personaData, setPersonaData] = useState({
    name: '',
    ageRange: '',
    incomeLevel: '',
    values: [],
    painPoints: [],
    buyingChannel: '',
    behaviorSummary: ''
  });
  
  const { toast } = useToast();

  // Translation object
  const translations = {
    en: {
      title: 'Now define your ideal customer to refine your strategy',
      subtitle: 'Understanding your customer persona will help tailor your business strategy',
      selectPersona: 'Select a Customer Persona',
      choosePlaceholder: 'Choose a persona template or start from scratch',
      customPersona: 'Start from Scratch (Custom Persona)',
      budgetConscious: 'Budget-Conscious Buyer',
      aspirationalPro: 'Aspirational Middle-Income Professional',
      digitalNative: 'Informed Digital Native',
      traditionalShopper: 'Traditional Shopper',
      personaDetails: 'Persona Details',
      name: 'Name (Optional)',
      namePlaceholder: 'e.g., Sarah the Budget Shopper',
      ageRange: 'Age Range',
      incomeLevel: 'Income Level',
      topValues: 'Top 3 Values',
      behaviorSummary: 'Customer Behavior Summary',
      behaviorPlaceholder: 'One-sentence summary of this customer\'s behavior patterns...',
      strategicInsight: 'AI Strategic Insight',
      insightText: 'Strategic insights and personalized recommendations tailored specifically for this customer persona will appear here. Get detailed advice on how to position your product, what messaging resonates, and which channels work best...'
    },
    sw: {
      title: 'Sasa fafanua mteja wako bora ili kuboresha mkakati wako',
      subtitle: 'Kuelewa umbo la mteja wako kutasaidia kupanga mkakati wa biashara yako',
      selectPersona: 'Chagua Umbo la Mteja',
      choosePlaceholder: 'Chagua kiolezo cha umbo au anza kutoka mwanzo',
      customPersona: 'Anza Kutoka Mwanzo (Umbo la Kawaida)',
      budgetConscious: 'Mnunuzi Mwenye Uongozi wa Bajeti',
      aspirationalPro: 'Mtaalamu wa Kati Mwenye Malengo',
      digitalNative: 'Mzawa wa Kidijitali Mwenye Ujuzi',
      traditionalShopper: 'Mnunuzi wa Kitamaduni',
      personaDetails: 'Maelezo ya Umbo',
      name: 'Jina (Si Lazima)',
      namePlaceholder: 'k.m., Sarah Mnunuzi wa Bajeti',
      ageRange: 'Kipimo cha Umri',
      incomeLevel: 'Kiwango cha Mapato',
      topValues: 'Maadili 3 Bora',
      behaviorSummary: 'Muhtasari wa Tabia za Mteja',
      behaviorPlaceholder: 'Muhtasari wa sentensi moja wa mifumo ya tabia za mteja huyu...',
      strategicInsight: 'Maarifa ya Kimkakati ya AI',
      insightText: 'Maarifa ya kimkakati na mapendekezo ya kibinafsi yaliyopangwa maalum kwa umbo hili la mteja yataonekana hapa. Pata ushauri wa kina kuhusu jinsi ya kuweka bidhaa yako, ujumbe upi unaowavuta, na njia zipi zinafanya kazi vizuri zaidi...'
    },
    ar: {
      title: 'الآن حدد عميلك المثالي لتحسين استراتيجيتك',
      subtitle: 'فهم شخصية العميل سيساعد في تخصيص استراتيجية عملك',
      selectPersona: 'اختر شخصية العميل',
      choosePlaceholder: 'اختر قالب شخصية أو ابدأ من الصفر',
      customPersona: 'ابدأ من الصفر (شخصية مخصصة)',
      budgetConscious: 'المشتري الواعي بالميزانية',
      aspirationalPro: 'المحترف الطموح متوسط الدخل',
      digitalNative: 'الرقمي المطلع',
      traditionalShopper: 'المتسوق التقليدي',
      personaDetails: 'تفاصيل الشخصية',
      name: 'الاسم (اختياري)',
      namePlaceholder: 'مثال: سارة المتسوقة الموفرة',
      ageRange: 'الفئة العمرية',
      incomeLevel: 'مستوى الدخل',
      topValues: 'أهم 3 قيم',
      behaviorSummary: 'ملخص سلوك العميل',
      behaviorPlaceholder: 'ملخص من جملة واحدة لأنماط سلوك هذا العميل...',
      strategicInsight: 'رؤية استراتيجية بالذكاء الاصطناعي',
      insightText: 'الرؤى الاستراتيجية والتوصيات الشخصية المصممة خصيصاً لشخصية العميل هذه ستظهر هنا. احصل على نصائح مفصلة حول كيفية وضع منتجك، والرسائل المؤثرة، والقنوات الأكثر فعالية...'
    },
    fr: {
      title: 'Maintenant définissez votre client idéal pour affiner votre stratégie',
      subtitle: 'Comprendre votre persona client aidera à adapter votre stratégie commerciale',
      selectPersona: 'Sélectionner un Persona Client',
      choosePlaceholder: 'Choisissez un modèle de persona ou commencez de zéro',
      customPersona: 'Commencer de Zéro (Persona Personnalisé)',
      budgetConscious: 'Acheteur Soucieux du Budget',
      aspirationalPro: 'Professionnel Ambitieux à Revenu Moyen',
      digitalNative: 'Natif Numérique Informé',
      traditionalShopper: 'Acheteur Traditionnel',
      personaDetails: 'Détails du Persona',
      name: 'Nom (Optionnel)',
      namePlaceholder: 'ex: Sarah l\'Acheteuse Économe',
      ageRange: 'Tranche d\'Âge',
      incomeLevel: 'Niveau de Revenus',
      topValues: 'Top 3 des Valeurs',
      behaviorSummary: 'Résumé du Comportement Client',
      behaviorPlaceholder: 'Résumé en une phrase des modèles de comportement de ce client...',
      strategicInsight: 'Insight Stratégique IA',
      insightText: 'Les insights stratégiques et recommandations personnalisées adaptées spécifiquement à ce persona client apparaîtront ici. Obtenez des conseils détaillés sur comment positionner votre produit, quels messages résonnent, et quels canaux fonctionnent le mieux...'
    }
  };

  const t = translations[language] || translations.en;

  const personaTemplates = {
    'budget-conscious': {
      name: 'Budget-Conscious Buyer',
      ageRange: '25-45',
      incomeLevel: 'Low to Middle ($200-800/month)',
      values: ['Value for money', 'Durability', 'Practicality'],
      painPoints: ['Limited disposable income', 'Fear of making wrong purchases', 'Need for bulk buying'],
      buyingChannel: 'Local markets, wholesale stores, group buying',
      behaviorSummary: 'Researches extensively before purchase, compares prices, prefers proven products'
    },
    'aspirational-professional': {
      name: 'Aspirational Middle-Income Professional',
      ageRange: '28-40',
      incomeLevel: 'Middle ($500-1500/month)',
      values: ['Professional growth', 'Status improvement', 'Quality'],
      painPoints: ['Balancing quality vs price', 'Time constraints', 'Social expectations'],
      buyingChannel: 'Online shopping, branded stores, professional networks',
      behaviorSummary: 'Values brands that enhance professional image, willing to invest in quality'
    },
    'digital-native': {
      name: 'Informed Digital Native',
      ageRange: '18-35',
      incomeLevel: 'Varied ($300-1200/month)',
      values: ['Convenience', 'Innovation', 'Authenticity'],
      painPoints: ['Information overload', 'Trust in online vendors', 'Delivery reliability'],
      buyingChannel: 'Mobile apps, social media, e-commerce platforms',
      behaviorSummary: 'Researches online, influenced by reviews and social proof, expects seamless digital experience'
    },
    'traditional-shopper': {
      name: 'Traditional Shopper',
      ageRange: '35-60',
      incomeLevel: 'Low to Middle ($250-900/month)',
      values: ['Personal relationships', 'Trust', 'Tradition'],
      painPoints: ['Skeptical of new methods', 'Prefers face-to-face interaction', 'Payment security concerns'],
      buyingChannel: 'Local shops, markets, word-of-mouth recommendations',
      behaviorSummary: 'Values personal relationships with vendors, prefers tried and tested products'
    }
  };

  const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];
  const incomeLevels = [
    'Low ($0-500/month)',
    'Lower Middle ($500-1000/month)',
    'Middle ($1000-2000/month)',
    'Upper Middle ($2000-4000/month)',
    'High ($4000+/month)'
  ];
  
  const availableValues = [
    'Value for money', 'Quality', 'Convenience', 'Status', 'Innovation',
    'Tradition', 'Community support', 'Environmental impact', 'Health benefits'
  ];

  const handlePersonaSelect = (value) => {
    setSelectedPersona(value);
    if (value === 'custom') {
      setPersonaData({
        name: '',
        ageRange: '',
        incomeLevel: '',
        values: [],
        painPoints: [],
        buyingChannel: '',
        behaviorSummary: ''
      });
    } else if (personaTemplates[value]) {
      setPersonaData(personaTemplates[value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600">
          {t.subtitle}
        </p>
      </div>

      {/* Persona Selection */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            {t.selectPersona}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedPersona} 
            onValueChange={handlePersonaSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.choosePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">{t.customPersona}</SelectItem>
              <SelectItem value="budget-conscious">{t.budgetConscious}</SelectItem>
              <SelectItem value="aspirational-professional">{t.aspirationalPro}</SelectItem>
              <SelectItem value="digital-native">{t.digitalNative}</SelectItem>
              <SelectItem value="traditional-shopper">{t.traditionalShopper}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Persona Form */}
      {selectedPersona && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle>{t.personaDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.name}</label>
              <Input
                value={personaData.name}
                onChange={(e) => setPersonaData({...personaData, name: e.target.value})}
                placeholder={t.namePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.ageRange}</label>
              <Select 
                value={personaData.ageRange} 
                onValueChange={(value) => setPersonaData({...personaData, ageRange: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.incomeLevel}</label>
              <Select 
                value={personaData.incomeLevel} 
                onValueChange={(value) => setPersonaData({...personaData, incomeLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income level" />
                </SelectTrigger>
                <SelectContent>
                  {incomeLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.topValues}</label>
              <div className="flex flex-wrap gap-2">
                {availableValues.slice(0, 6).map(value => (
                  <Badge
                    key={value}
                    variant={personaData.values.includes(value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newValues = personaData.values.includes(value)
                        ? personaData.values.filter(v => v !== value)
                        : personaData.values.length < 3
                        ? [...personaData.values, value]
                        : personaData.values;
                      setPersonaData({...personaData, values: newValues});
                    }}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.behaviorSummary}</label>
              <Textarea
                value={personaData.behaviorSummary}
                onChange={(e) => setPersonaData({...personaData, behaviorSummary: e.target.value})}
                placeholder={t.behaviorPlaceholder}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Strategic Insight */}
      {selectedPersona && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
              {t.strategicInsight}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-green-800">
                <strong>Strategic Insight:</strong> This persona responds well to {personaData.values.join(', ').toLowerCase()} messaging. 
                Focus your marketing on addressing their key concerns through {personaData.buyingChannel} to maximize conversion.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerPersonaSection;
