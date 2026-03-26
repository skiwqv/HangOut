<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import TagChip from '@/components/common/TagChip.vue'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { getReliabilityConfig } from '@/utils/reliability'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

// ── GETTERS ──
const user = computed(() => authStore.user)
const reliability = computed(() => user.value?.reliability ?? 0)
const reliabilityConfig = computed(() => getReliabilityConfig(reliability.value))

const routeToCreate = () => router.push('/create')

// ── ВАЛИДАЦИЯ (ZOD) ──
const profileSchema = toTypedSchema(z.object({
  username: z.string()
    .trim()
    .min(1, 'Поле не может быть пустым')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только лат. буквы, цифры и подчеркивание (_)'),
  email: z.string()
    .min(1, 'Поле не может быть пустым')
    .email('Некорректный email'),
  bio: z.string().max(160, 'Макс. длина 255 символов').nullable().optional(),
}))

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: profileSchema,
})

// Вот переменные, которые реально привязаны к форме!
const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: bio } = useField<string>('bio')

// ── EDIT STATE ──
const isEditing = ref(false)
const isLoading = ref(false)
const bioTextareaRef = ref<HTMLTextAreaElement | null>(null)

// Функция растягивания текстареи
function autoResize(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}

function startEdit() {
  // Заливаем данные юзера в переменные vee-validate
  setValues({
    username: user.value?.username ?? '',
    email: user.value?.email ?? '',
    bio: user.value?.bio ?? '',
  })
  
  isEditing.value = true

  // Подгоняем высоту
  nextTick(() => {
    if (bioTextareaRef.value) {
      bioTextareaRef.value.style.height = 'auto'
      bioTextareaRef.value.style.height = `${bioTextareaRef.value.scrollHeight}px`
    }
  })
}

function cancelEdit() {
  isEditing.value = false
  showAvatarMenu.value = false
  avatarFile.value = null
  avatarPreview.value = null
  bannerFile.value = null
  bannerPreview.value = null
}

const saveEdit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    if (avatarFile.value) {
      await profileStore.changeAvatar(avatarFile.value)
    }
    if (bannerFile.value) {
      await profileStore.changeBanner(bannerFile.value)
    }
    await profileStore.updateUser({
      username: values.username,
      email: values.email,
      bio: values.bio || '',
    })

    isEditing.value = false
    avatarFile.value = null
    bannerFile.value = null
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
  } finally {
    isLoading.value = false
  }
})

// ── AVATAR ──
const showAvatarMenu = ref(false)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null) 
const avatarPreview = ref<string | null>(null)

function openAvatarUpload() {
  avatarInputRef.value?.click()
  showAvatarMenu.value = false
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

function removeAvatar() {
  avatarFile.value = null
  avatarPreview.value = null
  showAvatarMenu.value = false
}

// ── BANNER ──
const bannerInputRef = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)

function openBannerUpload() {
  bannerInputRef.value?.click()
}

function onBannerChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
}

function removeBanner() {
  bannerFile.value = null
  bannerPreview.value = null
}
</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />

      <div class="profile-page">

        <div class="profile-cover">
          <div
            class="profile-cover-bg"
            :style="user?.banner ? { backgroundImage: `url(${user?.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
          >
            <template v-if="isEditing">
              <div class="profile-cover-actions">
                <button class="profile-cover-btn" @click="openBannerUpload">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {{ bannerPreview ? 'Сменить' : 'Загрузить баннер' }}
                </button>
                <button v-if="bannerPreview" class="profile-cover-btn profile-cover-btn--danger" @click="removeBanner">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </template>
          </div>
          <input ref="bannerInputRef" type="file" accept="image/*" style="display:none" @change="onBannerChange" />

          <div class="profile-cover-avatar-wrap">
            <div
              class="profile-cover-avatar"
              :class="{ 'profile-cover-avatar--editable': isEditing }"
              @click.stop="isEditing && (showAvatarMenu = !showAvatarMenu)"
            >
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview ?? user?.avatar" :alt="user?.username" />
              <span v-else>{{ user?.initials ?? '?' }}</span>
              <div class="profile-avatar-edit-badge" v-if="isEditing">
                <svg width="10" height="10" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>

            <Transition name="dropdown">
              <div class="avatar-menu" v-if="showAvatarMenu && isEditing" v-click-outside="() => showAvatarMenu = false">
                <div class="avatar-menu-item" @click="openAvatarUpload">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Загрузить фото
                </div>
                <div class="avatar-menu-item avatar-menu-item--danger" @click="removeAvatar">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                  Удалить фото
                </div>
              </div>
            </Transition>
          </div>
          <input ref="avatarInputRef" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
        </div>

        <div class="card profile-info-card">
          <div class="profile-info-top">
            <div v-if="!isEditing" class="profile-info-text">
              <div class="profile-page-name">{{ user?.username ?? 'Аноним' }}</div>
              <div class="profile-page-email">{{ user?.email ?? '' }}</div>
            </div>
            <div v-else class="profile-edit-fields">
              <div class="field">
                <label class="field-label">Юзернейм</label>
                <div class="field-input">
                  <input v-model="username" type="text" placeholder="username" />
                </div>
                <span class="field-error" v-if="errors.username">{{ errors.username }}</span>
              </div>
              <div class="field">
                <label class="field-label">Email</label>
                <div class="field-input">
                  <input v-model="email" readonly disabled type="email" placeholder="email@example.com" />
                </div>
                <span class="field-error" v-if="errors.email">{{ errors.email }}</span>
              </div>
            </div>

            <div class="profile-actions">
              <template v-if="!isEditing">
                <button class="btn btn--ghost" @click="startEdit">Редактировать</button>
              </template>
              <template v-else>
                <button class="btn-create" style="padding:8px 16px;" :disabled="isLoading" @click="saveEdit">
                  {{ isLoading ? 'Сохраняем...' : 'Сохранить' }}
                </button>
                <button class="btn-register" style="padding:8px 12px;" :disabled="isLoading" @click="cancelEdit">Отмена</button>
              </template>
            </div>
          </div>

          <div v-if="!isEditing">
            <div class="profile-page-bio" v-if="user?.bio">{{ user.bio }}</div>
            <div class="profile-page-bio profile-page-bio--empty" v-else>Расскажи немного о себе...</div>
          </div>
          <div v-else class="field" style="margin-top:12px">
            <label class="field-label">О себе</label>
            <textarea
              ref="bioTextareaRef"
              v-model="bio"
              class="profile-bio-textarea"
              placeholder="Расскажи немного о себе..."
              @input="autoResize"
            />
            <span class="field-error" v-if="errors.bio">{{ errors.bio }}</span>
          </div>
        </div>

        <div class="profile-stats-grid">
          <div class="stat-item">
            <div class="stat-num">{{ user?.stats?.organized ?? 0 }}</div>
            <div class="stat-label">Организовал</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ user?.stats?.participated ?? 0 }}</div>
            <div class="stat-label">Участвовал</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ user?.stats?.rating ?? 0 }}</div>
            <div class="stat-label">Рейтинг</div>
          </div>
        </div>

        <div class="reliability" :style="{ background: reliabilityConfig.bg, borderColor: reliabilityConfig.border }">
          <component :is="reliabilityConfig.icon" :size="14" :style="{ color: reliabilityConfig.color, flexShrink: 0 }" />
          <span class="reliability-label">{{ reliabilityConfig.label }}</span>
          <span class="reliability-value" :style="{ color: reliabilityConfig.color }">{{ reliability }}%</span>
        </div>

        <div class="card profile-tags-card">
          <div class="section-title">Мои теги <a>+ Добавить</a></div>
          <div class="my-tags" v-if="user?.tags?.length">
            <TagChip v-for="tag in user.tags" :key="tag" :label="tag" variant="my" />
          </div>
          <span v-else class="no-tags">У вас пока нет тегов &#58;(</span>
        </div>

      </div>
    </div>
  </MainLayout>
</template>