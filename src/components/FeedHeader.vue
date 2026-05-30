<script setup lang="ts">
import { Search, Plus } from '@lucide/vue';
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
      <Plus :size="14" :stroke-width="2.5" />
      Создать
    </button>
  </div>
</template>