import { activityApi } from './../api/activity';
import { defineStore } from 'pinia'
import { useAuthStore } from './auth';
import type { Activity } from '../types/activity';
import { ref,computed } from 'vue';
import { useToastStore } from './toasts';
export const useActivityStore = defineStore('activity', () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const activities = ref<Activity[]>([])
  const activity = ref<Activity | null>(null)
  async function createActivity(payload: Activity) {
    await activityApi.createActivity(payload)
    toastStore.success('Активность создана')
  }
  const isOrganizer = computed(() => {
    if (!activity.value || !authStore.user) return false
    return activity.value.creator.id === authStore.user.id
  },)
  async function getActivities(limit: number) {
    const {data} = await activityApi.getActivities(limit)
    activities.value = data.items
  }

  async function getActivityById(id: number) {
    const {data} = await activityApi.getActivityById(id)
    activity.value = data
  }

  async function updateActivity(id: number, payload: Activity) {
    await activityApi.updateActivity(id, payload)
    toastStore.success('Активность обновлена')
  }
  async function deleteActivity(id: string) {
    await activityApi.deleteActivity(id)
    toastStore.success('Активность удалена')
  }
  return { 
  createActivity,
  getActivities,
  activities,
  getActivityById,
  activity,
  updateActivity,
  deleteActivity,
  isOrganizer
  }
})