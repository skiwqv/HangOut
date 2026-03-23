<script setup lang="ts">
import type { ActivityParticipant } from '@/types/activity'
import BaseAvatar from './BaseAvatar.vue'

defineProps<{
  participants: ActivityParticipant[]
  count: number
}>()
</script>

<template>
  <div class="avatar-group">
    <BaseAvatar
      v-for="p in participants"
      :key="p.id"
      :initials="p.initials"
      :gradient="p.gradient"
      size="sm"
    />
    <span class="avatar-group__label">&nbsp;{{ count }} идут</span>
  </div>
</template>