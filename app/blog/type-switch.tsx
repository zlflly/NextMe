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
      <div className="inline-flex gap-1 rounded-[50px] border-[1px] border-solid border-white/15 bg-stone-100 p-[3px] dark:border-stone-700/50 dark:bg-stone-800">
        <button
          onClick={() => handleCategoryChange('tech')}
          className={clsx(
            'rounded-3xl px-1 py-[2px] text-[10px] font-semibold transition-all duration-300',
            activeCategory === 'tech'
              ? 'bg-white text-black shadow-lg shadow-black/5 dark:bg-stone-700 dark:text-white dark:shadow-none'
              : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
          )}
        >
          博客
        </button>
        <button
          onClick={() => handleCategoryChange('inside')}
          className={clsx(
            'rounded-3xl px-1 py-[2px] text-[10px] font-semibold transition-all duration-300',
            activeCategory === 'inside'
              ? 'bg-white text-black shadow-lg shadow-black/5 dark:bg-stone-700 dark:text-white dark:shadow-none'
              : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
          )}
        >
          独白
        </button>
        <button
          onClick={() => handleCategoryChange('daily')}
          className={clsx(
            'rounded-3xl px-1 py-[2px] text-[10px] font-semibold transition-all duration-300',
            activeCategory === 'daily'
              ? 'bg-white text-black shadow-lg shadow-black/5 dark:bg-stone-700 dark:text-white dark:shadow-none'
              : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
          )}
        >
          杂记
        </button>
      </div>
    </div>
  )
}
