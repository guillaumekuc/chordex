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
                <div class="slots-control progression-control">
                    <button @click="decreaseSlots">-</button>
                    <kbd>{{ store.generator.slots }}</kbd>
                    <button @click="increaseSlots">+</button>
                </div>
            </div>
            <div class="progression-config-item">
                <label for="progression-root">Root note:</label>
                <div class="progression-control">
                    <button @click="decreaseRoot">-</button>
                    <kbd>{{ rootNote }}</kbd>
                    <button @click="increaseRoot">+</button>
                </div>
            </div>
        </div>

    </details>

    <details name="progression-selection" v-if="store.selected && store.selected.length > 0" class="progression-selection" open>
        <summary>
            Selected Chord Relationships
        </summary>
        <div class="progression-selected-cr-list">
            <template v-for="(cr, index) in store.selected" :key="index">
                <Tooltip 
                    v-if="isUnaccessible(cr) || leadsToNowhere(cr)"
                    :text="getTooltipMessage(cr)"
                    position="top"
                >
                    <div 
                        class="progression-selected-cr"
                        :class="{
                            'unaccessible': isUnaccessible(cr),
                            'leads-to-nowhere': leadsToNowhere(cr)
                        }"
                    >
                        <div>{{ cr.label }}</div>
                    </div>
                </Tooltip>
                <div 
                    v-else
                    class="progression-selected-cr"
                >
                    <div>{{ cr.label }}</div>
                </div>
            </template>
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
        <i class="fa-solid fa-arrows-spin shuffle-icon" @click.stop="rerollChord(index)"></i>
      </div>
    </div>
    <div v-else class="progression-empty">
      <p>The progression is empty.</p>
    </div>

    <div v-if="store.generator.progression && store.generator.progression.length > 0" class="progression-listen-button">
      <button @click="playProgression" class="listen-button">
        <i class="fa-solid fa-play"></i> Listen
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../store";
import Modal from "./Modal.vue";
import Tooltip from "./Tooltip.vue";
import Notes from "../theory/Notes.js";
import Triads from "../theory/Triads.js";
import * as Common from "../theory/common.js";
import GenerateChordProgression from "../actions/GenerateChordProgression.js";
import RerollChord from "../actions/RerollChord.js";
import PlayChordProgression from "../actions/PlayChordProgression.js";

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

function rerollChord(index) {
  RerollChord.execute(store, index);
}

function playProgression() {
  PlayChordProgression.execute(store);
}

function isUnaccessible(cr) {
  return store.generator.unaccessible.some(u => u.uid === cr.uid);
}

function leadsToNowhere(cr) {
  return store.generator.leadsToNowhere.some(l => l.uid === cr.uid);
}

function getTooltipMessage(cr) {
  if (isUnaccessible(cr)) {
    return "This chord relationship is unaccessible: its root quality cannot be reached from any other chord relationship in the selection.";
  }
  if (leadsToNowhere(cr)) {
    return "This chord relationship can't connect to any other chord relationship in the selection: it targets a quality that is not present as a root in the set";
  }
  return "";
}
</script>

<style scoped>

  .progression-selected-cr-list {
    display: flex;
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
    color: var(--pico-primary-inverse);
  }

  .progression-selected-cr.unaccessible,
  .progression-selected-cr.leads-to-nowhere {
    opacity: 0.4;
    filter: grayscale(100%);
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
    position: relative;
    cursor: pointer;
  }

  .chord-label {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--pico-primary);
  }

  .shuffle-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: var(--pico-primary-inverse);
    background-color: transparent;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    z-index: 10;
    opacity: 0;
    pointer-events: auto;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .progression-generated-cr:hover .shuffle-icon {
    opacity: 1;
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

  .progression-control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .progression-control button {
    width: 1.33rem;
    height: 1.33rem;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .progression-control kbd {
    height: 1.33rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    user-select: none;
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

  .progression-listen-button {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .listen-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>

