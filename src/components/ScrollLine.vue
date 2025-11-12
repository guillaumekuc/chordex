<template>
  <div
    ref="scrollContainer"
    class="scroll-line"
    :class="{ 'can-scroll': canScroll, 'dragging': isDragging }"
    :style="{ height: height }"
    @wheel="handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @mouseenter="updateCanScroll"
    @click="handleClick"
  >
    <div class="scroll-line-content">
      <slot></slot>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineOptions({ name: 'ScrollLine' });

const props = defineProps({
  height: {
    type: String,
    default: '2rem'
  }
});

const DRAG_THRESHOLD = 2;
const SCROLL_MULTIPLIER = 2;

const scrollContainer = ref(null);
const isDragging = ref(false);
const hasDragged = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const canScroll = ref(false);
let mutationObserver = null;

function hasOverflow() {
  return scrollContainer.value?.scrollWidth > scrollContainer.value?.clientWidth;
}

function updateCanScroll() {
  canScroll.value = hasOverflow();
}

function stopDragging() {
  isDragging.value = false;
  hasDragged.value = false;
  if (scrollContainer.value) {
    scrollContainer.value.style.cursor = '';
    scrollContainer.value.style.userSelect = '';
  }
}

function handleWheel(event) {
  if (hasOverflow()) {
    event.preventDefault();
    scrollContainer.value.scrollLeft += event.deltaY;
  }
}

function handleMouseDown(event) {
  const isLeftClick = event.button === 0;
  const isInteractiveElement = event.target.closest('button, a, input, select, textarea');
  
  if (isLeftClick && !isInteractiveElement) {
    event.preventDefault();
    isDragging.value = true;
    hasDragged.value = false;
    startX.value = event.pageX - scrollContainer.value.offsetLeft;
    scrollLeft.value = scrollContainer.value.scrollLeft;
    scrollContainer.value.style.cursor = 'grabbing';
    scrollContainer.value.style.userSelect = 'none';
  }
}

function handleMouseMove(event) {
  if (!isDragging.value) return;
  
  const currentX = event.pageX - scrollContainer.value.offsetLeft;
  const dragDistance = (currentX - startX.value) * SCROLL_MULTIPLIER;
  
  if (Math.abs(dragDistance) > DRAG_THRESHOLD) {
    event.preventDefault();
    hasDragged.value = true;
    scrollContainer.value.scrollLeft = scrollLeft.value - dragDistance;
  }
}

function handleMouseUp(event) {
  if (event.button === 0 || !event.buttons) {
    stopDragging();
  }
}

function handleClick(event) {
  if (hasDragged.value) {
    event.stopPropagation();
    hasDragged.value = false;
  }
}

function handleMouseLeave() {
  stopDragging();
}

onMounted(() => {
  updateCanScroll();
  window.addEventListener('resize', updateCanScroll);
  
  if (scrollContainer.value) {
    mutationObserver = new MutationObserver(updateCanScroll);
    mutationObserver.observe(scrollContainer.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanScroll);
  mutationObserver?.disconnect();
});
</script>

<style scoped>
.scroll-line {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.scroll-line::-webkit-scrollbar {
  display: none;
}

.scroll-line-content {
  display: flex;
  align-items: center;
  height: 100%;
  width: max-content;
  user-select: none;
}

.scroll-line.can-scroll {
  cursor: grab;
}

.scroll-line.can-scroll:active {
  cursor: grabbing;
}


</style>

