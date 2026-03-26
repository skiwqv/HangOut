import type { Component } from 'vue'
// Импортируем иконки прямо в утилиту
import { Angry,Meh,Smile, Ghost } from '@lucide/vue';
// Описываем, как выглядит конфиг
export interface ReliabilityConfig {
  color: string
  bg: string
  border: string
  label: string
  icon: Component
}

// Чистая функция: на вход число, на выход готовый объект для UI
export const getReliabilityConfig = (score: number): ReliabilityConfig => {
  if (score === 0) return {
    color: 'var(--text3)',
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.07)',
    label: 'Надёжность — ещё не участвовал ни в чём',
    icon: Ghost
  }
  
  if (score >= 90) return {
    color: 'var(--mint)',
    bg: 'rgba(6, 214, 160, 0.07)',
    border: 'rgba(6, 214, 160, 0.15)',
    label: 'Надёжность — приходит когда говорит',
    icon: Smile
  }
  
  if (score >= 70) return {
    color: 'var(--yellow)',
    bg: 'rgba(245, 158, 11, 0.07)',
    border: 'rgba(245, 158, 11, 0.15)',
    label: 'Надёжность — иногда пропускает',
    icon: Meh
  }
  
  return {
    color: 'var(--red)',
    bg: 'rgba(239, 68, 68, 0.07)',
    border: 'rgba(239, 68, 68, 0.15)',
    label: 'Низкая надёжность — часто не приходит',
    icon: Angry
  }
}