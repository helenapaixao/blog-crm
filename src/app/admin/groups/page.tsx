'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function GroupsPage() {
  const { isAdmin, loading, user } = useAuth()
  const { 
    groups, 
    createGroup, 
    updateGroup, 
    deleteGroup, 
    approveGroup, 
    rejectGroup,
    fetchGroupsByStatus,
    loading: groupsLoading 
  } = useGroups()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  })
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.')
    }
  }, [loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }, [activeTab, isAdmin])

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Nome e slug são obrigatórios')
      return
    }

    if (!user) {
      toast.error('Usuário não encontrado')
      return
    }

    const { error } = await createGroup({
      name: formData.name,
      description: formData.description || null,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      created_by: user.id,
      status: 'approved' // Admin cria grupos já aprovados
    })

    if (error) {
      toast.error('Erro ao criar grupo: ' + (error as any).message)
    } else {
      toast.success('Grupo criado com sucesso!')
      setIsCreateDialogOpen(false)
      setFormData({ name: '', description: '', slug: '' })
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingGroup) return

    const { error } = await updateGroup(editingGroup.id, {
      name: formData.name,
      description: formData.description || null,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-')
    })

    if (error) {
      toast.error('Erro ao atualizar grupo: ' + (error as any).message)
    } else {
      toast.success('Grupo atualizado com sucesso!')
      setIsEditDialogOpen(false)
      setEditingGroup(null)
      setFormData({ name: '', description: '', slug: '' })
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.')) {
      return
    }

    const { error } = await deleteGroup(groupId)
    
    if (error) {
      toast.error('Erro ao excluir grupo: ' + (error as any).message)
    } else {
      toast.success('Grupo excluído com sucesso!')
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }

  const handleApproveGroup = async (groupId: string) => {
    const { error } = await approveGroup(groupId)
    
    if (error) {
      toast.error('Erro ao aprovar grupo: ' + (error as any).message)
    } else {
      toast.success('Grupo aprovado com sucesso!')
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }

  const handleRejectGroup = async (groupId: string) => {
    const { error } = await rejectGroup(groupId)
    
    if (error) {
      toast.error('Erro ao rejeitar grupo: ' + (error as any).message)
    } else {
      toast.success('Grupo rejeitado')
      fetchGroupsByStatus(activeTab as 'pending' | 'approved' | 'rejected')
    }
  }

  const openEditDialog = (group: any) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description || '',
      slug: group.slug
    })
    setIsEditDialogOpen(true)
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Aguardando</Badge>
      case 'approved':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Grupos</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline">Voltar ao Admin</Button>
              </Link>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Grupo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Grupo</DialogTitle>
                    <DialogDescription>
                      Crie um novo grupo temático para organizar as postagens.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Grupo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            name: e.target.value,
                            slug: generateSlug(e.target.value)
                          }))
                        }}
                        placeholder="Ex: Tecnologia, Saúde, Educação"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="tecnologia"
                        required
                      />
                      <p className="text-sm text-gray-500">
                        URL amigável para o grupo (ex: /group/tecnologia)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição (opcional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição do grupo temático..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Criar Grupo</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Edit Group Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Grupo</DialogTitle>
              <DialogDescription>
                Edite as informações do grupo temático.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Grupo</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))
                  }}
                  placeholder="Ex: Tecnologia, Saúde, Educação"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug (URL)</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="tecnologia"
                  required
                />
                <p className="text-sm text-gray-500">
                  URL amigável para o grupo (ex: /group/tecnologia)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição (opcional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do grupo temático..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Aguardando ({groups.filter(g => g.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Aprovados ({groups.filter(g => g.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejeitados ({groups.filter(g => g.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Grupos Aguardando Aprovação</h2>
              <p className="text-sm text-gray-600">
                {groups.filter(g => g.status === 'pending').length} grupos aguardando revisão
              </p>
            </div>
            
            {groupsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando grupos...</p>
              </div>
            ) : groups.filter(g => g.status === 'pending').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum grupo aguardando aprovação.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.filter(g => g.status === 'pending').map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {group.description || 'Sem descrição'}
                          </CardDescription>
                          {getStatusBadge(group.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Slug:</span>
                          <Badge variant="outline">{group.slug}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Solicitado por:</span>
                          <span className="font-medium">Usuário</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Data:</span>
                          <span className="font-medium">
                            {format(new Date(group.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveGroup(group.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectGroup(group.id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Grupos Aprovados</h2>
              <p className="text-sm text-gray-600">
                {groups.filter(g => g.status === 'approved').length} grupos ativos
              </p>
            </div>
            
            {groups.filter(g => g.status === 'approved').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum grupo aprovado ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.filter(g => g.status === 'approved').map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {group.description || 'Sem descrição'}
                          </CardDescription>
                          {getStatusBadge(group.status)}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Slug:</span>
                          <Badge variant="outline">{group.slug}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Criado por:</span>
                          <span className="font-medium">Admin</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Aprovado em:</span>
                          <span className="font-medium">
                            {format(new Date(group.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="pt-2">
                          <Link href={`/group/${group.slug}`}>
                            <Button size="sm" variant="outline" className="w-full">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Grupo
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Grupos Rejeitados</h2>
              <p className="text-sm text-gray-600">
                {groups.filter(g => g.status === 'rejected').length} grupos rejeitados
              </p>
            </div>
            
            {groups.filter(g => g.status === 'rejected').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum grupo rejeitado.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.filter(g => g.status === 'rejected').map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {group.description || 'Sem descrição'}
                          </CardDescription>
                          {getStatusBadge(group.status)}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveGroup(group.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Slug:</span>
                          <Badge variant="outline">{group.slug}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Solicitado por:</span>
                          <span className="font-medium">Usuário</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Rejeitado em:</span>
                          <span className="font-medium">
                            {format(new Date(group.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
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
  )
}