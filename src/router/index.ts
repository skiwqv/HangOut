import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/profile', component: ProfileView,meta: { requiresAuth: true } },
{
  path: '/create',
  name: 'activity-create',
  component: () => import('@/views/CreateActivityView.vue'),
  meta: { requiresAuth: true } 
},
{
  path: '/activity/:id', 
  name: 'activity-detail',
  component: () => import('@/views/ActivityDetailView.vue')
},
{
  path: '/activity/:id/edit',
  name: 'activity-edit',
  component: () => import('@/views/ActivityEditView.vue'),
  meta: { requiresAuth: true }
}
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next('/') 
    authStore.setModal('login')
  } else {
    
    next()
  }
})