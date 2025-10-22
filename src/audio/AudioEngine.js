export default class AudioEngine {
  constructor() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
    
    // Track active audio nodes for cleanup
    this.activeNodes = new Set();
  }

  // Stop all currently playing audio
  stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if (node.oscillator) {
          node.oscillator.stop();
          node.oscillator.disconnect();
        }
        if (node.gain) {
          node.gain.disconnect();
        }
      } catch (error) {
        // Node may already be stopped/disconnected
        console.warn('Audio node cleanup warning:', error.message);
      }
    });
    this.activeNodes.clear();
  }

  playNotes(notesArray, duration = 1){
    // Stop any existing audio before playing new notes
    this.stopAll();
    
    notesArray.forEach(note => {
      this.playNote(note, duration);
    })
  }

  playNote(midiNote, duration=1) { 
    const frequency= 440 * Math.pow(2, (midiNote - 69) / 12);
    this.playTone(frequency, duration);
  }

  playTone(frequency, duration = 1) {
    if (!Number.isFinite(frequency) || frequency <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    osc.connect(gain).connect(this.master);

    // Create node reference for tracking
    const nodeRef = { oscillator: osc, gain: gain };
    this.activeNodes.add(nodeRef);

    // simple pluck envelope
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);

    // Enhanced cleanup with error handling
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
        this.activeNodes.delete(nodeRef);
      } catch (error) {
        console.warn('Audio node cleanup error:', error.message);
        // Ensure node is removed from tracking even if cleanup fails
        this.activeNodes.delete(nodeRef);
      }
    };
  }

  // Cleanup method for component unmounting
  destroy() {
    this.stopAll();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}
