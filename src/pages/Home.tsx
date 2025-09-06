import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Play, Target, Calculator, ArrowRight } from 'lucide-react';
import DropdownTemplateSelector from '@/components/DropdownTemplateSelector';
import FinancialTracker from '@/components/FinancialTracker';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import StrategyBuilder from '@/components/StrategyBuilder';
import { TemplateData, getTemplateData } from '@/data/templateData';
import { useToast } from '@/hooks/use-toast';

interface HomeProps {
  language: string;
  onTemplateSelect: (template: TemplateData) => void;
  onStartFromScratch: () => void;
}

const Home = ({ language, onTemplateSelect, onStartFromScratch }: HomeProps) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const { toast } = useToast();

  const handleCardClick = (cardType: string) => {
    setCurrentView(cardType);
  };

  const handleTemplateSelectFromDropdown = (template: any) => {
    const templates = getTemplateData(language);
    const templateData = templates.find(t => t.id === template.id);
    if (templateData) {
      setSelectedTemplate(templateData);
      onTemplateSelect(templateData);
      setCurrentView('strategyBuilder');
      
      toast({
        title: "Template Loaded",
        description: `${template.name} template has been loaded and is ready for editing.`,
      });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'templates':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Button 
                onClick={() => setCurrentView('home')} 
                variant="outline" 
                className="mb-6"
              >
                ← Back to Home
              </Button>
              <DropdownTemplateSelector
                onTemplateSelect={handleTemplateSelectFromDropdown}
                onStartFromScratch={() => {
                  onStartFromScratch();
                  setCurrentView('strategyBuilder');
                }}
                onBack={() => setCurrentView('home')}
                language={language}
              />
            </div>
          </div>
        );
      
      case 'strategyBuilder':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Button 
                onClick={() => setCurrentView('home')} 
                variant="outline" 
                className="mb-6"
              >
                ← Back to Home
              </Button>
              <StrategyBuilder
                template={selectedTemplate}
                onStrategyChange={() => {}}
                onShowSummary={() => {}}
                onBack={() => setCurrentView('home')}
                onHome={() => setCurrentView('home')}
                language={language}
                onLanguageChange={() => {}}
                country="KE"
                onCountryChange={() => {}}
                currency="KES"
                currencySymbol="KSh"
              />
            </div>
          </div>
        );
      
      case 'milestones':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Button 
                onClick={() => setCurrentView('home')} 
                variant="outline" 
                className="mb-6"
              >
                ← Back to Home
              </Button>
              <BusinessMilestonesSection 
                language={language}
                isPro={true}
              />
            </div>
          </div>
        );
      
      case 'financialTracker':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Button 
                onClick={() => setCurrentView('home')} 
                variant="outline" 
                className="mb-6"
              >
                ← Back to Home
              </Button>
              <FinancialTracker 
                language={language}
                currency="KES"
                currencySymbol="KSh"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Jenga Biz Africa</h1>
                <p className="text-xl text-gray-600 mb-8">Build Your Business Strategy for the African Market</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Select a Template Card */}
                <Card 
                  className="border-blue-200 hover:border-blue-300 cursor-pointer transition-colors group"
                  onClick={() => handleCardClick('templates')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">Select a Template</CardTitle>
                    <CardDescription>
                      Choose from pre-built business templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Start with expertly crafted templates for various African business models
                    </p>
                  </CardContent>
                </Card>

                {/* Start from Scratch Card */}
                <Card 
                  className="border-green-200 hover:border-green-300 cursor-pointer transition-colors group"
                  onClick={() => {
                    onStartFromScratch();
                    setCurrentView('strategyBuilder');
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Play className="w-8 h-8 text-green-600" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">Start from Scratch</CardTitle>
                    <CardDescription>
                      Build your own custom strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Create a completely custom business strategy from the ground up
                    </p>
                  </CardContent>
                </Card>

                {/* Milestone Trackers Card */}
                <Card 
                  className="border-purple-200 hover:border-purple-300 cursor-pointer transition-colors group"
                  onClick={() => handleCardClick('milestones')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Target className="w-8 h-8 text-purple-600" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">Milestone Trackers</CardTitle>
                    <CardDescription>
                      Track your business progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Set and monitor important business milestones and goals
                    </p>
                  </CardContent>
                </Card>

                {/* Financial Tracker Card */}
                <Card 
                  className="border-orange-200 hover:border-orange-300 cursor-pointer transition-colors group"
                  onClick={() => handleCardClick('financialTracker')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Calculator className="w-8 h-8 text-orange-600" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">Financial Tracker</CardTitle>
                    <CardDescription>
                      Manage your business finances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Track income, expenses, and financial goals with photo receipt capture
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderCurrentView();
};

export default Home;