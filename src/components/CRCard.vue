<template>
  <article
    @click="selectCR(cr)"
    class="cr-card"
    :class="cr.selected ? 'selected' : null"
  >

    <div class="keyboardContainer">
      <Keyboard class="Keyboard"
        :cr="cr"
      />
    </div>

    <hgroup class="cr-hgroup">
      <div class="left">
        <small class="cr-uid">{{ cr.uid }}</small>
        <h3 class="cr-label">{{ cr.label }}</h3>
      </div>
      <div class="right">
        <button @click.stop="playCR(cr, store.config.root, store.config.inversion)"><i class="fa-solid fa-play"></i></button>
      </div>
    </hgroup>

    <footer class="cr-card-footer">
      <div class="cr-common-tones">
        <kbd>{{ `${cr.commonTones}` }}</kbd> common tones
      </div>


    </footer>
  </article>
</template>

<script setup>
  import { computed } from "vue";
  import Triads from "../theory/Triads.js";
  import ChordRelationships from "../theory/ChordRelationships";
  import { useStore } from "../store";
  import Keyboard from "./Keyboard.vue";

  defineOptions({ name: "CRCard" });

  const props = defineProps({
    cr: {
      type: Object,
      required: true
    },
    // Expecting an array of objects like [{ label: "Ionian" }, ...]
    filteredScales: {
      type: Array,
      required: true
    }
  });

  const store = useStore();

  const crFilteredScales = computed(function () {
    const inputScales = Array.isArray(props.cr?.scales) ? props.cr.scales : [];
    const filterList = Array.isArray(props.filteredScales) ? props.filteredScales : [];
    return inputScales.filter(function (scale) {
      return filterList.some(function (fs) {
        return fs.label === scale;
      });
    });
  });

  function selectCR(entry) {
    if (store.selected?.uid === entry.uid) {
      entry.selected = false;
      store.selected = null;
    } else {
      if (store.selected) {
        store.selected.selected = false;
      }
      entry.selected = true;
      store.selected = entry;
    }
    console.log("selectCR", entry.uid);
  }

  function playCR(cr, root, inv) {
    if (typeof root !== "number") {
      root = 60;
    }
    if (typeof inv !== "number") {
      inv = 0;
    }

    const chords= ChordRelationships.getChordsNotes(cr, root, inv);

    playSequence(chords.rootChord.notes, chords.targetChord.notes, 1000);

    async function playSequence(rootChordNotes, targetChordNotes, timeMs) {
      await wait(0);
      store.audio.playNotes(rootChordNotes);
      await wait(timeMs);
      store.audio.playNotes(targetChordNotes);
    }

    function wait(timeMs) {
      return new Promise(function (resolve) {
        setTimeout(resolve, timeMs);
      });
    }

  }
</script>

<style scoped>

  .keyboardContainer {
    --keyboard-height: 72px;
    --lower-key-width: calc(var(--keyboard-height)/4.5);
    --upper-key-width: calc(var(--lower-key-width) * 0.75);
    --offset: calc(var(--keyboard-height) * 0.4);


    position: relative;
    min-height: calc(var(--keyboard-height) - var(--offset));

    top: -20px;
  }

  .Keyboard {

    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--offset) * -1);
  }
  
  .keyboard.selected::before {
    content: "";
    position: absolute;
    left: -2px;             
    top: -2px;   
    height: calc(var(--offset)); 
    width: calc(100% + 4px);   
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-top: 2px var(--pico-primary) solid;
    border-right: 2px var(--pico-primary) solid;
    border-left: 2px var(--pico-primary) solid;

    pointer-events: none;
    z-index: -2;
  }

  footer {
    font-size: 0.75rem;
  }

  button {
    --pico-color: inherit;
    background: none;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    border: 0px;
    border-radius: 50%;
    color: var(--pico-color);
  }

  button:hover {
    color: white;
  }


  .cr-hgroup {
    display: flex;
    direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: unset;
  }

  .cr-hgroup.left > :not(:first-child):last-child {
    --pico-color: inherit;
    --pico-font-weight: inherit;
  }

  .cr-uid {
    font-size: 0.66rem;
    color: var(--pico-muted-color);
  }

  .cr-uid::before {
    content: "#";
  }

  .cr-common-tones {
    margin-bottom: 0.5rem;
  }

  .cr-card {
    display: flex;
    flex-direction: column;
    margin: 0;
    position: relative;
    margin-top: 35px;
  }

  .cr-card.selected {
    outline: 2px solid var(--pico-primary);
  }


  .cr-label {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    line-height: 1.25;
    text-overflow: ellipsis;
    color: var(--pico-color) !important;
  }

  .cr-card-footer {
    height: 100%;
    border-top: 1px solid var(--muted-border-color, color-mix(in oklab, currentColor 12%, transparent));
    display: flex;
    flex-direction: column;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
</style>
