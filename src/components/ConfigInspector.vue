<template>
  <details class="configInspector">
    <summary><i class="fa fa-cog" aria-hidden="true"></i> Config</summary>

    <p>
      Keyboard layout:
      <button @click="SwitchKeyboardLayout.execute(store)">{{ layout }}</button>
    </p>
    <p>
      Root note: <button @click="UpdateRoot.execute(store, -1)"><</button
      ><kbd>{{ root }}</kbd
      ><button @click="UpdateRoot.execute(store, 1)">></button>
    </p>
    <p>
      Extended scales: 
      <button @click="toggleExtendedScales">{{ extendedScales ? 'ON' : 'OFF' }}</button>
      <button @click="showExtendedScalesHelp = true" class="help-button" title="Help">
        <i class="fa fa-question-circle"></i>
      </button>
    </p>
    <p>
      <button @click="ExportJSON.execute(store)">Export JSON</button
      ><button @click="ImportJSON.execute(store)">Import JSON</button>
    </p>
  </details>

  <!-- Extended Scales Help Modal -->
  <Modal 
    :is-open="showExtendedScalesHelp" 
    title="Extended Scales Help"
    @close="showExtendedScalesHelp = false"
  >
    <div class="extended-scales-help">
      <p>
        <strong>Extended Scales</strong> represent diatonic scales (Major scale modes) that modulate between chord changes in a chord relationship. 
        They help you find scalar movements that work across the root chord and the target chord.
      </p>
      
      <p>
        <strong>How it works:</strong> If you have a minor root chord, a Dorian scale might fit perfectly. 
        But when the chord changes to the target chord, that same Dorian scale might not work anymore. 
        You might, however, be able to modulate the scale to make it fit both chords. This is what Extended Scales are for.
      </p>
      
      <p>
        <strong>Example:</strong> Start with Dorian, then modulate up the circle of fifths two steps [+2]. 
        This would be notated <strong>Dorian[+2]</strong> - a move that fits both your root and target chords.
      </p>
      
      <p>
        <strong>Musical Application:</strong> When playing, you'd start in Dorian and modulate up 2 steps 
        on the circle of fifths when the chord changes. Note: this movement is enharmonically equivalent to playing 
        Root Dorian, then Root Ionian.
      </p>
      
      <p>
        <strong>When Extended Scales are disabled:</strong> Only basic scales (level 0) are available. 
        This gives you a simpler, more straightforward approach without modulation complexity.
      </p>
      
      <p>
        <strong>When Extended Scales are enabled:</strong> You get access to modulated diatonic scales like 
        Dorian[+2], Phrygian[-1], Ionian[+3], etc. This opens up the analysis for more dynamic scalar movements but adds complexity that may not always be necessary.
      </p>
      
      <p class="note">
        <strong>Note:</strong> Extended scales are more complex and not strictly needed for basic 
        chord relationship use cases. They're useful for further harmonic exploration.
      </p>
    </div>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "../store";
const store = useStore();

import Notes from "../theory/Notes.js";
import ExportJSON from "../actions/ExportJSON.js";
import ImportJSON from "../actions/ImportJSON.js";
import SwitchKeyboardLayout from "../actions/SwitchKeyboardLayout.js";
import UpdateRoot from "../actions/UpdateRoot.js";
import Modal from "./Modal.vue";

const showExtendedScalesHelp = ref(false);

const layout = computed(() => {
  switch (store.config.keyboardLayout) {
    case "x75":
      return "7/5 standard keyboard layout";
      break;
    case "x66":
      return "6/6 isomorphic keyboard layout";
      break;
  }
});

const root = computed(() => {
  const normalizedPc = store.config.root % 12;
  const note = Notes.fromPitchClass(normalizedPc);
  return note;
});

const extendedScales = computed(() => store.config.extendedScales);

function toggleExtendedScales() {
  store.config.extendedScales = !store.config.extendedScales;
}
</script>

<style>
.configInspector button {
  padding: 5px 10px;
  margin: 0px 5px !important;
}

.configInspector kbd {
  padding: 5px 10px;
  margin: 0px 5px !important;
}

.configInspector p {
  margin: 10px 0px;
}

.help-button {
  background: none;
  border: 1px solid var(--pico-muted-border-color);
  color: var(--pico-muted-color);
  padding: 4px 8px;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-button:hover {
  background-color: var(--pico-primary-background);
  color: var(--pico-primary);
  border-color: var(--pico-primary);
}

.extended-scales-help {
  line-height: 1.6;
}

.extended-scales-help p {
  margin: 1rem 0;
}

.extended-scales-help ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.extended-scales-help li {
  margin: 0.25rem 0;
}

.extended-scales-help strong {
  color: var(--pico-primary);
}

.extended-scales-help .note {
  background-color: var(--pico-muted-background);
  border-left: 4px solid var(--pico-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-style: italic;
}
</style>
