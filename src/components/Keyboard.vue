<template>
      <div class="keyboard" :class="isSelected ? 'selected' : null ">
        <div v-for="(slot, idx) in slots" :key="idx" class="slot">
          <Key
            :note="slot.lower.note"
            :keyboard="slot.lower.keyboard"
            :midi="slot.lower.midi"
            :is-upper="false"
            :is-black="slot.lower.color === 'b'"
            :parent="props.id"
            :is-passive="passivePitchClasses.has(slot.lower.midi % 12) && slot.lower.midi !== lastNote"
            :is-active="activePitchClasses.has(slot.lower.midi % 12) && slot.lower.midi !== lastNote"
            :animated="props.animated"
          />
          <Key
            v-if="slot.upper"
            :note="slot.upper.note"
            :keyboard="slot.upper.keyboard"
            :midi="slot.upper.midi"
            :is-upper="true"
            :is-black="slot.upper.color === 'b'"
            :parent="props.id"
            :is-passive="passivePitchClasses.has(slot.upper.midi % 12) && slot.upper.midi !== lastNote"
            :is-active="activePitchClasses.has(slot.upper.midi % 12) && slot.upper.midi !== lastNote"
            :animated="props.animated"
          />
        </div>
      </div>
</template>

<script setup>

  import { computed } from 'vue';
  import { useStore } from '../store';
  import Key from './Key.vue';
  import keyboardRowPatterns from '../config/keyboardRowPatterns.js';
  import keyboardColorPatterns from '../config/keyboardColorPatterns.js';
  import ChordRelationships from "../theory/ChordRelationships.js";

  const store = useStore();

  const props = defineProps({
    layout: { type: String, default: 'x66' },
    colors: { type: String, default: 'x66' },
    id: { type: String, default: 'defaultKeyboard' },
    displayNoteLabels: { type: Boolean, default: false },
    cr: { type: Object, default: null, required: true },
    animated: { type: Boolean, default: false }
  });

  const isSelected = computed(() => {
    return Array.isArray(store.selected) && store.selected.some(cr => cr.uid === props.cr.uid);
  });

  store.instruments[props.id] = {
    layout: props.layout,
    colors: props.colors,
    display: {
      noteLabels: props.displayNoteLabels,
      keyboardLabels: props.displayKeyboardLabels
    }
  };

  const layout = computed(() => store.config.keyboardLayout);
  const colors = computed(() => store.config.keyboardColors);
  const pattern = computed(() => keyboardRowPatterns[layout.value]);
  const colorPattern = computed(() => keyboardColorPatterns[colors.value]);

  function createKeySlot(patternItem, octave, octaveMidi, currentOffset) {
    const lowerMidi = octaveMidi + currentOffset;
    const lowerKey = {
      note: `${patternItem.l}${octave}`,
      midi: Number(lowerMidi),
      color: colorPattern.value[currentOffset]
    };
    currentOffset++;

    let upperKey = null;
    if (patternItem.u) {
      const upperMidi = octaveMidi + currentOffset;
      upperKey = {
        note: `${patternItem.u}${octave}`,
        midi: Number(upperMidi),
        color: colorPattern.value[currentOffset]
      };
      currentOffset++;
    }

    return { slot: { lower: lowerKey, upper: upperKey }, newOffset: currentOffset };
  }

  function processOctave(octaveStart, octaveIndex) {
    const octaveMidi = 12 * (octaveStart + octaveIndex + 1);
    let currentOffset = 0;
    const octaveKeySlots = [];

    for (let patternIndex = 0; patternIndex < pattern.value.length; patternIndex++) {
      const { slot, newOffset } = createKeySlot(pattern.value[patternIndex], octaveStart + octaveIndex, octaveMidi, currentOffset);
      octaveKeySlots.push(slot);
      currentOffset = newOffset;
    }

    return octaveKeySlots;
  }

  function addEndSlot(octaveEnd) {
    const octaveEndMidi = 12 * (octaveEnd + 1);
    const lastNote = `${pattern.value[0].l}${octaveEnd}`;
    return {
      lower: { note: lastNote, midi: octaveEndMidi },
      upper: null
    };
  }

  const slots = computed(() => {
    const octaveStart = store.config.octaveStart;
    const octaveEnd = store.config.octaveEnd;
    const octaves = octaveEnd - octaveStart;

    if (!(octaves > 0)) {
      console.error('invalid range');
      return [];
    }

    const slots = [];
    for (let o = 0; o < octaves; o++) {
      slots.push(...processOctave(octaveStart, o));
    }

    slots.push(addEndSlot(octaveEnd));
    return slots;
  });


  const chords = computed(()=> ChordRelationships.getChordsNotes(
    props.cr,
    store.config.root,
    store.config.inversion
  ));

  const lastNote = computed (() => (store.config.octaveEnd + 1) * 12);


  const passiveNotes = computed(() => {    
    return new Set(chords.value.rootChord.notes);
  });

  const activeNotes = computed(() => {
    return new Set(chords.value.targetChord.notes);
  });

  const activePitchClasses = computed(() => {
    return buildPitchClassSet(activeNotes.value);
  })

  const passivePitchClasses = computed(() => {
    return buildPitchClassSet(passiveNotes.value);
  })

  function isLastNote(note){
    return (note === (store.config.octaveEnd + 1) * 12)
  }


  function mod12(value) {
    var remainder = value % 12;
    return remainder < 0 ? remainder + 12 : remainder;
  }

  function buildPitchClassSet(midiSet) {
    var pcs = new Set();
    midiSet.forEach(note => { pcs.add(mod12(note)); });
    return pcs;
  }

</script>

<style scoped>
  .keyboard {
    --color-dark: #333333;
    display: flex;
    user-select: none;
    padding: 4px;
    background: var(--color-dark);
    border-radius: 8px;
    width: fit-content;
    max-width: 100%;
    height: var(--keyboard-height);
  }

  .slot {
    position: relative;
    display: inline-block;
    width: auto;
  }
</style>
