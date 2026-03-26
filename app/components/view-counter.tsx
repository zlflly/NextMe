'use client'

import { useEffect, useState } from 'react'
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
  const [views, setViews] = useState<number | null>(null)
  const [displayViews, setDisplayViews] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

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
          const startViews = realViews - 1
          setViews(realViews)
          setDisplayViews(startViews)

          // 数字滚动动画
          const duration = 500
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out 缓动
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(startViews + (realViews - startViews) * eased)
            setDisplayViews(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          setTimeout(() => {
            requestAnimationFrame(animate)
          }, 300)
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

  if (variant === 'plain') {
    return (
      <span
        className={`text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {displayViews !== null ? formatViews(displayViews) : null}
      </span>
    )
  }

  if (variant === 'minimal') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CoffeeBeanIcon className="h-3 w-3" />
        <span className="tabular-nums">
          {displayViews !== null ? formatViews(displayViews) : null}
        </span>
      </span>
    )
  }

  return (
    <span
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
        {displayViews !== null ? formatViews(displayViews) : null}
      </span>
    </span>
  )
}
