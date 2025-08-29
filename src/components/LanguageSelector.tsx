
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' }
  ];

  const translations = {
    en: { language: 'Language' },
    sw: { language: 'Lugha' },
    ar: { language: 'اللغة' },
    fr: { language: 'Langue' }
  };

  const t = translations[currentLanguage] || translations.en;
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <Select value={currentLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-auto min-w-[120px]">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>{t.language}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
