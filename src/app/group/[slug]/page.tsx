'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { Sidebar } from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { JoinGroupButton } from '@/components/ui/join-group-button'
import { GroupCoverImage } from '@/components/ui/group-cover-image'
import { 
  MessageCircle, 
  Calendar, 
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
  FolderOpen,
  } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/lib/supabase'

type Group = Database['public']['Tables']['groups']['Row']

export default function GroupPage() {
  const params = useParams()
  const { user} = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [loadingGroup, setLoadingGroup] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { posts, loading: postsLoading } = usePosts()

  useEffect(() => {
    setLoadingGroup(true)
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
      console.log('Group data fetched:', data)
      console.log('Group cover image:', data?.cover_image)
      console.log('Group cover image type:', typeof data?.cover_image)
      console.log('Group cover image length:', data?.cover_image?.length)
      setGroup(data)
      
      if (data?.cover_image) {
        testImageLoad(data.cover_image)
      }
    } catch (error) {
      console.error('Error fetching group:', error)
    } finally {
      setLoadingGroup(false)
    }
  }

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('dev') || name.includes('programação')) return <Code className="h-4 w-4" />
    if (name.includes('ui') || name.includes('ux')) return <Sun className="h-4 w-4" />
    if (name.includes('futebol') || name.includes('esporte')) return <Globe className="h-4 w-4" />
    if (name.includes('jardinagem') || name.includes('plantas')) return <Leaf className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  const testImageLoad = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        console.log('Image loaded successfully:', url)
        resolve(true)
      }
      img.onerror = () => {
        console.error('Image failed to load:', url)
        resolve(false)
      }
      img.src = url
    })
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

      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Link href="/">
          <Button variant="ghost" size="sm" className="bg-white shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <div className="flex-1">
          <GroupCoverImage 
            coverImage={group.cover_image}
            groupName={group.name}
            className="h-48"
          />

          <div className="px-6 -mt-6 relative z-10">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getGroupIcon(group.name)}
                      <h2 className="text-lg font-semibold"> {group.name}</h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {group.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porttitor pretium orci, sed maximus lorem consectetur at.'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                     
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em {formatDate(group.created_at, 'MMM yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <JoinGroupButton 
                      groupId={group.id}
                      groupName={group.name}
                      membersCount={0}
                    />
                  
                    <Link href="/dashboard/create">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar post
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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