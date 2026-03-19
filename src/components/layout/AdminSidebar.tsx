'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  CreditCard,
  LogOut,
  Camera,
  ExternalLink,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/classes', label: 'Classes', icon: Calendar },
  { href: '/admin/community', label: 'Community', icon: MessageSquare },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
          <Camera size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">Admin Panel</p>
          <p className="text-white/50 text-xs mt-0.5">Diana Baker Coaching</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Back to member portal */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink size={18} />
          Member Portal
        </Link>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar src={user?.image} name={user?.name || ''} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gold text-xs truncate">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
