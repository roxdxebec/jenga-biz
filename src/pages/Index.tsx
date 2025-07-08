
import { useState } from 'react';
import TemplateSelector from '@/components/TemplateSelector';
import StrategyBuilder from '@/components/StrategyBuilder';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  console.log('Index - Current view:', currentView);
  console.log('Index - Selected template:', selectedTemplate);

  const handleTemplateSelect = (template) => {
    console.log('Index - Template selected:', template);
    setSelectedTemplate(template);
    setCurrentView('builder');
  };

  const handleStartFromScratch = () => {
    console.log('Index - Starting from scratch');
    setSelectedTemplate(null);
    setCurrentView('builder');
  };

  const handleBackToTemplates = () => {
    console.log('Index - Back to template selector');
    setCurrentView('templates');
    setSelectedTemplate(null);
  };

  const handleBackToHome = () => {
    console.log('Index - Back to home');
    setCurrentView('home');
    setSelectedTemplate(null);
  };

  // Template Selector View
  if (currentView === 'templates') {
    return (
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
        onBack={handleBackToHome}
      />
    );
  }

  // Strategy Builder View
  if (currentView === 'builder') {
    return (
      <StrategyBuilder
        template={selectedTemplate}
        onBack={handleBackToTemplates}
        onHome={handleBackToHome}
      />
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6">
            African Business Strategy Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create a comprehensive business strategy tailored for the African market
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('templates')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Build Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Business Templates</h3>
            <p className="text-gray-600">Choose from 20+ pre-built templates for popular African businesses</p>
          </div>
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Personas</h3>
            <p className="text-gray-600">Build detailed customer profiles to better understand your target market</p>
          </div>
          <div className="bg-white/60 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Local Insights</h3>
            <p className="text-gray-600">Content designed specifically for African market realities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
