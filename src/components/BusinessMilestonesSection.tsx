
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Lock, Crown, Target, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
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
}

const BusinessMilestonesSection = ({ isPro = false, strategyData = null }: BusinessMilestonesSectionProps) => {
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

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'complete', label: 'Complete', color: 'bg-green-100 text-green-700' }
  ];

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const addMilestone = () => {
    if (!isPro && milestones.length >= 2) {
      toast({
        title: "Upgrade Required",
        description: "Upgrade to Strategy Grid Pro to add unlimited milestones.",
        variant: "destructive",
      });
      return;
    }

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      targetDate: null,
      status: 'not-started'
    };

    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    if (!isPro) {
      const milestoneIndex = milestones.findIndex(m => m.id === id);
      if (milestoneIndex >= 2) return; // Only allow editing first 2 for free users
    }

    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const deleteMilestone = (id: string) => {
    if (!isPro) {
      const milestoneIndex = milestones.findIndex(m => m.id === id);
      if (milestoneIndex >= 2) return; // Only allow deleting first 2 for free users
    }

    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Required",
      description: "Upgrade to Strategy Grid Pro to unlock unlimited milestones and growth tracking.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Business Milestones
        </h2>
        <p className="text-gray-600">
          Track your business goals and stay focused on progress.
        </p>
      </div>

      {/* Milestones List */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Your Milestones
              {!isPro && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Feature
                </Badge>
              )}
            </div>
            <Button
              onClick={addMilestone}
              size="sm"
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
              disabled={!isPro && milestones.length >= 2}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Milestone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const isEditable = isPro || index < 2;
              const isLocked = !isPro && index >= 2;

              return (
                <div
                  key={milestone.id}
                  className={cn(
                    "relative p-4 border rounded-lg",
                    isLocked ? "bg-gray-50 opacity-60" : "bg-white border-gray-200"
                  )}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

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
                          placeholder="Enter milestone title"
                          className="flex-1 mr-2"
                          readOnly={!isEditable}
                        />
                        {isEditable && (
                          <Button
                            onClick={() => deleteMilestone(milestone.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
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
                                disabled={!isEditable}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {milestone.targetDate ? (
                                  format(milestone.targetDate, "PPP")
                                ) : (
                                  <span>Pick target date</span>
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
                            disabled={!isEditable}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Message for Free Users */}
      {!isPro && (
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <Crown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-800 mb-3">
                  Upgrade to Strategy Grid Pro to unlock unlimited milestones and growth tracking.
                </p>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessMilestonesSection;
