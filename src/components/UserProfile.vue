<script setup lang="ts">
import type { User } from '@/types/user'
import TagChip from './common/TagChip.vue'
import { computed } from 'vue';
import { getReliabilityConfig } from '@/utils/reliability'

const props = withDefaults(defineProps<{ user: User }>(), {
  user: () => ({
    id: 0,
    username: 'Аноним',
    email: '',
    bio: '',
    banner: '',
    avatar:'',
    stats: { organized: 0, participated: 0, rating: 0 },
    reliability: 0,
    tags: [],
    upcoming: [],
  })
})

const reliability = computed(() => props.user?.reliability ?? 0)

const reliabilityConfig = computed(() => getReliabilityConfig(reliability.value))
</script>

<template>
  <div class="profile-block"
  :class="{ 'profile-block--with-banner': user?.banner }"
  :style="user?.banner ? { '--user-banner': `url(${user.banner})` } : {}"
  >
    <div class="profile-top">
      <div class="profile-avatar" v-if="props.user?.avatar">
        <img :src="props.user?.avatar" :alt="props.user?.username" />
      </div>
      <div class="profile-avatar" v-else>
        ?
      </div>
      <div>
        <div class="profile-name">{{ props.user?.username ?? 'Аноним' }}</div>
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