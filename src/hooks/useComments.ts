'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Comment = Database['public']['Tables']['comments']['Row'] & {
  author?: {
    id: string
    full_name: string
    avatar_url: string
  }
  replies?: Comment[]
}

type CommentInsert = Database['public']['Tables']['comments']['Insert']

export function useComments(postId?: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  const fetchComments = async () => {
    if (!postId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users(id, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .is('parent_id', null) // Apenas comentários principais
        .order('created_at', { ascending: false })

      if (error) throw error

      // Buscar respostas para cada comentário
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('comments')
            .select(`
              *,
              author:users(id, full_name, avatar_url)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })

          if (repliesError) {
            console.error('Error fetching replies:', repliesError)
            return { ...comment, replies: [] }
          }

          return { ...comment, replies: replies || [] }
        })
      )

      setComments(commentsWithReplies)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (content: string, parentId?: string) => {
    if (!postId) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const commentData: CommentInsert = {
        content,
        post_id: postId,
        parent_id: parentId || null,
        author_id: user.id
      }

      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select(`
          *,
          author:users(id, full_name, avatar_url)
        `)
        .single()

      if (error) throw error

      if (parentId) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === parentId
              ? { ...comment, replies: [...(comment.replies || []), data] }
              : comment
          )
        )
      } else {
        setComments(prev => [data, ...prev])
      }

      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId
            ? comment // Remover comentário principal
            : {
                ...comment,
                replies: comment.replies?.filter(reply => reply.id !== commentId)
              }
        ).filter(comment => comment.id !== commentId)
      )
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .select()
        .single()

      if (error) throw error

      // Atualizar no estado local
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId
            ? { ...comment, content }
            : {
                ...comment,
                replies: comment.replies?.map(reply => 
                  reply.id === commentId ? { ...reply, content } : reply
                )
              }
        )
      )

      return data
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  }

  return {
    comments,
    loading,
    submitting,
    addComment,
    deleteComment,
    updateComment,
    refetch: fetchComments
  }
}