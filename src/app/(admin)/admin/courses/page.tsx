'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { BookOpen, Plus, Edit2, Eye, EyeOff } from 'lucide-react'

const accessLevelOptions = [
  { value: 'free', label: 'Free' },
  { value: 'member', label: 'Member' },
  { value: 'premium', label: 'Premium' },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    accessLevel: 'member',
    order: '0',
    isPublished: false,
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    setLoading(true)
    try {
      const res = await fetch('/api/courses')
      if (res.ok) setCourses(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function saveCourse(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          order: parseInt(form.order),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setCourses((prev) => [...prev, data])
        setShowModal(false)
        setForm({
          title: '',
          description: '',
          thumbnail: '',
          accessLevel: 'member',
          order: '0',
          isPublished: false,
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const accessColors: Record<string, any> = {
    free: 'success',
    member: 'default',
    premium: 'gold',
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand mb-1">Courses</h1>
          <p className="text-slate-500">{courses.length} total courses</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Course
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center py-20">
          <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No courses yet</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-2" />
            Create your first course
          </Button>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Course
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Access
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => (
                  <tr
                    key={course.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-brand text-sm">{course.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-xs">
                          {course.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={accessColors[course.accessLevel] || 'default'}>
                        {course.accessLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.isPublished ? 'success' : 'warning'}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{course.order || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-xs text-brand hover:text-gold transition-colors font-medium">
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand transition-colors">
                          {course.isPublished ? (
                            <>
                              <EyeOff size={12} />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye size={12} />
                              Publish
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Course Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Course" size="lg">
        <form onSubmit={saveCourse} className="space-y-4">
          <Input
            label="Course title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            required
          />
          <Input
            label="Thumbnail URL"
            value={form.thumbnail}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
            placeholder="https://..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Access level"
              value={form.accessLevel}
              onChange={(e) => setForm((f) => ({ ...f, accessLevel: e.target.value }))}
              options={accessLevelOptions}
            />
            <Input
              label="Display order"
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </div>
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
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
