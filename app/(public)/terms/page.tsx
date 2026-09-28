import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | BoomMedia Marketplace',
  description:
    'Read the terms of service governing the use of BoomMedia platform for influencer marketing campaigns, vehicle transit advertising, and campaign management.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/80 pb-10 mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <FileText className="h-3.5 w-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Last Updated: <span className="font-medium text-foreground">[Insert Date, e.g. January 2026]</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Welcome to BoomMedia (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). These Terms and Conditions govern your access to and use of our platform, website, services, and associated applications for influencer marketing matchmaking, vehicle advertising, and campaign execution.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By registering an account, accessing our marketplace, or using any services provided through BoomMedia, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use the platform.
          </p>
          <p>
            If you are entering into these terms on behalf of a company, brand, agency, or other legal entity, you represent and warrant that you have full legal authority to bind such entity to these provisions.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Description of Services</h2>
          <p>
            BoomMedia operates an online marketplace and campaign management software that facilitates:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Influencer Marketing:</strong> Connecting advertisers and brands with creators, nano/micro-influencers, and talent for sponsored social media content, product reviews, and promotional campaigns.
            </li>
            <li>
              <strong className="text-foreground">Vehicle &amp; Transit Advertising:</strong> Connecting advertisers with verified commercial vehicle operators, transit fleets, auto-rickshaw owners, and e-rickshaw drivers for physical wraps, banner branding, and local route campaigns.
            </li>
            <li>
              <strong className="text-foreground">Campaign Tracking &amp; Milestone Escrow:</strong> Offering structured milestone tracking, deliverable review, invoicing, and escrow-based payout settlement.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. User Accounts &amp; Verification</h2>
          <p>
            To use specific features, you must register as a <strong>Brand / Advertiser</strong>, <strong>Influencer / Creator</strong>, or <strong>Vehicle Partner</strong>. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Provide accurate, truthful, and updated registration details, including identity, contact details, GST (if applicable), and social media or vehicle credentials.</li>
            <li>Maintain the confidentiality of your login credentials and accept responsibility for all activity under your account.</li>
            <li>Notify BoomMedia immediately of any unauthorized access or security breach.</li>
          </ul>
          <p>
            BoomMedia reserves the right to verify accounts, review documentation, or suspend accounts that fail verification or provide fraudulent information.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Partner Obligations (Influencers &amp; Vehicle Partners)</h2>
          <p>
            <strong>For Influencers &amp; Creators:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>You agree to create and publish deliverables strictly in accordance with the agreed brief, guidelines, deadlines, and brand requirements.</li>
            <li>You must comply with advertising standards and legal disclosure requirements (e.g. ASCI guidelines in India, including clear #ad, #sponsored, or paid partnership labels).</li>
            <li>You represent that your follower counts, engagement metrics, and audience demographics are authentic and not artificially inflated via automated bots or paid pods.</li>
          </ul>
          <p className="pt-2">
            <strong>For Vehicle Partners:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>You warrant that all listed vehicles possess valid registration certificates, permits, road tax clearance, and mandatory insurance under applicable motor vehicles law.</li>
            <li>You agree to maintain vehicle wraps, panels, or posters in clean, readable condition throughout the booked campaign duration.</li>
            <li>You agree to upload verifiable photo or video proof of installation and periodic route proof as requested.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Payments, Fees &amp; Escrow</h2>
          <p>
            Campaign budgets, rates, and platform service fees are clearly displayed prior to confirmation. Payments are collected via authorized third-party payment gateways (e.g. Razorpay).
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Escrow Protection:</strong> Funds deposited by brands for a campaign are held until milestones are approved or verified according to campaign milestones.</li>
            <li><strong>Platform Commission:</strong> BoomMedia deducts its agreed platform service fee or commission percentage from payouts as outlined during campaign booking.</li>
            <li><strong>Taxes:</strong> All fees are subject to applicable taxes, including Goods &amp; Services Tax (GST) and Tax Deducted at Source (TDS), as mandated by local laws.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. Prohibited Activities</h2>
          <p>Users must not engage in any of the following activities on or through the platform:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Promoting fraudulent, defamatory, counterfeit, obscene, hateful, or unlawful products or services.</li>
            <li>Circumventing platform payments or soliciting off-platform settlements after matching through BoomMedia.</li>
            <li>Using automated crawlers, scrapers, or bots to harvest data from the platform.</li>
            <li>Violating intellectual property rights, copyrights, or publicity rights of third parties.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">7. Intellectual Property</h2>
          <p>
            <strong>Platform Content:</strong> The BoomMedia name, logo, design, software, and content are the exclusive property of Infrablue Material Technologies Private Limited or its licensors.
          </p>
          <p>
            <strong>Campaign Assets:</strong> Brands retain ownership of their trademarks, logos, and raw assets. Influencers grant the brand a non-exclusive, worldwide license to use approved campaign deliverables for the duration and scope specified in the individual campaign agreement.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">8. Limitation of Liability &amp; Disclaimers</h2>
          <p>
            BoomMedia acts as a marketplace intermediary platform. While we conduct verification checks, we do not guarantee specific marketing return on investment (ROAS), sales numbers, footfall, or viral performance. The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">9. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in <span className="font-medium text-foreground">[Darbhanga / Patna, Bihar, India - or insert company jurisdiction]</span>.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">10. Contact Information</h2>
          <p>
            If you have questions regarding these Terms &amp; Conditions, please reach out to:
          </p>
          <div className="rounded-2xl border p-5 bg-card/60 space-y-1 text-sm text-foreground">
            <p className="font-semibold">Legal &amp; Compliance Team</p>
            <p>Infrablue Material Technologies Private Limited</p>
            <p className="text-muted-foreground">Email: <a href="mailto:legal@boommedia.in" className="text-primary hover:underline">legal@boommedia.in</a></p>
            <p className="text-muted-foreground">Support: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a></p>
            <p className="text-muted-foreground">Registered Office: [Insert Registered Address, e.g. Darbhanga, Bihar 846004, India]</p>
          </div>
        </section>
      </div>

      {/* Cross link */}
      <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground justify-between items-center">
        <span>Looking for data privacy details?</span>
        <Link href="/privacy" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          Read our Privacy Policy <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
