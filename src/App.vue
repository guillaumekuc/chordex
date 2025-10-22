<template>
  <main class="container" v-cloak>
    
    <ThemeSwitcher />

    <hgroup>
      <h1>Chordex</h1>
      <p>
        A Chord Relationship (CR) shows how one chord relates to another by
        highlighting the interval between them and their qualities that give each
        CR its unique emotional color. This taxonomy catalogs all
        192 possible tertian triad CRs.
      </p>
    </hgroup>
    <ConfigInspector />

    <div class="col-layout grid">
      <div class="left-column">
        <CRSearch />

        <section class="results-count"><small>{{ `${store.filtered.length} results`}}</small></section>

        <section class="shuffle-section"><span role="button" @click="shuffle">
          <i class="fa-solid fa-arrows-spin"></i> Shuffle!
        </span></section>

        <section class="cr-grid">
          <CRCard
            v-for="(cr, i) in store.filtered"
            :key="cr.uid"
            :cr="cr"
            :filteredScales="filteredScales"
          />
        </section>
      </div><!-- end left -->
      <div class="right-column">
        <InspectorPanel />
      </div><!-- end right -->
    </div><!-- end grid -->
  </main>
</template>

<script setup>
import { computed } from "vue";
import Scales from "./theory/Scales.js";
import Search from "./actions/Search.js";
import Shuffle from "./actions/Shuffle.js";
import CRCard from "./components/CRCard.vue";
import ConfigInspector from "./components/ConfigInspector.vue";
import InspectorPanel from "./components/InspectorPanel.vue";
import CRSearch from "./components/CRSearch.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import { useStore } from "./store";

const store = useStore();

const filteredScales = computed(() => {
  const offset = store.activeFilters.fifthsOffsets;
  if (!offset || offset.length === 0) {
    return Scales.all || [];
  }
  return (Scales.all || []).filter(scale => {
    return offset.includes(scale.fifthsOffset);
  });
});


function shuffle() {
  Shuffle.execute(store);
}
</script>


<style>
  #app {
   --pico-border-radius: 10px;    
  }

  .col-layout {
    grid-template-columns: 2fr 1fr;
    position: relative;
    width: 100%;
  }

  .left-column {
    position: relative;
    flex-basis: 66.66%;
    width: 100%;
  }

  .right-column {
    flex-basis: 33.33%;
  }

  /* Global styles for this app */
  [v-cloak] { display: none !important; }

  #app .container {
    max-width: 1200px;
    width: 90%;
    margin: 0 auto;
  }

  /* Grid layout */
  .cr-grid {
    display: grid;
    gap: 1rem;
    position: relative;
    width: 100%;
    max-width: 100%;
   
    grid-auto-rows: 1fr;
    align-items: stretch;
  }
  @media (min-width: 480px) { .cr-grid { grid-template-columns: repeat(1, 1fr); } }
  @media (min-width: 768px) { .cr-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 992px) { .cr-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1200px){ .cr-grid { grid-template-columns: repeat(3, 1fr); } }

  /* Search */
  .cr-advanced-search {
    margin-bottom: unset;
  }

  /* Inline style replacements */
  .results-count {
    display: flex;
    justify-content: center;
    color: var(--pico-muted-color);
  }

  .shuffle-section {
    display: flex;
    justify-content: start;
    color: var(--pico-muted-color);
  }

  kbd {
    font-size: .66rem;
    font-weight: 500;
    letter-spacing: .01em;
    padding: .25rem .4rem;
    border-radius: .5rem;
    height: max-content;
  }
</style>