'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploadStorage } from '@/components/ui/image-upload-storage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { Badge } from '@/components/ui/badge'
import { X, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema, type CreatePostFormData } from '@/lib/validations'

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()
  const { createPost, loading: createLoading } = usePosts()
  const { groups, loading: groupsLoading } = useGroups()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      tags: [],
      groupId: '',
      status: 'draft' as const,
    },
  })

  const [tagInput, setTagInput] = useState('')
  const watchedTags = watch('tags')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  const onSubmit = async (data: CreatePostFormData, status: 'draft' | 'pending') => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    const { error } = await createPost({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      cover_image: data.coverImage || null,
      tags: data.tags,
      status,
      author_id: user.id,
      group_id: data.groupId,
      published_at: status === 'pending' ? new Date().toISOString() : null
    })

    if (error) {
      toast.error('Erro ao salvar postagem: ' + (error as any).message)
    } else {
      toast.success(
        status === 'draft' 
          ? 'Rascunho salvo com sucesso!' 
          : 'Postagem enviada para aprovação!'
      )
      reset()
      router.push('/dashboard')
    }
  }

  const addTag = () => {
    const currentTags = watchedTags || []
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setValue('tags', [...currentTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = watchedTags || []
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  if (authLoading || groupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Postar</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Voltar ao Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as CreatePostFormData, 'draft'))} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Preencha as informações principais da sua postagem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Digite o título da postagem"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo (opcional)</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Breve descrição da postagem..."
                  rows={3}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-600">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo Temático *</Label>
                <Select
                  onValueChange={(value) => setValue('groupId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.groupId && (
                  <p className="text-sm text-red-600">{errors.groupId.message}</p>
                )}
              </div>

              <ImageUploadStorage
                value={watch('coverImage') || ''}
                onChange={(url) => setValue('coverImage', url)}
                label="Imagem de Capa"
                placeholder="URL da imagem ou arraste um arquivo do seu PC"
                userId={user?.id}
              />
              {errors.coverImage && (
                <p className="text-sm text-red-600">{errors.coverImage.message}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Adicionar
                  </Button>
                </div>
                {(watchedTags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(watchedTags || []).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.tags && (
                  <p className="text-sm text-red-600">{errors.tags.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
              <CardDescription>
                Escreva o conteúdo da sua postagem usando o editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={watch('content') || ''}
                onChange={(content) => setValue('content', content)}
                placeholder="Comece a escrever sua postagem..."
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit((data) => onSubmit(data as unknown as CreatePostFormData, 'draft'))}
              disabled={isSubmitting || createLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data as unknown as CreatePostFormData, 'pending'))}
              disabled={isSubmitting || createLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar para Aprovação
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
