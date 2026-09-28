'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Globe,
  Sparkles,
  Check,
  CheckCircle2,
  Truck,
  Video,
  Sliders,
  Lock,
  Compass,
  Users,
  Briefcase,
  Play,
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
  MapPin,
  Flame,
} from 'lucide-react'

// ─── Verified Talent & Fleet Directory Data ──────────────────────────────────

const FEATURED_CREATORS = [
  {
    id: '6ab011e4c4312bd1dc41b6a1',
    name: 'Priya Sharma',
    handle: '@priyastyle',
    niche: 'Mithila Culture & Fashion',
    city: 'Darbhanga, Bihar',
    followers: '185K',
    engagement: '5.8%',
    rate: '₹7,500',
    rateUnit: 'per Reel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
  {
    id: '6ab011e4c4312bd1dc41b6a2',
    name: 'Arjun Mehta',
    handle: '@arjuntech',
    niche: 'Consumer Tech & Gadgets',
    city: 'Bengaluru, KA',
    followers: '240K',
    engagement: '6.4%',
    rate: '₹14,000',
    rateUnit: 'per Video',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
  {
    id: '6ab011e4c4312bd1dc41b6a3',
    name: 'Zoya Khan',
    handle: '@zoyaeats',
    niche: 'Food & Regional Travel',
    city: 'Patna, Bihar',
    followers: '310K',
    engagement: '5.2%',
    rate: '₹11,000',
    rateUnit: 'per Post',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
]

const FEATURED_VEHICLES = [
  {
    id: 'veh-01',
    title: 'Mayuri E-Rickshaw Fleet (10x)',
    type: 'E-Rickshaw Full Wrap',
    city: 'Darbhanga, Bihar',
    route: 'Darbhanga Tower ⇄ Laheriasarai Station',
    exposure: '42,000 daily passersby',
    rate: '₹3,500',
    rateUnit: 'per week',
    photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop',
    verified: true,
  },
  {
    id: 'veh-02',
    title: 'Bajaj Compact Auto Fleet (15x)',
    type: 'Auto-Rickshaw Hood & Back',
    city: 'Patna, Bihar',
    route: 'Patna Junction ⇄ Bailey Road',
    exposure: '65,000 daily passersby',
    rate: '₹4,800',
    rateUnit: 'per week',
    photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop',
    verified: true,
  },
]

// ─── Brand Stories ────────────────────────────────────────────────────────────

const BRAND_STORIES = [
  {
    brand: "Global'lan Apparel",
    tagline: 'Sustainable D2C Handloom',
    quote: '“Connect My Account, Generated Nice Royalties Using My Content Across Platforms.”',
    author: 'Arther',
    role: 'Social Influencer',
    rating: '5.0',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    stats: '1.4M Reach · 4.8x ROAS',
  },
  {
    brand: 'LUMÉA Botanicals',
    tagline: 'Clean Beauty & Skincare',
    quote: '“Booked 8 micro-creators and 20 city auto wraps for our regional debut. Full escrow safety gave us complete peace of mind.”',
    author: 'Radhika S.',
    role: 'VP Brand Marketing',
    rating: '5.0',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face',
    stats: '890K Views · 3.9x Lift',
  },
  {
    brand: 'IVORA Urban Foods',
    tagline: 'Instant Quick-Commerce',
    quote: '“Combined Instagram reels with street auto-rickshaw ads across Patna. Highest customer recall of any launch we’ve done.”',
    author: 'Sunil Verma',
    role: 'Growth Lead',
    rating: '4.9',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
    stats: '2.8M Impressions',
  },
]

// ─── FAQ Items ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How do I start a campaign?',
    a: 'Tell us what you want to promote, who you want to reach and where you want to reach them. Our team will help you plan the next step.',
  },
  {
    q: 'Can I use creators and vehicle advertising together?',
    a: 'Yes. Tell us your requirement and our team will check the suitable options for your campaign.',
  },
  {
    q: 'What vehicles can I advertise on?',
    a: 'You can ask about autos, e-rickshaws, buses, trucks, delivery vehicles, tempos, taxis and other commercial vehicles. Availability depends on the city and requirement.',
  },
  {
    q: 'Do you work with local creators?',
    a: 'Yes. We focus on small, micro, regional, Tier-2, Tier-3 and rural creators who understand their community.',
  },
]

type EnquiryService = 'INFLUENCER' | 'VEHICLE' | 'BOTH'

const SERVICE_OPTIONS: { value: EnquiryService; title: string; description: string }[] = [
  {
    value: 'INFLUENCER',
    title: 'Influencer Marketing',
    description: 'Promote your business through local, regional and small creators.',
  },
  {
    value: 'VEHICLE',
    title: 'Vehicle Advertising',
    description: 'Advertise your business on autos, e-rickshaws, buses, trucks and other vehicles.',
  },
  {
    value: 'BOTH',
    title: 'Both',
    description: 'I am interested in both services.',
  },
]

export default function LandingPage() {
  const [activeHeadline, setActiveHeadline] = useState<'creators' | 'transit'>('creators')
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0)
  const [calcBudget, setCalcBudget] = useState<number>(50000)
  const [calcType, setCalcType] = useState<'COMBINED' | 'INFLUENCER' | 'VEHICLE'>('COMBINED')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [filterTab, setFilterTab] = useState<'ALL' | 'CREATORS' | 'VEHICLES'>('ALL')
  const [enquiry, setEnquiry] = useState({ companyName: '', contactName: '', email: '', phone: '', service: '' as EnquiryService | '', message: '' })
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({})
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false)
  const [enquirySubmitted, setEnquirySubmitted] = useState(false)
  const [enquiryError, setEnquiryError] = useState('')

  const currentStory = BRAND_STORIES[activeStoryIndex]

  const estimates = useMemo(() => {
    let creators = 0
    let vehicles = 0
    let impressions = 0

    if (calcType === 'COMBINED') {
      creators = Math.max(1, Math.round((calcBudget * 0.55) / 6500))
      vehicles = Math.max(2, Math.round((calcBudget * 0.45) / 3000))
      impressions = Math.round(creators * 95000 + vehicles * 150000)
    } else if (calcType === 'INFLUENCER') {
      creators = Math.max(1, Math.round(calcBudget / 6000))
      impressions = Math.round(creators * 110000)
    } else {
      vehicles = Math.max(2, Math.round(calcBudget / 2800))
      impressions = Math.round(vehicles * 180000)
    }

    const cpm = ((calcBudget / impressions) * 1000).toFixed(1)
    return { creators, vehicles, impressions, cpm }
  }, [calcBudget, calcType])

  const submitEnquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    const phoneDigits = enquiry.phone.replace(/\D/g, '')
    if (enquiry.companyName.trim().length < 2) errors.companyName = 'Enter your company name.'
    if (enquiry.contactName.trim().length < 2) errors.contactName = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email.trim())) errors.email = 'Enter a valid email address.'
    if (phoneDigits.length < 10 || phoneDigits.length > 15) errors.phone = 'Enter a valid phone number.'
    if (!enquiry.service) errors.service = 'Select a service.'
    setEnquiryErrors(errors)
    setEnquiryError('')
    if (Object.keys(errors).length > 0) return

    setIsSubmittingEnquiry(true)
    try {
      const response = await fetch('/api/contact-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to send your request.')
      setEnquirySubmitted(true)
    } catch (error) {
      setEnquiryError(error instanceof Error ? error.message : 'Unable to send your request.')
    } finally {
      setIsSubmittingEnquiry(false)
    }
  }

  return (
    <div className="bg-white text-black font-sans antialiased selection:bg-black selection:text-white min-h-screen overflow-x-hidden">
      {/* ── 1. HERO SECTION (REFERENCE IMAGE AESTHETIC) ── */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-20 lg:pb-28 overflow-hidden min-h-[92vh] flex flex-col justify-center">
        {/* Radiant Neon Lime Ambient Glow (Exact match to reference bottom-left) */}
        <div
          className="pointer-events-none absolute -bottom-24 -left-28 w-[580px] h-[580px] sm:w-[720px] sm:h-[720px] rounded-full blur-[110px] opacity-90 -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(34, 197, 94, 0.95) 0%, rgba(74, 222, 128, 0.8) 25%, rgba(132, 204, 22, 0.6) 45%, rgba(163, 230, 53, 0.3) 65%, transparent 80%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-12 -left-10 w-[360px] h-[360px] rounded-full blur-[90px] opacity-80 -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(132, 204, 22, 0.9) 0%, rgba(163, 230, 53, 0.7) 35%, transparent 75%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* ── LEFT COLUMN: EDITORIAL CONTENT & HEADLINE ── */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center relative z-10">
              {/* Social Proof Badge (Exact match to reference: star in circle + 1.8M+ User) */}
              <div className="flex items-center gap-3.5 mb-8 sm:mb-12">
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-sm">
                  <Star className="w-4 h-4 fill-black text-black" />
                </div>
                <div>
                  <div className="font-bold text-base sm:text-lg text-black tracking-tight leading-tight">
                    Two Services
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    Influencer marketing and vehicle advertising
                  </div>
                </div>
              </div>

              {/* Giant Serif Headline: Creators^ (Exact reference typography) */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setActiveHeadline('creators')}
                    className={`text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full transition-all ${
                      activeHeadline === 'creators'
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Social Creators
                  </button>
                  <button
                    onClick={() => setActiveHeadline('transit')}
                    className={`text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full transition-all ${
                      activeHeadline === 'transit'
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Vehicle Transit
                  </button>
                </div>

                {activeHeadline === 'creators' ? (
                  <h1 className="text-4xl sm:text-6xl md:text-8xl xl:text-[106px] font-serif font-normal text-black tracking-tight leading-[0.95] sm:leading-[0.92] select-none break-words">
                    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">Reach More People</span><span className="font-sans font-light text-2xl sm:text-4xl lg:text-6xl xl:text-7xl ml-1 text-black">^</span>
                  </h1>
                ) : (
                  <h1 className="text-4xl sm:text-6xl md:text-8xl xl:text-[96px] font-serif font-normal text-black tracking-tight leading-[0.95] sm:leading-[0.92] select-none break-words">
                    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">On the Road</span><span className="font-sans font-light text-2xl sm:text-4xl lg:text-6xl xl:text-7xl ml-1 text-black">^</span>
                  </h1>
                )}

                <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed font-normal">
                  Connect your brand with local creators and vehicle advertising. Tell us what you need and our team helps you plan and manage your campaign.
                </p>
              </div>

              {/* Horizontal Separator Line */}
              <div className="w-full h-px bg-neutral-300/80 my-2 sm:my-4" />

              {/* Platform introduction */}
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-sm text-black">
                    <Globe className="w-4 h-4 text-black stroke-[1.5]" />
                    <span className="tracking-tight font-medium">Two Services. Local Reach.</span>
                  </div>
                </div>
                <blockquote className="text-lg sm:text-2xl text-neutral-900 font-normal leading-snug tracking-tight">Influencer marketing and vehicle advertising — tailored to help your brand reach more people.</blockquote>
              </div>

              {/* Action Buttons (Black pill style) */}
              <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#contact"
                  className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white rounded-full text-sm font-medium tracking-wide shadow-lg shadow-black/10 transition-all hover:scale-105 inline-flex items-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN: STAGGERED MONOCHROME PORTRAIT MOSAIC WALL ── */}
            <div className="lg:col-span-6 xl:col-span-6 relative overflow-hidden lg:overflow-visible flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[540px] xl:max-w-[580px] select-none">
                <div className="flex flex-col gap-4 sm:gap-6 pt-0 sm:pt-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/priya-auto-rickshaw.png" alt="Auto-rickshaw illustration" width={320} height={288} priority sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-56 sm:h-72 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Priya Sharma</div><div className="text-[10px] text-neutral-300">185K Followers · Mithila</div></div></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/arjun-local-creator.png" alt="Local creator filming in Patna" width={320} height={288} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-56 sm:h-72 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Arjun Mehta</div><div className="text-[10px] text-neutral-300">Tech & Design · 240K</div></div></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/zoya-city-landmark.png" alt="Historic city landmark" width={320} height={288} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-56 sm:h-72 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Zoya Khan</div><div className="text-[10px] text-neutral-300">Food & Travel · 310K</div></div></div>
                  </motion.div>
                </div>
                <div className="flex flex-col gap-4 sm:gap-6 -mt-4 sm:-mt-8">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/elena-e-rickshaw.png" alt="Red e-rickshaw" width={320} height={320} priority sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-64 sm:h-80 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Elena Roy</div><div className="text-[10px] text-neutral-300">Editorial D2C Fashion</div></div></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/tariq-darbhanga-creator.png" alt="Creator filming in Darbhanga" width={320} height={288} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-56 sm:h-72 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Tariq Al-Amin</div><div className="text-[10px] text-neutral-300">Fitness & Lifestyle</div></div></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative group rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-md border border-neutral-200/80">
                    <Image src="/images/mayuri-landmark.png" alt="Historic city landmark" width={320} height={288} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 290px" className="w-full h-56 sm:h-72 object-cover grayscale contrast-110 group-hover:contrast-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><div className="text-white"><div className="text-xs font-semibold">Mayuri E-Rickshaws</div><div className="text-[10px] text-neutral-300">Darbhanga City Fleet</div></div></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DUAL PILLARS: ONLINE INFLUENCE + STREET TRANSIT ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Two Services
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-black mt-2 tracking-tight">
              Two Ways to Reach Your Customers
            </h2>
            <p className="mt-4 text-neutral-600 text-base">
              Choose influencer marketing, vehicle advertising, or both to reach more customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: Managed Influencer Agency */}
            <div className="p-8 rounded-[32px] border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Influencer Marketing
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Reach customers through local creators. Work with small, regional and local creators who understand their audience.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-700 font-medium border-t border-neutral-200 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  We find suitable creators
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Explore Influencer Marketing
                </li>
              </ul>
            </div>

            {/* Pillar 2: Vehicle Transit Ads */}
            <div className="p-8 rounded-[32px] border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Vehicle Advertising
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Make your brand visible on the road. Advertise on autos, e-rickshaws, buses, trucks and other commercial vehicles.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-700 font-medium border-t border-neutral-200 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Tell us your city and requirement
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  We check available options
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Explore Vehicle Ads
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. LIVE MARKETPLACE DIRECTORY HIGHLIGHTS ── */}
      <section className="hidden" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Direct Discovery
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-black mt-1 tracking-tight">
                Featured Verified Partners
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-neutral-200">
              <button
                onClick={() => setFilterTab('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterTab === 'ALL' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('CREATORS')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterTab === 'CREATORS' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Creators
              </button>
              <button
                onClick={() => setFilterTab('VEHICLES')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterTab === 'VEHICLES' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Transit Fleets
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Creators */}
            {(filterTab === 'ALL' || filterTab === 'CREATORS') &&
              FEATURED_CREATORS.map((creator) => (
                <div
                  key={creator.id}
                  className="bg-white rounded-[28px] p-6 border border-neutral-200 shadow-sm hover:border-black transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-2xl object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-base text-black">
                          <span>{creator.name}</span>
                          <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                        </div>
                        <div className="text-xs text-neutral-500">{creator.handle}</div>
                        <div className="text-xs font-medium text-neutral-700 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {creator.city}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-neutral-100 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Followers</span>
                        <span className="font-bold text-black">{creator.followers}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Engagement</span>
                        <span className="font-bold text-emerald-600">{creator.engagement}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Starting Rate</span>
                      <span className="text-base font-bold text-black">{creator.rate}</span>
                      <span className="text-xs text-neutral-500 ml-1 font-normal">{creator.rateUnit}</span>
                    </div>
                    <Link
                      href="/influencers#brief-builder"
                      className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-all"
                    >
                      Hire via Agency
                    </Link>
                  </div>
                </div>
              ))}

            {/* Vehicle Fleets */}
            {(filterTab === 'ALL' || filterTab === 'VEHICLES') &&
              FEATURED_VEHICLES.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-[28px] overflow-hidden border border-neutral-200 shadow-sm hover:border-black transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={vehicle.photo}
                        alt={vehicle.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {vehicle.type}
                      </span>
                    </div>

                    <div className="p-6">
                      <h4 className="font-bold text-base text-black mb-1">{vehicle.title}</h4>
                      <p className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {vehicle.city} · {vehicle.route}
                      </p>

                      <div className="py-2.5 border-t border-neutral-100 text-xs flex items-center justify-between">
                        <span className="text-neutral-500">Daily Exposure:</span>
                        <span className="font-bold text-emerald-600">{vehicle.exposure}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Weekly Rental</span>
                      <span className="text-base font-bold text-black">{vehicle.rate}</span>
                      <span className="text-xs text-neutral-500 ml-1 font-normal">{vehicle.rateUnit}</span>
                    </div>
                    <Link
                      href="/brand/signup"
                      className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-all"
                    >
                      Book Fleet
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/brand/campaigns"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
            >
              Explore all 2,400+ creators and fleet partners in India <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. CAMPAIGN BUDGET & ROI CALCULATOR ── */}
      <section className="hidden" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-black mt-1 tracking-tight">
                Simulate your campaign impact.
              </h2>
              <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
                Calculate your reach across digital creators and auto transit fleets. All funds are protected inside the platform escrow vault until verified proof submission.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-black">
                    ✓
                  </div>
                  <span>10% transparent platform fee — 0% hidden surprises</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-black">
                    ✓
                  </div>
                  <span>Direct UPI & NetBanking payments via Razorpay</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-black">
                    ✓
                  </div>
                  <span>Automated milestone release on content approval</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-neutral-50 rounded-[32px] p-6 sm:p-10 border border-neutral-200 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                    Campaign Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { type: 'COMBINED', label: 'Hybrid 360°' },
                      { type: 'INFLUENCER', label: 'Creators Only' },
                      { type: 'VEHICLE', label: 'Transit Ads Only' },
                    ].map((mode) => (
                      <button
                        key={mode.type}
                        onClick={() => setCalcType(mode.type as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          calcType === mode.type
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Total Campaign Budget
                    </span>
                    <span className="text-2xl font-serif font-bold text-black">
                      ₹{calcBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="500000"
                    step="5000"
                    value={calcBudget}
                    onChange={(e) => setCalcBudget(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                    <span>₹15,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000+</span>
                  </div>
                </div>

                {/* Calculated Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-neutral-200">
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Creators
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-black">
                      {estimates.creators}x
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Vehicles
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-black">
                      {estimates.vehicles}x
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Impressions
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-600">
                      {(estimates.impressions / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-neutral-500 font-medium">
                    Estimated blended CPM: <strong className="text-black font-semibold">₹{estimates.cpm}</strong>
                  </span>
                  <Link
                    href="/brand/signup"
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-sm transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    Deploy Budget <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 lg:py-28 bg-neutral-50/50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Simple Process</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-black mt-1 tracking-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Tell Us What You Need', description: 'Share your business, campaign goal, location and the type of advertising you are looking for.' },
              { title: 'We Find the Right Options', description: 'Our team finds suitable local creators, influencers or vehicle advertising options based on your needs.' },
              { title: 'Review & Approve', description: 'We share the campaign details with you. Review the options, choose what works for your business and approve the campaign.' },
              { title: 'We Manage the Campaign', description: 'Our team coordinates the work, manages the campaign and keeps you updated from start to finish.' },
            ].map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-7">
                <span className="text-xs font-semibold text-neutral-400">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-bold text-black tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / GET STARTED ── */}
      <section className="py-20 lg:py-28 bg-white" id="contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Get Started</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-black mt-1 tracking-tight">Tell Us What You Need</h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Looking for influencer marketing or vehicle advertising? Share your details and our team will contact you.
            </p>
          </div>

          {enquirySubmitted ? (
            <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-8 sm:p-10">
              <h3 className="text-2xl font-serif text-black">Thank You!</h3>
              <p className="mt-3 text-sm text-neutral-600">We received your request. Our team will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={submitEnquiry} noValidate className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block text-sm font-medium text-black">
                  Company Name <span className="text-neutral-500">*</span>
                  <input
                    value={enquiry.companyName}
                    onChange={(e) => setEnquiry({ ...enquiry, companyName: e.target.value })}
                    placeholder="Enter your company name"
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black ${enquiryErrors.companyName ? 'border-red-500' : 'border-neutral-200'}`}
                  />
                  {enquiryErrors.companyName && <span className="mt-1.5 block text-xs text-red-600">{enquiryErrors.companyName}</span>}
                </label>
                <label className="block text-sm font-medium text-black">
                  Contact Person Name <span className="text-neutral-500">*</span>
                  <input
                    value={enquiry.contactName}
                    onChange={(e) => setEnquiry({ ...enquiry, contactName: e.target.value })}
                    placeholder="Enter your name"
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black ${enquiryErrors.contactName ? 'border-red-500' : 'border-neutral-200'}`}
                  />
                  {enquiryErrors.contactName && <span className="mt-1.5 block text-xs text-red-600">{enquiryErrors.contactName}</span>}
                </label>
                <label className="block text-sm font-medium text-black">
                  Email <span className="text-neutral-500">*</span>
                  <input
                    type="email"
                    value={enquiry.email}
                    onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                    placeholder="Enter your email"
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black ${enquiryErrors.email ? 'border-red-500' : 'border-neutral-200'}`}
                  />
                  {enquiryErrors.email && <span className="mt-1.5 block text-xs text-red-600">{enquiryErrors.email}</span>}
                </label>
                <label className="block text-sm font-medium text-black">
                  Phone Number <span className="text-neutral-500">*</span>
                  <input
                    type="tel"
                    value={enquiry.phone}
                    onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black ${enquiryErrors.phone ? 'border-red-500' : 'border-neutral-200'}`}
                  />
                  {enquiryErrors.phone && <span className="mt-1.5 block text-xs text-red-600">{enquiryErrors.phone}</span>}
                </label>
              </div>

              <fieldset className="mt-7">
                <legend className="text-sm font-medium text-black">Service You Are Looking For <span className="text-neutral-500">*</span></legend>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SERVICE_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => { setEnquiry({ ...enquiry, service: option.value }); setEnquiryErrors({ ...enquiryErrors, service: '' }) }}
                      className={`rounded-2xl border p-4 text-left transition-colors ${enquiry.service === option.value ? 'border-black bg-white' : 'border-neutral-200 bg-white hover:border-neutral-400'}`}
                    >
                      <span className="block text-sm font-semibold text-black">{option.title}</span>
                      <span className="mt-1.5 block text-xs leading-relaxed text-neutral-600">{option.description}</span>
                    </button>
                  ))}
                </div>
                {enquiryErrors.service && <span className="mt-1.5 block text-xs text-red-600">{enquiryErrors.service}</span>}
              </fieldset>

              <label className="mt-7 block text-sm font-medium text-black">
                Tell Us More <span className="text-neutral-400 font-normal">(optional)</span>
                <textarea
                  value={enquiry.message}
                  onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us what you want to promote, your city, or any other requirement."
                  className="mt-2 w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                />
              </label>

              {enquiryError && <p className="mt-4 text-sm text-red-600">{enquiryError}</p>}
              <button disabled={isSubmittingEnquiry} className="mt-7 px-8 py-3.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-full text-sm font-medium tracking-wide shadow-lg shadow-black/10 transition-all inline-flex items-center gap-2">
                {isSubmittingEnquiry ? 'Sending...' : 'Send My Request'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 7. EDITORIAL FAQ ACCORDION ── */}
      <section className="py-20 lg:py-28 bg-white" id="stories">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-black mt-1 tracking-tight">
              Simple Questions
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-medium text-black group-hover:text-neutral-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 text-sm text-neutral-600 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. MINIMALIST FOOTER ── */}
      <footer className="py-12 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-black tracking-tight">BoomMedia</span>
            <span className="text-xs text-neutral-400">/ Online Influence + Offline Transit</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600 font-medium">
            <Link href="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="hover:text-black transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="hover:text-black transition-colors">
              Escrow Pricing
            </Link>
            <Link href="/admin/login" className="text-neutral-400 hover:text-black transition-colors">
              Admin Portal
            </Link>
          </div>

          <div className="text-xs text-neutral-400">
            © {new Date().getFullYear()} BoomMedia Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
