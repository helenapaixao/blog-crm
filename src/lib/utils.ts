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
    
    // Use consistent formatting to prevent hydration mismatches
    // Always use UTC to avoid timezone differences between server and client
    const utcDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000)
    
    if (formatString === 'dd/MM/yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = (utcDate.getMonth() + 1).toString().padStart(2, '0')
      const year = utcDate.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    if (formatString === 'dd MMM yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = utcDate.toLocaleDateString('pt-BR', { month: 'short' })
      const year = utcDate.getFullYear()
      return `${day} ${month} ${year}`
    }
    
    if (formatString === 'dd MMMM yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = utcDate.toLocaleDateString('pt-BR', { month: 'long' })
      const year = utcDate.getFullYear()
      return `${day} ${month} ${year}`
    }
    
    if (formatString === 'MMMM yyyy') {
      const month = utcDate.toLocaleDateString('pt-BR', { month: 'long' })
      const year = utcDate.getFullYear()
      return `${month} ${year}`
    }
    
    if (formatString === 'MMM yyyy') {
      const month = utcDate.toLocaleDateString('pt-BR', { month: 'short' })
      const year = utcDate.getFullYear()
      return `${month} ${year}`
    }
    
    // For other formats, use date-fns with consistent locale
    return format(utcDate, formatString, { locale: ptBR })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Data inválida'
  }
}

// Generate a consistent unique ID that works in both server and client
let idCounter = 0
export function generateUniqueId(): string {
  // Use a simple counter-based approach for consistency
  // This prevents hydration mismatches by being deterministic
  idCounter++
  const timestamp = Math.floor(Date.now() / 1000).toString(36) // Use seconds instead of milliseconds
  const counter = idCounter.toString(36)
  return `${timestamp}-${counter}`
}
