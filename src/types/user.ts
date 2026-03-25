export interface UpcomingActivity {
  id: string
  title: string
  emoji: string
  iconBg: string
  dotColor: string
  datetime: string
  format: 'online' | 'offline'
}

export interface User {
  id: string
  username: string
  handle: string
  city: string
  initials: string
  stats: {
    organized: number
    participated: number
    rating: number
  }
  reliability: number
  tags: string[]
  upcoming: UpcomingActivity[]
}