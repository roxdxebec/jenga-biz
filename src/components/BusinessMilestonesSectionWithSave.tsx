import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Target, Plus, Calendar as CalendarIcon, Trash2, CalendarPlus, ArrowLeft, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { addToCalendar } from '@/lib/calendar';
import CoachingTip from '@/components/CoachingTip';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Milestone {
  id: string;
  title: string;
  targetDate: Date | null;
  status: 'not-started' | 'in-progress' | 'complete' | 'overdue';
}

interface BusinessMilestonesSectionWithSaveProps {
  isPro?: boolean;
  strategyData?: any;
  language?: string;
  onMilestonesChange?: (milestones: Milestone[]) => void;
}

const BusinessMilestonesSectionWithSave = ({ 
  isPro = true, 
  strategyData = null, 
  language = 'en', 
  onMilestonesChange 
}: BusinessMilestonesSectionWithSaveProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businessStage, setBusinessStage] = useState<'ideation' | 'early' | 'growth'>('ideation');
  const [customMilestone, setCustomMilestone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Helper function to get stage-specific milestones
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
      }
    };
    return stageMilestones[language]?.[stage] || stageMilestones.en[stage] || [];
  };

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const { toast } = useToast();
  const { trackBusinessMilestone, trackJourney } = useAnalytics();

  // Load milestones from database
  useEffect(() => {
    if (user) {
      loadMilestones();
    }
  }, [user]);

  const loadMilestones = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedMilestones = data.map(milestone => ({
          id: milestone.id,
          title: milestone.title,
          targetDate: milestone.target_date ? new Date(milestone.target_date) : null,
          status: milestone.status as 'not-started' | 'in-progress' | 'complete' | 'overdue'
        }));
        setMilestones(formattedMilestones);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };

  const saveToDatabase = async (milestone: Milestone) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('milestones')
        .insert({
          user_id: user.id,
          title: milestone.title,
          target_date: milestone.targetDate?.toISOString(),
          status: milestone.status,
          strategy_id: null // Can be linked to strategy later
        });

      if (error) throw error;
      
      toast({
        title: "Saved",
        description: "Milestone saved successfully"
      });
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: "Error",
        description: "Failed to save milestone",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateInDatabase = async (milestone: Milestone) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('milestones')
        .update({
          title: milestone.title,
          target_date: milestone.targetDate?.toISOString(),
          status: milestone.status
        })
        .eq('id', milestone.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  useEffect(() => {
    // Track milestone section page view
    trackJourney('/milestones', 'page_view', { 
      businessStage: businessStage,
      totalMilestones: milestones.length 
    });
  }, [trackJourney, businessStage, milestones.length]);

  // Translation object
  const translations = {
    en: {
      title: 'Business Milestones',
      subtitle: 'Track your business goals and stay focused on progress.',
      businessStage: 'Business Stage',
      ideation: 'Concept Stage',
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
      back: 'Back',
      home: 'Home'
    },
    sw: {
      title: 'Malengo ya Biashara',
      subtitle: 'Fuatilia malengo yako ya biashara na uongozane na maendeleo.',
      businessStage: 'Hatua ya Biashara',
      ideation: 'Hatua ya Dhana',
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
      back: 'Rudi',
      home: 'Nyumbani'
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

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const addMilestone = async (e?: React.FormEvent, title?: string) => {
    e?.preventDefault();
    const milestoneTitle = title || customMilestone.trim();
    
    if (!milestoneTitle) {
      toast({
        title: language === 'sw' ? 'Kosa' : 'Error',
        description: language === 'sw' ? 'Tafadhali andika jina la lengo' : 'Please enter a milestone title',
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

    const updatedMilestones = [...milestones, newMilestone];
    setMilestones(updatedMilestones);
    
    // Save to database
    await saveToDatabase(newMilestone);
    
    // Track milestone creation
    trackBusinessMilestone('created', {
      title: milestoneTitle,
      category: 'business_goal',
      targetDate: null,
      businessStage: businessStage
    });
    
    // Update parent component
    if (onMilestonesChange) {
      onMilestonesChange(updatedMilestones);
    }
    
    // Clear the custom milestone input if it was used
    if (!title) {
      setCustomMilestone('');
    }

    toast({
      title: language === 'sw' ? 'Lengo Limeongezwa' : 'Milestone Added',
      description: language === 'sw' ? 'Lengo jipya limeongezwa kwenye orodha yako' : 'New milestone added to your list',
    });
  };

  const updateMilestone = async (id: string, field: keyof Milestone, value: any) => {
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updatedMilestones);
    
    // Update in database
    const updatedMilestone = updatedMilestones.find(m => m.id === id);
    if (updatedMilestone) {
      await updateInDatabase(updatedMilestone);
    }
    
    // Track milestone status changes
    if (field === 'status' && value === 'complete') {
      const milestone = milestones.find(m => m.id === id);
      if (milestone) {
        trackBusinessMilestone('completed', {
          title: milestone.title,
          category: 'business_goal',
          businessStage: businessStage
        });
      }
    }
    
    // Update parent component
    if (onMilestonesChange) {
      onMilestonesChange(updatedMilestones);
    }
  };

  const deleteMilestone = async (id: string) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    setMilestones(updatedMilestones);
    
    // Delete from database
    try {
      await supabase
        .from('milestones')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
    
    // Update parent component
    if (onMilestonesChange) {
      onMilestonesChange(updatedMilestones);
    }
  };

  const currentStage = businessStages.find(stage => stage.value === businessStage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t.home}
              </Button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Jenga Biz Africa</h1>
            <div className="w-16"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="space-y-3">
                  {getStageSpecificMilestones(businessStage).map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <span className="text-sm font-medium text-gray-700">{suggestion}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addMilestone(undefined, suggestion)}
                        className="ml-3 border-green-300 text-green-700 hover:bg-green-50"
                        disabled={isSaving}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {isSaving ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Milestones */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t.yourMilestones} ({milestones.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Milestone Form */}
              <form onSubmit={(e) => addMilestone(e)} className="flex gap-2">
                <Input
                  value={customMilestone}
                  onChange={(e) => setCustomMilestone(e.target.value)}
                  placeholder={t.enterTitle}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSaving}>
                  <Plus className="w-4 h-4 mr-1" />
                  {isSaving ? 'Adding...' : t.addMilestone}
                </Button>
              </form>

              {/* Milestones List */}
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Input
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                            className="font-medium"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "text-left font-normal",
                                  !milestone.targetDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {milestone.targetDate ? format(milestone.targetDate, "PPP") : t.pickDate}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={milestone.targetDate || undefined}
                                onSelect={(date) => updateMilestone(milestone.id, 'targetDate', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          {milestone.targetDate && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCalendar({
                                title: milestone.title,
                                startDate: milestone.targetDate!,
                                endDate: milestone.targetDate!,
                                description: `Business milestone: ${milestone.title}`
                              })}
                              className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                              <CalendarPlus className="w-3 h-3 mr-1" />
                              {t.addToCalendar}
                            </Button>
                          )}
                        </div>

                        <Select
                          value={milestone.status}
                          onValueChange={(value) => updateMilestone(milestone.id, 'status', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <Badge className={option.color}>
                                  {option.label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Badge className={getStatusColor(milestone.status)}>
                          {statusOptions.find(opt => opt.value === milestone.status)?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {milestones.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>{language === 'sw' ? 'Hakuna malengo bado' : 'No milestones yet'}</p>
                    <p className="text-sm">{language === 'sw' ? 'Ongeza lengo la kwanza ili kuanza' : 'Add your first milestone to get started'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessMilestonesSectionWithSave;