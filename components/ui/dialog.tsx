'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({
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
    <DialogContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<any, DialogTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const ctx = React.useContext(DialogContext)

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
  }
)
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const ctx = React.useContext(DialogContext)
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
DialogClose.displayName = 'DialogClose'

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const ctx = React.useContext(DialogContext)
    if (!ctx?.open) return null
    return (
      <div
        ref={ref}
        onClick={(e) => {
          ctx.setOpen(false)
          onClick?.(e)
        }}
        className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0', className)}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(DialogContext)
    if (!ctx?.open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => ctx.setOpen(false)}
        />
        <div
          ref={ref}
          className={cn(
            'relative z-50 grid w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto gap-4 border bg-background p-6 shadow-xl sm:rounded-2xl animate-in zoom-in-95',
            className
          )}
          {...props}
        >
          {children}
          <button
            type="button"
            onClick={() => ctx.setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
