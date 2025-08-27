// Jest globals are available without import in standard Jest setup
import {
  isValidLocale,
  getOppositeLocale,
  localizedPath,
  unlocalizedPath,
  getLocaleFromPath,
  direction,
  formatNumber,
  formatDate,
} from '@/lib/i18n/utils';

describe('I18n Utils', () => {
  describe('isValidLocale', () => {
    it('should validate Arabic locale', () => {
      expect(isValidLocale('ar')).toBe(true);
    });

    it('should validate English locale', () => {
      expect(isValidLocale('en')).toBe(true);
    });

    it('should reject invalid locale', () => {
      expect(isValidLocale('fr')).toBe(false);
      expect(isValidLocale('invalid')).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('getOppositeLocale', () => {
    it('should return English for Arabic', () => {
      expect(getOppositeLocale('ar')).toBe('en');
    });

    it('should return Arabic for English', () => {
      expect(getOppositeLocale('en')).toBe('ar');
    });
  });

  describe('localizedPath', () => {
    it('should add locale prefix to path', () => {
      expect(localizedPath('/about', 'ar')).toBe('/ar/about');
      expect(localizedPath('/about', 'en')).toBe('/en/about');
    });

    it('should handle root path', () => {
      expect(localizedPath('/', 'ar')).toBe('/ar/');
      expect(localizedPath('', 'ar')).toBe('/ar');
    });

    it('should handle path without leading slash', () => {
      expect(localizedPath('about', 'ar')).toBe('/ar/about');
    });
  });

  describe('unlocalizedPath', () => {
    it('should remove locale prefix from path', () => {
      expect(unlocalizedPath('/ar/about')).toBe('/about');
      expect(unlocalizedPath('/en/about')).toBe('/about');
    });

    it('should handle root locale path', () => {
      expect(unlocalizedPath('/ar/')).toBe('/');
      expect(unlocalizedPath('/en')).toBe('/');
    });

    it('should return original path if no locale', () => {
      expect(unlocalizedPath('/about')).toBe('/about');
      expect(unlocalizedPath('/fr/about')).toBe('/fr/about');
    });
  });

  describe('getLocaleFromPath', () => {
    it('should extract locale from path', () => {
      expect(getLocaleFromPath('/ar/about')).toBe('ar');
      expect(getLocaleFromPath('/en/about')).toBe('en');
    });

    it('should return null for invalid locale', () => {
      expect(getLocaleFromPath('/fr/about')).toBe(null);
      expect(getLocaleFromPath('/about')).toBe(null);
    });
  });

  describe('direction', () => {
    it('should identify RTL locale', () => {
      expect(direction.isRTL('ar')).toBe(true);
      expect(direction.isRTL('en')).toBe(false);
    });

    it('should identify LTR locale', () => {
      expect(direction.isLTR('en')).toBe(true);
      expect(direction.isLTR('ar')).toBe(false);
    });

    it('should return correct direction string', () => {
      expect(direction.getDir('ar')).toBe('rtl');
      expect(direction.getDir('en')).toBe('ltr');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers for Arabic locale', () => {
      const result = formatNumber(1234.56, 'ar');
      expect(typeof result).toBe('string');
      expect(result).toContain('1');
    });

    it('should format numbers for English locale', () => {
      const result = formatNumber(1234.56, 'en');
      expect(typeof result).toBe('string');
      expect(result).toContain('1,234.56');
    });
  });

  describe('formatDate', () => {
    it('should format dates for different locales', () => {
      const date = new Date('2024-01-15');
      
      const arResult = formatDate(date, 'ar');
      const enResult = formatDate(date, 'en');
      
      expect(typeof arResult).toBe('string');
      expect(typeof enResult).toBe('string');
      expect(arResult).not.toBe(enResult);
    });
  });
});
