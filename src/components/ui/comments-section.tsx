'use client'

import { useComments } from '@/hooks/useComments'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'

interface CommentsSectionProps {
  postId: string
  postAuthorId: string
}

export function CommentsSection({ postId, postAuthorId }: CommentsSectionProps) {
  const { user } = useAuth()
  const { 
    comments, 
    loading, 
    submitting, 
    addComment, 
    deleteComment, 
    updateComment 
  } = useComments(postId)

  const handleAddComment = async (content: string) => {
    await addComment(content)
  }

  const handleReply = async (parentId: string, content: string) => {
    try {
      await addComment(content, parentId)
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Todas as respostas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && (
          <CommentForm
            onSubmit={handleAddComment}
            submitting={submitting}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-gray-600">Carregando comentários...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum comentário ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Seja o primeiro a comentar nesta postagem!
            </p>
            {!user && (
              <Button variant="outline">
                Faça login para comentar
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postAuthorId={postAuthorId}
                currentUserId={user?.id}
                onReply={handleReply}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
                submitting={submitting}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
