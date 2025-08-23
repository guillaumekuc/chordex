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



    <CRSearch @search="onSearch" />

    <section style="display: flex; justify-content: center; color: var(--pico-muted-color)"><small>{{ `${filteredChordRelationships.length} results`}}</small></section>

    <section class="cr-grid">
      <CRCard
        v-for="(cr, i) in filteredChordRelationships"
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
      filteredChordRelationships: [],
      activeFilter: {
        query: "",
        root: [],
        intervals: [],
        target: [],
        scales: [],
        commonTones: []
      }
    };
  },
  methods: { 
    onSearch(filters) {
      this.activeFilters = { ...filters };
      this.applyFilters();
    },
    applyFilters() {
      console.log('apply filters');
      const f = this.activeFilters;
      let results = this.chordRelationships;
      console.log(this.chordRelationships);

      // 1) text query (label, roman, interval, qualities, scale labels)
      
      if (f.query && f.query.trim()) {
        const q = f.query.trim();
        const queries = q.split(',').map(query => query.trim()).filter(query => query.length > 0);
        
        results = results.filter(cr => {
          return queries.some(singleQuery => {
            if (singleQuery.includes('+') || singleQuery.includes('-')) {
              return matchComplexQuery(cr, singleQuery);
            } else {
              return matchSingleTerm(cr, singleQuery);
            }
          });
        });
      }

      // Helper functions
      function parseSearchTerm(term) {
        const isExactMatch = term.startsWith('"') && term.endsWith('"') && term.length > 2;
        const searchTerm = isExactMatch ? term.slice(1, -1) : term;
        
        return {
          isExactMatch,
          scaleQuery: searchTerm.toLowerCase().replace(/b(\d)/g, '♭$1').replace(/#(\d)/g, '♯$1'), //replace flats and sharps before numbers, for strings like 'Dorian ♯4'
          crQuery: searchTerm.replace(/b/g, '♭').replace(/i/g, 'I').replace(/a/g, 'A').replace(/D/g, 'd') //replace flats, case correct aug and dim symbols
        };
      }

      function matchesItem(cr, parsedTerm) {
        const { isExactMatch, scaleQuery, crQuery } = parsedTerm;
        
        let nameMatch, scaleMatch;
        
        if (isExactMatch) {
          nameMatch = (cr.label || "").replace(/b/g, '♭').replace(/i/g, 'I').replace(/a/g, 'A') === crQuery;
          scaleMatch = Array.isArray(cr.scales) && cr.scales.some(s => 
            (s || "").toLowerCase() === scaleQuery
          );
        } else {
          nameMatch = (cr.label || "").includes(crQuery);
          scaleMatch = Array.isArray(cr.scales) && cr.scales.some(s => 
            (s || "").toLowerCase().includes(scaleQuery)
          );
        }
        
        return nameMatch || scaleMatch;
      }

      function parseComplexQuery(query) {
        const terms = [];
        let currentTerm = '';
        let inQuotes = false;
        let operator = 'include'; // 'include', 'exclude'
        
        for (let i = 0; i < query.length; i++) {
          const char = query[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
            currentTerm += char;
          } else if (!inQuotes && (char === '+' || char === '-')) {
            // Save current term if exists
            if (currentTerm.trim()) {
              terms.push({ term: currentTerm.trim(), operator });
              currentTerm = '';
            }
            
            // Set operator for next term
            operator = char === '+' ? 'include' : 'exclude';
          } else if (!inQuotes && char === ' ') {
            // Skip spaces outside quotes unless they're part of the term
            if (currentTerm.trim()) {
              currentTerm += char;
            }
          } else {
            currentTerm += char;
          }
        }
        
        // Add final term
        if (currentTerm.trim()) {
          terms.push({ term: currentTerm.trim(), operator });
        }
        
        return terms;
      }

      function matchComplexQuery(cr, query) {
        const terms = parseComplexQuery(query);
        
        // All include terms must match AND no exclude terms must match
        const includeTerms = terms.filter(t => t.operator === 'include');
        const excludeTerms = terms.filter(t => t.operator === 'exclude');
        
        // If no include terms, assume we want everything (just excluding)
        const includeMatch = includeTerms.length === 0 || includeTerms.every(termObj => {
          const parsedTerm = parseSearchTerm(termObj.term);
          return matchesItem(cr, parsedTerm);
        });
        
        const excludeMatch = excludeTerms.some(termObj => {
          const parsedTerm = parseSearchTerm(termObj.term);
          return matchesItem(cr, parsedTerm);
        });
        
        return includeMatch && !excludeMatch;
      }

      function matchSingleTerm(cr, query) {
        const parsedTerm = parseSearchTerm(query);
        return matchesItem(cr, parsedTerm);
      }

      // 2) root quality
      if (f.root?.length) {
        results = results.filter(cr => f.root.includes(cr.rootQuality));
      }

      // 3) interval (roman)
      if (f.intervals?.length) {
        console.log(f.intervals);
        results = results.filter(cr => f.intervals.includes(cr.pitchClass));
      }

      // 4) target quality
      if (f.target?.length) {
        results = results.filter(cr => f.target.includes(cr.targetQuality));
      }

      // 5) scales
      if (f.scales?.length) {
        results = results.filter(cr =>
          Array.isArray(cr.scales) && cr.scales.some(s => f.scales.includes(s))
        );
      }

      // 6) common tones (numbers 0–3)
      if (f.commonTones?.length) {
        results = results.filter(cr => f.commonTones.includes(cr.commonTones));
      }

      this.filteredChordRelationships = results;
    },
  },
  mounted() {
    // Prepare & load data
    ChordRelationships.mapScales(Scales.all);
    this.chordRelationships = ChordRelationships.all;
    this.filteredChordRelationships = this.chordRelationships;
  },
};
</script>


