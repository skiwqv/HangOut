<script setup lang="ts">
import {  computed ,onMounted} from 'vue'
import { useRouter } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import ActivityForm from '@/components/activity/ActivityForm.vue'

import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'

const activityStore = useActivityStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const activity = computed(() => activityStore.activity)

const isOrganizer = computed(() => {
  if (!activity.value || !user.value) return false
  return activity.value.creator.id === user.value.id
})


const router = useRouter()

const routeToCreate = () => {
  router.push('/create')
}
const editActivity = async (data: any) => {
  if (!activity.value) return
  await activityStore.updateActivity(activity.value._id, data)
  router.push(`/activity/${activity.value._id}`)
}
onMounted(async () => {
  await activityStore.getActivityById(router.currentRoute.value.params.id as unknown as number)
  if(!isOrganizer.value) {
    router.push('/')
  }
})
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
      <ActivityForm mode="edit" v-if="activity" :initial-data="activity" @submit="(data) => editActivity(data)" />
    </div>
  </MainLayout>
</template>