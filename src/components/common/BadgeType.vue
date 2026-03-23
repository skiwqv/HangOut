<script setup lang="ts">
import type { ActivityFormat } from '@/types/activity'

defineProps<{ format: ActivityFormat }>()
</script>

<template>
  <span
    class="badge-type"
    :class="format === 'online' ? 'badge-online' : 'badge-offline'"
  >
    {{ format === 'online' ? '● Онлайн' : '◆ Офлайн' }}
  </span>
</template>