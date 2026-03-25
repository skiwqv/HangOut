<script setup lang="ts">
import type { User } from '@/types/user'
import TagChip from './common/TagChip.vue'
import { computed } from 'vue';
import { Angry,Meh,Smile, Ghost } from '@lucide/vue';

const props = withDefaults(defineProps<{ user: User }>(), {
  user: () => ({
    id: '',
    name: 'Аноним',
    handle: 'user',
    city: '',
    initials: '?',
    stats: { organized: 0, participated: 0, rating: 0 },
    reliability: 0,
    tags: [],
    upcoming: [],
  })
})

const reliability = computed(() => props.user?.reliability ?? 0)

const reliabilityConfig = computed(() => {
  if (reliability.value === 0) return {
    color: 'var(--text3)',
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.07)',
    label: 'Надёжность — ещё не участвовал ни в чём',
    icon: Ghost
  }
  if (reliability.value >= 90) return {
    color: 'var(--mint)',
    bg: 'rgba(6, 214, 160, 0.07)',
    border: 'rgba(6, 214, 160, 0.15)',
    label: 'Надёжность — приходит когда говорит',
    icon: Smile
  }
  if (reliability.value >= 70) return {
    color: 'var(--yellow)',
    bg: 'rgba(245, 158, 11, 0.07)',
    border: 'rgba(245, 158, 11, 0.15)',
    label: 'Надёжность — иногда пропускает',
    icon: Meh
  }
  return {
    color: 'var(--red)',
    bg: 'rgba(239, 68, 68, 0.07)',
    border: 'rgba(239, 68, 68, 0.15)',
    label: 'Низкая надёжность — часто не приходит',
    icon: Angry
  }
})
</script>

<template>
  <div class="profile-block">
    <div class="profile-top">
      <div class="profile-avatar">{{ props.user?.initials ?? '?' }}</div>
      <div>
        <div class="profile-name">{{ props.user?.name ?? 'Аноним' }}</div>
        <div class="profile-handle">@{{ props.user?.handle ?? 'user' }} · {{ props.user?.city ?? '' }}</div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-num">{{ props.user?.stats?.organized ?? 0 }}</div>
        <div class="stat-label">Организовал</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ props.user?.stats?.participated ?? 0 }}</div>
        <div class="stat-label">Участвовал</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ props.user?.stats?.rating ?? 0 }}</div>
        <div class="stat-label">Рейтинг</div>
      </div>
    </div>

    <div class="reliability" :style="{
      background: reliabilityConfig.bg,
      borderColor: reliabilityConfig.border
    }">
    <component
      :is="reliabilityConfig.icon"
      :size="14"
      :style="{ color: reliabilityConfig.color, flexShrink: 0 }"
    />
      <span class="reliability-label">{{ reliabilityConfig.label }}</span>
      <span class="reliability-value" :style="{ color: reliabilityConfig.color }">
        {{ reliability }}%
      </span>
    </div>
  </div>

  <div class="section-title" style="margin-top:16px">
    Мои теги <a>+ Добавить</a>
  </div>
  <div class="my-tags">
  <div class="my-tags">
    <template v-if="props.user?.tags?.length">
      <TagChip
        v-for="tag in props.user.tags"
        :key="tag"
        :label="tag"
        variant="my"
      />
    </template>
    <span v-else class="section-text">У вас пока нет тегов {{ ':(' }}</span>
  </div>
  </div>
</template>