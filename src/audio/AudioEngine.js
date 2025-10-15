export default class AudioEngine {
  constructor() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
  }

  playNotes(notesArray, duration = 1){
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

    // simple pluck envelope
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}
