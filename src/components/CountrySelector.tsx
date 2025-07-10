
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange: (country: string) => void;
  language?: string;
}

const CountrySelector = ({ currentCountry, onCountryChange, language = 'en' }: CountrySelectorProps) => {
  const countries = [
    { code: 'KE', name: 'Kenya', currency: 'KES', symbol: 'KSh' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'USh' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TSh' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', symbol: 'FRw' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', symbol: 'Br' }
  ];

  const translations = {
    en: { currency: 'Currency' },
    sw: { currency: 'Sarafu' },
    ar: { currency: 'العملة' },
    fr: { currency: 'Devise' }
  };

  const t = translations[language] || translations.en;
  const currentCountryInfo = countries.find(c => c.code === currentCountry) || countries[0];

  return (
    <Select value={currentCountry} onValueChange={onCountryChange}>
      <SelectTrigger className="w-auto min-w-[120px]">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{t.currency}</span>
          <span className="font-medium">{currentCountryInfo.symbol}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name} ({country.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
