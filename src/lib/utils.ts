import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatString: string = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida'
    }
    const utcDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000)
    
    if (formatString === 'dd/MM/yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = (utcDate.getMonth() + 1).toString().padStart(2, '0')
      const year = utcDate.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    const monthNames = {
      short: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      long: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    }
    
    if (formatString === 'dd MMM yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = monthNames.short[utcDate.getMonth()]
      const year = utcDate.getFullYear()
      return `${day} ${month} ${year}`
    }
    
    if (formatString === 'dd MMMM yyyy') {
      const day = utcDate.getDate().toString().padStart(2, '0')
      const month = monthNames.long[utcDate.getMonth()]
      const year = utcDate.getFullYear()
      return `${day} ${month} ${year}`
    }
    
    if (formatString === 'MMMM yyyy') {
      const month = monthNames.long[utcDate.getMonth()]
      const year = utcDate.getFullYear()
      return `${month} ${year}`
    }
    
    if (formatString === 'MMM yyyy') {
      const month = monthNames.short[utcDate.getMonth()]
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
  // Use a fixed timestamp to prevent hydration mismatches
  // In production, you might want to use a proper UUID library
  const fixedTimestamp = '1a2b3c' // Fixed value to prevent hydration issues
  const counter = idCounter.toString(36)
  return `${fixedTimestamp}-${counter}`
}
