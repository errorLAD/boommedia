export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import Notification from '@/lib/db/models/Notification'
import CampaignApplication from '@/lib/db/models/CampaignApplication'
import Campaign from '@/lib/db/models/Campaign'
import User from '@/lib/db/models/User'

export async function GET() { const session = await auth(); if (!session?.user?.id || (session.user as any).role !== 'INFLUENCER') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 }); await connectDB(); const [profile, user, notifications, unreadCount, applications] = await Promise.all([InfluencerProfile.findOne({ userId: session.user.id }).lean(), User.findById(session.user.id).select('name phone').lean(), Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(5).lean(), Notification.countDocuments({ userId: session.user.id, isRead: false }), CampaignApplication.find({ applicantId: session.user.id, applicantType: 'INFLUENCER' }).populate('campaignId', 'name status budget deadline').sort({ createdAt: -1 }).limit(6).lean()]); const completionFields = [user?.name, user?.phone, profile?.city, profile?.state, profile?.niche, profile?.bio, profile?.socialAccounts?.length, profile?.totalFollowers, profile?.portfolio?.length]; const completion = Math.round(completionFields.filter(Boolean).length / completionFields.length * 100); const availableWork = await Campaign.countDocuments({ type: { $in: ['INFLUENCER', 'COMBINED'] }, status: 'PUBLISHED' }); return NextResponse.json({ success: true, data: { name: user?.name || 'Creator', completion, notifications, unreadCount, applications, availableWork, profile } }) }
