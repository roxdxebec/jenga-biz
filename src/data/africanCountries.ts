export interface CountryData {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  region: string;
  subregion?: string;
  flag?: string;
  translations?: {
    sw?: string;
    ar?: string;
    fr?: string;
  };
}

export const africanCountries: CountryData[] = [
  // East Africa
  { 
    code: 'KE', 
    name: 'Kenya', 
    currency: 'KES', 
    symbol: 'KSh', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇰🇪',
    translations: { sw: 'Kenya', ar: 'كينيا', fr: 'Kenya' }
  },
  { 
    code: 'TZ', 
    name: 'Tanzania', 
    currency: 'TZS', 
    symbol: 'TSh', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇹🇿',
    translations: { sw: 'Tanzania', ar: 'تنزانيا', fr: 'Tanzanie' }
  },
  { 
    code: 'UG', 
    name: 'Uganda', 
    currency: 'UGX', 
    symbol: 'USh', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇺🇬',
    translations: { sw: 'Uganda', ar: 'أوغندا', fr: 'Ouganda' }
  },
  { 
    code: 'RW', 
    name: 'Rwanda', 
    currency: 'RWF', 
    symbol: 'FRw', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇷🇼',
    translations: { sw: 'Rwanda', ar: 'رواندا', fr: 'Rwanda' }
  },
  { 
    code: 'BI', 
    name: 'Burundi', 
    currency: 'BIF', 
    symbol: 'FBu', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇧🇮',
    translations: { sw: 'Burundi', ar: 'بوروندي', fr: 'Burundi' }
  },
  { 
    code: 'ET', 
    name: 'Ethiopia', 
    currency: 'ETB', 
    symbol: 'Br', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇪🇹',
    translations: { sw: 'Ethiopia', ar: 'إثيوبيا', fr: 'Éthiopie' }
  },
  { 
    code: 'DJ', 
    name: 'Djibouti', 
    currency: 'DJF', 
    symbol: 'Fdj', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇩🇯',
    translations: { sw: 'Djibouti', ar: 'جيبوتي', fr: 'Djibouti' }
  },
  { 
    code: 'ER', 
    name: 'Eritrea', 
    currency: 'ERN', 
    symbol: 'Nfk', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇪🇷',
    translations: { sw: 'Eritrea', ar: 'إريتريا', fr: 'Érythrée' }
  },
  { 
    code: 'SO', 
    name: 'Somalia', 
    currency: 'SOS', 
    symbol: 'S', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇸🇴',
    translations: { sw: 'Somalia', ar: 'الصومال', fr: 'Somalie' }
  },
  { 
    code: 'SS', 
    name: 'South Sudan', 
    currency: 'SSP', 
    symbol: '£', 
    region: 'East Africa',
    subregion: 'Eastern Africa',
    flag: '🇸🇸',
    translations: { sw: 'Sudan Kusini', ar: 'جنوب السودان', fr: 'Soudan du Sud' }
  },

  // West Africa
  { 
    code: 'NG', 
    name: 'Nigeria', 
    currency: 'NGN', 
    symbol: '₦', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇳🇬',
    translations: { sw: 'Nigeria', ar: 'نيجيريا', fr: 'Nigéria' }
  },
  { 
    code: 'GH', 
    name: 'Ghana', 
    currency: 'GHS', 
    symbol: 'GH₵', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇬🇭',
    translations: { sw: 'Ghana', ar: 'غانا', fr: 'Ghana' }
  },
  { 
    code: 'SN', 
    name: 'Senegal', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇸🇳',
    translations: { sw: 'Senegal', ar: 'السنغال', fr: 'Sénégal' }
  },
  { 
    code: 'ML', 
    name: 'Mali', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇲🇱',
    translations: { sw: 'Mali', ar: 'مالي', fr: 'Mali' }
  },
  { 
    code: 'BF', 
    name: 'Burkina Faso', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇧🇫',
    translations: { sw: 'Burkina Faso', ar: 'بوركينا فاسو', fr: 'Burkina Faso' }
  },
  { 
    code: 'NE', 
    name: 'Niger', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇳🇪',
    translations: { sw: 'Niger', ar: 'النيجر', fr: 'Niger' }
  },
  { 
    code: 'CI', 
    name: 'Côte d\'Ivoire', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇨🇮',
    translations: { sw: 'Cote d\'Ivoire', ar: 'ساحل العاج', fr: 'Côte d\'Ivoire' }
  },
  { 
    code: 'GN', 
    name: 'Guinea', 
    currency: 'GNF', 
    symbol: 'FG', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇬🇳',
    translations: { sw: 'Guinea', ar: 'غينيا', fr: 'Guinée' }
  },
  { 
    code: 'SL', 
    name: 'Sierra Leone', 
    currency: 'SLL', 
    symbol: 'Le', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇸🇱',
    translations: { sw: 'Sierra Leone', ar: 'سيراليون', fr: 'Sierra Leone' }
  },
  { 
    code: 'LR', 
    name: 'Liberia', 
    currency: 'LRD', 
    symbol: 'L$', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇱🇷',
    translations: { sw: 'Liberia', ar: 'ليبيريا', fr: 'Libéria' }
  },
  { 
    code: 'BJ', 
    name: 'Benin', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇧🇯',
    translations: { sw: 'Benin', ar: 'بنين', fr: 'Bénin' }
  },
  { 
    code: 'TG', 
    name: 'Togo', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇹🇬',
    translations: { sw: 'Togo', ar: 'توغو', fr: 'Togo' }
  },
  { 
    code: 'GW', 
    name: 'Guinea-Bissau', 
    currency: 'XOF', 
    symbol: 'CFA', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇬🇼',
    translations: { sw: 'Guinea-Bissau', ar: 'غينيا بيساو', fr: 'Guinée-Bissau' }
  },
  { 
    code: 'GM', 
    name: 'Gambia', 
    currency: 'GMD', 
    symbol: 'D', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇬🇲',
    translations: { sw: 'Gambia', ar: 'غامبيا', fr: 'Gambie' }
  },
  { 
    code: 'CV', 
    name: 'Cape Verde', 
    currency: 'CVE', 
    symbol: '$', 
    region: 'West Africa',
    subregion: 'Western Africa',
    flag: '🇨🇻',
    translations: { sw: 'Cape Verde', ar: 'الرأس الأخضر', fr: 'Cap-Vert' }
  },

  // Central Africa
  { 
    code: 'CM', 
    name: 'Cameroon', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇨🇲',
    translations: { sw: 'Cameroon', ar: 'الكاميرون', fr: 'Cameroun' }
  },
  { 
    code: 'CF', 
    name: 'Central African Republic', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇨🇫',
    translations: { sw: 'Jamhuri ya Afrika ya Kati', ar: 'جمهورية أفريقيا الوسطى', fr: 'République centrafricaine' }
  },
  { 
    code: 'TD', 
    name: 'Chad', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇹🇩',
    translations: { sw: 'Chad', ar: 'تشاد', fr: 'Tchad' }
  },
  { 
    code: 'CD', 
    name: 'Democratic Republic of the Congo', 
    currency: 'CDF', 
    symbol: 'FC', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇨🇩',
    translations: { sw: 'Jamhuri ya Kidemokrasia ya Kongo', ar: 'جمهورية الكونغو الديمقراطية', fr: 'République démocratique du Congo' }
  },
  { 
    code: 'CG', 
    name: 'Republic of the Congo', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇨🇬',
    translations: { sw: 'Jamhuri ya Kongo', ar: 'جمهورية الكونغو', fr: 'République du Congo' }
  },
  { 
    code: 'GQ', 
    name: 'Equatorial Guinea', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇬🇶',
    translations: { sw: 'Guinea ya Ikweta', ar: 'غينيا الاستوائية', fr: 'Guinée équatoriale' }
  },
  { 
    code: 'GA', 
    name: 'Gabon', 
    currency: 'XAF', 
    symbol: 'FCFA', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇬🇦',
    translations: { sw: 'Gabon', ar: 'الغابون', fr: 'Gabon' }
  },
  { 
    code: 'ST', 
    name: 'São Tomé and Príncipe', 
    currency: 'STN', 
    symbol: 'Db', 
    region: 'Central Africa',
    subregion: 'Middle Africa',
    flag: '🇸🇹',
    translations: { sw: 'São Tomé na Príncipe', ar: 'ساو تومي وبرينسيبي', fr: 'São Tomé-et-Príncipe' }
  },

  // Southern Africa
  { 
    code: 'ZA', 
    name: 'South Africa', 
    currency: 'ZAR', 
    symbol: 'R', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇿🇦',
    translations: { sw: 'Afrika Kusini', ar: 'جنوب أفريقيا', fr: 'Afrique du Sud' }
  },
  { 
    code: 'BW', 
    name: 'Botswana', 
    currency: 'BWP', 
    symbol: 'P', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇧🇼',
    translations: { sw: 'Botswana', ar: 'بوتسوانا', fr: 'Botswana' }
  },
  { 
    code: 'LS', 
    name: 'Lesotho', 
    currency: 'LSL', 
    symbol: 'L', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇱🇸',
    translations: { sw: 'Lesotho', ar: 'ليسوتو', fr: 'Lesotho' }
  },
  { 
    code: 'MW', 
    name: 'Malawi', 
    currency: 'MWK', 
    symbol: 'MK', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇲🇼',
    translations: { sw: 'Malawi', ar: 'مالاوي', fr: 'Malawi' }
  },
  { 
    code: 'MZ', 
    name: 'Mozambique', 
    currency: 'MZN', 
    symbol: 'MT', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇲🇿',
    translations: { sw: 'Msumbiji', ar: 'موزمبيق', fr: 'Mozambique' }
  },
  { 
    code: 'NA', 
    name: 'Namibia', 
    currency: 'NAD', 
    symbol: 'N$', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇳🇦',
    translations: { sw: 'Namibia', ar: 'ناميبيا', fr: 'Namibie' }
  },
  { 
    code: 'SZ', 
    name: 'Eswatini', 
    currency: 'SZL', 
    symbol: 'E', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇸🇿',
    translations: { sw: 'Uswazi', ar: 'إسواتيني', fr: 'Eswatini' }
  },
  { 
    code: 'ZM', 
    name: 'Zambia', 
    currency: 'ZMW', 
    symbol: 'ZK', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇿🇲',
    translations: { sw: 'Zambia', ar: 'زامبيا', fr: 'Zambie' }
  },
  { 
    code: 'ZW', 
    name: 'Zimbabwe', 
    currency: 'USD', 
    symbol: '$', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇿🇼',
    translations: { sw: 'Zimbabwe', ar: 'زيمبابوي', fr: 'Zimbabwe' }
  },
  { 
    code: 'AO', 
    name: 'Angola', 
    currency: 'AOA', 
    symbol: 'Kz', 
    region: 'Southern Africa',
    subregion: 'Southern Africa',
    flag: '🇦🇴',
    translations: { sw: 'Angola', ar: 'أنغولا', fr: 'Angola' }
  },

  // North Africa
  { 
    code: 'DZ', 
    name: 'Algeria', 
    currency: 'DZD', 
    symbol: 'DA', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇩🇿',
    translations: { sw: 'Algeria', ar: 'الجزائر', fr: 'Algérie' }
  },
  { 
    code: 'EG', 
    name: 'Egypt', 
    currency: 'EGP', 
    symbol: 'E£', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇪🇬',
    translations: { sw: 'Misri', ar: 'مصر', fr: 'Égypte' }
  },
  { 
    code: 'LY', 
    name: 'Libya', 
    currency: 'LYD', 
    symbol: 'LD', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇱🇾',
    translations: { sw: 'Libya', ar: 'ليبيا', fr: 'Libye' }
  },
  { 
    code: 'MA', 
    name: 'Morocco', 
    currency: 'MAD', 
    symbol: 'DH', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇲🇦',
    translations: { sw: 'Morocco', ar: 'المغرب', fr: 'Maroc' }
  },
  { 
    code: 'SD', 
    name: 'Sudan', 
    currency: 'SDG', 
    symbol: 'ج.س.', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇸🇩',
    translations: { sw: 'Sudan', ar: 'السودان', fr: 'Soudan' }
  },
  { 
    code: 'TN', 
    name: 'Tunisia', 
    currency: 'TND', 
    symbol: 'د.ت', 
    region: 'North Africa',
    subregion: 'Northern Africa',
    flag: '🇹🇳',
    translations: { sw: 'Tunisia', ar: 'تونس', fr: 'Tunisie' }
  },

  // Island Nations
  { 
    code: 'MG', 
    name: 'Madagascar', 
    currency: 'MGA', 
    symbol: 'Ar', 
    region: 'Island Nations',
    subregion: 'Eastern Africa',
    flag: '🇲🇬',
    translations: { sw: 'Madagascar', ar: 'مدغشقر', fr: 'Madagascar' }
  },
  { 
    code: 'MU', 
    name: 'Mauritius', 
    currency: 'MUR', 
    symbol: '₨', 
    region: 'Island Nations',
    subregion: 'Eastern Africa',
    flag: '🇲🇺',
    translations: { sw: 'Mauritius', ar: 'موريشيوس', fr: 'Maurice' }
  },
  { 
    code: 'SC', 
    name: 'Seychelles', 
    currency: 'SCR', 
    symbol: '₨', 
    region: 'Island Nations',
    subregion: 'Eastern Africa',
    flag: '🇸🇨',
    translations: { sw: 'Seychelles', ar: 'سيشل', fr: 'Seychelles' }
  },
  { 
    code: 'KM', 
    name: 'Comoros', 
    currency: 'KMF', 
    symbol: 'CF', 
    region: 'Island Nations',
    subregion: 'Eastern Africa',
    flag: '🇰🇲',
    translations: { sw: 'Comoro', ar: 'جزر القمر', fr: 'Comores' }
  },

  // Add USD and EUR for international business
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    region: 'International',
    flag: '🇺🇸',
    translations: { sw: 'Marekani', ar: 'الولايات المتحدة', fr: 'États-Unis' }
  },
  {
    code: 'EU',
    name: 'European Union',
    currency: 'EUR',
    symbol: '€',
    region: 'International',
    flag: '🇪🇺',
    translations: { sw: 'Umoja wa Ulaya', ar: 'الاتحاد الأوروبي', fr: 'Union européenne' }
  }
];

// Helper functions
export const getCountryByCode = (code: string): CountryData | undefined => {
  return africanCountries.find(country => country.code === code);
};

export const getCountriesByRegion = (region: string): CountryData[] => {
  return africanCountries.filter(country => country.region === region);
};

export const getAllRegions = (): string[] => {
  return [...new Set(africanCountries.map(country => country.region))];
};

export const getCountryName = (code: string, language: string = 'en'): string => {
  const country = getCountryByCode(code);
  if (!country) return code;
  
  if (language !== 'en' && country.translations && country.translations[language as keyof typeof country.translations]) {
    return country.translations[language as keyof typeof country.translations] || country.name;
  }
  
  return country.name;
};

// Major currencies for quick selection
export const majorAfricanCurrencies = [
  'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'TZS', 'UGX', 'ETB', 'XOF', 'XAF', 'MAD'
];

// Popular business countries (including USD/EUR)
export const popularBusinessCountries = [
  'NG', 'ZA', 'KE', 'GH', 'EG', 'MA', 'TZ', 'UG', 'ET', 'RW', 'SN', 'CI', 'US', 'EU'
];