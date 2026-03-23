<script setup lang="ts">
defineProps<{
  initials: string
  gradient: string
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    class="avatar"
    :class="`avatar--${size ?? 'md'}`"
    :style="{ background: gradient }"
  >
    {{ initials }}
  </div>
</template>