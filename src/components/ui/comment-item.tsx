'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  ChevronUp, 
  ChevronDown, 
  Reply, 
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ClientOnly } from './client-only'
import { CommentForm } from './comment-form'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CommentItemProps {
  comment: {
    id: string
    content: string
    created_at: string
    author_id: string
    author?: {
      id: string
      full_name: string
      avatar_url: string
    }
    replies?: any[]
    score?: number
  }
  postAuthorId?: string
  currentUserId?: string
  onReply?: (parentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
  onUpdate?: (commentId: string, content: string) => Promise<void>
  isReply?: boolean
  submitting?: boolean
}

export function CommentItem({ 
  comment, 
  postAuthorId,
  currentUserId,
  onReply,
  onDelete,
  onUpdate,
  isReply = false,
  submitting = false
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  // Debug: Monitorar mudanças no estado
  useEffect(() => {
    console.log('🟡 CommentItem renderizado - showReplyForm:', showReplyForm, 'onReply:', !!onReply)
  }, [showReplyForm, onReply])

  const isAuthor = comment.author_id === currentUserId
  const isPostAuthor = comment.author_id === postAuthorId
  const canEdit = isAuthor && onUpdate
  const canDelete = isAuthor && onDelete

  const handleReply = async (content: string) => {
    if (onReply) {
      await onReply(comment.id, content)
      setShowReplyForm(false)
    }
  }

  const handleUpdate = async () => {
    if (onUpdate && editContent.trim()) {
      await onUpdate(comment.id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (onDelete && confirm('Tem certeza que deseja deletar este comentário?')) {
      await onDelete(comment.id)
    }
  }

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author?.avatar_url || ''} />
              <AvatarFallback className="text-sm">
                {comment.author?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {comment.author?.full_name || 'Usuário'}
              </span>
              
              <span className="text-sm text-gray-500">
                <ClientOnly fallback="há um momento">
                  {formatDistanceToNow(new Date(comment.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </ClientOnly>
              </span>
              
              {isPostAuthor && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Autor
                </Badge>
              )}
            </div>
          </div>

          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleUpdate}>
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-3">{comment.content}</p>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{comment.replies?.length || 0}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-50">
            <ChevronUp className="h-4 w-4 text-gray-600 hover:text-orange-500" />
          </Button>
          <span className="text-xs font-semibold text-gray-600 min-w-[20px] text-center">
            {comment.score || 0}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
            <ChevronDown className="h-4 w-4 text-gray-600 hover:text-blue-500" />
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔴 BOTÃO RESPONDER CLICADO!')
              console.log('showReplyForm ANTES:', showReplyForm)
              console.log('onReply existe:', !!onReply)
              setShowReplyForm(!showReplyForm)
              console.log('showReplyForm DEPOIS:', !showReplyForm)
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Reply className="h-4 w-4 mr-1" />
            Responder
          </Button>
        </div>

        {/* Debug Info */}
        <div className="mt-2 p-2 bg-blue-100 text-xs">
          Debug: showReplyForm = {showReplyForm.toString()}, onReply = {!!onReply}
        </div>
        
        {showReplyForm && onReply && (
          <div className="mt-4">
            <div className="mb-2 p-2 bg-green-100 text-sm">
              ✅ Formulário de resposta está sendo renderizado!
            </div>
            <CommentForm
              onSubmit={handleReply}
              placeholder="Adicionar uma resposta..."
              submitting={submitting}
              autoFocus
            />
          </div>
        )}
        
        {showReplyForm && !onReply && (
          <div className="mt-4 p-2 bg-red-100 text-sm">
            ❌ showReplyForm=true mas onReply é null/undefined
          </div>
        )}
        
        {!showReplyForm && onReply && (
          <div className="mt-4 p-2 bg-yellow-100 text-sm">
            ⚠️ onReply existe mas showReplyForm=false
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isReply
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </div>
  )
}
