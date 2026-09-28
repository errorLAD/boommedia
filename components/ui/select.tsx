'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  selectedLabel: string
  setSelectedLabel: (label: string) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children?: React.ReactNode
}

const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
      setOpen(false)
    },
    [isControlled, onValueChange]
  )

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => ctx?.setOpen(!ctx?.open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder = 'Select...' }) => {
  const ctx = React.useContext(SelectContext)
  return (
    <span className="truncate">
      {ctx?.selectedLabel || ctx?.value || placeholder}
    </span>
  )
}

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx?.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectContent.displayName = 'SelectContent'

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    const isSelected = ctx?.value === value

    React.useEffect(() => {
      if (isSelected && typeof children === 'string') {
        ctx?.setSelectedLabel(children)
      }
    }, [isSelected, children, ctx])

    return (
      <div
        ref={ref}
        onClick={() => {
          if (typeof children === 'string') {
            ctx?.setSelectedLabel(children)
          }
          ctx?.onValueChange(value)
        }}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          isSelected && 'font-medium bg-accent/50',
          className
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        <span className="truncate">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

const SelectGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>
const SelectLabel: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground', className)}>{children}</div>
)
const SelectSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('-mx-1 my-1 h-px bg-muted', className)} />
)

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
