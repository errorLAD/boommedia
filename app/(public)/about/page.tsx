import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  MapPin,
  Target,
  Shield,
  HeartHandshake,
  CheckCircle2,
  Users,
  Truck,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Us | BoomMedia Marketplace',
  description:
    'Learn about BoomMedia — India’s hybrid advertising marketplace uniting regional micro-influencers and local vehicle transit networks for brands.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Story &amp; Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Uniting Digital Influence &amp; Street-Level Advertising
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          BoomMedia was founded with a clear thesis: Consumer trust in India&apos;s fastest-growing markets is built through authentic local creators online and high-frequency transit exposure on the streets. We bring both together into one unified, transparent platform.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-3xl border p-8 space-y-4 bg-card/60 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Hyper-Local Relevance</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tier-2, Tier-3, and regional markets represent the largest consumer growth segment in India. We empower brands to speak in regional languages, collaborate with local cultural voices, and capture daily footfall on key transit corridors.
          </p>
        </Card>

        <Card className="rounded-3xl border p-8 space-y-4 bg-card/60 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Grassroots Economic Empowerment</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We provide predictable income opportunities for micro-creators and commercial transit drivers (e-rickshaws, autos, buses, tempos). By connecting them directly with national and regional advertisers, we bring formal ad spend to local communities.
          </p>
        </Card>

        <Card className="rounded-3xl border p-8 space-y-4 bg-card/60 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Escrow &amp; Verified Delivery</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            No opaque agency layers. Our milestone-based escrow system, verified proof of wrap installation, and clear deliverable tracking protect brand budgets while ensuring partners receive guaranteed payments upon completion.
          </p>
        </Card>
      </div>

      {/* Who We Serve Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Built for the Entire Ecosystem</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A single marketplace serving the key stakeholders of modern regional advertising.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border p-6 sm:p-8 bg-card/40 space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">For Brands &amp; Agencies</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Discover verified creators filtered by city, niche, and language.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Book high-visibility auto &amp; e-rickshaw transit fleet campaigns.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Automated invoicing, milestone approvals, and performance reporting.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border p-6 sm:p-8 bg-card/40 space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">For Content Creators</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Get discovered by top national brands and regional businesses.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clear briefs, transparent pricing, and escrow-backed payments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Professional portfolio and verified engagement analytics.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border p-6 sm:p-8 bg-card/40 space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">For Vehicle Partners</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Monetize auto-rickshaws, e-rickshaws, buses, and commercial fleets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Earn recurring weekly and monthly advertising revenue.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Simple photo verification and direct bank payouts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Corporate & Trust Details */}
      <div className="rounded-3xl border p-8 sm:p-12 bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Corporate Information</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            Infrablue Material Technologies Private Limited <br />
            [Insert Corporate Identity Number / CIN: Editable Placeholder] <br />
            [Insert Registered Office: Darbhanga / Patna, Bihar, India - 846004] <br />
            Contact: <a href="mailto:hey@boommedia.in" className="text-primary hover:underline">hey@boommedia.in</a> · Support: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black text-white px-6">
            <Link href="/contact">Contact Our Team</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/terms">View Platform Terms</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
