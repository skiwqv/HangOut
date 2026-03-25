<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue';

const authStore = useAuthStore()

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
</template>
