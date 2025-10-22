import debugLog from '../utils/debugLog.js';

export default class Shuffle {

  static execute(store) {
    debugLog('Shuffling', store.filtered.length, 'filtered results');
    const shuffled = this.shuffleArray(store.filtered);
    store.shuffled = shuffled;
  }

  static reset(store) {
    debugLog('Resetting shuffle - returning to normal order');
    store.shuffled = null;
  }

  static shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}