'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Heart, 
  MessageCircle,
  Edit,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { posts } = usePosts()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, bio, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfileData({
        full_name: data.full_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading) {
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
  const publishedPosts = userPosts.filter(post => post.status === 'published')
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)
  const totalComments = userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Voltar ao Blog</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informações do Perfil</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profileData.avatar_url || user.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="text-2xl">
                      {profileData.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing ? (
                    <div className="space-y-4 w-full">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <Input
                          id="full_name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Conte um pouco sobre você..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar_url">URL do Avatar</Label>
                        <Input
                          id="avatar_url"
                          value={profileData.avatar_url}
                          onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                          placeholder="https://exemplo.com/avatar.jpg"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {profileData.full_name || 'Usuário'}
                      </h3>
                      <p className="text-gray-600">
                        {profileData.bio || 'Nenhuma biografia adicionada ainda.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Membro desde {format(new Date(user.created_at), 'MMMM yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Postagens</span>
                  </div>
                  <span className="font-semibold">{userPosts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Curtidas</span>
                  </div>
                  <span className="font-semibold">{totalLikes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Comentários</span>
                  </div>
                  <span className="font-semibold">{totalComments}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="published" className="space-y-6">
              <TabsList>
                <TabsTrigger value="published">
                  Publicadas ({publishedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todas ({userPosts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="published" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Postagens Publicadas</h2>
                </div>
                
                {publishedPosts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma postagem publicada ainda.</p>
                      <Link href="/dashboard/create">
                        <Button className="mt-4">Criar Primeira Postagem</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {publishedPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                <Link 
                                  href={`/post/${post.id}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {post.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {post.excerpt || post.content.substring(0, 150) + '...'}
                              </CardDescription>
                            </div>
                            <Badge className="bg-green-600">Publicada</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>{post.group?.name}</span>
                              <span>•</span>
                              <span>
                                {format(new Date(post.published_at || post.created_at), 'dd MMM yyyy', { locale: ptBR })}
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
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Todas as Postagens</h2>
                </div>
                
                {userPosts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Você ainda não criou nenhuma postagem.</p>
                      <Link href="/dashboard/create">
                        <Button className="mt-4">Criar Primeira Postagem</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                <Link 
                                  href={`/post/${post.id}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {post.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {post.excerpt || post.content.substring(0, 150) + '...'}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'outline'}
                              className={
                                post.status === 'published' ? 'bg-green-600' :
                                post.status === 'pending' ? 'bg-yellow-600' :
                                post.status === 'rejected' ? 'bg-red-600' : ''
                              }
                            >
                              {post.status === 'published' ? 'Publicada' :
                               post.status === 'pending' ? 'Aguardando' :
                               post.status === 'rejected' ? 'Rejeitada' : 'Rascunho'}
                            </Badge>
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
      </div>
    </div>
  )
}
