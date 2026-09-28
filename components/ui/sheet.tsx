'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Sheet: React.FC<SheetProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = React.forwardRef<
  any,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => {
  const ctx = React.useContext(SheetContext)

  const handleClick = (e: React.MouseEvent<any>) => {
    ctx?.setOpen(true)
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
SheetTrigger.displayName = 'SheetTrigger'

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const ctx = React.useContext(SheetContext)
  return (
    <button
      type="button"
      ref={ref}
      onClick={(e) => {
        ctx?.setOpen(false)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
SheetClose.displayName = 'SheetClose'

const SheetPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-xl transition ease-in-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b',
        bottom: 'inset-x-0 bottom-0 border-t',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  children?: React.ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const ctx = React.useContext(SheetContext)
    if (!ctx?.open) return null

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => ctx.setOpen(false)}
        />
        <div
          ref={ref}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          <button
            type="button"
            onClick={() => ctx.setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    )
  }
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
  )
)
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
