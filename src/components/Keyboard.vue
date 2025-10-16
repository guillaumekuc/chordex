<template>
  <div class="placeholder">
    <div class="keyboard-container" :class="store.selected?.uid===cr.uid ? 'selected' : null ">
      <div class="keyboard" >
        <div v-for="(slot, idx) in slots" class="slot">
          <Key
            :note="slot.lower.note"
            :keyboard="slot.lower.keyboard"
            :midi="slot.lower.midi"
            :is-upper="false"
            :is-black="slot.lower.color === 'b'"
            :parent="props.id"
          />
          <Key
            v-if="slot.upper"
            :note="slot.upper.note"
            :keyboard="slot.upper.keyboard"
            :midi="slot.upper.midi"
            :is-upper="true"
            :is-black="slot.upper.color === 'b'"
            :parent="props.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../store';
import Key from './Key.vue';
import keymap from '../config/keymap.js';
import keyboardRowPatterns from '../config/keyboardRowPatterns.js';
import keyboardColorPatterns from '../config/keyboardColorPatterns.js';

const store = useStore();

const props = defineProps({
  layout: { type: String, default: 'x66' },
  colors: { type: String, default: 'x66' },
  id: { type: String, default: 'something' },
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

const layout = computed(() => store.instruments[props.id].layout);
const colors = computed(() => store.instruments[props.id].colors);

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
</script>

<style scoped>


.placeholder {

  --keyboard-height: 72px;
  --lower-key-width: calc(var(--keyboard-height)/4.5);
  --upper-key-width: calc(var(--lower-key-width) * 0.65);
  --offset: calc(var(--keyboard-height) * 0.4);

  position: relative;
  top:-20px;
  min-height: calc(var(--keyboard-height) - var(--offset));

}

.keyboard-container {
   position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(var(--offset) * -1);
  max-width: 100%;
  min-width: 0;
  display: inline-block;
}

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

.keyboard-container.selected::before {
  content: "";
  position: absolute;
  left: -2px;             
  top: -2px;   
  height: calc(var(--offset)); 
  width: calc(100% + 4px);   
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-top: 2px var(--pico-primary) solid;
  border-right: 2px var(--pico-primary) solid;
  border-left: 2px var(--pico-primary) solid;

  pointer-events: none;
  z-index: -2;
}


.slot {
  position: relative;
  display: inline-block;
  width: auto;
}
</style>
