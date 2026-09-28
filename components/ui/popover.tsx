'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Popover: React.FC<PopoverProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [open, setOpen] = [controlledOpen !== undefined ? controlledOpen : uncontrolledOpen, (val: boolean) => {
    setUncontrolledOpen(val)
    onOpenChange?.(val)
  }]
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<
  any,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => {
  const ctx = React.useContext(PopoverContext)

  const handleClick = (e: React.MouseEvent<any>) => {
    ctx?.setOpen(!ctx.open)
    onClick?.(e as any)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      ref,
      onClick: (e: any) => {
        ;(children.props as any)?.onClick?.(e)
        handleClick(e)
      },
    })
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = 'PopoverTrigger'

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end'; sideOffset?: number }
>(({ className, align = 'center', children, ...props }, ref) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx?.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-2 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
        align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
