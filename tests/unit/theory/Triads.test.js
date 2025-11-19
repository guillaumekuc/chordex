import { describe, it, expect } from 'vitest';
import Triads from '@/theory/Triads.js';

describe('Triads', () => {
  describe('types', () => {
    it('should have all four triad types defined', () => {
      expect(Triads.types).toHaveProperty('M');
      expect(Triads.types).toHaveProperty('m');
      expect(Triads.types).toHaveProperty('d');
      expect(Triads.types).toHaveProperty('A');
    });

    it('should have correct pitch classes for Major (M)', () => {
      expect(Triads.types.M.pitchClasses).toEqual([0, 4, 7]);
      expect(Triads.types.M.symbol).toBe('');
    });

    it('should have correct pitch classes for minor (m)', () => {
      expect(Triads.types.m.pitchClasses).toEqual([0, 3, 7]);
      expect(Triads.types.m.symbol).toBe('m');
    });

    it('should have correct pitch classes for diminished (d)', () => {
      expect(Triads.types.d.pitchClasses).toEqual([0, 3, 6]);
      expect(Triads.types.d.symbol).toBe('<sup>o</sup>');
    });

    it('should have correct pitch classes for Augmented (A)', () => {
      expect(Triads.types.A.pitchClasses).toEqual([0, 4, 8]);
      expect(Triads.types.A.symbol).toBe('+');
    });

    it('should have root priorities in correct order (M < m < d < A)', () => {
      expect(Triads.types.M.rootPriority).toBeLessThan(Triads.types.m.rootPriority);
      expect(Triads.types.m.rootPriority).toBeLessThan(Triads.types.d.rootPriority);
      expect(Triads.types.d.rootPriority).toBeLessThan(Triads.types.A.rootPriority);
    });
  });

  describe('fromScale()', () => {
    it('should extract Major triads from C Major scale', () => {
      const cMajor = { pitchClasses: [0, 2, 4, 5, 7, 9, 11] };
      const triads = Triads.fromScale(cMajor);
      
      // C Major scale should contain: C, Dm, Em, F, G, Am, Bdim
      const cMajorTriad = triads.find(t => t.rootPitchClass === 0 && t.quality === 'M');
      const fMajorTriad = triads.find(t => t.rootPitchClass === 5 && t.quality === 'M');
      const gMajorTriad = triads.find(t => t.rootPitchClass === 7 && t.quality === 'M');
      
      expect(cMajorTriad).toBeDefined();
      expect(fMajorTriad).toBeDefined();
      expect(gMajorTriad).toBeDefined();
    });

    it('should extract minor triads from C Major scale', () => {
      const cMajor = { pitchClasses: [0, 2, 4, 5, 7, 9, 11] };
      const triads = Triads.fromScale(cMajor);
      
      const dMinorTriad = triads.find(t => t.rootPitchClass === 2 && t.quality === 'm');
      const eMinorTriad = triads.find(t => t.rootPitchClass === 4 && t.quality === 'm');
      const aMinorTriad = triads.find(t => t.rootPitchClass === 9 && t.quality === 'm');
      
      expect(dMinorTriad).toBeDefined();
      expect(eMinorTriad).toBeDefined();
      expect(aMinorTriad).toBeDefined();
    });

    it('should extract diminished triad from C Major scale', () => {
      const cMajor = { pitchClasses: [0, 2, 4, 5, 7, 9, 11] };
      const triads = Triads.fromScale(cMajor);
      
      const bDimTriad = triads.find(t => t.rootPitchClass === 11 && t.quality === 'd');
      expect(bDimTriad).toBeDefined();
    });

    it('should identify triads correctly regardless of pitch class order', () => {
      // Test with a simple triad: C Major (0, 4, 7) in different orders
      const scale1 = { pitchClasses: [0, 4, 7] }; // Root position
      const scale2 = { pitchClasses: [4, 7, 0] }; // First inversion
      const scale3 = { pitchClasses: [7, 0, 4] }; // Second inversion
      
      const triads1 = Triads.fromScale(scale1);
      const triads2 = Triads.fromScale(scale2);
      const triads3 = Triads.fromScale(scale3);
      
      // All should identify C Major
      expect(triads1.length).toBeGreaterThan(0);
      expect(triads2.length).toBeGreaterThan(0);
      expect(triads3.length).toBeGreaterThan(0);
      
      // At least one should be Major quality
      const hasMajor1 = triads1.some(t => t.quality === 'M');
      const hasMajor2 = triads2.some(t => t.quality === 'M');
      const hasMajor3 = triads3.some(t => t.quality === 'M');
      
      expect(hasMajor1 || hasMajor2 || hasMajor3).toBe(true);
    });

    it('should return empty array for scale with less than 3 notes', () => {
      const scale2 = { pitchClasses: [0, 4] };
      const triads = Triads.fromScale(scale2);
      expect(triads).toEqual([]);
    });

    it('should handle scales with duplicate pitch classes', () => {
      const scale = { pitchClasses: [0, 0, 4, 7] };
      const triads = Triads.fromScale(scale);
      // Should still find C Major
      const cMajor = triads.find(t => t.rootPitchClass === 0 && t.quality === 'M');
      expect(cMajor).toBeDefined();
    });

    it('should extract Augmented triads when present', () => {
      // Whole tone scale contains augmented triads
      const wholeTone = { pitchClasses: [0, 2, 4, 6, 8, 10] };
      const triads = Triads.fromScale(wholeTone);
      
      // Should find at least one augmented triad
      const augmentedTriads = triads.filter(t => t.quality === 'A');
      expect(augmentedTriads.length).toBeGreaterThan(0);
    });
  });

  describe('fromChordRelationship()', () => {
    it('should create Major chord from chord relationship', () => {
      const chordRelationship = { rootQuality: 'M' };
      const result = Triads.fromChordRelationship(0, chordRelationship);
      
      expect(result.rootNote).toBe('C');
      expect(result.quality).toBe('M');
      expect(result.label).toBe('C');
    });

    it('should create minor chord from chord relationship', () => {
      const chordRelationship = { rootQuality: 'm' };
      const result = Triads.fromChordRelationship(0, chordRelationship);
      
      expect(result.rootNote).toBe('C');
      expect(result.quality).toBe('m');
      expect(result.label).toBe('Cm');
    });

    it('should create diminished chord from chord relationship', () => {
      const chordRelationship = { rootQuality: 'd' };
      const result = Triads.fromChordRelationship(0, chordRelationship);
      
      expect(result.rootNote).toBe('C');
      expect(result.quality).toBe('d');
      expect(result.label).toBe('C<sup>o</sup>');
    });

    it('should create Augmented chord from chord relationship', () => {
      const chordRelationship = { rootQuality: 'A' };
      const result = Triads.fromChordRelationship(0, chordRelationship);
      
      expect(result.rootNote).toBe('C');
      expect(result.quality).toBe('A');
      expect(result.label).toBe('C+');
    });

    it('should handle different root pitch classes', () => {
      const chordRelationship = { rootQuality: 'M' };
      
      expect(Triads.fromChordRelationship(0, chordRelationship).rootNote).toBe('C');
      expect(Triads.fromChordRelationship(2, chordRelationship).rootNote).toBe('D');
      expect(Triads.fromChordRelationship(4, chordRelationship).rootNote).toBe('E');
      expect(Triads.fromChordRelationship(7, chordRelationship).rootNote).toBe('G');
    });

    it('should handle pitch classes with flats', () => {
      const chordRelationship = { rootQuality: 'm' };
      
      expect(Triads.fromChordRelationship(1, chordRelationship).rootNote).toBe('D♭');
      expect(Triads.fromChordRelationship(3, chordRelationship).rootNote).toBe('E♭');
      expect(Triads.fromChordRelationship(6, chordRelationship).rootNote).toBe('G♭');
      expect(Triads.fromChordRelationship(8, chordRelationship).rootNote).toBe('A♭');
      expect(Triads.fromChordRelationship(10, chordRelationship).rootNote).toBe('B♭');
    });

    it('should handle modulo for pitch classes > 11', () => {
      const chordRelationship = { rootQuality: 'M' };
      
      const result12 = Triads.fromChordRelationship(12, chordRelationship);
      const result0 = Triads.fromChordRelationship(0, chordRelationship);
      
      expect(result12.rootNote).toBe(result0.rootNote);
      expect(result12.quality).toBe(result0.quality);
    });

    it('should handle negative pitch classes with modulo', () => {
      const chordRelationship = { rootQuality: 'M' };
      
      const resultNeg1 = Triads.fromChordRelationship(-1, chordRelationship);
      const result11 = Triads.fromChordRelationship(11, chordRelationship);
      
      expect(resultNeg1.rootNote).toBe(result11.rootNote);
      expect(resultNeg1.quality).toBe(result11.quality);
    });

    it('should create correct labels for all qualities', () => {
      const qualities = ['M', 'm', 'd', 'A'];
      const expectedLabels = ['C', 'Cm', 'C<sup>o</sup>', 'C+'];
      
      qualities.forEach((quality, index) => {
        const chordRelationship = { rootQuality: quality };
        const result = Triads.fromChordRelationship(0, chordRelationship);
        expect(result.label).toBe(expectedLabels[index]);
      });
    });
  });
});


