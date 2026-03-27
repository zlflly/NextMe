'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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

interface RollingDigitProps {
  oldDigit: string
  newDigit: string
  animating: boolean
}

function RollingDigit({ oldDigit, newDigit, animating }: RollingDigitProps) {
  const isChanged = oldDigit !== newDigit

  if (!animating || !isChanged) {
    return <span className="digit-static">{newDigit}</span>
  }

  return (
    <span className="rolling-digit-wrapper">
      {/* 旧数字向上滚出 */}
      <motion.span
        className="digit rolling-digit-old"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {oldDigit}
      </motion.span>
      {/* 新数字从下滚入 */}
      <motion.span
        className="digit rolling-digit-new"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {newDigit}
      </motion.span>
    </span>
  )
}

function RollingNumber({
  oldValue,
  newValue,
  animating,
}: {
  oldValue: string
  newValue: string
  animating: boolean
}) {
  const maxLen = Math.max(oldValue.length, newValue.length)
  const oldPadded = oldValue.padStart(maxLen, ' ')
  const newPadded = newValue.padStart(maxLen, ' ')

  return (
    <span className="rolling-number">
      {newPadded.split('').map((digit, i) => (
        <RollingDigit
          key={i}
          oldDigit={oldPadded[i] || ' '}
          newDigit={digit}
          animating={animating}
        />
      ))}
    </span>
  )
}

export default function ViewCounter({ path, variant = 'pill' }: ViewCounterProps) {
  const [displayViews, setDisplayViews] = useState<number | null>(null)
  const [prevViews, setPrevViews] = useState<number | null>(null)
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
          const startViews = Math.max(0, realViews - 1)
          setPrevViews(startViews)
          setDisplayViews(startViews)

          // 延迟后开始数字滚动
          setTimeout(() => {
            const duration = 400
            const steps = 20
            const stepDuration = duration / steps
            let currentStep = 0

            const interval = setInterval(() => {
              currentStep++
              const progress = currentStep / steps
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(startViews + (realViews - startViews) * eased)
              setDisplayViews(current)

              if (currentStep >= steps) {
                clearInterval(interval)
                setIsAnimating(false)
              }
            }, stepDuration)

            setIsAnimating(true)
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
  const prevContent = mounted && prevViews !== null ? formatViews(prevViews) : null

  if (variant === 'plain') {
    return (
      <span
        suppressHydrationWarning
        className={`text-xs font-medium tabular-nums transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isAnimating && prevContent ? (
          <RollingNumber oldValue={prevContent} newValue={content!} animating={isAnimating} />
        ) : (
          content
        )}
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
          {isAnimating && prevContent ? (
            <RollingNumber oldValue={prevContent} newValue={content!} animating={isAnimating} />
          ) : (
            content
          )}
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
        {isAnimating && prevContent ? (
          <RollingNumber oldValue={prevContent} newValue={content!} animating={isAnimating} />
        ) : (
          content
        )}
      </span>
    </span>
  )
}
