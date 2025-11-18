<template>
  <details class="configInspector">
    <summary><i class="fa fa-cog" aria-hidden="true"></i> Config</summary>

    <p>
      Keyboard layout:
      <button @click="SwitchKeyboardLayout.execute(store)">{{ layout }}</button>
      <button @click="showKeyboardLayoutHelp = true" class="help-button" title="Help">
        <i class="fa fa-question-circle"></i>
      </button>
    </p>
    <p>
      Root note: <button @click="UpdateChordProgressionRoot.execute(store, -1)"><</button
      ><kbd>{{ root }}</kbd
      ><button @click="UpdateChordProgressionRoot.execute(store, 1)">></button>
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
    <ExtendedScalesHelp />
  </Modal>

  <!-- Keyboard Layout Help Modal -->
  <Modal 
    :is-open="showKeyboardLayoutHelp" 
    title="Keyboard Layout Help"
    @close="showKeyboardLayoutHelp = false"
  >
    <KeyboardLayoutHelp />
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
import UpdateChordProgressionRoot from "../actions/UpdateChordProgressionRoot.js";
import Shuffle from "../actions/Shuffle.js";
import Modal from "./Modal.vue";
import ExtendedScalesHelp from "./ExtendedScalesHelp.vue";
import KeyboardLayoutHelp from "./KeyboardLayoutHelp.vue";

const showExtendedScalesHelp = ref(false);
const showKeyboardLayoutHelp = ref(false);

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
  
  // Update fifthsOffsets filter based on extended scales state
  if (store.config.extendedScales) {
    // When enabling extended scales, set default fifthsOffsets to [0] if not already set
    if (!store.activeFilters.fifthsOffsets || store.activeFilters.fifthsOffsets.length === 0) {
      store.activeFilters.fifthsOffsets = [0];
    }
  } else {
    // When disabling extended scales, clear fifthsOffsets to null so search doesn't filter by it
    store.activeFilters.fifthsOffsets = null;
  }
  
  // The filtered computed property will automatically rerun because it depends on activeFilters
  // Reset shuffle only if it's active, so new search results are shown instead of old shuffled results
  if (store.shuffled) {
    Shuffle.reset(store);
  }
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
  border: none;
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  color: var(--pico-muted-color);
  transition: color 0.2s ease;
}

.help-button:hover i {
  color: var(--pico-primary);
}

.help-button:focus {
  border: none;
}

.help-button i {
  font-size: 1em;
  transition: color 0.2s ease;
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
