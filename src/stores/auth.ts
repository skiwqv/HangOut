import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User } from '@/types/user'
import type { RegisterPayload, LoginPayload } from '@/types/auth'
import { useRouter } from 'vue-router'
import { useToastStore } from './toasts'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<User | null>(null)
  const router = useRouter()
  const authModalMode = ref<'closed' | 'login' | 'register'>('closed')
  const toastStore = useToastStore()

  const isLoggedIn = computed(() => !!token.value)

  
  function setModal(mode: 'login' | 'register' | 'closed') {
    authModalMode.value = mode
  }

  async function login(payload: LoginPayload) {
    const { data } = await authApi.login(payload)
    token.value = data.access_token
    localStorage.setItem('access_token', data.access_token)
    
    await getUser()
    setModal('closed') 
    toastStore.success('Вы успешно вошли')
  }

  async function register(payload: RegisterPayload) {
    await authApi.register(payload)
    
    await getUser()
    setModal('closed')
    toastStore.success('Вы успешно зарегистрировались')
  }
  
  async function getUser() {
    try {
      const { data } = await authApi.me()
      user.value = data
    } catch (err) {
      logout()
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('access_token')
      router.push('/')
      authModalMode.value = 'closed'
      toastStore.success('Вы успешно вышли')
    }
  }
  
  return { 
    token, user, authModalMode, isLoggedIn, 
    login, register, logout, getUser, setModal 
  }
})