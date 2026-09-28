import React from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Mail, Phone, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/40 text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Boom<span className="text-primary font-extrabold">Media</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              India&apos;s first unified marketplace connecting brands with verified micro-influencers
              and hyper-local offline vehicle advertising networks. From Darbhanga to pan-India.
            </p>
            <div className="flex items-center space-x-3 text-muted-foreground pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BoomMedia on Instagram"
                className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BoomMedia on Twitter"
                className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BoomMedia on LinkedIn"
                className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BoomMedia on YouTube"
                className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/influencers" className="hover:text-primary transition-colors">
                  Find Influencers
                </Link>
              </li>
              <li>
                <Link href="/vehicle-ads" className="hover:text-primary transition-colors">
                  Vehicle Advertising
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing &amp; Commission
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              For Partners
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/brand/signup" className="hover:text-primary transition-colors">
                  Hire for Brands
                </Link>
              </li>
              <li>
                <Link href="/influencer/signup" className="hover:text-primary transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/vehicle/signup" className="hover:text-primary transition-colors">
                  List Your Vehicle
                </Link>
              </li>
              <li>
                <Link href="/brand/login" className="hover:text-primary transition-colors">
                  Partner Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Company &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About BoomMedia
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">
                  Platform Disclaimer
                </Link>
              </li>
              <li className="flex items-center space-x-2 pt-1 text-xs">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>support@boommedia.in</span>
              </li>
              <li className="flex items-center space-x-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Darbhanga, Bihar, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Infrablue Material Technologies Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
            <Link href="/refunds" className="hover:text-foreground transition-colors">
              Refund &amp; Cancellation
            </Link>
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
