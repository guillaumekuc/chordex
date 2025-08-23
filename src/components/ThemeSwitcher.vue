<template>
  <nav>
    <ul>
      <li>
        <details ref="dropdown" class="dropdown">
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
</template>

<script>
import themeSwitcher from "../utils/minimal-theme-switcher.js";

export default {
  name: "ThemeSwitcher",
  data() {
    return {
      theme: "auto",
    };
  },
  methods: {
    setTheme(sel) {
      themeSwitcher.scheme = sel;
      this.theme = sel;
      this.$refs.dropdown.open = false;

    },
  },
  mounted() {
    themeSwitcher.init();
    this.theme = themeSwitcher.scheme;
    

  },
};
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