import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ className, children, padding = 'md', hover = false }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm',
        hover &&
          'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
