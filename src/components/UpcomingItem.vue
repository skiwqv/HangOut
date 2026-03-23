<script setup lang="ts">
import type { UpcomingActivity } from '../types/activity'

defineProps<{ item: UpcomingActivity }>()
</script>

<template>
  <div class="upcoming-item">
    <div class="upcoming-icon" :style="{ background: item.iconBg }">
      {{ item.emoji }}
    </div>
    <div>
      <div class="upcoming-title">{{ item.title }}</div>
      <div class="upcoming-time">
        {{ item.datetime }} · {{ item.format === 'online' ? 'Онлайн' : 'Офлайн' }}
      </div>
    </div>
    <div class="upcoming-dot" :style="{ background: item.dotColor }" />
  </div>
</template>