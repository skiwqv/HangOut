export type ActivityFormat = 'online' | 'offline'
export type ActivityType = 'open' | 'close'

export interface ActivityParticipant {
  id: string
  initials: string
  gradient: string
}

export interface Activities {
  items: Activity[]
  next_cursor: string
  has_more: boolean
}

export interface Activity {
  title: string
  type: ActivityType
  format: ActivityFormat
  category: string
  extra_data: ExtraData
  description: string
  date: string
  max_members: number
  tags: string[]
  location: string
  _id: string
  creator: Creator
  current_members: number
  status: string
  created_at: string
  updated_at: string
}

export interface ExtraData {
  category: string
  game_name?: string
  genre?: string
  platform?: string
}


export interface Creator {
  id: number
  username: string
  avatar_key: string
  avatar_url: string
}


export interface Category {
  value: string
  name: string
  image: string
}