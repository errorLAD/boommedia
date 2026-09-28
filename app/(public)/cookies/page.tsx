import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Cookie, Settings, ShieldCheck, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy | BoomMedia',
  description:
    'Learn how BoomMedia uses cookies and similar browser technologies to ensure secure authentication, site functionality, and performance optimization.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/80 pb-10 mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <Cookie className="h-3.5 w-3.5" />
          <span>Browser Data &amp; Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Cookie Policy
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Last Updated: <span className="font-medium text-foreground">[Insert Date, e.g. January 2026]</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          This Cookie Policy explains how BoomMedia (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) uses cookies, local storage, and similar technologies when you visit our website and use our platform.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your computer, smartphone, or tablet when you visit websites. They are widely used to make websites work properly, provide secure session authentication, and deliver insights into site usage.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Categories of Cookies We Use</h2>
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl border p-5 bg-card/60 space-y-2">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                A. Strictly Necessary / Essential Cookies
              </h3>
              <p className="text-sm">
                These cookies are required for the basic operation of the website. They enable core functions such as user login authentication (NextAuth session tokens), CSRF attack prevention, and secure navigation between protected dashboard areas (Brand, Influencer, and Vehicle Partner portals). Without these cookies, the service cannot function.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-2">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                B. Functionality &amp; Preferences Cookies
              </h3>
              <p className="text-sm">
                These allow our website to remember choices you make (such as your chosen display theme, language preferences, or active search filters for influencer discovery) to provide an enhanced, personalized user experience.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-2">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                C. Performance &amp; Analytics Cookies
              </h3>
              <p className="text-sm">
                These cookies help us understand how visitors interact with our platform (such as which pages are visited most often and where loading errors occur). All analytics information is aggregated and anonymized to help us optimize page speed, Core Web Vitals, and navigation flow.
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-card/60 space-y-2">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                D. Third-Party Service Cookies
              </h3>
              <p className="text-sm">
                Certain third-party services integrated on our platform (such as Razorpay for payment checkout and fraud detection) may set operational cookies to ensure transaction verification and security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. How Can You Control Cookies?</h2>
          <p>
            Most modern web browsers allow you to manage your cookie preferences through their settings. You can choose to accept all cookies, be notified when a cookie is issued, or refuse cookies altogether.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies</li>
            <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
            <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
          </ul>
          <p className="text-xs pt-1 text-muted-foreground">
            Please note: Disabling or blocking essential cookies may affect platform functionality, and you may be unable to log in to your Brand, Influencer, or Vehicle Partner dashboards.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect operational, legal, or technical changes. Any revisions will be posted on this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Questions &amp; Support</h2>
          <p>
            If you have questions about our use of cookies or tracking technologies, please contact our support team:
          </p>
          <div className="rounded-2xl border p-5 bg-card/60 space-y-1 text-sm text-foreground">
            <p className="font-semibold">Privacy &amp; Technical Support</p>
            <p className="text-muted-foreground">Email: <a href="mailto:support@boommedia.in" className="text-primary hover:underline">support@boommedia.in</a></p>
            <p className="text-muted-foreground">Corporate Legal: <a href="mailto:legal@boommedia.in" className="text-primary hover:underline">legal@boommedia.in</a></p>
          </div>
        </section>
      </div>

      {/* Cross link */}
      <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground justify-between items-center">
        <span>Want to know how we protect your personal information?</span>
        <Link href="/privacy" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          Read our Privacy Policy <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
