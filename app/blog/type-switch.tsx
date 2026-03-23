'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { clsx } from 'clsx'

type Category = 'tech' | 'inside' | 'daily'

function getCategoryFromPathname(pathname: string): Category {
  if (pathname === '/blog/daily') return 'daily'
  if (pathname === '/blog/inside') return 'inside'
  return 'tech'
}

export default function TypeSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const activeCategory = getCategoryFromPathname(pathname)

  const handleCategoryChange = useCallback((category: Category) => {
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
