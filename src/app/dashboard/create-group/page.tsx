'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGroups } from '@/hooks/useGroups'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUploadStorage } from '@/components/ui/image-upload-storage'

export default function CreateGroupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createGroup, loading } = useGroups()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    cover_image: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Você precisa estar logado para criar um grupo')
      return
    }

    setIsSubmitting(true)
    
    try {
      const { error } = await createGroup({
        name: formData.name,
        description: formData.description || null,
        slug: formData.slug,
        created_by: user.id,
        status: 'pending'
      })

      if (error) {
        throw error
      }

      setShowSuccess(true)
      toast.success('Grupo solicitado com sucesso! Aguarde a aprovação do administrador.')
      
       
      setFormData({
        name: '',
        description: '',
        slug: '',
        cover_image: ''
      })
      

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Erro ao criar grupo:', error)
      toast.error('Erro ao solicitar grupo. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Grupo Solicitado!</h2>
              <p className="text-gray-600 mb-6">
                Sua solicitação de grupo foi enviada com sucesso. 
                Um administrador irá revisar e aprovar em breve.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
    
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Solicitar Novo Grupo</h1>
            <p className="text-gray-600">
              Crie um novo grupo temático para organizar postagens
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Informações do Grupo
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para solicitar a criação de um novo grupo. 
              Um administrador irá revisar sua solicitação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Tecnologia, Receitas, Viagens..."
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  Escolha um nome claro e descritivo para o grupo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito e tema do grupo..."
                  rows={4}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  Explique o que o grupo representa e que tipo de conteúdo será publicado
                </p>
              </div>

              <div className="space-y-2">
                <ImageUploadStorage
                  value={formData.cover_image}
                  onChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
                  label="Imagem de Capa do Grupo"
                  placeholder="URL da imagem ou arraste uma foto do seu PC"
                  userId={user?.id}
                />
                <p className="text-sm text-gray-500">
                  Adicione uma imagem representativa para o grupo (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug da URL *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="exemplo-grupo"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  URL do grupo: <span className="font-mono">/group/{formData.slug || 'exemplo-grupo'}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Como funciona?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Você solicita a criação do grupo</li>
                  <li>• Um administrador revisa sua solicitação</li>
                  <li>• Se aprovado, o grupo fica disponível para todos</li>
                  <li>• Você pode começar a publicar no grupo</li>
                </ul>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>Nota:</strong> Se o sistema de aprovação não estiver configurado, seu grupo será criado automaticamente como aprovado.
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.slug}
                  className="flex-1"
                >
                  {isSubmitting ? 'Solicitando...' : 'Solicitar Grupo'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
