import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { useState } from 'react';

const TemplateSelector = ({ onTemplateSelect, onStartFromScratch, onBack }) => {
  const [selectedBusiness, setSelectedBusiness] = useState('');

  const businessTypes = [
    { id: 'custom', name: 'Start from Scratch (Custom Business)' },
    { id: 'online-retail', name: 'Online Retail' },
    { id: 'agribusiness', name: 'Agribusiness' },
    { id: 'mobile-money', name: 'Mobile Money Agent' },
    { id: 'cyber-cafe', name: 'Cyber Café' },
    { id: 'real-estate', name: 'Real Estate Agency' },
    { id: 'cleaning-services', name: 'Cleaning Services' },
    { id: 'event-planning', name: 'Event Planning' },
    { id: 'photography', name: 'Photography & Videography' },
    { id: 'food-delivery', name: 'Food Delivery Services' },
    { id: 'mitumba', name: 'Second-Hand Clothing (Mitumba)' },
    { id: 'beauty-salon', name: 'Beauty Salon & Barber Shop' },
    { id: 'auto-repair', name: 'Auto Repair Services' },
    { id: 'boda-boda', name: 'Boda Boda Business' },
    { id: 'freelance-writing', name: 'Freelance Writing & Content Creation' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'tutoring', name: 'Tutoring Services' },
    { id: 'fitness-training', name: 'Fitness Training' },
    { id: 'daycare', name: 'Daycare Services' },
    { id: 'social-media', name: 'Social Media Management' },
    { id: 'handmade-crafts', name: 'Handmade Crafts' }
  ];

  const handleBusinessSelect = (businessId) => {
    setSelectedBusiness(businessId);
  };

  const handleGetStarted = () => {
    if (!selectedBusiness) return;
    
    if (selectedBusiness === 'custom') {
      onStartFromScratch();
    } else {
      // Pass the full business object with both id and name
      const selectedTemplate = businessTypes.find(b => b.id === selectedBusiness);
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Choose Your Business Type</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Business Type Selection */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 mb-2">Build Your Business Strategy</CardTitle>
              <p className="text-gray-600">Select your business type to get started with a tailored strategy template</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="business-select" className="text-sm font-medium text-gray-700">
                  Select a Business Type
                </label>
                <Select value={selectedBusiness} onValueChange={handleBusinessSelect}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Choose your business type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGetStarted}
                disabled={!selectedBusiness}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-lg font-medium"
              >
                {selectedBusiness === 'custom' ? (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Start from Scratch
                  </>
                ) : (
                  <>
                    Get Started
                  </>
                )}
              </Button>

              {selectedBusiness && selectedBusiness !== 'custom' && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Selected:</strong> {businessTypes.find(b => b.id === selectedBusiness)?.name}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Your strategy builder will be pre-filled with content tailored for this business type.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="bg-white/60 p-4 rounded-lg">
                <strong>Tailored Content</strong><br />
                Pre-filled strategy sections specific to your business type
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <strong>Local Insights</strong><br />
                Content designed for African market realities
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <strong>AI Summary</strong><br />
                Professional strategy summary you can save or download
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
