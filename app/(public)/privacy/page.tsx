import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | BoomMedia',
  description:
    'Learn how BoomMedia collects, uses, protects, and handles personal data for brands, creators, and vehicle advertising partners.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/80 pb-10 mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <Shield className="h-3.5 w-3.5" />
          <span>Trust &amp; Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Effective Date: <span className="font-medium text-foreground">[Insert Date, e.g. January 2026]</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          At BoomMedia (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we respect your privacy and are committed to safeguarding the personal and business information you share with us. This Privacy Policy explains our practices regarding data collection, use, disclosure, and security across our website and services.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            Depending on how you use BoomMedia (as a Brand, Content Creator, Vehicle Partner, or general visitor), we collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Identity &amp; Contact Details:</strong> Full name, business email address, mobile/telephone number, postal address, company name, and job title.
            </li>
            <li>
              <strong className="text-foreground">Creator Profile Data:</strong> Social media usernames/handles (Instagram, YouTube, etc.), public follower metrics, content niche, language capabilities, and portfolio links.
            </li>
            <li>
              <strong className="text-foreground">Vehicle Partner Data:</strong> Vehicle types, registration numbers, driver/owner identification documents, operating city routes, and installation verification photos.
            </li>
            <li>
              <strong className="text-foreground">Financial &amp; Billing Data:</strong> GST numbers, invoicing addresses, and bank payout information (account number and IFSC code for disbursement). Payment card details are processed directly by our PCI-DSS compliant payment gateway (Razorpay) and are not stored on our servers.
            </li>
            <li>
              <strong className="text-foreground">Technical &amp; Usage Information:</strong> IP address, browser type, device information, operating system, and interaction analytics collected via cookies and server logs.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
          <p>We process your data for legitimate business purposes, including:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Facilitating influencer discovery, campaign matchmaking, and vehicle wrap bookings.</li>
            <li>Managing campaign workflows, deliverable submissions, and performance verification.</li>
            <li>Processing payments, escrow hold, and creator/partner earnings disbursements.</li>
            <li>Authenticating user accounts, preventing fraud, and ensuring platform security.</li>
            <li>Sending transactional notices, campaign status updates, and administrative emails.</li>
            <li>Complying with statutory, tax (GST/TDS), and regulatory reporting requirements.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Information Sharing &amp; Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal data. We only share information with third parties under strict confidentiality and for functional service delivery:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Campaign Participants:</strong> Brands see public creator statistics and partner profiles; partners receive campaign brief details necessary to deliver work.</li>
            <li><strong>Payment Gateways:</strong> Razorpay processes payments securely under PCI-DSS compliance standards.</li>
            <li><strong>Communication Providers:</strong> Resend delivers transactional emails (account verification, password resets, milestone notifications).</li>
            <li><strong>Media Storage:</strong> Cloudinary hosts approved image proof and uploaded creative files securely.</li>
            <li><strong>Legal &amp; Law Enforcement:</strong> We may disclose data if required by applicable law, court order, or governmental regulation.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Data Security &amp; Retention</h2>
          <p>
            We implement industry-standard technical and organizational security measures, including HTTPS/TLS encryption in transit, bcrypt password hashing, role-based access control, and secure database clustering.
          </p>
          <p>
            We retain account data for as long as your account remains active or as needed to provide services, resolve disputes, enforce agreements, and fulfill tax or accounting retention laws.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Your Privacy Rights</h2>
          <p>Subject to applicable Indian laws (such as the Digital Personal Data Protection Act, 2023), you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction or updating of inaccurate information.</li>
            <li>Request account deactivation or deletion of your personal data, subject to statutory record-keeping obligations.</li>
            <li>Opt out of non-essential marketing communications at any time.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. Cookies &amp; Tracking</h2>
          <p>
            We use essential cookies to maintain secure sessions, remember preferences, and optimize site speed. For complete details on our cookie usage and management, please review our{' '}
            <Link href="/cookies" className="text-primary hover:underline font-medium">
              Cookie Policy
            </Link>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">7. Grievance Officer &amp; Inquiries</h2>
          <p>
            In accordance with the Information Technology Act, 2000 and rules made thereunder, any grievances or inquiries regarding your data may be addressed to our designated officer:
          </p>
          <div className="rounded-2xl border p-5 bg-card/60 space-y-1 text-sm text-foreground">
            <p className="font-semibold">Grievance &amp; Data Protection Officer</p>
            <p>Infrablue Material Technologies Private Limited</p>
            <p className="text-muted-foreground">Email: <a href="mailto:privacy@boommedia.in" className="text-primary hover:underline">privacy@boommedia.in</a></p>
            <p className="text-muted-foreground">Support: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a></p>
            <p className="text-muted-foreground">Address: [Insert Postal Address / Office Location, India]</p>
          </div>
        </section>
      </div>

      {/* Cross link */}
      <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground justify-between items-center">
        <span>Need to review service terms?</span>
        <Link href="/terms" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          Read Terms &amp; Conditions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
