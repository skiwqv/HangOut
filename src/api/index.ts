import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status

    switch (status) {
      case 401:
        useAuthStore().logout() 
        break
      case 403:
        console.error('Нет доступа')
        break
      case 404:
        console.error('Не найдено')
        break
      case 500:
        console.error('Ошибка сервера')
        break
    }

    return Promise.reject(error)
  }
)

export default api