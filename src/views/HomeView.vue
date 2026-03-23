<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import TagsFilter from '@/components/TagsFilter.vue'
import ActivityCard from '@/components/ActivityCard.vue'
import UserProfile from '@/components/UserProfile.vue'
import UpcomingItem from '@/components/UpcomingItem.vue'
import TelegramBanner from '@/components/TelegramBanner.vue'
import LoginForm from '@/components/LoginForm.vue'
import AuthModal from '@/components/AuthModal.vue'
import type { Activity } from '@/types/activity'
import type { User } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const activeTag = ref('✦ Все')
const filterTags = ['✦ Все', '🎮 Игры', '🏃 Спорт', '🎲 Настолки', '🎬 Кино', '🍕 Еда', '🎵 Музыка']

const authModal = ref<'closed' | 'login' | 'register'>('closed')

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

async function handleLogin(email: string, password: string) {
  console.log('data Login', email, password);
  authModal.value = 'closed'
}

async function handleRegister(email: string, password: string) {
  // await authStore.register(email, password)
  console.log('data Login', email, password);
  authModal.value = 'closed'
}


const currentUser: User = {
  id: '1',
  name: 'Алексей',
  handle: 'alexdev',
  city: 'Харьков',
  initials: 'A',
  stats: { organized: 12, participated: 34, rating: 4.8 },
  reliability: 97,
  tags: ['#minecraft', '#valorant', '#настолки', '#cs2', '#спорт'],
  upcoming: [
    {
      id: '1',
      title: 'Minecraft с Alex',
      emoji: '⛏️',
      iconBg: 'rgba(124,58,237,0.15)',
      dotColor: 'var(--mint)',
      datetime: 'Сегодня в 20:00',
      format: 'online',
    },
    {
      id: '2',
      title: 'Настолки в антикафе',
      emoji: '🎲',
      iconBg: 'rgba(245,158,11,0.15)',
      dotColor: 'var(--yellow)',
      datetime: 'Суббота в 15:00',
      format: 'offline',
    },
  ],
}
</script>

<template>
  <div class="glow-purple" />
  
  <MainLayout>
    <template #sidebar>
      <AppSidebar>
        <!-- SVG иконки через слоты -->
        <template #feed>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </template>
        <template #activities>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </template>   
        <template #chats>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </template>  
        <template #notifications>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </template>
        <template #settings>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </template>                              
      </AppSidebar>
    </template>
  
    <!-- Feed -->
    <div class="feed-col">
      <FeedHeader @create="() => {}" />
      <TagsFilter :tags="filterTags" :active="activeTag" @update="activeTag = $event" />
      <div class="section-label">🔥 Сейчас горячее</div>
      <div class="cards-grid">
        <ActivityCard v-for="a in activities" :key="a.id" :activity="a" />
      </div>
    </div>
  
    <!-- Right panel -->
    <div class="right-col" v-if="currentUser">
      <UserProfile :user="currentUser" />
      <div class="section-title">Скоро у меня <a>Все →</a></div>
      <UpcomingItem v-for="item in currentUser.upcoming" :key="item.id" :item="item" />
      <TelegramBanner />
    </div>
    <div class="right-col" v-else>
      <LoginForm
        @login="authModal = 'login'"
        @register="authModal = 'register'"
      />
    </div>
    <AuthModal
      v-if="authModal !== 'closed'"
      :mode="authModal"
      @submit="(email, password) => authModal === 'login' ? handleLogin(email, password) : handleRegister(email, password)"
      @close="authModal = 'closed'"
      @switch="authModal = authModal === 'login' ? 'register' : 'login'"
    />    
  </MainLayout>
</template>