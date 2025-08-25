
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Target, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CoachingTip from '@/components/CoachingTip';

interface Milestone {
  id: string;
  title: string;
  targetDate: Date | null;
  status: 'not-started' | 'in-progress' | 'complete';
}

interface BusinessMilestonesSectionProps {
  isPro?: boolean;
  strategyData?: any;
  language?: string;
}

const BusinessMilestonesSection = ({ isPro = true, strategyData = null, language = 'en' }: BusinessMilestonesSectionProps) => {
  const [businessStage, setBusinessStage] = useState<'ideation' | 'early' | 'growth'>('ideation');
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Register business name',
      targetDate: null,
      status: 'not-started'
    },
    {
      id: '2',
      title: 'Open business bank account',
      targetDate: null,
      status: 'not-started'
    }
  ]);

  const { toast } = useToast();

  // Translation object
  const translations = {
    en: {
      title: 'Business Milestones',
      subtitle: 'Track your business goals and stay focused on progress.',
      businessStage: 'Business Stage',
      ideation: 'Ideation',
      early: 'Early Stage',
      growth: 'Growth Stage',
      ideationDesc: 'Still exploring business ideas or validating a concept.',
      earlyDesc: 'Launched and selling, still refining operations or product.',
      growthDesc: 'Established with regular income, focused on expansion.',
      yourMilestones: 'Your Milestones',
      addMilestone: 'Add Milestone',
      enterTitle: 'Enter milestone title',
      pickDate: 'Pick target date',
      selectStatus: 'Select status',
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      complete: 'Complete',
      tier3Note: 'Enjoy full access to Strategy Grid Pro (Tier 3 features) while testing.',
      coachingTip: 'Break down big goals into smaller, actionable milestones. Each milestone should be specific and have a clear deadline.'
    },
    sw: {
      title: 'Malengo ya Biashara',
      subtitle: 'Fuatilia malengo yako ya biashara na uongozane na maendeleo.',
      businessStage: 'Hatua ya Biashara',
      ideation: 'Wazo',
      early: 'Hatua ya Awali',
      growth: 'Hatua ya Ukuaji',
      ideationDesc: 'Bado ninachunguza mawazo ya biashara au kuthibitisha dhana.',
      earlyDesc: 'Imeanzishwa na kuuza, bado ninaboresha uendeshaji au bidhaa.',
      growthDesc: 'Imesimamishwa na mapato ya kawaida, inalenga upanuzi.',
      yourMilestones: 'Malengo Yako',
      addMilestone: 'Ongeza Lengo',
      enterTitle: 'Ingiza kichwa cha lengo',
      pickDate: 'Chagua tarehe ya lengo',
      selectStatus: 'Chagua hali',
      notStarted: 'Haijuaanza',
      inProgress: 'Inaendelea',
      complete: 'Imekamilika',
      tier3Note: 'Furahia ufikiaji kamili wa Strategy Grid Pro (vipengele vya Daraja la 3) wakati wa upimaji.',
      coachingTip: 'Gawanya malengo makubwa kuwa malengo madogo yanayoweza kutekelezwa. Kila lengo linapaswa kuwa mahususi na kuwa na tarehe ya mwisho ya wazi.'
    },
    ar: {
      title: 'معالم الأعمال',
      subtitle: 'تتبع أهداف عملك وحافظ على التركيز على التقدم.',
      businessStage: 'مرحلة الأعمال',
      ideation: 'التفكير',
      early: 'المرحلة المبكرة',
      growth: 'مرحلة النمو',
      ideationDesc: 'لا تزال تستكشف أفكار تجارية أو تتحقق من مفهوم.',
      earlyDesc: 'تم الإطلاق والبيع، لا تزال تحسن العمليات أو المنتج.',
      growthDesc: 'راسخة مع دخل منتظم، تركز على التوسع.',
      yourMilestones: 'معالمك',
      addMilestone: 'إضافة معلم',
      enterTitle: 'أدخل عنوان المعلم',
      pickDate: 'اختر التاريخ المستهدف',
      selectStatus: 'اختر الحالة',
      notStarted: 'لم تبدأ',
      inProgress: 'قيد التنفيذ',
      complete: 'مكتمل',
      tier3Note: 'استمتع بالوصول الكامل إلى Strategy Grid Pro (ميزات المستوى 3) أثناء الاختبار.',
      coachingTip: 'قسم الأهداف الكبيرة إلى معالم أصغر قابلة للتنفيذ. يجب أن يكون كل معلم محددًا وله موعد نهائي واضح.'
    },
    fr: {
      title: 'Jalons d\'Affaires',
      subtitle: 'Suivez vos objectifs commerciaux et restez concentré sur les progrès.',
      businessStage: 'Étape d\'Affaires',
      ideation: 'Idéation',
      early: 'Étape Précoce',
      growth: 'Étape de Croissance',
      ideationDesc: 'Explore encore des idées d\'affaires ou valide un concept.',
      earlyDesc: 'Lancé et vendant, affine encore les opérations ou le produit.',
      growthDesc: 'Établi avec un revenu régulier, axé sur l\'expansion.',
      yourMilestones: 'Vos Jalons',
      addMilestone: 'Ajouter un Jalon',
      enterTitle: 'Entrez le titre du jalon',
      pickDate: 'Choisir la date cible',
      selectStatus: 'Sélectionner le statut',
      notStarted: 'Pas Commencé',
      inProgress: 'En Cours',
      complete: 'Terminé',
      tier3Note: 'Profitez d\'un accès complet à Strategy Grid Pro (fonctionnalités de niveau 3) pendant les tests.',
      coachingTip: 'Divisez les grands objectifs en jalons plus petits et réalisables. Chaque jalon doit être spécifique et avoir une échéance claire.'
    }
  };

  const t = translations[language] || translations.en;

  const statusOptions = [
    { value: 'not-started', label: t.notStarted, color: 'bg-gray-100 text-gray-700' },
    { value: 'in-progress', label: t.inProgress, color: 'bg-blue-100 text-blue-700' },
    { value: 'complete', label: t.complete, color: 'bg-green-100 text-green-700' }
  ];

  const businessStages = [
    { value: 'ideation', label: t.ideation, description: t.ideationDesc },
    { value: 'early', label: t.early, description: t.earlyDesc },
    { value: 'growth', label: t.growth, description: t.growthDesc }
  ];

  const getStageSpecificMilestones = (stage: string) => {
    const stageMilestones = {
      ideation: [
        'Validate business idea with potential customers',
        'Research target market and competition',
        'Create basic business plan',
        'Secure initial funding or savings'
      ],
      early: [
        'Register business name',
        'Open business bank account',
        'Launch minimum viable product/service',
        'Get first 10 customers'
      ],
      growth: [
        'Expand product/service offerings',
        'Hire first employees',
        'Establish partnerships',
        'Scale marketing efforts'
      ]
    };
    return stageMilestones[stage] || [];
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const addMilestone = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      targetDate: null,
      status: 'not-started'
    };

    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const currentStage = businessStages.find(stage => stage.value === businessStage);

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

      {/* Tier 3 Note */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800 text-center">
          {t.tier3Note}
        </p>
      </div>

      {/* Coaching Tip */}
      <CoachingTip tip={t.coachingTip} language={language} />

      {/* Business Stage Selector */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">{t.businessStage}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={businessStage} onValueChange={(value: 'ideation' | 'early' | 'growth') => setBusinessStage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {businessStages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  <div>
                    <div className="font-medium">{stage.label}</div>
                    <div className="text-sm text-gray-500">{stage.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentStage && (
            <p className="text-sm text-gray-600 mt-2">{currentStage.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Milestones for Current Stage */}
      {getStageSpecificMilestones(businessStage).length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Suggested Milestones for {currentStage?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {getStageSpecificMilestones(businessStage).slice(0, 2).map((milestone, index) => (
                <li key={index} className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {milestone}
                </li>
              ))}
            </ul>
            <Button
              onClick={addMilestone}
              size="sm"
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50 w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addMilestone}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Milestones List */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            {t.yourMilestones}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.slice(0, 2).map((milestone, index) => (
              <div
                key={milestone.id}
                className="relative p-4 border rounded-lg bg-white border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2",
                      milestone.status === 'complete' ? "bg-green-500 border-green-500" :
                      milestone.status === 'in-progress' ? "bg-blue-500 border-blue-500" :
                      "bg-gray-300 border-gray-300"
                    )} />
                    {index < Math.min(2, milestones.length) - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Milestone content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          placeholder={t.enterTitle}
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={() => deleteMilestone(milestone.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Target Date */}
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !milestone.targetDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {milestone.targetDate ? (
                                format(milestone.targetDate, "PPP")
                              ) : (
                                <span>{t.pickDate}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={milestone.targetDate}
                              onSelect={(date) => updateMilestone(milestone.id, 'targetDate', date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Status */}
                      <div className="flex-1">
                        <Select
                          value={milestone.status}
                          onValueChange={(value) => updateMilestone(milestone.id, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <Badge className={option.color} variant="secondary">
                                  {option.label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Milestone Button after first 2 milestones */}
            {milestones.length >= 2 && (
              <div className="flex justify-start py-4">
                <Button
                  onClick={addMilestone}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addMilestone}
                </Button>
              </div>
            )}
            
            {/* Show remaining milestones after the button */}
            {milestones.slice(2).map((milestone, index) => (
              <div
                key={milestone.id}
                className="relative p-4 border rounded-lg bg-white border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2",
                      milestone.status === 'complete' ? "bg-green-500 border-green-500" :
                      milestone.status === 'in-progress' ? "bg-blue-500 border-blue-500" :
                      "bg-gray-300 border-gray-300"
                    )} />
                    {(index + 2) < milestones.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Milestone content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          placeholder={t.enterTitle}
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={() => deleteMilestone(milestone.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Target Date */}
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !milestone.targetDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {milestone.targetDate ? (
                                format(milestone.targetDate, "PPP")
                              ) : (
                                <span>{t.pickDate}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={milestone.targetDate}
                              onSelect={(date) => updateMilestone(milestone.id, 'targetDate', date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Status */}
                      <div className="flex-1">
                        <Select
                          value={milestone.status}
                          onValueChange={(value) => updateMilestone(milestone.id, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <Badge className={option.color} variant="secondary">
                                  {option.label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show Add Milestone button if less than 2 milestones */}
            {milestones.length < 2 && (
              <div className="flex justify-start py-4">
                <Button
                  onClick={addMilestone}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addMilestone}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessMilestonesSection;
