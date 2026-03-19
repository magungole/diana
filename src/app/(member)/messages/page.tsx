'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { TopNav } from '@/components/layout/TopNav'
import { Avatar } from '@/components/ui/Avatar'
import { Send, MessageCircle } from 'lucide-react'
import { timeAgo, formatDateTime } from '@/lib/utils'
import type { Message } from '@/types'

interface Conversation {
  userId: string
  userName: string
  messages: Message[]
  lastMessage: Message
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id || ''
  const userName = session?.user?.name || 'You'

  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvo, setActiveConvo] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/messages')
        if (res.ok) {
          const data: Message[] = await res.json()
          setMessages(data)

          // Build conversations grouped by the other user
          const convoMap = new Map<string, Message[]>()
          data.forEach((msg) => {
            const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId
            const otherName = msg.fromUserId === userId ? msg.toUserId : msg.fromName
            const existing = convoMap.get(otherId) || []
            convoMap.set(otherId, [...existing, msg])
          })

          const convos: Conversation[] = []
          convoMap.forEach((msgs, otherId) => {
            const sorted = msgs.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
            const lastMsg = sorted[sorted.length - 1]
            const otherName =
              lastMsg.fromUserId === userId ? lastMsg.toUserId : lastMsg.fromName
            const unread = msgs.filter(
              (m) => m.toUserId === userId && !m.isRead
            ).length

            convos.push({
              userId: otherId,
              userName: otherName,
              messages: sorted,
              lastMessage: lastMsg,
              unreadCount: unread,
            })
          })

          convos.sort(
            (a, b) =>
              new Date(b.lastMessage.createdAt).getTime() -
              new Date(a.lastMessage.createdAt).getTime()
          )
          setConversations(convos)

          if (convos.length > 0 && !activeConvo) {
            setActiveConvo(convos[0].userId)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchMessages()
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvo, messages])

  const activeConversation = conversations.find((c) => c.userId === activeConvo)

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !activeConvo) return
    setSending(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: userId,
          toUserId: activeConvo,
          fromName: userName,
          content: newMessage,
        }),
      })

      if (res.ok) {
        const msg: Message = await res.json()
        setMessages((prev) => [...prev, msg])
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === activeConvo
              ? { ...c, messages: [...c.messages, msg], lastMessage: msg }
              : c
          )
        )
        setNewMessage('')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <TopNav title="Messages" />
      <div className="flex h-[calc(100vh-73px)]">
        {/* Conversation list */}
        <div className="w-72 bg-white border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-brand">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-gold border-t-transparent rounded-full" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle size={32} className="text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No messages yet</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.userId}
                  onClick={() => setActiveConvo(convo.userId)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-cream transition-colors text-left ${
                    activeConvo === convo.userId ? 'bg-cream' : ''
                  }`}
                >
                  <Avatar name={convo.userName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-brand text-sm truncate">
                        {convo.userName}
                      </p>
                      {convo.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-gold text-white text-xs flex items-center justify-center rounded-full font-medium flex-shrink-0">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {convo.lastMessage.content}
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {timeAgo(convo.lastMessage.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-cream">
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <Avatar name={activeConversation.userName} size="md" />
                <div>
                  <p className="font-semibold text-brand">{activeConversation.userName}</p>
                  <p className="text-xs text-slate-400">
                    {activeConversation.messages.length} messages
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeConversation.messages.map((msg) => {
                  const isMine = msg.fromUserId === userId
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}
                    >
                      {!isMine && <Avatar name={msg.fromName} size="sm" />}
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isMine ? 'items-end' : 'items-start'
                        } flex flex-col gap-1`}
                      >
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMine
                              ? 'bg-brand text-white rounded-br-sm'
                              : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p className="text-xs text-slate-400">
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form
                onSubmit={sendMessage}
                className="bg-white border-t border-slate-100 p-4 flex gap-3"
              >
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-11 h-11 bg-brand text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Select a conversation</p>
                <p className="text-slate-300 text-sm mt-1">
                  Choose a conversation from the left to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
