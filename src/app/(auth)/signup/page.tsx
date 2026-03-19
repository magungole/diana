'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Camera, Eye, EyeOff } from 'lucide-react'

const businessStageOptions = [
  { value: 'just-starting', label: 'Just Starting Out' },
  { value: 'early-growth', label: 'Early Growth (0-2 years)' },
  { value: 'established', label: 'Established (2-5 years)' },
  { value: 'scaling', label: 'Scaling (5+ years)' },
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    niche: '',
    businessStage: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          niche: formData.niche,
          businessStage: formData.businessStage,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      // Sign in automatically
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInRes?.error) {
        setError('Account created but sign-in failed. Please log in.')
        router.push('/login')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
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
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold/10 rounded-full" />

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

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-white text-3xl font-bold mb-4">
              Join 500+ photographers building their dream businesses
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Get access to expert-led courses, live group coaching, and a supportive
              community of photographers at every stage.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Expert-led courses on pricing, marketing & sales',
              'Weekly live group coaching calls',
              'Private community of like-minded photographers',
              'Done-for-you templates and resources',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-white/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-white text-2xl font-bold">Free</p>
            <p className="text-white/60 text-sm">To get started</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">Instant</p>
            <p className="text-white/60 text-sm">Access</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
            <p className="font-semibold text-brand">Diana Baker Business Coaching</p>
          </div>

          <h1 className="text-3xl font-bold text-brand mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Start your photography business journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Sarah Johnson"
              required
            />

            <Input
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Min. 8 characters"
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

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              label="Photography niche"
              type="text"
              value={formData.niche}
              onChange={(e) => updateField('niche', e.target.value)}
              placeholder="e.g. Wedding, Portrait, Commercial..."
              helperText="Optional — helps us personalise your experience"
            />

            <Select
              label="Business stage"
              value={formData.businessStage}
              onChange={(e) => updateField('businessStage', e.target.value)}
              options={businessStageOptions}
              placeholder="Select your stage..."
            />

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-brand font-semibold hover:text-gold transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
