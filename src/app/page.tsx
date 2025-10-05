'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommentsSection } from '@/components/ui/comments-section'
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
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, isAdmin, signOut, loading, userProfile } = useAuth()
  const { posts, loading: postsLoading } = usePosts(undefined, 'published')
  const { groups, loading: groupsLoading } = useGroups()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/landing')
    }
  }, [loading, user, router])


  if (loading || postsLoading || groupsLoading) {
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


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <HomeIcon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <div className="flex-1">
          <div className="h-48 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: groups.length > 0 && groups[0].cover_image 
                  ? `url(${groups[0].cover_image})` 
                  : 'linear-gradient(to right, #1f2937, #111827)'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="absolute bottom-4 left-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {groups.length > 0 ? `/r/ ${groups[0].name}` : '/r/ Dev'}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    {groups.length > 0 ? groups[0].description || 'Comunidade temática' : 'Comunidade de Desenvolvedores'}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                  <div key={post.id}>
                    <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
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
                            <span className="text-xs text-gray-500">
                              {post.published_at ? formatDate(post.published_at, 'dd/MM/yyyy') : 'Agora'}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h4>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </p>

                          <div className="flex items-center space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-600 hover:text-blue-600"
                              onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments?.length || 0}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-600 hover:text-green-600"
                              onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              Responder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedPostId === post.id && (
                    <CommentsSection 
                      postId={post.id} 
                      postAuthorId={post.author_id} 
                    />
                  )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}