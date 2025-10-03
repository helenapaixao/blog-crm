'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  LogOut, 
  Users, 
  Plus,
  X,
  HomeIcon,
  Sun,
  Globe,
  Leaf,
  Code,
  ChevronUp,
  ChevronDown,
  Reply,
  ArrowLeft,
  FolderOpen
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Database } from '@/lib/supabase'

type Group = Database['public']['Tables']['groups']['Row']

export default function GroupPage() {
  const params = useParams()
  const { user, isAdmin, signOut, loading, userProfile } = useAuth()
  const { groups } = useGroups()
  const [group, setGroup] = useState<Group | null>(null)
  const [loadingGroup, setLoadingGroup] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { posts, loading: postsLoading } = usePosts()

  useEffect(() => {
    fetchGroup()
  }, [params.slug])


  const fetchGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error) throw error
      setGroup(data)
    } catch (error) {
      console.error('Error fetching group:', error)
    } finally {
      setLoadingGroup(false)
    }
  }

  // Ícones para as comunidades
  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('dev') || name.includes('programação')) return <Code className="h-4 w-4" />
    if (name.includes('ui') || name.includes('ux')) return <Sun className="h-4 w-4" />
    if (name.includes('futebol') || name.includes('esporte')) return <Globe className="h-4 w-4" />
    if (name.includes('jardinagem') || name.includes('plantas')) return <Leaf className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  if (loadingGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Grupo não encontrado</h1>
          <p className="text-gray-600 mb-4">O grupo que você está procurando não existe.</p>
          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    )
  }

  const groupPosts = posts.filter(post => post.group_id === group.id && post.status === 'published')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <HomeIcon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">3Pontos</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={userProfile?.avatar_url || user.user_metadata?.avatar_url || ''} />
                    <AvatarFallback>
                      {userProfile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-50 border-r border-gray-200 lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="p-4">
            {/* Logo e fechar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">3P</span>
                </div>
                <span className="font-semibold text-gray-900">3Pontos Community</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Home Link */}
            <div className="mb-6">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>

            {/* Minhas Comunidades */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Minhas comunidades</h3>
              <div className="space-y-1">
                {groups.map((g) => (
                  <Link key={g.id} href={`/group/${g.slug}`}>
                    <Button 
                      variant={g.id === group.id ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-2 ${g.id === group.id ? 'bg-blue-100 text-blue-900' : 'hover:bg-blue-50'}`}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-blue-600">
                            {getGroupIcon(g.name)}
                          </div>
                          <span className="text-sm">{g.name}</span>
                        </div>
                        <Badge variant="secondary">
                          +999
                        </Badge>
                      </div>
                    </Button>
                  </Link>
                ))}
                
                {/* Botão para criar comunidade */}
                <Link href="/dashboard/create-group">
                  <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-blue-50">
                    <div className="flex items-center space-x-3">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Criar comunidade</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Community Banner */}
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 h-48 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  {getGroupIcon(group.name)}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">/r/ {group.name}</h1>
                  <p className="text-gray-300 text-sm">{group.description || 'Comunidade temática'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Info Card */}
          <div className="px-6 -mt-6 relative z-10">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getGroupIcon(group.name)}
                      <h2 className="text-lg font-semibold">/r/ {group.name}</h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {group.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porttitor pretium orci, sed maximus lorem consectetur at.'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{groupPosts.length} membros</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em {format(new Date(group.created_at), 'MMM yyyy', { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/create">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar post
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="px-6">
            <h3 className="text-lg font-semibold mb-4">Veja todos os posts da comunidade</h3>
            
            {postsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando posts...</p>
              </div>
            ) : groupPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma postagem ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Este grupo ainda não possui postagens publicadas.
                  </p>
                  {user && (
                    <Link href="/dashboard/create">
                      <Button>Ser o primeiro a postar</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {groupPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        {/* Vote Buttons */}
                        <div className="flex flex-col items-center space-y-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-50">
                            <ChevronUp className="h-4 w-4 text-gray-600 hover:text-orange-500" />
                          </Button>
                          <span className="text-xs font-semibold text-gray-600">
                            {post.likes?.length || 0}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                            <ChevronDown className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                          </Button>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar_url || ''} />
                              <AvatarFallback className="text-xs">
                                {post.author?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{post.author?.full_name || 'Usuário'}</span>
                            <span className="text-xs text-gray-500">@{(post.author?.full_name || 'user').toLowerCase().replace(/\s/g, '')}</span>
                            <span className="text-xs text-gray-500">now</span>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            <Link 
                              href={`/post/${post.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h4>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments?.length || 0}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                              <Reply className="h-4 w-4 mr-1" />
                              Responder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}