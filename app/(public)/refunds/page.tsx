import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { RefreshCcw, ShieldCheck, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | BoomMedia',
  description:
    'Review the refund, cancellation, revision, and escrow payment settlement policies for influencer campaigns and vehicle transit advertising on BoomMedia.',
}

export default function RefundsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/80 pb-10 mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>Payment &amp; Settlement Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Last Updated: <span className="font-medium text-foreground">[Insert Date, e.g. January 2026]</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          BoomMedia operates a structured escrow-backed advertising platform. We prioritize fair outcomes for Advertisers/Brands, Content Creators, and Vehicle Advertising Partners. This policy explains the cancellation workflows, refund eligibility, revision procedures, and dispute resolutions.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Escrow &amp; Milestone Model</h2>
          <p>
            When a brand funds a campaign or books advertising transit space, the payment is deposited into our secure platform escrow. Funds are not disbursed to partners until agreed campaign milestones or physical verification steps are fulfilled.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Influencer Marketing Campaigns</h2>
          <div className="space-y-3">
            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">A. Cancellation Before Creator Acceptance</h3>
              <p className="text-sm">
                If an advertiser cancels an influencer brief or invitation prior to creator acceptance or contract confirmation, a <strong>100% full refund</strong> of the allocated campaign budget is credited back to the advertiser.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">B. Cancellation After Work In-Progress</h3>
              <p className="text-sm">
                Once a creator has accepted the brief and commenced drafting or content production, cancellation will be assessed on a pro-rata basis. The creator may receive partial compensation for verified draft work, and remaining funds will be returned to the advertiser.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">C. Failure to Deliver or Unapproved Revisions</h3>
              <p className="text-sm">
                If an influencer fails to publish the deliverable by the agreed deadline, or submits work that fundamentally deviates from the approved creative brief without completing requested revisions, the brand is entitled to cancel the booking and receive a full refund for that creator&apos;s allocated budget.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Vehicle &amp; Transit Advertising Campaigns</h2>
          <div className="space-y-3">
            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">A. Cancellation Prior to Wrap Printing &amp; Fabrication</h3>
              <p className="text-sm">
                If an advertiser cancels a transit campaign before graphic printing, vinyl fabrication, or material procurement has started, the brand receives a <strong>100% refund</strong> minus any nominal gateway processing fees.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">B. Cancellation After Fabrication or Wrap Installation</h3>
              <p className="text-sm">
                Once custom vinyl wraps or hood panels have been printed and installed on vehicles, fabrication and mounting costs are non-refundable as customized materials cannot be reused. Pro-rated transit run fees for unfulfilled operational days may be refunded subject to platform review.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5">
              <h3 className="font-bold text-foreground text-base">C. Fleet Partner Inactivity or Damaged Wraps</h3>
              <p className="text-sm">
                If a vehicle partner fails to operate on the agreed route, experiences prolonged vehicle breakdown, or allows advertising wraps to remain damaged without timely re-installation, BoomMedia will issue a replacement vehicle or refund the advertiser for the non-operational duration.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Refund Processing &amp; Timelines</h2>
          <p>
            Once an eligible cancellation or refund request is approved by our compliance team:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Refunds are initiated directly through our payment partner (Razorpay) to the original payment method (Bank Account, UPI, Credit/Debit Card, or Net Banking).</li>
            <li>Banks typically process and reflect the refunded amount within <strong>[5 to 7 business days]</strong> depending on the issuing financial institution.</li>
            <li>For wallet/platform balance accounts, refunds are credited within 24 hours.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Dispute Resolution &amp; Platform Mediation</h2>
          <p>
            If a dispute arises between a brand and an influencer or vehicle partner regarding deliverable quality, execution timelines, or wrap status, either party may file a dispute through their platform dashboard.
          </p>
          <p>
            BoomMedia acts as a neutral mediator. Both parties are given 48 hours to submit supporting evidence (briefs, screenshots, geo-tagged wrap photos, or chat records). Our operations team will issue a binding determination regarding fund release or refund.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. How to Request a Cancellation or Refund</h2>
          <p>
            To initiate a cancellation or inquire about an existing refund status:
          </p>
          <div className="rounded-2xl border p-5 bg-card/60 space-y-1.5 text-sm text-foreground">
            <p className="font-semibold">Billing &amp; Refund Support</p>
            <p className="text-muted-foreground">Email: <a href="mailto:billing@boommedia.in" className="text-primary hover:underline">billing@boommedia.in</a></p>
            <p className="text-muted-foreground">General Support: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a></p>
            <p className="text-muted-foreground">Phone / Helpline: [Insert Business Contact / WhatsApp Support, e.g. +91 98765 43210]</p>
            <p className="text-xs text-muted-foreground pt-1">Please include your Campaign ID, Registered Email Address, and reason for the request.</p>
          </div>
        </section>
      </div>

      {/* Cross link */}
      <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground justify-between items-center">
        <span>Have questions about pricing and platform fees?</span>
        <Link href="/pricing" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          View Pricing &amp; Commission <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
