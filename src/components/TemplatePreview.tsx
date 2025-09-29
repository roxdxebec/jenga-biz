import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, CheckCircle, ArrowRight, Star, Users, Target, DollarSign, Handshake, Megaphone, Wrench, TrendingUp } from 'lucide-react';
import { BusinessTemplate } from '@/hooks/useBusinessTemplates';

interface TemplatePreviewProps {
  template: BusinessTemplate;
  onSelect: (template: BusinessTemplate) => void;
  onClose: () => void;
  language?: string;
}

export function TemplatePreview({ template, onSelect, onClose, language = 'en' }: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const config = template.template_config;
  
  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.vision}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.mission}</p>
          </div>
        </div>
      )
    },
    {
      id: 'market',
      title: 'Target Market',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Target Market</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.targetMarket}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Value Proposition</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.valueProposition}</p>
          </div>
        </div>
      )
    },
    {
      id: 'revenue',
      title: 'Revenue Model',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Revenue Model</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.revenueModel}</p>
          </div>
        </div>
      )
    },
    {
      id: 'partners',
      title: 'Key Partners',
      icon: Handshake,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Partners</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.keyPartners}</p>
          </div>
        </div>
      )
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Megaphone,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Marketing Approach</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.marketingApproach}</p>
          </div>
        </div>
      )
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: Wrench,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Operational Needs</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.operationalNeeds}</p>
          </div>
        </div>
      )
    },
    {
      id: 'growth',
      title: 'Growth Goals',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Growth Goals</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{config.growthGoals}</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{template.name}</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {template.category}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {template.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex h-[60vh]">
            {/* Sidebar with tabs */}
            <div className="w-64 border-r bg-gray-50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="flex flex-col h-full w-full bg-transparent p-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="w-full justify-start gap-3 p-3 h-auto text-left"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{section.title}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    {sections.map((section) => (
                      <TabsContent key={section.id} value={section.id} className="mt-0">
                        {section.content}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Template includes all essential business components</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => onSelect(template)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Use This Template
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
