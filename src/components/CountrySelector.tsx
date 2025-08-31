
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { africanCountries, popularBusinessCountries, getCountryName } from '@/data/africanCountries';

interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange: (country: string) => void;
  language?: string;
  showAllCountries?: boolean;
  showRegions?: boolean;
}

const CountrySelector = ({ 
  currentCountry, 
  onCountryChange, 
  language = 'en',
  showAllCountries = false,
  showRegions = false
}: CountrySelectorProps) => {
  const translations = {
    en: { 
      currency: 'Currency',
      popularCountries: 'Popular Countries',
      allCountries: 'All African Countries',
      selectCountry: 'Select Country'
    },
    sw: { 
      currency: 'Sarafu',
      popularCountries: 'Nchi Maarufu',
      allCountries: 'Nchi Zote za Afrika',
      selectCountry: 'Chagua Nchi'
    },
    ar: { 
      currency: 'العملة',
      popularCountries: 'البلدان الشائعة',
      allCountries: 'جميع البلدان الأفريقية',
      selectCountry: 'اختر البلد'
    },
    fr: { 
      currency: 'Devise',
      popularCountries: 'Pays Populaires',
      allCountries: 'Tous les Pays Africains',
      selectCountry: 'Sélectionner un Pays'
    }
  };

  const t = translations[language] || translations.en;
  const currentCountryInfo = africanCountries.find(c => c.code === currentCountry) || africanCountries[0];

  // Get countries to display
  const displayCountries = showAllCountries 
    ? africanCountries 
    : africanCountries.filter(c => popularBusinessCountries.includes(c.code));

  // Group countries by region if requested
  const groupedCountries = showRegions 
    ? displayCountries.reduce((acc, country) => {
        if (!acc[country.region]) {
          acc[country.region] = [];
        }
        acc[country.region].push(country);
        return acc;
      }, {} as Record<string, typeof displayCountries>)
    : null;

  return (
    <Select value={currentCountry} onValueChange={onCountryChange}>
      <SelectTrigger className="w-auto min-w-[120px]">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{t.currency}</span>
          <span className="font-medium">
            {currentCountryInfo.flag} {currentCountryInfo.symbol}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {groupedCountries ? (
          // Grouped by regions
          Object.entries(groupedCountries).map(([region, countries]) => (
            <div key={region}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b">
                {region}
              </div>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{getCountryName(country.code, language)}</span>
                    <span className="text-muted-foreground">({country.symbol})</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))
        ) : (
          // Simple list
          displayCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center space-x-2">
                <span>{country.flag}</span>
                <span>{getCountryName(country.code, language)}</span>
                <span className="text-muted-foreground">({country.symbol})</span>
              </div>
            </SelectItem>
          ))
        )}
        
        {!showAllCountries && (
          <div className="border-t pt-2">
            <div className="px-2 py-1 text-xs text-muted-foreground">
              {t.popularCountries} • {africanCountries.length - displayCountries.length} more available
            </div>
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
