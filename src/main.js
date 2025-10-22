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

store.audio = new AudioEngine();

app.mount("#app");

window.API = { store: store };
