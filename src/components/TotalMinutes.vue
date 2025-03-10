<template>
  <div class="total-minutes">
    <span>Всего: </span>
    <span>{{ totalMinutes }}</span>
    <span> мин</span>
  </div>
</template>

<script>
export default {
  name: 'TotalMinutes',
  props: {
    totalMinutes: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.total-minutes {
  background-color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  color: #333;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: center;
  white-space: nowrap;
}
</style> 