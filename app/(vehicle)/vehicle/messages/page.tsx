'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Send,
  Loader2,
  Truck,
  Headphones,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDate, getInitials } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export default function VehicleMessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadConversations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/messages')
      if (res.ok) {
        const json = await res.json()
        const convs = json.conversations || []
        setConversations(convs)
        if (convs.length > 0) {
          if (!activeConv) {
            setActiveConv(convs[0])
          } else {
            // Keep activeConv updated
            const updated = convs.find((c: any) => c._id === activeConv._id)
            if (updated) setActiveConv(updated)
          }
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const json = await res.json()
        setMessages(json.messages || [])
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeConv?._id) {
      loadMessages(activeConv._id)
      const interval = setInterval(() => loadMessages(activeConv._id), 5000)
      return () => clearInterval(interval)
    }
  }, [activeConv?._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeConv) return

    try {
      setSending(true)
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv._id,
          content: inputText.trim(),
        }),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.message) {
          setMessages((prev) => [...prev, json.message])
        }
        setInputText('')

        // Update conversation lastMessage in sidebar immediately
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConv._id
              ? {
                  ...c,
                  lastMessage: {
                    content: inputText.trim(),
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
      toast.error('Network send error')
    } finally {
      setSending(false)
    }
  }

  const activeOtherParticipant = activeConv?.participants?.find(
    (p: any) => (p.userId?._id || p.userId) !== session?.user?.id
  )
  const isActiveSupport = activeOtherParticipant?.role === 'ADMIN'
  const activeHeaderName = isActiveSupport
    ? 'Platform Support & Operations'
    : activeOtherParticipant?.userId?.name || 'Campaign Team'

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Transit Campaign Messages
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Communicate with brands and agency operations regarding routes, ad wraps, and campaign scheduling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] rounded-3xl border bg-card overflow-hidden">
        {/* Left: Conversation list */}
        <div className="border-r flex flex-col h-full overflow-hidden bg-muted/10">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversations
            </h2>
            <Badge variant="outline" className="text-[10px] font-bold">
              {conversations.length} Active
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-muted-foreground space-y-2">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="font-semibold text-foreground">No active threads</p>
                <p className="text-[11px]">
                  Conversations are automatically opened when a campaign or advertising proposal is submitted.
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = activeConv?._id === c._id
                const otherP = c.participants?.find(
                  (p: any) => (p.userId?._id || p.userId) !== session?.user?.id
                )
                const isSupport = otherP?.role === 'ADMIN'
                const otherUser = otherP?.userId
                const displayName = isSupport
                  ? 'Platform Support & Operations'
                  : otherUser?.name || 'Campaign Team'

                return (
                  <button
                    key={c._id}
                    onClick={() => setActiveConv(c)}
                    className={`w-full text-left p-4 transition-colors flex items-start space-x-3 ${
                      isActive
                        ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          isSupport
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSupport ? <Headphones className="h-4 w-4" /> : getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground truncate">
                          {displayName}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {c.lastMessage?.sentAt ? formatDate(c.lastMessage.sentAt, 'relative') : ''}
                        </span>
                      </div>
                      {isSupport && (
                        <span className="inline-block text-[9px] font-bold text-amber-600 tracking-wide">
                          OPERATIONS SUPPORT
                        </span>
                      )}
                      {c.campaignId?.name && (
                        <p className="text-[10px] font-semibold text-amber-600 truncate mt-0.5">
                          {c.campaignId.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {c.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Active chat */}
        <div className="md:col-span-2 flex flex-col h-full overflow-hidden bg-card">
          {activeConv ? (
            <>
              {/* Thread header */}
              <div className="p-4 border-b flex items-center justify-between shrink-0 bg-background/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={`text-xs font-bold ${
                        isActiveSupport
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isActiveSupport ? <Headphones className="h-4 w-4" /> : getInitials(activeHeaderName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {activeHeaderName}
                      {isActiveSupport && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-700 border-amber-300">
                          Official Support
                        </Badge>
                      )}
                    </h3>
                    {activeConv.campaignId && (
                      <p className="text-[11px] text-muted-foreground flex items-center mt-0.5">
                        <Truck className="h-3 w-3 mr-1 text-amber-500" />
                        Campaign: {activeConv.campaignId.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    This is the start of your campaign communication. Send a message to discuss transit routes, advertising space, or wrap installation details.
                  </div>
                ) : (
                  messages.map((m) => {
                    const senderObjId = m.senderId?._id || m.senderId
                    const isMe = senderObjId === session?.user?.id
                    const isSenderAdmin = m.senderRole === 'ADMIN'

                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                            isMe
                              ? 'bg-amber-500 text-white rounded-br-sm'
                              : isSenderAdmin
                              ? 'bg-amber-50/80 border border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-100 rounded-bl-sm'
                              : 'bg-muted/60 text-foreground rounded-bl-sm border'
                          }`}
                        >
                          {!isMe && (
                            <span className="font-bold text-[10px] block opacity-80 mb-0.5">
                              {isSenderAdmin
                                ? 'Operations Support'
                                : m.senderId?.name || 'Partner'}
                            </span>
                          )}
                          <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatDate(m.createdAt, 'relative')}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input box */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t flex items-center space-x-2 shrink-0 bg-background/50"
              >
                <Input
                  placeholder="Type your message regarding this transit campaign..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="h-10 rounded-xl text-xs bg-card"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={sending || !inputText.trim()}
                  className="h-10 w-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shrink-0"
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
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs space-y-2">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
              <p>Select a campaign conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
