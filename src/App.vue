<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useToastStore } from '@/stores/toasts'

import { onMounted } from 'vue';

const authStore = useAuthStore()
const toastStore = useToastStore()

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.getUser()
    } catch {
      authStore.logout() 
    }
  }
})

</script>

<template>
<router-view />
<ToastContainer :toasts="toastStore.toasts" @close="toastStore.remove" />
</template>
