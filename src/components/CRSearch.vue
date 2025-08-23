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
            placeholder='By label, intervals, qualities, scales… Operators: + | - | ,'
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
              :class="{ selected: isSelected('target', key) }"
              @click="toggle('target', key)"
            >
              <small>{{ key }}</small>
            </kbd>
          </div>
        </section>

        <!-- Scales -->
        <section>
          <label>Scales</label>
          <div class="tags">
            <kbd
              v-for="(scale, s) in (scales || [])"
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
              :class="{ selected: isSelected('commonTones', n-1) }"
              @click="toggle('commonTones', n-1)"
            >
              <small>{{ n - 1 }}</small>
            </kbd>
          </div>
        </section>

        <div style="display: flex; flex-direction:column; align-items: end; ">
          <button style="width: fit-content; margin-bottom:0.5rem;" type="submit" class="cr-advanced-search-submit" @click.prevent="onSubmit"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
          <button style="width: fit-content; padding:0.25rem;" type="reset" class="cr-advanced-search-reset" @click.prevent="reset">Reset</button>
        </div>


      </details>
    </main>
  </article>
</template>

<script>
import Scales from "../theory/Scales.js";
import Triads from "../theory/Triads.js";
import Intervals from "../theory/Intervals.js";

export default {
  name: "CRSearch",
  data() {
    return {
      searchQuery: "",
      scales: [],
      triads: [],
      intervals: {},
      // Holds the user's current selections (arrays for easy serialization)
      selected: {
        root: [],
        intervals: [],
        target: [],
        scales: [],
        commonTones: [],
      },
    };
  },
  computed: {
    // Single structured object with all filtering criteria
    filters() {
      return {
        query: this.searchQuery || "",
        root: [...this.selected.root],
        intervals: [...this.selected.intervals],
        target: [...this.selected.target],
        scales: [...this.selected.scales],
        commonTones: [...this.selected.commonTones],
      };
    },
  },
  methods: {
    onSearchInput(val) {
      this.searchQuery = val;
      this.$emit("search", this.filters);

    },
    onSubmit() {
      // Emit the structured filters object (parent can listen: @search="...").
            console.log(this.filters);
      console.log(this.selected);
      this.$emit("search", this.filters);
      // You can also access the object directly via this.filters
      // or send it to whatever search routine you have here.

    },
    isSelected(group, value) {
      return this.selected[group].includes(value);
    },
    toggle(group, value) {
      const arr = this.selected[group];
      const i = arr.indexOf(value);
      if (i === -1) {
        arr.push(value);
      } else {
        arr.splice(i, 1);
      }
      this.$emit("search", this.filters);
    },
    reset() {
      this.searchQuery = "";
      for (const k of Object.keys(this.selected)) this.selected[k] = [];
      this.$emit("search", this.filters); // tell parent to show all again
    },
  },
  mounted() {
    this.scales = Scales.all;
    this.triads = Triads.types;
    this.intervals = Intervals.romans;
  },
};
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

/* Make kbd feel like buttons */
.cr-advanced-search kbd {
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--pico-muted-border-color, #ccc);
  padding: .25rem .5rem;
  border-radius: .5rem;
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
  gap: .35rem;
}
</style>
