'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserDropdown } from '@/components/ui/user-dropdown'
import { NotificationBell } from '@/components/ui/notification-bell'
import { 
  Home, 
  Users, 
  X,
  Plus,
  ChevronRight,
  Code,
  Palette,
  Gamepad2,
  Music,
  Camera,
  Book,
  Heart,
  Zap,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { groups, getGroupStats, fetchApprovedGroups } = useGroups()
  const [groupStats, setGroupStats] = useState<Record<string, { postsCount: number; membersCount: number }>>({})

  // Buscar apenas grupos aprovados quando o componente carregar
  useEffect(() => {
    if (user) {
      fetchApprovedGroups()
    }
  }, [user, fetchApprovedGroups])

  useEffect(() => {
    if (groups.length > 0) {
      const fetchStats = async () => {
        const statsPromises = groups.map(async (group) => {
          const stats = await getGroupStats(group.id)
          return { groupId: group.id, stats }
        })
        
        const results = await Promise.all(statsPromises)
        const newStats: Record<string, { postsCount: number; membersCount: number }> = {}
        
        results.forEach(({ groupId, stats }) => {
          newStats[groupId] = stats
        })
        
        setGroupStats(newStats)
      }
      
      fetchStats()
    }
  }, [groups])

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('dev') || name.includes('programação') || name.includes('code')) return <Code className="h-4 w-4" />
    if (name.includes('design') || name.includes('arte') || name.includes('criativo')) return <Palette className="h-4 w-4" />
    if (name.includes('game') || name.includes('jogo') || name.includes('gaming')) return <Gamepad2 className="h-4 w-4" />
    if (name.includes('música') || name.includes('music') || name.includes('som')) return <Music className="h-4 w-4" />
    if (name.includes('foto') || name.includes('photo') || name.includes('camera')) return <Camera className="h-4 w-4" />
    if (name.includes('livro') || name.includes('book') || name.includes('leitura')) return <Book className="h-4 w-4" />
    if (name.includes('amor') || name.includes('love') || name.includes('coração')) return <Heart className="h-4 w-4" />
    return <Zap className="h-4 w-4" />
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed lg:relative lg:translate-x-0 z-50
        h-full w-80 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">RedditClone</h1>
                <p className="text-xs text-gray-500">Comunidades</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-2 border-b border-gray-100">
            <UserDropdown />
          </div>
        )}

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Home className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Início</div>
                <div className="text-xs text-gray-500">Feed principal</div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/create">
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Plus className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Nova Postagem</div>
                <div className="text-xs text-gray-500">Criar conteúdo</div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/create-group">
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Users className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Criar Comunidade</div>
                <div className="text-xs text-gray-500">Novo grupo</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Communities Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Comunidades</h3>
            <Badge variant="secondary" className="text-xs">
              {groups.length}
            </Badge>
          </div>
          
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {groups.map((group) => {
              const stats = groupStats[group.id] || { postsCount: 0, membersCount: 0 }
              return (
                <Link key={group.id} href={`/group/${group.slug}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-auto p-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="text-blue-600 flex-shrink-0">
                          {getGroupIcon(group.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {group.name}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{stats.postsCount} posts</span>
                            <span>•</span>
                            <span>{stats.membersCount} membros</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Button>
                </Link>
              )
            })}
            
            {groups.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma comunidade ainda</p>
                <p className="text-xs">Crie a primeira!</p>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Notificações</span>
              <NotificationBell />
            </div>
          </div>
        )}

        {/* Logout Button */}
        {user && (
          <div className="p-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Sair</div>
                <div className="text-xs text-red-500">Fazer logout</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
