'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  change?: string | number
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  className?: string
  gradient?: string
  href?: string
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  description,
  className,
  gradient = 'from-purple-500/10 to-indigo-500/10 text-primary',
  href,
}: StatsCardProps) {
  const cardBody = (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-lg',
        href && 'cursor-pointer hover:border-primary/50',
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br', gradient)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {(change !== undefined || description) && (
          <div className="mt-4 flex items-center space-x-2 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center font-semibold',
                  trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                  trend === 'down' && 'text-rose-600 dark:text-rose-400',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trend === 'up' && <TrendingUp className="mr-1 h-3.5 w-3.5" />}
                {trend === 'down' && <TrendingDown className="mr-1 h-3.5 w-3.5" />}
                {change}
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      {href ? (
        <Link href={href} className="block no-underline">
          {cardBody}
        </Link>
      ) : (
        cardBody
      )}
    </motion.div>
  )
}

export default StatsCard
