'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Search,
  Send,
  Truck,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export default function AdminVehicleMessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string>('')
  const [messages, setMessages] = useState<any[]>([])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadConvs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/messages?role=VEHICLE_PARTNER')
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
    loadConvs()
    const timer = setInterval(loadConvs, 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!activeConvId) return
    async function loadMsgs() {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConvId}`)
        if (res.ok) {
          const json = await res.json()
          setMessages(json.messages || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadMsgs()
    const timer = setInterval(loadMsgs, 5000)
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

        // Update local conversation lastMessage
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
  const activeVehicleParticipant = activeConv?.participants?.find(
    (p: any) => p.role === 'VEHICLE_PARTNER'
  )?.userId

  const filteredConversations = conversations.filter((c) => {
    if (!search) return true
    const term = search.toLowerCase()
    const partnerUser = c.participants?.find((p: any) => p.role === 'VEHICLE_PARTNER')?.userId
    const name = (partnerUser?.name || '').toLowerCase()
    const email = (partnerUser?.email || '').toLowerCase()
    const campaignName = (c.campaignId?.name || '').toLowerCase()
    const lastMsg = (c.lastMessage?.content || '').toLowerCase()
    return (
      name.includes(term) ||
      email.includes(term) ||
      campaignName.includes(term) ||
      lastMsg.includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Vehicle Partner Messages
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Transit partner messages, fleet support tickets, and route wrap verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Conversations List */}
        <Card className="rounded-2xl border flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search fleet partners, routes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl text-xs"
              />
            </div>
            <Badge variant="outline" className="text-[10px] font-bold">
              {filteredConversations.length}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground px-4">
                No vehicle partner conversations found.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c._id === activeConvId
                const partnerUser = c.participants?.find((p: any) => p.role === 'VEHICLE_PARTNER')?.userId
                const partnerName = partnerUser?.name || 'Fleet Partner'

                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveConvId(c._id)}
                    className={`p-3 cursor-pointer text-xs space-y-1 transition-colors ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground truncate max-w-[170px]">
                        {partnerName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(c.updatedAt, 'relative')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-amber-500/15 text-amber-700">
                        Fleet Partner
                      </Badge>
                      {c.campaignId?.name && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          • {c.campaignId.name}
                        </span>
                      )}
                    </div>

                    {partnerUser?.email && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {partnerUser.email}
                      </p>
                    )}

                    <p className="text-[11px] text-muted-foreground truncate">
                      {c.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        {/* Right: Message Details */}
        <Card className="rounded-2xl border md:col-span-2 flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">
                      {activeVehicleParticipant?.name || 'Fleet Partner'}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      FLEET SUPPORT
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    {activeVehicleParticipant?.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {activeVehicleParticipant.email}
                      </span>
                    )}
                    {activeVehicleParticipant?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {activeVehicleParticipant.phone}
                      </span>
                    )}
                    {activeConv.campaignId?.name && (
                      <span>Campaign: {activeConv.campaignId.name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    No messages yet in this conversation.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderRole === 'ADMIN'

                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                            isAdmin
                              ? 'bg-amber-500 text-white rounded-br-none'
                              : 'bg-muted rounded-bl-none text-foreground border'
                          }`}
                        >
                          <span className="font-bold text-[10px] block opacity-80 mb-0.5">
                            {isAdmin
                              ? 'Fleet Support'
                              : m.senderId?.name || 'Fleet Partner'}
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
                  placeholder="Post operational update or instructions..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="h-10 rounded-xl text-xs flex-1"
                />
                <Button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs px-4"
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
