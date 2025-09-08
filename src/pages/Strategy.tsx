import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CombinedStrategyFlow from '@/components/CombinedStrategyFlow';
import { useStrategy } from '@/hooks/useStrategy';

const Strategy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadStrategies, strategies, setCurrentStrategy } = useStrategy();
  
  const template = location.state?.template;
  const language = location.state?.language || 'en';
  const strategyId = searchParams.get('id');

  useEffect(() => {
    if (strategyId) {
      // Load strategies and find the specific strategy to edit
      loadStrategies().then(() => {
        const strategyToEdit = strategies.find(s => s.id === strategyId);
        if (strategyToEdit) {
          setCurrentStrategy(strategyToEdit);
        }
      });
    }
  }, [strategyId, loadStrategies, strategies, setCurrentStrategy]);

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