<script setup lang="ts">
import { CircleCheckIcon, CircleXIcon, TriangleAlertIcon, XIcon } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{
  type: 'success' | 'error' | 'warning'
  title: string
  message?: string
  duration?: number
}>()

defineEmits<{
  close: []
}>()

const icon = computed(() => {
  const icons = {
    success: CircleCheckIcon,
    error: CircleXIcon,
    warning: TriangleAlertIcon,
  }
  return icons[props.type]
})

const durationStyle = computed(() => ({
  '--toast-duration': `${props.duration ?? 4}s`,
}))
</script>

<template>
  <div
    class="toast"
    :class="`toast--${type}`"
    :style="durationStyle"
    role="alert"
  >
    <div class="toast__icon">
      <component :is="icon" />
    </div>

    <div class="toast__body">
      <div class="toast__title">{{ title }}</div>
      <div v-if="message" class="toast__message">{{ message }}</div>
    </div>

    <button class="toast__close" @click="$emit('close')" aria-label="Закрыть">
      <XIcon />
    </button>

    <div class="toast__progress">
      <div class="toast__progress-bar" />
    </div>
  </div>
</template>
