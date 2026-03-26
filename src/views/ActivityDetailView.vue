<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'

const router = useRouter()

const routeToCreate = () => {
  router.push('/create')
}
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
      
    </div>
  </MainLayout>
</template>