
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

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
    en: { selectCountry: 'Select your country' },
    sw: { selectCountry: 'Chagua nchi yako' },
    ar: { selectCountry: 'اختر بلدك' },
    fr: { selectCountry: 'Sélectionnez votre pays' }
  };

  const t = translations[language] || translations.en;

  return (
    <Select value={currentCountry} onValueChange={onCountryChange}>
      <SelectTrigger className="w-full">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <SelectValue placeholder={t.selectCountry} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center justify-between">
              <span>{country.name}</span>
              <span className="text-sm text-gray-500 ml-2">({country.currency})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
export { countries };
