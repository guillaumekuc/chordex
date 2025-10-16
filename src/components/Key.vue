<template>
  <div
    :class="[
      'piano-key',
      {
        'key-lower': !key.isUpper,
        'key-upper': key.isUpper,
        'key-white': !key.isBlack,
        'key-black': key.isBlack,
        'key-active': key.isActive,
        'key-passive': key.isPassive
      }
    ]"
  >
    <span
      :class="{ hidden: !store.instruments[key.parent].display.keyboardLabels }"
      class="keyboard-mapping-label"
    >
      {{ key.keyboard }}
    </span>
    <span
      :class="{ hidden: !store.instruments[key.parent].display.noteLabels }"
      class="note-label"
    >
      {{ key.note }}
    </span>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useStore } from '../store'
  const store = useStore()

  // Props
  const key = defineProps({
    note: { type: String, required: true },
    midi: { type: Number, required: true },
    keyboard: { type: String },
    isUpper: { type: Boolean, default: false, required: true },
    isBlack: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: false },
    isPassive: { type: Boolean, default: false },
    parent: { type: String, required: true }
  })


</script>

<style scoped>
  .piano-key {
    --color-light: #fff;
    --color-dark: #333;
    --color-darker: #222;
    --color-active: orange;
    --color-hover: orange;
    --color-passive: grey;
  }

  .hidden {
    display: none !important;
  }

  .piano-key {
    display: inline-block;
    width: var(--lower-key-width);
    height: 100%;
    margin: 0 2px;
    background: var(--color-light);
    border-radius: 0 0 5px 5px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    cursor: pointer;

    /* Important for touch/gesture correctness */
    touch-action: none;   /* prevent scroll/zoom gestures from stealing pointer */
    user-select: none;    /* avoid accidental text selection on desktop */
  }

  .piano-key.key-passive {
    background: var(--color-passive) !important;
  }

  .piano-key.key-active {
    background: var(--color-active) !important;
  }

  .key-upper {
    width: var(--upper-key-width);
    height: 60%;
    position: absolute;
    left: calc(var(--lower-key-width) + 2px - var(--upper-key-width) / 2) ;
    z-index: 2;
  }

  .key-black {
    background: var(--color-darker);
  }

  .note-label {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
  }

  .key-white .note-label {
    color: var(--color-dark);
  }

  .key-black .note-label  {
    color: var(--color-light);
  }

  .key-upper {
    border: 3px solid var(--color-dark);
    border-radius: 0 0 7px 7px;
    border-top: 0;
  }

  .keyboard-mapping-label {
    position: absolute;
    bottom: calc(6px + 1rem);
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    opacity: 0.5;
  }

  .key-white .keyboard-mapping-label {
    color: var(--color-dark);
  }

  .key-black .keyboard-mapping-label  {
    color: var(--color-light);
  }
</style>
