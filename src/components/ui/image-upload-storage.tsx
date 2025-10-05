'use client'

import { useState, useRef, DragEvent } from 'react'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'
import { Card, CardContent } from './card'
import { Upload, X, Image as ImageIcon, Copy, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface ImageUploadStorageProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
  userId?: string
}

export function ImageUploadStorage({ 
  value, 
  onChange, 
  label = "Imagem", 
  placeholder = "URL da imagem ou arraste um arquivo",
  className = "",
  userId = "default"
}: ImageUploadStorageProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))

    if (imageFile) {
      await handleFileUpload(imageFile)
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now().toString(36)
      const randomPart = Math.random().toString(36).substr(2, 9)
      const uniqueId = `upload-${timestamp}-${randomPart}`
      const fileName = `${userId}/${uniqueId}.${fileExt}`
      
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('Image uploaded successfully, public URL:', publicUrl)
      onChange(publicUrl)
      toast.success('Imagem carregada com sucesso!')
      
    } catch (error) {
      console.error('Error uploading image:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(`Erro ao carregar a imagem: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        toast.success('URL copiada para a área de transferência!')
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error('Erro ao copiar URL')
      }
    }
  }

  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isBase64 = (str: string) => {
    return str.startsWith('data:image/')
  }

  const isUrl = (str: string) => {
    return str.startsWith('http://') || str.startsWith('https://')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="flex space-x-2">
      
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={isUploading}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-gray-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {isUploading 
                ? 'Fazendo upload da imagem...' 
                : 'Arraste uma imagem aqui ou clique para selecionar'
              }
            </p>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Selecionar
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {value && (
        <div className="relative group">
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
              onError={() => {
                toast.error('Erro ao carregar a imagem')
                onChange('')
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              {isBase64(value) ? 'Imagem carregada localmente' : 
               isUrl(value) ? 'Imagem externa' : 'URL inválida'}
            </span>
            <span>
              {isBase64(value) && 'Base64'}
              {isUrl(value) && !isBase64(value) && 'URL'}
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 5MB.</p>
        <p>Você pode colar uma URL ou arrastar um arquivo do seu computador.</p>
      </div>
    </div>
  )
}
