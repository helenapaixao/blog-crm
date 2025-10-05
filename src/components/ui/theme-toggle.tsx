'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function ThemeToggle({ 
  className = '', 
  variant = 'ghost',
  size = 'default'
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`${className} transition-colors`}
      aria-label={`Alterar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
    </Button>
  )
}
