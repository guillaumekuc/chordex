<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false" ref="wrapperRef">
    <slot></slot>
    <Teleport to="body">
      <div v-if="show" class="tooltip" :class="position" :style="tooltipStyle">
        {{ text }}
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  }
});

const show = ref(false);
const wrapperRef = ref(null);
const tooltipStyle = ref({});

function updateTooltipPosition() {
  if (!show.value || !wrapperRef.value) return;
  
  const rect = wrapperRef.value.getBoundingClientRect();
  const style = {};
  
  switch (props.position) {
    case 'top':
      style.left = `${rect.left + rect.width / 2}px`;
      style.bottom = `${window.innerHeight - rect.top + 5}px`;
      style.transform = 'translateX(-50%)';
      break;
    case 'bottom':
      style.left = `${rect.left + rect.width / 2}px`;
      style.top = `${rect.bottom + 5}px`;
      style.transform = 'translateX(-50%)';
      break;
    case 'left':
      style.right = `${window.innerWidth - rect.left + 5}px`;
      style.top = `${rect.top + rect.height / 2}px`;
      style.transform = 'translateY(-50%)';
      break;
    case 'right':
      style.left = `${rect.right + 5}px`;
      style.top = `${rect.top + rect.height / 2}px`;
      style.transform = 'translateY(-50%)';
      break;
  }
  
  tooltipStyle.value = style;
}

watch(show, (newVal) => {
  if (newVal) {
    setTimeout(() => updateTooltipPosition(), 0);
    // Add listeners when tooltip is shown
    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);
  } else {
    // Remove listeners when tooltip is hidden
    window.removeEventListener('scroll', updateTooltipPosition, true);
    window.removeEventListener('resize', updateTooltipPosition);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateTooltipPosition, true);
  window.removeEventListener('resize', updateTooltipPosition);
});
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  --tooltip-background-color: var(--pico-background-color);

  position: fixed;
  z-index: 10000;
  padding: 0.5rem 0.75rem;
  background-color: var(--tooltip-background-color);
  color: var(--pico-color);
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
}

.tooltip::before {
  content: '';
  position: absolute;
  border: 5px solid transparent;
}

.tooltip.top::before {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: var(--tooltip-background-color);
}

.tooltip.bottom::before {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: var(--tooltip-background-color);
}

.tooltip.left::before {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: var(--tooltip-background-color);
}

.tooltip.right::before {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: var(--tooltip-background-color);
}
</style>

