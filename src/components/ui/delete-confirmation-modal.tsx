'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  itemName: string
  isLoading?: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error during deletion:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-2 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-red-600 animate-bounce" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            {description || `Tem certeza que deseja deletar "${itemName}"?`}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="ml-3 text-sm">
              <p className="font-semibold text-red-900 mb-2">⚠️ Ação Irreversível</p>
              <p className="text-red-800 leading-relaxed">
                Todos os dados relacionados a este item serão permanentemente removidos do sistema. 
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 px-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting || isLoading}
            className="w-full sm:w-auto h-11 text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="w-full sm:w-auto h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isDeleting || isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Sim
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
