'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const scrollToHeading = (text: string) => {
  const headingTag = document.getElementById(decodeURI(text))
  if (headingTag) {
    window.scrollTo({
      behavior: 'smooth',
      top: headingTag.offsetTop - 50,
    })
  }
}

export default function TOC({ headings }) {
  const [activeId, setActiveId] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-50px 0px -50% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(decodeURI(heading.id))
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    let rafId: number | null = null
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      const clampedProgress = Math.min(100, Math.max(0, progress))
      setReadingProgress(clampedProgress)

      if (clampedProgress >= 95) {
        setIsCompleted(true)
      } else if (clampedProgress < 85) {
        setIsCompleted(false)
      }
    }

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateProgress()
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <>
      {/* Mobile reading progress - top right corner */}
      <motion.div
        className="fixed right-4 top-4 z-20 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-6 w-6">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-500" />
            </motion.div>
          ) : (
            <>
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-neutral-200 dark:text-neutral-800"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${readingProgress}, 100`}
                  strokeLinecap="round"
                  className="text-neutral-600 dark:text-neutral-400 transition-all duration-150"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                {Math.round(readingProgress)}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Desktop TOC with reading progress */}
      <motion.div
        className="fixed left-0 top-[15%] z-10 hidden max-h-[75vh] overflow-y-auto p-4 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <ul className={'text-left'}>
          <motion.a
            href={`#`}
            onClick={() => setActiveId('')}
            className="mb-2 flex items-center gap-2 text-[15px] font-medium text-neutral-400 transition-colors hover:text-neutral-800 dark:text-neutral-600 dark:hover:text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>TOC</span>
            {isCompleted ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </motion.span>
            ) : (
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {Math.round(readingProgress)}%
              </span>
            )}
          </motion.a>
          {headings.map((heading, index) => (
            <motion.li
              key={index}
              className={`py-[1px] ${getIndentClass(heading.level)}`}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <a
                onClick={() => scrollToHeading(heading.id)}
                className={`cursor-pointer text-[13px] font-medium transition-colors hover:text-neutral-800 dark:hover:text-neutral-400 ${
                  activeId === heading.id
                    ? 'text-neutral-800 dark:text-neutral-400'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                {heading.text}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  )
}

function getIndentClass(level: number): string {
  switch (level) {
    case 2:
      return 'ml-0'
    case 3:
      return 'ml-2'
    case 4:
      return 'ml-4'
    case 5:
      return 'ml-6'
    default:
      return 'ml-8'
  }
}
