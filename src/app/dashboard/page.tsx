'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  Plus, 
  Edit, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Heart,
  MessageCircle,
  Users,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const { posts, loading: postsLoading } = usePosts()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userPosts = posts.filter(post => post.author_id === user.id)
  const draftPosts = userPosts.filter(post => post.status === 'draft')
  const pendingPosts = userPosts.filter(post => post.status === 'pending')
  const publishedPosts = userPosts.filter(post => post.status === 'published')
  const rejectedPosts = userPosts.filter(post => post.status === 'rejected')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>
      case 'pending':
        return <Badge className="bg-yellow-600">Aguardando</Badge>
      case 'published':
        return <Badge className="bg-green-600">Publicada</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Meu Dashboard</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Voltar ao Blog</Button>
              </Link>
              <Link href="/dashboard/create-group">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Novo Grupo
                </Button>
              </Link>
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Postagem
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url || ''} />
              <AvatarFallback>
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Olá, {user.user_metadata?.full_name || 'Usuário'}!
              </h2>
              <p className="text-gray-600">
                Gerencie suas postagens e acompanhe o status de publicação.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Postagens</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                {publishedPosts.length} publicadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Em revisão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                No ar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              Todas ({userPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rascunhos ({draftPosts.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Aguardando ({pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicadas ({publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitadas ({rejectedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Todas as Minhas Postagens</h2>
            </div>
            
            {userPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Você ainda não criou nenhuma postagem.</p>
                  <Link href="/dashboard/create">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Postagem
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {format(new Date(post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                          {post.published_at && (
                            <>
                              <span>•</span>
                              <span>
                                Publicado em {format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR })}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <Link href={`/post/${post.id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Rascunhos</h2>
            </div>
            
            {draftPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhum rascunho encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {draftPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Criado em {format(new Date(post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Aguardando Aprovação</h2>
            </div>
            
            {pendingPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhuma postagem aguardando aprovação.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Enviado em {format(new Date(post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Postagens Publicadas</h2>
            </div>
            
            {publishedPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhuma postagem publicada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Publicado em {format(new Date(post.published_at || post.created_at), 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <Link href={`/post/${post.id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Postagens Rejeitadas</h2>
            </div>
            
            {rejectedPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhuma postagem rejeitada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejectedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Rejeitada em {format(new Date(post.updated_at), 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
