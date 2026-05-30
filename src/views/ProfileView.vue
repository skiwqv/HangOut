<script setup lang="ts">
import { Upload, Trash2, Pencil } from '@lucide/vue'
import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import TagChip from '@/components/common/TagChip.vue'
import { autoResize } from '@/utils/autoResize'
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

const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: bio } = useField<string>('bio')

// ── EDIT STATE ──
const isEditing = ref(false)
const isLoading = ref(false)
const bioTextareaRef = ref<HTMLTextAreaElement | null>(null)

function startEdit() {
  setValues({
    username: user.value?.username ?? '',
    email: user.value?.email ?? '',
    bio: user.value?.bio ?? '',
  })
  
  isEditing.value = true

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
  isAvatarDeleted.value = false
  
  bannerFile.value = null
  bannerPreview.value = null
  isBannerDeleted.value = false
}

const saveEdit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    if (isAvatarDeleted.value) {
      await profileStore.deleteAvatar(null) 
    } else if (avatarFile.value) {
      await profileStore.changeAvatar(avatarFile.value)
    }

    // Логика сохранения баннера
    if (isBannerDeleted.value) {
      await profileStore.deleteBanner(null)
    } else if (bannerFile.value) {
      await profileStore.changeBanner(bannerFile.value)
    }

    await profileStore.updateUser({
      username: values.username,
      email: values.email,
      bio: values.bio || '',
    })

    isEditing.value = false
    avatarFile.value = null
    isAvatarDeleted.value = false
    bannerFile.value = null
    isBannerDeleted.value = false
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
const isAvatarDeleted = ref(false) // Флаг удаления аватарки

function openAvatarUpload() {
  avatarInputRef.value?.click()
  showAvatarMenu.value = false
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
  isAvatarDeleted.value = false // Сбрасываем флаг удаления при выборе нового файла
}

// Отменяет выбор локального файла
function removeAvatarSelection() {
  avatarFile.value = null
  avatarPreview.value = null
  showAvatarMenu.value = false
}

// Помечает аватарку на удаление с сервера
function markAvatarForDeletion() {
  avatarFile.value = null
  avatarPreview.value = null
  isAvatarDeleted.value = true 
  showAvatarMenu.value = false
}

// ── BANNER ──
const bannerInputRef = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)
const isBannerDeleted = ref(false)

function openBannerUpload() {
  bannerInputRef.value?.click()
}

function onBannerChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
  isBannerDeleted.value = false // Сбрасываем флаг при выборе нового файла
}

// Отменяет выбор локального файла
function removeBannerSelection() {
  bannerFile.value = null
  bannerPreview.value = null
}

// Помечает баннер на удаление с сервера
function markBannerForDeletion() {
  bannerFile.value = null
  bannerPreview.value = null
  isBannerDeleted.value = true 
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
            :style="(!isBannerDeleted && (bannerPreview || user?.banner)) ? { backgroundImage: `url(${bannerPreview || user?.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
          >
            <template v-if="isEditing">
              <div class="profile-cover-actions">
                <button class="profile-cover-btn" @click="openBannerUpload">
                  <Upload :size="12" />
                  {{ bannerPreview ? 'Сменить файл' : (user?.banner ? 'Сменить баннер' : 'Загрузить баннер') }}
                </button>
                
                <template v-if="bannerPreview">
                  <button class="profile-cover-btn profile-cover-btn--danger" @click="removeBannerSelection">
                    <Trash2 :size="12" />
                    Отменить выбор
                  </button>
                </template>
                <template v-else-if="user?.banner && !isBannerDeleted">
                  <button class="profile-cover-btn profile-cover-btn--danger" @click="markBannerForDeletion">
                    <Trash2 :size="12" />
                    Удалить баннер
                  </button>
                </template>
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
              <img v-if="!isAvatarDeleted && (avatarPreview || user?.avatar)" :src="avatarPreview ?? user?.avatar" :alt="user?.username" />
              <span v-else>{{ user?.initials ?? '?' }}</span>
              
              <div class="profile-avatar-edit-badge" v-if="isEditing">
                <Pencil :size="10" color="white" :stroke-width="2.5" />
              </div>
            </div>

            <Transition name="dropdown">
              <div class="avatar-menu" v-if="showAvatarMenu && isEditing" v-click-outside="() => showAvatarMenu = false">
                <div class="avatar-menu-item" @click="openAvatarUpload">
                  <Upload :size="14" />
                  Загрузить фото
                </div>
                
                <div class="avatar-menu-item avatar-menu-item--danger" v-if="avatarPreview" @click="removeAvatarSelection">
                  <Trash2 :size="14" />
                  Отменить выбор
                </div>
                <div class="avatar-menu-item avatar-menu-item--danger" v-else-if="user?.avatar && !isAvatarDeleted" @click="markAvatarForDeletion">
                  <Trash2 :size="14" />
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