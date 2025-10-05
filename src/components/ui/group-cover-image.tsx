'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface GroupCoverImageProps {
  coverImage?: string | null
  groupName: string
  className?: string
}

export function GroupCoverImage({ 
  coverImage, 
  groupName, 
  className = "h-48" 
}: GroupCoverImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  if (!coverImage || imageError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Sem imagem de capa</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-sm">Carregando imagem...</div>
        </div>
      )}
      
      <img 
        src={coverImage}
        alt={`Capa do grupo ${groupName}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  )
}
