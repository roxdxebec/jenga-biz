import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CombinedStrategyFlow from '@/components/CombinedStrategyFlow';

const Strategy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;
  const language = location.state?.language || 'en';

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <CombinedStrategyFlow 
      template={template}
      onBack={handleBack}
      onHome={handleHome}
      initialLanguage={language}
    />
  );
};

export default Strategy;