'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { clsx } from 'clsx'

type Category = 'tech' | 'inside' | 'daily'

export default function TypeSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState<Category>('tech')

  useEffect(() => {
    if (pathname === '/blog/daily') {
      setActiveCategory('daily')
    } else if (pathname === '/blog/inside') {
      setActiveCategory('inside')
    } else {
      setActiveCategory('tech')
    }

    // Prefetch other categories
    router.prefetch('/blog')
    router.prefetch('/blog/inside')
    router.prefetch('/blog/daily')
  }, [pathname, router])

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category)
    let newPath = '/blog'
    if (category === 'daily') {
      newPath = '/blog/daily'
    } else if (category === 'inside') {
      newPath = '/blog/inside'
    }
    router.push(newPath)
  }, [router])

  return (
    <div className="mb-6">
      <div className="inline-flex rounded-full bg-black/80 dark:bg-neutral-800/80 p-0.25">
        <button
          onClick={() => handleCategoryChange('tech')}
          className={clsx(
            'px-2 py-0.5 text-xs font-medium transition-all',
            activeCategory === 'tech'
              ? 'bg-neutral-700 text-white dark:bg-neutral-600 dark:text-white rounded-full'
              : 'text-neutral-400 hover:text-neutral-300'
          )}
        >
          博客
        </button>
        <button
          onClick={() => handleCategoryChange('inside')}
          className={clsx(
            'px-2 py-0.5 text-xs font-medium transition-all',
            activeCategory === 'inside'
              ? 'bg-neutral-700 text-white dark:bg-neutral-600 dark:text-white rounded-full'
              : 'text-neutral-400 hover:text-neutral-300'
          )}
        >
          独白
        </button>
        <button
          onClick={() => handleCategoryChange('daily')}
          className={clsx(
            'px-2 py-0.5 text-xs font-medium transition-all',
            activeCategory === 'daily'
              ? 'bg-neutral-700 text-white dark:bg-neutral-600 dark:text-white rounded-full'
              : 'text-neutral-400 hover:text-neutral-300'
          )}
        >
          杂记
        </button>
      </div>
    </div>
  )
}
