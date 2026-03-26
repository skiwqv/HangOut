<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import TagsFilter from '@/components/TagsFilter.vue'
import ActivityCard from '@/components/ActivityCard.vue'

import type { Activity } from '@/types/activity'

const router = useRouter()

const activeTag = ref('✦ Все')
const filterTags = ['✦ Все', '🎮 Игры', '🏃 Спорт', '🎲 Настолки', '🎬 Кино', '🍕 Еда', '🎵 Музыка']

const activities: Activity[] = [
  {
    id: '1',
    title: 'Строим мегасити в Minecraft — нужны архитекторы!',
    format: 'online',
    emoji: '⛏️',
    coverGradient: 'linear-gradient(135deg, #2d5a27, #4a7c59)',
    datetime: 'Сегодня, 20:00',
    seats: { taken: 3, total: 5 },
    tags: ['#minecraft', '#выживание', '#строительство', '#java'],
    organizer: { handle: '@alexdev', initials: 'A', gradient: 'linear-gradient(135deg,#7c3aed,#06d6a0)' },
    participants: [
      { id: '1', initials: 'A', gradient: 'linear-gradient(135deg,#7c3aed,#06d6a0)' },
      { id: '2', initials: 'K', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { id: '3', initials: 'M', gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
    ],
  },
  {
    id: '2',
    title: 'Valorant 5×5 — ищем 5го, рейтинг Gold+',
    format: 'online',
    access: 'request',
    emoji: '🎯',
    coverGradient: 'linear-gradient(135deg, #1a0a2e, #3d1a5e)',
    datetime: 'Сегодня, 22:00',
    seats: { taken: 4, total: 5 },
    tags: ['#valorant', '#gold', '#ranked'],
    organizer: { handle: '@sniper_s', initials: 'S', gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)' },
    participants: [
      { id: '1', initials: 'S', gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)' },
      { id: '2', initials: 'P', gradient: 'linear-gradient(135deg,#3b82f6,#06d6a0)' },
      { id: '3', initials: 'N', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
      { id: '4', initials: 'D', gradient: 'linear-gradient(135deg,#10b981,#3b82f6)' },
    ],
  },
  {
    id: '3',
    title: 'Настолки в антикафе — Catan, Pandemic, Uno 🎲',
    format: 'offline',
    emoji: '🎲',
    coverGradient: 'linear-gradient(135deg, #1c1a0a, #3d3510)',
    datetime: 'Суббота, 15:00',
    location: 'ул. Сумская, 12',
    seats: { taken: 3, total: 10 },
    tags: ['#настолки', '#catan', '#офлайн', '#харьков'],
    organizer: { handle: '@kate_games', initials: 'K', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    participants: [],
  },
  {
    id: '4',
    title: 'Пинг-понг турнир в парке — новички welcome',
    format: 'offline',
    emoji: '🏓',
    coverGradient: 'linear-gradient(135deg, #0a1a2e, #0f3460)',
    datetime: 'Воскресенье, 11:00',
    seats: { taken: 8, total: 8 },
    tags: ['#теннис', '#спорт'],
    organizer: { handle: '@max_sport', initials: 'M', gradient: 'linear-gradient(135deg,#3b82f6,#06d6a0)' },
    participants: [],
  },
]

const routeToCreate = () => {
  router.push('/create')
}
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
      <TagsFilter :tags="filterTags" :active="activeTag" @update="activeTag = $event" />
      <div class="section-label">🔥 Сейчас горячее</div>
      <div class="cards-grid">
        <ActivityCard v-for="a in activities" :key="a.id" :activity="a" />
      </div>
    </div>
  </MainLayout>
</template>