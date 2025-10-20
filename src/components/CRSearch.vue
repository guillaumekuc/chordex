<template>
  <article class="cr-filter">
    <header class="cr-filter-header">
      <h3>Search CRs</h3>
      <div class="search-container">
        <form class="search-form" role="search" @submit.prevent="onSubmit">
          <input
            id="search"
            class="search-input"
            type="search"
            :value="searchQuery"
            @input="onSearchInput($event.target.value)"
            placeholder='By label, intervals, qualities, scales… Operators: + | - | , | ""'
          />
          <button class="search-btn" type="submit" aria-label="Submit search">
            OK
          </button>
        </form>
      </div>
    </header>

    <main>
      <details class="cr-advanced-search">
        <summary>Advanced Search</summary>

        <!-- Root -->
        <section>
          <label>Root</label>
          <div class="tags">
            <kbd
              v-for="(type, key) in triads"
              :key="'root-' + key"
              :class="{ selected: isSelected('root', key) }"
              @click="toggle('root', key)"
            >
              <small>{{ key }}</small>
            </kbd>
          </div>
        </section>

        <!-- Interval -->
        <section>
          <label>Interval</label>
          <div class="tags">
            <kbd
              v-for="(interval, key) in intervals"
              :key="'int-' + key"
              :class="{ selected: isSelected('intervals', key) }"
              @click="toggle('intervals', key)"
            >
              <small>{{ interval }}</small>
            </kbd>
          </div>
        </section>

        <!-- Target -->
        <section>
          <label>Target</label>
          <div class="tags">
            <kbd
              v-for="(type, key) in triads"
              :key="'target-' + key"
              :class="{ selected: isSelected('target', key) }"
              @click="toggle('target', key)"
            >
              <small>{{ key }}</small>
            </kbd>
          </div>
        </section>

        <!-- Fifths Modulation Level -->
        <section>
          <label>Fifths Level</label>
          <div class="tags">
            <kbd
              v-for="n in 13"
              :key="'fifths-' + (n - 7)"
              :class="{ selected: isSelected('fifthsOffsets', n - 7) }"
              @click="toggle('fifthsOffsets', n - 7)"
            >
              <small>{{ n - 7 > 0 ? '+' + (n - 7) : n - 7 }}</small>
            </kbd>
          </div>
        </section>

        <!-- Scales -->
        <section>
          <label>Scales</label>
          <div class="tags">
            <kbd
              v-for="(scale, s) in filteredScales"
              :key="'scale-' + s"
              :class="{ selected: isSelected('scales', scale.label) }"
              @click="toggle('scales', scale.label)"
            >
              <small>{{ scale.label }}</small>
            </kbd>
          </div>
        </section>

        <!-- Common Tones -->
        <section>
          <label>Common Tones</label>
          <div class="tags">
            <kbd
              v-for="n in 4"
              :key="'ct-' + (n - 1)"
              :class="{ selected: isSelected('commonTones', n - 1) }"
              @click="toggle('commonTones', n - 1)"
            >
              <small>{{ n - 1 }}</small>
            </kbd>
          </div>
        </section>

        <!-- Submit -->
        <div style="display: flex; flex-direction: column; align-items: end;">
          <button
            style="width: fit-content; margin-bottom: 0.5rem;"
            type="submit"
            class="cr-advanced-search-submit"
            @click.prevent="onSubmit"
          >
            <i class="fa-solid fa-magnifying-glass"></i> Search
          </button>

        <!-- Reset -->
          <button
            style="width: fit-content; padding: 0.25rem;"
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
import { ref, reactive, computed, onMounted } from "vue";
import Scales from "../theory/Scales.js";
import Triads from "../theory/Triads.js";
import Intervals from "../theory/Intervals.js";

const emit = defineEmits(["search"]);

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

const filters = computed(function () {
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

const filteredScales = computed(function () {
  const offsets = selected.fifthsOffsets;
  if (!offsets || offsets.length === 0) {
    return scales || [];
  }
  return (scales || []).filter(function (scale) {
    return offsets.includes(scale.fifthsOffset);
  });
});

function onSearchInput(value) {
  searchQuery.value = value;
  emit("search", filters.value);
}

function onSubmit() {
  console.log(filters.value);
  console.log(selected);
  emit("search", filters.value);
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
  emit("search", filters.value);
}

function reset() {
  searchQuery.value = "";
  Object.keys(selected).forEach(function (key) {
    selected[key] = [];
  });
  emit("search", filters.value);
}

onMounted(function () {

});
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
</style>
