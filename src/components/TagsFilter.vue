<script setup lang="ts">
import TagChip from './common/TagChip.vue'

const props = defineProps<{ tags: string[]; active: string }>()
const emit = defineEmits<{ update: [tag: string] }>()
</script>

<template>
  <div class="tags-row">
    <TagChip
      v-for="tag in tags"
      :key="tag"
      :label="tag"
      :active="tag === active"
      variant="filter"
      @click="emit('update', tag)"
    />
  </div>
</template>