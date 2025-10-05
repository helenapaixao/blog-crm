import { z } from 'zod'

// Schema para autenticação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
  fullName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
})

// Schema para posts
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim(),
  content: z
    .string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(50000, 'Conteúdo muito longo'),
  excerpt: z
    .string()
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  coverImage: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().min(1, 'Tag não pode estar vazia').max(50, 'Tag muito longa'))
    .max(10, 'Máximo de 10 tags permitidas')
    .default([]),
  groupId: z
    .string()
    .min(1, 'Selecione um grupo'),
  status: z
    .enum(['draft', 'pending'])
    .default('draft'),
})

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
})

// Schema para grupos
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_]+$/, 'Nome pode conter apenas letras, números, espaços, hífens e underscores'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(50, 'Slug deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9\-_]+$/, 'Slug pode conter apenas letras minúsculas, números, hífens e underscores')
    .transform((val) => val.toLowerCase()),
  coverImage: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .or(z.literal('')),
})

export const updateGroupSchema = createGroupSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
})

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comentário é obrigatório')
    .max(2000, 'Comentário deve ter no máximo 2000 caracteres')
    .trim(),
  postId: z.string().uuid('ID do post inválido'),
  parentId: z
    .string()
    .uuid('ID do comentário pai inválido')
    .optional()
    .nullable(),
})

export const updateCommentSchema = z.object({
  id: z.string().uuid('ID inválido'),
  content: z
    .string()
    .min(1, 'Comentário é obrigatório')
    .max(2000, 'Comentário deve ter no máximo 2000 caracteres')
    .trim(),
})

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .optional(),
  bio: z
    .string()
    .max(500, 'Biografia deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  avatarUrl: z
    .string()
    .url('URL do avatar inválida')
    .optional()
    .or(z.literal('')),
})

// Schema para busca
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Termo de busca é obrigatório')
    .max(100, 'Termo de busca muito longo')
    .trim(),
  type: z
    .enum(['posts', 'groups', 'users'])
    .default('posts'),
  page: z
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
})

// Schema para filtros de posts
export const postFiltersSchema = z.object({
  status: z
    .enum(['draft', 'pending', 'published', 'rejected'])
    .optional(),
  groupId: z
    .string()
    .uuid('ID do grupo inválido')
    .optional(),
  authorId: z
    .string()
    .uuid('ID do autor inválido')
    .optional(),
  tags: z
    .array(z.string())
    .optional(),
  dateFrom: z
    .string()
    .datetime('Data inválida')
    .optional(),
  dateTo: z
    .string()
    .datetime('Data inválida')
    .optional(),
  page: z
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
})

// Schema para configurações de admin
export const adminSettingsSchema = z.object({
  allowUserRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  allowAnonymousComments: z.boolean().default(false),
  maxPostsPerUser: z.number().int().min(1).max(1000).default(100),
  maxCommentsPerPost: z.number().int().min(1).max(10000).default(1000),
  moderationEnabled: z.boolean().default(true),
})

// Tipos TypeScript derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>
export type CreateGroupFormData = z.infer<typeof createGroupSchema>
export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type PostFiltersFormData = z.infer<typeof postFiltersSchema>
export type AdminSettingsFormData = z.infer<typeof adminSettingsSchema>

// Função utilitária para validação com mensagens customizadas
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ['Erro de validação'] } }
  }
}

// Função para validação assíncrona (útil para validações que dependem de APIs)
export async function validateWithZodAsync<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): Promise<{
  success: boolean
  data?: T
  errors?: Record<string, string[]>
}> {
  try {
    const result = await schema.parseAsync(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ['Erro de validação'] } }
  }
}
