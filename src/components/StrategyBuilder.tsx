
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Download, Eye, Wand2, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StrategySummary from '@/components/StrategySummary';

const StrategyBuilder = ({ template, onBack, onHome }) => {
  const [strategy, setStrategy] = useState({
    businessName: '',
    vision: '',
    mission: '',
    targetMarket: '',
    revenueModel: '',
    valueProposition: '',
    keyPartners: '',
    marketingApproach: '',
    operationalNeeds: '',
    growthGoals: ''
  });
  
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Template data for different business types
  const templateData = {
    'mitumba': {
      businessName: 'My Mitumba Store',
      vision: 'To be the most trusted source of quality second-hand clothing in my community',
      mission: 'Providing affordable, quality clothing while promoting sustainable fashion choices',
      targetMarket: 'Price-conscious families, young professionals, and students in urban and peri-urban areas',
      revenueModel: 'Direct sales from physical store and WhatsApp marketing, bulk sales to other retailers',
      valueProposition: 'Quality second-hand clothes at affordable prices with personalized service',
      keyPartners: 'Bale suppliers, local tailors for alterations, WhatsApp groups, chama members',
      marketingApproach: 'Word-of-mouth, WhatsApp business, local community events, referral programs',
      operationalNeeds: 'Store space, storage for inventory, transportation for bale collection, mobile money account',
      growthGoals: 'Expand to online sales, add more product categories, establish multiple outlets'
    },
    'food-vendor': {
      businessName: 'My Food Business',
      vision: 'To serve delicious, affordable meals that bring the community together',
      mission: 'Providing fresh, tasty, and affordable food using local ingredients',
      targetMarket: 'Office workers, students, local residents looking for convenient meals',
      revenueModel: 'Daily food sales, catering services, meal subscriptions, festival events',
      valueProposition: 'Fresh, homemade taste at affordable prices with fast service',
      keyPartners: 'Local suppliers, mama mboga vendors, food cooperatives, event organizers',
      marketingApproach: 'Location visibility, customer loyalty programs, WhatsApp orders, social media',
      operationalNeeds: 'Cooking equipment, food storage, vendor permits, mobile money setup, supplier relationships',
      growthGoals: 'Expand menu options, add delivery service, cater large events, open second location'
    },
    'boda-boda': {
      businessName: 'My Transport Service',
      vision: 'To provide safe, reliable, and affordable transportation in my area',
      mission: 'Connecting people to opportunities through dependable motorcycle transport',
      targetMarket: 'Daily commuters, students, market vendors, emergency transport needs',
      revenueModel: 'Per-trip charges, daily/weekly customer subscriptions, delivery services',
      valueProposition: 'Fast, reliable transport with good customer service and fair pricing',
      keyPartners: 'Boda boda SACCO, fuel stations, spare parts dealers, mobile money agents',
      marketingApproach: 'Customer referrals, SACCO networks, strategic location positioning, mobile app registration',
      operationalNeeds: 'Motorcycle maintenance, insurance, protective gear, mobile phone, SACCO membership',
      growthGoals: 'Own multiple motorcycles, hire other riders, add cargo services, digital platform integration'
    },
    // Add more template data for other business types...
  };

  useEffect(() => {
    if (template && templateData[template.id]) {
      setStrategy(templateData[template.id]);
    }
  }, [template]);

  const handleInputChange = (field, value) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving to local storage or backend
    localStorage.setItem('current-strategy', JSON.stringify(strategy));
    toast({
      title: "Strategy Saved!",
      description: "Your business strategy has been saved successfully.",
    });
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    // Simulate AI generation time
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 2000);
  };

  const sections = [
    { key: 'businessName', label: 'Business Name', type: 'input' },
    { key: 'vision', label: 'Vision Statement', type: 'textarea' },
    { key: 'mission', label: 'Mission Statement', type: 'textarea' },
    { key: 'targetMarket', label: 'Target Market', type: 'textarea' },
    { key: 'revenueModel', label: 'Revenue Model', type: 'textarea' },
    { key: 'valueProposition', label: 'Unique Value Proposition', type: 'textarea' },
    { key: 'keyPartners', label: 'Key Partners', type: 'textarea' },
    { key: 'marketingApproach', label: 'Marketing Approach', type: 'textarea' },
    { key: 'operationalNeeds', label: 'Operational Needs', type: 'textarea' },
    { key: 'growthGoals', label: 'Growth Goals', type: 'textarea' }
  ];

  if (showSummary) {
    return (
      <StrategySummary 
        strategy={strategy}
        onBack={() => setShowSummary(false)}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Strategy Builder</h1>
              {template && <p className="text-sm text-gray-600">{template.name} Template</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Strategy Form */}
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.key} className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-800">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.type === 'input' ? (
                    <Input
                      value={strategy[section.key]}
                      onChange={(e) => handleInputChange(section.key, e.target.value)}
                      placeholder={`Enter your ${section.label.toLowerCase()}`}
                      className="w-full"
                    />
                  ) : (
                    <Textarea
                      value={strategy[section.key]}
                      onChange={(e) => handleInputChange(section.key, e.target.value)}
                      placeholder={`Describe your ${section.label.toLowerCase()}`}
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGenerateSummary}
              disabled={isGenerating || !strategy.businessName}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
