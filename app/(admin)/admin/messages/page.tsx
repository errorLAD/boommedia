'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Inbox,
  Search,
  Send,
  Building2,
  Users,
  Truck,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export default function AdminUnifiedMessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string>('')
  const [messages, setMessages] = useState<any[]>([])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadConversations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/messages')
      if (res.ok) {
        const json = await res.json()
        const convs = json.conversations || []
        setConversations(convs)
        if (convs.length > 0 && !activeConvId) {
          setActiveConvId(convs[0]._id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
    const timer = setInterval(loadConversations, 30000)
    return () => clearInterval(timer)
  }, [])

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const json = await res.json()
        setMessages(json.messages || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!activeConvId) return
    loadMessages(activeConvId)
    const timer = setInterval(() => loadMessages(activeConvId), 5000)
    return () => clearInterval(timer)
  }, [activeConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !activeConvId) return

    try {
      setSending(true)
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: replyText.trim(),
        }),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.message) {
          setMessages((prev) => [...prev, json.message])
        }
        setReplyText('')

        // Update lastMessage locally
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConvId
              ? {
                  ...c,
                  lastMessage: {
                    content: replyText.trim(),
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
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const activeConv = conversations.find((c) => c._id === activeConvId)
  const filteredConvs = conversations.filter((c) => {
    if (!search) return true
    const term = search.toLowerCase()
    const participantNames = c.participants
      ?.map((p: any) => p.userId?.name || '')
      .join(' ')
      .toLowerCase()
    const participantEmails = c.participants
      ?.map((p: any) => p.userId?.email || '')
      .join(' ')
      .toLowerCase()
    const participantRoles = c.participants
      ?.map((p: any) => p.role || '')
      .join(' ')
      .toLowerCase()
    return (
      c.campaignId?.name?.toLowerCase().includes(term) ||
      c.lastMessage?.content?.toLowerCase().includes(term) ||
      participantNames?.includes(term) ||
      participantEmails?.includes(term) ||
      participantRoles?.includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Central Multi-Party Messaging Hub
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Universal inbox spanning Brands, Content Creators, and Fleet Partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Conversations list */}
        <Card className="rounded-2xl border flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search conversations, names, roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl text-xs"
              />
            </div>
            <Badge variant="outline" className="text-[10px] font-bold">
              {filteredConvs.length}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                Loading conversations...
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground px-4">
                No conversations found.
              </div>
            ) : (
              filteredConvs.map((c) => {
                const isSelected = c._id === activeConvId
                const nonAdminParticipants =
                  c.participants?.filter((p: any) => p.role !== 'ADMIN') || []
                const counterparties =
                  nonAdminParticipants.length > 0
                    ? nonAdminParticipants
                        .map((p: any) => p.userId?.name || p.role)
                        .join(' & ')
                    : c.participants
                        ?.map((p: any) => p.userId?.name || p.role)
                        .join(' & ') || 'Platform Thread'

                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveConvId(c._id)}
                    className={`p-3 cursor-pointer text-xs space-y-1 transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground truncate max-w-[170px]">
                        {counterparties}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(c.updatedAt, 'relative')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {nonAdminParticipants.map((p: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 capitalize"
                        >
                          {p.role?.toLowerCase().replace('_', ' ')}
                        </Badge>
                      ))}
                      {c.campaignId?.name && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          • {c.campaignId.name}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate">
                      {c.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        {/* Right: Messages Thread */}
        <Card className="rounded-2xl border md:col-span-2 flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">
                      {activeConv.participants
                        ?.filter((p: any) => p.role !== 'ADMIN')
                        .map((p: any) => p.userId?.name || p.userId?.email || p.role)
                        .join(' & ') || 'General Platform Channel'}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      ADMIN INTERVENTION
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    {activeConv.campaignId?.name && (
                      <span>Campaign: {activeConv.campaignId.name} • </span>
                    )}
                    <span>
                      {activeConv.participants
                        ?.map(
                          (p: any) =>
                            `${p.userId?.name || 'User'} (${p.role?.toLowerCase()})`
                        )
                        .join(' ↔ ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    No messages in this channel yet.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderRole === 'ADMIN'
                    const isMyOwn = m.senderId?._id === session?.user?.id

                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                            isAdmin
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-muted rounded-bl-none text-foreground border'
                          }`}
                        >
                          <span className="font-bold text-[10px] block opacity-80 mb-0.5">
                            {m.senderId?.name || (isAdmin ? 'Admin' : m.senderRole)}
                            {!isAdmin && (
                              <span className="ml-1 font-normal opacity-70">
                                ({m.senderRole?.toLowerCase()})
                              </span>
                            )}
                          </span>
                          <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                        </div>
                        <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                          {formatDate(m.createdAt, 'relative')}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="p-3 border-t bg-card flex items-center gap-2"
              >
                <Input
                  placeholder="Post administrative response or instructions..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="h-10 rounded-xl text-xs flex-1"
                />
                <Button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="rounded-xl bg-primary text-white text-xs px-4"
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
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Select a conversation to view and reply.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
