'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
  Eye,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Building2,
  User,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Clock,
  Compass,
  Zap,
  Target,
  BadgeCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { VehicleCategoryItem, DEFAULT_VEHICLE_CATEGORIES } from '@/lib/types/vehicleAds'

interface VehicleAdsViewProps {
  categories: VehicleCategoryItem[]
}

const AD_FORMATS = [
  {
    id: 'full_branding',
    title: 'Full Vehicle Branding',
    badge: 'Maximum Impact',
    description:
      'Complete 360-degree vinyl wrap transforming the entire vehicle body into an unmissable mobile billboard across commuter corridors.',
    coverage: 'Front, rear, both sides & roofline',
    bestFor: 'High-budget brand launches, movies, festive campaigns & mass awareness',
    icon: Sparkles,
  },
  {
    id: 'side_branding',
    title: 'Side Panel Branding',
    badge: 'Pedestrian & Traffic View',
    description:
      'High-resolution vinyl panels installed across left and right sides, directly visible to pedestrians, waiting passengers, and parallel traffic.',
    coverage: 'Left & Right side exterior panels',
    bestFor: 'Retail store launches, healthcare offers, and regional promotions',
    icon: Layers,
  },
  {
    id: 'rear_branding',
    title: 'Rear Branding',
    badge: 'Highest Dwell Time',
    description:
      'Target following motorists and commuters in traffic jams. Guarantees long dwell times and high recall at eye level.',
    coverage: 'Full tailgate, hood back, or rear glass panel',
    bestFor: 'Mobile app downloads, helpline numbers, coaching, and D2C brands',
    icon: Target,
  },
  {
    id: 'roof_branding',
    title: 'Roof Branding',
    badge: 'Elevated Visibility',
    description:
      'Illuminated or mounted roof carriers and canopy boards visible from multi-storey buildings, pedestrian bridges, and flyovers.',
    coverage: 'Top carrier double-sided displays',
    bestFor: 'Autos and cabs operating in dense urban high-rise markets',
    icon: Zap,
  },
  {
    id: 'door_branding',
    title: 'Door Branding',
    badge: 'Sharp Precision',
    description:
      'Strategic branding placed on driver and passenger doors for clean, prominent logo and campaign message visibility.',
    coverage: 'Exterior passenger & driver side doors',
    bestFor: 'Fleet campaigns, corporate branding, and delivery vehicle networks',
    icon: BadgeCheck,
  },
  {
    id: 'interior_branding',
    title: 'Interior Branding',
    badge: 'Captive Audience',
    description:
      'Target seated passengers with in-cabin headrest posters, grab-handle tags, seat back stickers, and interactive QR codes.',
    coverage: 'Passenger cabin, back of front seats, ceiling vinyl',
    bestFor: 'Fintech, e-commerce discounts, local food orders, and QR coupons',
    icon: Eye,
  },
  {
    id: 'partial_branding',
    title: 'Partial Branding',
    badge: 'Budget-Friendly',
    description:
      'Cost-effective strategic strips and decals focusing on the most critical high-visibility sections of the vehicle.',
    coverage: 'Selected rear or side panels',
    bestFor: 'Testing local markets, early-stage startups, and continuous low-cost presence',
    icon: Compass,
  },
  {
    id: 'fleet_branding',
    title: 'Fleet Branding',
    badge: 'Market Domination',
    description:
      'Synchronized multi-vehicle campaigns blanketing entire city transit routes with consistent branding across 20 to 200+ vehicles.',
    coverage: 'Coordinated multi-vehicle fleets across routes',
    bestFor: 'Elections, government campaigns, FMCG blitzes, and mega brand expos',
    icon: Truck,
  },
]

const KEY_CITIES = [
  'Darbhanga',
  'Patna',
  'Muzaffarpur',
  'Madhubani',
  'Gaya',
  'Bhagalpur',
  'Purnia',
  'Samastipur',
]

const BUDGET_RANGES = [
  'Under ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000+',
]

export function VehicleAdsView({ categories }: VehicleAdsViewProps) {
  const formRef = useRef<HTMLDivElement>(null)
  const categoryGridRef = useRef<HTMLDivElement>(null)

  // Use the public vehicle options while the network is being built.
  // Database categories are kept for admin management and enquiries.
  const activeCategories = DEFAULT_VEHICLE_CATEGORIES

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    email: '',
    mobile: '',
    city: 'Darbhanga',
    state: 'Bihar',
    area: '',
    vehicleTypes: ['AUTO_RICKSHAW'] as string[],
    campaignStartDate: '',
    campaignEndDate: '',
    budget: '₹25,000 - ₹50,000',
    vehicleCount: '5-10',
    advertisingFormat: 'Full Vehicle Branding',
    campaignDescription: 'Vehicle advertising enquiry',
    hpWebsite: '', // honeypot
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  // Scroll Helpers
  const scrollToForm = (preselectedVehicleKey?: string) => {
    if (preselectedVehicleKey) {
      setFormData((prev) => {
        const set = new Set(prev.vehicleTypes)
        set.add(preselectedVehicleKey)
        return { ...prev, vehicleTypes: Array.from(set) }
      })
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToCategories = () => {
    categoryGridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Toggle vehicle selection in form
  const toggleVehicleType = (key: string) => {
    setFormData((prev) => {
      const exists = prev.vehicleTypes.includes(key)
      let nextTypes: string[]
      if (exists) {
        if (prev.vehicleTypes.length === 1) {
          toast.warning('Please keep at least one vehicle category selected.')
          return prev
        }
        nextTypes = prev.vehicleTypes.filter((t) => t !== key)
      } else {
        nextTypes = [...prev.vehicleTypes, key]
      }
      return { ...prev, vehicleTypes: nextTypes }
    })
    // Clear vehicle error if resolved
    if (formErrors.vehicleTypes) {
      setFormErrors((prev) => ({ ...prev, vehicleTypes: '' }))
    }
  }

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company / Brand name is required'
    } else if (formData.companyName.trim().length < 2) {
      errors.companyName = 'Company name must be at least 2 characters'
    }

    if (!formData.contactPersonName.trim()) {
      errors.contactPersonName = 'Contact person name is required'
    } else if (formData.contactPersonName.trim().length < 2) {
      errors.contactPersonName = 'Contact name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      errors.email = 'Business email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid business email address'
    }

    const cleanedMobile = formData.mobile.replace(/[\s-]/g, '')
    if (!cleanedMobile) {
      errors.mobile = 'Mobile number is required'
    } else if (!/^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/.test(cleanedMobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)'
    }

    if (!formData.city.trim()) {
      errors.city = 'Operating city is required'
    }

    if (!formData.vehicleTypes || formData.vehicleTypes.length === 0) {
      errors.vehicleTypes = 'Please select at least one vehicle category'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields in the form.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/vehicle-ads/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.error || 'Failed to submit enquiry. Please try again.')
        return
      }

      setIsSuccess(true)
      setSubmissionId(json.enquiryId || null)
      toast.success('Campaign enquiry submitted successfully!')
    } catch (err: any) {
      console.error('Submission error:', err)
      toast.error('An unexpected error occurred. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setIsSuccess(false)
    setSubmissionId(null)
    setFormData({
      companyName: '',
      contactPersonName: '',
      email: '',
      mobile: '',
      city: 'Darbhanga',
      state: 'Bihar',
      area: '',
      vehicleTypes: ['AUTO_RICKSHAW'],
      campaignStartDate: '',
      campaignEndDate: '',
      budget: '₹25,000 - ₹50,000',
      vehicleCount: '5-10',
      advertisingFormat: 'Full Vehicle Branding',
      campaignDescription: 'Vehicle advertising enquiry',
      hpWebsite: '',
    })
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 blur-3xl -z-10">
          <div className="w-full h-full bg-lime-300/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge / Origin Chip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center space-x-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-700 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                <span>Vehicle Advertising</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-serif text-4xl sm:text-6xl md:text-7xl xl:text-[92px] font-normal tracking-tight text-black leading-[0.95] sm:leading-[0.92] break-words"
              >
                Make Your Business <br />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                  Visible on the Road
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl"
              >
                Reach people in their daily travel with vehicle advertising. Choose the type of vehicle you want and
                send us your requirement.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToForm()}
                  className="h-12 px-7 rounded-full bg-black hover:bg-neutral-800 text-white font-medium shadow-lg shadow-black/10 transition-all text-sm group"
                >
                  Send Your Requirement
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToCategories}
                  className="h-12 px-7 rounded-full border-neutral-300 bg-white hover:bg-neutral-50 text-black font-medium text-sm"
                >
                  See Vehicle Options
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4 border-t border-neutral-300"
              >
                <p className="flex items-start gap-2 text-xs font-medium text-neutral-600 leading-relaxed max-w-xl">
                  <AlertCircle className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                  We are starting our vehicle advertising network and are currently onboarding vehicles and businesses.
                </p>
              </motion.div>
            </div>

            {/* Right Hero Visual: Composite Premium Transit Mosaic */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto max-w-md lg:max-w-[520px]"
              >
                {/* Main Card */}
                <div className="relative rounded-[36px] overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                  <div className="relative aspect-[4/3] w-full bg-neutral-100">
                    <Image
                      src="/images/elena-e-rickshaw.png"
                      alt="Vehicle advertising option"
                      fill
                      priority
                      className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-black text-white mb-1.5 shadow">
                        Vehicle Advertising
                      </span>
                      <h3 className="text-base font-bold">Advertise Your Business on Vehicles</h3>
                      <p className="text-xs text-white/80 line-clamp-1">
                        Tell us your city and the vehicle type you need.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Floating Badge (Secondary) */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl p-3 flex items-center space-x-3 max-w-[240px]">
                  <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Send className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black block">Start with your requirement</span>
                    <span className="text-[10px] text-neutral-600 block leading-tight">
                      We will check available options for you.
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. VEHICLE CATEGORIES GRID ─────────────────────────────────────────────── */}
      <section ref={categoryGridRef} className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-3 py-1 font-semibold text-xs">
            Vehicle Options
          </Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-black">
            Advertise Your Business on Vehicles
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Put your business advertisement on autos, e-rickshaws, buses, trucks and other vehicles. Tell us what
            you need and our team will help you find the right option.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategories.map((category) => {
            const isSelected = formData.vehicleTypes.includes(category.key)

            return (
              <motion.div
                key={category.key || (category as any)._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card
                  className={`h-full flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-black shadow-md ring-1 ring-black/10 bg-neutral-50'
                      : 'border-neutral-200 hover:border-black hover:shadow-lg bg-white'
                  }`}
                >
                  <div>
                    <CardContent className="p-5 space-y-3">
                      {/* Name & Tagline */}
                      <div>
                        <h3 className="text-base font-bold text-black tracking-tight">
                          {category.name}
                        </h3>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {category.shortDescription}
                      </p>

                    </CardContent>
                  </div>

                  {/* CTA Footer */}
                  <div className="p-5 pt-0">
                    <Button
                      onClick={() => scrollToForm(category.key)}
                      className="w-full rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs h-9 shadow-sm"
                    >
                      {category.ctaLabel || 'Ask Us'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─── 3. ADVERTISING FORMATS SECTION ─────────────────────────────────────────── */}
      <section className="hidden" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-semibold text-xs">
              Placement Options
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Vehicle Advertising Formats
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Understand where your brand can be displayed on transit assets.
              Our production network ensures vinyl durability, vibrant colors, and precise installation.
            </p>
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AD_FORMATS.map((fmt) => {
              const Icon = fmt.icon
              return (
                <Card
                  key={fmt.id}
                  className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {fmt.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{fmt.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{fmt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-1 text-[11px]">
                    <div className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Coverage:</span> {fmt.coverage}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Important Business Disclaimer (No fake pricing/inventory) */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start space-x-3.5 max-w-4xl mx-auto">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Transparent Pricing & Inventory Policy: </strong>
              Actual placement options, route availability, and campaign pricing depend on vehicle category,
              chosen city, fleet size, and duration. We do not display artificial prices or inflated counts.
              Every proposal is customized to real fleet availability upon your request.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. GROWING NETWORK ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-muted/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 sm:p-12 space-y-5">
            <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 px-3 py-1 font-semibold text-xs">
              Growing Step by Step
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Our Network Is Growing
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We are currently adding vehicles and vehicle owners to our network. If you want to advertise on
              vehicles, send us your requirement and our team will check the available options.
            </p>
            <Button
              onClick={() => scrollToForm()}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              Send Requirement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW VEHICLE ADVERTISING WORKS ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 px-3 py-1 font-semibold text-xs">
            Simple Steps
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We keep the process simple and clear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Tell Us What You Need',
              description: 'Tell us your business, city, vehicle type and advertising requirement.',
              icon: FileText,
            },
            {
              step: '02',
              title: 'We Check Options',
              description: 'Our team checks the available vehicles and suitable advertising options.',
              icon: Compass,
            },
            {
              step: '03',
              title: 'We Share the Details',
              description: 'We contact you with the available options and price.',
              icon: BadgeCheck,
            },
            {
              step: '04',
              title: 'Start Your Advertisement',
              description: 'After you approve the option, we help you start your advertisement.',
              icon: Truck,
            },
          ].map((item, idx) => {
            const StepIcon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="relative rounded-2xl border border-border/80 bg-card p-6 space-y-4 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-amber-500/40">{item.step}</span>
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <StepIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─── 5. VEHICLE ADVERTISING ENQUIRY FORM ───────────────────────────────────── */}
      <section
        ref={formRef}
        id="enquiry-form"
        className="py-20 lg:py-28 bg-neutral-50/60 border-t border-neutral-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-3 py-1 font-semibold text-xs shadow-sm">
              Vehicle Advertising Enquiry
            </Badge>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-black">
              Send Your Requirement
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
              Tell us what you need. We will check the available options and contact you.
            </p>
          </div>

          <Card className="rounded-[28px] border border-neutral-200 shadow-sm bg-white overflow-hidden">
            {isSuccess ? (
              /* Success State */
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Requirement Sent
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you. We will check your requirement and contact you.
                  </p>
                </div>

                {submissionId && (
                  <div className="inline-block rounded-xl bg-muted px-4 py-2 text-xs font-mono text-muted-foreground">
                    Reference ID: <span className="text-foreground font-semibold">{submissionId}</span>
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={handleResetForm}
                    variant="outline"
                    className="rounded-xl text-xs font-semibold"
                  >
                    Submit Another Enquiry
                  </Button>
                  <Button asChild className="rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* The Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="hpWebsite"
                  value={formData.hpWebsite}
                  onChange={(e) => setFormData({ ...formData, hpWebsite: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Section A: Company Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-border/60 pb-2">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      1. Your Business and Contact Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-xs font-semibold">
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="e.g. Mithila Sweets / Tata Steel"
                        value={formData.companyName}
                        onChange={(e) => {
                          setFormData({ ...formData, companyName: e.target.value })
                          if (formErrors.companyName) setFormErrors({ ...formErrors, companyName: '' })
                        }}
                        className={`rounded-xl h-10 text-xs ${formErrors.companyName ? 'border-destructive' : ''}`}
                      />
                      {formErrors.companyName && (
                        <p className="text-[11px] text-destructive">{formErrors.companyName}</p>
                      )}
                    </div>

                    {/* Contact Person Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="contactPersonName" className="text-xs font-semibold">
                        Contact Person Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactPersonName"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.contactPersonName}
                        onChange={(e) => {
                          setFormData({ ...formData, contactPersonName: e.target.value })
                          if (formErrors.contactPersonName) setFormErrors({ ...formErrors, contactPersonName: '' })
                        }}
                        className={`rounded-xl h-10 text-xs ${formErrors.contactPersonName ? 'border-destructive' : ''}`}
                      />
                      {formErrors.contactPersonName && (
                        <p className="text-[11px] text-destructive">{formErrors.contactPersonName}</p>
                      )}
                    </div>

                    {/* Business Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold">
                        Business Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. rahul@company.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' })
                        }}
                        className={`rounded-xl h-10 text-xs ${formErrors.email ? 'border-destructive' : ''}`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-destructive">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile" className="text-xs font-semibold">
                        Mobile Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          +91
                        </span>
                        <Input
                          id="mobile"
                          type="tel"
                          placeholder="9876543210"
                          value={formData.mobile}
                          onChange={(e) => {
                            setFormData({ ...formData, mobile: e.target.value })
                            if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: '' })
                          }}
                          className={`rounded-xl h-10 pl-11 text-xs ${formErrors.mobile ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {formErrors.mobile && (
                        <p className="text-[11px] text-destructive">{formErrors.mobile}</p>
                      )}
                    </div>

                    {/* Target City */}
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-semibold">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g. Darbhanga"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value })
                          if (formErrors.city) setFormErrors({ ...formErrors, city: '' })
                        }}
                        className={`rounded-xl h-10 text-xs ${formErrors.city ? 'border-destructive' : ''}`}
                      />
                      {/* Quick City Selector Chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {KEY_CITIES.map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setFormData({ ...formData, city: c })}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors ${
                              formData.city.toLowerCase() === c.toLowerCase()
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted border-border'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      {formErrors.city && (
                        <p className="text-[11px] text-destructive">{formErrors.city}</p>
                      )}
                    </div>

                    {/* Target State & Specific Area */}
                    <div className="space-y-1.5">
                      <Label htmlFor="area" className="text-xs font-semibold">
                        Area or Route (Optional)
                      </Label>
                      <Input
                        id="area"
                        placeholder="e.g. Station Road, Laheriasarai, Donar"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="rounded-xl h-10 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Vehicle Selection (Multi-select) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      2. Choose Vehicle Type(s) <span className="text-destructive">*</span>
                      </h3>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Select all that apply</span>
                  </div>

                  {formErrors.vehicleTypes && (
                    <p className="text-[11px] text-destructive font-medium">{formErrors.vehicleTypes}</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeCategories.map((cat) => {
                      const isChecked = formData.vehicleTypes.includes(cat.key)
                      return (
                        <button
                          type="button"
                          key={cat.key}
                          onClick={() => toggleVehicleType(cat.key)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            isChecked
                              ? 'bg-amber-500/10 border-amber-500 text-foreground ring-1 ring-amber-500/30'
                              : 'bg-muted/30 border-border/80 text-muted-foreground hover:bg-muted/60'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold leading-tight line-clamp-1">{cat.name}</span>
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                isChecked
                                  ? 'bg-amber-500 text-white border-amber-500'
                                  : 'border-muted-foreground/40 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                            {cat.tagline || 'Transit ads'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending Your Requirement...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Your Requirement
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground mt-3">
                    We will use these details only to contact you about your requirement.
                  </p>
                </div>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* ─── 6. CITY & REGIONAL EXPANSION SECTION ─────────────────────────────────── */}
      <section className="hidden" aria-hidden="true">
        <div className="rounded-3xl bg-card border border-border p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <MapPin className="h-3.5 w-3.5" />
                <span>Geographic Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Connecting Regional Markets Across Bihar
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Starting from our central hub in <strong className="text-foreground">Darbhanga</strong>, our vehicle
                network is systematically rolling out across high-growth Tier-2 and Tier-3 urban markets.
              </p>

              {/* Onboarding Notice Requirement 18 */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Inventory Expansion Note: </strong>
                  Vehicle inventory is continuously being onboarded across Bihar cities.
                  Submit your requirement and our dedicated team will help you find suitable transit options.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { city: 'Darbhanga', status: 'Active Fleet Hub' },
                  { city: 'Patna', status: 'Metro Transit Active' },
                  { city: 'Muzaffarpur', status: 'Commercial Active' },
                  { city: 'Madhubani', status: 'District Routes' },
                  { city: 'Gaya', status: 'Onboarding Network' },
                  { city: 'Bhagalpur', status: 'Onboarding Network' },
                  { city: 'Purnia', status: 'Onboarding Network' },
                  { city: 'Samastipur', status: 'Connecting Corridors' },
                ].map((item) => (
                  <div key={item.city} className="rounded-xl border p-3 bg-card/60 text-center space-y-1">
                    <span className="text-xs font-bold text-foreground block">{item.city}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ SECTION ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-muted/20 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 px-3 py-1 font-semibold text-xs">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Vehicle Advertising FAQs
            </h2>
            <p className="text-sm text-muted-foreground">
              Simple answers about vehicle advertising.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="rounded-2xl border border-border/80 bg-card px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline text-left">
                What types of vehicles can I advertise on?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Autos, electric 3-wheelers, buses, trucks, tempos, delivery vehicles, taxis and other commercial
                vehicles depending on availability in your target city.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="rounded-2xl border border-border/80 bg-card px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline text-left">
                Can I advertise across multiple cities?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                You can tell us the cities you need. We will check what is available before sharing options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="rounded-2xl border border-border/80 bg-card px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline text-left">
                Can I choose a specific vehicle?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Availability and selection depend on the campaign requirements and available vehicle inventory.
                You can specify preferred vehicle types, formats, and route corridors when submitting your request.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="rounded-2xl border border-border/80 bg-card px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline text-left">
                How much does vehicle advertising cost?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Pricing depends on the vehicle type, city, ad location and time period. Send your requirement and we
                will share the available options and price.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="rounded-2xl border border-border/80 bg-card px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline text-left">
                Can I advertise on a fleet?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Yes. Tell us the number and type of vehicles you need. We will check what is available.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
}

export default VehicleAdsView
