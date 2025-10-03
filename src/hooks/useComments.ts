import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Comment = Database['public']['Tables']['comments']['Row'] & {
  author: {
    full_name: string | null
    avatar_url: string | null
  }
}
type CommentInsert = Database['public']['Tables']['comments']['Insert']

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createComment = async (comment: CommentInsert) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select(`
          *,
          author:users(full_name, avatar_url)
        `)
        .single()

      if (error) throw error
      setComments(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      setComments(prev => prev.filter(comment => comment.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return {
    comments,
    loading,
    error,
    createComment,
    deleteComment,
    refetch: fetchComments,
  }
}
