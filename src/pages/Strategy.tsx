import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StrategyBuilder from '@/components/StrategyBuilder';

const Strategy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StrategyBuilder 
          template={template}
          onBack={handleBack}
          onHome={handleHome}
        />
      </div>
    </div>
  );
};

export default Strategy;