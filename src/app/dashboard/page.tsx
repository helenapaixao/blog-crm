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
  Trash2,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, capitalizeFirstLetter } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'
import { NotificationBell } from '@/components/ui/notification-bell'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const { posts, loading: postsLoading, deletePost } = usePosts()
  const router = useRouter()
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    postId: string | null
    postTitle: string
  }>({
    isOpen: false,
    postId: null,
    postTitle: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      router.prefetch('/dashboard/create')
      router.prefetch('/dashboard/create-group')
      router.prefetch('/')
    }
  }, [user, router])

  const openDeleteModal = (postId: string, postTitle: string) => {
    setDeleteModal({
      isOpen: true,
      postId,
      postTitle
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      postId: null,
      postTitle: ''
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.postId) return

    const { error } = await deletePost(deleteModal.postId)
    if (error) {
      toast.error('Erro ao deletar postagem: ' + (error as any).message)
    } else {
      toast.success('Postagem deletada com sucesso!')
    }
    closeDeleteModal()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
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
        return <Badge variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">Rascunho</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">Aguardando</Badge>
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white">Publicada</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Dashboard</h1>
            </div>
            <nav className="flex items-center space-x-3">
              <NotificationBell />
              <Link href="/" prefetch={true}>
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Voltar ao Feed
                </Button>
              </Link>
              <Link href="/dashboard/create-group" prefetch={true}>
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Users className="h-4 w-4 mr-2" />
                  Novo Grupo
                </Button>
              </Link>
              <Link href="/dashboard/create" prefetch={true}>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Postagem
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-blue-500 dark:ring-blue-400">
              <AvatarImage src={user.user_metadata?.avatar_url || ''} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg font-semibold">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Olá, {capitalizeFirstLetter(user.user_metadata?.full_name) || 'Usuário'}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie suas postagens e acompanhe o status de publicação.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total de Postagens</CardTitle>
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {postsLoading ? '...' : userPosts.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {postsLoading ? 'Carregando...' : `${publishedPosts.length} publicadas`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Rascunhos</CardTitle>
              <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {postsLoading ? '...' : draftPosts.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Aguardando</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {postsLoading ? '...' : pendingPosts.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Em revisão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Publicadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {postsLoading ? '...' : publishedPosts.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No ar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400">
              Todas ({postsLoading ? '...' : userPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400">
              Rascunhos ({postsLoading ? '...' : draftPosts.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400">
              Aguardando ({postsLoading ? '...' : pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400">
              Publicadas ({postsLoading ? '...' : publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400">
              Rejeitadas ({postsLoading ? '...' : rejectedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Todas as Minhas Postagens</h2>
            </div>
            
            {postsLoading ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Carregando postagens...</p>
                </CardContent>
              </Card>
            ) : userPosts.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Você ainda não criou nenhuma postagem.</p>
                  <Link href="/dashboard/create" prefetch={true}>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Postagem
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
                          {post.published_at && (
                            <>
                              <span>•</span>
                              <span>
                                Publicado em {formatDate(post.published_at, 'dd MMM yyyy')}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <Link href={`/post/${post.id}`}>
                            <Button size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rascunhos</h2>
            </div>
            
            {draftPosts.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum rascunho encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {draftPosts.map((post) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openDeleteModal(post.id, post.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Criado em {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aguardando Aprovação</h2>
            </div>
            
            {pendingPosts.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma postagem aguardando aprovação.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Enviado em {formatDate(post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Postagens Publicadas</h2>
            </div>
            
            {publishedPosts.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma postagem publicada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openDeleteModal(post.id, post.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Publicado em {formatDate(post.published_at || post.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <Link href={`/post/${post.id}`}>
                            <Button size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Postagens Rejeitadas</h2>
            </div>
            
            {rejectedPosts.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma postagem rejeitada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejectedPosts.map((post) => (
                  <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            {post.excerpt || post.content.substring(0, 200) + '...'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(post.status)}
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openDeleteModal(post.id, post.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.group?.name}</span>
                          <span>•</span>
                          <span>
                            Rejeitada em {formatDate(post.updated_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Deletar Postagem"
        description="Esta ação irá remover permanentemente a postagem e todos os dados relacionados."
        itemName={deleteModal.postTitle}
      />
    </div>
  )
}
