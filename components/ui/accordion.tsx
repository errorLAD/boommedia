'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  activeItem: string | null
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
  activeItem: null,
  toggleItem: () => {},
})

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string
}

export function Accordion({
  children,
  className,
  defaultValue,
  type: _type,
  collapsible: _collapsible,
  ...props
}: AccordionProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(
    defaultValue || null
  )

  const toggleItem = React.useCallback((value: string) => {
    setActiveItem((prev) => (prev === value ? null : value))
  }, [])

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div className={cn('space-y-1', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItemContext = React.createContext<{ value: string }>({ value: '' })

export function AccordionItem({
  value,
  children,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn('border-b', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { activeItem, toggleItem } = React.useContext(AccordionContext)
  const { value } = React.useContext(AccordionItemContext)
  const isOpen = activeItem === value

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-left',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground',
          isOpen && 'rotate-180 text-foreground'
        )}
      />
    </button>
  )
}

export function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { activeItem } = React.useContext(AccordionContext)
  const { value } = React.useContext(AccordionItemContext)
  const isOpen = activeItem === value

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'pb-4 pt-0 text-sm animate-in fade-in-50 duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
