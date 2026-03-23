<script setup lang="ts">
import { ref } from 'vue'

const activeItem = ref('feed')

const navItems = [
  { id: 'feed',         title: 'Лента' },
  { id: 'activities',   title: 'Мои активности' },
  { id: 'chats',        title: 'Чаты' },
  { id: 'notifications',title: 'Уведомления', hasNotif: true },
]
</script>

<template>
  <nav class="sidebar">
    <div class="logo">H</div>

    <div
      v-for="item in navItems"
      :key="item.id"
      class="nav-item"
      :class="{ active: activeItem === item.id }"
      :title="item.title"
      @click="activeItem = item.id"
    >
      <slot :name="item.id" />
      <div v-if="item.hasNotif" class="notif-dot" />
    </div>

    <div class="nav-spacer" />

    <div class="nav-item" title="Настройки">
      <slot name="settings" />
    </div>

    <div class="avatar-nav">
      <slot name="avatar">A</slot>
    </div>
  </nav>
</template>