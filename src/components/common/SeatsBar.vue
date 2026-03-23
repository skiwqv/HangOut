<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  taken: number
  total: number
}>()

const percent = computed(() => Math.round((props.taken / props.total) * 100))

const color = computed(() => {
  if (percent.value === 100) return 'var(--red)'
  if (percent.value >= 75) return 'linear-gradient(90deg, #ef4444, #f59e0b)'
  return 'linear-gradient(90deg, var(--purple), var(--mint))'
})

const label = computed(() => {
  if (percent.value === 100) return `${props.total} / ${props.total} — мест нет`
  return `${props.taken} / ${props.total} мест`
})

const labelColor = computed(() => {
  if (percent.value === 100) return 'var(--red)'
  if (percent.value >= 75) return 'var(--yellow)'
  return 'var(--mint)'
})
</script>

<template>
  <div class="seats-row">
    <div class="seats-bar-wrap">
      <div
        class="seats-bar-fill"
        :style="{ width: `${percent}%`, background: color }"
      />
    </div>
    <span class="seats-text" :style="{ color: labelColor }">
      {{ label }}
    </span>
  </div>
</template>