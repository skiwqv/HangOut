import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning'
  title: string
  message?: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  function add(toast: Omit<Toast, 'id'>) {
    const id = nextId++
    const duration = toast.duration ?? 4

    toasts.value.push({ ...toast, id, duration })

    setTimeout(() => remove(id), duration * 1000)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function success(title: string, message?: string) {
    add({ type: 'success', title, message })
  }

  function error(title: string, message?: string) {
    add({ type: 'error', title, message })
  }

  function warning(title: string, message?: string) {
    add({ type: 'warning', title, message })
  }

  return { toasts, add, remove, success, error, warning }
})
