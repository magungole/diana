'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Camera, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand panel */}
      <div className="hidden lg:flex w-1/2 bg-brand flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 70%, #c8a96e 0%, transparent 50%), radial-gradient(circle at 70% 30%, #475569 0%, transparent 50%)',
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold/10 rounded-full" />
        <div className="absolute top-20 -left-10 w-40 h-40 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Diana Baker</p>
              <p className="text-white/50 text-sm">Business Coaching</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            &ldquo;Transform your photography passion into a thriving business.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/30 flex items-center justify-center text-gold font-semibold text-sm">
              DB
            </div>
            <div>
              <p className="text-white font-semibold">Diana Baker</p>
              <p className="text-white/60 text-sm">Business Coach for Photographers</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-white text-2xl font-bold">500+</p>
            <p className="text-white/60 text-sm">Photographers coached</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">95%</p>
            <p className="text-white/60 text-sm">See revenue increase</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">4.9★</p>
            <p className="text-white/60 text-sm">Average rating</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
            <p className="font-semibold text-brand">Diana Baker Business Coaching</p>
          </div>

          <h1 className="text-3xl font-bold text-brand mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your coaching portal</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-brand font-semibold hover:text-gold transition-colors"
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
