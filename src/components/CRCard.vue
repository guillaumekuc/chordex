<template>
  <article
    @click="SelectCR.execute(store, cr)"
    class="cr-card"
    :class="store.selected?.uid===cr.uid ? 'selected' : null"
  >

    <div class="keyboard-container">
      <Keyboard class="keyboard"
        :cr="cr"
      />
    </div>

    <hgroup class="cr-hgroup">
      <div class="left">
        <small class="cr-uid">{{ cr.uid }}</small>
        <h3 class="cr-label">{{ cr.label }}</h3>
      </div>
      <div class="right">
        <button @click.stop="PlayCR.execute(store, { cr, root: store.config.root, inv: store.config.inversion })"><i class="fa-solid fa-play"></i></button>
      </div>
    </hgroup>

    <footer class="cr-card-footer">
      <span>Aliases</span>
      <ScrollLine v-if="cr.aliases && cr.aliases.length > 0" height="1.75rem" class="cr-aliases">
        <kbd v-for="(alias, index) in cr.aliases" :key="index" class="alias-chip">
          {{ alias }}
        </kbd>
      </ScrollLine>
      
      <div class="cr-common-tones">
        <kbd>{{ `${cr.commonTones}` }}</kbd> common tones
      </div>


    </footer>
  </article>
</template>

<script setup>
  import { computed } from "vue";
  import { useStore } from "../store";
  import Keyboard from "./Keyboard.vue";
  import ScrollLine from "./ScrollLine.vue";
  import SelectCR from "../actions/SelectCR.js";
  import PlayCR from "../actions/PlayCR.js";

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

  const crFilteredScales = computed(() => {
    const inputScales = Array.isArray(props.cr?.scales) ? props.cr.scales : [];
    const filterList = Array.isArray(props.filteredScales) ? props.filteredScales : [];
    return inputScales.filter(scale => {
      return filterList.some(fs => {
        return fs.label === scale;
      });
    });
  });

</script>

<style scoped>

  .keyboard-container {
    position: relative;
    min-height: calc(var(--keyboard-height) - var(--keyboard-offset));
    top: -20px;
  }

  .keyboard {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--keyboard-offset) * -1);
  }
  
  .keyboard.selected::before {
    content: "";
    position: absolute;
    left: -2px;             
    top: -2px;   
    height: var(--keyboard-offset); 
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

  .cr-aliases {
    margin-bottom: 0.5rem;
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }

  .cr-aliases :deep(.scroll-line-content) {
    gap: 0.35rem;
    padding: 0 0.25rem;
  }

  .alias-chip {
    white-space: nowrap;
    flex-shrink: 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
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
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
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
    min-width: 0;
    width: 100%;
    max-width: 100%;
    padding-left:0px;
    padding-right:0px;
    margin-left:0px;
    margin-right: 0px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
</style>
