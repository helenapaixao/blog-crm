import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Post = Database['public']['Tables']['posts']['Row'] & {
  author?: {
    full_name: string | null
    avatar_url: string | null
  }
  group?: {
    name: string
    slug: string
  }
  likes?: { id: string; user_id: string }[]
  comments?: { id: string; content: string; author_id: string }[]
}
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

export function usePosts(groupId?: string, status?: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [groupId, status])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:users(full_name, avatar_url),
          group:groups(name, slug),
          likes(count),
          comments(count)
        `)
        .order('created_at', { ascending: false })

      if (groupId) {
        query = query.eq('group_id', groupId)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (post: PostInsert) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

      if (error) throw error
      setPosts(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updatePost = async (id: string, updates: PostUpdate) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setPosts(prev => prev.map(post => post.id === id ? data : post))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPosts(prev => prev.filter(post => post.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const approvePost = async (id: string) => {
    return updatePost(id, { 
      status: 'published', 
      published_at: new Date().toISOString() 
    })
  }

  const rejectPost = async (id: string) => {
    return updatePost(id, { status: 'rejected' })
  }

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    approvePost,
    rejectPost,
    refetch: fetchPosts,
  }
}
