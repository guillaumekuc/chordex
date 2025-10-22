<template>
  <section>
    <label>{{ label }}</label>
    <div class="tags">
      <kbd
        v-for="(item, key) in items"
        :key="`${filterKey}-${key}`"
        :class="{ selected: isSelected(key) }"
        @click="$emit('toggle', key)"
      >
        <small>{{ getDisplayValue(item, key) }}</small>
      </kbd>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  label: String,
  filterKey: String,
  items: Object,
  selectedValues: Array,
  displayValue: {
    type: Function,
    default: (item, key) => item
  }
});

const emit = defineEmits(['toggle']);

function isSelected(key) {
  return props.selectedValues.includes(key);
}

function getDisplayValue(item, key) {
  return props.displayValue(item, key);
}
</script>
