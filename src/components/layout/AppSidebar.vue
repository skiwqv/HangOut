<script setup lang="ts">
import type { NavItem } from '@/types/nav'
import { useAuthStore } from '@/stores/auth';
import { Settings, LogOut } from '@lucide/vue'
import { ref,onMounted, onUnmounted } from 'vue';

defineProps<{
  items: NavItem[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [id: string]
}>()

const authStore = useAuthStore()

const isSettingsOpen = ref(false)
const settingsBtn = ref<HTMLElement | null>(null)

const closeSettings = (e: MouseEvent) => {
  if (isSettingsOpen.value && settingsBtn.value && !settingsBtn.value.contains(e.target as Node)) {
    isSettingsOpen.value = false
  }
}

onMounted(() => window.addEventListener('click', closeSettings))
onUnmounted(() => window.removeEventListener('click', closeSettings))
</script>

<template>
  <nav class="sidebar">
    <div class="logo">H</div>

    <div
      v-for="item in items"
      :key="item.id"
      class="nav-item"
      :class="{ active: modelValue === item.id }"
      :title="item.title"
      @click="emit('update:modelValue', item.id)"
    >
      <component :is="item.icon" :size="20" />
      
      <div v-if="item.hasNotif" class="notif-dot" />
    </div>

    <div class="nav-spacer" />

  <div 
      ref="settingsBtn"
      class="nav-item settings-trigger" 
      :class="{ active: isSettingsOpen }"
      @click.stop="isSettingsOpen = !isSettingsOpen"
      title="Настройки"
      v-if="authStore.token"
    >
      <Settings :size="20" />
      
      <Teleport to="body">
        <Transition name="popover">
          <div v-if="isSettingsOpen" class="settings-popover">
            <div class="popover-header">Настройки</div>
            <div class="popover-content">
              <slot name="settings-menu">
                <div class="menu-item">Профиль</div>
                <div class="menu-item">Тема: Темная</div>
                <div class="menu-item">Язык: RU</div>
                <div class="menu-divider" />
                <div class="menu-item logout" @click="authStore.logout()">Выйти
                  <LogOut :size="13"></LogOut>
                </div>
              </slot>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </nav>
</template>