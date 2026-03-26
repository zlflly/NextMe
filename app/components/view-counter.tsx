'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface ViewCounterProps {
  path: string
  variant?: 'plain' | 'pill' | 'minimal'
}

function CoffeeBeanIcon({ className }: { className?: string }) {
  return (
    <span className="relative inline-block h-3 w-3">
      <Image
        src="/coffee-bean.svg"
        alt=""
        width={12}
        height={12}
        className={`${className} dark:hidden`}
      />
      <Image
        src="/coffee-bean-dark.svg"
        alt=""
        width={12}
        height={12}
        className={`${className} hidden dark:block`}
      />
    </span>
  )
}

function formatViews(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + 'w'
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k'
  }
  return n.toString()
}

export default function ViewCounter({ path, variant = 'pill' }: ViewCounterProps) {
  const [displayViews, setDisplayViews] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [animClass, setAnimClass] = useState('')
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
    const controller = new AbortController()

    fetch(`/api/view?path=${encodeURIComponent(path)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.views !== undefined) {
          const realViews = data.views
          const startViews = Math.max(0, realViews - 1)
          setDisplayViews(startViews)

          // 延迟后开始滚动动画
          setTimeout(() => {
            setAnimClass('view-animating')
            const duration = 400
            const steps = 20
            const stepDuration = duration / steps
            let currentStep = 0

            const interval = setInterval(() => {
              currentStep++
              const progress = currentStep / steps
              // ease-out 缓动
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(startViews + (realViews - startViews) * eased)
              setDisplayViews(current)

              if (currentStep >= steps) {
                clearInterval(interval)
                setAnimClass('view-anim-done')
              }
            }, stepDuration)
          }, 500)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Failed to fetch views:', err)
        }
      })

    return () => {
      controller.abort()
    }
  }, [path])

  const content = mounted && displayViews !== null ? formatViews(displayViews) : null

  if (variant === 'plain') {
    return (
      <span
        suppressHydrationWarning
        className={`text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span ref={numRef} className={`view-counter-num ${animClass}`}>
          {content}
        </span>
      </span>
    )
  }

  if (variant === 'minimal') {
    return (
      <span
        suppressHydrationWarning
        className={`inline-flex items-center gap-1.5 text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CoffeeBeanIcon className="h-3 w-3" />
        <span className="tabular-nums">
          <span ref={numRef} className={`view-counter-num ${animClass}`}>
            {content}
          </span>
        </span>
      </span>
    )
  }

  return (
    <span
      suppressHydrationWarning
      className={`
        inline-flex items-center gap-2 rounded-full border border-neutral-200/60
        bg-neutral-50/60 px-2.5 py-0.5 text-xs
        text-neutral-500 dark:border-neutral-700/50 dark:bg-neutral-800/30 dark:text-neutral-400
        transition-all duration-500
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <CoffeeBeanIcon className="h-3 w-3" />
      <span className="font-medium tabular-nums">
        <span ref={numRef} className={`view-counter-num ${animClass}`}>
          {content}
        </span>
      </span>
    </span>
  )
}
