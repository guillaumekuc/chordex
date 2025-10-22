<template>
  <nav>
    <ul>
      <li>
        <details ref="dropdown" class="dropdown">
          <summary role="button" class="secondary">{{ theme }}</summary>
          <ul>
            <li><a href="#" @click.prevent="SetTheme.execute(store, 'auto'); dropdown.open = false">auto</a></li>
            <li><a href="#" @click.prevent="SetTheme.execute(store, 'light'); dropdown.open = false">light</a></li>
            <li><a href="#" @click.prevent="SetTheme.execute(store, 'dark'); dropdown.open = false">dark</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import SetTheme from "../actions/SetTheme.js";
import { useStore } from "../store";
import themeSwitcher from "../utils/minimal-theme-switcher.js";

const store = useStore();
const dropdown = ref(null);

const theme = computed(() => store.config.currentTheme);


onMounted(() => {
  // Initialize the theme switcher
  themeSwitcher.init();
  // Set the initial theme in the store
  store.config.currentTheme = themeSwitcher.scheme;
});


</script>

<style>
  nav li {
    padding-top:0;
  }

  .secondary {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }


</style>


