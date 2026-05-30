<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedHeader from '@/components/FeedHeader.vue'
import SeatsBar from '@/components/common/SeatsBar.vue'
import BadgeType from '@/components/common/BadgeType.vue'
import { Settings, ArrowLeft, Clock, MapPin, Users } from '@lucide/vue'
import { formatToHumanDate } from '@/utils/dateFormat'
import { CATEGORIES } from '@/config/category'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'

const activityStore = useActivityStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const router = useRouter()
const routeToCreate = () => router.push('/create')
const goBack = () => router.back()

const activity = computed(() => activityStore.activity)

const category = computed(() => {
  if (!activity.value) return null
  return CATEGORIES.find(c => c.value === activity.value?.category)
})

const showAvatarMenu = ref(false)

const routeToEdit = () => {
  if (!activity.value) return
  router.push(`/activity/${activity.value._id}/edit`)
}

const deleteActivity = async () => {
  if (!activity.value) return
  if (confirm('Вы уверены, что хотите удалить эту активность?')) {
    await activityStore.deleteActivity(activity.value._id)
    router.push('/')
  }
}

const isFull = computed(() => {
  if (!activity.value) return false
  return activity.value.current_members >= activity.value.max_members
})



const isOrganizer = computed(() => {
  if (!activity.value || !user.value) return false
  return activity.value.creator.id === user.value.id
})

onMounted(async () => {
  await activityStore.getActivityById(router.currentRoute.value.params.id as unknown as number)
})

</script>

<template>
  <MainLayout>
    <div class="feed-col">
      <FeedHeader @create="routeToCreate" />
  
      <div class="activity-detail" v-if="activity">
  
        <!-- Back -->
        <button class="detail-back" @click="goBack">
          <ArrowLeft :size="16" />
          Назад к ленте
        </button>
  
        <!-- Cover -->
        <div class="detail-cover card-cover-gradient">
          <!-- <div class="card-cover-placeholder" style="font-size:72px;"></div> -->
          <!-- <div class="detail-cover-gradient" /> -->
           <img :src="category?.image" :alt="category?.name">
          <BadgeType :format="activity.format" />
          <div  class="badge-closed badge-category">
            {{ category?.name}}
          </div>
          <div class="detail-game-badge" v-if="activity.extra_data.game_name">
            🎮 {{ activity.extra_data.game_name }}
          </div>
        </div>
  
        <!-- Title + Join -->
        <div class="card detail-main-card">
          <div class="detail-title-row">
            <div class="detail-title-block">
              <div class="card-title" style="font-size:22px;">{{ activity.title }}</div>
              <div class="card-meta">
                <div class="meta-item">
                  <Clock :size="13" />
                  {{ formatToHumanDate(activity.date) }}
                </div>
                <div class="meta-item" v-if="activity.location">
                  <div class="dot" />
                </div>
                <div class="meta-item" v-if="activity.location && activity.format === 'offline'">
                  <MapPin :size="13" />
                  {{ activity.location }}
                </div>
                <div class="meta-item">
                  <div class="dot" />
                </div>
                <div class="meta-item">
                  <Users :size="13" />
                  {{ activity.current_members }} / {{ activity.max_members }} мест
                </div>
              </div>
            </div>
  
            <button class="btn" :class="isFull ? 'btn--disabled' : 'btn--ghost'" :disabled="isFull" v-if="!isOrganizer">
              {{ isFull ? 'Мест нет' : activity.type === 'close' ? 'Подать заявку →' : 'Хочу пойти →' }}
            </button>
            <div class="organizer-edit-wrapper" v-if="isOrganizer && authStore.token">
              <div 
                ref="settingsBtn" 
                class="nav-item settings-trigger" 
                :class="{ active: showAvatarMenu }"
                @click.stop="showAvatarMenu = !showAvatarMenu" 
                title="Настройки"
              >
                <Settings :size="20" />
                
                <Transition name="dropdown">
                  <div class="avatar-menu" v-if="showAvatarMenu" v-click-outside="() => showAvatarMenu = false">
                    <div class="avatar-menu-item" @click="routeToEdit">
                      Редактировать
                    </div>

                    <div class="avatar-menu-item avatar-menu-item--danger" @click="deleteActivity">
                      Удалить активность
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
  
          </div>
  
          <!-- Seats bar -->
          <SeatsBar :taken="activity.current_members" :total="activity.max_members" />
        </div>
  
        <!-- Description -->
        <div class="card detail-section">
          <div class="section-label">О активности</div>
          <p class="detail-description">{{ activity.description }}</p>
        </div>
  
        <!-- Tags -->
        <div class="card detail-section" v-if="activity.tags.length">
          <div class="section-label">Теги</div>
          <div class="card-tags">
            <span v-for="tag in activity.tags" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
        </div>
  
        <!-- Participants -->
        <!-- <div class="card detail-section">
            <div class="section-label">Участники · {{ activity.participants.length }}</div>
            <div class="detail-participants">
              <div
                v-for="(p, i) in activity.participants"
                :key="p.id"
                class="detail-participant"
              >
                <div class="detail-participant-avatar" :style="{ background: p.gradient }">
                  {{ p.initials }}
                </div>
                <span class="detail-participant-handle">
                  {{ activity.participants[i].id === activity.organizer.handle ? activity.organizer.handle : `Участник ${i + 1}` }}
                </span>
                <span class="detail-organizer-badge" v-if="i === 0">Организатор</span>
              </div>
            </div>
          </div> -->
  
        <!-- Organizer -->
        <div class="card detail-section">
            <div class="section-label">Организатор</div>
            <div class="detail-organizer">
            <div class="profile-avatar" v-if="activity.creator.avatar_url">
              <img :src="activity.creator.avatar_url" :alt="activity.creator.username" />
            </div>
            <div class="profile-avatar" v-else>
              ?
            </div>
              <div>
                <div class="detail-organizer-name">{{ activity.creator.username }}</div>
                <div class="detail-organizer-sub">Организатор активности</div>
              </div>
              <button class="btn btn--ghost" style="margin-left:auto;" v-if="!isOrganizer">Профиль →</button>
            </div>
          </div>
  
      </div>
    </div>
  </MainLayout>
</template>