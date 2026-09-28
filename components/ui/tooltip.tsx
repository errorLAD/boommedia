'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content?: React.ReactNode
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const TooltipRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="group relative inline-flex">{children}</div>
const TooltipTrigger = React.forwardRef<
  any,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      ref,
    })
  }
  return (
    <button type="button" ref={ref} {...props}>
      {children}
    </button>
  )
})
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md transition-opacity opacity-0 group-hover:opacity-100',
      className
    )}
    {...props}
  >
    {children}
  </div>
))
TooltipContent.displayName = 'TooltipContent'

export {
  TooltipProvider,
  TooltipRoot as Tooltip,
  TooltipTrigger,
  TooltipContent,
}
