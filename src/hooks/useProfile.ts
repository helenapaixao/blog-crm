import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  role: string | null
}

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, bio, avatar_url, role')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating basic profile...')
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              bio: '',
              avatar_url: user.user_metadata?.avatar_url || '',
              role: 'user',
              created_at: new Date().toISOString()
            })
            .select('full_name, bio, avatar_url, role')
            .single()

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            setError('Erro ao criar perfil do usuário')
            setProfile({
              full_name: user.user_metadata?.full_name || '',
              bio: '',
              avatar_url: user.user_metadata?.avatar_url || '',
              role: 'user'
            })
            return
          }

          setProfile(newUser)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError(error.message || 'Erro ao carregar perfil')
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        bio: '',
        avatar_url: user.user_metadata?.avatar_url || '',
        role: 'user'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Usuário não autenticado' }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        setError(error.message)
        return { error: error.message }
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      
      await fetchProfile()
      
      return { error: null }
    } catch (error: any) {
      console.error('Unexpected error updating profile:', error)
      setError(error.message || 'Erro inesperado')
      return { error: error.message || 'Erro inesperado' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setError(null)
    }
  }, [user])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile
  }
}
