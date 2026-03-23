<script setup lang="ts">
import type { Activity } from '@/types/activity'
import BadgeType from './common/BadgeType.vue'
import AvatarGroup from './common/AvatarGroup.vue'
import SeatsBar from './common/SeatsBar.vue'
import TagChip from './common/TagChip.vue'
import BaseAvatar from './common/BaseAvatar.vue'
import BaseButton from './common/BaseButton.vue'

const props = defineProps<{ activity: Activity }>()

const isFull = props.activity.seats.taken >= props.activity.seats.total
const btnLabel = props.activity.access === 'request'
  ? 'Подать заявку →'
  : isFull
    ? 'Мест нет'
    : 'Хочу пойти →'
</script>

<template>
  <div class="card" :style="isFull ? { opacity: 0.6 } : {}">

    <!-- Cover -->
    <div class="card-cover" :style="{ background: activity.coverGradient }">
      <div class="card-cover-placeholder">{{ activity.emoji }}</div>
      <div class="card-cover-gradient" />
      <BadgeType :format="activity.format" />
      <div v-if="activity.access === 'request'" class="badge-closed">
        🔒 По заявке
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <div class="card-title">{{ activity.title }}</div>

      <div class="card-meta">
        <div class="meta-item">
          <!-- clock icon -->
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          {{ activity.datetime }}
        </div>
        <div v-if="activity.location" class="meta-item">
          <div class="dot" />
        </div>
        <div v-if="activity.location" class="meta-item">
          <!-- pin icon -->
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {{ activity.location }}
        </div>
        <AvatarGroup
          v-else
          :participants="activity.participants"
          :count="activity.seats.taken"
        />
      </div>

      <SeatsBar :taken="activity.seats.taken" :total="activity.seats.total" />

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
          <BaseAvatar
            :initials="activity.organizer.initials"
            :gradient="activity.organizer.gradient"
            size="md"
          />
          <span class="organizer-name">{{ activity.organizer.handle }}</span>
        </div>
        <BaseButton :variant="isFull ? 'disabled' : 'ghost'" :disabled="isFull">
          {{ btnLabel }}
        </BaseButton>
      </div>
    </div>

  </div>
</template>