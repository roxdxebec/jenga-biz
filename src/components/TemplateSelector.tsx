
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Store, Truck, Smartphone, Leaf, Scissors, Camera, Users, Car } from 'lucide-react';

const TemplateSelector = ({ onTemplateSelect, onStartFromScratch, onBack }) => {
  const businessTemplates = [
    {
      id: 'mitumba',
      name: 'Mitumba Seller',
      icon: Store,
      description: 'Second-hand clothing business',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'food-vendor',
      name: 'Food Vendor',
      icon: Store,
      description: 'Street food or restaurant business',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'boda-boda',
      name: 'Boda Boda',
      icon: Car,
      description: 'Motorcycle taxi service',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money Agent',
      icon: Smartphone,
      description: 'Mobile money transfer service',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'farmer',
      name: 'Small-Scale Farmer',
      icon: Leaf,
      description: 'Agricultural business',
      color: 'from-green-400 to-green-500'
    },
    {
      id: 'beauty-salon',
      name: 'Beauty Salon',
      icon: Scissors,
      description: 'Hair and beauty services',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'content-creator',
      name: 'Digital Content Creator',
      icon: Camera,
      description: 'Social media and digital content',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'logistics',
      name: 'Logistics & Delivery',
      icon: Truck,
      description: 'Transportation and delivery service',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'community-business',
      name: 'Community Business',
      icon: Users,
      description: 'SACCO, Chama, or group enterprise',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

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
        {/* Start from Scratch Option */}
        <Card className="mb-8 border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Start from Scratch</h3>
                  <p className="text-gray-600">Build your strategy from a blank canvas</p>
                </div>
              </div>
              <Button onClick={onStartFromScratch} variant="outline">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Options */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Local Business Templates</h2>
          <p className="text-gray-600">Pre-built strategies tailored for common African businesses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => onTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTemplateSelect(template);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
