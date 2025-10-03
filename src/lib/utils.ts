import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe date formatting that prevents hydration mismatches
export function formatDate(date: string | Date, formatString: string = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida'
    }
    
    if (formatString === 'dd/MM/yyyy') {
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const year = dateObj.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    return format(dateObj, formatString, { locale: ptBR })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Data inválida'
  }
}
