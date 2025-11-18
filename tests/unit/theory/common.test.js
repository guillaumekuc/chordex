import { describe, it, expect } from 'vitest';
import { modulo, modulo12 } from '@/theory/common.js';

describe('common.js', () => {
  describe('modulo()', () => {
    it('should return correct result for positive numbers within range', () => {
      expect(modulo(5, 12)).toBe(5);
      expect(modulo(11, 12)).toBe(11);
      expect(modulo(0, 12)).toBe(0);
    });

    it('should wrap values greater than modulus', () => {
      expect(modulo(12, 12)).toBe(0);
      expect(modulo(13, 12)).toBe(1);
      expect(modulo(24, 12)).toBe(0);
      expect(modulo(25, 12)).toBe(1);
    });

    it('should handle negative numbers correctly', () => {
      expect(modulo(-1, 12)).toBe(11);
      expect(modulo(-12, 12)).toBe(0);
      expect(modulo(-13, 12)).toBe(11);
      expect(modulo(-25, 12)).toBe(11);
    });

    it('should work with different moduli', () => {
      expect(modulo(7, 5)).toBe(2);
      expect(modulo(-3, 5)).toBe(2);
      expect(modulo(10, 7)).toBe(3);
      expect(modulo(15, 7)).toBe(1);
    });

    it('should handle edge cases', () => {
      expect(modulo(0, 12)).toBe(0);
      expect(modulo(12, 12)).toBe(0);
      expect(modulo(-12, 12)).toBe(0);
    });
  });

  describe('modulo12()', () => {
    it('should constrain values to 0-11 range', () => {
      expect(modulo12(0)).toBe(0);
      expect(modulo12(5)).toBe(5);
      expect(modulo12(11)).toBe(11);
    });

    it('should wrap values greater than 11', () => {
      expect(modulo12(12)).toBe(0);
      expect(modulo12(13)).toBe(1);
      expect(modulo12(24)).toBe(0);
      expect(modulo12(25)).toBe(1);
      expect(modulo12(36)).toBe(0);
    });

    it('should handle negative numbers correctly', () => {
      expect(modulo12(-1)).toBe(11);
      expect(modulo12(-12)).toBe(0);
      expect(modulo12(-13)).toBe(11);
      expect(modulo12(-25)).toBe(11);
      expect(modulo12(-24)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(modulo12(0)).toBe(0);
      expect(modulo12(11)).toBe(11);
      expect(modulo12(12)).toBe(0);
      expect(modulo12(-1)).toBe(11);
      expect(modulo12(-12)).toBe(0);
    });

    it('should handle large positive numbers', () => {
      expect(modulo12(100)).toBe(4);
      expect(modulo12(144)).toBe(0);
      expect(modulo12(145)).toBe(1);
    });

    it('should handle large negative numbers', () => {
      expect(modulo12(-100)).toBe(8);
      expect(modulo12(-144)).toBe(0);
      expect(modulo12(-145)).toBe(11);
    });
  });
});

