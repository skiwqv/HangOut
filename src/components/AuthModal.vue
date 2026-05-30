<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { computed } from 'vue'
import { User, X, LogIn, Mail, Lock } from '@lucide/vue'
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
  const { confirm, ...payload } = values;

  
  emit('submit', payload as RegisterPayload);
},);
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
  
      <button class="modal-close" @click="emit('close')">
        <X :size="16" />
      </button>
  
      <div class="modal-header">
        <div class="modal-icon">
          <LogIn :size="18" />
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
            <Mail :size="14" />
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
            <Lock :size="14" />
            <input v-model="password" type="password" placeholder="••••••••" @blur="blurPassword" />
          </div>
          <span class="field-error" v-if="errors.password">{{ errors.password }}</span>
        </div>
  
        <div class="field" v-if="props.mode === 'register'">
          <label class="field-label">Повторить пароль</label>
          <div class="field-input" :class="{ 'field-input--error': errors.confirm }">
            <Lock :size="14" />
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

