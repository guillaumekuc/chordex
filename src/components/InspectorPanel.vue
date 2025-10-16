<template>
  <article v-if="store.selected" id="InspectorPanel">
    <header class="title">
      <small class="cr-uid">{{ store.selected?.uid }}</small>
      <h3 class="cr-label">{{ store.selected?.label }}</h3>
    </header>
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
    
  </article>
</template>

<script setup>
import { useStore } from "../store";
import { nextTick } from "vue";

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

  #InspectorPanel{
    padding-top:0px;
  }

 .title{
  position: sticky;
  top:0px;
  z-index: 1;
  margin-top:0px;
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
