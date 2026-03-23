<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost' | 'disabled'
}>()
</script>

<template>
  <button
    class="btn"
    :class="`btn--${variant ?? 'ghost'}`"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>