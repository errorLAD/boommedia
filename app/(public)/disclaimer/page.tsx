import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer | BoomMedia',
  description:
    'Legal and operational disclaimer for BoomMedia marketplace, influencer advertising, vehicle transit branding, and third-party content.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/80 pb-10 mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Important Notice</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Platform Disclaimer
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Last Updated: <span className="font-medium text-foreground">[Insert Date, e.g. January 2026]</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Please read this Disclaimer carefully before using the BoomMedia website, platform, or services. The information provided on this platform is for general informational and marketplace facilitation purposes only.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Marketplace Intermediary Status</h2>
          <p>
            BoomMedia operates as an online marketplace intermediary connecting independent Advertisers/Brands, independent Content Creators/Influencers, and independent Commercial Vehicle Operators/Partners.
          </p>
          <p>
            BoomMedia does not directly employ content creators or vehicle drivers. Each creator and vehicle partner operates as an independent contractor. In accordance with Section 79 of the Information Technology Act, 2000, BoomMedia functions as an intermediary and is not liable for third-party content, posts, or off-platform conduct.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Influencer Content &amp; Endorsement Compliance</h2>
          <p>
            Opinions, views, reviews, and representations expressed by influencers on their respective social channels are solely their own and do not necessarily represent the views of BoomMedia.
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Advertiser Responsibility:</strong> Brands and advertisers are solely responsible for ensuring that their product claims, benefits, and advertisements comply with applicable truth-in-advertising guidelines, including Consumer Protection Acts and Advertising Standards Council of India (ASCI) regulations.</li>
            <li><strong>Disclosure Mandate:</strong> Creators are independently required to include clear sponsorship disclosures (such as &quot;#ad&quot;, &quot;#sponsored&quot;, or &quot;Paid Partnership&quot;) as mandated by local laws.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Vehicle Advertising &amp; Municipal Regulations</h2>
          <p>
            Vehicle branding, auto-rickshaw wraps, and transit advertisements are arranged via registered vehicle owners and fleet partners.
          </p>
          <p>
            Vehicle owners and fleet operators are responsible for ensuring their vehicles maintain valid fitness certificates, route permits, and mandatory commercial insurance. Advertisers and vehicle partners must adhere to local municipal corporation rules and regional transport office (RTO) guidelines regarding commercial advertisements on transit vehicles in their respective operating cities.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. No Guarantee of Marketing Results (ROAS / Virality)</h2>
          <p>
            Any reach estimations, impression counts, passerby exposure figures, or historical metrics displayed on BoomMedia are statistical estimates derived from historical platform activity, creator analytics, and local traffic survey data.
          </p>
          <p>
            BoomMedia makes no warranty, guarantee, or representation that any campaign will achieve specific commercial sales volumes, return on ad spend (ROAS), footfall, user signups, or viral distribution. Campaign results depend on numerous external variables outside our control, including product-market fit, creative quality, pricing, and consumer demand.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Third-Party Links &amp; External Tools</h2>
          <p>
            Our website may contain links to external third-party websites, social platforms (Instagram, YouTube, LinkedIn), or service providers. BoomMedia has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. Contact &amp; Questions</h2>
          <p>
            For clarifications regarding this Disclaimer, please reach out to:
          </p>
          <div className="rounded-2xl border p-5 bg-card/60 space-y-1 text-sm text-foreground">
            <p className="font-semibold">Infrablue Material Technologies Private Limited</p>
            <p className="text-muted-foreground">Legal &amp; Policy: <a href="mailto:legal@boommedia.in" className="text-primary hover:underline">legal@boommedia.in</a></p>
            <p className="text-muted-foreground">General Help: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a></p>
          </div>
        </section>
      </div>

      {/* Cross link */}
      <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground justify-between items-center">
        <span>Need more information on user agreements?</span>
        <Link href="/terms" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          Read our Terms &amp; Conditions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
