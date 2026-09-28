'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative overflow-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
)
ScrollArea.displayName = 'ScrollArea'

const ScrollBar: React.FC<{ className?: string; orientation?: 'vertical' | 'horizontal' }> = () => null

export { ScrollArea, ScrollBar }
