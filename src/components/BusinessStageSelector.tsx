
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Rocket, TrendingUp } from 'lucide-react';

interface BusinessStageSelectorProps {
  selectedStage?: string;
  onStageSelect: (stage: string) => void;
  language?: string;
}

const BusinessStageSelector = ({ selectedStage, onStageSelect, language = 'en' }: BusinessStageSelectorProps) => {
  const translations = {
    en: {
      title: 'What Stage is Your Business?',
      subtitle: 'Select your current business stage to get personalized recommendations',
      ideation: {
        title: 'Ideation',
        description: 'Still exploring business ideas.',
        details: 'Perfect for those who are brainstorming, researching market opportunities, or validating business concepts.'
      },
      earlyStage: {
        title: 'Early Stage',
        description: 'Started operations, still building foundation.',
        details: 'You have launched your business but are still establishing processes, building customer base, and refining your offering.'
      },
      growth: {
        title: 'Growth',
        description: 'Business has traction, looking to scale.',
        details: 'Your business is generating consistent revenue and you\'re ready to expand operations, enter new markets, or increase capacity.'
      },
      select: 'Select This Stage'
    },
    sw: {
      title: 'Biashara Yako Iko Hatua Gani?',
      subtitle: 'Chagua hatua ya sasa ya biashara yako kupata mapendekezo ya kibinafsi',
      ideation: {
        title: 'Kuunda Wazo',
        description: 'Bado ninachunguza mawazo ya biashara.',
        details: 'Bora kwa wale wanaotafuta mawazo, kuchunguza fursa za soko, au kuthibitisha dhana za biashara.'
      },
      earlyStage: {
        title: 'Hatua ya Awali',
        description: 'Nimeanza shughuli, bado ninajenga msingi.',
        details: 'Umezindua biashara yako lakini bado unaanzisha michakato, kujenga msingi wa wateja, na kuboresha utoaji wako.'
      },
      growth: {
        title: 'Ukuaji',
        description: 'Biashara ina mvuto, ninataka kupanua.',
        details: 'Biashara yako inazalisha mapato ya mara kwa mara na uko tayari kupanua shughuli, kuingia masoko mapya, au kuongeza uwezo.'
      },
      select: 'Chagua Hatua Hii'
    },
    ar: {
      title: 'في أي مرحلة عملك؟',
      subtitle: 'اختر المرحلة الحالية لعملك للحصول على توصيات شخصية',
      ideation: {
        title: 'تكوين الفكرة',
        description: 'ما زلت أستكشف أفكار الأعمال.',
        details: 'مثالي لأولئك الذين يقومون بالعصف الذهني أو البحث في فرص السوق أو التحقق من مفاهيم الأعمال.'
      },
      earlyStage: {
        title: 'المرحلة المبكرة',
        description: 'بدأت العمليات، ما زلت أبني الأساس.',
        details: 'لقد أطلقت عملك لكنك ما زلت تضع العمليات وتبني قاعدة العملاء وتحسن عرضك.'
      },
      growth: {
        title: 'النمو',
        description: 'العمل له جذب، أريد التوسع.',
        details: 'عملك يولد إيرادات ثابتة وأنت مستعد لتوسيع العمليات أو دخول أسواق جديدة أو زيادة القدرة.'
      },
      select: 'اختر هذه المرحلة'
    },
    fr: {
      title: 'À Quel Stade Est Votre Entreprise?',
      subtitle: 'Sélectionnez votre stade d\'entreprise actuel pour obtenir des recommandations personnalisées',
      ideation: {
        title: 'Idéation',
        description: 'J\'explore encore des idées d\'entreprise.',
        details: 'Parfait pour ceux qui font du brainstorming, recherchent des opportunités de marché ou valident des concepts d\'entreprise.'
      },
      earlyStage: {
        title: 'Stade Précoce',
        description: 'J\'ai commencé les opérations, je construis encore les fondations.',
        details: 'Vous avez lancé votre entreprise mais vous établissez encore les processus, construisez une base de clients et affinez votre offre.'
      },
      growth: {
        title: 'Croissance',
        description: 'L\'entreprise a de la traction, je cherche à évoluer.',
        details: 'Votre entreprise génère des revenus cohérents et vous êtes prêt à étendre les opérations, entrer dans de nouveaux marchés ou augmenter la capacité.'
      },
      select: 'Sélectionner Cette Étape'
    }
  };

  const t = translations[language] || translations.en;

  const stages = [
    {
      id: 'ideation',
      title: t.ideation.title,
      description: t.ideation.description,
      details: t.ideation.details,
      icon: Lightbulb,
      color: 'blue'
    },
    {
      id: 'early-stage',
      title: t.earlyStage.title,
      description: t.earlyStage.description,
      details: t.earlyStage.details,
      icon: Rocket,
      color: 'orange'
    },
    {
      id: 'growth',
      title: t.growth.title,
      description: t.growth.description,
      details: t.growth.details,
      icon: TrendingUp,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedStage === stage.id;
          
          return (
            <Card 
              key={stage.id} 
              className={`transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? `border-${stage.color}-300 bg-${stage.color}-50 shadow-lg` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onStageSelect(stage.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 bg-${stage.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 text-${stage.color}-600`} />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {stage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 font-medium">
                  {stage.description}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {stage.details}
                </p>
                <Button
                  className={`w-full ${
                    isSelected 
                      ? `bg-${stage.color}-600 hover:bg-${stage.color}-700` 
                      : `bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-600 hover:from-${stage.color}-600 hover:to-${stage.color}-700`
                  } text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStageSelect(stage.id);
                  }}
                >
                  {t.select}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessStageSelector;
