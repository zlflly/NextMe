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
  const [isAnimating, setIsAnimating] = useState(false)

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
          // 确保起始值至少为 0
          const startViews = Math.max(0, realViews - 1)
          setViews(realViews)
          setDisplayViews(startViews)

          // 延迟后开始数字滚动动画，等 hydration 完全结束
          const timer = setTimeout(() => {
            setIsAnimating(true)
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
              } else {
                setIsAnimating(false)
              }
            }

            requestAnimationFrame(animate)
          }, 300)

          return () => clearTimeout(timer)
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

  // 初始状态（server 和 client hydration 时匹配）
  const initialContent = mounted && displayViews !== null ? formatViews(displayViews) : null

  if (variant === 'plain') {
    return (
      <span
        suppressHydrationWarning
        className={`text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {initialContent}
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
        <span className="tabular-nums">{initialContent}</span>
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
      <span className="font-medium tabular-nums">{initialContent}</span>
    </span>
  )
}
