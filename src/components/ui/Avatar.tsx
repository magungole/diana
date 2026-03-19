import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex-shrink-0',
          sizes[size],
          className
        )}
      >
        <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
