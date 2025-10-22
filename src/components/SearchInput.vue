<template>
  <header class="cr-search-header">
    <h3>Search CRs</h3>
    <div class="search-container">
      <form class="search-form" role="search" @submit.prevent="$emit('submit')">
        <input
          id="search"
          class="search-input"
          type="search"
          :value="searchQuery"
          @input="$emit('input', $event.target.value)"
          placeholder='By label, intervals, qualities, scales… Operators: + | - | , | ""'
        />
        <button class="search-btn" type="submit" aria-label="Submit search">
          OK
        </button>
      </form>
    </div>
  </header>
</template>

<script setup>
defineProps({
  searchQuery: String
});

defineEmits(['input', 'submit']);
</script>
