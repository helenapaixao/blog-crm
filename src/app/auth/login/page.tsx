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
import { Users, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations'

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

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMounted])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        toast.error('Erro ao fazer login: ' + error.message)
        setLoading(false)
      } else {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login')
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
      
      {isMounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const left = ((i * 7 + 13) % 100)
            const top = ((i * 11 + 17) % 100)
            const delay = ((i * 3) % 5)
            const duration = 10 + ((i * 2) % 10)
            
            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              />
            )
          })}
        </div>
      )}

      <div className="max-w-md w-full space-y-8 relative z-10">
        <FadeIn delay={0}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              Bem-vindo de volta!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
                crie uma nova conta
              </Link>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">Login</CardTitle>
              </div>
              <CardDescription>
                Digite suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    placeholder="Sua senha"
                    className={`h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Entrar
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
