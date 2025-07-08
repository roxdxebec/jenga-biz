
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Users, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerPersonaBuilder = ({ onBack, isPro = false }) => {
  const [selectedPersona, setSelectedPersona] = useState('');
  const [personaData, setPersonaData] = useState({
    name: '',
    ageRange: '',
    incomeLevel: '',
    values: [],
    painPoints: [],
    buyingChannel: '',
    behaviorSummary: ''
  });
  
  const { toast } = useToast();

  const personaTemplates = {
    'budget-conscious': {
      name: 'Budget-Conscious Buyer',
      ageRange: '25-45',
      incomeLevel: 'Low to Middle ($200-800/month)',
      values: ['Value for money', 'Durability', 'Practicality'],
      painPoints: ['Limited disposable income', 'Fear of making wrong purchases', 'Need for bulk buying'],
      buyingChannel: 'Local markets, wholesale stores, group buying',
      behaviorSummary: 'Researches extensively before purchase, compares prices, prefers proven products'
    },
    'aspirational-professional': {
      name: 'Aspirational Middle-Income Professional',
      ageRange: '28-40',
      incomeLevel: 'Middle ($500-1500/month)',
      values: ['Professional growth', 'Status improvement', 'Quality'],
      painPoints: ['Balancing quality vs price', 'Time constraints', 'Social expectations'],
      buyingChannel: 'Online shopping, branded stores, professional networks',
      behaviorSummary: 'Values brands that enhance professional image, willing to invest in quality'
    },
    'digital-native': {
      name: 'Informed Digital Native',
      ageRange: '18-35',
      incomeLevel: 'Varied ($300-1200/month)',
      values: ['Convenience', 'Innovation', 'Authenticity'],
      painPoints: ['Information overload', 'Trust in online vendors', 'Delivery reliability'],
      buyingChannel: 'Mobile apps, social media, e-commerce platforms',
      behaviorSummary: 'Researches online, influenced by reviews and social proof, expects seamless digital experience'
    },
    'traditional-shopper': {
      name: 'Traditional Shopper',
      ageRange: '35-60',
      incomeLevel: 'Low to Middle ($250-900/month)',
      values: ['Personal relationships', 'Trust', 'Tradition'],
      painPoints: ['Skeptical of new methods', 'Prefers face-to-face interaction', 'Payment security concerns'],
      buyingChannel: 'Local shops, markets, word-of-mouth recommendations',
      behaviorSummary: 'Values personal relationships with vendors, prefers tried and tested products'
    },
    'impulse-spender': {
      name: 'Impulse Spender',
      ageRange: '20-40',
      incomeLevel: 'Middle to High ($600-2000/month)',
      values: ['Immediate gratification', 'Novelty', 'Convenience'],
      painPoints: ['Buyer\'s remorse', 'Budget management', 'Quality disappointment'],
      buyingChannel: 'Retail stores, online flash sales, social media shopping',
      behaviorSummary: 'Makes quick purchase decisions, attracted by deals and new products'
    },
    'community-buyer': {
      name: 'Community Buyer',
      ageRange: '25-50',
      incomeLevel: 'Low to Middle ($300-1000/month)',
      values: ['Community support', 'Group benefits', 'Shared resources'],
      painPoints: ['Coordination challenges', 'Trust in group decisions', 'Payment collection'],
      buyingChannel: 'Group buying, cooperatives, community organizations',
      behaviorSummary: 'Participates in group purchases, values community recommendations and bulk benefits'
    },
    'social-buyer': {
      name: 'Supportive Social Buyer',
      ageRange: '22-45',
      incomeLevel: 'Varied ($400-1500/month)',
      values: ['Social impact', 'Supporting others', 'Ethical consumption'],
      painPoints: ['Limited local options', 'Higher prices for ethical products', 'Verification of claims'],
      buyingChannel: 'Social enterprises, local businesses, ethical brands',
      behaviorSummary: 'Chooses products that support social causes and local communities'
    },
    'luxury-status': {
      name: 'Luxury/Status-Oriented Buyer',
      ageRange: '30-55',
      incomeLevel: 'High ($1200+/month)',
      values: ['Status', 'Exclusivity', 'Premium quality'],
      painPoints: ['Authenticity verification', 'Limited premium options locally', 'Maintaining status'],
      buyingChannel: 'Premium stores, exclusive outlets, high-end online platforms',
      behaviorSummary: 'Willing to pay premium for status and quality, values exclusivity and brand prestige'
    }
  };

  const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];
  const incomeLevels = [
    'Low ($0-500/month)',
    'Lower Middle ($500-1000/month)',
    'Middle ($1000-2000/month)',
    'Upper Middle ($2000-4000/month)',
    'High ($4000+/month)'
  ];
  
  const availableValues = [
    'Value for money', 'Quality', 'Convenience', 'Status', 'Innovation',
    'Tradition', 'Community support', 'Environmental impact', 'Health benefits',
    'Time saving', 'Professional growth', 'Family security', 'Social recognition'
  ];
  
  const availablePainPoints = [
    'Limited budget', 'Time constraints', 'Quality concerns', 'Trust issues',
    'Delivery problems', 'Payment security', 'Limited options', 'Social pressure',
    'Information overload', 'Authenticity doubts', 'After-sales support', 'Language barriers'
  ];

  const buyingChannels = [
    'Local markets', 'Online shopping', 'Mobile apps', 'Social media',
    'Physical stores', 'Group buying', 'Door-to-door', 'Wholesale markets'
  ];

  const handlePersonaSelect = (value) => {
    setSelectedPersona(value);
    if (value === 'custom') {
      setPersonaData({
        name: '',
        ageRange: '',
        incomeLevel: '',
        values: [],
        painPoints: [],
        buyingChannel: '',
        behaviorSummary: ''
      });
    } else if (personaTemplates[value]) {
      setPersonaData(personaTemplates[value]);
    }
  };

  const handleSave = () => {
    if (!isPro) {
      toast({
        title: "Upgrade Required",
        description: "Upgrade to Strategy Grid Pro to save and use customer personas.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('current-persona', JSON.stringify(personaData));
    toast({
      title: "Persona Saved!",
      description: "Your customer persona has been saved successfully.",
    });
  };

  const ProUpgradePrompt = () => (
    <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
      <CardContent className="p-6 text-center">
        <Crown className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upgrade to Strategy Grid Pro</h3>
        <p className="text-gray-600 mb-4">
          Unlock full persona tools, AI insights, and strategy integration
        </p>
        <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );

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
            <div className="flex items-center">
              <Users className="w-6 h-6 mr-2 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Customer Persona Builder</h1>
                <div className="flex items-center">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro Feature
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleSave} disabled={!isPro}>
            <Save className="w-4 h-4 mr-2" />
            Save Persona
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Section 1: Persona Selection */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Select a Customer Persona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPersona} onValueChange={handlePersonaSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a persona template or start from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Start from Scratch (Custom Persona)</SelectItem>
                  <SelectItem value="budget-conscious">Budget-Conscious Buyer</SelectItem>
                  <SelectItem value="aspirational-professional">Aspirational Middle-Income Professional</SelectItem>
                  <SelectItem value="digital-native">Informed Digital Native</SelectItem>
                  <SelectItem value="traditional-shopper">Traditional Shopper</SelectItem>
                  <SelectItem value="impulse-spender">Impulse Spender</SelectItem>
                  <SelectItem value="community-buyer">Community Buyer</SelectItem>
                  <SelectItem value="social-buyer">Supportive Social Buyer</SelectItem>
                  <SelectItem value="luxury-status">Luxury/Status-Oriented Buyer</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section 2: Persona Form */}
          {selectedPersona && (
            <div className="space-y-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle>Persona Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name (Optional)</label>
                    <Input
                      value={personaData.name}
                      onChange={(e) => setPersonaData({...personaData, name: e.target.value})}
                      placeholder="e.g., Sarah the Budget Shopper"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Age Range</label>
                    <Select value={personaData.ageRange} onValueChange={(value) => setPersonaData({...personaData, ageRange: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Income Level</label>
                    <Select value={personaData.incomeLevel} onValueChange={(value) => setPersonaData({...personaData, incomeLevel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income level" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Top 3 Values</label>
                    <div className="flex flex-wrap gap-2">
                      {availableValues.map(value => (
                        <Badge
                          key={value}
                          variant={personaData.values.includes(value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValues = personaData.values.includes(value)
                              ? personaData.values.filter(v => v !== value)
                              : personaData.values.length < 3
                              ? [...personaData.values, value]
                              : personaData.values;
                            setPersonaData({...personaData, values: newValues});
                          }}
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Top 3 Pain Points</label>
                    <div className="flex flex-wrap gap-2">
                      {availablePainPoints.map(point => (
                        <Badge
                          key={point}
                          variant={personaData.painPoints.includes(point) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newPoints = personaData.painPoints.includes(point)
                              ? personaData.painPoints.filter(p => p !== point)
                              : personaData.painPoints.length < 3
                              ? [...personaData.painPoints, point]
                              : personaData.painPoints;
                            setPersonaData({...personaData, painPoints: newPoints});
                          }}
                        >
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Buying Channel</label>
                    <Select value={personaData.buyingChannel} onValueChange={(value) => setPersonaData({...personaData, buyingChannel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred buying channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {buyingChannels.map(channel => (
                          <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Behavior Summary (Optional)</label>
                    <Textarea
                      value={personaData.behaviorSummary}
                      onChange={(e) => setPersonaData({...personaData, behaviorSummary: e.target.value})}
                      placeholder="One-sentence summary of this customer's behavior patterns..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: AI Coaching Insight (Locked for free users) */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-orange-600" />
                    AI Coaching Insight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPro ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        <strong>Strategic Insight:</strong> This persona responds well to {personaData.values.join(', ').toLowerCase()} messaging. 
                        Focus your marketing on addressing their key pain point of {personaData.painPoints[0]?.toLowerCase()} 
                        through {personaData.buyingChannel} to maximize conversion.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg blur-sm">
                        <p className="text-gray-600">
                          Strategic insights and recommendations tailored specifically for this customer persona will appear here...
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-lg">
                          <Lock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                          <p className="text-sm text-center text-gray-600">
                            🔒 Unlock strategic insight tailored to this persona by upgrading to Strategy Grid Pro.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section 4: Upgrade Prompt for Free Users */}
              {!isPro && <ProUpgradePrompt />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPersonaBuilder;
