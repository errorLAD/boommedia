'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronDown, Globe, MapPin, Send, Star } from 'lucide-react'
import { toast } from 'sonner'

const creatorTypes = [['Small Creators', 'Creators with a close connection with their audience.'], ['Micro Influencers', 'Creators who focus on a specific community, topic or location.'], ['Regional Creators', 'Creators who create content in local and regional languages.']]
const howItWorks = [['Tell Us About Your Brand', 'Share what you want to promote and the people you want to reach.'], ['We Find Suitable Creators', 'Our team identifies local and regional creators for your requirement.'], ['Review the Options', 'We share suitable creator options for you to review.'], ['We Coordinate the Work', 'We help coordinate content and the campaign requirements.']]
const faqs = [['Do you work only with large influencers?', 'No. Our focus is on small, micro, regional, rural and niche creators.'], ['Can you find creators from smaller cities?', 'Yes. We are building a network of creators from smaller cities, towns and local communities.'], ['Can I request creators from a specific city?', 'Yes. Add your target city or area in your campaign request.'], ['Can I choose the influencers myself?', 'Our team understands your requirement and recommends suitable creators for your campaign.']]
const initialForm = { companyName: '', contactPerson: '', email: '', contentType: 'Instagram Reel', creatorFollowers: '' }
const inputClass = 'w-full rounded-xl border border-neutral-700 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-white'

export default function InfluencerAgencyPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const update = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.companyName.trim() || !form.contactPerson.trim() || !form.email.trim() || !form.creatorFollowers) { toast.error('Please fill in all required fields.'); return }
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact-enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyName: form.companyName, contactName: form.contactPerson, email: form.email, service: 'INFLUENCER', message: `Content type: ${form.contentType}\nInstagram creator followers: ${form.creatorFollowers}` }) })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not send your request.')
      setSubmitted(true); toast.success('Your request has been sent.')
    } catch (error: any) { toast.error(error.message || 'Something went wrong. Please try again.') } finally { setSubmitting(false) }
  }

  return <main className="min-h-screen overflow-hidden bg-white text-black">
    <section className="relative min-h-[78vh] overflow-hidden py-16 sm:py-20 lg:py-24"><div className="pointer-events-none absolute -bottom-32 -left-32 h-[440px] w-[440px] rounded-full bg-lime-300/30 blur-[110px]" /><div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8"><div className="lg:col-span-6"><div className="mb-10 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white"><Star className="h-4 w-4 fill-black" /></div><div><p className="font-bold tracking-tight">Local Creators</p><p className="text-xs text-neutral-600">Influencer marketing for local and regional reach</p></div></div><div className="mb-8"><span className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">Influencer Marketing</span><h1 className="mt-6 font-serif text-4xl sm:text-6xl md:text-7xl xl:text-[92px] leading-[0.95] sm:leading-[.92] tracking-tight break-words">Creators Who<br />Know Their Community<span className="font-sans text-2xl sm:text-4xl lg:text-5xl font-light">^</span></h1><p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">Work with local and regional creators who understand their community, language and audience. Tell us what you need and we will help find suitable options.</p></div><div className="border-t border-neutral-300 py-5"><div className="flex items-center gap-2 text-sm font-medium"><Globe className="h-4 w-4" /> Local understanding. Real community connection.</div><p className="mt-4 max-w-xl text-lg leading-snug sm:text-2xl">Find creators who make your brand message feel familiar and relevant.</p></div><a href="#campaign-request" className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-neutral-800">Tell Us About Your Campaign <ArrowRight className="h-4 w-4" /></a></div><div className="lg:col-span-6"><div className="grid grid-cols-2 gap-4 sm:gap-6"><HeroImage src="/images/arjun-local-creator.png" alt="Local creator filming content" className="h-52 sm:h-72" priority /><HeroImage src="/images/tariq-darbhanga-creator.png" alt="Creator filming in Darbhanga" className="mt-8 h-60 sm:h-80" delay={.08} priority /><HeroImage src="/images/zoya-city-landmark.png" alt="Regional landmark" className="h-52 sm:h-72" delay={.14} /><HeroImage src="/images/priya-auto-rickshaw.png" alt="Local transport" className="h-52 sm:h-72" delay={.2} /></div></div></div></section>
    <section className="border-y border-neutral-200 bg-neutral-50/60 py-20 lg:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><Title eyebrow="Who We Work With" title="Local & Regional Creators" text="We focus on creators who know their audience and community." /><div className="mt-12 grid gap-5 md:grid-cols-3">{creatorTypes.map(([title, description]) => <article key={title} className="rounded-[28px] border border-neutral-200 bg-white p-7"><MapPin className="h-5 w-5" /><h3 className="mt-8 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p></article>)}</div></div></section>
    <section className="py-20 lg:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><Title eyebrow="Simple Process" title="How We Work" /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{howItWorks.map(([title, description], index) => <div key={title} className="rounded-[28px] border border-neutral-200 bg-neutral-50/50 p-7"><span className="text-xs font-semibold text-neutral-400">0{index + 1}</span><h3 className="mt-7 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p></div>)}</div></div></section>
    <section id="campaign-request" className="scroll-mt-16 bg-neutral-900 py-20 text-white lg:py-28"><div className="mx-auto max-w-4xl px-4 sm:px-6"><Title eyebrow="Get Started" title="Tell Us About Your Campaign" text="Share a few details and our team will contact you." dark />{submitted ? <Success onReset={() => { setSubmitted(false); setForm(initialForm) }} /> : <form onSubmit={submit} className="mt-10 space-y-6 rounded-[28px] border border-neutral-700 bg-neutral-800/70 p-6 sm:p-9"><div className="grid gap-5 sm:grid-cols-2"><Field label="Company Name" required><input required value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Enter your company name" className={inputClass} /></Field><Field label="Contact Person" required><input required value={form.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} placeholder="Enter your name" className={inputClass} /></Field><Field label="Email" required><input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Enter your email" className={inputClass} /></Field><Field label="Content Type"><select value={form.contentType} onChange={(e) => update('contentType', e.target.value)} className={inputClass}><option>Instagram Reel</option></select></Field><Field label="Instagram Creator Followers" required><select required value={form.creatorFollowers} onChange={(e) => update('creatorFollowers', e.target.value)} className={inputClass}><option value="">Select follower range</option><option>Under 10K</option><option>10K – 50K</option><option>50K – 100K</option><option>100K – 500K</option><option>500K+</option></select></Field></div><button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:opacity-60">{submitting ? 'Sending Request...' : <>Submit Request <Send className="h-4 w-4" /></>}</button></form>}</div></section>
    <section className="py-20 lg:py-28"><div className="mx-auto max-w-4xl px-4 sm:px-6"><div className="mb-12 text-center"><Title eyebrow="Clear Answers" title="Simple Questions" /></div><div className="divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer], index) => <div key={question} className="py-6"><button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 text-left text-base font-medium"><span>{question}</span><ChevronDown className={`h-5 w-5 text-neutral-400 transition ${openFaq === index ? 'rotate-180 text-black' : ''}`} /></button>{openFaq === index && <p className="pt-4 text-sm leading-relaxed text-neutral-600">{answer}</p>}</div>)}</div></div></section>
  </main>
}

function HeroImage({ src, alt, className, delay = 0, priority = false }: { src: string; alt: string; className: string; delay?: number; priority?: boolean }) {
  const imageSource = src === '/images/priya-auto-rickshaw.png' ? '/images/influencer-creator-studio.png' : src
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-md sm:rounded-[36px] ${className}`}
    >
      <Image
        src={imageSource}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 360px"
        className="object-cover"
        priority={priority}
      />
    </motion.div>
  )
}
function Title({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text?: string; dark?: boolean }) { return <div className="max-w-2xl"><span className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-lime-300' : 'text-violet-500'}`}>{eyebrow}</span><h2 className={`mt-1 font-serif text-3xl tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-black'}`}>{title}</h2>{text && <p className={`mt-4 text-sm leading-relaxed ${dark ? 'text-neutral-300' : 'text-neutral-500'}`}>{text}</p>}</div> }
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block text-sm font-medium text-white"><span className="mb-2 block">{label}{required && <span className="text-neutral-400"> *</span>}</span>{children}</label> }
function Success({ onReset }: { onReset: () => void }) { return <div className="mt-10 rounded-[28px] border border-neutral-700 bg-neutral-800/70 p-8 sm:p-12"><CheckCircle2 className="h-11 w-11" /><h3 className="mt-5 font-serif text-3xl">Thank You!</h3><p className="mt-3 text-sm leading-relaxed text-neutral-400">We received your request. Our team will contact you soon.</p><button onClick={onReset} className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Send Another Request</button></div> }
