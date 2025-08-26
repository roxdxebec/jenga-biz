import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Target, Plus, Calendar as CalendarIcon, Trash2, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { addToCalendar } from '@/lib/calendar';
import CoachingTip from '@/components/CoachingTip';

interface Milestone {
  id: string;
  title: string;
  targetDate: Date | null;
  status: 'not-started' | 'in-progress' | 'complete' | 'overdue';
}

interface BusinessMilestonesSectionProps {
  isPro?: boolean;
  strategyData?: any;
  language?: string;
}

const BusinessMilestonesSection = ({ isPro = true, strategyData = null, language = 'en' }: BusinessMilestonesSectionProps) => {
  const [businessStage, setBusinessStage] = useState<'ideation' | 'early' | 'growth'>('ideation');
  const [customMilestone, setCustomMilestone] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    // Initialize with default milestones based on stage
    const defaultMilestones = [
      {
        id: '1',
        title: '',
        targetDate: null,
        status: 'not-started' as const
      },
      {
        id: '2', 
        title: '',
        targetDate: null,
        status: 'not-started' as const
      }
    ];
    return defaultMilestones;
  });

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
      overdue: 'Overdue',
      tier3Note: 'Enjoy full access to Strategy Grid Pro (Tier 3 features) while testing.',
      coachingTip: 'Break down big goals into smaller, actionable milestones. Each milestone should be specific and have a clear deadline.',
      addToCalendar: 'Add to Calendar',
      suggestedMilestonesFor: 'Suggested Milestones for',
      defaultMilestones: {
        registerBusiness: 'Register business name',
        openBankAccount: 'Open business bank account'
      }
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
      overdue: 'Umechelewa',
      tier3Note: 'Furahia ufikiaji kamili wa Strategy Grid Pro (vipengele vya Daraja la 3) wakati wa upimaji.',
      coachingTip: 'Gawanya malengo makubwa kuwa malengo madogo yanayoweza kutekelezwa. Kila lengo linapaswa kuwa mahususi na kuwa na tarehe ya mwisho ya wazi.',
      addToCalendar: 'Ongeza kwenye Kalenda',
      suggestedMilestonesFor: 'Malengo Yaliyopendekezwa kwa',
      defaultMilestones: {
        registerBusiness: 'Sajili jina la biashara',
        openBankAccount: 'Fungua akaunti ya benki ya biashara'
      }
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
      overdue: 'متأخر',
      tier3Note: 'استمتع بالوصول الكامل إلى Strategy Grid Pro (ميزات المستوى 3) أثناء الاختبار.',
      coachingTip: 'قسم الأهداف الكبيرة إلى معالم أصغر قابلة للتنفيذ. يجب أن يكون كل معلم محددًا وله موعد نهائي واضح.',
      addToCalendar: 'إضافة للتقويم',
      suggestedMilestonesFor: 'المعالم المقترحة لـ',
      defaultMilestones: {
        registerBusiness: 'تسجيل اسم الشركة',
        openBankAccount: 'فتح حساب مصرفي تجاري'
      }
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
      overdue: 'En Retard',
      tier3Note: 'Profitez d\'un accès complet à Strategy Grid Pro (fonctionnalités de niveau 3) pendant les tests.',
      coachingTip: 'Divisez les grands objectifs en jalons plus petits et réalisables. Chaque jalon doit être spécifique et avoir une échéance claire.',
      addToCalendar: 'Ajouter au Calendrier',
      suggestedMilestonesFor: 'Jalons Suggérés pour',
      defaultMilestones: {
        registerBusiness: 'Enregistrer le nom de l\'entreprise',
        openBankAccount: 'Ouvrir un compte bancaire professionnel'
      }
    }
  };

  const t = translations[language] || translations.en;

  const statusOptions = [
    { value: 'not-started', label: t.notStarted, color: 'bg-gray-100 text-gray-700' },
    { value: 'in-progress', label: t.inProgress, color: 'bg-blue-100 text-blue-700' },
    { value: 'complete', label: t.complete, color: 'bg-green-100 text-green-700' },
    { value: 'overdue', label: t.overdue, color: 'bg-red-100 text-red-700' }
  ];

  const businessStages = [
    { value: 'ideation', label: t.ideation, description: t.ideationDesc },
    { value: 'early', label: t.early, description: t.earlyDesc },
    { value: 'growth', label: t.growth, description: t.growthDesc }
  ];

  const getStageSpecificMilestones = (stage: string) => {
    const stageMilestones = {
      en: {
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
      },
      sw: {
        ideation: [
          'Thibitisha wazo la biashara na wateja watarajiwa',
          'Fanya utafiti wa soko lengwa na ushindani',
          'Unda mpango wa msingi wa biashara',
          'Pata fedha za awali au akiba'
        ],
        early: [
          'Sajili jina la biashara',
          'Fungua akaunti ya benki ya biashara',
          'Zindua bidhaa/huduma ya kimsingi',
          'Pata wateja 10 wa kwanza'
        ],
        growth: [
          'Panua matoleo ya bidhaa/huduma',
          'Ajiri wafanyakazi wa kwanza',
          'Unda ushirikiano',
          'Ongeza juhudi za masoko'
        ]
      },
      ar: {
        ideation: [
          'التحقق من فكرة العمل مع العملاء المحتملين',
          'بحث السوق المستهدف والمنافسة',
          'إنشاء خطة عمل أساسية',
          'تأمين التمويل الأولي أو المدخرات'
        ],
        early: [
          'تسجيل اسم الشركة',
          'فتح حساب مصرفي تجاري',
          'إطلاق المنتج/الخدمة الأساسية',
          'الحصول على أول 10 عملاء'
        ],
        growth: [
          'توسيع عروض المنتجات/الخدمات',
          'توظيف أول موظفين',
          'إقامة شراكات',
          'توسيع جهود التسويق'
        ]
      },
      fr: {
        ideation: [
          'Valider l\'idée d\'entreprise avec des clients potentiels',
          'Rechercher le marché cible et la concurrence',
          'Créer un plan d\'affaires de base',
          'Sécuriser le financement initial ou les économies'
        ],
        early: [
          'Enregistrer le nom de l\'entreprise',
          'Ouvrir un compte bancaire professionnel',
          'Lancer le produit/service minimal viable',
          'Obtenir les 10 premiers clients'
        ],
        growth: [
          'Élargir les offres de produits/services',
          'Embaucher les premiers employés',
          'Établir des partenariats',
          'Intensifier les efforts marketing'
        ]
      }
    };
    return stageMilestones[language]?.[stage] || stageMilestones.en[stage] || [];
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const addMilestone = (e?: React.FormEvent, title?: string) => {
    e?.preventDefault();
    const milestoneTitle = title || customMilestone.trim();
    
    if (!milestoneTitle) {
      toast({
        title: language === 'sw' ? 'Kosa' :
               language === 'ar' ? 'خطأ' :
               language === 'fr' ? 'Erreur' :
               'Error',
        description: language === 'sw' ? 'Tafadhali andika jina la lengo' :
                     language === 'ar' ? 'يرجى إدخال عنوان المعلم' :
                     language === 'fr' ? 'Veuillez entrer un titre de jalon' :
                     'Please enter a milestone title',
        variant: "destructive",
      });
      return;
    }

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: milestoneTitle,
      targetDate: null,
      status: 'not-started'
    };

    setMilestones([...milestones, newMilestone]);
    
    // Clear the custom milestone input if it was used
    if (!title) {
      setCustomMilestone('');
    }

    toast({
      title: language === 'sw' ? 'Lengo Limeongezwa' :
             language === 'ar' ? 'تم إضافة المعلم' :
             language === 'fr' ? 'Jalon Ajouté' :
             'Milestone Added',
      description: language === 'sw' ? 'Lengo jipya limeongezwa kwenye orodha yako' :
                   language === 'ar' ? 'تم إضافة معلم جديد إلى قائمتك' :
                   language === 'fr' ? 'Un nouveau jalon a été ajouté à votre liste' :
                   'New milestone added to your list',
    });
  };

  const addSuggestedMilestones = () => {
    const stageMilestones = getStageSpecificMilestones(businessStage);
    const newMilestones = stageMilestones.map(title => ({
      id: Date.now().toString() + Math.random().toString(),
      title,
      targetDate: null,
      status: 'not-started' as const
    }));
    
    setMilestones([...milestones, ...newMilestones]);
    
    toast({
      title: language === 'sw' ? 'Malengo Yameongezwa' :
             language === 'ar' ? 'تم إضافة المعالم' :
             language === 'fr' ? 'Jalons Ajoutés' :
             'Milestones Added',
      description: language === 'sw' ? `${stageMilestones.length} malengo yaliyopendekezwa yameongezwa` :
                   language === 'ar' ? `تم إضافة ${stageMilestones.length} معالم مقترحة` :
                   language === 'fr' ? `${stageMilestones.length} jalons suggérés ajoutés` :
                   `${stageMilestones.length} suggested milestones added`,
    });
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
    <div id="milestones-section" className="space-y-6">
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
            <CardTitle className="text-lg text-green-800">{t.suggestedMilestonesFor} {currentStage?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {getStageSpecificMilestones(businessStage).map((milestone, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center text-sm text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="flex-1">{milestone}</span>
                  </div>
                  <Button
                    onClick={() => addMilestone(undefined, milestone)}
                    size="sm"
                    variant="outline"
                    className="ml-3 text-green-600 border-green-300 hover:bg-green-100 px-3 py-1 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {language === 'sw' ? 'Ongeza' :
                     language === 'ar' ? 'إضافة' :
                     language === 'fr' ? 'Ajouter' :
                     'Add'}
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Input
                value={customMilestone}
                onChange={(e) => setCustomMilestone(e.target.value)}
                placeholder={t.enterTitle}
                className="w-full border-green-300 focus:border-green-400 focus:ring-green-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addMilestone();
                  }
                }}
              />
              <Button
                onClick={addMilestone}
                size="sm"
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50 w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.addMilestone}
              </Button>
            </div>
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
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="relative p-5 border rounded-xl bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 shadow-sm",
                      milestone.status === 'complete' ? "bg-green-500 border-green-500" :
                      milestone.status === 'in-progress' ? "bg-blue-500 border-blue-500" :
                      milestone.status === 'overdue' ? "bg-red-500 border-red-500" :
                      "bg-gray-300 border-gray-300"
                    )} />
                    {index < milestones.length - 1 && (
                      <div className="w-px h-20 bg-gray-200 mt-3" />
                    )}
                  </div>

                  {/* Milestone content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                        placeholder={t.enterTitle}
                        className="flex-1 border-gray-200 focus:border-orange-300 focus:ring-orange-200 text-sm"
                      />
                      <Button
                        onClick={() => deleteMilestone(milestone.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Target Date */}
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10 border-gray-200 hover:border-gray-300",
                                !milestone.targetDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                              {milestone.targetDate ? (
                                format(milestone.targetDate, "MMM dd, yyyy")
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
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Status */}
                      <div>
                        <Select 
                          value={milestone.status} 
                          onValueChange={(value) => updateMilestone(milestone.id, 'status', value)}
                        >
                          <SelectTrigger className="h-10 border-gray-200 hover:border-gray-300">
                            <SelectValue placeholder={t.selectStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <Badge 
                                    variant="secondary" 
                                    className={cn("text-xs", option.color)}
                                  >
                                    {option.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Add to Calendar Button */}
                      <div>
                        <Button
                          onClick={() => {
                            if (milestone.targetDate && milestone.title.trim()) {
                              const calendarEvent = {
                                title: `📅 ${milestone.title}`,
                                description: `Business milestone: ${milestone.title}\n\nStatus: ${milestone.status}\n${
                                  language === 'sw' ? 'Imeundwa na Jenga Biz Africa' :
                                  language === 'ar' ? 'تم إنشاؤه بواسطة Jenga Biz Africa' :
                                  language === 'fr' ? 'Créé avec Jenga Biz Africa' :
                                  'Created with Jenga Biz Africa'
                                }`,
                                startDate: milestone.targetDate,
                                endDate: milestone.targetDate,
                                location: 'Business Milestone'
                              };
                              addToCalendar(calendarEvent);
                              toast({
                                title: "Calendar Event",
                                description: "Milestone added to your calendar!",
                              });
                            } else {
                              toast({
                                title: "Missing Information",
                                description: "Please add a title and target date first.",
                                variant: "destructive",
                              });
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full h-10 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 text-blue-700 hover:text-blue-800"
                        >
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          {t.addToCalendar}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add More Button */}
            <div className="mt-6">
              <Button
                onClick={addMilestone}
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-gray-600 hover:text-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addMilestone}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessMilestonesSection;