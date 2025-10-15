import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia();
app.use(pinia);

import { useStore } from './store';
import AudioEngine from './audio/AudioEngine.js';
import ChordRelationships from "./theory/ChordRelationships.js";
import Scales from "./theory/Scales.js";
import Search from "./actions/Search.js";

const store = useStore();

store.audio = new AudioEngine()
ChordRelationships.mapScales(Scales.all);
store.chordRelationships=ChordRelationships.all;
store.activeFilters= Search.defaultFilters();
store.filtered = Search.execute(store.chordRelationships, store.activeFilters);


app.mount('#app');

window.API={};
window.API.store=store;