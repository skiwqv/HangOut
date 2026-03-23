<script setup lang="ts">
const emit = defineEmits<{
  login: []
  register: []
}>()
</script>

<template>
  <div class="profile-block">
    <div class="guest-avatar">
      <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>

    <div class="guest-text">
      <div class="profile-name">Вы не авторизованы</div>
      <div class="profile-handle">Войдите чтобы участвовать в активностях</div>
    </div>

    <div class="guest-actions">
      <button class="btn-create" style="width:100%; justify-content:center;" @click="emit('login')">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        Войти
      </button>
      <button class="btn-register" @click="emit('register')">
        Зарегистрироваться
      </button>
    </div>

    <div class="guest-hint">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:var(--purple2);flex-shrink:0">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4m0 4h.01"/>
      </svg>
      <span>После входа вы сможете вступать в активности и создавать свои</span>
    </div>
  </div>
</template>