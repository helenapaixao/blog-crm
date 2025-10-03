'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Calendar, ArrowLeft, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Database } from '@/lib/supabase'

type Group = Database['public']['Tables']['groups']['Row']

export default function GroupPage() {
  const params = useParams()
  const { user, isAdmin } = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
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
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
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
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FolderOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">{group.name}</h1>
          </div>
          
          {group.description && (
            <p className="text-xl text-gray-600 mb-6 max-w-3xl">
              {group.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{groupPosts.length} postagens</span>
              <span>•</span>
              <span>
                Criado em {format(new Date(group.created_at), 'dd MMMM yyyy', { locale: ptBR })}
              </span>
            </div>
            
            {user && (
              <Link href="/dashboard/create">
                <Button>
                  Nova Postagem
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando postagens...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link 
                      href={`/post/${post.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt || post.content.substring(0, 120) + '...'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author?.avatar_url || ''} />
                        <AvatarFallback>
                          {post.author?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {post.author?.full_name || 'Usuário'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(post.published_at || post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                      </span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      <Link href={`/post/${post.id}`}>
                        <Button size="sm" variant="ghost">
                          Ler mais
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to All Posts */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline">
              Ver todas as postagens
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
