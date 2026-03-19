'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { User, CreditCard, Shield, Bell, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const businessStageOptions = [
  { value: 'just-starting', label: 'Just Starting Out' },
  { value: 'early-growth', label: 'Early Growth (0-2 years)' },
  { value: 'established', label: 'Established (2-5 years)' },
  { value: 'scaling', label: 'Scaling (5+ years)' },
]

export default function AccountPage() {
  const { data: session, update } = useSession()
  const userId = (session?.user as any)?.id || ''

  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    bio: '',
    niche: '',
    businessStage: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [subscription, setSubscription] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [billingLoading, setBillingLoading] = useState(false)

  const [notifSettings, setNotifSettings] = useState({
    newClasses: true,
    communityReplies: true,
    newMessages: true,
    weeklyDigest: false,
  })

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile({
            name: data.name || '',
            bio: data.bio || '',
            niche: data.niche || '',
            businessStage: data.businessStage || '',
          })
        }
      } catch {}
    }

    async function fetchBillingData() {
      setBillingLoading(true)
      try {
        const [subRes, purchasesRes] = await Promise.all([
          fetch('/api/user/subscription'),
          fetch('/api/user/purchases'),
        ])
        if (subRes.ok) setSubscription(await subRes.json())
        if (purchasesRes.ok) setPurchases(await purchasesRes.json())
      } finally {
        setBillingLoading(false)
      }
    }

    fetchUserData()
    fetchBillingData()
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSuccess(false)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setProfileSuccess(true)
        await update({ name: profile.name })
        setTimeout(() => setProfileSuccess(false), 3000)
      }
    } finally {
      setProfileLoading(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      if (res.ok) {
        setPasswordSuccess(true)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        const data = await res.json()
        setPasswordError(data.error || 'Failed to change password')
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div>
      <TopNav title="Account" />
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand mb-2">Account Settings</h1>
          <p className="text-slate-500">Manage your profile, billing, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 mb-6 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <div className="flex items-center gap-4 mb-8">
              <Avatar src={session?.user?.image} name={session?.user?.name || ''} size="xl" />
              <div>
                <h3 className="font-semibold text-brand text-lg">{session?.user?.name}</h3>
                <p className="text-slate-500 text-sm">{session?.user?.email}</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                  <CheckCircle2 size={16} />
                  Profile updated successfully!
                </div>
              )}

              <Input
                label="Full name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />

              <Textarea
                label="Bio"
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell other photographers about yourself..."
                rows={3}
              />

              <Input
                label="Photography niche"
                value={profile.niche}
                onChange={(e) => setProfile((p) => ({ ...p, niche: e.target.value }))}
                placeholder="e.g. Wedding, Portrait, Commercial..."
              />

              <Select
                label="Business stage"
                value={profile.businessStage}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, businessStage: e.target.value }))
                }
                options={businessStageOptions}
                placeholder="Select your stage..."
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={profileLoading}>
                  Save changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Current plan */}
            <Card>
              <h3 className="text-lg font-semibold text-brand mb-4">Current Plan</h3>
              {billingLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-gold border-t-transparent rounded-full" />
                </div>
              ) : subscription ? (
                <div>
                  <div className="flex items-center justify-between p-4 bg-cream rounded-xl mb-4">
                    <div>
                      <p className="font-semibold text-brand">Active Subscription</p>
                      <p className="text-sm text-slate-500">
                        Renews {subscription.currentPeriodEnd
                          ? formatDate(subscription.currentPeriodEnd)
                          : 'N/A'}
                      </p>
                    </div>
                    <Badge variant="success" size="md">
                      {subscription.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage subscription
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">You&apos;re on the free plan</p>
                  <Button variant="secondary" size="sm">
                    Upgrade your plan
                  </Button>
                </div>
              )}
            </Card>

            {/* Payment history */}
            <Card>
              <h3 className="text-lg font-semibold text-brand mb-4">Payment History</h3>
              {purchases.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No payment history yet
                </p>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase: any) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand">
                          {purchase.productType}
                        </p>
                        <p className="text-xs text-slate-400">
                          {purchase.createdAt ? formatDate(purchase.createdAt) : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand text-sm">
                          £{((purchase.amount || 0) / 100).toFixed(2)}
                        </p>
                        <Badge variant="success">{purchase.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <h3 className="text-lg font-semibold text-brand mb-6">Change Password</h3>
            <form onSubmit={changePassword} className="space-y-4 max-w-md">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                  <CheckCircle2 size={16} />
                  Password changed successfully!
                </div>
              )}
              <Input
                label="Current password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                required
              />
              <Input
                label="New password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                helperText="At least 8 characters"
                required
              />
              <Input
                label="Confirm new password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                required
              />
              <Button type="submit" loading={passwordLoading}>
                Update password
              </Button>
            </form>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <h3 className="text-lg font-semibold text-brand mb-6">
              Notification Preferences
            </h3>
            <div className="space-y-4 max-w-md">
              {[
                {
                  key: 'newClasses',
                  label: 'New class announcements',
                  description: 'Be notified when new classes are scheduled',
                },
                {
                  key: 'communityReplies',
                  label: 'Community replies',
                  description: 'When someone replies to your posts or comments',
                },
                {
                  key: 'newMessages',
                  label: 'Direct messages',
                  description: 'When you receive a new message',
                },
                {
                  key: 'weeklyDigest',
                  label: 'Weekly digest',
                  description: 'A weekly summary of community activity',
                },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-brand text-sm">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifSettings((prev) => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof prev],
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notifSettings[key as keyof typeof notifSettings]
                        ? 'bg-brand'
                        : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                        notifSettings[key as keyof typeof notifSettings]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
