import React from 'react'
import Link from 'next/link'
import { Check, Sparkles, HelpCircle, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1">
          Simple & Transparent Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Pay for Results. No Hidden Fees.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          BoomMedia charges a flat 10% platform facilitation fee on completed campaigns.
          Free for creators to join and free for vehicle partners to list.
        </p>
      </div>

      {/* 3 Participant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* For Brands */}
        <Card className="rounded-3xl border-2 border-primary/40 bg-card/60 relative overflow-hidden shadow-lg p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">For Brands</span>
              <h3 className="text-2xl font-extrabold text-foreground">Campaign Marketplace</h3>
              <p className="text-xs text-muted-foreground">Everything you need to launch online & offline marketing campaigns.</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-foreground">10%</span>
                <span className="text-xs text-muted-foreground">platform fee per funded campaign</span>
              </div>
            </div>

            <ul className="space-y-3 pt-4 text-xs text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited campaign posts & creator discovery</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Razorpay Escrow Milestone Protection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Combined Influencer + Vehicle campaign workflows</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Verified installation & proof of performance</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button asChild className="w-full rounded-xl bg-primary text-white font-semibold">
              <Link href="/brand/signup">Get Started as Brand</Link>
            </Button>
          </div>
        </Card>

        {/* For Influencers */}
        <Card className="rounded-3xl border bg-card/60 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">For Creators</span>
              <h3 className="text-2xl font-extrabold text-foreground">Creator Studio</h3>
              <p className="text-xs text-muted-foreground">Connect with reputable regional brands and keep 100% of your listed rate.</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-foreground">Free</span>
                <span className="text-xs text-muted-foreground">forever to join & apply</span>
              </div>
            </div>

            <ul className="space-y-3 pt-4 text-xs text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero commission deducted from your agreed payout</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Guaranteed payment held in escrow before work begins</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Direct bank account / UPI settlement within 48h</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Verified creator badge on profile</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
              <Link href="/influencer/signup">Join as Creator</Link>
            </Button>
          </div>
        </Card>

        {/* For Vehicle Partners */}
        <Card className="rounded-3xl border bg-card/60 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">For Vehicle Partners</span>
              <h3 className="text-2xl font-extrabold text-foreground">Fleet Network</h3>
              <p className="text-xs text-muted-foreground">Monetize autos, e-rickshaws, and buses with zero listing charges.</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-foreground">Free</span>
                <span className="text-xs text-muted-foreground">to list unlimited vehicles</span>
              </div>
            </div>

            <ul className="space-y-3 pt-4 text-xs text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Set your own weekly or monthly advertising price</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Brand covers vinyl wrap printing & mounting costs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Weekly guaranteed payouts to bank or UPI</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Dedicated fleet manager support</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
              <Link href="/vehicle/signup">List Your Vehicle</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Example Calculation Section */}
      <div className="rounded-3xl border p-8 bg-card/40 space-y-6">
        <h3 className="text-xl font-bold text-foreground">Transparent Fee Breakdown Example</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border p-4 bg-muted/20">
            <span className="text-muted-foreground block">Brand Total Spend</span>
            <p className="text-lg font-extrabold text-foreground mt-1">₹22,000</p>
            <span className="text-[11px] text-muted-foreground">Includes all deliverables & fee</span>
          </div>
          <div className="rounded-2xl border p-4 bg-muted/20">
            <span className="text-muted-foreground block">Creator Payout</span>
            <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹10,000</p>
            <span className="text-[11px] text-muted-foreground">Full agreed price to creators</span>
          </div>
          <div className="rounded-2xl border p-4 bg-muted/20">
            <span className="text-muted-foreground block">Vehicle Partner Payout</span>
            <p className="text-lg font-extrabold text-amber-500 mt-1">₹10,000</p>
            <span className="text-[11px] text-muted-foreground">Full agreed price to vehicle owners</span>
          </div>
          <div className="rounded-2xl border p-4 bg-muted/20">
            <span className="text-muted-foreground block">Platform Fee (10%)</span>
            <p className="text-lg font-extrabold text-primary mt-1">₹2,000</p>
            <span className="text-[11px] text-muted-foreground">Includes escrow & dispute cover</span>
          </div>
        </div>
      </div>
    </div>
  )
}
