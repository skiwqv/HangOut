import api from './index'
import type { User } from '@/types/user'

interface LoginPayload {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/auth/login', payload)
  },

  register(payload: LoginPayload & { name: string }) {
    return api.post<AuthResponse>('/auth/register', payload)
  },

  logout() {
    return api.post('/auth/logout')
  },

  me() {
    return api.get<User>('/auth/me')
  },
}