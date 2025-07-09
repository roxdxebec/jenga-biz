
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
      yourMilestones: 'Your Milestones',
      addMilestone: 'Add Milestone',
      enterTitle: 'Enter milestone title',
      pickDate: 'Pick target date',
      selectStatus: 'Select status',
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      complete: 'Complete'
    },
    sw: {
      title: 'Malengo ya Biashara',
      subtitle: 'Fuatilia malengo yako ya biashara na uongozane na maendeleo.',
      yourMilestones: 'Malengo Yako',
      addMilestone: 'Ongeza Lengo',
      enterTitle: 'Ingiza kichwa cha lengo',
      pickDate: 'Chagua tarehe ya lengo',
      selectStatus: 'Chagua hali',
      notStarted: 'Haijuaanza',
      inProgress: 'Inaendelea',
      complete: 'Imekamilika'
    },
    ar: {
      title: 'معالم الأعمال',
      subtitle: 'تتبع أهداف عملك وحافظ على التركيز على التقدم.',
      yourMilestones: 'معالمك',
      addMilestone: 'إضافة معلم',
      enterTitle: 'أدخل عنوان المعلم',
      pickDate: 'اختر التاريخ المستهدف',
      selectStatus: 'اختر الحالة',
      notStarted: 'لم تبدأ',
      inProgress: 'قيد التنفيذ',
      complete: 'مكتمل'
    },
    fr: {
      title: 'Jalons d\'Affaires',
      subtitle: 'Suivez vos objectifs commerciaux et restez concentré sur les progrès.',
      yourMilestones: 'Vos Jalons',
      addMilestone: 'Ajouter un Jalon',
      enterTitle: 'Entrez le titre du jalon',
      pickDate: 'Choisir la date cible',
      selectStatus: 'Sélectionner le statut',
      notStarted: 'Pas Commencé',
      inProgress: 'En Cours',
      complete: 'Terminé'
    }
  };

  const t = translations[language] || translations.en;

  const statusOptions = [
    { value: 'not-started', label: t.notStarted, color: 'bg-gray-100 text-gray-700' },
    { value: 'in-progress', label: t.inProgress, color: 'bg-blue-100 text-blue-700' },
    { value: 'complete', label: t.complete, color: 'bg-green-100 text-green-700' }
  ];

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const addMilestone = () => {
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

      {/* Milestones List */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              {t.yourMilestones}
            </div>
            <Button
              onClick={addMilestone}
              size="sm"
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addMilestone}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="relative p-4 border rounded-lg bg-white border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2",
                      milestone.status === 'complete' ? "bg-green-500 border-green-500" :
                      milestone.status === 'in-progress' ? "bg-blue-500 border-blue-500" :
                      "bg-gray-300 border-gray-300"
                    )} />
                    {index < milestones.length - 1 && (
                      <div className="w-px h-12 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Milestone content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                        placeholder={t.enterTitle}
                        className="flex-1 mr-2"
                      />
                      <Button
                        onClick={() => deleteMilestone(milestone.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessMilestonesSection;
