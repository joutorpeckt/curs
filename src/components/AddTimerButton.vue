<template>
  <button class="toggle-timer-button" @click="$emit('add')">
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    Добавить таймер
  </button>
</template>

<script>
export default {
  name: 'AddTimerButton'
}
</script>

<style scoped>
.toggle-timer-button {
  background-color: #1a1a1a;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.toggle-timer-button:hover {
  background-color: #333;
}

.toggle-timer-button svg {
  width: 24px;
  height: 24px;
}
</style> 