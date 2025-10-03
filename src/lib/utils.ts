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
    // Ensure the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida'
    }
    return format(dateObj, formatString, { locale: ptBR })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Data inválida'
  }
}
