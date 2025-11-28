import ChordProgressions from '../theory/ChordProgressions.js';
import MidiWriter from 'midi-writer-js';

/**
 * MIDI utility for constructing MIDI files from chord progressions
 */
export default class MIDI {
  /**
   * Constructs a MIDI file from a chord progression
   * @param {Object} store - The Pinia store instance
   * @param {Array} chordProgression - The chord progression array
   * @returns {Uint8Array} - The MIDI file as a binary array
   */
  static ConstructMIDIFromChordProgression(store, chordProgression) {
    if (!chordProgression || chordProgression.length === 0) {
      console.warn('MIDI: No chord progression provided');
      return null;
    }

    // Get progression with notes using existing ChordProgressions utility
    const progressionWithNotes = ChordProgressions.constructNotes(store, chordProgression);
    
    if (!progressionWithNotes || progressionWithNotes.length === 0) {
      console.warn('MIDI: No notes in progression');
      return null;
    }
    
    // Validate that all chords have notes
    const chordsWithNotes = progressionWithNotes.filter(item => item.notes && Array.isArray(item.notes) && item.notes.length > 0);
    if (chordsWithNotes.length === 0) {
      console.warn('MIDI: No chords with valid notes');
      return null;
    }
    
    console.log(`MIDI: Constructing MIDI file with ${chordsWithNotes.length} chords`);
    
    // Calculate timing based on tempo
    const tempo = store.generator.tempo || 120;
    
    try {
      // Create a new track
      const track = new MidiWriter.Track();
      
      // Set tempo
      track.setTempo(tempo);
      
      // Add note events for each chord
      for (let i = 0; i < chordsWithNotes.length; i++) {
        const item = chordsWithNotes[i];
        const notes = item.notes;
        
        if (notes && Array.isArray(notes) && notes.length > 0) {
          // Convert MIDI note numbers to note name strings (e.g., "C4", "D#5")
          const midiNotes = notes.map(note => this.#midiNoteToName(note));
          
          // Add chord as simultaneous notes (whole note = 4 beats = '1')
          // MidiWriter uses '1' for whole note, '2' for half note, '4' for quarter note, etc.
          track.addEvent(new MidiWriter.NoteEvent({
            pitch: midiNotes,
            duration: '1', // Whole note (4 beats)
            velocity: 100
          }));
        }
      }
      
      // Create the MIDI file writer
      const write = new MidiWriter.Writer([track]);
      
      // Get the MIDI file data using dataUri() which is more reliable
      // dataUri() returns a data URI string like "data:audio/midi;base64,<base64data>"
      const dataUri = write.dataUri();
      
      if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
        throw new Error(`Invalid data URI from MidiWriter: ${typeof dataUri}`);
      }
      
      // Extract base64 part from data URI (format: data:audio/midi;base64,<data>)
      const commaIndex = dataUri.indexOf(',');
      if (commaIndex === -1) {
        throw new Error('Invalid data URI format: no comma found');
      }
      
      const base64Data = dataUri.substring(commaIndex + 1);
      
      // Convert base64 to Uint8Array
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log(`MIDI: Successfully created MIDI file, ${bytes.length} bytes`);
      return bytes;
      
    } catch (error) {
      console.error('MIDI: Error creating MIDI file:', error);
      return null;
    }
  }

  /**
   * Converts MIDI note number (0-127) to note name string (e.g., "C4", "D#5")
   * @private
   */
  static #midiNoteToName(midiNote) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return noteNames[noteIndex] + octave;
  }
}
