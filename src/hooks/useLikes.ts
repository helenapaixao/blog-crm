import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useLikes(postId: string) {
  const [likes, setLikes] = useState<{ id: string; user_id: string; post_id: string }[]>([])
  const [userLiked, setUserLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (postId) {
      fetchLikes()
    }
  }, [postId, user])

  const fetchLikes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('likes')
        .select('id, user_id, post_id')
        .eq('post_id', postId)

      if (error) throw error
      setLikes(data || [])
      
      if (user) {
        const userLike = data?.find(like => like.user_id === user.id)
        setUserLiked(!!userLike)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async () => {
    if (!user) return { error: 'User not authenticated' }

    try {
      if (userLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (error) throw error
        setUserLiked(false)
        setLikes(prev => prev.filter(like => like.user_id !== user.id))
      } else {
        const { data, error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          })
          .select('id, user_id, post_id')
          .single()

        if (error) throw error
        setUserLiked(true)
        setLikes(prev => [...prev, data])
      }
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return {
    likes,
    userLiked,
    likesCount: likes.length,
    loading,
    error,
    toggleLike,
    refetch: fetchLikes,
  }
}
