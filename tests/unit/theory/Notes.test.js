import { describe, it, expect } from 'vitest';
import Notes from '@/theory/Notes.js';

describe('Notes', () => {
  describe('fromPitchClass()', () => {
    it('should return correct note for each pitch class 0-11', () => {
      expect(Notes.fromPitchClass(0)).toBe('C');
      expect(Notes.fromPitchClass(1)).toBe('D♭');
      expect(Notes.fromPitchClass(2)).toBe('D');
      expect(Notes.fromPitchClass(3)).toBe('E♭');
      expect(Notes.fromPitchClass(4)).toBe('E');
      expect(Notes.fromPitchClass(5)).toBe('F');
      expect(Notes.fromPitchClass(6)).toBe('G♭');
      expect(Notes.fromPitchClass(7)).toBe('G');
      expect(Notes.fromPitchClass(8)).toBe('A♭');
      expect(Notes.fromPitchClass(9)).toBe('A');
      expect(Notes.fromPitchClass(10)).toBe('B♭');
      expect(Notes.fromPitchClass(11)).toBe('B');
    });

    it('should handle values > 11 with modulo', () => {
      expect(Notes.fromPitchClass(12)).toBe('C');
      expect(Notes.fromPitchClass(13)).toBe('D♭');
      expect(Notes.fromPitchClass(24)).toBe('C');
      expect(Notes.fromPitchClass(25)).toBe('D♭');
    });

    it('should handle negative values with modulo', () => {
      expect(Notes.fromPitchClass(-1)).toBe('B');
      expect(Notes.fromPitchClass(-12)).toBe('C');
      expect(Notes.fromPitchClass(-13)).toBe('B');
    });

    it('should handle edge cases', () => {
      expect(Notes.fromPitchClass(0)).toBe('C');
      expect(Notes.fromPitchClass(11)).toBe('B');
      expect(Notes.fromPitchClass(12)).toBe('C');
    });

    it('should handle large positive numbers with modulo', () => {
      expect(Notes.fromPitchClass(60)).toBe('C'); // 60 % 12 = 0
      expect(Notes.fromPitchClass(61)).toBe('D♭'); // 61 % 12 = 1
      expect(Notes.fromPitchClass(72)).toBe('C'); // 72 % 12 = 0
    });
  });

  describe('letters array', () => {
    it('should have all 12 pitch classes defined', () => {
      expect(Notes.letters).toHaveLength(12);
      expect(Notes.letters[0]).toBe('C');
      expect(Notes.letters[11]).toBe('B');
    });

    it('should use flat notation with actual flat sign (D♭, E♭, G♭, A♭, B♭)', () => {
      expect(Notes.letters[1]).toBe('D♭');
      expect(Notes.letters[3]).toBe('E♭');
      expect(Notes.letters[6]).toBe('G♭');
      expect(Notes.letters[8]).toBe('A♭');
      expect(Notes.letters[10]).toBe('B♭');
    });

    it('should have natural notes in correct positions', () => {
      expect(Notes.letters[0]).toBe('C');
      expect(Notes.letters[2]).toBe('D');
      expect(Notes.letters[4]).toBe('E');
      expect(Notes.letters[5]).toBe('F');
      expect(Notes.letters[7]).toBe('G');
      expect(Notes.letters[9]).toBe('A');
      expect(Notes.letters[11]).toBe('B');
    });
  });
});

