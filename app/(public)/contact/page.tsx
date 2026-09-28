'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Truck,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    service: 'BOTH',
    city: '',
    state: '',
    budget: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'contact_page',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry')
      }

      setSubmitted(true)
      toast.success('Your message has been received! Our team will respond shortly.')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Mail className="h-3.5 w-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Contact BoomMedia
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Whether you want to launch a regional influencer campaign, book offline vehicle transit advertising, or partner with us, our dedicated team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Support Channels */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 rounded-3xl border bg-card/60 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Office &amp; Support Details</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We operate across regional and metro media hubs with active campaign networks in Bihar, Jharkhand, and pan-India expansion.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Registered Office</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    Infrablue Material Technologies Private Limited
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    [Insert Registered Office Address, e.g. Darbhanga / Patna, Bihar, India - 846004]
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Email Inquiries</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    General &amp; Brands:{' '}
                    <a href="mailto:hey@boommedia.in" className="text-primary hover:underline font-medium">
                      hey@boommedia.in
                    </a>
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Campaign Support:{' '}
                    <a href="mailto:support@boommedia.in" className="text-primary hover:underline font-medium">
                      support@boommedia.in
                    </a>
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Partner Alliances:{' '}
                    <a href="mailto:partners@boommedia.in" className="text-primary hover:underline font-medium">
                      partners@boommedia.in
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Telephone &amp; WhatsApp</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    Helpdesk: [Insert Phone Number, e.g. +91 98765 43210]
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Business Hours</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    Monday to Saturday: 9:30 AM – 6:30 PM IST
                  </p>
                  <p className="text-muted-foreground text-xs">Closed on National Holidays</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Average response time: within 24 business hours</span>
              </div>
            </div>
          </Card>

          {/* Quick Registration Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              href="/brand/signup"
              className="p-3.5 rounded-2xl border bg-card/60 hover:border-purple-500 transition-all flex flex-col items-center text-center gap-1.5"
            >
              <Briefcase className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-foreground">For Brands</span>
              <span className="text-[10px] text-muted-foreground">Start advertising</span>
            </Link>
            <Link
              href="/influencer/signup"
              className="p-3.5 rounded-2xl border bg-card/60 hover:border-indigo-500 transition-all flex flex-col items-center text-center gap-1.5"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-foreground">For Creators</span>
              <span className="text-[10px] text-muted-foreground">Monetize reach</span>
            </Link>
            <Link
              href="/vehicle/signup"
              className="p-3.5 rounded-2xl border bg-card/60 hover:border-amber-500 transition-all flex flex-col items-center text-center gap-1.5"
            >
              <Truck className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-foreground">For Vehicles</span>
              <span className="text-[10px] text-muted-foreground">Monetize fleet</span>
            </Link>
          </div>
        </div>

        {/* Right: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-10 rounded-3xl border bg-card/60">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. One of our regional campaign directors will review your inquiry and contact you within 24 business hours.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({
                      companyName: '',
                      contactName: '',
                      email: '',
                      phone: '',
                      service: 'BOTH',
                      city: '',
                      state: '',
                      budget: '',
                      message: '',
                    })
                  }}
                  variant="outline"
                  className="rounded-full"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Send Us a Message</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fill out the form below and we will get back to you with custom strategy and pricing options.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Company / Brand Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mithila Handloom Co."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Contact Person Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Jha"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aditya@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Phone / Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Services Interested In <span className="text-primary">*</span>
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="BOTH">Combined (Influencers + Transit Ads)</option>
                      <option value="INFLUENCER">Influencer Marketing Only</option>
                      <option value="VEHICLE">Vehicle / Auto-Rickshaw Ads Only</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Target City / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Darbhanga, Patna, Pan-India"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Estimated Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 - ₹1,00,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Campaign Details or Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your brand, target audience, timeline, or any specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 py-3 text-sm font-semibold transition-all shadow-md"
                >
                  {submitting ? 'Sending Enquiry...' : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Inquiry <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-[11px] text-muted-foreground">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  and allow our team to reach out regarding your inquiry.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
