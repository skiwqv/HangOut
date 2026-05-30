
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
  id: number
  username: string
  email: string
  bio:string
  avatar?:string
  banner:string
  stats: {
    organized: number
    participated: number
    rating: number
  }
  reliability: number
  tags: string[]
  upcoming: UpcomingActivity[]
}

export interface updateUserPayload {
  username: string,
  email: string,
  bio: string,
}