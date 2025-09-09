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
        console.log('Loading strategies for strategy ID:', strategyId);
        await loadStrategies();
      };
      loadStrategy();
    }
  }, [strategyId, loadStrategies]);

  // Separate effect to set current strategy when strategies are loaded
  useEffect(() => {
    if (strategyId && strategies.length > 0) {
      const strategyToEdit = strategies.find(s => s.id === strategyId);
      if (strategyToEdit) {
        console.log('Found strategy to edit:', strategyToEdit);
        setCurrentStrategy(strategyToEdit);
      } else {
        console.error('Strategy not found with ID:', strategyId, 'Available strategies:', strategies);
      }
    } else if (!strategyId) {
      // Clear current strategy when no ID (new strategy)
      setCurrentStrategy(null);
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
      key={strategyId || 'new'} // Force re-mount when strategy changes
      template={template}
      onBack={handleBack}
      onHome={handleHome}
      initialLanguage={language}
    />
  );
};

export default Strategy;