'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGroupMembers } from '@/hooks/useGroupMembers'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Users, UserPlus, UserMinus, Loader2 } from 'lucide-react'

interface JoinGroupButtonProps {
  groupId: string
  groupName: string
  membersCount?: number
  className?: string
}

export function JoinGroupButton({ 
  groupId, 
  groupName, 
  membersCount = 0,
  className = '' 
}: JoinGroupButtonProps) {
  const { user } = useAuth()
  const { 
    isMember, 
    isLoadingMembership, 
    joinGroup, 
    leaveGroup,
    getMembersCount 
  } = useGroupMembers(groupId)

  const [isProcessing, setIsProcessing] = useState(false)

  const handleJoinGroup = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para se unir ao grupo')
      return
    }

    setIsProcessing(true)
    try {
      const result = await joinGroup()
      if (result?.error) {
        toast.error('Erro ao se unir ao grupo')
      } else {
        toast.success(`Você se uniu ao grupo ${groupName}!`)
      }
    } catch (error) {
      toast.error('Erro ao se unir ao grupo')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para sair do grupo')
      return
    }

    setIsProcessing(true)
    try {
      const result = await leaveGroup()
      if (result?.error) {
        toast.error('Erro ao sair do grupo')
      } else {
        toast.success(`Você saiu do grupo ${groupName}`)
      }
    } catch (error) {
      toast.error('Erro ao sair do grupo')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        className={`${className}`}
        disabled
      >
        <Users className="h-4 w-4 mr-2" />
        Faça login para se unir
      </Button>
    )
  }

  if (isLoadingMembership || isProcessing) {
    return (
      <Button 
        variant={isMember ? "outline" : "default"}
        className={`${className}`}
        disabled
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        {isMember ? 'Saindo...' : 'Unindo-se...'}
      </Button>
    )
  }

  if (isMember) {
    return (
      <Button 
        variant="outline"
        onClick={handleLeaveGroup}
        className={`${className} hover:bg-red-50 hover:text-red-600 hover:border-red-300`}
      >
        <UserMinus className="h-4 w-4 mr-2" />
        Membro
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleJoinGroup}
      className={`${className} bg-blue-600 hover:bg-blue-700 text-white`}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Unir-se
    </Button>
  )
}
