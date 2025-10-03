'use client'

import { useState, useRef, DragEvent } from 'react'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'
import { Card, CardContent } from './card'
import { Upload, X, Image as ImageIcon, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Imagem", 
  placeholder = "URL da imagem ou arraste um arquivo",
  className = ""
}: ImageUploadProps) {
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

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setIsUploading(true)

    try {
      const base64 = await convertToBase64(file)
      onChange(base64)
      toast.success('Imagem carregada com sucesso!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Erro ao carregar a imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
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

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
 
      <div className="flex space-x-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
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

      {/* File Upload Area */}
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
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="h-6 w-6 text-gray-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {isUploading 
                ? 'Carregando imagem...' 
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
              Selecionar Arquivo
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

      {/* Image Preview */}
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
          <p className="text-xs text-gray-500 mt-1">
            Clique na imagem para removê-la
          </p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 5MB.
      </p>
    </div>
  )
}
