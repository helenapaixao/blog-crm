import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Hook for safe date formatting that prevents hydration mismatches
 * by ensuring consistent output between server and client
 */
export function useSafeDate(date: string | Date, formatString: string = 'dd/MM/yyyy') {
  const [formattedDate, setFormattedDate] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        setFormattedDate('Data inválida')
        return
      }
      
      if (formatString === 'dd/MM/yyyy') {
        const day = dateObj.getDate().toString().padStart(2, '0')
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
        const year = dateObj.getFullYear()
        setFormattedDate(`${day}/${month}/${year}`)
        return
      }
      
      setFormattedDate(format(dateObj, formatString, { locale: ptBR }))
    } catch (error) {
      console.error('Error formatting date:', error)
      setFormattedDate('Data inválida')
    }
  }, [date, formatString, isClient])

  // Return a consistent value during SSR
  if (!isClient) {
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
      return 'Data inválida'
    }
  }

  return formattedDate
}
