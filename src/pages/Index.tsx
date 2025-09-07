import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Target, DollarSign, Globe, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Business Templates',
      description: 'Choose from 15+ pre-built templates specifically designed for popular African businesses and market needs',
      buttonText: 'Use Templates',
      buttonColor: 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      onClick: () => navigate('/templates')
    },
    {
      icon: Zap,
      title: 'Custom Strategy',
      description: 'Build a completely custom business strategy from scratch with all features included - perfect for unique business models',
      buttonText: 'Start from Scratch',
      buttonColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/strategy')
    },
    {
      icon: Target,
      title: 'Milestone Tracking',
      description: 'Set and track business milestones based on your current stage and growth goals with deadlines',
      buttonText: 'Track Milestones',
      buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/milestones')
    },
    {
      icon: DollarSign,
      title: 'Financial Tracking',
      description: 'Monitor daily revenue and expenses with calendar-based entries and generate financial reports',
      buttonText: 'Track Finances',
      buttonColor: 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      onClick: () => navigate('/financial-tracker')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Jenga Biz Africa</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">
            Jenga Biz Africa
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build Your Business Strategy for the African Market
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`${feature.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button 
                    onClick={feature.onClick}
                    className={`w-full ${feature.buttonColor} text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;