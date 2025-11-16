'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { ClientOnly } from '@/components/ui/client-only'
import { FeatureCard } from '@/components/ui/feature-card'
import { 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  FileText, 
  Shield, 
  Zap, 
  Globe,
  Heart,
  MessageCircle,
  TrendingUp,
  Palette,
  Smartphone,
  Lock,
  Sparkles,
  PenTool,
  BarChart3,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// Componente para animações de scroll
function FadeInOnScroll({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const { user } = useAuth()
  const [activeFeature, setActiveFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunidades Temáticas",
      description: "Crie ou participe de grupos temáticos sobre qualquer assunto. Organize discussões e encontre pessoas com os mesmos interesses."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Discussões Engajadas",
      description: "Participe de conversas ricas com sistema de comentários, curtidas e interações em tempo real."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Qualidade Garantida",
      description: "Sistema de aprovação mantém o conteúdo de alta qualidade e relevante para cada comunidade."
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Editor Poderoso",
      description: "Crie conteúdo rico com nosso editor moderno. Suporte a imagens, formatação avançada e muito mais."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Conteúdo em Destaque",
      description: "Descubra os posts mais populares e relevantes em cada comunidade temática."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Performance Excepcional",
      description: "Plataforma rápida e confiável construída com Next.js 15 e Supabase para a melhor experiência."
    }
  ]

  const stats = [
    { label: "Comunidades Ativas", value: "150+", icon: <Users className="h-5 w-5" /> },
    { label: "Usuários Engajados", value: "2,500+", icon: <Heart className="h-5 w-5" /> },
    { label: "Discussões Diárias", value: "500+", icon: <MessageCircle className="h-5 w-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Shield className="h-5 w-5" /> }
  ]

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Criadora de Conteúdo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "Finalmente uma plataforma brasileira para comunidades! A interface é moderna e o engajamento é incrível.",
      rating: 5
    },
    {
      name: "Carlos Santos",
      role: "Moderador de Comunidade",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "O sistema de aprovação facilita muito a moderação. Nossa comunidade está mais organizada e com conteúdo de qualidade.",
      rating: 5
    },
    {
      name: "Mariana Costa",
      role: "Entusiasta de Tecnologia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "Adorei encontrar comunidades sobre meus interesses! A plataforma é rápida e as discussões são muito engajadas.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300 hover:bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Users className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-indigo-700">
                ComunidadeBR
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="transition-all duration-300 hover:scale-105">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      Começar Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <FadeInOnScroll delay={0}>
              <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 transition-all duration-300 hover:scale-105 inline-flex items-center hover:shadow-lg">
                <Sparkles className="h-3 w-3 mr-1 animate-spin-slow" />
                Plataforma Brasileira de Comunidades
              </Badge>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={200}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
                Conecte-se com
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  comunidades temáticas
                </span>
              </h1>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={400}>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                A plataforma moderna para criar e participar de comunidades sobre qualquer assunto. 
                Discuta, compartilhe conhecimento e encontre pessoas com os mesmos interesses.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={user ? "/dashboard" : "/auth/register"}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg border-2"
                  >
                    Entrar na Comunidade
                  </Button>
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeInOnScroll key={index} delay={index * 100}>
                <div className="text-center group cursor-default">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:from-blue-200 group-hover:to-indigo-200">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:scale-110">
                    <ClientOnly fallback={<span>{stat.value}</span>}>
                      <AnimatedCounter 
                        end={stat.value.includes('+') ? parseInt(stat.value.replace(/[+,]/g, '')) : parseFloat(stat.value.replace('%', ''))} 
                        suffix={stat.value.includes('%') ? '%' : stat.value.includes('+') ? '+' : ''}
                      />
                    </ClientOnly>
                  </div>
                  <div className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">{stat.label}</div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInOnScroll delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Uma experiência moderna de comunidades temáticas, com foco em qualidade, engajamento e conteúdo relevante.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInOnScroll key={index} delay={index * 100}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInOnScroll delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                O que nossa comunidade diz
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Milhares de pessoas já estão conectadas e participando de discussões incríveis.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInOnScroll key={index} delay={index * 150}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 text-yellow-400 fill-current transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                    <p className="text-white/90 mb-6 leading-relaxed transition-all duration-300 group-hover:text-white">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3 transition-all duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/50">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white transition-all duration-300 group-hover:scale-105">{testimonial.name}</div>
                        <div className="text-blue-200 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInOnScroll delay={0}>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4 transition-all duration-300 group-hover:scale-105">
                  Pronto para fazer parte da comunidade?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Junte-se a milhares de pessoas que já estão participando de discussões incríveis e descobrindo comunidades temáticas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={user ? "/dashboard" : "/auth/register"}>
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="px-8 py-4 text-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group/btn"
                    >
                      Criar Conta Grátis
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                    >
                      Fazer Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInOnScroll delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4 group cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Users className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-xl font-bold transition-all duration-300 group-hover:text-blue-400">ComunidadeBR</span>
                </div>
                <p className="text-gray-400">
                  A plataforma brasileira de comunidades temáticas. Conecte-se, discuta e compartilhe conhecimento.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Produto</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Recursos
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Preços
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Suporte</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Documentação
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Termos
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ComunidadeBR. Todos os direitos reservados.</p>
            </div>
          </FadeInOnScroll>
        </div>
      </footer>
    </div>
  )
}
