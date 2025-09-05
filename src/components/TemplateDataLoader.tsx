import { useState, useEffect } from 'react';
import { getTemplateData, TemplateData } from '@/data/templateData';

interface TemplateDataLoaderProps {
  templateId: string;
  language?: string;
  onTemplateLoaded: (template: TemplateData) => void;
}

const TemplateDataLoader = ({ templateId, language = 'en', onTemplateLoaded }: TemplateDataLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        const templates = getTemplateData(language);
        const template = templates.find(t => t.id === templateId);
        if (template) {
          onTemplateLoaded(template);
        }
      } catch (error) {
        console.error('Error loading template:', error);
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      loadTemplate();
    }
  }, [templateId, language, onTemplateLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return null;
};

export default TemplateDataLoader;