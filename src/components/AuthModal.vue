<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { computed } from 'vue'
import { User } from '@lucide/vue'
import type { RegisterPayload } from '@/types/auth'

const emit = defineEmits<{
  submit: [values:RegisterPayload]
  close: []
  switch: []
}>()
const props = defineProps<{ mode?: 'login' | 'register' }>()

const passwordRules = z.string()
  .min(1, 'Поле не может быть пустым')
  .min(8, 'Минимум 8 символов')
  .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
  .regex(/[0-9]/, 'Нужна хотя бы одна цифра');

const loginSchema = z.object({
  email: z.string().min(1, 'Поле не может быть пустым').email('Некорректный email'),
  password: z.string().min(1, 'Поле не может быть пустым'),
})

const registerSchema = z.object({
  email: z.string()
    .min(1, 'Поле не может быть пустым')
    .email('Некорректный email'),
  password: passwordRules,
  
  username: z.string()
    .trim() 
    .min(1, 'Поле не может быть пустым')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только лат. буквы, цифры и подчеркивание (_)'),
    
  confirm: z.string()
    .min(1, 'Поле не может быть пустым'),
}).refine(data => data.password === data.confirm, {
  message: 'Пароли не совпадают',
  path: ['confirm'],
})

const schema = computed(() =>
  toTypedSchema(props.mode === 'login' ? loginSchema : registerSchema)
)

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: computed(() =>
    props.mode === 'login'
      ? { email: '', password: '' }
      : { email: '', password: '', username: '', }
  )
})

const { value: email, handleBlur: blurEmail } = useField('email')
const { value: username, handleBlur: blurUsename } = useField('username')
const { value: password, handleBlur: blurPassword } = useField('password')
const { value: confirm, handleBlur: blurConfirm } = useField('confirm')

const submitForm = handleSubmit((values) => {
  // Вытаскиваем confirm отдельно, а всё остальное собираем в объект payload
  const { confirm, ...payload } = values;

  console.log('Готовый payload без confirm:', payload); 
  
  // Отправляем чистый payload
  emit('submit', payload as RegisterPayload);
}, (errors) => {
  console.log('validation errors', errors);
});
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
          {{ props.mode === 'login' ? 'Войдите чтобы участвовать в активностях' : 'Зарегистрируйтесь чтобы начать' }}
        </div>
      </div>
  
      <div class="modal-fields">
        <div class="field">
          <label class="field-label">Email</label>
          <div class="field-input" :class="{ 'field-input--error': errors.email }">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input v-model="email" type="email" placeholder="your@email.com" @blur="blurEmail" />
          </div>
          <span class="field-error" v-if="errors.email">{{ errors.email }}</span>
        </div>
        <div class="field" v-if="props.mode === 'register'">
          <label class="field-label">Username</label>
          <div class="field-input" :class="{ 'field-input--error': errors.username }">
           <User :size="14" />
            <input v-model="username" type="test" placeholder="Username" @blur="blurUsename" />
          </div>
          <span class="field-error" v-if="errors.username">{{ errors.username }}</span>
        </div>
        <div class="field">
          <label class="field-label">Пароль</label>
          <div class="field-input" :class="{ 'field-input--error': errors.password }">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input v-model="password" type="password" placeholder="••••••••" @blur="blurPassword" />
          </div>
          <span class="field-error" v-if="errors.password">{{ errors.password }}</span>
        </div>
  
        <div class="field" v-if="props.mode === 'register'">
          <label class="field-label">Повторить пароль</label>
          <div class="field-input" :class="{ 'field-input--error': errors.confirm }">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input v-model="confirm" type="password" placeholder="••••••••" @blur="blurConfirm" />
          </div>
          <span class="field-error" v-if="errors.confirm">{{ errors.confirm }}</span>
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

