'use client'

import { cn } from 'lib/utils'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlogImage({
  src,
  alt,
  width,
  height,
  hex,
  delay = 300, // 进入视口后延迟开始加载的时间（毫秒）
  holdTime = 800, // 显示纯色背景保持的时间（毫秒）
}: {
  src: string
  alt: string
  width?: number
  height?: number
  hex?: string
  delay?: number
  holdTime?: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false) // 是否开始加载图片
  const [isFadingIn, setIsFadingIn] = useState(false) // 是否开始淡入
  const [isLoaded, setIsLoaded] = useState(false) // 图片是否加载完成
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            // 进入视口后延迟加载
            setTimeout(() => {
              setShouldLoad(true)
            }, delay)
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [delay, shouldLoad])

  // 纯色背景保持 holdTime 后开始淡入
  useEffect(() => {
    if (shouldLoad && !isFadingIn) {
      const timer = setTimeout(() => {
        setIsFadingIn(true)
      }, holdTime)
      return () => clearTimeout(timer)
    }
  }, [shouldLoad, isFadingIn, holdTime])

  // 淡入动画完成后标记加载完成
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  return (
    <>
      <div
        ref={imgRef}
        className={cn('relative h-full w-full', !isMobile && 'cursor-zoom-in')}
        onClick={() => !isMobile && setIsExpanded(true)}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: hex }}
        />
        {shouldLoad && (
          <img
            className={cn(
              'relative h-full w-full rounded-xl object-cover transition-all duration-1000 ease-out dark:brightness-75 dark:hover:brightness-100',
              !isFadingIn ? 'opacity-0' : isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            width={width}
            height={height}
            alt={alt}
            src={src}
            onLoad={handleImageLoad}
          />
        )}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
      </div>

      <AnimatePresence>
        {isExpanded && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-h-[80vh] max-w-[80vw] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}