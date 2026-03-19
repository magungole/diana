'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { timeAgo } from '@/lib/utils'
import { Heart, MessageCircle, Pin, Send, ChevronDown, ChevronUp } from 'lucide-react'
import type { CommunityPost, Comment } from '@/types'

const categories = [
  { value: 'all', label: 'All Topics' },
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

function PostCard({
  post,
  userId,
  userName,
}: {
  post: CommunityPost
  userId: string
  userName: string
}) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likesCount || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [posting, setPosting] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  async function handleLike() {
    if (liked) return
    setLiked(true)
    setLikes((prev) => prev + 1)
    await fetch(`/api/community/${post.id}/like`, { method: 'POST' })
  }

  async function loadComments() {
    if (comments.length > 0) {
      setShowComments(!showComments)
      return
    }
    setLoadingComments(true)
    setShowComments(true)
    const res = await fetch(`/api/community/${post.id}/comments`)
    if (res.ok) {
      const data = await res.json()
      setComments(data)
    }
    setLoadingComments(false)
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    setPosting(true)
    const res = await fetch(`/api/community/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentText, userId, userName }),
    })
    if (res.ok) {
      const data = await res.json()
      setComments((prev) => [...prev, data])
      setCommentText('')
    }
    setPosting(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-gold font-medium mb-3 -mt-1">
          <Pin size={12} />
          Pinned post
        </div>
      )}

      {/* Post header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={post.userPhoto} name={post.userName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-brand text-sm">{post.userName}</p>
            <Badge variant={categoryColors[post.category] || 'default'}>
              {post.category}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-rose-500' : ''} />
          {likes > 0 && <span>{likes}</span>}
        </button>
        <button
          onClick={loadComments}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand transition-colors"
        >
          <MessageCircle size={16} />
          {(post.commentCount || 0) > 0 && <span>{post.commentCount}</span>}
          Comments
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-gold border-t-transparent rounded-full" />
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar name={comment.userName} size="sm" />
                <div className="flex-1 bg-cream rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-brand">{comment.userName}</p>
                    <p className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm text-slate-600">{comment.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Comment form */}
          <form onSubmit={submitComment} className="flex gap-3 mt-3">
            <Avatar name={userName} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 text-sm bg-cream border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className="p-2 bg-brand text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </Card>
  )
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id || ''
  const userName = session?.user?.name || 'Anonymous'

  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const url =
          activeCategory === 'all'
            ? '/api/community'
            : `/api/community?category=${activeCategory}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [activeCategory])

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!newPost.trim()) return
    setPosting(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost,
          category: newCategory,
          userId,
          userName,
          userPhoto: session?.user?.image || '',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setPosts((prev) => [data, ...prev])
        setNewPost('')
        setNewCategory('general')
      }
    } finally {
      setPosting(false)
    }
  }

  const pinnedPosts = posts.filter((p) => p.isPinned)
  const regularPosts = posts.filter((p) => !p.isPinned)

  return (
    <div>
      <TopNav title="Community" />
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand mb-2">Community</h1>
          <p className="text-slate-500">
            Connect, share, and grow together with fellow photographers
          </p>
        </div>

        {/* New post composer */}
        <Card className="mb-6">
          <div className="flex items-start gap-3">
            <Avatar src={session?.user?.image} name={userName} size="md" />
            <form onSubmit={submitPost} className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with the community..."
                rows={3}
                className="mb-3"
              />
              <div className="flex items-center justify-between">
                <Select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  options={categories.slice(1)}
                  className="w-40"
                />
                <Button
                  type="submit"
                  loading={posting}
                  disabled={!newPost.trim()}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-16">
            <MessageCircle size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No posts yet</p>
            <p className="text-slate-300 text-sm mt-1">Be the first to start a conversation!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Pinned posts */}
            {pinnedPosts.map((post) => (
              <PostCard key={post.id} post={post} userId={userId} userName={userName} />
            ))}
            {/* Regular posts */}
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} userId={userId} userName={userName} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
