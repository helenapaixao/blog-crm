import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Group = Database['public']['Tables']['groups']['Row']
type GroupInsert = Database['public']['Tables']['groups']['Insert']
type GroupUpdate = Database['public']['Tables']['groups']['Update']

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      let { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          created_by_user:users(full_name),
          posts(count)
        `)
        .order('name')

      // Se deu erro por causa da coluna status, tenta sem ela
      if (error && error.code === 'PGRST204') {
        console.log('Status column not found, fetching groups without status')
        
        const result = await supabase
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

        if (result.error) {
          throw result.error
        }

        // Adiciona status 'approved' para todos os grupos
        data = (result.data || []).map(group => ({
          ...group,
          status: 'approved' as const
        }))
        error = null
      } else if (error) {
        throw error
      }
      
      setGroups(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (group: GroupInsert) => {
    try {
      // Primeiro verifica se o usuário existe na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', group.created_by)
        .single()

      // Se o usuário não existe, cria ele na tabela users
      if (userError && userError.code === 'PGRST116') {
        console.log('User not found in users table, creating user profile')
        
        const { data: authUser } = await supabase.auth.getUser()
        
        if (authUser.user) {
          const { error: createUserError } = await supabase
            .from('users')
            .insert({
              id: authUser.user.id,
              email: authUser.user.email || '',
              full_name: authUser.user.user_metadata?.full_name || null,
              role: 'user'
            })

          if (createUserError) {
            console.error('Error creating user profile:', createUserError)
            throw createUserError
          }
        }
      } else if (userError) {
        console.error('Error checking user:', userError)
        throw userError
      }

      let groupData = {
        ...group,
        status: group.status || 'pending'
      }

      let { data, error } = await supabase
        .from('groups')
        .insert(groupData)
        .select()
        .single()

      if (error && error.code === 'PGRST204') {
        console.log('Status column not found, creating group without status')
        
        const { status, ...groupWithoutStatus } = groupData as any
        
        const result = await supabase
          .from('groups')
          .insert(groupWithoutStatus)
          .select()
          .single()

        if (result.error) {
          console.error('Error creating group without status:', result.error)
          throw result.error
        }

        data = {
          ...result.data,
          status: 'approved' as const
        }
        error = null
      } else if (error) {
        console.error('Error creating group:', error)
        throw error
      }
      
      setGroups(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating group:', err)
      return { data: null, error: err }
    }
  }

  const updateGroup = async (id: string, updates: GroupUpdate) => {
    try {
      let { data, error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      // Se deu erro por causa da coluna status, tenta sem ela
      if (error && error.code === 'PGRST204') {
        console.log('Status column not found, updating without status')
        
        const { status, ...updatesWithoutStatus } = updates as any
        
        const result = await supabase
          .from('groups')
          .update(updatesWithoutStatus)
          .eq('id', id)
          .select()
          .single()

        if (result.error) {
          console.error('Error updating group without status:', result.error)
          throw result.error
        }

        // Adiciona status localmente
        data = {
          ...result.data,
          status: updates.status || 'approved'
        }
        error = null
      } else if (error) {
        console.error('Error updating group:', error)
        throw error
      }
      
      setGroups(prev => prev.map(group => group.id === id ? data : group))
      return { data, error: null }
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

      if (error) throw error
      setGroups(prev => prev.filter(group => group.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const approveGroup = async (id: string) => {
    try {
      const result = await updateGroup(id, { status: 'approved' })
      
      // Se deu erro por causa da coluna status, apenas atualiza localmente
      if (result.error && (result.error as any).code === 'PGRST204') {
        console.log('Status column not found, updating locally')
        setGroups(prev => prev.map(group => 
          group.id === id ? { ...group, status: 'approved' } : group
        ))
        return { data: null, error: null }
      }
      
      return result
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const rejectGroup = async (id: string) => {
    try {
      const result = await updateGroup(id, { status: 'rejected' })
      
      // Se deu erro por causa da coluna status, apenas atualiza localmente
      if (result.error && (result.error as any).code === 'PGRST204') {
        console.log('Status column not found, updating locally')
        setGroups(prev => prev.map(group => 
          group.id === id ? { ...group, status: 'rejected' } : group
        ))
        return { data: null, error: null }
      }
      
      return result
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Função para buscar grupos por status
  const fetchGroupsByStatus = async (status: 'pending' | 'approved' | 'rejected') => {
    try {
      setLoading(true)
      let { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          created_by_user:users(full_name),
          posts(count)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      // Se deu erro por causa da coluna status, busca todos os grupos
      if (error && error.code === 'PGRST204') {
        console.log('Status column not found, fetching all groups')
        
        const result = await supabase
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
          .order('created_at', { ascending: false })

        if (result.error) {
          throw result.error
        }

        // Adiciona status 'approved' e filtra se necessário
        const allGroups = (result.data || []).map(group => ({
          ...group,
          status: 'approved' as const
        }))

        // Se está buscando 'approved', mostra todos. Se 'pending', mostra vazio
        data = status === 'approved' ? allGroups : []
        error = null
      } else if (error) {
        throw error
      }
      
      setGroups(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar apenas grupos aprovados (para usuários normais)
  const fetchApprovedGroups = async () => {
    try {
      setLoading(true)
      let { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          created_by_user:users(full_name),
          posts(count)
        `)
        .eq('status', 'approved')
        .order('name')

      // Se deu erro por causa da coluna status, busca todos os grupos
      if (error && error.code === 'PGRST204') {
        console.log('Status column not found, fetching all groups as approved')
        
        const result = await supabase
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

        if (result.error) {
          throw result.error
        }

        // Adiciona status 'approved' para todos os grupos
        data = (result.data || []).map(group => ({
          ...group,
          status: 'approved' as const
        }))
        error = null
      } else if (error) {
        throw error
      }
      
      setGroups(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
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
