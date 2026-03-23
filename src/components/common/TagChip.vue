<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
  variant?: 'filter' | 'card' | 'my'
}>()

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <span
    class="tag-chip"
    :class="[
      `tag-chip--${variant ?? 'filter'}`,
      { 'tag-chip--active': active }
    ]"
    @click="emit('click')"
  >
    {{ label }}
  </span>
</template>