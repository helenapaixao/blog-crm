import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface PendingGroup {
  id: string
  name: string
  description: string | null
  slug: string
  cover_image: string | null
  created_at: string
  created_by: string
  author: {
    full_name: string | null
    email: string
  }
}

interface UseAdminNotificationsResult {
  pendingGroups: PendingGroup[]
  pendingCount: number
  loading: boolean
  error: string | null
  approveGroup: (groupId: string) => Promise<{ success: boolean; error?: string }>
  rejectGroup: (groupId: string) => Promise<{ success: boolean; error?: string }>
  refetch: () => void
}

export function useAdminNotifications(): UseAdminNotificationsResult {
  const { user, isAdmin } = useAuth()
  const [pendingGroups, setPendingGroups] = useState<PendingGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingGroups = useCallback(async () => {
    console.log('🔍 fetchPendingGroups called', { user: !!user, isAdmin })
    
    if (!user || !isAdmin) {
      console.log('❌ Not admin or no user, skipping fetch')
      setPendingGroups([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log('📡 Fetching pending groups...')
      // Primeiro, vamos tentar uma query mais simples
      const { data, error: fetchError } = await supabase
        .from('groups')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Supabase error:', fetchError)
        throw fetchError
      }

      console.log('✅ Raw data received:', data)

      // Buscar informações dos autores separadamente
      const transformedData = await Promise.all((data || []).map(async (group) => {
        const { data: authorData } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', group.created_by)
          .single()

        return {
          ...group,
          author: authorData || { full_name: null, email: 'unknown@example.com' }
        }
      }))

      console.log('✅ Transformed data:', transformedData)
      setPendingGroups(transformedData)
    } catch (err) {
      console.error('Error fetching pending groups:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar grupos pendentes')
      setPendingGroups([])
    } finally {
      setLoading(false)
    }
  }, [user, isAdmin])

  useEffect(() => {
    fetchPendingGroups()
  }, [fetchPendingGroups])

  const approveGroup = async (groupId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('groups')
        .update({ status: 'approved' })
        .eq('id', groupId)

      if (updateError) {
        throw updateError
      }

      setPendingGroups(prev => prev.filter(group => group.id !== groupId))
      
      return { success: true }
    } catch (err) {
      console.error('Error approving group:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao aprovar grupo' 
      }
    }
  }

  const rejectGroup = async (groupId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)

      if (deleteError) {
        throw deleteError
      }

      setPendingGroups(prev => prev.filter(group => group.id !== groupId))
      
      return { success: true }
    } catch (err) {
      console.error('Error rejecting group:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao rejeitar grupo' 
      }
    }
  }

  return {
    pendingGroups,
    pendingCount: pendingGroups.length,
    loading,
    error,
    approveGroup,
    rejectGroup,
    refetch: fetchPendingGroups
  }
}
