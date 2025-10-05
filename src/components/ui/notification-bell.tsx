'use client'

import { useState } from 'react'
import { Bell, Check, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    pendingGroups, 
    pendingCount, 
    loading, 
    error, 
    approveGroup, 
    rejectGroup 
  } = useAdminNotifications()

  const handleApprove = async (groupId: string, groupName: string) => {
    const result = await approveGroup(groupId)
    if (result.success) {
      toast.success(`Grupo "${groupName}" aprovado com sucesso!`)
    } else {
      toast.error(result.error || 'Erro ao aprovar grupo')
    }
  }

  const handleReject = async (groupId: string, groupName: string) => {
    if (confirm(`Tem certeza que deseja rejeitar o grupo "${groupName}"? Esta ação não pode ser desfeita.`)) {
      const result = await rejectGroup(groupId)
      if (result.success) {
        toast.success(`Grupo "${groupName}" rejeitado`)
      } else {
        toast.error(result.error || 'Erro ao rejeitar grupo')
      }
    }
  }

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <Button variant="ghost" size="sm" disabled>
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="text-red-500 hover:text-red-600"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  if (pendingCount === 0) {
    return null // Não mostra o sininho se não há notificações
  }

  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {pendingCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {pendingCount > 99 ? '99+' : pendingCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown de notificações */}
          <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto z-50 shadow-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Grupos Pendentes</span>
                <Badge variant="secondary">{pendingCount}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pendingGroups.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum grupo pendente</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {pendingGroups.map((group) => (
                    <div 
                      key={group.id}
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.cover_image || ''} />
                          <AvatarFallback>
                            {group.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {group.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              /r/{group.slug}
                            </Badge>
                          </div>
                          
                          {group.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {group.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                            <span>por {group.author.full_name || group.author.email}</span>
                            <span>•</span>
                            <span>{formatDate(group.created_at, 'dd/MM/yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(group.id, group.name)}
                              className="h-7 px-2 text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Aprovar
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(group.id, group.name)}
                              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Rejeitar
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // TODO: Implementar visualização detalhada
                                toast.info('Visualização detalhada em breve')
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
