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

</style>










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

    <CRSearch />

    <section class="cr-grid">
      <CRCard
        v-for="(cr, i) in chordRelationships"
        :key="cr.label + '-' + i"
        :cr="cr"
      />
    </section>
  </main>
</template>

<script>
import Intervals from "./theory/Intervals.js";
import Scales from "./theory/Scales.js";
import ChordRelationships from "./theory/ChordRelationships.js";
import * as Common from "./theory/common.js";
import themeSwitcher from "./utils/minimal-theme-switcher.js";

import CRCard from "./components/CRCard.vue";
import CRSearch from "./components/CRSearch.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";

export default {
  name: "App",
  components: { 
    CRCard,
    CRSearch,
    ThemeSwitcher, 
  },
  data() {
    return {
      chordRelationships: [],
    };
  },
  methods: {
  },
  mounted() {
    // Prepare & load data
    ChordRelationships.mapScales(Scales.all);
    this.chordRelationships = ChordRelationships.all;
  },
};
</script>


