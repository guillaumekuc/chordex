export default class Intervals {

  static integers = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11
  ]; 

  static semitones = this.integers;

  static degrees = [
    "1",   
    "♭2",  
    "2",  
    "♭3",
    "3",
    "4",
    "♭5",
    "5", 
    "♭6",
    "6", 
    "♭7", 
    "7", 
  ];

  static romans = [
    "I",    
    "♭II",  
    "II",   
    "♭III", 
    "III", 
    "IV", 
    "♭V", 
    "V",
    "♭VI",
    "VI",
    "♭VII",
    "VII",
  ];

  static names = [
    "unison",
    "minor 2nd",
    "major 2nd",
    "minor 3rd",
    "major 3rd",
    "perfect 4th",
    "diminished 5th",
    "perfect 5th",
    "minor 6th",
    "major 6th",
    "minor 7th",
    "major 7th",
  ];

  //LOOKUPS

  static toDegree(semitone) {
    return this.degrees[semitone % 12];
  }

  static toRoman(semitone) {
    return this.romans[semitone % 12];
  }

  static toName(semitone) {
    return this.names[semitone % 12];
  }


  //REVERSE LOOKUPS

  static fromDegree(degree) {
    const index = this.degrees.indexOf(degree);

    if (index === -1) {
      return null;
    }

    return this.semitones[index];
  }

  static fromRoman(roman) {
    const index = this.romans.indexOf(roman);

    if (index === -1) {
      return null;
    }

    return this.semitones[index];
  }

  static fromName(name) {
    
    const index = this.names.indexOf(name.toLowerCase());

    if (index === -1) {
      return null;
    }

    return this.semitones[index];
  }

  //ARITHMETIC

  static add(a, b) {
    return this.normalize(a + b);
  }

  static subtract(a, b) {
    return this.normalize(a - b);
  }

  static normalize(semitone) {
    // Keep intervals within 0–11 (e.g. -1 → 11, 13 → 1).
    let normalized = semitone % 12;

    // In JS, negative numbers keep their sign in modulo.
    if (normalized < 0) {
      normalized = normalized + 12;
    }

    return normalized;
  }

  static describe(semitone) {
    const normalized = this.normalize(semitone);

    return {
      integer: normalized,
      semitone: normalized,
      degree: this.degrees[normalized],
      roman: this.romans[normalized],
      name: this.names[normalized],
    };
  }

}
