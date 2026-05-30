<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import ActivityForm from '@/components/activity/ActivityForm.vue'
import type { Activity } from '@/types/activity'
const router = useRouter()
const activityStore = useActivityStore()

const createActivity = async (data: Activity) => {
  try {
    await activityStore.createActivity(data)
    
    router.push('/')
  } catch (error) {
    console.error('Ошибка при создании активности:', error)
  }
}

const routeToCreate = () => {
  router.push('/create')
}
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
      <ActivityForm mode="create" @submit="createActivity" />
    </div>
  </MainLayout>
</template>