'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  className?: string
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const currentValue = value?.[0] ?? defaultValue[0] ?? 0

    return (
      <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
