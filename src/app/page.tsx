'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Eye, Calendar, LogOut } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, isAdmin, signOut, loading } = useAuth()
  const { posts, loading: postsLoading } = usePosts(undefined, 'published')
  const { groups } = useGroups()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/landing')
    }
  }, [loading, user, router])

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Blog CMS</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline">Admin</Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button variant="outline">Perfil</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <Button variant="outline">Entrar</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Cadastrar</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Groups */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Navegue por temas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start">
                      Todas as postagens
                    </Button>
                  </Link>
                  {groups.map((group) => (
                    <Link key={group.id} href={`/group/${group.slug}`}>
                      <Button variant="ghost" className="w-full justify-start">
                        {group.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Postagens Recentes
                </h2>
                <p className="text-gray-600">
                  Descubra os últimos conteúdos publicados
                </p>
              </div>

              {posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">Nenhuma postagem encontrada.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              <Link 
                                href={`/post/${post.id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {post.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {post.excerpt || post.content.substring(0, 150) + '...'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author?.avatar_url || ''} />
                                <AvatarFallback>
                                  {post.author?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {post.author?.full_name || 'Usuário'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}