<template>
  <section>
    <label>Common Tones</label>
    <div class="tags">
      <kbd
        v-for="n in 4"
        :key="'ct-' + (n - 1)"
        :class="{ selected: isSelected(n - 1) }"
        @click="$emit('toggle', n - 1)"
      >
        <small>{{ n - 1 }}</small>
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
