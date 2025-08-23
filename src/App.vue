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

/* Card */
.cr-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0; /* grid gap controls spacing */
}

.cr-label {
  margin: 0 0 .5rem;
  font-size: 1rem;
  line-height: 1.25;
  text-overflow: ellipsis;
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
  gap: .35rem;
}

.cr-tag {
  font-size: .66rem;
  font-weight: 500;
  letter-spacing: .01em;
  padding: .25rem .4rem;
  border-radius: .5rem;
  height: max-content;
}
</style>










<template>
  <main class="container" v-cloak>
    <nav>
      <ul>
        <li>
          <details class="dropdown">
            <summary role="button" class="secondary">{{ theme }}</summary>
            <ul>
              <li><a href="#" @click.prevent="setTheme('auto')">auto</a></li>
              <li><a href="#" @click.prevent="setTheme('light')">light</a></li>
              <li><a href="#" @click.prevent="setTheme('dark')">dark</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </nav>

    <hgroup>
      <h1>Chordex</h1>
      <p>
        A Chord Relationship (CR) shows how one chord relates to another by
        highlighting the interval between them and their qualities that give each
        CR its unique emotional color. This comprehensive taxonomy catalogs all
        192 possible tertian triad CRs.
      </p>
    </hgroup>

    <article class="cr-filter">
      <header class="cr-filter-header">test</header>
    </article>

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

export default {
  name: "App",
  components: { CRCard },
  data() {
    return {
      chordRelationships: [],
      theme: "auto",
    };
  },
  methods: {
    setTheme(sel) {
      themeSwitcher.scheme = sel;
      this.theme = sel;
    },
  },
  mounted() {
    themeSwitcher.init();
    // Prepare & load data
    ChordRelationships.mapScales(Scales.all);
    this.chordRelationships = ChordRelationships.all;
    this.theme = themeSwitcher.scheme;
  },
};
</script>


