'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import {
  Send,
  MessageSquare,
  Loader2,
  ShieldCheck,
  User,
  Headphones,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

function BrandMessagesContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const recipientId = searchParams.get('recipient')

  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string>('')
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  const loadConversations = async () => {
    try {
      const url = recipientId
        ? `/api/messages?recipientId=${encodeURIComponent(recipientId)}`
        : '/api/messages'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        const convList = data.conversations || []
        setConversations(convList)

        if (convList.length > 0) {
          if (recipientId) {
            const target = convList.find((c: any) =>
              c.participants?.some(
                (p: any) => (p.userId?._id || p.userId) === recipientId
              )
            )
            if (target) {
              setActiveConvId(target._id)
            } else if (!activeConvId) {
              setActiveConvId(convList[0]._id)
            }
          } else if (!activeConvId) {
            setActiveConvId(convList[0]._id)
          }
        }
      }
    } catch (err) {
      console.error('Load conversations error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
    const timer = setInterval(loadConversations, 30000)
    return () => clearInterval(timer)
  }, [recipientId])

  // Fetch messages for active conversation
  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Load messages error:', err)
    }
  }

  useEffect(() => {
    if (!activeConvId) return
    loadMessages(activeConvId)
    const interval = setInterval(() => loadMessages(activeConvId), 5000)
    return () => clearInterval(interval)
  }, [activeConvId])

  // Auto-scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      setSending(true)
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId || undefined,
          recipientId: recipientId || undefined,
          content: text.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          setMessages((prev) => [...prev, data.message])
        }
        if (data.conversationId && !activeConvId) {
          setActiveConvId(data.conversationId)
        }
        setText('')

        // Update last message in local sidebar immediately
        setConversations((prev) =>
          prev.map((c) =>
            c._id === (activeConvId || data.conversationId)
              ? {
                  ...c,
                  lastMessage: {
                    content: text.trim(),
                    sentAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : c
          )
        )
      } else {
        const errJson = await res.json().catch(() => ({}))
        toast.error(errJson.error || 'Failed to send message')
      }
    } catch (err) {
      console.error('Send message error:', err)
      toast.error('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const activeConv = conversations.find((c) => c._id === activeConvId)
  const otherParticipant = activeConv?.participants?.find(
    (p: any) => (p.userId?._id || p.userId) !== session?.user?.id
  )
  const isSupportActive = otherParticipant?.role === 'ADMIN'
  const activePartnerName = isSupportActive
    ? 'Platform Support & Operations'
    : otherParticipant?.userId?.name || 'Collaboration Partner'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Direct Collaboration Messages
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Coordinate content deliverables, schedules, and vehicle wrap branding guidelines.
        </p>
      </div>

      <div className="h-[650px] rounded-3xl border bg-card shadow-sm grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* Left Sidebar: Conversations */}
        <div className="border-r border-border flex flex-col h-full bg-muted/10">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversations
            </span>
            <Badge variant="outline" className="text-[10px] font-bold">
              {conversations.length} Active
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary mb-2" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="font-semibold text-foreground">No conversations yet</p>
                <p>Reach out to creators, vehicle partners, or platform operations to begin.</p>
              </div>
            ) : (
              conversations.map((c) => {
                const otherP = c.participants?.find(
                  (p: any) => (p.userId?._id || p.userId) !== session?.user?.id
                )
                const isSupport = otherP?.role === 'ADMIN'
                const other = otherP?.userId
                const displayName = isSupport
                  ? 'Platform Support & Operations'
                  : other?.name || 'Collaboration Partner'
                const isSelected = c._id === activeConvId

                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveConvId(c._id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback
                          className={`text-xs font-bold ${
                            isSupport
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {isSupport ? <Headphones className="h-4 w-4" /> : getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {displayName}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {c.lastMessage?.sentAt
                              ? formatDate(c.lastMessage.sentAt, 'relative')
                              : ''}
                          </span>
                        </div>
                        {isSupport && (
                          <span className="inline-block text-[9px] font-bold text-primary tracking-wide">
                            OFFICIAL SUPPORT
                          </span>
                        )}
                        {c.campaignId?.name && (
                          <p className="text-[10px] font-medium text-primary/80 truncate">
                            {c.campaignId.name}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground truncate">
                          {c.lastMessage?.content || 'Started conversation'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full bg-card">
          {activeConvId || recipientId ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b flex items-center justify-between bg-muted/10">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={`text-xs font-bold ${
                        isSupportActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isSupportActive ? <Headphones className="h-4 w-4" /> : getInitials(activePartnerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {activePartnerName}
                      {isSupportActive && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-primary/15 text-primary border-primary/20">
                          Verified Support
                        </Badge>
                      )}
                    </h3>
                    {otherParticipant?.role && !isSupportActive && (
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {otherParticipant.role.toLowerCase().replace('_', ' ')}
                      </p>
                    )}
                  </div>
                </div>
                {activeConv?.campaignId?.name && (
                  <Badge variant="outline" className="text-[10px]">
                    {activeConv.campaignId.name}
                  </Badge>
                )}
              </div>

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center px-4">
                    Send a message to begin collaborating on campaigns and requirements.
                  </div>
                ) : (
                  messages.map((m) => {
                    const senderObjId = m.senderId?._id || m.senderId
                    const isMe = senderObjId === session?.user?.id
                    const isSenderAdmin = m.senderRole === 'ADMIN'

                    return (
                      <div
                        key={m._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-xs ${
                            isMe
                              ? 'bg-primary text-white rounded-br-none'
                              : isSenderAdmin
                              ? 'bg-primary/10 border border-primary/20 rounded-bl-none text-foreground'
                              : 'bg-muted rounded-bl-none text-foreground'
                          }`}
                        >
                          {!isMe && (
                            <span className="font-bold text-[10px] block opacity-80 mb-0.5">
                              {isSenderAdmin
                                ? 'Platform Support'
                                : m.senderId?.name || 'Partner'}
                            </span>
                          )}
                          <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                          <span
                            className={`text-[9px] mt-1 block text-right ${
                              isMe ? 'text-primary-foreground/75' : 'text-muted-foreground'
                            }`}
                          >
                            {formatDate(m.createdAt, 'relative')}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input row */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t flex items-center gap-2 bg-card"
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message or campaign update..."
                  className="flex-1 h-10 rounded-xl text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={sending || !text.trim()}
                  className="h-10 rounded-xl bg-primary text-white px-4"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground space-y-2 p-8 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
              <p className="font-semibold text-foreground">Select a conversation</p>
              <p>Choose an ongoing thread from the left to read and send messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BrandMessagesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BrandMessagesContent />
    </React.Suspense>
  )
}
