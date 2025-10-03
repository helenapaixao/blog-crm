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

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()
  const { createPost, loading: createLoading } = usePosts()
  const { groups, loading: groupsLoading } = useGroups()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [] as string[],
    groupId: '',
    status: 'draft' as 'draft' | 'pending'
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.groupId) {
      toast.error('Título, conteúdo e grupo são obrigatórios')
      return
    }

    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    const { error } = await createPost({
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || null,
      cover_image: formData.coverImage || null,
      tags: formData.tags,
      status,
      author_id: user.id,
      group_id: formData.groupId,
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
      router.push('/dashboard')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
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
              <h1 className="text-2xl font-bold text-gray-900">Nova Postagem</h1>
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
        <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-6">
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da postagem"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo (opcional)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição da postagem..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo Temático *</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}
                  required
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
              </div>

              <ImageUploadStorage
                value={formData.coverImage}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                label="Imagem de Capa"
                placeholder="URL da imagem ou arraste um arquivo do seu PC"
                userId={user?.id}
              />

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
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
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
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Comece a escrever sua postagem..."
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={createLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'pending')}
              disabled={createLoading}
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
