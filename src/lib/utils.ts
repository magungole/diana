import { clsx, type ClassValue } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy, h:mm a')
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatPrice(amount: number, currency = 'gbp') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function getLoomEmbedUrl(videoId: string) {
  return `https://www.loom.com/embed/${videoId}`
}

export function extractLoomId(url: string): string {
  // Handle both full URLs and bare IDs
  const match = url.match(/(?:loom\.com\/share\/|loom\.com\/embed\/)([a-zA-Z0-9]+)/)
  return match ? match[1] : url
}
