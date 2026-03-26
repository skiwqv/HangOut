<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { LayoutGrid, Menu, MessageSquare, Bell } from '@lucide/vue'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import UserProfile from '@/components/UserProfile.vue'
import UpcomingItem from '@/components/UpcomingItem.vue'
import TelegramBanner from '@/components/TelegramBanner.vue'
import LoginForm from '@/components/LoginForm.vue'
import AuthModal from '@/components/AuthModal.vue'
import {NAV_ITEMS} from '@/config/navigation.ts'

import type { NavItem } from '@/types/nav'
import type { RegisterPayload, LoginPayload } from '@/types/auth'

const authStore = useAuthStore()

const activeId = ref('feed')

const currentUser = computed(() => authStore.user)

const visibleItems = computed(() => {
  return NAV_ITEMS.filter(item => {
    if (item.requiresAuth && !currentUser.value) return false
    return true
  })
})

const handleAuth = async (payload: LoginPayload | RegisterPayload) => {
  if (authStore.authModalMode === 'login') {
    await authStore.login(payload as LoginPayload)
  } else {
    await authStore.register(payload as RegisterPayload)
  }
}

const toggleAuthMode = () => {
  const newMode = authStore.authModalMode === 'login' ? 'register' : 'login'
  authStore.setModal(newMode)
}
</script>

<template>
  <div class="glow-purple" />
  
  <div>
    <AppSidebar v-model="activeId" :items="visibleItems" />
    
    <div class="main">
      <slot />

      <div class="right-col" v-if="currentUser">
        <UserProfile :user="currentUser" />
        <div class="section-title">Скоро у меня <a>Все →</a></div>
        <template v-if="currentUser?.upcoming?.length">
          <UpcomingItem v-for="item in currentUser.upcoming" :key="item.id" :item="item" />
        </template>
        <span v-else class="section-text">Пока нет запланированных активностей {{ ':(' }}</span>
        <TelegramBanner />
      </div>
      
      <div class="right-col" v-else>
        <LoginForm
          @login="authStore.setModal('login')" 
          @register="authStore.setModal('register')"
        />
      </div>
      
      <Transition name="modal">
        <AuthModal
          v-if="authStore.authModalMode !== 'closed'"
          :mode="authStore.authModalMode"
          @submit="handleAuth" 
          @close="authStore.setModal('closed')"
          @switch="toggleAuthMode"
        />   
      </Transition>
    </div>
  </div>
</template>