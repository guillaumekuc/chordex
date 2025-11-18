<template>
  <div
    :class="[
      'piano-key',
      {
        'key-lower': !props.isUpper,
        'key-upper': props.isUpper,
        'key-white': !props.isBlack,
        'key-black': props.isBlack,
        'key-active': props.isActive,
        'key-passive': props.isPassive,
        'anim-passive': props.animated && store.animationPhase === 0,
        'anim-overlap': props.animated && store.animationPhase === 1,
        'anim-active': props.animated && store.animationPhase === 2
      }
    ]"
    :pc="props.midi"
  >
    <span
      :class="{ hidden: !store.instruments[props.parent].display.keyboardLabels }"
      class="keyboard-mapping-label"
    >
      {{ props.keyboard }}
    </span>
    <span
      :class="{ hidden: !store.instruments[props.parent].display.noteLabels }"
      class="note-label"
    >
      {{ props.note }}
    </span>
  </div>
</template>

<script setup>
  import { useStore } from '../store'
  const store = useStore()

  // Props
  const props = defineProps({
    note: { type: String, required: true },
    midi: { type: Number, required: true },
    keyboard: { type: String },
    isUpper: { type: Boolean, default: false, required: true },
    isBlack: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: false },
    isPassive: { type: Boolean, default: false },
    parent: { type: String, required: true },
    animated: { type: Boolean, default: false }
  })

</script>

<style scoped>
  .piano-key {
    --color-light: #fff;
    --color-dark: #333;
    --color-darker: #222;
    --color-overlap: var(--pico-color-pumpkin-500);
    --color-active: var(--pico-color-pumpkin-300);
    --color-hover: orange;
    --color-passive: grey;
  }

  .hidden {
    display: none !important;
  }

  .piano-key {
    display: inline-block;
    width: var(--keyboard-lower-width);
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

  .piano-key.key-passive.key-active {
    background: var(--color-overlap) !important;
  }

  /* Animation Passive: If passive, show passive color (even if also active); reset active-only to default */
  .piano-key.anim-passive.key-passive {
    background: var(--color-passive) !important;
  }

  .piano-key.anim-passive.key-active:not(.key-passive) {
    background: var(--color-light) !important;
  }

  .piano-key.anim-passive.key-black.key-active:not(.key-passive) {
    background: var(--color-darker) !important;
  }

  /* Animation Overlap: If both passive and active, show combined; if only active, show active */
  .piano-key.anim-overlap.key-passive.key-active {
    background: var(--color-overlap) !important;
  }

  .piano-key.anim-overlap.key-active:not(.key-passive) {
    background: var(--color-active) !important;
  }

  /* Animation Active: Override passive color; if active, show active color */
  .piano-key.anim-active.key-passive {
    background: var(--color-light) !important;
  }

  .piano-key.anim-active.key-active {
    background: var(--color-active) !important;
  }


  .key-upper {
    width: var(--keyboard-upper-width);
    height: 60%;
    position: absolute;
    left: calc(var(--keyboard-lower-width) + 2px - var(--keyboard-upper-width) / 2) ;
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
