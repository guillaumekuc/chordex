import MIDI from '../utils/MIDI.js';

export default class DownloadMIDI {
  static execute(store) {
    const progression = store.generator.progression;
    
    if (!progression || progression.length === 0) {
      console.warn('No chord progression to download');
      return;
    }

    // Construct MIDI file from chord progression
    const midiData = MIDI.ConstructMIDIFromChordProgression(store, progression);
    
    if (!midiData) {
      console.error('Failed to construct MIDI file');
      return;
    }

    // Store the MIDI data in the store
    store.generator.midi = midiData;

    // Create a blob with the MIDI data
    const blob = new Blob([midiData], { type: 'audio/midi' });

    // Create a download URL
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chord-progression.mid';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
}

