import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Group = Database['public']['Tables']['groups']['Row']
type GroupInsert = Database['public']['Tables']['groups']['Insert']
type GroupUpdate = Database['public']['Tables']['groups']['Update']

export function useGroupsFallback() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      // Tenta buscar com status primeiro, se falhar busca sem status
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          created_by_user:users(full_name),
          posts(count)
        `)
        .order('name')

      if (error) {
        // Se deu erro, pode ser que a coluna status não existe
        console.warn('Error fetching groups with status, trying without:', error.message)
        
        // Tenta buscar sem a coluna status
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('groups')
          .select(`
            id,
            name,
            description,
            slug,
            created_by,
            created_at,
            updated_at,
            created_by_user:users(full_name),
            posts(count)
          `)
          .order('name')

        if (fallbackError) {
          throw fallbackError
        }

        // Adiciona status 'approved' para grupos existentes
        const groupsWithStatus = (fallbackData || []).map(group => ({
          ...group,
          status: 'approved' as const
        }))

        setGroups(groupsWithStatus)
      } else {
        setGroups(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (group: GroupInsert) => {
    try {
      // Remove status se não existir na tabela
      const { status, ...groupWithoutStatus } = group as any
      
      const { data, error } = await supabase
        .from('groups')
        .insert(groupWithoutStatus)
        .select()
        .single()

      if (error) {
        console.error('Error creating group:', error)
        throw error
      }
      
      // Adiciona status localmente
      const groupWithStatus = {
        ...data,
        status: 'approved' as const // Assume aprovado se não há sistema de aprovação
      }
      
      setGroups(prev => [...prev, groupWithStatus])
      return { data: groupWithStatus, error: null }
    } catch (err) {
      console.error('Error creating group:', err)
      return { data: null, error: err }
    }
  }

  const updateGroup = async (id: string, updates: GroupUpdate) => {
    try {
      // Remove status das atualizações se não existir na tabela
      const { status, ...updatesWithoutStatus } = updates as any
      
      const { data, error } = await supabase
        .from('groups')
        .update(updatesWithoutStatus)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating group:', error)
        throw error
      }
      
      // Adiciona status localmente
      const groupWithStatus = {
        ...data,
        status: 'approved' as const
      }
      
      setGroups(prev => prev.map(group => group.id === id ? groupWithStatus : group))
      return { data: groupWithStatus, error: null }
    } catch (err) {
      console.error('Error updating group:', err)
      return { data: null, error: err }
    }
  }

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting group:', error)
        throw error
      }
      
      setGroups(prev => prev.filter(group => group.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting group:', err)
      return { error: err }
    }
  }

  // Funções de aprovação não funcionam sem a coluna status
  const approveGroup = async (id: string) => {
    console.warn('Approval system not available without status column')
    return { error: new Error('Approval system not available') }
  }

  const rejectGroup = async (id: string) => {
    console.warn('Approval system not available without status column')
    return { error: new Error('Approval system not available') }
  }

  const fetchGroupsByStatus = async (status: 'pending' | 'approved' | 'rejected') => {
    console.warn('Status filtering not available without status column')
    fetchGroups()
  }

  const fetchApprovedGroups = async () => {
    fetchGroups()
  }

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    approveGroup,
    rejectGroup,
    fetchGroupsByStatus,
    fetchApprovedGroups,
    refetch: fetchGroups,
  }
}
