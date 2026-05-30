import { profileApi } from './../api/profile';
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import type { updateUserPayload } from '../types/user';
import { useToastStore } from './toasts';
export const useProfileStore = defineStore('profile', () => {
 const authStore = useAuthStore()
 const toastStore = useToastStore()

  async function changeAvatar(avatar: File) {
    const { data } = await profileApi.changeAvatar(avatar)
    if(authStore.user){
        authStore.user.avatar=data.avatar
    }
    
    await authStore.getUser()
  }

  async function changeBanner(banner: File) {
    const { data } = await profileApi.changeBanner(banner)
    if(authStore.user){
        authStore.user.banner=data.banner
    }
    
    await authStore.getUser()
  }

  async function deleteBanner(nullValue: null) {
    await profileApi.changeBanner(nullValue) 
  }

  async function deleteAvatar(nullValue: null) {
    await profileApi.changeAvatar(nullValue) 
  }

  async function updateUser(payload:updateUserPayload) {
    const { data } = await profileApi.updateUser(payload)
    if(authStore.user){
        authStore.user.username=data.username
        authStore.user.email=data.email
        authStore.user.bio=data.bio
    }
    
    await authStore.getUser()
    toastStore.success('Профиль обновлен')
  }

  
  return { 
    changeAvatar,
    updateUser,
    changeBanner,
    deleteBanner,
    deleteAvatar
  }
})