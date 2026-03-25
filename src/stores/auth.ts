import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import type { User } from '@/types/user'
import type { RegisterPayload, LoginPayload } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  
  const user = ref<User | null>(null)

  async function login(payload:LoginPayload) {
    const { data } = await authApi.login(payload)
    token.value = data.access_token
    localStorage.setItem('access_token', data.access_token)
    
    const { data: userData } = await authApi.me()
    user.value = userData
  }

  async function register(payload:RegisterPayload) {
    const { data } = await authApi.register(payload )
    console.log('AuthStore data', data);
  }
  
  async function getUser() {
    const { data } = await authApi.me()
    user.value = data
    console.log('AuthStore data user ME!!!', data);    
  }

  async function logout() {
    await authApi.logout()
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
  }
  
  return { token, user, login, register, logout,getUser }
})
