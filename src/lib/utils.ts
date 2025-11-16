import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string | null | undefined): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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
    
    return format(utcDate, formatString, { locale: ptBR })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Data inválida'
  }
}

let idCounter = 0
export function generateUniqueId(): string {

  idCounter++
  const fixedTimestamp = '1a2b3c'
  const counter = idCounter.toString(36)
  return `${fixedTimestamp}-${counter}`
}
