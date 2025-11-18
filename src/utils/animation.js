/**
 * Keyboard animation utility
 * Manages a single shared animation interval for all keyboard keys
 */

class Animation {
  constructor() {
    this.PHASE_DURATION = 1000; // Duration of each phase in milliseconds (1s)
    this.animationInterval = null;
  }

  /**
   * Start the keyboard animation
   * @param {Object} store - The Pinia store instance
   */
  start(store) {
    if (this.animationInterval) {
      // Already running, don't start again
      return;
    }

    store.animationPhase = 0;
    
    this.animationInterval = setInterval(() => {
      // Alternate between passive phase (0) and overlap phase (1)
      store.animationPhase = store.animationPhase === 0 ? 1 : 0;
    }, this.PHASE_DURATION);
  }

  /**
   * Stop the keyboard animation
   */
  stop() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}

export default new Animation();

