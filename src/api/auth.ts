import api from './index'
import type { User } from '@/types/user'
import type { RegisterPayload, LoginPayload } from '@/types/auth'

interface AuthResponse {
  access_token: string
}

export const authApi = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/user/login', payload)
  },

  register(payload: RegisterPayload) {
    return api.post<AuthResponse>('/user/register', payload)
  },

  logout() {
    return api.post('/user/logout')
  },

  me() {
    return api.get<User>('/user/me')
  },

  refresh() {
    return api.post('/user/refresh')
  },
}