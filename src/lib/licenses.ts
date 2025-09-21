export interface License {
  code: string;
  name: {
    en: string;
    ar: string;
  };
  deedUrl: string;
}

const licenseData: License[] = [
  {
    code: 'CC0',
    name: {
      en: 'Fully Open',
      ar: 'مفتوح بالكامل'
    },
    deedUrl: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  {
    code: 'CC-BY',
    name: {
      en: 'Attribution',
      ar: 'إسناد'
    },
    deedUrl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    code: 'CC-BY-SA',
    name: {
      en: 'Attribution ShareAlike',
      ar: 'إسناد ومشاركة بالمثل'
    },
    deedUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
  },
  {
    code: 'CC-BY-ND',
    name: {
      en: 'Attribution No Derivatives',
      ar: 'إسناد وبلا اشتقاق'
    },
    deedUrl: 'https://creativecommons.org/licenses/by-nd/4.0/'
  },
  {
    code: 'CC-BY-NC',
    name: {
      en: 'Attribution Non-Commercial',
      ar: 'إسناد واستخدام غير تجاري'
    },
    deedUrl: 'https://creativecommons.org/licenses/by-nc/4.0/'
  },
  {
    code: 'CC-BY-NC-SA',
    name: {
      en: 'Attribution Non-Commercial ShareAlike',
      ar: 'إسناد واستخدام غير تجاري ومشاركة بالمثل'
    },
    deedUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  {
    code: 'CC-BY-NC-ND',
    name: {
      en: 'Attribution Non-Commercial No Derivatives',
      ar: 'إسناد واستخدام غير تجاري وبلا اشتقاق'
    },
    deedUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
  }
];

// Create a lookup map with both uppercase and lowercase keys for compatibility
export const licenses: Record<string, License> = {};

licenseData.forEach(license => {
  // Add uppercase version
  licenses[license.code] = license;
  // Add lowercase version for backward compatibility
  licenses[license.code.toLowerCase()] = license;
});

export function getLicense(code: string): License | null {
  if (!code) return null;
  // Try exact match first, then try uppercase, then try lowercase
  return licenses[code] || licenses[code.toUpperCase()] || licenses[code.toLowerCase()] || null;
}
