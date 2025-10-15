import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'


import { useStore } from './store';
import AudioEngine from './audio/AudioEngine.js';

const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

const store = useStore();

store.audio = new AudioEngine();
