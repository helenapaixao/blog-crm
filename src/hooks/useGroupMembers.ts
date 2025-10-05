'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type GroupMember = Database['public']['Tables']['group_members']['Row'] & {
  user?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']

export function useGroupMembers(groupId?: string) {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [isLoadingMembership, setIsLoadingMembership] = useState(false)

  const fetchMembers = useCallback(async () => {
    if (!groupId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('joined_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  const checkMembership = useCallback(async () => {
    if (!groupId) return

    setIsLoadingMembership(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsMember(false)
        return
      }

      const { data, error } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setIsMember(!!data)
    } catch (err) {
      console.error('Error checking membership:', err)
      setIsMember(false)
    } finally {
      setIsLoadingMembership(false)
    }
  }, [groupId])

  const joinGroup = async () => {
    if (!groupId) return

    setIsLoadingMembership(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const memberData: GroupMemberInsert = {
        group_id: groupId,
        user_id: user.id,
        joined_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('group_members')
        .insert(memberData)
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `)
        .single()

      if (error) throw error

      setMembers(prev => [data, ...prev])
      setIsMember(true)
      return { data, error: null }
    } catch (err) {
      console.error('Error joining group:', err)
      return { data: null, error: err }
    } finally {
      setIsLoadingMembership(false)
    }
  }

  const leaveGroup = async () => {
    if (!groupId) return

    setIsLoadingMembership(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)

      if (error) throw error

      setMembers(prev => prev.filter(member => member.user_id !== user.id))
      setIsMember(false)
      return { error: null }
    } catch (err) {
      console.error('Error leaving group:', err)
      return { error: err }
    } finally {
      setIsLoadingMembership(false)
    }
  }

  const getMembersCount = useCallback(() => {
    return members.length
  }, [members])

  useEffect(() => {
    if (groupId) {
      fetchMembers()
      checkMembership()
    }
  }, [groupId, fetchMembers, checkMembership])

  return {
    members,
    loading,
    error,
    isMember,
    isLoadingMembership,
    joinGroup,
    leaveGroup,
    getMembersCount,
    refetch: fetchMembers,
    refetchMembership: checkMembership
  }
}
