<template>
  <article class="cr-search">
    <SearchInput 
      :search-query="searchQuery"
      @input="onSearchInput"
      @submit="onSubmit"
    />

    <main>
      <details class="cr-advanced-search">
        <summary>Advanced Search</summary>

        <FilterSection
          label="Root"
          filter-key="root"
          :items="triads"
          :selected-values="selected.root"
          :display-value="(type, key) => key"
          @toggle="(key) => toggle('root', key)"
        />

        <FilterSection
          label="Interval"
          filter-key="intervals"
          :items="intervals"
          :selected-values="selected.intervals"
          :display-value="(interval) => interval"
          @toggle="(key) => toggle('intervals', key)"
        />

        <FilterSection
          label="Target"
          filter-key="target"
          :items="triads"
          :selected-values="selected.target"
          :display-value="(type, key) => key"
          @toggle="(key) => toggle('target', key)"
        />
        <FilterSection
          v-if="store.allTags.length > 0"
          label="Tags"
          filter-key="tags"
          :items="Object.fromEntries(store.allTags.map(tag => [tag, tag]))"
          :selected-values="selected.tags"
          :display-value="(tag) => `#${tag}`"
          @toggle="(key) => toggle('tags', key)"
        />
        
        <FifthsLevelFilterSection
          v-if="store.config.extendedScales"
          :selected-values="selected.fifthsOffsets"
          @toggle="(value) => toggle('fifthsOffsets', value)"
        />

        <FilterSection
          label="Scales"
          filter-key="scales"
          :items="Object.fromEntries(filteredScales.map(scale => [scale.label, scale]))"
          :selected-values="selected.scales"
          :display-value="(scale) => scale.label"
          @toggle="(key) => toggle('scales', key)"
        />

        <CommonTonesFilterSection
          :selected-values="selected.commonTones"
          @toggle="(value) => toggle('commonTones', value)"
        />



        <!-- Selected Filter -->
        <section>
          <label>
            <input
              type="checkbox"
              :checked="store.activeFilters.selected"
              @change="toggleSelected"
            />
            Selected
          </label>
        </section>

        <!-- Reset -->
        <div class="filter-actions">
          <button
            type="reset"
            class="cr-advanced-search-reset"
            @click.prevent="reset"
          >
            Reset
          </button>
        </div>
      </details>
    </main>
  </article>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Scales from "../theory/Scales.js";
import Triads from "../theory/Triads.js";
import Intervals from "../theory/Intervals.js";
import ResetFilters from "../actions/ResetFilters.js";
import Shuffle from "../actions/Shuffle.js";
import debugLog from "../utils/debugLog.js";
import { useStore } from "../store";
import SearchInput from "./SearchInput.vue";
import FilterSection from "./FilterSection.vue";
import FifthsLevelFilterSection from "./FifthsLevelFilterSection.vue";
import CommonTonesFilterSection from "./CommonTonesFilterSection.vue";

const store = useStore();

const searchQuery = ref("");
const scales = Scales.all;
const triads = Triads.types;
const intervals = Intervals.romans;

const selected = reactive({
  root: [],
  intervals: [],
  target: [],
  scales: [],
  commonTones: [],
  fifthsOffsets: [],
  tags: []
  // Note: 'selected' is now managed directly in store.activeFilters.selected
});

// Extract tags from query string (words starting with #)
function extractTags(query) {
  if (!query) return [];
  // Match words starting with # followed by alphanumeric characters
  const tagMatches = query.match(/#[\w]+/g);
  if (!tagMatches) return [];
  // Remove the # prefix and return unique tags
  return [...new Set(tagMatches.map(tag => tag.substring(1)))];
}

// Remove tags from query string
function removeTagsFromQuery(query) {
  if (!query) return "";
  // Replace #tag patterns with empty string, then clean up extra spaces and trailing commas
  return query.replace(/#[\w]+/g, '').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
}

const filters = computed(() => {
  // Keep the original query with tags - Search.js will parse it properly
  const originalQuery = searchQuery.value || "";
  
  // Extract tags from query for filter panel display, but don't remove from query
  const extractedTags = extractTags(originalQuery);
  
  // Filter panel tags are separate from query tags (AND logic)
  // Query tags will be handled as part of comma-separated OR in Search.js
  const filterPanelTags = [...selected.tags];
  
  return {
    query: originalQuery, // Keep original query with tags for proper comma-separated OR parsing
    root: [...selected.root],
    intervals: [...selected.intervals],
    target: [...selected.target],
    scales: [...selected.scales],
    commonTones: [...selected.commonTones],
    fifthsOffsets: [...selected.fifthsOffsets],
    queryTags: extractedTags, // Tags from query (for OR logic)
    filterTags: filterPanelTags, // Tags from filter panel (for AND logic)
    selected: store.activeFilters.selected
  };
});

const filteredScales = computed(() => {
  if (!store.config.extendedScales) {
    // Only show level 0 scales when extended scales are disabled
    return (scales || []).filter(scale => scale.fifthsOffset === 0);
  }
  const offsets = selected.fifthsOffsets;
  if (!offsets || offsets.length === 0) {
    return scales || [];
  }
  return (scales || []).filter(scale => {
    return offsets.includes(scale.fifthsOffset);
  });
});


function updateActiveFilters() {
  store.activeFilters.query = filters.value.query;
  store.activeFilters.root = [...filters.value.root];
  store.activeFilters.intervals = [...filters.value.intervals];
  store.activeFilters.target = [...filters.value.target];
  store.activeFilters.scales = [...filters.value.scales];
  store.activeFilters.commonTones = [...filters.value.commonTones];
  store.activeFilters.fifthsOffsets = [...filters.value.fifthsOffsets];
  store.activeFilters.queryTags = [...filters.value.queryTags];
  store.activeFilters.filterTags = [...filters.value.filterTags];
  store.activeFilters.selected = filters.value.selected;
}

function onSearchInput(value) {
  searchQuery.value = value;
  updateActiveFilters();
  Shuffle.reset(store); // Reset shuffle when filters change
}

function onSubmit() {
  debugLog('Search submitted with filters:', Object.keys(filters.value).filter(key => filters.value[key]?.length > 0));
  updateActiveFilters();
  Shuffle.reset(store); // Reset shuffle when filters change
}

function isSelected(group, value) {
  return selected[group].includes(value);
}

function toggle(group, value) {
  const array = selected[group];
  const index = array.indexOf(value);
  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
  updateActiveFilters();
  Shuffle.reset(store); // Reset shuffle when filters change
}

function toggleSelected(event) {
  store.activeFilters.selected = event.target.checked;
  updateActiveFilters();
  Shuffle.reset(store); // Reset shuffle when filters change
}

function reset() {
  ResetFilters.execute(store);
  searchQuery.value = "";
  Object.keys(selected).forEach(key => {
    if (key === 'fifthsOffsets') {
      selected[key] = [];
    } else {
      selected[key] = [];
    }
  });
  // Note: store.activeFilters.selected is reset by ResetFilters.execute()
  updateActiveFilters();
  Shuffle.reset(store); // Reset shuffle when filters change
}

</script>

<style>
.cr-advanced-search {
  margin-bottom: unset;
}

.cr-advanced-search kbd.selected {
  background-color: var(--pico-primary-background);
  color: var(--pico-primary-inverse);
  border-color: var(--pico-primary);
}

.cr-advanced-search kbd {
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--pico-muted-border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  outline: none;
}

.cr-advanced-search kbd:focus-visible {
  box-shadow: 0 0 0 2px var(--pico-primary);
}

.cr-advanced-search kbd:active {
  transform: translateY(1px);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.filter-actions {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.cr-advanced-search-reset {
  width: fit-content;
  padding: 0.25rem;
}
</style>