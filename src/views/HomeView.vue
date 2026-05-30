<script setup lang="ts">
import { ref,onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import TagsFilter from '@/components/TagsFilter.vue'
import ActivityCard from '@/components/ActivityCard.vue'
import {CATEGORIES} from '@/config/category'

const activityStore = useActivityStore()
const authStore = useAuthStore()
const router = useRouter()

const activeTag = ref('✦ Все')
const filterTags = ['✦ Все', '🎮 Игры', '🏃 Спорт', '🎲 Настолки', '🎬 Кино', '🍕 Еда', '🎵 Музыка']

const activities = computed(() => activityStore.activities)

const getCategory = (categoryValue: string) => {
  return CATEGORIES.find(c => c.value === categoryValue) || null;
}

const filteredActivities = computed(() => {
  if (activeTag.value === '✦ Все') return activities.value

  const category = CATEGORIES.find(c => c.name === activeTag.value)
  if (!category) return activities.value

  return activities.value.filter(a => a.category === category.value)
})

const isOrganizer = computed(() => {
  return activities.value.some(activity => activity.creator.id == authStore.user?.id)
})

const routeToCreate = () => {
  router.push('/create')
}
const routeToActivity = (id: number) => {
  router.push(`/activity/${id}`)
}

onMounted(async () => {
  await activityStore.getActivities(10)
})
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
      <TagsFilter :tags="filterTags" :active="activeTag" @update="activeTag = $event" />
      <div class="cards-grid">
        <ActivityCard 
        v-for="a in filteredActivities" 
        :key="a._id" 
        :activity="a" 
        :category="getCategory(a.category)"  
        @click="routeToActivity(a._id)" 
        :is-organizer="isOrganizer"
        />
      </div>
    </div>
  </MainLayout>
</template>