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
      const loadStrategy = async () => {
        await loadStrategies();
        // Strategy will be found after loading completes
      };
      loadStrategy();
    }
  }, [strategyId, loadStrategies]);

  // Separate effect to set current strategy when strategies are loaded
  useEffect(() => {
    if (strategyId && strategies.length > 0) {
      const strategyToEdit = strategies.find(s => s.id === strategyId);
      if (strategyToEdit) {
        console.log('Setting current strategy for editing:', strategyToEdit);
        setCurrentStrategy(strategyToEdit);
      }
    }
  }, [strategyId, strategies, setCurrentStrategy]);

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