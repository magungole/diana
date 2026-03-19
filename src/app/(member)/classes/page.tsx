import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedClasses } from '@/lib/airtable'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime, formatDate } from '@/lib/utils'
import { Calendar, Clock, Video, ExternalLink, PlayCircle } from 'lucide-react'
import { getLoomEmbedUrl } from '@/lib/utils'

export default async function ClassesPage() {
  let classes: any[] = []
  try {
    classes = await getPublishedClasses()
  } catch (error) {
    console.error('Classes fetch error:', error)
  }

  const now = new Date()
  const upcoming = classes.filter((c) => new Date(c.dateTime) > now)
  const past = classes.filter((c) => new Date(c.dateTime) <= now)

  const categoryColors: Record<string, any> = {
    pricing: 'gold',
    marketing: 'success',
    sales: 'default',
    mindset: 'warning',
    workflow: 'outline',
    general: 'default',
  }

  return (
    <div>
      <TopNav title="Classes" />
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand mb-2">Live Classes</h1>
          <p className="text-slate-500">
            Join live coaching sessions and watch replays at any time
          </p>
        </div>

        {/* Upcoming Classes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-brand mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-gold" />
            Upcoming Classes ({upcoming.length})
          </h2>

          {upcoming.length === 0 ? (
            <Card className="text-center py-12">
              <Calendar size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">No upcoming classes scheduled</p>
              <p className="text-slate-300 text-sm mt-1">
                Check back soon for new sessions
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcoming.map((cls: any) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {/* Date box */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="bg-brand rounded-xl p-2">
                        <p className="text-gold text-xs font-medium">
                          {new Date(cls.dateTime).toLocaleString('en-GB', { month: 'short' })}
                        </p>
                        <p className="text-white text-2xl font-bold">
                          {new Date(cls.dateTime).getDate()}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-brand text-lg mb-1">
                            {cls.title}
                          </h3>
                          <p className="text-slate-500 text-sm mb-3">{cls.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatDateTime(cls.dateTime)}
                            </span>
                            {cls.coachName && (
                              <span>with {cls.coachName}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {cls.category && (
                            <Badge variant={categoryColors[cls.category] || 'default'}>
                              {cls.category}
                            </Badge>
                          )}
                          {cls.meetingLink && (
                            <a
                              href={cls.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                            >
                              <ExternalLink size={14} />
                              Join
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Classes with Replays */}
        <section>
          <h2 className="text-xl font-semibold text-brand mb-4 flex items-center gap-2">
            <Video size={20} className="text-gold" />
            Past Classes & Replays ({past.length})
          </h2>

          {past.length === 0 ? (
            <Card className="text-center py-12">
              <Video size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">No past classes yet</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {past.map((cls: any) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PlayCircle size={22} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand mb-1 truncate">{cls.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">{formatDate(cls.dateTime)}</p>
                      {cls.category && (
                        <Badge variant={categoryColors[cls.category] || 'default'} className="mb-3">
                          {cls.category}
                        </Badge>
                      )}
                      {cls.replayLoomId ? (
                        <a
                          href={getLoomEmbedUrl(cls.replayLoomId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-gold hover:underline font-medium"
                        >
                          <PlayCircle size={14} />
                          Watch replay
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Replay coming soon</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
