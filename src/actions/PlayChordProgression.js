import ChordProgressions from '../theory/ChordProgressions.js';

export default class PlayChordProgression {
  static execute(store) {
    const progression = store.generator.progression;
    
    if (!progression || progression.length === 0) {
      return;
    }

    // Construct the notes using the function in theory/ChordProgressions
    const progressionWithNotes = ChordProgressions.constructNotes(store, progression);
    
    // Console log the notes for each chord
    const notesArrays = progressionWithNotes.map(item => item.notes);
    console.log('Chord progression notes:', notesArrays.map(notes => `[${notes.join(', ')}]`).join(', '));
    
    // Play each chord with a delay
    this.#playProgressionSequence(store, progressionWithNotes);
  }

  /**
   * Plays a single chord
   * @param {Object} store - The Pinia store instance
   * @param {Array} notes - Array of MIDI note numbers
   * @param {number} duration - Duration in seconds
   */
  static #playChord(store, notes, duration = 1) {
    if (!store.audio || !Array.isArray(notes)) {
      return;
    }
    store.audio.playNotes(notes, duration);
  }

  /**
   * Plays the progression sequence with delays between chords
   * @param {Object} store - The Pinia store instance
   * @param {Array} progressionWithNotes - Progression with notes property
   */
  static async #playProgressionSequence(store, progressionWithNotes) {
    // Stop any existing audio before starting new sequence
    if (store.audio && typeof store.audio.stopAll === 'function') {
      store.audio.stopAll();
    }

    const chordDuration = 1; // seconds
    const delayBetweenChords = 500; // milliseconds

    for (let i = 0; i < progressionWithNotes.length; i++) {
      const item = progressionWithNotes[i];
      
      if (item.notes && Array.isArray(item.notes)) {
        this.#playChord(store, item.notes, chordDuration);
      }
      
      // Wait before playing next chord (except for the last one)
      if (i < progressionWithNotes.length - 1) {
        await this.#wait(delayBetweenChords);
      }
    }
  }

  /**
   * Wait utility function
   * @param {number} timeMs - Time to wait in milliseconds
   * @returns {Promise} - Promise that resolves after the delay
   */
  static #wait(timeMs) {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeMs);
    });
  }
}