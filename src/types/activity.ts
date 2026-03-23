export type ActivityFormat = 'online' | 'offline'
export type ActivityAccess = 'open' | 'request'

export interface ActivityParticipant {
  id: string
  initials: string
  gradient: string
}

export interface Activity {
  id: string
  title: string
  format: ActivityFormat
  access?: ActivityAccess
  emoji: string
  coverGradient: string
  datetime: string
  location?: string
  seats: { taken: number; total: number }
  tags: string[]
  organizer: {
    handle: string
    initials: string
    gradient: string
  }
  participants: ActivityParticipant[]
}