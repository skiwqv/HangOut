<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import {VueDatePicker} from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const props = defineProps<{
  mode: 'create' | 'edit'
  initialData?: Record<string, any>
}>()

const emit = defineEmits(['submit', 'cancel'])

const activitySchema = toTypedSchema(z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(100, 'Слишком длинное название'),
  format: z.enum(['online', 'offline']),
  access: z.enum(['open', 'approval']),
  date: z.date({ required_error: 'Выберите дату' }),
  time: z.object({ hours: z.number(), minutes: z.number() }),
  location: z.string().optional(),
  seats: z.number().min(2, 'Минимум 2 человека').max(100, 'Максимум 100 человек'),
  tags: z.array(z.string()).max(5, 'Не более 5 тегов')
}))

const { handleSubmit, errors } = useForm({
  validationSchema: activitySchema,
  initialValues: props.initialData || {
    title: '',
    format: 'online',
    access: 'open',
    date: new Date(),
    time: { hours: new Date().getHours(), minutes: new Date().getMinutes() },
    location: '',
    seats: 5,
    tags: [],
  }
})

const { value: title } = useField<string>('title')
const { value: format } = useField<'online' | 'offline'>('format')
const { value: access } = useField<'open' | 'approval'>('access')
const { value: date } = useField<Date>('date')
const { value: time } = useField<{ hours: number; minutes: number }>('time')
const { value: location } = useField<string>('location')
const { value: seats } = useField<number>('seats')
const { value: tags } = useField<string[]>('tags')

const decrementSeats = () => { if (seats.value > 2) seats.value-- }
const incrementSeats = () => { if (seats.value < 100) seats.value++ }

function onTagInput(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement
  const newTag = input.value.trim().toLowerCase()
  
  if (newTag && !tags.value.includes(newTag) && tags.value.length < 5) {
    const cleanTag = newTag.startsWith('#') ? newTag.slice(1) : newTag
    tags.value.push(cleanTag)
    input.value = ''
  }
}

function removeTag(tagToRemove: string) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
}

const onSubmit = handleSubmit((values) => {
  console.log('Готовые данные формы:', values)
  emit('submit', values)
})
</script>

<template>
  <div class="activity-form-page">

    <div class="activity-form-header">
      <div class="activity-form-title">
        {{ mode === 'create' ? 'Создать активность' : 'Редактировать активность' }}
      </div>
      <div class="activity-form-subtitle" v-if="props.mode ==='create'">Заполни детали и найди себе компанию</div>
    </div>

    <form @submit.prevent="onSubmit" class="activity-form">

      <div class="form-section">
        <div class="section-label">Основное</div>

        <div class="form-emoji-title">
          <div class="field" style="flex:1">
            <label class="field-label">Название</label>
            <div class="field-input" :class="{ 'field-input--error': errors.title }">
              <input v-model="title" type="text" placeholder="Например: Строим мегасити в Minecraft" />
            </div>
            <span class="field-error" v-if="errors.title">{{ errors.title }}</span>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Формат</label>
          <div class="form-toggle-grid">
            <div 
              class="form-toggle" 
              :class="{ 'form-toggle--active': format === 'online' }"
              @click="format = 'online'"
            >
              <div class="form-toggle-dot" :class="{ 'form-toggle-dot--active': format === 'online' }" />
              <div>
                <div class="form-toggle-title">Онлайн</div>
                <div class="form-toggle-sub">Встречаемся в сети</div>
              </div>
            </div>
            <div 
              class="form-toggle" 
              :class="{ 'form-toggle--active': format === 'offline' }"
              @click="format = 'offline'"
            >
              <div class="form-toggle-dot" :class="{ 'form-toggle-dot--active': format === 'offline' }" />
              <div>
                <div class="form-toggle-title">Офлайн</div>
                <div class="form-toggle-sub">Встречаемся вживую</div>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Доступ</label>
          <div class="form-toggle-grid">
            <div 
              class="form-toggle" 
              :class="{ 'form-toggle--active': access === 'open' }"
              @click="access = 'open'"
            >
              <span class="form-toggle-emoji">🔓</span>
              <div>
                <div class="form-toggle-title">Открытая</div>
                <div class="form-toggle-sub">Любой может вступить</div>
              </div>
            </div>
            <div 
              class="form-toggle" 
              :class="{ 'form-toggle--active': access === 'approval' }"
              @click="access = 'approval'"
            >
              <span class="form-toggle-emoji">🔒</span>
              <div>
                <div class="form-toggle-title">По заявке</div>
                <div class="form-toggle-sub">Одобряешь участников</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-label">Дата и место</div>

        <div class="form-date-grid">
          <div class="field">
            <label class="field-label">Дата</label>
            <div class="field-input vue-dp-wrapper">
              <VueDatePicker 
                v-model="date" 
                :time-config="{ enableTimePicker: false }"
                :formats="{ input: 'dd.MM.yyyy' }"
                dark
                auto-apply
              />
            </div>
            <span class="field-error" v-if="errors.date">{{ errors.date }}</span>
          </div>

          <div class="field">
            <label class="field-label">Время</label>
            <div class="field-input vue-dp-wrapper">
              <VueDatePicker 
                v-model="time" 
                time-picker 
                dark
                auto-apply
              />
            </div>
          </div>
        </div>

        <div class="field" v-if="format === 'offline'">
          <label class="field-label">Адрес</label>
          <div class="field-input">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <input v-model="location" type="text" placeholder="ул. Сумская, 12" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-label">Участники</div>
        <div class="field">
          <label class="field-label">Максимум мест</label>
          <div class="seats-counter">
            <button type="button" class="seats-btn" @click="decrementSeats">−</button>
            <span class="seats-num">{{ seats }}</span>
            <button type="button" class="seats-btn" @click="incrementSeats">+</button>
            <span class="seats-hint">человек максимум</span>
          </div>
          <span class="field-error" v-if="errors.seats">{{ errors.seats }}</span>
        </div>
      </div>

      <div class="form-section">
        <div class="section-label">Теги (макс. 5)</div>
        <div class="field">
          <div class="field-input" :class="{ 'field-input--error': errors.tags }">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <input 
              type="text" 
              placeholder="Введи тег и нажми Enter..." 
              @keydown.enter.prevent="onTagInput"
              :disabled="tags.length >= 5"
            />
          </div>
          <span class="field-error" v-if="errors.tags">{{ errors.tags }}</span>
        </div>
        
        <div class="card-tags" v-if="tags.length > 0">
          <span 
            v-for="tag in tags" 
            :key="tag" 
            class="tag-chip tag-removable"
          >
            #{{ tag }}
            <span class="tag-remove" @click="removeTag(tag)">✕</span>
          </span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-create" style="flex:1; justify-content:center;">
          {{ mode === 'create' ? 'Опубликовать' : 'Сохранить изменения' }}
        </button>
        <button type="button" class="btn-register btn-sm" @click="emit('cancel')">
          Отмена
        </button>
      </div>

    </form>
  </div>
</template>
