<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits<{
  submit: [email: string, password: string]
  close: []
  switch: []
}>()
const props = defineProps<{ mode?: 'login' | 'register' }>()

const email = ref('')
const password = ref('')

const submitForm = () => {
    emit('submit', email.value, password.value)
}
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal">
    
            <button class="modal-close" @click="emit('close')">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>
    
            <div class="modal-header">
                <div class="modal-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>
                <div class="modal-title">
                    {{ props.mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт' }}
                </div>
                <div class="modal-subtitle">
                    {{ props.mode === 'login' ? 'Войдите чтобы участвовать в активностях' : 'Зарегистрируйтесь чтобы начать'
                    }}
                </div>
            </div>
    
            <div class="modal-fields">
                <div class="field">
                    <label class="field-label">Email</label>
                    <div class="field-input">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input v-model="email" type="email" placeholder="your@email.com" />
                    </div>
                </div>
    
                <div class="field">
                    <label class="field-label">Пароль</label>
                    <div class="field-input">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input v-model="password" type="password" placeholder="••••••••" />
                    </div>
                </div>
                <div class="field" v-if="props.mode === 'register'">
                    <label class="field-label">Повторить Пароль</label>
                    <div class="field-input">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input type="password" placeholder="••••••••" />
                    </div>
                </div>
            </div>
    
            <button class="btn-create" style="width:100%; justify-content:center;" @click="submitForm">
                {{ props.mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
            </button>
    
            <div class="modal-switch">
                {{ props.mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
                <span @click="emit('switch')">
                    {{ props.mode === 'login' ? 'Зарегистрироваться' : 'Войти' }}
                </span>
            </div>
    
        </div>
    </div>
</template>