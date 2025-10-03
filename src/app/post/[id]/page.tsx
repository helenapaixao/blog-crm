'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useComments } from '@/hooks/useComments'
import { useLikes } from '@/hooks/useLikes'
import { usePosts } from '@/hooks/usePosts'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  User, 
  Tag,
  ArrowLeft,
  Trash2,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Database } from '@/lib/supabase'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'
import { CommentsSection } from '@/components/ui/comments-section'

type Post = Database['public']['Tables']['posts']['Row'] & {
  author: {
    full_name: string | null
    avatar_url: string | null
  }
  group: {
    name: string
    slug: string
  }
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const { comments, loading: commentsLoading } = useComments(params.id as string)
  const { likes, userLiked, likesCount, toggleLike } = useLikes(params.id as string)
  const { deletePost } = usePosts()

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(full_name, avatar_url),
          group:groups(name, slug)
        `)
        .eq('id', params.id)
        .eq('status', 'published')
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Erro ao carregar postagem')
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleConfirmDelete = async () => {
    if (!post) return

    const { error } = await deletePost(post.id)
    if (error) {
      toast.error('Erro ao deletar postagem: ' + (error as any).message)
    } else {
      toast.success('Postagem deletada com sucesso!')
      router.push('/dashboard')
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para curtir')
      return
    }

    const { error } = await toggleLike()
    if (error) {
      toast.error('Erro ao curtir postagem')
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Postagem não encontrada</h1>
          <p className="text-gray-600 mb-4">A postagem que você está procurando não existe ou não está publicada.</p>
          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href={`/group/${post.group.slug}`}>
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                {post.group.name}
              </Badge>
            </Link>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(post.published_at || post.created_at), 'dd MMMM yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">
              {post.title}
            </h1>
            {user && post.author_id === user.id && (
              <div className="flex items-center space-x-2 ml-4">
                <Link href={`/dashboard/edit/${post.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={openDeleteModal}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar_url || ''} />
                  <AvatarFallback>
                    {post.author.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author.full_name || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-500">Autor</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  userLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${userLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none py-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />
      </div>

      {/* Comments Section */}
      {post && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommentsSection 
            postId={post.id} 
            postAuthorId={post.author_id}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Deletar Postagem"
        description="Esta ação irá remover permanentemente a postagem e todos os dados relacionados."
        itemName={post?.title || ''}
      />
    </div>
  )
}
