<script setup lang="ts">
import { Clock, MapPin } from '@lucide/vue'
import type { Activity, Category } from '@/types/activity'
import BadgeType from './common/BadgeType.vue'
import AvatarGroup from './common/AvatarGroup.vue'
import SeatsBar from './common/SeatsBar.vue'
import TagChip from './common/TagChip.vue'
import BaseButton from './common/BaseButton.vue'


import { formatToHumanDate } from '@/utils/dateFormat'
const props = defineProps<{ activity: Activity, category: Category | null, isOrganizer: boolean }>()

const isFull = props.activity.current_members >= props.activity.max_members
const btnLabel = props.activity.type === 'close'
  ? 'Подать заявку →'
  : isFull
    ? 'Мест нет'
    : 'Хочу пойти →'
</script>

<template>
  <div class="card" :style="isFull ? { opacity: 0.6 } : {}">

    <div class="card-cover">
      <img v-if="props.category?.image" :src="props.category.image" :alt="props.category.name" />
      <div v-else class="card-cover-placeholder">{{ props.category?.name }}</div>
      <div class="card-cover-gradient" />
      <BadgeType :format="activity.format" />
      <div v-if="activity.type === 'close'" class="badge-closed">
        🔒 По заявке
      </div>
      <div  class="badge-closed badge-category">
          {{ props.category?.name}}
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <div class="card-title">{{ activity.title }}</div>

      <div class="card-meta">
        <div class="meta-item">
          <Clock :size="13" />
          {{ formatToHumanDate(activity.date) }}
        </div>
        <div v-if="activity.location" class="meta-item">
          <div class="dot" />
        </div>
        <div v-if="activity.location" class="meta-item">
          <MapPin :size="13" />
          {{ activity.location }}
        </div>
        <AvatarGroup
          v-else
          :participants="activity.participants"
          :count="activity.current_members"
        />
      </div>

      <SeatsBar :taken="activity.current_members" :total="activity.max_members" />

      <div class="card-tags">
        <TagChip
          v-for="tag in activity.tags"
          :key="tag"
          :label="tag"
          variant="card"
        />
      </div>

      <div class="card-footer">
        <div class="organizer">
            <div class="profile-avatar" v-if="activity.creator.avatar_url">
              <img :src="activity.creator.avatar_url" :alt="activity.creator.username" />
            </div>
            <div class="profile-avatar" v-else>
              ?
            </div>
          <span class="organizer-name">{{ activity.creator.username }}</span> 
        </div>
        <BaseButton :variant="isFull ? 'disabled' : 'ghost'" :disabled="isFull" v-if="!isOrganizer">
          {{ btnLabel }}
        </BaseButton>
      </div>
    </div>

  </div>
</template>