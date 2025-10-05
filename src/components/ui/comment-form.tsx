'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCommentSchema, type CreateCommentFormData } from '@/lib/validations'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  placeholder?: string
  submitting?: boolean
  autoFocus?: boolean
}

export function CommentForm({ 
  onSubmit, 
  placeholder = "Adicionar um comentário...", 
  submitting = false,
  autoFocus = false 
}: CommentFormProps) {
  const { userProfile } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ content: string }>({
    resolver: zodResolver(createCommentSchema.pick({ content: true })),
    defaultValues: {
      content: '',
    },
  })

  const onSubmitForm = async (data: { content: string }) => {
    try {
      await onSubmit(data.content.trim())
      reset()
      toast.success('Comentário adicionado com sucesso!')
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Erro ao adicionar comentário')
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
          Adicionar um comentário
        </Label>
        
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={userProfile?.avatar_url || ''} />
            <AvatarFallback className="text-sm">
              {userProfile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              id="comment"
              {...register('content')}
              placeholder={placeholder}
              className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              autoFocus={autoFocus}
              disabled={submitting || isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={submitting || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {submitting || isSubmitting ? 'Enviando...' : 'Responder'}
          </Button>
        </div>
      </form>
    </div>
  )
}
