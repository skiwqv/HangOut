<script setup lang="ts">
import ToastItem from './ToastItem.vue'

defineProps<{
  toasts: Array<{
    id: number
    type: 'success' | 'error' | 'warning'
    title: string
    message?: string
    duration?: number
  }>
}>()

defineEmits<{
  close: [id: number]
}>()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <ToastItem
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          :duration="toast.duration"
          @close="$emit('close', toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
