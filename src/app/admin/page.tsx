'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  XCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const { posts, approvePost, rejectPost, loading: postsLoading } = usePosts()
  const { groups, loading: groupsLoading } = useGroups()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.')
    }
  }, [loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const pendingPosts = posts.filter(post => post.status === 'pending')
  const publishedPosts = posts.filter(post => post.status === 'published')
  const draftPosts = posts.filter(post => post.status === 'draft')
  const rejectedPosts = posts.filter(post => post.status === 'rejected')

  const handleApprove = async (postId: string) => {
    const { error } = await approvePost(postId)
    if (error) {
      toast.error('Erro ao aprovar postagem')
    } else {
      toast.success('Postagem aprovada com sucesso!')
    }
  }

  const handleReject = async (postId: string) => {
    const { error } = await rejectPost(postId)
    if (error) {
      toast.error('Erro ao rejeitar postagem')
    } else {
      toast.success('Postagem rejeitada')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Voltar ao Feed</Button>
              </Link>
              <Link href="/admin/groups">
                <Button variant="outline">Gerenciar Grupos</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Postagens</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                {publishedPosts.length} publicadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Precisam de revisão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupos Temáticos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups.length}</div>
              <p className="text-xs text-muted-foreground">
                Categorias ativas
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
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Aguardando Aprovação ({pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicadas ({publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rascunhos ({draftPosts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitadas ({rejectedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Postagens Aguardando Aprovação</h2>
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
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(post.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(post.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar_url || ''} />
                              <AvatarFallback>
                                {post.author?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author?.full_name || 'Usuário'}</span>
                          </div>
                          <span>•</span>
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <Badge variant="outline">Aguardando</Badge>
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
                  <p className="text-gray-500">Nenhuma postagem publicada.</p>
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
                        <Badge className="bg-green-600">Publicada</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar_url || ''} />
                              <AvatarFallback>
                                {post.author?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author?.full_name || 'Usuário'}</span>
                          </div>
                          <span>•</span>
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {formatDate(post.published_at || post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>{post.likes?.length || 0} curtidas</span>
                          <span>{post.comments?.length || 0} comentários</span>
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
                        <Badge variant="outline">Rascunho</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar_url || ''} />
                              <AvatarFallback>
                                {post.author?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author?.full_name || 'Usuário'}</span>
                          </div>
                          <span>•</span>
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
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
                        <Badge variant="destructive">Rejeitada</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar_url || ''} />
                              <AvatarFallback>
                                {post.author?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author?.full_name || 'Usuário'}</span>
                          </div>
                          <span>•</span>
                          <span>{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
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
