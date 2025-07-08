
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerPersonaSection = ({ isPro = false, strategyData = null }) => {
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
    'Tradition', 'Community support', 'Environmental impact', 'Health benefits'
  ];
  
  const availablePainPoints = [
    'Limited budget', 'Time constraints', 'Quality concerns', 'Trust issues',
    'Delivery problems', 'Payment security', 'Limited options', 'Social pressure'
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

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Required",
      description: "Upgrade to Strategy Grid Pro to unlock full persona features.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Now define your ideal customer to refine your strategy
        </h2>
        <p className="text-gray-600">
          Understanding your customer persona will help tailor your business strategy
        </p>
      </div>

      {/* Persona Selection */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Select a Customer Persona
            {!isPro && (
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                <Crown className="w-3 h-3 mr-1" />
                Pro Feature
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedPersona} 
            onValueChange={handlePersonaSelect}
            disabled={!isPro}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a persona template or start from scratch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Start from Scratch (Custom Persona)</SelectItem>
              <SelectItem value="budget-conscious">Budget-Conscious Buyer</SelectItem>
              <SelectItem value="aspirational-professional">Aspirational Middle-Income Professional</SelectItem>
              <SelectItem value="digital-native">Informed Digital Native</SelectItem>
              <SelectItem value="traditional-shopper">Traditional Shopper</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Persona Form (Sample/Readonly for free users) */}
      {selectedPersona && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle>Persona Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name (Optional)</label>
              <Input
                value={personaData.name}
                onChange={(e) => isPro && setPersonaData({...personaData, name: e.target.value})}
                placeholder="e.g., Sarah the Budget Shopper"
                readOnly={!isPro}
                className={!isPro ? "bg-gray-50" : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age Range</label>
              <Select 
                value={personaData.ageRange} 
                onValueChange={(value) => isPro && setPersonaData({...personaData, ageRange: value})}
                disabled={!isPro}
              >
                <SelectTrigger className={!isPro ? "bg-gray-50" : ""}>
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
              <Select 
                value={personaData.incomeLevel} 
                onValueChange={(value) => isPro && setPersonaData({...personaData, incomeLevel: value})}
                disabled={!isPro}
              >
                <SelectTrigger className={!isPro ? "bg-gray-50" : ""}>
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
                {availableValues.slice(0, 6).map(value => (
                  <Badge
                    key={value}
                    variant={personaData.values.includes(value) ? "default" : "outline"}
                    className={`cursor-pointer ${!isPro ? "opacity-60" : ""}`}
                    onClick={() => {
                      if (!isPro) return;
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
              <label className="block text-sm font-medium mb-2">Customer Behavior Summary</label>
              <Textarea
                value={personaData.behaviorSummary}
                onChange={(e) => isPro && setPersonaData({...personaData, behaviorSummary: e.target.value})}
                placeholder="One-sentence summary of this customer's behavior patterns..."
                rows={3}
                readOnly={!isPro}
                className={!isPro ? "bg-gray-50" : ""}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Coaching Insight (Locked for free users) */}
      {selectedPersona && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-orange-600" />
              AI Strategic Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  <strong>Strategic Insight:</strong> This persona responds well to {personaData.values.join(', ').toLowerCase()} messaging. 
                  Focus your marketing on addressing their key concerns through {personaData.buyingChannel} to maximize conversion.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg blur-sm">
                  <p className="text-gray-600">
                    Strategic insights and personalized recommendations tailored specifically for this customer persona will appear here. 
                    Get detailed advice on how to position your product, what messaging resonates, and which channels work best...
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white border border-orange-200 rounded-lg p-6 shadow-lg text-center">
                    <Crown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-800 mb-3">
                      Upgrade to Strategy Grid Pro to unlock personalized strategy tips for your ideal customer
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
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerPersonaSection;
