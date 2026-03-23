<script setup lang="ts">
import type { User } from '@/types/user'
import TagChip from './common/TagChip.vue'

defineProps<{ user: User }>()
</script>

<template>
  <div class="profile-block">
    <div class="profile-top">
      <div class="profile-avatar">{{ user.initials }}</div>
      <div>
        <div class="profile-name">{{ user.name }}</div>
        <div class="profile-handle">@{{ user.handle }} · {{ user.city }}</div>
      </div>
    </div>
  
    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-num">{{ user.stats.organized }}</div>
        <div class="stat-label">Организовал</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ user.stats.participated }}</div>
        <div class="stat-label">Участвовал</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ user.stats.rating }}</div>
        <div class="stat-label">Рейтинг</div>
      </div>
    </div>
  
    <div class="reliability">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        style="color:var(--mint);flex-shrink:0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span class="reliability-label">Надёжность — приходит когда говорит</span>
      <span class="reliability-value">{{ user.reliability }}%</span>
    </div>
  </div>
  <div class="section-title" style="margin-top:16px">
    Мои теги <a>+ Добавить</a>
  </div>
  <div class="my-tags">
    <TagChip v-for="tag in user.tags" :key="tag" :label="tag" variant="my" />
  </div>
</template>