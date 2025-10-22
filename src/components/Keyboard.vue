<template>
      <div class="keyboard" :class="store.selected?.uid===cr.uid ? 'selected' : null ">
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
    cr: { type: Object, default: null, required: true }
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

  const slots = computed(() => {
    const slots = [];
    const octaveStart = store.config.octaveStart;
    const octaveEnd = store.config.octaveEnd;

    const octaves = octaveEnd - octaveStart;
    if (!(octaves > 0)) {
      console.error('invalid range');
      return;
    }

    for (let o = 0; o < octaves; o++) {
      const octave = octaveStart + o;
      let offset = 0;

      for (let i = 0; i < pattern.value.length; i++) {
        const octaveMidi = 12 * (octaveStart + o + 1);

        const lMidi = octaveMidi + offset;
        const lower = {
          note: `${pattern.value[i].l}${octave}`,
          midi: Number(lMidi),
          color: colorPattern.value[offset]
        };
        offset++;

        let upper = null;
        if (pattern.value[i].u) {
          const uMidi = octaveMidi + offset;
          upper = {
            note: `${pattern.value[i].u}${octave}`,
            midi: Number(uMidi),
            color: colorPattern.value[offset]
          };
          offset++;
        }

        slots.push({ lower, upper });
      }
    }

    const octaveEndMidi = 12 * (octaveEnd + 1);
    const last = `${pattern.value[0].l}${octaveEnd}`;
    slots.push({
      lower: { note: last, midi: octaveEndMidi },
      upper: null
    });

    return slots;
  });

  const chords = computed(()=> ChordRelationships.getChordsNotes(
    props.cr,
    store.config.root,
    store.config.inversion
  ));

  const lastNote = computed (() => (store.config.octaveEnd + 1) * 12);


  const passiveNotes = computed(function () {    
    return new Set(chords.value.rootChord.notes);
  });

  const activeNotes = computed(function () {
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

  function renderAnimatedCR(cr) {
    const chordNotes= computed(() => ChordRelationships.getChordsNotes(cr, store.config.root, store.config.inversion));
    chordNotes.value.rootChord.notes.forEach(note => {
      document.querySelectorAll(`.piano-key[pc='${note}']`).forEach(element => {
        element.classList.add("key-passive");
      })
    })
  }

  function mod12(value) {
    var r = value % 12;
    return r < 0 ? r + 12 : r;
  }

  function buildPitchClassSet(midiSet) {
    var pcs = new Set();
    midiSet.forEach(function(n) { pcs.add(mod12(n)); });
    return pcs;
  }

</script>

<style scoped>


  .placeholder {

    --keyboard-height: 72px;
    --lower-key-width: calc(var(--keyboard-height)/4.5);
    --upper-key-width: calc(var(--lower-key-width) * 0.75);
    --offset: calc(var(--keyboard-height) * 0.4);


  }

  .keyboard {
    --keyboard-height: 72px;
    --lower-key-width: calc(var(--keyboard-height)/4.5);
    --upper-key-width: calc(var(--lower-key-width) * 0.75);
    --offset: calc(var(--keyboard-height) * 0.4);


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
