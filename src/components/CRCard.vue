<template>
  <article
    @click="SelectCR.execute(store, cr)"
    class="cr-card"
    :class="store.selected?.uid===cr.uid ? 'selected' : null"
  >
    <div v-if="cr.aliases && cr.aliases.length > 0" class="cr-card-star">
      <i class="fa-solid fa-star"></i>
    </div>

    <div class="keyboard-container">
      <Keyboard class="keyboard"
        :cr="cr"
      />
    </div>

    <hgroup class="cr-hgroup">
     
        <small class="cr-uid">{{ cr.uid }}</small>
        <h3 class="cr-label">
          {{ cr.label }}
          <!--
          <button class="play-button" @click.stop="PlayCR.execute(store, { cr, root: store.config.root, inv: store.config.inversion })"><i class="fa-solid fa-play"></i></button>
          -->
        </h3>
        <div class="cr-header-aliases">
      <ScrollLine height="1.75rem" class="cr-aliases">
        <template v-if="cr.aliases && cr.aliases.length > 0">
          <button 
            v-for="(alias, index) in cr.aliases" 
            :key="index" 
            class="alias-button"
            @click.stop
          >
            {{ alias }}
          </button>
        </template>

      </ScrollLine>
    </div>

    </hgroup>

 

    <footer class="cr-card-footer">
      <ScrollLine v-if="!cr.aliases || cr.aliases.length === 0" height="1.75rem" class="cr-aliases-footer">
        <span class="empty-text">No aliases</span>
        <button class="add-button" @click.stop>
          <i class="fa-solid fa-plus"></i>
        </button>
      </ScrollLine>

      <ScrollLine height="1.75rem" class="cr-tags">
        <template v-if="cr.tags && cr.tags.length > 0">
          <kbd v-for="(tag, index) in cr.tags" :key="index" class="tag-chip">
            #{{ tag }}
          </kbd>
        </template>
        <template v-else>
          <span class="empty-text">No tags</span>
        </template>
        <button v-if="!cr.tags || cr.tags.length === 0" class="add-button" @click.stop>
          <i class="fa-solid fa-plus"></i>
        </button>
      </ScrollLine>

      <ScrollLine height="1.75rem" class="cr-notes">
        <template v-if="cr.notes && typeof cr.notes === 'string' && cr.notes.trim().length > 0">
          <button class="notes-button" @click.stop="handleNotesClick">
            <i class="fa-solid fa-sticky-note"></i> Notes
          </button>
        </template>
        <template v-else>
          <span class="empty-text">No notes</span>
        </template>
        <button v-if="!cr.notes || typeof cr.notes !== 'string' || cr.notes.trim().length === 0" class="add-button" @click.stop>
          <i class="fa-solid fa-plus"></i>
        </button>
      </ScrollLine>
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

  function handleNotesClick() {
    if (store.selected?.uid !== props.cr.uid) {
      SelectCR.execute(store, props.cr);
    }
  }

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
    padding: 0.25rem 0.5rem;
    border: none;
  }

  

  button:hover {
    color: white;
    box-shadow: unset !important; 
  }

  button:focus {
    outline: none;
    box-shadow: none;
  }


  .cr-hgroup {
    display: flex;
   flex-direction: column;
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

  .cr-header-aliases {
    margin-bottom: 0px;
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }

  .cr-aliases-footer,
  .cr-tags,
  .cr-notes {
    margin-bottom: 0.5rem;
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }

  .cr-aliases :deep(.scroll-line-content),
  .cr-aliases-footer :deep(.scroll-line-content),
  .cr-tags :deep(.scroll-line-content) {
    gap: 0.35rem;
    padding: 0 0.25rem;
    align-items: center;
  }

  .cr-aliases-footer :deep(.scroll-line-content),
  .cr-notes :deep(.scroll-line-content) {
    gap: 0.35rem;
    padding: 0 0.25rem;
    align-items: center;
    justify-content: center;
  }

  .alias-button {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    pointer-events: none;
    text-transform: uppercase;
  }

  .tag-chip {
    white-space: nowrap;
    flex-shrink: 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .play-button {
    display: inline-flex;
    background: none;
    border: none;
    color: var(--pico-color);
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    border-radius:50%
  }

  .notes-button {

    font-size: 0.67rem;
    white-space: nowrap;
    flex-shrink: 0;
    user-select: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    height: fit-content;
    width: auto;
    color: var(--pico-code-kbd-color);
    background-color: var(--pico-code-kbd-background-color);
  }

  .notes-button:hover {
    
    color: var(--pico-primary-background);
  }

  .empty-text {
    color: var(--pico-muted-color, rgba(128, 128, 128, 0.5));
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .add-button {
    background: none;
    border: none;
    color: var(--pico-muted-color, rgba(128, 128, 128, 0.6));
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    flex-shrink: 0;
    height: 100%;
  }

  .add-button:hover {
    color: var(--pico-color);
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
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
  }

  .cr-card.selected {
    outline: 2px solid var(--pico-primary);
  }

  .cr-card-star {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: var(--pico-primary);
    font-size: 0.875rem;
    pointer-events: none;
    z-index: 10;
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
    gap: 4px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
</style>
