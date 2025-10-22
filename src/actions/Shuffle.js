import debugLog from '../utils/debugLog.js';

export default class Shuffle {

  static execute(store) {
    debugLog('Shuffling', store.filtered.length, 'filtered results');
    const shuffled = shuffleArray(store.filtered);
    store.shuffled = shuffled;

    function shuffleArray(arr) {
      const array = [...arr];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }

  static reset(store) {
    debugLog('Resetting shuffle - returning to normal order');
    store.shuffled = null;
  }
}