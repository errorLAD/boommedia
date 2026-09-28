import React from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  MessageSquare,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Unified Influencer + Vehicle Ad Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          How BoomMedia Works
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          One unified marketplace connecting brands, creators, and hyper-local transit advertising partners.
          Simple, transparent, milestone-driven, and escrow-backed.
        </p>
      </div>

      {/* 3 Core Flows */}
      <div className="space-y-16">
        {/* For Brands */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 pb-3 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">For Brands & Marketers</h2>
              <p className="text-xs text-muted-foreground">End-to-end online influencer + vehicle marketing from one dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Create Campaign', desc: 'Define your budget, deliverables, city locations, and target audience.' },
              { step: '02', title: 'Discover & Invite', desc: 'Browse verified creators and vehicle fleet owners or let them apply directly.' },
              { step: '03', title: 'Collaborate & Chat', desc: 'Share brand guidelines, review mockups, and negotiate agreed deliverables.' },
              { step: '04', title: 'Review Proof', desc: 'Approve live social post links or vehicle wrap installation photos.' },
              { step: '05', title: 'Automated Escrow', desc: 'Payments are held securely in Razorpay escrow and released upon your approval.' },
            ].map((s, idx) => (
              <Card key={idx} className="rounded-2xl border p-5 relative overflow-hidden bg-card/60">
                <span className="text-2xl font-black text-purple-600/20 block mb-2">{s.step}</span>
                <h4 className="font-bold text-sm text-foreground mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* For Influencers */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 pb-3 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">For Micro-Influencers & Creators</h2>
              <p className="text-xs text-muted-foreground">Monetize your regional audience with guaranteed timely payouts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Join & Set Rates', desc: 'Create your verified creator profile, connect social channels, and set reel/post rates.' },
              { step: '02', title: 'Discover Campaigns', desc: 'Browse live brand opportunities matching your niche, city, and audience size.' },
              { step: '03', title: 'Accept Invites', desc: 'Receive direct collaboration invitations from top brands with upfront budgets.' },
              { step: '04', title: 'Submit Deliverables', desc: 'Produce authentic content and submit your post/reel URLs for brand review.' },
              { step: '05', title: 'Direct Payouts', desc: 'Get paid directly into your bank account or UPI within 24-48 hours of approval.' },
            ].map((s, idx) => (
              <Card key={idx} className="rounded-2xl border p-5 relative overflow-hidden bg-card/60">
                <span className="text-2xl font-black text-indigo-600/20 block mb-2">{s.step}</span>
                <h4 className="font-bold text-sm text-foreground mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* For Vehicle Partners */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 pb-3 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">For Vehicle Advertising Partners</h2>
              <p className="text-xs text-muted-foreground">Turn commercial autos, e-rickshaws, and buses into monthly recurring passive income</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'List Fleet', desc: 'Register your e-rickshaws, autos, or delivery vehicles with photos and routes.' },
              { step: '02', title: 'Quick Verification', desc: 'Submit registration and permit documents for verified partner status.' },
              { step: '03', title: 'Accept Bookings', desc: 'Receive advertising campaign contracts with transparent weekly/monthly rates.' },
              { step: '04', title: 'Upload Proof', desc: 'Mount the brand stickers/wrap and snap geo-tagged proof of installation.' },
              { step: '05', title: 'Regular Income', desc: 'Receive direct payouts every cycle for as long as the campaign is active.' },
            ].map((s, idx) => (
              <Card key={idx} className="rounded-2xl border p-5 relative overflow-hidden bg-card/60">
                <span className="text-2xl font-black text-amber-600/20 block mb-2">{s.step}</span>
                <h4 className="font-bold text-sm text-foreground mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 p-8 sm:p-12 text-center text-white space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to start your first campaign?</h3>
        <p className="max-w-xl mx-auto text-sm text-purple-100/90">
          Join hundreds of forward-thinking brands expanding their market footprint across India.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl">
            <Link href="/brand/signup">Get Started as Brand</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
            <Link href="/influencer/signup">Join as Creator</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
