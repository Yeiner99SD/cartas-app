export type Photo = {
  id: number
  url: string
  created_at: string
  is_favorite: boolean
  description?: string | null
  media_type: 'photo' | 'video'
}
