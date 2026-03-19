'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Camera, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // In production: send password reset email
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
            <Camera size={16} className="text-white" />
          </div>
          <p className="font-semibold text-brand">Diana Baker Business Coaching</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password
              reset link.
            </p>
            <Link href="/login" className="text-brand font-medium hover:text-gold transition-colors">
              Back to sign in
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-bold text-brand mb-2">Reset your password</h1>
            <p className="text-slate-500 mb-6 text-sm">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send reset link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
