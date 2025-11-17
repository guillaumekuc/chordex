<template>
  <article v-if="currentSelected" class="inspector-panel">

    <header class="title">
      <div class="keyboard-container">
        <Keyboard class="keyboard"
          :cr="currentSelected"
        />
      </div>
      <small class="cr-uid">{{ currentSelected?.uid }}</small>
      <h3 class="cr-label">{{ currentSelected?.label }}</h3>
    </header>


    <div class="scrollable">
      <details name="aliases" open>
        <summary>Aliases</summary>
   
        <ul>
          <kbd class="chip" v-for="(alias, index) in currentSelected.aliases" :key="index">
            {{ alias }}
            <span @click="RemoveAlias.execute(store, alias)">✕</span>
          </kbd>
        </ul>

        <input
          type="text"
          placeholder="+ Add an alias and press Enter"
          @keydown.enter.prevent="(event) => { AddAlias.execute(store, event.target.value); event.target.value = ''; }"
        />

      </details>

      <details name="userNotes" open>
        <summary>Notes</summary>
        <textarea
          name="userNotes"
          placeholder="Write some notes about this Chord Relationship"
          aria-label="User notes"
          :value="currentSelected.notes"
          @input="UpdateNotes.execute(store, $event.target.value)"
        ></textarea>
      </details>

      <details name="tags" open>
        <summary>Tags</summary>
        
        <ul>
  	      <kbd v-for="(tag, index) in currentSelected.tags" :key="index">
  	        #{{ tag }}
  	        <span @click="RemoveTag.execute(store, tag)">✕</span>
  	      </kbd>
  	  </ul>

        <input
          type="text"
          placeholder="+ Add a tag and press Enter"
          @keydown.enter.prevent="(event) => { AddTag.execute(store, event.target.value); event.target.value = ''; }"
        />
        
      </details>

      <details name="scales" open>
        <summary>Scales</summary>
      
        <ul>
          <kbd class="chip" v-for="(scale, index) in filteredScales" :key="index">
            {{ scale }}
          </kbd>
        </ul>
      </details>

      <details name="stats" open>
        <summary>Stats</summary>
        <div class="stats-content">
          <div class="stat-item">
            <kbd>{{ currentSelected?.commonTones || 0 }}</kbd> common tones
          </div>
        </div>
      </details>
    </div>
    
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../store";
import Keyboard from "./Keyboard.vue";
import AddAlias from "../actions/AddAlias.js";
import RemoveAlias from "../actions/RemoveAlias.js";
import AddTag from "../actions/AddTag.js";
import RemoveTag from "../actions/RemoveTag.js";
import UpdateNotes from "../actions/UpdateNotes.js";

const store = useStore();

const currentSelected = computed(() => {
  if (Array.isArray(store.selected) && store.selected.length > 0) {
    return store.selected[store.selected.length - 1];
  }
  return null;
});

const filteredScales = computed(() => {
  if (!currentSelected.value) return [];
  if (!store.config.extendedScales) {
    return currentSelected.value.scales.filter(scale => !scale.includes('['));
  }
  return currentSelected.value.scales;
});

</script>

<style scoped>
  .inspector-panel {
    position: sticky;
    top: calc(var(--pico-block-spacing-vertical) + var(--keyboard-offset));
    /* Use device-stable viewport units so mobile address bar changes do not jump */
    /* Subtract footer height to prevent inspector from going below footer */
    max-height: calc(100dvh - 2 * var(--pico-block-spacing-vertical) - var(--keyboard-offset) - var(--footer-height, 65px));
    background: transparent;
    /* Make this the scroll container and lay it out as header + content */
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: visible;           /* vertical scroll here */
    scrollbar-width: none;    /* optional; was none before */
    padding-top: 0;
  }

  .keyboard-container {
    margin-top: calc(var(--pico-block-spacing-vertical) * 0.66 * -1);
    position: relative;
    background: transparent;
    min-height: calc(var(--keyboard-height) - var(--keyboard-offset));
    width: 100%;
  }

  .keyboard {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--keyboard-offset) * -1);
    z-index: 2;
  }



/* Header: stays visible at the top of the panel while the panel scrolls */
.title {
  position: relative;
  top: 0px;
  z-index: 1;
  margin-top: 0;
}

/* Content: must be allowed to shrink so it can actually scroll */
.scrollable {
  margin-right: calc(var(--pico-block-spacing-horizontal) * -1);
  margin-left: calc(var(--pico-block-spacing-horizontal) * -1);
  margin-top: calc(var(--pico-block-spacing-vertical) * -1);
  margin-bottom: calc(var(--pico-block-spacing-vertical) * -1);
  border-radius: 0px 0px var(--pico-border-radius) var(--pico-border-radius);
  background-color: var(--pico-card-background-color);
  overflow: auto;    /* vertical + horizontal if ever needed */
  min-height: 0;     /* critical when inside grid/flex to enable scrolling */
  scrollbar-width: none;
  padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);

}


.cr-uid {
  font-size: 0.66rem;
  color: var(--pico-muted-color);
}

.cr-uid::before {
  content: "#";
}

ul {
  padding-left: 1em;
  list-style-type: disc;
}

button {
  margin-left: 0.5em;
  font-size: 0.75rem;
  cursor: pointer;
}


ul kbd {
	margin-right: 1em;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}
</style>
