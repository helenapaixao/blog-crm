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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroupSchema, type CreateGroupFormData } from '@/lib/validations'

export default function CreateGroupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createGroup, loading } = useGroups()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      coverImage: '',
    },
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const watchedName = watch('name')

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
    setValue('name', name)
    setValue('slug', generateSlug(name))
  }

  const onSubmit = async (data: CreateGroupFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar um grupo')
      return
    }
    
    try {
      console.log('Creating group with cover_image:', data.coverImage)
      const { data: createdGroup, error } = await createGroup({
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        cover_image: data.coverImage || null,
        created_by: user.id,
        status: 'pending'
      })
      console.log('Group created response:', createdGroup)

      if (error) {
        throw error
      }

      setShowSuccess(true)
      toast.success('Grupo solicitado com sucesso! Aguarde a aprovação do administrador.')
      
      reset()

      setTimeout(() => {
        if (createdGroup?.slug) {
          router.push(`/group/${createdGroup.slug}`)
        } else if (data.slug) {
          router.push(`/group/${data.slug}`)
        } else {
          router.push('/dashboard')
        }
      }, 2000)
      
    } catch (error) {
      console.error('Erro ao criar grupo:', error)
      toast.error('Erro ao solicitar grupo. Tente novamente.')
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Tecnologia, Receitas, Viagens..."
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Escolha um nome claro e descritivo para o grupo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva o propósito e tema do grupo..."
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Explique o que o grupo representa e que tipo de conteúdo será publicado
                </p>
              </div>

              <div className="space-y-2">
                <ImageUploadStorage
                  value={watch('coverImage') || ''}
                  onChange={(url) => setValue('coverImage', url)}
                  label="Imagem de Capa do Grupo"
                  placeholder="URL da imagem ou arraste uma foto do seu PC"
                  userId={user?.id}
                />
                {errors.coverImage && (
                  <p className="text-sm text-red-600">{errors.coverImage.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Adicione uma imagem representativa para o grupo (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug da URL *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="exemplo-grupo"
                  disabled={isSubmitting}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600">{errors.slug.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  URL do grupo: <span className="font-mono">/group/{watch('slug') || 'exemplo-grupo'}</span>
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
                  disabled={isSubmitting || !watch('name') || !watch('slug')}
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
