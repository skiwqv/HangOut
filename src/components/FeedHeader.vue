<script setup lang="ts">
const emit = defineEmits<{ create: [] }>()
</script>

<template>
  <div class="feed-header">
    <div class="search-bar">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span>Найти активность...</span>
    </div>
    <button class="btn-create" @click="emit('create')">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Создать
    </button>
  </div>
</template>