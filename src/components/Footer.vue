<template>
  <footer v-if="hasFooter" class="app-footer">
    <div class="footer-content">
      <span class="footer-count">{{ store.selected.length }} selected</span>

      <button 
        class="footer-button"
        :class="{ active: store.activeFilters.selected }"
        @click="toggleSelectedFilter"
        title="Filter by selected items"
      >
        <i class="fa-solid fa-filter"></i> Selected Filter
      </button>

      <button 
        class="footer-button cta"
        @click="generateChordProgression"
        title="Generate Chord Progression"
      >
        <i class="fa-solid fa-music"></i> Chord Progression Generator
      </button>
      

    </div>
  </footer>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useStore } from "../store";

const store = useStore();

// Footer is visible when at least 2 items are selected
const hasFooter = computed(() => store.selected.length >= 2);

// Update app class based on footer visibility
watch(hasFooter, (visible) => {
  const appElement = document.getElementById('app');
  if (appElement) {
    if (visible) {
      appElement.classList.add('has-footer');
    } else {
      appElement.classList.remove('has-footer');
    }
  }
}, { immediate: true });

onMounted(() => {
  // Set initial state
  const appElement = document.getElementById('app');
  if (appElement && hasFooter.value) {
    appElement.classList.add('has-footer');
  }
});

function generateChordProgression() {
  store.generator.showModal = true;
}

function toggleSelectedFilter() {
  store.activeFilters.selected = !store.activeFilters.selected;
}
</script>

<style scoped>
  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--footer-height);
    background-color: var(--pico-card-background-color);
    border-top: 1px solid var(--pico-border-color);
    padding: 0 var(--pico-block-spacing-horizontal);
    display: flex;
    align-items: center;
    z-index: 100;
  }

  .footer-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-count {
    font-size: 0.875rem;
    color: var(--pico-muted-color);
    font-weight: 500;
  }

  .footer-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border: 1px solid var(--pico-border-color);
    background-color: var(--pico-card-background-color);
    color: var(--pico-color);
    cursor: pointer;
    border-radius: var(--pico-border-radius);
    transition: all 0.2s ease;
  }

  .footer-button.cta {
    background-color: var(--pico-primary);
    color: var(--pico-primary-inverse);
    border-color: transparent;
  }

  .footer-button.cta:hover {
    background-color: var(--pico-primary-background);
    color: var(--pico-primary-inverse);
    border-color: transparent;
  }

  .footer-button:hover {
    background-color: var(--pico-secondary-background);
    border-color: var(--pico-primary);
  }

  .footer-button.active {
    background-color: var(--pico-primary-background);
    color: var(--pico-primary-inverse);
    border-color: var(--pico-primary);
  }

  .footer-button i {
    font-size: 0.875rem;
  }
</style>

