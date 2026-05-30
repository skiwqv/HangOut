<script setup lang="ts">
import { AlertCircle, UserRound, LogIn } from '@lucide/vue';
const emit = defineEmits<{
  login: []
  register: []
}>()
</script>

<template>
  <div class="profile-block">
    <div class="guest-avatar">
      <UserRound :size="22" :stroke-width="1.5" />
    </div>

    <div class="guest-text">
      <div class="profile-name">Вы не авторизованы</div>
      <div class="profile-handle">Войдите чтобы участвовать в активностях</div>
    </div>

    <div class="guest-actions">
      <button class="btn-create" style="width:100%; justify-content:center;" @click="emit('login')">
        <LogIn :size="14" :stroke-width="2.5" />
        Войти
      </button>
      <button class="btn-register" @click="emit('register')">
        Зарегистрироваться
      </button>
    </div>

    <div class="guest-hint">
      <AlertCircle :size="32" color="var(--purple)" />
      <span>После входа вы сможете вступать в активности и создавать свои</span>
    </div>
  </div>
</template>