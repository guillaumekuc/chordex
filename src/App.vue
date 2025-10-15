<template>
  <main class="container" v-cloak>
    
    <ThemeSwitcher />

    <hgroup>
      <h1>Chordex</h1>
      <p>
        A Chord Relationship (CR) shows how one chord relates to another by
        highlighting the interval between them and their qualities that give each
        CR its unique emotional color. This comprehensive taxonomy catalogs all
        192 possible tertian triad CRs.
      </p>
    </hgroup>



    <CRSearch @search="search" />

    <section style="display: flex; justify-content: center; color: var(--pico-muted-color)"><small>{{ `${store.filtered.length} results`}}</small></section>

    <section style="display: flex; justify-content: start; color: var(--pico-muted-color)"><span role="button" @click="shuffle">
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
  </main>
</template>

<script setup>
import { computed } from "vue";
import Scales from "./theory/Scales.js";
import Search from "./actions/Search.js";
import Shuffle from "./actions/Shuffle.js";
import CRCard from "./components/CRCard.vue";
import CRSearch from "./components/CRSearch.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import { useStore } from "./store";

const store = useStore();

const filteredScales = computed(function () {
  const offset = store.activeFilters.fifthsOffsets;
  if (!offset || offset.length === 0) {
    return Scales.all || [];
  }
  return (Scales.all || []).filter(function (scale) {
    return offset.includes(scale.fifthsOffset);
  });
});

function search(filters) {
  store.activeFilters = { ...filters };
  store.filtered = Search.execute(store.filtered, store.activeFilters);
}

function shuffle() {
  store.filtered = Shuffle.execute(store.filtered);
}
</script>


<style>
  /* Global styles for this app */
  [v-cloak] { display: none !important; }

  .container#app { /* keep your width constraints on the main container */
    width: 85%;
    margin: 0 auto;
  }

  /* Grid layout */
  .cr-grid {
    display: grid;
    gap: 1rem;
    /* make all implicit rows the same height so cards match within the grid */
    grid-auto-rows: 1fr;
    align-items: stretch; /* stretch items to fill row height */
  }
  @media (min-width: 480px) { .cr-grid { grid-template-columns: repeat(1, 1fr); } }
  @media (min-width: 768px) { .cr-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 992px) { .cr-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1200px){ .cr-grid { grid-template-columns: repeat(4, 1fr); } }

  /* Search */
  .cr-advanced-search{
    margin-bottom:unset;
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