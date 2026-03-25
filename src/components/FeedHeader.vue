<script setup lang="ts">
import { Search } from '@lucide/vue';
import { ref } from 'vue';
const emit = defineEmits<{ create: [] }>()

let search = ref('')
</script>

<template>
  <div class="feed-header">
    <div class="search-bar-wrapper">
      <input v-model="search" class="search-bar" placeholder="Найти активность...">
      <Search class="search-icon" color=" var(--text3)" :size="16"/>
    </div>
    <button class="btn-create" @click="emit('create')">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Создать
    </button>
  </div>
</template>