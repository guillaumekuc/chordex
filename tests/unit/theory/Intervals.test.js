import { describe, it, expect } from 'vitest';
import Intervals from '@/theory/Intervals.js';

describe('Intervals', () => {
  describe('toDegree()', () => {
    it('should return correct degree for each semitone', () => {
      expect(Intervals.toDegree(0)).toBe('1');
      expect(Intervals.toDegree(1)).toBe('♭2');
      expect(Intervals.toDegree(2)).toBe('2');
      expect(Intervals.toDegree(3)).toBe('♭3');
      expect(Intervals.toDegree(4)).toBe('3');
      expect(Intervals.toDegree(5)).toBe('4');
      expect(Intervals.toDegree(6)).toBe('♭5');
      expect(Intervals.toDegree(7)).toBe('5');
      expect(Intervals.toDegree(8)).toBe('♭6');
      expect(Intervals.toDegree(9)).toBe('6');
      expect(Intervals.toDegree(10)).toBe('♭7');
      expect(Intervals.toDegree(11)).toBe('7');
    });

    it('should handle values > 12 with modulo', () => {
      expect(Intervals.toDegree(12)).toBe('1');
      expect(Intervals.toDegree(13)).toBe('♭2');
      expect(Intervals.toDegree(24)).toBe('1');
      expect(Intervals.toDegree(25)).toBe('♭2');
    });

    it('should handle negative values with modulo', () => {
      expect(Intervals.toDegree(-1)).toBe('7');
      expect(Intervals.toDegree(-2)).toBe('♭7');
      expect(Intervals.toDegree(-12)).toBe('1');
      expect(Intervals.toDegree(-13)).toBe('7');
    });
  });

  describe('toRoman()', () => {
    it('should return correct roman numeral for each semitone', () => {
      expect(Intervals.toRoman(0)).toBe('I');
      expect(Intervals.toRoman(1)).toBe('♭II');
      expect(Intervals.toRoman(2)).toBe('II');
      expect(Intervals.toRoman(3)).toBe('♭III');
      expect(Intervals.toRoman(4)).toBe('III');
      expect(Intervals.toRoman(5)).toBe('IV');
      expect(Intervals.toRoman(6)).toBe('♭V');
      expect(Intervals.toRoman(7)).toBe('V');
      expect(Intervals.toRoman(8)).toBe('♭VI');
      expect(Intervals.toRoman(9)).toBe('VI');
      expect(Intervals.toRoman(10)).toBe('♭VII');
      expect(Intervals.toRoman(11)).toBe('VII');
    });

    it('should handle values > 12 with modulo', () => {
      expect(Intervals.toRoman(12)).toBe('I');
      expect(Intervals.toRoman(13)).toBe('♭II');
      expect(Intervals.toRoman(24)).toBe('I');
    });

    it('should handle negative values with modulo', () => {
      expect(Intervals.toRoman(-1)).toBe('VII');
      expect(Intervals.toRoman(-2)).toBe('♭VII');
      expect(Intervals.toRoman(-12)).toBe('I');
    });
  });

  describe('toName()', () => {
    it('should return correct interval name for each semitone', () => {
      expect(Intervals.toName(0)).toBe('unison');
      expect(Intervals.toName(1)).toBe('minor 2nd');
      expect(Intervals.toName(2)).toBe('major 2nd');
      expect(Intervals.toName(3)).toBe('minor 3rd');
      expect(Intervals.toName(4)).toBe('major 3rd');
      expect(Intervals.toName(5)).toBe('perfect 4th');
      expect(Intervals.toName(6)).toBe('diminished 5th');
      expect(Intervals.toName(7)).toBe('perfect 5th');
      expect(Intervals.toName(8)).toBe('minor 6th');
      expect(Intervals.toName(9)).toBe('major 6th');
      expect(Intervals.toName(10)).toBe('minor 7th');
      expect(Intervals.toName(11)).toBe('major 7th');
    });

    it('should handle values > 12 with modulo', () => {
      expect(Intervals.toName(12)).toBe('unison');
      expect(Intervals.toName(13)).toBe('minor 2nd');
    });

    it('should handle negative values with modulo', () => {
      expect(Intervals.toName(-1)).toBe('major 7th');
      expect(Intervals.toName(-12)).toBe('unison');
    });
  });

  describe('fromDegree()', () => {
    it('should return correct semitone for valid degrees', () => {
      expect(Intervals.fromDegree('1')).toBe(0);
      expect(Intervals.fromDegree('♭2')).toBe(1);
      expect(Intervals.fromDegree('2')).toBe(2);
      expect(Intervals.fromDegree('♭3')).toBe(3);
      expect(Intervals.fromDegree('3')).toBe(4);
      expect(Intervals.fromDegree('4')).toBe(5);
      expect(Intervals.fromDegree('♭5')).toBe(6);
      expect(Intervals.fromDegree('5')).toBe(7);
      expect(Intervals.fromDegree('♭6')).toBe(8);
      expect(Intervals.fromDegree('6')).toBe(9);
      expect(Intervals.fromDegree('♭7')).toBe(10);
      expect(Intervals.fromDegree('7')).toBe(11);
    });

    it('should return null for invalid degrees', () => {
      expect(Intervals.fromDegree('invalid')).toBe(null);
      expect(Intervals.fromDegree('')).toBe(null);
      expect(Intervals.fromDegree('8')).toBe(null);
      expect(Intervals.fromDegree('9')).toBe(null);
      expect(Intervals.fromDegree('♭1')).toBe(null);
    });
  });

  describe('fromRoman()', () => {
    it('should return correct semitone for valid roman numerals', () => {
      expect(Intervals.fromRoman('I')).toBe(0);
      expect(Intervals.fromRoman('♭II')).toBe(1);
      expect(Intervals.fromRoman('II')).toBe(2);
      expect(Intervals.fromRoman('♭III')).toBe(3);
      expect(Intervals.fromRoman('III')).toBe(4);
      expect(Intervals.fromRoman('IV')).toBe(5);
      expect(Intervals.fromRoman('♭V')).toBe(6);
      expect(Intervals.fromRoman('V')).toBe(7);
      expect(Intervals.fromRoman('♭VI')).toBe(8);
      expect(Intervals.fromRoman('VI')).toBe(9);
      expect(Intervals.fromRoman('♭VII')).toBe(10);
      expect(Intervals.fromRoman('VII')).toBe(11);
    });

    it('should return null for invalid roman numerals', () => {
      expect(Intervals.fromRoman('invalid')).toBe(null);
      expect(Intervals.fromRoman('')).toBe(null);
      expect(Intervals.fromRoman('VIII')).toBe(null);
      expect(Intervals.fromRoman('IX')).toBe(null);
    });
  });

  describe('fromName()', () => {
    it('should return correct semitone for valid interval names', () => {
      expect(Intervals.fromName('unison')).toBe(0);
      expect(Intervals.fromName('minor 2nd')).toBe(1);
      expect(Intervals.fromName('major 2nd')).toBe(2);
      expect(Intervals.fromName('minor 3rd')).toBe(3);
      expect(Intervals.fromName('major 3rd')).toBe(4);
      expect(Intervals.fromName('perfect 4th')).toBe(5);
      expect(Intervals.fromName('diminished 5th')).toBe(6);
      expect(Intervals.fromName('perfect 5th')).toBe(7);
      expect(Intervals.fromName('minor 6th')).toBe(8);
      expect(Intervals.fromName('major 6th')).toBe(9);
      expect(Intervals.fromName('minor 7th')).toBe(10);
      expect(Intervals.fromName('major 7th')).toBe(11);
    });

    it('should be case-insensitive', () => {
      expect(Intervals.fromName('UNISON')).toBe(0);
      expect(Intervals.fromName('Perfect 5th')).toBe(7);
      expect(Intervals.fromName('MAJOR 7TH')).toBe(11);
      expect(Intervals.fromName('Minor 3rd')).toBe(3);
    });

    it('should return null for invalid interval names', () => {
      expect(Intervals.fromName('invalid')).toBe(null);
      expect(Intervals.fromName('')).toBe(null);
      expect(Intervals.fromName('perfect 8th')).toBe(null);
      expect(Intervals.fromName('octave')).toBe(null);
    });
  });

  describe('normalize()', () => {
    it('should keep values within 0-11 range', () => {
      expect(Intervals.normalize(0)).toBe(0);
      expect(Intervals.normalize(5)).toBe(5);
      expect(Intervals.normalize(11)).toBe(11);
    });

    it('should wrap values greater than 11', () => {
      expect(Intervals.normalize(12)).toBe(0);
      expect(Intervals.normalize(13)).toBe(1);
      expect(Intervals.normalize(24)).toBe(0);
      expect(Intervals.normalize(25)).toBe(1);
    });

    it('should handle negative values correctly', () => {
      expect(Intervals.normalize(-1)).toBe(11);
      // -12 % 12 = 0, and 0 < 0 is false, so returns 0 (may be -0, but === 0)
      expect(Intervals.normalize(-12)).toBeGreaterThanOrEqual(0);
      expect(Intervals.normalize(-12)).toBeLessThan(1);
      expect(Intervals.normalize(-13)).toBe(11);
      // -24 % 12 = 0, same as above
      expect(Intervals.normalize(-24)).toBeGreaterThanOrEqual(0);
      expect(Intervals.normalize(-24)).toBeLessThan(1);
    });

    it('should handle edge cases', () => {
      expect(Intervals.normalize(0)).toBe(0);
      expect(Intervals.normalize(11)).toBe(11);
      expect(Intervals.normalize(12)).toBe(0);
      expect(Intervals.normalize(-1)).toBe(11);
      // -12 % 12 = 0 (or -0), and 0 < 0 is false, so it returns 0
      expect(Intervals.normalize(-12)).toBeGreaterThanOrEqual(0);
      expect(Intervals.normalize(-12)).toBeLessThan(1);
    });
  });

  describe('add()', () => {
    it('should add intervals correctly', () => {
      expect(Intervals.add(0, 0)).toBe(0);
      expect(Intervals.add(0, 7)).toBe(7);
      expect(Intervals.add(4, 3)).toBe(7);
      expect(Intervals.add(2, 2)).toBe(4);
    });

    it('should normalize results when sum exceeds 11', () => {
      expect(Intervals.add(7, 5)).toBe(0); // 7 + 5 = 12 → 0
      expect(Intervals.add(7, 7)).toBe(2); // 7 + 7 = 14 → 2
      expect(Intervals.add(11, 1)).toBe(0); // 11 + 1 = 12 → 0
      expect(Intervals.add(9, 5)).toBe(2); // 9 + 5 = 14 → 2
    });

    it('should handle negative results', () => {
      expect(Intervals.add(0, -1)).toBe(11);
      expect(Intervals.add(5, -7)).toBe(10);
    });
  });

  describe('subtract()', () => {
    it('should subtract intervals correctly', () => {
      expect(Intervals.subtract(7, 0)).toBe(7);
      expect(Intervals.subtract(7, 4)).toBe(3);
      expect(Intervals.subtract(4, 2)).toBe(2);
      expect(Intervals.subtract(11, 4)).toBe(7);
    });

    it('should normalize results when difference is negative', () => {
      expect(Intervals.subtract(0, 1)).toBe(11); // 0 - 1 = -1 → 11
      expect(Intervals.subtract(0, 5)).toBe(7); // 0 - 5 = -5 → 7
      expect(Intervals.subtract(3, 5)).toBe(10); // 3 - 5 = -2 → 10
      expect(Intervals.subtract(2, 7)).toBe(7); // 2 - 7 = -5 → 7
    });

    it('should handle large differences', () => {
      expect(Intervals.subtract(1, 12)).toBe(1); // 1 - 12 = -11 → 1
      expect(Intervals.subtract(0, 13)).toBe(11); // 0 - 13 = -13 → 11
    });
  });

  describe('describe()', () => {
    it('should return complete interval description for semitone 0', () => {
      const desc = Intervals.describe(0);
      expect(desc).toEqual({
        integer: 0,
        semitone: 0,
        degree: '1',
        roman: 'I',
        name: 'unison',
      });
    });

    it('should return complete interval description for semitone 7', () => {
      const desc = Intervals.describe(7);
      expect(desc).toEqual({
        integer: 7,
        semitone: 7,
        degree: '5',
        roman: 'V',
        name: 'perfect 5th',
      });
    });

    it('should normalize before describing', () => {
      const desc = Intervals.describe(13);
      expect(desc.semitone).toBe(1);
      expect(desc.degree).toBe('♭2');
      expect(desc.roman).toBe('♭II');
      expect(desc.name).toBe('minor 2nd');
    });

    it('should handle negative values', () => {
      const desc = Intervals.describe(-1);
      expect(desc.semitone).toBe(11);
      expect(desc.degree).toBe('7');
      expect(desc.roman).toBe('VII');
      expect(desc.name).toBe('major 7th');
    });

    it('should return consistent integer and semitone values', () => {
      const desc = Intervals.describe(5);
      expect(desc.integer).toBe(desc.semitone);
      expect(desc.integer).toBe(5);
    });
  });
});

