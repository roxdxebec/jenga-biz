
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface CoachingTipProps {
  tip: string;
  language?: string;
}

const CoachingTip = ({ tip, language = 'en' }: CoachingTipProps) => {
  const translations = {
    en: { tipLabel: 'Tip' },
    sw: { tipLabel: 'Kidokezo' },
    ar: { tipLabel: 'نصيحة' },
    fr: { tipLabel: 'Conseil' }
  };

  const t = translations[language] || translations.en;

  return (
    <Card className="border-blue-200 bg-blue-50 mb-4">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Lightbulb className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">{t.tipLabel}:</h4>
            <p className="text-sm text-blue-700">{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachingTip;
