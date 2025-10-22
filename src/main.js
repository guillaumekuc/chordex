import "@picocss/pico/css/pico.min.css";
import "@picocss/pico/css/pico.colors.min.css";
import "./styles/keyboard-vars.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { useStore } from "./store";

import AudioEngine from "./audio/AudioEngine.js";
import ChordRelationships from "./theory/ChordRelationships.js";
import Scales from "./theory/Scales.js";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

ChordRelationships.mapScales(Scales.all);

const store = useStore();

// Initialize AudioEngine with error handling
try {
  store.audio = new AudioEngine();
} catch (error) {
  console.warn('AudioEngine initialization failed:', error.message);
  // Create a mock audio engine for graceful degradation
  store.audio = {
    playNotes: () => console.warn('Audio not available'),
    playNote: () => console.warn('Audio not available'),
    playTone: () => console.warn('Audio not available'),
    stopAll: () => {},
    destroy: () => {}
  };
}

app.mount("#app");

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (store.audio && typeof store.audio.destroy === 'function') {
    store.audio.destroy();
  }
});

window.API = { store: store };
