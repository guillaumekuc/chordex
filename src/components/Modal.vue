<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="closeModal" aria-label="Close modal">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal'
  }
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--pico-card-background-color);
  border-radius: var(--pico-border-radius);
  box-shadow: var(--pico-box-shadow);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
  border-bottom: 1px solid var(--pico-muted-border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--pico-muted-color);
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--pico-color);
}

.modal-body {
  padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
  overflow-y: auto;
  flex: 1;
}
</style>
