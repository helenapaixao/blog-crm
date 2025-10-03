'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Home as HomeIcon,
  Sun,
  Globe,
  Leaf,
  Code,
  ChevronUp,
  ChevronDown,
  Reply
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, isAdmin, signOut, loading, userProfile } = useAuth()
  const { posts, loading: postsLoading } = usePosts(undefined, 'published')
  const { groups } = useGroups()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/landing')
    }
  }, [loading, user, router])


  if (loading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('dev') || name.includes('programação')) return <Code className="h-4 w-4" />
    if (name.includes('ui') || name.includes('ux')) return <Sun className="h-4 w-4" />
    if (name.includes('futebol') || name.includes('esporte')) return <Globe className="h-4 w-4" />
    if (name.includes('jardinagem') || name.includes('plantas')) return <Leaf className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

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
                {groups.map((group) => (
                  <Link key={group.id} href={`/group/${group.slug}`}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-auto p-2 hover:bg-blue-50"
                    >
                      <div className="flex items-center w-full">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-blue-600">
                            {getGroupIcon(group.name)}
                          </div>
                          <span className="text-sm">{group.name}</span>
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
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-48 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">/r/ Dev</h1>
                  <p className="text-gray-300 text-sm">Comunidade de Desenvolvedores</p>
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
                      <Code className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">/r/ Dev</h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porttitor pretium orci, 
                      sed maximus lorem consectetur at. Sed euismod, nisl eget aliquam ultricies.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>1bi de membros</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em Jan, 2025</span>
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
            
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhuma postagem encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
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
                            {post.title}
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