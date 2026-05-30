<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { autoResize } from '@/utils/autoResize'
import { Multiselect } from 'vue-multiselect'
import { CATEGORIES } from '@/config/category'
import { MapPin, Tag } from '@lucide/vue'
import { platforms } from '@/config/platform'

const props = defineProps<{
  mode: 'create' | 'edit'
  initialData?: Record<string, any>
}>()

const emit = defineEmits(['submit', 'cancel'])

const activitySchema = toTypedSchema(
  z.object({
    title: z.string().min(3, 'Минимум 3 символа').max(100, 'Слишком длинное название'),
    format: z.enum(['online', 'offline']),
    type: z.enum(['open', 'close']),
    date: z.date({ required_error: 'Выберите дату' }),
    time: z.object({ hours: z.number(), minutes: z.number() }),
    
    // 1. Убираем .min() и делаем поле опциональным, чтобы оно не ругалось при 'online'
    location: z.string().max(100, 'Слишком длинное название').optional(),
    
    max_members: z.number().min(2, 'Минимум 2 человека').max(100, 'Максимум 100 человек'),
    tags: z.array(
    z.string()
      .regex(/^[a-zA-Z]+$/, 'Разрешены только английские буквы')
    )
    .max(5, 'Не более 5 тегов'),
    category: z.object({
      value: z.string(),
      name: z.string()
    }).nullable().refine(val => val !== null, 'Выберите категорию'),
    description: z.string().max(500, 'Описание слишком длинное').optional(),
    game: z.object({
      value: z.string(),
      name: z.string()
    }).nullable().optional(),
    platform:z.object({
      value: z.string(),
      name: z.string()
    }).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.format === 'offline') {
      if (!data.location || data.location.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['location'],
          message: 'Минимум 2 символа'
        });
      }
    }
  })
)


const getDefaultValues = () => ({
  title: '',
  format: 'online' as 'online' | 'offline',
  type: 'open' as 'open' | 'close',
  date: new Date(),
  time: { hours: new Date().getHours(), minutes: new Date().getMinutes() },
  location: '',
  max_members: 5,
  tags: [],
  category: null,
  game: null,
  platform:null,
  description: ''
})

const getInitialValues = () => {
  if (!props.initialData || props.mode === 'create') {
    return getDefaultValues()
  }

  const data = props.initialData

  const parsedDate = data.date ? new Date(data.date) : new Date()

  return {
    ...getDefaultValues(), 
    ...data,
    date: parsedDate,
    time: { hours: parsedDate.getHours(), minutes: parsedDate.getMinutes() },
    
    category: CATEGORIES.find(c => c.value === data.category) || null,
    game: CATEGORIES.find(c => c.value === (data.extra_data?.game_name || data.game)) || null,
    platform: platforms.find(p => p.value === (data.extra_data?.platform || data.platform)) || null,
  }
}

const { handleSubmit, errors } = useForm({
  validationSchema: activitySchema,
  initialValues: getInitialValues()
})


const { value: title } = useField<string>('title')
const { value: format } = useField<'online' | 'offline'>('format')
const { value: type } = useField<'open' | 'close'>('type')
const { value: date } = useField<Date>('date')
const { value: time } = useField<{ hours: number; minutes: number }>('time')
const { value: location } = useField<string>('location')
const { value: max_members } = useField<number>('max_members')
const { value: tags } = useField<string[]>('tags')
const { value: category } = useField<any>('category')
const { value: description } = useField<string>('description')
const { value: game } = useField<any>('game')
const {value:platform} = useField<string>('platform')

const tagInputError = ref('')

const decrementSeats = () => { if (max_members.value > 2) max_members.value-- }
const incrementSeats = () => { if (max_members.value < 20) max_members.value++ }

function onTagInput(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement
  const newTag = input.value.trim().toLowerCase()
  
  if (newTag && !tags.value.includes(newTag) && tags.value.length < 5) {
    const cleanTag = newTag.startsWith('#') ? newTag.slice(1) : newTag
    
    // Double check it contains only English letters
    if (/^[a-z]+$/.test(cleanTag)) {
      tags.value.push(cleanTag)
      input.value = ''
      tagInputError.value = ''
    }
  }
}

function onTagType(event: Event) {
  const input = event.target as HTMLInputElement
  const originalValue = input.value
  const cleanValue = originalValue.replace(/[^a-zA-Z]/g, '')
  
  if (originalValue !== cleanValue) {
    tagInputError.value = 'Разрешены только английские буквы'
  } else {
    tagInputError.value = ''
  }
  
  input.value = cleanValue
}

function removeTag(tagToRemove: string) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
}

const onSubmit = handleSubmit((values) => {
  const finalDateTime = new Date(values.date);
  finalDateTime.setHours(values.time.hours, values.time.minutes, 0, 0);

  const payload: Record<string, any> = {
    ...values,
    category: values.category?.value, 
    date: finalDateTime.toISOString(),
    extra_data: {
      category: values.category?.value,
    }
  };

  if (values.category?.value === 'games') {
    payload.extra_data.game_name = values.game?.value;
    payload.extra_data.platform = values.platform?.value;
  }

  delete payload.time;
  delete payload.game;
  delete payload.platform;
  emit('submit', payload);
});
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
        <div  class="field" style="margin-top:12px">
            <label class="field-label">Описание</label>
            <textarea
              v-model="description"
              class="profile-bio-textarea"
              placeholder="Описание активности (макс. 500 символов)"
              @input="autoResize"
            />
            <span class="field-error" v-if="errors.description">{{ errors.description }}</span>
          </div>
          <div class="field" style="flex:1">
            <label class="field-label">Категория</label>
            <div class="field-input" :class="{ 'field-input--error': errors.category }">
              <Multiselect
                v-model="category"
                :options="CATEGORIES"
                label="name"
                track-by="value"
                :placeholder="'Выберите категорию'"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
              />
            </div>
            <span class="field-error" v-if="errors.category">{{ errors.category }}</span>
          </div>
          <div class="field" style="flex:1" v-if="category?.value === 'games'">
            <label class="field-label">Игры</label>
            <div class="field-input" :class="{ 'field-input--error': errors.game }">
              <Multiselect
                v-model="game"
                :options="CATEGORIES"
                label="name"
                track-by="value"
                :placeholder="'Выберите Игру'"
                :searchable="true"
                :close-on-select="true"
                :show-labels="false"
              />
            </div>
            <span class="field-error" v-if="errors.game">{{ errors.game }}</span>
          </div>
          <div class="field" style="flex:1" v-if="category?.value === 'games'">
            <label class="field-label">Платформа</label>
            <div class="field-input" :class="{ 'field-input--error': errors.platform }">
              <Multiselect
                v-model="platform"
                :options="platforms"
                label="name"
                track-by="value"
                :placeholder="'Выберите Игру'"
                :searchable="true"
                :close-on-select="true"
                :show-labels="false"
              />
            </div>
            <span class="field-error" v-if="errors.platform">{{ errors.platform }}</span>
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
              :class="{ 'form-toggle--active': type === 'open' }"
              @click="type = 'open'"
            >
              <span class="form-toggle-emoji">🔓</span>
              <div>
                <div class="form-toggle-title">Открытая</div>
                <div class="form-toggle-sub">Любой может вступить</div>
              </div>
            </div>
            <div 
              class="form-toggle" 
              :class="{ 'form-toggle--active': type === 'close' }"
              @click="type = 'close'"
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
                :min-date="new Date()"
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
          <div class="field-input" :class="{ 'field-input--error': errors.location }">
            <MapPin :size="14" />
            <input v-model="location" type="text" placeholder="ул. Сумская, 12" />
          </div>
          <span class="field-error" v-if="errors.location">{{ errors.location }}</span>
        </div>
      </div>

      <div class="form-section">
        <div class="section-label">Участники</div>
        <div class="field">
          <label class="field-label">Максимум мест</label>
          <div class="seats-counter">
            <button type="button" class="seats-btn" @click="decrementSeats">−</button>
            <span class="seats-num">{{ max_members }}</span>
            <button type="button" class="seats-btn" @click="incrementSeats">+</button>
            <span class="seats-hint">человек максимум</span>
          </div>
          <span class="field-error" v-if="errors.max_members">{{ errors.max_members }}</span>
        </div>
      </div>

      <div class="form-section">
        <div class="section-label">Теги (макс. 5)</div>
        <div class="field">
          <div class="field-input" :class="{ 'field-input--error': errors.tags || tagInputError }">
            <Tag :size="14" />
            <input 
              type="text" 
              placeholder="Введи тег и нажми Enter..." 
              @input="onTagType"
              @keydown.enter.prevent="onTagInput"
              :disabled="tags.length >= 5"
            />
          </div>
          <span class="field-error" v-if="errors.tags">{{ errors.tags }}</span>
          <span class="field-error" v-else-if="tagInputError">{{ tagInputError }}</span>
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>