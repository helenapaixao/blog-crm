'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Users, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/lib/validations'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { signUp } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const password = watch('password')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)

    try {
      const { error } = await signUp(data.email, data.password, data.fullName)
      
      if (error) {
        toast.error('Erro ao criar conta: ' + error.message)
      } else {
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.')
        router.push('/auth/login')
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <FadeIn delay={0}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg animate-pulse">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              Junte-se à comunidade!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
                entre na sua conta existente
              </Link>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">Cadastro</CardTitle>
              </div>
              <CardDescription>
                Preencha os dados para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Nome completo</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    placeholder="Seu nome completo"
                    className={`h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.fullName.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="seu@email.com"
                    className={`h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Senha</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Mínimo 6 caracteres"
                    className={`h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.password ? (
                    <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password.message}</span>
                    </p>
                  ) : password && password.length >= 6 ? (
                    <p className="text-xs text-green-600 flex items-center space-x-1 mt-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Senha válida</span>
                    </p>
                  ) : password && password.length > 0 && password.length < 6 ? (
                    <p className="text-xs text-amber-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>A senha deve ter pelo menos 6 caracteres</span>
                    </p>
                  ) : null}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando conta...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Criar conta
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:translate-x-[-4px] inline-flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              Voltar para o início
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
