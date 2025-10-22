import ChordRelationships from '../theory/ChordRelationships.js';
import debugLog from '../utils/debugLog.js';

export default class PlayCR {
  static execute(store, parameter) {
    const { cr, root = 60, inv = 0 } = parameter;
    
    const validatedRoot = typeof root === "number" ? root : 60;
    const validatedInv = typeof inv === "number" ? inv : 0;

    debugLog("Playing CR:", cr.label, "root:", validatedRoot, "inversion:", validatedInv);
    
    const chords = ChordRelationships.getChordsNotes(cr, validatedRoot, validatedInv);
    
    this.#playSequence(store, chords.rootChord.notes, chords.targetChord.notes, 1000);
  }

  static #playSequence(store, rootChordNotes, targetChordNotes, timeMs = 1000) {
    return new Promise(async (resolve) => {
      // Stop any existing audio before starting new sequence
      if (store.audio && typeof store.audio.stopAll === 'function') {
        store.audio.stopAll();
      }
      
      await this.#wait(0);
      store.audio.playNotes(rootChordNotes);
      await this.#wait(timeMs);
      store.audio.playNotes(targetChordNotes);
      resolve();
    });
  }

  static #wait(timeMs) {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeMs);
    });
  }

  
  static #playRootChord(store, cr, validatedRoot, validatedInv) {
    const chords = ChordRelationships.getChordsNotes(cr, validatedRoot, validatedInv);
    store.audio.playNotes(chords.rootChord.notes);
    debugLog("Playing root chord:", cr.label);
  }

  static #playTargetChord(store, cr, validatedRoot, validatedInv) {
    const chords = ChordRelationships.getChordsNotes(cr, validatedRoot, validatedInv);
    store.audio.playNotes(chords.targetChord.notes);
    debugLog("Playing target chord:", cr.label);
  }
}
