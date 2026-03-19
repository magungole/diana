'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Calendar, Plus, Edit2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

const categoryOptions = [
  { value: 'pricing', label: 'Pricing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'mindset', label: 'Mindset' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'general', label: 'General' },
]

const categoryColors: Record<string, any> = {
  pricing: 'gold',
  marketing: 'success',
  sales: 'default',
  mindset: 'warning',
  workflow: 'outline',
  general: 'default',
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    coachName: '',
    meetingLink: '',
    replayLoomId: '',
    category: 'general',
    isPublished: false,
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  async function fetchClasses() {
    setLoading(true)
    try {
      const res = await fetch('/api/classes')
      if (res.ok) setClasses(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function saveClass(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setClasses((prev) => [...prev, data])
        setShowModal(false)
        setForm({
          title: '',
          description: '',
          dateTime: '',
          coachName: '',
          meetingLink: '',
          replayLoomId: '',
          category: 'general',
          isPublished: false,
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const now = new Date()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand mb-1">Classes</h1>
          <p className="text-slate-500">{classes.length} total classes</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Class
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : classes.length === 0 ? (
        <Card className="text-center py-20">
          <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No classes yet</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-2" />
            Create your first class
          </Button>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Class
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Date & Time
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Replay
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls: any) => {
                  const isPast = cls.dateTime && new Date(cls.dateTime) <= now
                  return (
                    <tr
                      key={cls.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-brand text-sm">{cls.title}</p>
                        <p className="text-xs text-slate-400">{cls.coachName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {cls.dateTime ? formatDateTime(cls.dateTime) : '—'}
                        </span>
                        {isPast && (
                          <p className="text-xs text-slate-400">Past</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {cls.category && (
                          <Badge variant={categoryColors[cls.category] || 'default'}>
                            {cls.category}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={cls.isPublished ? 'success' : 'warning'}>
                          {cls.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {cls.replayLoomId ? (
                          <Badge variant="default">Has replay</Badge>
                        ) : (
                          <span className="text-xs text-slate-400">No replay</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 text-xs text-brand hover:text-gold transition-colors font-medium">
                          <Edit2 size={12} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Class Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Class" size="lg">
        <form onSubmit={saveClass} className="space-y-4">
          <Input
            label="Class title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date & time"
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
              required
            />
            <Input
              label="Coach name"
              value={form.coachName}
              onChange={(e) => setForm((f) => ({ ...f, coachName: e.target.value }))}
              placeholder="Diana Baker"
            />
          </div>
          <Input
            label="Meeting link"
            value={form.meetingLink}
            onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))}
            placeholder="https://zoom.us/j/..."
          />
          <Input
            label="Replay Loom ID (optional)"
            value={form.replayLoomId}
            onChange={(e) => setForm((f) => ({ ...f, replayLoomId: e.target.value }))}
            placeholder="loom video ID or share URL"
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            options={categoryOptions}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Publish immediately</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create Class
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
