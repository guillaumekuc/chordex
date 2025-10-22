<template>
  <section>
    <label>Fifths Level</label>
    <div class="tags">
      <kbd
        v-for="n in 13"
        :key="'fifths-' + (n - 7)"
        :class="{ selected: isSelected(n - 7) }"
        @click="$emit('toggle', n - 7)"
      >
        <small>{{ n - 7 > 0 ? '+' + (n - 7) : n - 7 }}</small>
      </kbd>
    </div>
  </section>
</template>

<script setup>
  const props = defineProps({
    selectedValues: Array
  });

  const emit = defineEmits(['toggle']);

  function isSelected(value) {
    return props.selectedValues.includes(value);
  }
</script>
