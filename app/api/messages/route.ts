export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Conversation from '@/lib/db/models/Conversation'
import Message from '@/lib/db/models/Message'
import User from '@/lib/db/models/User'
import '@/lib/db/models/Campaign'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const recipientId = searchParams.get('recipientId') || searchParams.get('recipient')
    const roleFilter = searchParams.get('role') // e.g. BRAND, VEHICLE_PARTNER, INFLUENCER
    const userRole = (session.user as any).role || 'USER'
    const isAdmin = userRole === 'ADMIN'

    // 1. If fetching specific conversation messages
    if (conversationId) {
      // Security check: if not admin, verify user is a participant
      if (!isAdmin) {
        const conv = await Conversation.findOne({
          _id: conversationId,
          'participants.userId': session.user.id,
        })
        if (!conv) {
          return NextResponse.json(
            { error: 'Conversation not found or access denied' },
            { status: 404 }
          )
        }
      }

      const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .populate('senderId', 'name email role')
        .lean()

      return NextResponse.json({ success: true, messages })
    }

    // 2. If a specific recipient is targeted (e.g. from /influencers/[id] or /vehicle-ads/[id])
    if (recipientId && recipientId !== session.user.id) {
      let recipientUser = await User.findById(recipientId).select('name email role')
      if (recipientUser) {
        let existingConv = await Conversation.findOne({
          'participants.userId': { $all: [session.user.id, recipientId] },
        })
        if (!existingConv) {
          existingConv = await Conversation.create({
            participants: [
              { userId: session.user.id, role: userRole },
              { userId: recipientId, role: recipientUser.role || 'USER' },
            ],
            unreadCounts: {},
            isActive: true,
          })
        }
      }
    }

    // 3. For non-admin, ensure they have at least 1 conversation (auto-provision support thread if 0)
    if (!isAdmin) {
      const existingUserConvsCount = await Conversation.countDocuments({
        'participants.userId': session.user.id,
      })

      if (existingUserConvsCount === 0) {
        const adminUser = await User.findOne({ role: 'ADMIN' }).sort({ createdAt: 1 })
        if (adminUser && adminUser._id.toString() !== session.user.id) {
          const welcomeText =
            'Welcome to the platform! Our operations team is here to assist with your campaigns, transit routes, and collaborations. Feel free to message us anytime.'
          const supportConv = await Conversation.create({
            participants: [
              { userId: session.user.id, role: userRole },
              { userId: adminUser._id, role: 'ADMIN' },
            ],
            lastMessage: {
              content: welcomeText,
              senderId: adminUser._id,
              sentAt: new Date(),
              type: 'TEXT',
            },
            unreadCounts: {},
            isActive: true,
          })

          await Message.create({
            conversationId: supportConv._id,
            senderId: adminUser._id,
            senderRole: 'ADMIN',
            content: welcomeText,
            type: 'TEXT',
          })
        }
      }
    }

    // 4. Query conversations
    let query: any = {}
    if (isAdmin) {
      if (roleFilter) {
        query['participants.role'] = roleFilter
      }
    } else {
      query['participants.userId'] = session.user.id
    }

    const conversations = await Conversation.find(query)
      .populate('participants.userId', 'name email role phone')
      .populate('campaignId', 'name type status')
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json({ success: true, conversations })
  } catch (error: any) {
    console.error('Messages GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { conversationId, recipientId, campaignId, content, attachments, type } = body

    if (!content?.trim() && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const userRole = (session.user as any).role || 'USER'
    const isAdmin = userRole === 'ADMIN'

    let conv: any = null

    // Attempt 1: By conversation ID
    if (conversationId) {
      conv = await Conversation.findById(conversationId)
    }

    // Attempt 2: By recipient ID
    if (!conv && recipientId) {
      conv = await Conversation.findOne({
        'participants.userId': { $all: [session.user.id, recipientId] },
      })

      if (!conv) {
        const recipientUser = await User.findById(recipientId)
        if (recipientUser) {
          conv = await Conversation.create({
            participants: [
              { userId: session.user.id, role: userRole },
              { userId: recipientId, role: recipientUser.role || 'USER' },
            ],
            campaignId: campaignId || undefined,
            unreadCounts: {},
            isActive: true,
          })
        }
      }
    }

    // Attempt 3: Fallback for non-admin to Platform Admin Support
    if (!conv && !isAdmin) {
      const adminUser = await User.findOne({ role: 'ADMIN' }).sort({ createdAt: 1 })
      if (adminUser) {
        conv = await Conversation.findOne({
          'participants.userId': { $all: [session.user.id, adminUser._id] },
        })

        if (!conv) {
          conv = await Conversation.create({
            participants: [
              { userId: session.user.id, role: userRole },
              { userId: adminUser._id, role: 'ADMIN' },
            ],
            campaignId: campaignId || undefined,
            unreadCounts: {},
            isActive: true,
          })
        }
      }
    }

    if (!conv) {
      return NextResponse.json(
        { error: 'Conversation or recipient not found' },
        { status: 400 }
      )
    }

    // If sender is admin and not in participants list, add admin
    const isParticipant = conv.participants.some(
      (p: any) => p.userId?.toString() === session.user.id
    )
    if (!isParticipant && isAdmin) {
      conv.participants.push({
        userId: session.user.id,
        role: 'ADMIN',
      })
    }

    const message = await Message.create({
      conversationId: conv._id,
      senderId: session.user.id,
      senderRole: userRole,
      content: content ? content.trim() : '',
      type: type || 'TEXT',
      attachments: attachments || [],
    })

    conv.lastMessage = {
      content: content ? content.trim() : 'Sent an attachment',
      senderId: session.user.id,
      sentAt: new Date(),
      type: type || 'TEXT',
    }
    conv.updatedAt = new Date()
    await conv.save()

    // Populate sender details for immediate UI rendering without glitch
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email role')
      .lean()

    return NextResponse.json({
      success: true,
      message: populatedMessage,
      conversationId: conv._id,
    })
  } catch (error: any) {
    console.error('Messages POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
