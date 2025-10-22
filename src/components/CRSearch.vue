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

        <FifthsLevelFilterSection
          :selected-values="selected.fifthsOffsets"
          @toggle="(value) => toggle('fifthsOffsets', value)"
        />

        <FilterSection
          label="Scales"
          filter-key="scales"
          :items="filteredScales"
          :selected-values="selected.scales"
          :display-value="(scale) => scale.label"
          @toggle="(key) => toggle('scales', key)"
        />

        <CommonTonesFilterSection
          :selected-values="selected.commonTones"
          @toggle="(value) => toggle('commonTones', value)"
        />

        <!-- Submit -->
        <div class="filter-actions">
          <button
            type="submit"
            class="cr-advanced-search-submit"
            @click.prevent="onSubmit"
          >
            <i class="fa-solid fa-magnifying-glass"></i> Search
          </button>

          <!-- Reset -->
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
  fifthsOffsets: [0]
});

const filters = computed(() => {
  return {
    query: searchQuery.value || "",
    root: [...selected.root],
    intervals: [...selected.intervals],
    target: [...selected.target],
    scales: [...selected.scales],
    commonTones: [...selected.commonTones],
    fifthsOffsets: [...selected.fifthsOffsets]
  };
});

const filteredScales = computed(() => {
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

function reset() {
  ResetFilters.execute(store);
  searchQuery.value = "";
  Object.keys(selected).forEach(key => {
    selected[key] = [];
  });
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
  border: 1px solid var(--pico-muted-border-color, #ccc);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  outline: none;
}

.cr-advanced-search kbd:focus-visible {
  box-shadow: 0 0 0 2px var(--pico-primary, #5b9);
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

.cr-advanced-search-submit {
  width: fit-content;
  margin-bottom: 0.5rem;
}

.cr-advanced-search-reset {
  width: fit-content;
  padding: 0.25rem;
}
</style>