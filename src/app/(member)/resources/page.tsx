'use client'
import { useState, useEffect } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Download, FileText, FileImage, Film, File, FolderOpen } from 'lucide-react'
import type { Resource } from '@/types'

const categories = ['all', 'pricing', 'marketing', 'templates', 'worksheets', 'guides', 'other']

const accessLevelColors: Record<string, any> = {
  free: 'success',
  member: 'default',
  premium: 'gold',
}

function getFileIcon(fileType?: string) {
  if (!fileType) return File
  const type = fileType.toLowerCase()
  if (type.includes('image') || type.includes('jpg') || type.includes('png')) return FileImage
  if (type.includes('video') || type.includes('mp4')) return Film
  if (type.includes('pdf') || type.includes('doc')) return FileText
  return File
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      try {
        const url =
          activeCategory === 'all'
            ? '/api/resources'
            : `/api/resources?category=${activeCategory}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setResources(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [activeCategory])

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <TopNav title="Resources" />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand mb-2">Resource Library</h1>
          <p className="text-slate-500">
            Templates, guides, worksheets, and tools to help your business grow
          </p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-20">
            <FolderOpen size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              {search ? 'No results found' : 'No resources yet'}
            </h3>
            <p className="text-slate-300 text-sm">
              {search
                ? `Try a different search term`
                : 'Resources will be added here soon'}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((resource: Resource) => {
              const Icon = getFileIcon(resource.fileType)
              return (
                <Card
                  key={resource.id}
                  hover
                  className="flex flex-col group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <Icon size={22} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-brand text-sm leading-snug">
                          {resource.title}
                        </h3>
                        <Badge
                          variant={accessLevelColors[resource.accessLevel] || 'default'}
                          className="flex-shrink-0"
                        >
                          {resource.accessLevel}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed mb-3">
                        {resource.description}
                      </p>
                      {resource.category && (
                        <Badge variant="outline" className="mb-3 capitalize">
                          {resource.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
