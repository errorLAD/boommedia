'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Users,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Influencer Marketing', href: '/influencers' },
  { label: 'Vehicle Ads', href: '/vehicle-ads' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getDashboardHref = (role?: string) => {
    switch (role) {
      case 'BRAND':
        return '/brand/dashboard'
      case 'INFLUENCER':
        return '/influencer/dashboard'
      case 'VEHICLE_PARTNER':
        return '/vehicle/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      default:
        return '/'
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'border-b border-border/80 bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center text-sm font-medium text-black tracking-tight">
            <span className="font-bold text-black text-base sm:text-sm mr-1">Boom<span className="text-primary font-extrabold">Media</span></span>
            <span className="hidden sm:inline-flex items-center">
              <span className="text-neutral-400 mx-1.5 font-light">/</span>
              <span>hey@boommedia.in</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10 font-bold ring-1 ring-primary/20 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {mounted && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center space-x-2 rounded-full pl-2 pr-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(session.user.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {session.user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl">
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-foreground">{session.user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                  <span className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {(session.user as any).role || 'USER'}
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardHref((session.user as any).role)} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 rounded-full text-white font-semibold px-4 h-9 shadow-sm text-xs">
                <Link href="/#contact">
                  Start Advertising
                </Link>
              </Button>

              {/* Login Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-black font-medium text-sm hover:bg-neutral-100 rounded-full px-4">
                    Login
                    <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link href="/brand/login" className="cursor-pointer flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-purple-600" />
                      As Brand
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/influencer/login" className="cursor-pointer flex items-center">
                      <Users className="mr-2 h-4 w-4 text-indigo-600" />
                      As Influencer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vehicle/login" className="cursor-pointer flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-amber-500" />
                      As Vehicle Partner
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Register Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-black hover:bg-neutral-800 rounded-full text-white font-medium px-5 h-9 shadow-sm">
                    Register
                    <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link href="/brand/signup" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs flex items-center">
                          <Briefcase className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
                          Join as Brand
                        </span>
                        <span className="text-[10px] text-muted-foreground">Hire creators & vehicle ads</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/influencer/signup" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs flex items-center">
                          <Users className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                          Join as Influencer
                        </span>
                        <span className="text-[10px] text-muted-foreground">Monetize your social reach</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vehicle/signup" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs flex items-center">
                          <Truck className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                          Join as Vehicle Partner
                        </span>
                        <span className="text-[10px] text-muted-foreground">Earn from your auto/rickshaw</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px]" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] p-6 flex flex-col justify-between overflow-y-auto max-h-screen">
              <div>
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Boom<span className="text-primary font-extrabold">Media</span></span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-1.5">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                {mounted && session?.user ? (
                  <>
                    <Button asChild className="w-full min-h-[44px]">
                      <Link
                        href={getDashboardHref((session.user as any).role)}
                        onClick={() => setMobileOpen(false)}
                      >
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-destructive min-h-[44px]"
                      onClick={() => {
                        setMobileOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 rounded-full text-white font-semibold text-xs shadow-sm min-h-[44px]">
                      <Link href="/#contact" onClick={() => setMobileOpen(false)}>
                        Start Advertising
                      </Link>
                    </Button>
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Log In</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <Button asChild variant="outline" size="sm" className="w-full text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/brand/login" onClick={() => setMobileOpen(false)}>
                            Brand
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/influencer/login" onClick={() => setMobileOpen(false)}>
                            Creator
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/vehicle/login" onClick={() => setMobileOpen(false)}>
                            Vehicle
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Sign Up</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <Button asChild size="sm" className="w-full bg-black hover:bg-neutral-800 text-white text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/brand/signup" onClick={() => setMobileOpen(false)}>
                            Brand
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="w-full bg-black hover:bg-neutral-800 text-white text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/influencer/signup" onClick={() => setMobileOpen(false)}>
                            Creator
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="w-full bg-black hover:bg-neutral-800 text-white text-[11px] px-1 h-9 rounded-xl">
                          <Link href="/vehicle/signup" onClick={() => setMobileOpen(false)}>
                            Vehicle
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
export default Navbar
