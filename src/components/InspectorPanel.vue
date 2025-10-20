<template>
  <article v-if="store.selected" id="InspectorPanel">

    <header class="title">
      <div class="keyboard-container">
        <Keyboard class="Keyboard"
          :cr="store.selected"
        />
      </div>
      <small class="cr-uid">{{ store.selected?.uid }}</small>
      <h3 class="cr-label">{{ store.selected?.label }}</h3>
    </header>


    <div class="scrollable">
      <details name="aliases" open>
        <summary>Aliases</summary>
   
        <ul>
          <kbd class="chip" v-for="(alias, index) in store.selected.aliases" :key="index">
            {{ alias }}
            <span @click="removeAlias(index)">✕</span>
          </kbd>
        </ul>


        <input
          type="text"
          placeholder="+ Add an alias and press Enter"
          @keydown.enter.prevent="addAlias"
        />

      </details>

      <details name="tags" open>
        <summary>Tags</summary>
        
        <ul>
  	      <kbd v-for="(tag, index) in store.selected.tags" :key="index">
  	        {{ tag }}
  	        <span @click="removeTag(index)">✕</span>
  	      </kbd>
  	  </ul>

        <input
          type="text"
          placeholder="+ Add a tag and press Enter"
          @keydown.enter.prevent="addTag"
        />
        
      </details>

      <details name="scales" open>
        <summary>Scales</summary>
      
        <ul>
          <kbd class="chip" v-for="(scale, index) in store.selected.scales" :key="index">
            {{ scale }}
          </kbd>
        </ul>
      </details>

      <details name="userNotes" open>
        <summary>Notes</summary>
        <textarea
          name="userNotes"
          placeholder="Write some notes about this Chord Relationship"
          aria-label="User notes"
          v-model="store.selected.notes"
        ></textarea>
      </details>
    </div>
    
  </article>
</template>

<script setup>
import { useStore } from "../store";
import { nextTick } from "vue";
import Keyboard from "./Keyboard.vue";

const store = useStore();

function ensureArrays() {
  if (!store.selected.aliases) {
    store.selected.aliases = [];
  }
  if (!store.selected.tags) {
    store.selected.tags = [];
  }
}

function addAlias(event) {
  ensureArrays();
  const value = event.target.value.trim();
  if (value && !store.selected.aliases.includes(value)) {
    store.selected.aliases.push(value);
  }
  event.target.value = "";
}

function removeAlias(index) {
  ensureArrays();
  store.selected.aliases.splice(index, 1);
}

function addTag(event) {
  ensureArrays();
  const value = event.target.value.trim();
  if (value && !store.selected.tags.includes(value)) {
    store.selected.tags.push(value);
  }
  event.target.value = "";
}

function removeTag(index) {
  ensureArrays();
  store.selected.tags.splice(index, 1);
}
</script>

<style>
  #InspectorPanel {

    --keyboard-height: 72px;
    --lower-key-width: calc(var(--keyboard-height)/4.5);
    --upper-key-width: calc(var(--lower-key-width) * 0.75);
    --offset: calc(var(--keyboard-height) * 0.4);
    
    position: sticky;
    top: calc(var(--pico-block-spacing-vertical) + var(--offset));
    /* Use device-stable viewport units so mobile address bar changes do not jump */
    max-height: calc(100dvh - 2 * var(--pico-block-spacing-vertical) - var(--offset));
    background: transparent;
    /* Make this the scroll container and lay it out as header + content */
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: visible;           /* vertical scroll here */
    scrollbar-width: none;    /* optional; was none before */
    padding-top:0px;

  }

  .keyboard-container{


    margin-top: calc(var(--pico-block-spacing-vertical) * 0.66 * -1);

    position: relative;

    background: transparent;
    min-height: calc(var(--keyboard-height) - var(--offset));
    width:100%;
  }

  .Keyboard {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--offset) * -1);
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
</style>
