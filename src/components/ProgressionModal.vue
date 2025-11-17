<template>
  <Modal 
    :is-open="store.generator.showModal" 
    title="Chord Progression Generator"
    @close="store.generator.showModal = false">

    <details name="progression-config" closed>
        <summary>Configuration</summary>
        <div class="progression-config-content">
            <div class="progression-config-item">
                <label for="progression-slots">Slots:</label>
                <div class="slots-control">
                    <button @click="decreaseSlots">-</button>
                    <kbd>{{ store.generator.slots }}</kbd>
                    <button @click="increaseSlots">+</button>
                </div>
            </div>
            <div class="progression-config-item">
                <label for="progression-root">Root note:</label>
                <div class="root-control">
                    <button @click="decreaseRoot">&lt;</button>
                    <kbd>{{ rootNote }}</kbd>
                    <button @click="increaseRoot">&gt;</button>
                </div>
            </div>
        </div>

    </details>

    <details name="progression-selection" v-if="store.selected && store.selected.length > 0" class="progression-selection" closed>
        <summary>
            Selected Chord Relationships
        </summary>
        <div class="progression-selected-cr-list">
            <div v-for="(cr, index) in store.selected" :key="index" class="progression-selected-cr">
                
                <div>{{ cr.label }}</div>
            </div>
        </div>
    </details>

    <div class="progression-generate-button">
        <button @click="generateProgression" class="generate-button">
            <i class="fa-solid fa-music"></i> Generate
        </button>
    </div>

    <div v-if="store.generator.progression && store.generator.progression.length > 0" class="progression-content">
      <div v-for="(item, index) in store.generator.progression" :key="index" class="progression-generated-cr">
        <div class="chord-label" v-html="item.chord.label"></div>
        <div class="chord-relationship-label">{{ item.chordRelationship.label }}</div>
      </div>
    </div>
    <div v-else class="progression-empty">
      <p>The progression is empty.</p>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../store";
import Modal from "./Modal.vue";
import Notes from "../theory/Notes.js";
import Triads from "../theory/Triads.js";
import * as Common from "../theory/common.js";
import GenerateChordProgression from "../actions/GenerateChordProgression.js";

const store = useStore();

const rootNote = computed(() => {
  const normalizedPc = store.generator.root % 12;
  return Notes.fromPitchClass(normalizedPc);
});

function decreaseSlots() {
  if (store.generator.slots > 1) {
    store.generator.slots--;
  }
}

function increaseSlots() {
  store.generator.slots++;
}

function updateProgressionChords() {
  if (!store.generator.progression || store.generator.progression.length === 0) {
    return;
  }
  
  let currentRootPitchClass = store.generator.root % 12;
  
  for (let i = 0; i < store.generator.progression.length; i++) {
    const item = store.generator.progression[i];
    const chord = Triads.fromChordRelationship(currentRootPitchClass, item.chordRelationship);
    item.chord = chord;
    
    // Calculate next root pitch class: current root + interval (pitchClass) of the CR
    currentRootPitchClass = Common.modulo12(currentRootPitchClass + item.chordRelationship.pitchClass);
  }
}

function decreaseRoot() {
  store.generator.root--;
  if (store.generator.root < 0) {
    store.generator.root = 127; // Wrap around to max MIDI note
  }
  updateProgressionChords();
}

function increaseRoot() {
  store.generator.root++;
  if (store.generator.root > 127) {
    store.generator.root = 0; // Wrap around to min MIDI note
  }
  updateProgressionChords();
}

function generateProgression() {
  GenerateChordProgression.execute(store);
}
</script>

<style scoped>

  .progression-selected-cr-list {
    display: flex;
    display: row;
    align-content: center;
    justify-content: center;
    gap: 5px;

  }
  .progression-selected-cr {
    display: flex;
    flex-direction: row;
    gap: 5px;

    padding: 0.5rem;
    border-radius: 16px;
    background-color: var(--pico-primary-background);
    color: var(--pico-color);
  }

  .progression-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    .progression-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .progression-content {
      grid-template-columns: 1fr;
    }
  }

  .progression-generated-cr {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 16px;
    background-color: var(--pico-muted-background);
  }

  .chord-label {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--pico-primary);
  }

  .chord-relationship-label {
    font-size: 0.875rem;
    color: var(--pico-muted-color);
  }

  .progression-empty {
    text-align: center;
    color: var(--pico-muted-color);
    padding: 2rem;
  }

  .progression-config-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .progression-config-item label {
    min-width: 80px;
  }

  .slots-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .slots-control button {
    padding: 0.25rem 0.75rem;
    min-width: 2rem;
    cursor: pointer;
  }

  .slots-control kbd {
    min-width: 3rem;
    text-align: center;
    display: inline-block;
  }

  .root-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .root-control button {
    padding: 0.25rem 0.75rem;
    min-width: 2rem;
    cursor: pointer;
  }

  .root-control kbd {
    min-width: 3rem;
    text-align: center;
    display: inline-block;
  }

  .progression-generate-button {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0;
  }

  .generate-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>

